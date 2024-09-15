import React, { useState, useRef, useEffect } from 'react';
import './GridGame.css'; // Import your custom styles

export const GridGame = ({ onGameOver, onRetry }) => {
    const [activeSquare, setActiveSquare] = useState(null);
    const [previousSquare, setPreviousSquare] = useState(null);
    const [waitingForInput, setWaitingForInput] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [message, setMessage] = useState('');
    const timeoutRef = useRef(null);
    const intervalRef = useRef(null);

    const generateRandomSquare = () => Math.floor(Math.random() * 9);

    // Start flashing a new square every 2 seconds
    const startFlashing = () => {
        intervalRef.current = setInterval(() => {
            if (gameOver) return;

            setActiveSquare(null); // Temporarily turn off the active square
            setTimeout(() => {
                const newSquare = generateRandomSquare();
                setPreviousSquare(activeSquare);
                setActiveSquare(newSquare);

                // Start the 2-second countdown for the player to react
                setWaitingForInput(true);
                timeoutRef.current = setTimeout(() => {
                    if (!gameOver && waitingForInput) {
                        setGameOver(true);
                        setMessage('You did not click match.');
                        onGameOver();
                    }
                }, 2000);
            }, 200); // Black flash duration (0.2 seconds)
        }, 2000); // Flash a new square every 2 seconds
    };

    useEffect(() => {
        startFlashing(); // Start the game when the component mounts
        return () => {
            clearInterval(intervalRef.current);
            clearTimeout(timeoutRef.current);
        };
    }, [gameOver]);

    // Handle the match button click
    const handleMatch = () => {
        if (!waitingForInput || gameOver) return;

        setWaitingForInput(false); // Stop waiting for input

        if (activeSquare === previousSquare) {
            // Correct match, continue flashing new squares
            setActiveSquare(null); // Turn off the active square to reset
        } else {
            // Incorrect match
            setGameOver(true);
            setMessage('That was not a match.');
            onGameOver();
        }
    };

    return (
        <div className="grid-game">
            <div className="grid-container">
                {[...Array(9)].map((_, index) => (
                    <div
                        key={index}
                        className={`grid-square ${activeSquare === index ? 'active' : ''}`}
                    />
                ))}
            </div>
            {!gameOver && waitingForInput && (
                <button onClick={handleMatch}>Match</button>
            )}
            {gameOver && (
                <div>
                    <p>{message}</p>
                    <button onClick={onRetry}>Retry the Entire Game</button>
                </div>
            )}
        </div>
    );
};





export default GridGame;

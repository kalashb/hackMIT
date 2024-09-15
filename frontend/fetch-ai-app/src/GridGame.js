import React, { useState, useRef, useEffect } from 'react';
import './GridGame.css'; // Import your custom styles

export const GridGame = ({ onGameOver }) => {
    const [waitingForInput, setWaitingForInput] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [message, setMessage] = useState('');
    const currentSquareRef = useRef(null);
    const previousSquareRef = useRef(null);
    const timeoutRef = useRef(null);
    const intervalRef = useRef(null);

    const generateRandomSquare = () => Math.floor(Math.random() * 4);

    // Start flashing a new square every 2 seconds
    const startFlashing = () => {
        intervalRef.current = setInterval(() => {
            if (gameOver) return;

            // Flash a new square every 2 seconds
            const previousSquare = currentSquareRef.current;
            const newSquare = generateRandomSquare();

            // Set the new square and update refs
            previousSquareRef.current = previousSquare;
            currentSquareRef.current = newSquare;

            // Trigger a flash effect by adding a CSS class
            document.querySelectorAll('.grid-square').forEach((element, index) => {
                element.classList.remove('flash'); // Remove flash class
                if (index === newSquare) {
                    element.classList.add('flash'); // Add flash class to the current square
                }
            });

            // Start the 2-second countdown for player response
            setWaitingForInput(true);
            timeoutRef.current = setTimeout(() => {
                if (waitingForInput) {
                    setMessage(`You did not click match. Last Square: ${previousSquare}, Current Square: ${newSquare}`);
                    setGameOver(true);
                    onGameOver();
                }
            }, 2000); // 2 seconds to respond

        }, 2000); // Flash a new square every 2 seconds
    };

    useEffect(() => {
        startFlashing(); // Start the game when the component mounts
        return () => {
            clearInterval(intervalRef.current);
            clearTimeout(timeoutRef.current);
        };
    }, [gameOver]);

    const handleMatch = () => {
        if (!waitingForInput || gameOver) return;

        setWaitingForInput(false); // Stop waiting for input

        if (currentSquareRef.current === previousSquareRef.current) {
            // Correct match, continue flashing new squares
        } else {
            // Incorrect match
            setMessage(`That was not a match. Last Square: ${previousSquareRef.current}, Current Square: ${currentSquareRef.current}`);
            setGameOver(true);
            onGameOver();
        }
    };

    return (
        <div className="grid-game">
            <div className="grid-container">
                {[...Array(4)].map((_, index) => (
                    <div
                        key={index}
                        className={`grid-square ${currentSquareRef.current === index ? 'active' : ''}`}
                    />
                ))}
            </div>
            {!gameOver && waitingForInput && (
                <button onClick={handleMatch}>Match</button>
            )}
            {gameOver && (
                <div>
                    <p className="error-message">{message}</p> {/* Apply custom CSS class */}
                </div>
            )}
        </div>
    );
};

export default GridGame;

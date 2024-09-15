import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import GridGame from './GridGame.js';




const App = () => {
  const [gameState, setGameState] = useState('welcome');
  const [started, setStarted] = useState(false);
  const [blockPositions, setBlockPositions] = useState([]);
  const [flashOrder, setFlashOrder] = useState([]);
  const [playerOrder, setPlayerOrder] = useState([]);
  const [iteration, setIteration] = useState(1);
  const [isFlashing, setIsFlashing] = useState(false);
  const [retryAvailable, setRetryAvailable] = useState(false);
  const [retryAttempted, setRetryAttempted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);

  const blockRefs = useRef([]);

  const generateBlockPositions = (num) => {
    const isOverlapping = (pos, positions) => {
      return positions.some((existingPos) => {
        return (
          pos.left < existingPos.left + 20 &&
          pos.left + 20 > existingPos.left &&
          pos.top < existingPos.top + 20 &&
          pos.top + 20 > existingPos.top
        );
      });
    };

    let positions = [];
    while (positions.length < num) {
      const randomX = Math.floor(Math.random() * (400 - 20));
      const randomY = Math.floor(Math.random() * (400 - 20));
      const newPosition = { top: randomY, left: randomX };

      if (!isOverlapping(newPosition, positions)) {
        positions.push(newPosition);
      }
    }

    return positions;
  };

  const generateFlashOrder = (num) => {
    let order = [];
    for (let i = 0; i < num; i++) {
      order.push(i);
    }
    return order.sort(() => Math.random() - 0.5);
  };

  const handleStart = () => {
    setStarted(true);
    setGameState('firstGame');
    startIteration(iteration);
  };

  const startIteration = (level) => {
    const newPositions = generateBlockPositions(level);
    const newFlashOrder = generateFlashOrder(level);
    setBlockPositions(newPositions);
    setFlashOrder(newFlashOrder);
    setPlayerOrder([]);
    setRetryAvailable(false);
    setRetryAttempted(false);
    setGameEnded(false);
    blockRefs.current = new Array(level).fill(null).map(() => React.createRef());
    flashBlocks(newFlashOrder);
  };

  const flashBlocks = (order) => {
    setIsFlashing(true);
    order.forEach((blockIndex, i) => {
      setTimeout(() => {
        const block = blockRefs.current[blockIndex]?.current;
        if (block) {
          block.classList.add('flashed');
          setTimeout(() => {
            block.classList.remove('flashed');
          }, 300);
        }
      }, i * 500);
    });
    setTimeout(() => {
      setIsFlashing(false);
    }, order.length * 500);
  };

  const handleBoxClick = (index) => {
    if (isFlashing || gameEnded) return;

    const block = blockRefs.current[index]?.current;
    if (block) {
      block.classList.add('flashed');
      setTimeout(() => {
        block.classList.remove('flashed');
      }, 300);
    }

    const newPlayerOrder = [...playerOrder, index];
    setPlayerOrder(newPlayerOrder);

    if (newPlayerOrder[newPlayerOrder.length - 1] !== flashOrder[newPlayerOrder.length - 1]) {
      if (retryAvailable && !retryAttempted) {
        setRetryAttempted(true);
      } else {
        setGameEnded(true);
      }
    } else if (newPlayerOrder.length === flashOrder.length) {
      if (retryAttempted) {
        setGameEnded(true);
      } else {
        setTimeout(() => handleNext(), 500);
      }
    }
  };

  const handleNext = () => {
    if (gameEnded) return;
    setIteration(iteration + 1);
    startIteration(iteration + 1);
  };

  const handleRetry = () => {
    if (retryAvailable && !retryAttempted && !gameEnded) {
      startIteration(iteration);
      setRetryAttempted(true);
    }
  };

  const handleRestart = () => {
    setStarted(false);
    setIteration(1);
    setRetryAvailable(false);
    setRetryAttempted(false);
    setGameEnded(false);
    setGameState('welcome');
  };

  const handleNextMinigame = () => {
    setGameState('gridGame');
  };

  const handleGridGameOver = () => {
    setGameEnded(true);
  };

  const handleRetryEntireGame = () => {
    handleRestart();
  };

  return (
    <div className="container">
      {gameState === 'welcome' && (
        <div className="start-text" onClick={handleStart}>
          Welcome to the first game. <br />
          Instructions: the blocks will flash in a specified order. <br />
          Once they are finished flashing, click them in the order they appeared. <br />
          The number of blocks to memorize will increase by one each iteration. <br />
          You will have one (1) chance to do an iteration. :))
          Enjoy. :)
        </div>
      )}
      {gameState === 'firstGame' && (
        <>
          {gameEnded ? (
            <div className="end-screen">
              <div className="end-message">
                Game Over! <br />
                You completed {iteration - 1} iteration(s).
              </div>
              <button className="restart-button" onClick={handleNextMinigame}>
                Next Minigame
              </button>
            </div>
          ) : (
            <div className="square">
              {blockPositions.map((pos, index) => (
                <div
                  key={index}
                  ref={blockRefs.current[index]}
                  className="white-box"
                  style={{ top: `${pos.top}px`, left: `${pos.left}px` }}
                  onClick={() => handleBoxClick(index)}
                />
              ))}
              {retryAvailable && !retryAttempted && (
                <button className="retry-button" onClick={handleRetry}>
                  Last Attempt
                </button>
              )}
            </div>
          )}
        </>
      )}
      {gameState === 'gridGame' && (
        <GridGame
          onGameOver={handleGridGameOver}
          onRetry={handleRetryEntireGame}
        />
      )}
    </div>
  );
};

export default App;
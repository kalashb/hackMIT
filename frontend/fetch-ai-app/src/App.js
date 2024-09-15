import React, { useState, useRef } from 'react';
import './App.css';

const App = () => {
  const [started, setStarted] = useState(false);
  const [blockPositions, setBlockPositions] = useState([]);
  const [flashOrder, setFlashOrder] = useState([]);
  const [playerOrder, setPlayerOrder] = useState([]);
  const [iteration, setIteration] = useState(1);
  const [isFlashing, setIsFlashing] = useState(false);
  const [retryAvailable, setRetryAvailable] = useState(false); // Track if retry is available
  const [retryAttempted, setRetryAttempted] = useState(false); // Track if retry has been attempted
  const [gameEnded, setGameEnded] = useState(false);

  // Create refs for each block
  const blockRefs = useRef([]);

  // Generate random block positions and store them
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

  // Generate random flashing order for blocks
  const generateFlashOrder = (num) => {
    let order = [];
    for (let i = 0; i < num; i++) {
      order.push(i);
    }
    return order.sort(() => Math.random() - 0.5);
  };

  const handleStart = () => {
    setStarted(true);
    startIteration(iteration);
  };

  const startIteration = (level) => {
    const newPositions = generateBlockPositions(level);
    const newFlashOrder = generateFlashOrder(level);
    setBlockPositions(newPositions);
    setFlashOrder(newFlashOrder);
    setPlayerOrder([]);
    setRetryAvailable(false); // Reset retry availability
    setRetryAttempted(false); // Reset retry attempt tracking
    setGameEnded(false);
    blockRefs.current = new Array(level).fill(null).map(() => React.createRef()); // Reset refs
    flashBlocks(newFlashOrder);
  };

  // Flash blocks in the randomized order
  const flashBlocks = (order) => {
    setIsFlashing(true);
    order.forEach((blockIndex, i) => {
      setTimeout(() => {
        const block = blockRefs.current[blockIndex]?.current;
        if (block) {
          block.classList.add('flashed');
          setTimeout(() => {
            block.classList.remove('flashed');
          }, 300); // Reduced flash duration
        }
      }, i * 500); // Reduced flash interval
    });
    setTimeout(() => {
      setIsFlashing(false);
    }, order.length * 500);
  };

  // Handle when the player clicks a block
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

    // Check if player's order matches the flash order so far
    if (newPlayerOrder[newPlayerOrder.length - 1] !== flashOrder[newPlayerOrder.length - 1]) {
      if (retryAvailable && !retryAttempted) {
        setRetryAttempted(true); // Mark that retry has been attempted
        // Do not end game immediately, allow for retry
      } else {
        setGameEnded(true); // End game if retry is not available or retry has been attempted
      }
    } else if (newPlayerOrder.length === flashOrder.length) {
      if (retryAttempted) {
        setGameEnded(true); // End game if retry was attempted and correct order
      } else {
        setTimeout(() => handleNext(), 500); // Proceed to next iteration if the order was correct
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
      startIteration(iteration); // Retry the current iteration
      setRetryAttempted(true); // Mark that retry has been attempted
    }
  };

  const handleRestart = () => {
    setStarted(false);
    setIteration(1); // Reset iteration to 1 when the game restarts
    setRetryAvailable(false); // Reset retry availability
    setRetryAttempted(false); // Reset retry attempt tracking
    setGameEnded(false); // Ensure gameEnded state is reset
  };

  return (
    <div className="container">
      {!started ? (
        <div className="start-text" onClick={handleStart}>
          Welcome to the first game. <br />
          Instructions: the blocks will flash in a specified order. <br />
          Once they are finished flashing, click them in the order they appeared. <br />
          The number of blocks to memorize will increase by one each iteration. <br />
          You will have one (1) chance to do an iteration. :))
          Enjoy. :)
        </div>
      ) : gameEnded ? (
        <div className="end-screen">
          <div className="end-message">
            Game Over! <br />
            You completed {iteration - 1} iteration(s).
          </div>
          <button className="restart-button" onClick={handleRestart}>
            Restart Game
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
          {retryAvailable && !retryAttempted ? (
            <button className="retry-button" onClick={handleRetry}>
              Last Attempt
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default App;

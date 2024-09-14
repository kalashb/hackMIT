import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [started, setStarted] = useState(false);
  const [blockPositions, setBlockPositions] = useState([]);
  const [flashOrder, setFlashOrder] = useState([]);
  const [playerOrder, setPlayerOrder] = useState([]);
  const [iteration, setIteration] = useState(1);
  const [isFlashing, setIsFlashing] = useState(false);
  const [retry, setRetry] = useState(false);
  const [failedOnce, setFailedOnce] = useState(false);

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
  
      // Check if the new position overlaps any existing position
      if (!isOverlapping(newPosition, positions)) {
        positions.push(newPosition); // Only add the block if no overlap
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
    return order.sort(() => Math.random() - 0.5); // Shuffle array to randomize order
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
    setRetry(false);
    setFailedOnce(false);
    flashBlocks(newFlashOrder);
  };

  // Flash blocks in the randomized order
  const flashBlocks = (order) => {
    setIsFlashing(true);
    order.forEach((blockIndex, i) => {
      setTimeout(() => {
        document.getElementById(`block-${blockIndex}`).classList.add('flashed');
        setTimeout(() => {
          document.getElementById(`block-${blockIndex}`).classList.remove('flashed');
        }, 500);
      }, i * 1000);
    });
    setTimeout(() => {
      setIsFlashing(false); // Flashing ends after the sequence
    }, order.length * 1000);
  };

  // Handle when the player clicks a block
  const handleBoxClick = (index) => {
    if (isFlashing || retry) return; // Don't allow clicks during flashing or retries

    // Temporarily flash the block when clicked
  document.getElementById(`block-${index}`).classList.add('flashed');
  setTimeout(() => {
    document.getElementById(`block-${index}`).classList.remove('flashed');
  }, 500);


    setPlayerOrder([...playerOrder, index]);

    // Check if player clicked correctly up to this point
    if (index !== flashOrder[playerOrder.length]) {
      if (failedOnce) {
        setRetry(false);
        setFailedOnce(false);
      } else {
        setRetry(true);
        setFailedOnce(true);
      }
    } else if (playerOrder.length + 1 === flashOrder.length) {
      // Player completed the sequence correctly
      setTimeout(() => handleNext(), 500);
    }
  };

  const handleNext = () => {
    setIteration(iteration + 1);
    startIteration(iteration + 1);
  };

  const handleRetry = () => {
    startIteration(iteration);
  };

  return (
    <div className="container">
      {!started ? (
        <div className="start-text" onClick={handleStart}>
          Click here to start
        </div>
      ) : (
        <div className="square">
          {blockPositions.map((pos, index) => (
            <div
              key={index}
              id={`block-${index}`}
              className="white-box"
              style={{ top: `${pos.top}px`, left: `${pos.left}px` }}
              onClick={() => handleBoxClick(index)}
            />
          ))}
          {retry ? (
            failedOnce ? (
              <button className="retry-button" onClick={handleRetry}>
                Last Attempt
              </button>
            ) : (
              <button className="retry-button" onClick={handleRetry}>
                Retry
              </button>
            )
          ) : failedOnce && (
            <button className="end-button">End Corsi, On to the Next Test</button>
          )}
        </div>
      )}
    </div>
  );
};

export default App;

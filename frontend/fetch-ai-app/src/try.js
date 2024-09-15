import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  // ... (keep all existing state and functions)

  const sendTestData = async (correct) => {
    const data = {
      iteration: iteration,
      block_positions: blockPositions,
      flash_order: flashOrder,
      player_order: playerOrder,
      correct: correct
    };

    try {
      const response = await fetch('http://localhost:8000/submit_data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      console.log('Data sent:', result);
    } catch (error) {
      console.error('Error sending data:', error);
    }
  };

  const analyzeResults = async () => {
    try {
      const response = await fetch('http://localhost:8000/analyze');
      const data = await response.json();
      console.log('Analysis:', data.analysis);
      // You can display this analysis to the user
      alert(data.analysis);
    } catch (error) {
      console.error('Error analyzing results:', error);
    }
  };

  // Modify the handleBoxClick function to send data when the sequence is complete
  const handleBoxClick = (index) => {
    // ... (keep existing code)

    if (playerOrder.length + 1 === flashOrder.length) {
      // Player completed the sequence
      const correct = playerOrder.every((val, idx) => val === flashOrder[idx]);
      sendTestData(correct);
      setTimeout(() => handleNext(), 500);
    }
  };

  // Add a button to trigger analysis
  return (
    <div className="container">
      {/* ... (keep existing JSX) */}
      {started && (
        <button className="analyze-button" onClick={analyzeResults}>
          Analyze Results
        </button>
      )}
    </div>
  );
};

export default App;
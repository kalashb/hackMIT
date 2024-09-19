import React, { useState } from 'react';

const TestComponent = () => {
  const [timeTaken, setTimeTaken] = useState(null);
  const [accuracy, setAccuracy] = useState(null);

  const handleSubmit = () => {
    const testResults = {
      timeTaken: timeTaken,
      accuracy: accuracy
    };

    // Send the JSON data to the backend here
    console.log("Test Results:", JSON.stringify(testResults));
  };

  return (
    <div>
      <h1>Test Component</h1>
      <button onClick={handleSubmit}>Submit Test</button>
    </div>
  );
};

export default TestComponent;

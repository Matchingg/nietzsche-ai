import React, { useState } from "react";

const App = () => {
  const instructions =
    "Simulate readings of Friedrich Nietzsche by generating text that are just as incomprehensible as his own writings!";

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState("");
  const [result, setResult] = useState(instructions);

  const handleChange = (event) => {
    const value = event.target.value;
    setData(value);
  };

  const handlePredictClick = (event) => {
    setIsLoading(true);
    fetch("/completion", {
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => {
        setResult(data);
        setIsLoading(false);
      });
  };

  return (
    <>
      <h1 className="heading">Nietzsche AI</h1>
      {result && (
        <div key={result} className="result">
          {result}
        </div>
      )}
      <div className="container">
        <input
          type="text"
          onChange={handleChange}
          placeholder="Input starting text"
          className="text_input"
        />
        <button
          disabled={isLoading}
          onClick={!isLoading ? () => handlePredictClick() : null}
          className="button"
        >
          {isLoading ? "Making prediction" : "Predict"}
        </button>
      </div>
    </>
  );
};

export default App;

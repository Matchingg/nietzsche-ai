import React, { useState } from "react";

const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState("");
  const [result, setResult] = useState("");

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
    <div>
      <h1>Nietzsche AI</h1>
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
      {result && <div>{result}</div>}
    </div>
  );
};

export default App;

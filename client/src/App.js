import React, { useState } from "react";
import axios from "axios";

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
    axios
      .post(
        "https://nietzsche-ai.herokuapp.com/completion",
        {
          string: data,
        },
        { timeout: 10000 }
      )
      .then((res) => {
        setResult(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        setResult("Nietzsche AI needs rest too! Try again later :(");
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
          disabled={isLoading || !data}
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

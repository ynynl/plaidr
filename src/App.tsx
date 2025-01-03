import React from "react";
import Main from "./components/Main";
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <div className="App-container">
        <main className="App-main">
          <Main />
        </main>
      </div>
      <footer className="App-footer">
        <a href="https://github.com/ynynl/plaidr" target="_blank" rel="noreferrer">
          <h4>a random plaid generator, made by ynynl</h4>
        </a>
      </footer>
    </div>
  );
};

export default App; 
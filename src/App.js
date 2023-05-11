import Plaidr from "./components/Plaidr";
import './App.css'

function App() {
  return (
    <div className="App">
      <div className="App-container">
        <header className="App-header">
          <h1>plaidr</h1>
          <a href="https://github.com/ynynl/plaidr">
            <h4>Github</h4>
          </a>
        </header>
        <main className="App-main">
          <Plaidr />
        </main>
      </div>
      <footer className="App-footer">
        <a href="https://github.com/ynynl">
          <h4>plaidr by ynynl</h4>
        </a>
      </footer>
    </div>
  );
}

export default App;

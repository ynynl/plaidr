import Plaidr from "./components/Plaidr";
import './App.css'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>plaider</h1>
        <a  href="https://github.com/ynynl">
          <h4>Github</h4>
        </a>
      </header>
      <main className="App-main">
        <Plaidr />
      </main>
    </div>
  );
}

export default App;

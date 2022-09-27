import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { Link } from "react-router-dom";
import OtherPage from './OtherPage';
import Fib from './Fib';

function App() {
  return (
      <div className="App">
        <div>
        <header className="App-header">
          <Link className = "link" to="/otherpage">Other Page</Link>
          <Link className="link"  to={"/"}>Fibonacci</Link>
        </header>
          <Routes>
            <Route
              path="/otherpage"
              element={<div><OtherPage /></div>}
              />
            <Route path="/"
                element={<Fib/>}
                />
          </Routes>
        </div>
      </div>
  );
}

export default App;

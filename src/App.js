import React from 'react';
import './App.css';
import { Login } from './Components/Login';
import { Chat } from './Components/Chat';
import { Route, BrowserRouter as Router } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <Route path="/" component={Login} />
        <Route path="/chat" component={Chat} />
      </div>
    </Router>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './components/Home';
import Create from './components/Create';
import Explore from './components/Explore';
import './App.css';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/create" component={Create} />
        <Route path="/explore" component={Explore} />
      </Switch>
    </Router>
  );
};

export default App;

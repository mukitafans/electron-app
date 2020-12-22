import React from 'react';
import logo from './logo.svg';
import './App.css';

import Dashboard from './layouts/Dashboard.jsx';
import Login from './layouts/Login.jsx';

import { BrowserRouter, Switch, Route } from 'react-router-dom';


const App = () => (
  <div className="App">
    <BrowserRouter>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/" component={Dashboard} />
      </Switch>
    </BrowserRouter>
  </div>
);

export default App;

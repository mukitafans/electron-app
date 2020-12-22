import React from 'react';
import logo from './logo.svg';
import './App.css';
import "antd/dist/antd.css";
import Dashboard from './layouts/Dashboard.jsx';
import Login from './layouts/Login.jsx';

import { BrowserRouter, Switch, Route } from 'react-router-dom';


const App = () => (
  <div className="App">
    <BrowserRouter>
      <Switch>
        {/* PARA HACER PRUEBAS CAMBIAR EL ORDEN */}
        <Route path="/" component={Dashboard} />
        <Route path="/login" component={Login} />
       
      </Switch>
    </BrowserRouter>
  </div>
);

export default App;

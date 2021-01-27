import React from 'react';
import logo from './logo.svg';
import './App.css';
import "antd/dist/antd.css";
import Dashboard from './layouts/Dashboard.jsx';
import Login from './layouts/Login.jsx';
//import Login from './layouts/DashboardLogin.jsx';

import localizaciones from './components/CrudLocalizaciones';
import preguntas from './components/CrudPreguntas';
import usuarios from './components/CrudUsuarios';
import ranking from './components/CrudRanking';
import { BrowserRouter, Switch, Route } from 'react-router-dom';


const App = () => (
  
  <div className="App">
    <BrowserRouter>
      <Switch>
        {/* PARA HACER PRUEBAS CAMBIAR EL ORDEN */}
        <Route path="/" component={Dashboard} />
        <Route path="/login" component={Login} />
        
        <Route path="/localizaciones" component={localizaciones} />
        <Route path="/preguntas" component={preguntas} />
        <Route path="/ranking" component={ranking} />
        <Route path="/usuarios" component={usuarios} />
      </Switch>
    </BrowserRouter>
  </div>
);

export default App;

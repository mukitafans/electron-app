import React, { Component } from 'react';

import Map from '../views/Map.jsx';
//import logoCmobile from './../../assets/img/c_mobile.png';
import logo from '../assets/img/logo.png';
import menuIcon from '../assets/img/Menuicon.png';
import { Location, redirectTo } from '@reach/router'
import { Redirect, Link } from 'react-router-dom';

import { Layout, Menu, Button, Drawer } from 'antd';

import { authenticationService } from '../services/authentication.service.js';





class CrudRanking extends Component{
    constructor(props) {
        super(props);
        this.state = {
            //logged: true,
            //visible: false
        };
    }

    render(){
        return(
            <div>ranking</div>
        );
    }


}

export default CrudRanking;
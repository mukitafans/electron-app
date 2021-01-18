import React, { Component } from 'react';

import Map from '../views/Map.jsx';
import Localizaciones from '../components/CrudLocalizaciones.jsx';
import Login from './Login.jsx';
//import logoCmobile from './../../assets/img/c_mobile.png';
import logo from '../assets/img/logo.png';
import menuIcon from '../assets/img/Menuicon.png';
import { Location, redirectTo } from '@reach/router'
import {BrowserRouter as Router, Redirect, Link, Switch, Route } from 'react-router-dom';

import { Layout, Menu, Button, Drawer } from 'antd';

import { authenticationService } from '../services/authentication.service.js';
//import { Router } from 'express';

const { Header, Content } = Layout;

const routes = [
    {
      path: "/",
      exact: true,
      main: () => <Login/>
    },
    {
      path: "/localizaciones",
      main: () => <Localizaciones/>
    },
    {
      path: "/login",
      main: () => <Login/>
    },
    {
        path: "/todo",
        main: () => <Map/>
      }
  ];


class DashboardLogin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            logged: true,
            visible: false
        };
    }

    componentDidMount() {
       // this.setState({ logged: authenticationService.loginValid() })
    }

    renderRedirect = () => {
       /* if (!this.state.logged) {
            return <Redirect to='/' />
        }*/
    }

    exit = () => {
        authenticationService.logout();
        this.setState({ logged: authenticationService.loginValid() })
    }


    //funciones para el drawer
    showDrawer = () => {
        this.setState({
          visible: true,
        });
      };
    
      onClose = () => {
        this.setState({
          visible: false,
        });
      };



    render() {
        return (
            <Router>
                   {/* MENU DRAWER (desplegable) */}
                   <div>    
                    
                </div>
                        

                <Layout className="layout" style={{ minHeight: '1vh', background: '#fff' }}>
                {this.renderRedirect()}
                <Header style={{ background: '#33A8FF', padding: 0 }} >

                    <div className="logo" >
                    </div>
                    
                    <div className="logout" style={{ alignItems: "center", marginRight: "10px" }}>
                        {/*<Button type="danger" ghost icon="poweroff" size="small" onClick={this.exit}>Log out</Button> */}
                    </div>
                    <Location>
                        {props => {
                            return (
                                <Menu selectedKeys={[props.location.pathname]} theme="default" mode="horizontal" style={{ lineHeight: '64px' }}>
                                </Menu>
                            );
                        }}
                    </Location>

                </Header>
                
                {/*<Footer style={{ textAlign: 'center' }}>C-Mobile ©2019 Created by CEIT</Footer>*/}
            </Layout>
                <Content>
                    <div style={{ background: '#666666', minHeight: "calc(100vh - 71px)" }}>
                        {/*<Map />*/}
                        <Switch>
                            {routes.map((route, index) => (
                            // Render more <Route>s with the same paths as
                            // above, but different components this time.
                            <Route
                                key={index}
                                path={route.path}
                                exact={route.exact}
                                children={<route.main />}
                            />
                            ))}
                        </Switch>
                 
                    </div>
                </Content>
            </Router>
            
            
        );
    }
}


export default DashboardLogin;
import React, { Component } from 'react';

import Map from '../views/Map.jsx';
import Localizaciones from '../components/CrudLocalizaciones.jsx';
import Preguntas from '../components/CrudPreguntas.jsx';

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
        path: "/login",
        main: () => <Login/>
      },
    {
        path: "/",
        exact: true,
        main: () => <Map/>
    },
    {
        path: "/localizaciones",
        main: () => <Localizaciones/>
    },
    {
        path: "/preguntas",
        main: () => <Preguntas/>
    }
    
  ];


class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            logged: true,
            visible: false
        };
    }

    componentDidMount() {
        this.setState({ logged: authenticationService.loginValid() })
    }

    renderRedirect = () => {
        if (!this.state.logged) {
            return <Redirect to='/login' />
        }
    }

    exit = () => {
        authenticationService.logout();
        this.setState({ logged: authenticationService.loginValid() })
    }
    signOut = () => {
        localStorage.removeItem("token");
        this.setState({
          islogout: true
        });
      };


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
                <Layout className="layout" style={{ minHeight: '1vh', background: '#fff' }}>

                   {/* MENU DRAWER (desplegable) */}
                   <div>    
                    <Drawer
                    title="Opciones"
                    placement="left"
                    closable={false}
                    onClose={this.onClose}
                    visible={this.state.visible}
                    >
                        <Button style={{padding:'0px'}} type="primary" block>
                            <Link to="/login">login pruebas</Link>       
                        </Button>
                        <Button style={{padding:'0px'}} type="primary" block>
                            <Link to="/">Mapa de rutas</Link>       
                        </Button>
                        <Button style={{marginTop:'10px'}} type="primary" block>
                            <Link to="/localizaciones">Lista de rutas</Link>       
                        </Button>
                        <Button style={{marginTop:'10px'}}  type="primary" block>
                            <Link to="/usuarios">Perfiles de usuario</Link>                    
                        </Button>
                        <Button style={{marginTop:'10px'}} type="primary" block>
                            <Link to="/preguntas">Preguntas de las rutas</Link>                    
                        </Button>
                        <Button style={{marginTop:'10px'}} type="danger" block onClick={this.signOut}>
                        Logout
                        </Button>
                   
                    </Drawer>
                </div>
                        

                {this.renderRedirect()}
                <Header style={{ background: '#33A8FF', padding: 0 }} >

                 
                    <Button onClick={this.showDrawer} style={{width:'50px', position: 'fixed', marginLeft:'-49%', marginTop: '18px'}} block><img src={menuIcon} style={{ height: "50%", width: "100%"}} /></Button>

                    <div className="logo" >
                        <img src={logo} alt="Logo" style={{ height: "2%", width: "2%", marginLeft: "10px" }} />
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


export default Dashboard;
import React, { Component } from 'react';

import Map from '../views/Map.jsx';
//import logoCmobile from './../../assets/img/c_mobile.png';
import logo from '../assets/img/logo.png';
import menuIcon from '../assets/img/Menuicon.png';
import { Location } from '@reach/router'
import { Redirect, Link } from 'react-router-dom';

import { Layout, Menu, Button, Drawer } from 'antd';

import { authenticationService } from '../services/authentication.service.js';

const { Header, Content } = Layout;

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
            <Layout className="layout" style={{ minHeight: '100vh', background: '#fff' }}>
                {this.renderRedirect()}
                <Header style={{ background: '#33A8FF', padding: 0 }} >

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
                        <Link to="/">Lista de rutas</Link>       
                    </Button>
                    <br></br>
                    <Button style={{marginTop:'10px'}}  type="primary" block>
                    
                        <Link to="/login">Perfiles de usuario</Link>                    
                    </Button>
                    <Button style={{marginTop:'10px'}} type="primary" block>
                    Preguntas de las rutas
                    </Button>
                    <Button style={{marginTop:'10px'}} type="danger" block>
                    Logout
                    </Button>
                    </Drawer>
                </div>





                    <Button onClick={this.showDrawer} style={{width:'50px', position: 'fixed', marginLeft:'-49%', marginTop: '18px'}} block><img src={menuIcon} style={{ height: "50%", width: "100%"}} /></Button>

                    <div className="logo" >
                        <img src={logo} alt="Logo" style={{ height: "2%", width: "2%", marginLeft: "10px" }} />
                    </div>

                    <div className="logout" style={{ alignItems: "center", marginRight: "10px" }}>
                        <Button type="danger" ghost icon="poweroff" size="small" onClick={this.exit}>Log out</Button>
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
                <Content>
                    <div style={{ background: '#666666', minHeight: "calc(100vh - 71px)" }}>
                        <Map />
                    </div>
                </Content>
                {/*<Footer style={{ textAlign: 'center' }}>C-Mobile ©2019 Created by CEIT</Footer>*/}
            </Layout>
        );
    }
}


export default Dashboard;
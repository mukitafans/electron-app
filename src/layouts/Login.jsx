import React, { Component } from 'react';

import { Redirect, Link } from 'react-router-dom';

import { Form, Icon, Input, Button, Layout, Row, Col, Alert } from 'antd';
import { authenticationService } from '../services/authentication.service.js';

import logo from '../assets/img/logo.png';

const { Header, Content, Footer } = Layout;

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            loginFail: false,
            failText: "",
            islogged: false,
            loginParams: {
              user_id: "",
              user_password: ""
            }
        };
    }
    componentDidMount() {
        this.setState({ redirect: authenticationService.loginValid() })
    }

    sendLogin = () => {
        this.setState({ redirect: true })
    }

    renderRedirect = () => {
        if (this.state.redirect) {
            return <Redirect to='/' />
        }
    }


    //Send login request
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                authenticationService.login(values.username, values.password)
                    .then(response => {
                        if (response.error) this.setState({ loginFail: true, failText: response.error })
                        else this.sendLogin();
                    });
            }
        });
        /**/
    };

    //On change name or pass
    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }

    //NEW PARA LOGIN CINCELADO
    handleFormChange = event => {
        let loginParamsNew = { ...this.state.loginParams };
        let val = event.target.value;
        loginParamsNew[event.target.name] = val;
        this.setState({
          loginParams: loginParamsNew
        });
      };
     
      login = event => {
        let user_id = this.state.loginParams.user_id;
        let user_password = this.state.loginParams.user_password;
        if (user_id === "admin" && user_password === "admin") {
          localStorage.setItem("token", "T");
          this.setState({
            islogged: true
          });
        }
        event.preventDefault();
      };



    render() {
        const { loginFail, failText } = this.state;
        const { getFieldDecorator } = this.props.form;
        if (localStorage.getItem("token")) {
            return <Redirect to="/" />;
        }
        return (
            <div>
                {this.state.redirect ? <Redirect to='/' /> :
                    <Layout className="layout" style={{ minHeight: '100vh', background: '#fff' }}>
                        <Header style={{ background: '#33A8FF', padding: 0 }} >
                            <h1>IDI Maps</h1>
                            
                        </Header>
                        <Content>
                            <Row style={{ background: '#fff', minHeight: "calc(100vh - 140px)" }} type="flex" justify="space-around" align="middle">
                                <Col sm={24} md={12} lg={6} xl={6} style={{ textAlign: "center" }}>
                                   {/*<Form onSubmit={this.handleSubmit} className="login-form" style={{ padding: 24 }}>*/} 
                                   <Form onSubmit={this.login} className="login-form" style={{ padding: 24 }}>
                                        <img src={logo} alt="Logo" style={{ height: "20vh", marginBottom: "20px" }} />
                                        <Form.Item>

                                            {getFieldDecorator('username', {
                                                rules: [{ required: true, message: 'Please input your username!' }],
                                            })(
                                                <Input
                                                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                                    placeholder="Introduce el usuario"
                                                    onChange={this.handleFormChange}
                                                    name="user_id"
                                                />,
                                            )}
                                        </Form.Item>
                                        <Form.Item>
                                            {getFieldDecorator('password', {
                                                rules: [{ required: true, message: 'Please input your Password!' }],
                                            })(
                                                <Input
                                                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                                    type="password"
                                                    onChange={this.handleFormChange}
                                                    placeholder="Introduce la contraseña"
                                                    name="user_password"
                                                />,
                                            )}

                                        </Form.Item>
                                        <Form.Item>
                                            <Button type="primary" htmlType="submit" className="login-form-button" >
                                                Entrar
                                        </Button>
                                            {loginFail &&
                                                <Alert
                                                    message={failText}
                                                    type="error"
                                                    showIcon
                                                />
                                            }
                                        </Form.Item>
                                    </Form>
                                </Col>
                            </Row>

                        </Content>
                        <Footer style={{ textAlign: 'center' }}>Made by Iker Torron - Iker martinez - David Izquierdo</Footer>
                    </Layout>}
            </div>
        );
    }
}

const WerappedRegistration = Form.create({ name: 'normal_login' })(Login);
export default WerappedRegistration;
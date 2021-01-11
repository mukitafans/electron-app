import React, { Component } from 'react';
import { Layout, Menu, Button } from 'antd';

import { Widget, addResponseMessage, addLinkSnippet, addUserMessage } from 'react-chat-widget';

import 'react-chat-widget/lib/styles.css';

import logo from './logo.svg';





class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //logged: true
        };
    }

    componentDidMount() {
        //this.setState({ logged: authenticationService.loginValid() })
    }


    render() {
        return(
            <Layout>
                <Widget
                handleNewUserMessage={this.handleNewUserMessage}
                profileAvatar={logo}
                title="Chat de rutas"
                subtitle="subtitulo"
                />
            </Layout>

        );
    }



}

export default Chat;

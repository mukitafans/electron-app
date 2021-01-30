import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import ModalForm from '../components/Modals/Modal.js';
import DataTable from '../components/Tables/DataTable';
import { CSVLink } from "react-csv";
import Map from '../views/Map.jsx';
//import logoCmobile from './../../assets/img/c_mobile.png';
import logo from '../assets/img/logo.png';
import menuIcon from '../assets/img/Menuicon.png';
import { Location, redirectTo } from '@reach/router'
import { Redirect, Link } from 'react-router-dom';
import { Button } from 'reactstrap';
import { Layout, Menu, Drawer, Table, Badge, Dropdown, Icon, Collapse } from 'antd';

import { authenticationService } from '../services/authentication.service.js';
import reqwest from 'reqwest';


class CrudLocalizaciones extends Component{
    state = {
        items: []
      }
    
      async getItems(){
        await fetch('http://137.116.219.96:80/localizaciones/all')
          .then(response => response.json())
          .then(items => this.setState({items}))
          .catch(err => console.log(err))
      }
    
      deleteItem = nombre => {
        let confirmDelete = window.confirm('Delete item forever?')
        if(confirmDelete){
          fetch(`http://137.116.219.96:80/localizaciones/eliminarLocalizacion/${nombre}`, {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            nombre
          })
        })
          .then(response => response.json())
          .then(item => {
            this.props.deleteItemFromState(nombre)
          })
          .catch(err => console.log(err))
        }
    
      }
      addItemToState = (item) => {
        this.setState(prevState => ({
          items: [...prevState.items, item]
        }))
      }
    
      updateState = (item) => {
        const itemIndex = this.state.items.findIndex(data => data.id === item.id)
        const newArray = [
        // destructure all items from beginning to the indexed item
          ...this.state.items.slice(0, itemIndex),
        // add the updated item to the array
          item,
        // add the rest of the items to the array from the index after the replaced item
          ...this.state.items.slice(itemIndex + 1)
        ]
        this.setState({ items: newArray })
      }
    
      deleteItemFromState = (id) => {
        const updatedItems = this.state.items.filter(item => item.id !== id)
        this.setState({ items: updatedItems })
      }
    
      componentDidMount(){
        this.getItems()
      }
    
      render() {
        return (
          <Container className="App">
            <Row>
              <Col>
                <h1 style={{margin: "20px 0"}}>Localizaciones</h1>
              </Col>
            </Row>
            <Row>
              <Col>
                <DataTable items={this.state.items} updateState={this.updateState} deleteItemFromState={this.deleteItemFromState} />
              </Col>
            </Row>
            <Row>
              <Col>
                <CSVLink
                  filename={"db.csv"}
                  color="primary"
                  style={{float: "left", marginRight: "10px"}}
                  className="btn btn-primary"
                  data={this.state.items}>
                  Descargar CSV
                </CSVLink>
                
              </Col>
            </Row>
          </Container>
        )
      }
    }

    

export default CrudLocalizaciones;
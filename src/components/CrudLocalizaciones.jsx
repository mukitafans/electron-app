import React, { Component } from 'react';

import Map from '../views/Map.jsx';
import logo from '../assets/img/logo.png';
import menuIcon from '../assets/img/Menuicon.png';
import { Location, redirectTo } from '@reach/router'
import { Redirect, Link } from 'react-router-dom';

import { Layout, Menu, Button, Drawer, Table, Badge, Dropdown, Icon } from 'antd';

import { authenticationService } from '../services/authentication.service.js';

import reqwest from 'reqwest';



class CrudLocalizaciones extends Component{
    constructor(props) {
        super(props);
        this.state = {
            //logged: true,
            //visible: false
            data: [],
            pagination: {},
            loading: false,
        };
    }

    componentDidMount() {
        this.fetch();
    }
    handleTableChange = (pagination, filters, sorter) => {
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        this.setState({
          pagination: pager,
    });
    this.fetch({
        results: pagination.pageSize,
        page: pagination.current,
        sortField: sorter.field,
        sortOrder: sorter.order,
        ...filters,
      });
    };

    fetch = (params = {}) => {
        console.log('datos:', params);
        this.setState({ loading: true });
        reqwest({
          url: 'http://137.116.219.96:80/localizaciones/all',
          method: 'get',
          data: {
            [{}]: 20,
            ...params,
          },
          type: 'json',
        }).then(data => {
          const pagination = { ...this.state.pagination };
          // Read total count from server
          // pagination.total = data.totalCount;
          pagination.total = 200;
          console.log(data);
          this.setState({
            loading: false,
            data: data,
            pagination,
          });
        });
    };



    
    render(){
     /*
      const datosArrayRutas = 
      <table>
        {[this.state.data.map((item, index)=> {
          return(

          <tr>
            <td>{item.listaRutas.map((item, index)=>{
              return(
                <td>{item.listaPuntos.map((item, index)=>{
                  return(
                    <td>{item.listaPreguntas.map((item, index)=>{
                      return(
                        <td>{item}</td>
                      )
                    })}</td>
                  )
                })}</td>
              )
            })
            }</td>

          </tr>
          
         )})]}
        </table>
        
      
      
      
      console.log(datosArrayRutas)
      const datosArrayRutas = 
      {this.state.data.Map((item, index)=>{
        return(
          {item.listaRutas}
          )
      })}*/

      const columns = [
        {
          title: 'Localizacion',
          dataIndex: 'nombre',
          //sorter: true,
          //render: nombre => `${nombre}`,
          //width: '20%',
          key: 'nombreLocalizacion'
        },
        /*
        title: 'Localizacion',
        dataIndex: 'name',
        sorter: true,
        render: name => `${name.first} ${name.last}`,
        width: '20%',
      },*/
        {
          title: 'area',
          dataIndex: 'area',
        },
        {
            title: 'NombreRuta',
           // dataIndex: 'listaRutas["nombre"]',
            key: 'nombreRuta2',
            render: (record) => record.listaRutas.tiempo
        },
      
        {
            title: 'Lat',
            dataIndex: 'lat',
        },
        {
            title: 'Lon',
            dataIndex: 'log',
        },
        {
          title: 'Ciudad',
          dataIndex: '',
          filters: [{ text: 'Irun', value: 'Irun' }, { text: 'Donostia', value: 'Donostia' }],
          width: '20%',
        },
        {
            title: 'Nombre de la ruta',
            dataIndex: '',
           // render: listaRutas => `${listaRutas.nombre}`,
        },
        {
            title: 'Transporte',
            dataIndex: 'transporte',
          },
          {
            title: 'Duracion de la ruta',
            dataIndex: 'duracion',
          },
          {
            title: 'Distancia (km)',
            dataIndex: 'km_totales',
          },
          {
            title: '',
            dataIndex: '',
          },
    
        
      ];
        return(
         
        <Table 
        dataSource={this.state.data} 
        columns={columns} 
        rowKey={record => record.uid} 
        >

        </Table>
        );
    }


}

export default CrudLocalizaciones;
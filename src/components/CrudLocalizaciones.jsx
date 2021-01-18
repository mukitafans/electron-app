import React, { Component } from 'react';

import Map from '../views/Map.jsx';
import logo from '../assets/img/logo.png';
import menuIcon from '../assets/img/Menuicon.png';
import { Location, redirectTo } from '@reach/router'
import { Redirect, Link } from 'react-router-dom';

import { Layout, Menu, Button, Drawer, Table } from 'antd';

import { authenticationService } from '../services/authentication.service.js';

import reqwest from 'reqwest';


const datosArray = [


] 

const columns = [
    {
      title: 'Localizacion',
      //dataIndex: 'nombre',
      //sorter: true,
      //render: nombre => `${nombre}`,
      //width: '20%',
      //key: 'nombre'
    },
    /*
    title: 'Localizacion',
    dataIndex: 'name',
    sorter: true,
    render: name => `${name.first} ${name.last}`,
    width: '20%',
  },*/
    {
        title: 'Nombre',
        dataIndex: 'nombre2',
        //key: 'nombre'
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
      dataIndex: 'nombre',
      filters: [{ text: 'Irun', value: 'Irun' }, { text: 'Donostia', value: 'Donostia' }],
      width: '20%',
    },
    {
        title: 'area',
        dataIndex: 'area',
    },
    {
        title: 'Nombre de la ruta',
       // dataIndex: 'listaRutas',
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
        return(
            <Table
            columns={columns}
            //rowKey={record => record.login.uuid}
            dataSource={this.state.data}
           // pagination={this.state.pagination}
            loading={this.state.loading}
            onChange={this.handleTableChange}
          />
        );
    }


}

export default CrudLocalizaciones;
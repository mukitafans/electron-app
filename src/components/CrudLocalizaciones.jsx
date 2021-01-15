import React, { Component } from 'react';

import Map from '../views/Map.jsx';
import logo from '../assets/img/logo.png';
import menuIcon from '../assets/img/Menuicon.png';
import { Location, redirectTo } from '@reach/router'
import { Redirect, Link } from 'react-router-dom';

import { Layout, Menu, Button, Drawer, Table } from 'antd';

import { authenticationService } from '../services/authentication.service.js';

import reqwest from 'reqwest';

const columns = [
    {
      title: 'Localizacion',
      dataIndex: 'name',
      sorter: true,
      render: name => `${name.first} ${name.last}`,
      width: '20%',
    },
    {
        title: 'ID ruta',
        dataIndex: 'id_ruta',
    },
    {
        title: 'Lat',
        dataIndex: 'lat',
    },
    {
        title: 'Lon',
        dataIndex: 'lot',
    },
    {
      title: 'Ciudad',
      dataIndex: 'ciudad',
      filters: [{ text: 'Irun', value: 'irun' }, { text: 'Donostia', value: 'Donostia' }],
      width: '20%',
    },
    {
        title: 'area',
        dataIndex: 'area',
    },
    {
        title: 'Nombre de la ruta',
        dataIndex: 'nombre_ruta',
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
        console.log('params:', params);
        this.setState({ loading: true });
        reqwest({
          url: 'https://randomuser.me/api',
          method: 'get',
          data: {
            results: 20,
            ...params,
          },
          type: 'json',
        }).then(data => {
          const pagination = { ...this.state.pagination };
          // Read total count from server
          // pagination.total = data.totalCount;
          pagination.total = 200;
          this.setState({
            loading: false,
            data: data.results,
            pagination,
          });
        });
    };
    render(){
        return(
            <Table
            columns={columns}
            rowKey={record => record.login.uuid}
            dataSource={this.state.data}
            pagination={this.state.pagination}
            loading={this.state.loading}
            onChange={this.handleTableChange}
          />
        );
    }


}

export default CrudLocalizaciones;
import React, { Component } from 'react'
import { Table, Button } from 'reactstrap';
import ModalForm from '../Modals/Modal2'

class DataTable extends Component {

  deleteItem = usuario => {
    let confirmDelete = window.confirm('¿Deseas borrar la localizacion entera?')
    if(confirmDelete){
      fetch(`http://137.116.219.96:80/usuarios/eliminarUsuario/${usuario}`, {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        usuario
      })
    })
      .then(response => response.json())
      .then(item => {
        this.props.deleteItemFromState(usuario)
      })
      .catch(err => console.log(err))
    }

  }

  render() {

    const items = this.props.items.map(item => {
      return (
        <tr key={item.usuario}>
          <td>{item.usuario}</td>
          <td>{item.apellido}</td>
          <td>{item.email}</td>
          <td>{item.ruta_activa}</td>
          <td>{item.lat}</td>
          <td>{item.log}</td>
          <td>{item.puntuacion_total}</td>
          
          <td>
            <div style={{width:"160px"}}>
              <ModalForm buttonLabel="Edit" item={item} updateState={this.props.updateState}/>
              {' '}
              <Button color="danger" onClick={() => this.deleteItem(item.id)}>Del</Button>
            </div>
          </td>
        </tr>
        )
      })

    return (
      <Table responsive hover >
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Apellido</th>
            <th>Email</th>
            <th>Ruta activa</th>
            <th>Latitud</th>
            <th>Longitud</th>
            <th>Puntuacion total</th>
          </tr>
        </thead>
        <tbody>
          {items}
        </tbody>
      </Table>
    )
  }
}

export default DataTable
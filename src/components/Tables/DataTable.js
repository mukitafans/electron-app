import React, { Component } from 'react'
import { Table, Button } from 'reactstrap';
import ModalForm from '../Modals/Modal'

class DataTable extends Component {

  deleteItem = nombre => {
    let confirmDelete = window.confirm('¿Deseas borrar la localizacion entera?')
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

  render() {

    const items = this.props.items.map(item => {
      return (
        <tr key={item.nombre}>
          <td>{item.nombre}</td>
          {item.listaRutas.map(rutas =>
            <tr >
              <td scope="row"><b>Nombre de la ruta</b><br></br><br></br>{rutas.nombre}</td>
              <td><b>Transporte</b><br></br><br></br>{rutas.transporte}</td>
              
              {rutas.listaPuntos.map(puntos =>
                <tr>
                  <td><b>Nombre del punto</b><br></br><br></br>{puntos.nombre}</td>
                  <td><b>Latitud</b><br></br><br></br>{puntos.lat}</td>
                  <td><b>Longitud</b><br></br><br></br>{puntos.log}</td>
          
                  {puntos.listaPreguntas.map(index =>
                    <tr>
                      <td><b>Pregunta</b><br></br><br></br>{index.pregunta}</td>
                      <td><ModalForm buttonLabel="Edit" item={item} rutas={rutas} puntos={puntos} index={index} updateState={this.props.updateState}/></td>
                    </tr>
                    )}
                </tr>
                )}
            </tr>

            )}
          <td>
            <div style={{width:"160px"}}>
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
            <th>Localizacion</th>
            <th>Rutas</th>
            <th>Acciones</th>
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
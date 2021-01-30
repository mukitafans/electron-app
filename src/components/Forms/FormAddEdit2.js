import React from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';

class AddEditForm extends React.Component {
  state = {
    id: 0,
    usuario: '',
    apellido: '',
    email: '',
    contraseña: '',
    lat: '',
    log: '',
    ruta_activa: '',
    puntuacion_total: ''
  }

  onChange = e => {
    this.setState({[e.target.name]: e.target.value})
  }

  submitFormAdd = e => {
    e.preventDefault()
    fetch('http://localhost:3000/crud', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        first: this.state.first,
        last: this.state.last,
        email: this.state.email,
        phone: this.state.phone,
        location: this.state.location,
        hobby: this.state.hobby
      })
    })
      .then(response => response.json())
      .then(item => {
        if(Array.isArray(item)) {
          this.props.addItemToState(item[0])
          this.props.toggle()
        } else {
          console.log('failure')
        }
      })
      .catch(err => console.log(err))
  }

  submitFormEdit = usuario => {
    usuario.preventDefault()
    fetch(`http://137.116.219.96:80/usuarios/modificarUsuario/${this.state.usuario}`, {
      method: 'put',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "usuario":this.state.usuario,
        "apellido":this.state.apellido,
        "contraseña": this.state.contraseña,
        "email":this.state.email,
        "ruta_activa":this.state.ruta_activa,
        "lat": this.state.lat,
        "log": this.state.log,
        "puntuacion_total":this.state.puntuacion_total
        
        })
    })
      .then(response => response.json())
      .then(item => {
        if(Array.isArray(item)) {
          // console.log(item[0])
          this.props.updateState(item[0])
          this.props.toggle()
        } else {
          console.log('failure')
        }
      })
      .catch(err => console.log(err))
  }

  componentDidMount(){
    // if item exists, populate the state with proper data
    if(this.props.item){
      const { usuario, apellido, email, ruta_activa, lat, log, puntuacion_total, contraseña} = this.props.item
      this.setState({ usuario, apellido, email, ruta_activa, lat, log, puntuacion_total, contraseña})
    }
   
  }
  

  render() {
    return (
      <Form onSubmit={this.props.item ? this.submitFormEdit : this.submitFormAdd}>
        <FormGroup>
          <Label for="usuario">Usuario</Label>
          <Input type="text" name="usuario" id="usuario" onChange={this.onChange} value={this.state.usuario === null ? '' : this.state.usuario} />
        </FormGroup>
        <FormGroup>
          <Label for="apellido">Apellido</Label>
          <Input type="text" name="apellido" id="apellido" onChange={this.onChange} value={this.state.apellido === null ? '' : this.state.apellido}  />
        </FormGroup>
        <FormGroup>
          <Label for="email">Email</Label>
          <Input type="text" name="email" id="email" onChange={this.onChange} value={this.state.email}  />
        </FormGroup>
        <FormGroup>
          <Label for="contraseña">Contraseña</Label>
          <Input type="text" name="contraseña" id="contraseña" onChange={this.onChange} value={this.state.contraseña === null ? '' : this.state.contraseña}  />
        </FormGroup>
        <FormGroup>
          <Label for="ruta_activa">Ruta activa</Label>
          <Input type="text" name="ruta_activa" id="ruta_activa" onChange={this.onChange} value={this.state.ruta_activa === null ? '' : this.state.ruta_activa}  />
        </FormGroup>
        <FormGroup>
          <Label for="lat">Latitud</Label>
          <Input type="text" name="lat" id="lat" onChange={this.onChange} value={this.state.lat === null ? '' : this.state.lat} />
        </FormGroup>
        <FormGroup>
          <Label for="log">Longitud</Label>
          <Input type="text" name="log" id="log" onChange={this.onChange} value={this.state.log === null ? '' : this.state.log} />
        </FormGroup>

        <FormGroup >
          <Label for="puntuacion_total">Puntuacion total</Label>
          <Input type="text" name="puntuacion_total" id="puntuacion_total" onChange={this.onChange} value={this.state.puntuacion_total === null ? '' : this.state.puntuacion_total} disabled/>
        </FormGroup>
       
       
        <Button>Submit</Button>
      </Form>
    );
    }
}

export default AddEditForm
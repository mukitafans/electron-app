import React from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';

class AddEditForm extends React.Component {
  state = {
    id: 0,
    nombre: '',
    nombreRutas: '',
    nombrePuntos: '',
    transporte: '',
    lat: '',
    log: '',
    pregunta: '',
    rutacion: ''
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


  /*
   nombreRutas: this.state.nombreRutas,
        nombrePuntos: this.state.nombrePuntos,
        transporte: this.state.transporte,
        lat: this.state.lat,
        log: this.state.log,
        pregunta: this.state.pregunta
  */
  submitFormEdit = nombre => {
    nombre.preventDefault()
    fetch(`http://137.116.219.96:80/localizaciones/editarLocalizacion/${this.state.nombre}`, {
      method: 'put',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "nombre":this.state.nombre, "area":0,
        "listaRutas":[{"nombre":this.state.nombreRutas, "transporte":this.state.transporte,"km_totales":5, "tiempo":"5000",
        "listaPuntos":[{"nombre":this.state.nombrePuntos, "lat":this.state.lat, "log":this.state.log, 
        "tipo":"prueba", "oculto": true, "area_total":1000, "ruta": JSON.stringify(this.state.rutacion) ,
        "listaPreguntas":[{"pregunta":this.state.pregunta, "puntuacion_pregunta":20, "respuesta_correcta":'1', 
        "listaRespuestas":['JAJAJA', 'JOJOJO', 'JUJUJU']}]},
                        ]}
                    ],
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
      const { nombre} = this.props.item
      this.setState({ nombre})
    }
    if(this.props.rutas){
      const { nombre, transporte} = this.props.rutas
      this.setState({ nombreRutas: nombre, transporte })
    }
    if(this.props.puntos){
      const { nombre, lat, log, ruta} = this.props.puntos
      this.setState({ nombrePuntos: nombre , lat, log, rutacion: ruta})
    }
    if(this.props.index){
      const { pregunta} = this.props.index
      this.setState({ pregunta})
    }
  }

  render() {
    return (
      <Form onSubmit={this.props.rutas, this.props.item ? this.submitFormEdit : this.submitFormAdd}>
        <FormGroup>
          <Label for="nombre">Localizacion</Label>
          <Input type="text" name="nombre" id="nombre" onChange={this.onChange} value={this.state.nombre === null ? '' : this.state.nombre} />
        </FormGroup>
        <FormGroup>
          <Label for="nombreRutas">Nombre de la ruta</Label>
          <Input type="text" name="nombreRutas" id="nombreRutas" onChange={this.onChange} value={this.state.nombreRutas === null ? '' : this.state.nombreRutas}  />
        </FormGroup>
        <FormGroup>
          <Label for="transporte">Transporte</Label>
          <Input type="text" name="transporte" id="transporte" onChange={this.onChange} value={this.state.transporte}  />
        </FormGroup>
        <FormGroup>
          <Label for="nombrePuntos">Nombre del punto</Label>
          <Input type="text" name="nombrePuntos" id="nombrePuntos" onChange={this.onChange} value={this.state.nombrePuntos === null ? '' : this.state.nombrePuntos}  />
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
          <Label for="rutacion">rutas</Label>
          <Input type="text" name="rutacion" id="rutacion" onChange={this.onChange} value={JSON.stringify(this.state.rutacion) === null ? '' : JSON.stringify(this.state.rutacion)} disabled/>
        </FormGroup>
       
       
        <Button>Submit</Button>
      </Form>
    );
  }
}

export default AddEditForm
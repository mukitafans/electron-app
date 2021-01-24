import React, { Component } from 'react';

import Map from '../views/Map.jsx';
//import logoCmobile from './../../assets/img/c_mobile.png';
import logo from '../assets/img/logo.png';
import menuIcon from '../assets/img/Menuicon.png';
import { Location, redirectTo } from '@reach/router'
import { Redirect, Link } from 'react-router-dom';

import { Layout, Menu, Button, Drawer, Table, Badge, Dropdown, Icon } from 'antd';

import { authenticationService } from '../services/authentication.service.js';
import reqwest from 'reqwest';



const data = [{"id":"1", "nombre":"Irun","area":0.0,"listaRutas":[{"nombre":"Ruta1","transporte":"Piernas","tiempo":2892,"km_totales":1,"listaPuntos":[{"nombre":"Behobia","lat":43.34228621776414,"log":-1.7603850690135165,"area_total":132,"oculto":true,"tipo":"0","ruta":null,"listaPreguntas":[{"pregunta":"Quien es mas guapo de los tres","listaRespuestas":["DAbiz El tonto","Torron el zorrrroooooo","Iker Martinez Dios Supremo"],"respuesta_correcta":"2","puntuacion_pregunta":12}]}]},{"nombre":"Ruta 2","transporte":"nadando","tiempo":12,"km_totales":11,"listaPuntos":[{"nombre":"Olaberria","lat":43.32996446957748,"log":-1.78845516017538,"area_total":132,"oculto":true,"tipo":"2","ruta":null,"listaPreguntas":[{"pregunta":"Quien es mas guapo de los tres","listaRespuestas":["DAbiz El tonto","Torron el Torron","Iker Martinez Dios Supremo"],"respuesta_correcta":"2","puntuacion_pregunta":12}]}]}]},{"id":"2","nombre":"Hondarribia","area":0.0,"listaRutas":[{"nombre":"Ruta 3","transporte":"Piernas","tiempo":2892,"km_totales":1,"listaPuntos":[{"nombre":"Puerto","lat":43.38875433767975,"log":-1.7905649167319726,"area_total":132,"oculto":true,"tipo":"Pruebas","ruta":null,"listaPreguntas":[{"pregunta":"Quien es mas guapo de los tres","listaRespuestas":["DAbiz El tonto","Torron el zorrrroooooo","Iker Martinez Dios Supremo"],"respuesta_correcta":null,"puntuacion_pregunta":12}]},{"nombre":"Playa","lat":43.38066450417254,"log":-1.798228292332793,"area_total":132,"oculto":true,"tipo":"Pruebas","ruta":null,"listaPreguntas":[{"pregunta":"Quien tres","listaRespuestas":["DAbiz El tonto","Torron el Tonto","Iker Martinez Dios Supremo"],"respuesta_correcta":null,"puntuacion_pregunta":8}]}]},{"nombre":"Ruta 4","transporte":"nadando","tiempo":12,"km_totales":11,"listaPuntos":[{"nombre":"Golf","lat":43.33773609026295,"log":-1.8265911234099834,"area_total":132,"oculto":true,"tipo":"Pruebas","ruta":null,"listaPreguntas":[{"pregunta":"Quien es mas guapo de los tres","listaRespuestas":["DAbiz El tonto","Torron el Torron","Iker Martinez Dios Supremo"],"respuesta_correcta":null,"puntuacion_pregunta":12}]}]}]}]

//LISTA PREGUNTAS SI ESTA NULL PETA

class CrudPreguntas extends Component{
    constructor(props) {
        super(props);
        this.state = {
            //logged: true,
            //visible: false
            data: [],
            courses: [],
            message: null
        };
        this.deleteCourseClicked = this.deleteCourseClicked.bind(this)
        this.updateCourseClicked = this.updateCourseClicked.bind(this)
        this.addCourseClicked = this.addCourseClicked.bind(this)
        this.refreshCourses = this.refreshCourses.bind(this)
    }
    componentDidMount() {
        this.refreshCourses();
    }

    refreshCourses() {
        /*CourseDataService.retrieveAllCourses(INSTRUCTOR)//HARDCODED
            .then(
                response => {
                    //console.log(response);
                    this.setState({ courses: response.data })
                }
            )*/

        fetch = (data = {}) => {
            console.log('datos:', data);
            this.setState({ loading: true });
            reqwest({
                url: 'http://137.116.219.96:80/localizaciones/all',
                method: 'get',
                data: {
                [{}]: 20,
                ...data,
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
    }
    deleteCourseClicked(id) {
        /*CourseDataService.deleteCourse(INSTRUCTOR, id)
            .then(
                response => {
                    this.setState({ message: `Delete of course ${id} Successful` })
                    this.refreshCourses()
                }
            )*/
        console.log("AHAHAHAAHAHA NO FUNSIONA CRACK FALTA LO DE LA API Y SE BORRA AJAJAJ SALU2")
    }
    addCourseClicked() {
        this.props.history.push(`/courses/-1`)
    }

    updateCourseClicked(id) {
        console.log('SE INTENTA UPDATEAR PERO FALTAN WEAS DE LA API ' + id)
        //this.props.history.push(`/courses/${id}`)
    }


    render(){
        return <div>            

        {/*
        data.map((item, index)=>{
        return(<div>
            <h1>{item.nombre}</h1>
            {item.listaRutas.map((c, i)=> <div> 
                <h3>{c.nombre}</h3>
                {console.log(c)}
                {c.listaPuntos.map((punto, x) => <div>
                    <h5>{punto.nombre}</h5>
                    <h5>{punto.lat}</h5>
                    <h5>{punto.log}</h5>
                    {console.log(punto)}
                 
                    {punto.listaPreguntas.map((preg, y) => <div>
                        <h5>{preg.pregunta}</h5> 
                    </div>)}
                 

                </div>)}

            </div>)}
        </div>
        )
    })
    */
}
        <div className="container">
        <h3>Lista de rutas</h3>
        {this.state.message && <div class="alert alert-success">{this.state.message}</div>}
        <div className="container">
            <table className="table">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Localizacion</th>
                        <th>Area</th>
                        <th>Lista de Rutas</th>
                        
                        <th>Update</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(
                            course =>
                                <tr key={course.id}>
                                    <td>{course.id}</td>
                                    <td>{course.nombre}</td>
                                    <td>{course.area}</td>
                                    {course.listaRutas.map((item, index) => 
                                    <tr>
                                        <th>nombre de la ruta<td style={{color:'red'}}>{item.nombre}</td></th>
                                        
                                        <th>Transporte<td style={{color:'red'}}>{item.transporte}</td></th>
                                       
                                        <th>Tiempo<td style={{color:'red'}}>{item.tiempo}</td></th>
                                        
                                        <th>km totales<td style={{color:'red'}}>{item.km_totales}</td></th>
                                        
                                        <tr>                                        
                                        {item.listaPuntos.map((punto, index) =>
                                            <tr>
                                                <td>{punto.nombre}</td>
                                                <td>{punto.lat}</td>
                                                <td>{punto.log}</td>
                                            </tr>
                                        )}
                                        </tr>
                                    </tr>
                                    
                                    )}
                                    
                                    <td><button className="btn btn-success" onClick={() => this.updateCourseClicked(course.id)}>Update</button></td>
                                    <td><button className="btn btn-warning" onClick={() => this.deleteCourseClicked(course.id)}>Delete</button></td>
                                </tr>
                        )
                    }
                </tbody>
            </table>
            <div className="row">
                <button className="btn btn-success" onClick={this.addCourseClicked}>Add</button>
            </div>
        </div>
    </div>
        </div>
    
    }

}

export default CrudPreguntas;
import React, { Component } from 'react';

import Map from '../views/Map.jsx';
//import logoCmobile from './../../assets/img/c_mobile.png';
import logo from '../assets/img/logo.png';
import menuIcon from '../assets/img/Menuicon.png';
import { Location, redirectTo } from '@reach/router'
import { Redirect, Link } from 'react-router-dom';

import { Layout, Menu, Button, Drawer, Table, Badge, Dropdown, Icon } from 'antd';

import { authenticationService } from '../services/authentication.service.js';


const data = [{"nombre":"Irun","area":0.0,"listaRutas":[{"nombre":"Ruta1","transporte":"Piernas","tiempo":2892,"km_totales":1,"listaPuntos":[{"nombre":"Behobia","lat":43.34228621776414,"log":-1.7603850690135165,"area_total":132,"oculto":true,"tipo":"0","ruta":null,"listaPreguntas":[{"pregunta":"Quien es mas guapo de los tres","listaRespuestas":["DAbiz El tonto","Torron el zorrrroooooo","Iker Martinez Dios Supremo"],"respuesta_correcta":"2","puntuacion_pregunta":12}]}]},{"nombre":"Ruta 2","transporte":"nadando","tiempo":12,"km_totales":11,"listaPuntos":[{"nombre":"Olaberria","lat":43.32996446957748,"log":-1.78845516017538,"area_total":132,"oculto":true,"tipo":"2","ruta":null,"listaPreguntas":[{"pregunta":"Quien es mas guapo de los tres","listaRespuestas":["DAbiz El tonto","Torron el Torron","Iker Martinez Dios Supremo"],"respuesta_correcta":"2","puntuacion_pregunta":12}]}]}]},{"nombre":"Hondarribia","area":0.0,"listaRutas":[{"nombre":"Ruta 3","transporte":"Piernas","tiempo":2892,"km_totales":1,"listaPuntos":[{"nombre":"Puerto","lat":43.38875433767975,"log":-1.7905649167319726,"area_total":132,"oculto":true,"tipo":"Pruebas","ruta":null,"listaPreguntas":[{"pregunta":"Quien es mas guapo de los tres","listaRespuestas":["DAbiz El tonto","Torron el zorrrroooooo","Iker Martinez Dios Supremo"],"respuesta_correcta":null,"puntuacion_pregunta":12}]},{"nombre":"Playa","lat":43.38066450417254,"log":-1.798228292332793,"area_total":132,"oculto":true,"tipo":"Pruebas","ruta":null,"listaPreguntas":[{"pregunta":"Quien tres","listaRespuestas":["DAbiz El tonto","Torron el Tonto","Iker Martinez Dios Supremo"],"respuesta_correcta":null,"puntuacion_pregunta":8}]}]},{"nombre":"Ruta 4","transporte":"nadando","tiempo":12,"km_totales":11,"listaPuntos":[{"nombre":"Golf","lat":43.33773609026295,"log":-1.8265911234099834,"area_total":132,"oculto":true,"tipo":"Pruebas","ruta":null,"listaPreguntas":[{"pregunta":"Quien es mas guapo de los tres","listaRespuestas":["DAbiz El tonto","Torron el Torron","Iker Martinez Dios Supremo"],"respuesta_correcta":null,"puntuacion_pregunta":12}]}]}]}]

//LISTA PREGUNTAS SI ESTA NULL PETA

class CrudPreguntas extends Component{
    constructor(props) {
        super(props);
        this.state = {
            //logged: true,
            //visible: false
            data: [],
        };
    }

    render(){
        return <div>            <h1>HOLAA</h1>

        {
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
}
        </div>
    
    }

}

export default CrudPreguntas;
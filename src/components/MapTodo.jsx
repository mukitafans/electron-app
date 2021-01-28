import React from "react";
//To request HTTP
import axios from "axios";
import { Redirect, Link } from 'react-router-dom';

//Leaflet
import { Map, TileLayer, ZoomControl, Polyline, Marker } from 'react-leaflet'
//Import Leaflet and plugins
import L from 'leaflet';
import Control from 'react-leaflet-control';
import 'leaflet/dist/leaflet.css';
import 'leaflet-contextmenu'
import 'leaflet-contextmenu/dist/leaflet.contextmenu.min.css'
//Geolocalizacion
import Geolocation from 'react-geolocation'
//Icons to context menu
import ZoomIn from 'leaflet-contextmenu/examples/images/zoom-in.png'
import ZoomOut from 'leaflet-contextmenu/examples/images/zoom-out.png'
import icono from '../assets/img/marker.png'

import PointInPolygon from 'point-in-polygon';

//Antd 
import { Col, Select, Button, Radio, Drawer } from 'antd';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'

//Variables globales
import { globals } from "../variables/config.js";
//Service to get routes (traces with two points)
import { routingService } from '../services/routing.service.js';

//Componentes
import Chat from "./Chat.jsx";
import MarkerIvi from "./Markers/Ivi.jsx";
import NewIvi from "./Modals/NewIvi.jsx";
import NewDenm from "./Modals/NewIviPunto.jsx";
import PanelIvi from "./Panels/PanelIvi.jsx";
import PanelDenm from "./Panels/PanelIviPunto.jsx";
import MarkerUsuarios from "./Markers/usuarios.jsx";

const { Option } = Select;

const RadioGroup = Radio.Group;

//Ficoba parking
const polygonZone = [[43.345991787074105, -1.7898488044738772], [43.34616928790513, -1.7897576093673708], [43.34648137601981, -1.7893901467323305], [43.34622000233296, -1.788381636142731], [43.34568164701375, -1.7886203527450564]];


//Tiles for map
const map_tiles = [
    {
        label: "Open Street Maps",
        value: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    },
    {
        label: "Satelite",
        value: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    },
    {
        label: "Open Street Maps DE",
        value: "https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png"
    },
    {
        label: "Open Street Maps HOT",
        value: "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
    },
    {
        label: "Open Topo Map",
        value: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
    },
    {
        label: "Open Map Surfer",
        value: "https://maps.heigit.org/openmapsurfer/tiles/roads/webmercator/{z}/{x}/{y}.png"
    },
    {
        label: "Hydda Full",
        value: "https://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png"
    },
    {
        label: "Esri World Street Map",
        value: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
    },
    {
        label: "Esri World Topo Map",
        value: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
    }
]

//Function to select Tile
const getLabelOfTile = (value) => map_tiles.find(obj => obj.value === value).label || "Open Street Maps";


class MapTodo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            //VARIABLES DEL STATE
            ivi: [],
            usuarios: [],
            latLonClick: null, //lat, lng on map click

            //Map tile selected
            tile_map: localStorage.getItem("tile_map") || "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",

            //Start position and zoom
            //position: [43.290863, -1.983663],
            position: [43.34659, -1.78743],
            zoom: 15,

            //Panel right on add Denm or IVI with traces
            currentEventDenm: null,
            currentEventIvi: null,

            //traces action when click on map
            clickMapStatus: null, // null | detection | relevation | traces (for denm)

            //Denm trace first point
            newTraceDenmStart: null,

            //Cursor for add traces
            customCur: "",

            //Menu Desplazable
            visible: false , 
            placement: 'left', 


            visibleIvi: false,
            visibleDenm: false


        };
    }
    //FUNCIONES APARTIR DE AQUI

    async componentDidMount() {
        //Get token to request
        //let objUser = JSON.parse(localStorage.getItem("currentUser"));
        //let token = (objUser && objUser.token) ? objUser.token : "";
        console.log("pis")
        //Get all events
        fetch('http://137.116.219.96:80/localizaciones/all')
            .then(response => response.json())
            .then(
            (res) => { console.log({ivi: res})
            this.setState({ ivi: res });
            },
            (error) => {
                this.setState({
                  
                  error
                });
            }
        )
        await fetch('http://137.116.219.96:80/usuarios/all')
        .then(response2 => response2.json())
        .then(
        (res2) => { console.log({usuarios: res2})
        this.setState({ usuarios: res2 });
        },
        (error) => {
            this.setState({
              
              error
            });
        }
    )
    }

    //Change Tile map in moment and save in local storage
    handleChangeTile = value => {
        this.setState({ tile_map: value });
        localStorage.setItem("tile_map", value);
    };
    //More zoom
    zoomIn = () => {
        let lastZoom = this.state.zoom;
        if (lastZoom < 21) this.setState({ zoom: lastZoom + 1 })
    }

    //Less zoom
    zoomOut = () => {
        let lastZoom = this.state.zoom;
        if (lastZoom > 1) this.setState({ zoom: lastZoom - 1 })
    }



    //FUNCIONES MENU DESPLEGABLE
    showDrawer = () => {
        this.setState({
          visible: true,
        });
      };
    
    onClose = () => {
        this.setState({
            visible: false,
        });
    };

    onChange = e => {
        this.setState({
            placement: e.target.value,
        });
    };

    centerMap = (e) => this.setState({ position: [e.latlng.lat, e.latlng.lng] });

    //PARA BORRAR PUNTOS + RUTAS
    //Send request to delete Ivi
    handleDeleteIvi = (nombre) => {
    let objUser = JSON.parse(localStorage.getItem("currentUser"));
    let token = (objUser && objUser.token) ? objUser.token : "";
    console.log("SE INTENTA BORRAR?")
        fetch(`http://137.116.219.96:80/localizaciones/eliminarLocalizacion/${nombre}`, {
            method: 'DELETE',
            })
            .then(console.log("SE INTENTA BORRAR?"))
            .then(res => {
                if (res.status === 200) {
                    const { ivi } = this.state;
                    let newMarkers = ivi.filter(obj => obj.nombre !== nombre);
                    this.map.leafletElement.closePopup();
                    this.setState({ ivi: newMarkers });
                }
            })
            .then(console.log(nombre))
            .catch(err => console.log("error", err));
    };

    //GUARDAR FORM 
    saveFormRef = formRef => this.formRef = formRef;
    //Save form IVI
    saveFormRefIvi = formRef => this.formRefIvi = formRef;
    //saveFormRefIvi2 = formRef => this.formRefIvi = formRef;

    //Abrir formulario para añadir ruta
    openIviModal = (e) => this.setState({ visibleIvi: true, latLonClick: e.latlng });
    openDenmModal = (e) => this.setState({ visibleDenm: true, latLonClick: e.latlng })
    //openIviModal2 = (e) => this.setState({ visibleIvi2: true, latLonClick: e.latlng });
    handleCancelIvi = () => {
        this.setState({ visibleIvi: false });
        const { form } = this.formRefIvi.props;
        form.resetFields();
    };
    handleCancelDenm = () => {
        this.setState({ visibleDenm: false });
        const { form } = this.formRef.props;
        form.resetFields();
    };

    //On add ivi in Zones panel
    handleCreateIviWithZones = () => {
        let { currentEventIvi, ivi } = this.state;
        if (!currentEventIvi) return;

        let objUser = JSON.parse(localStorage.getItem("currentUser"));
        let token = (objUser && objUser.token) ? objUser.token : "";
     
        /*
            body: JSON.stringify({
                        "nombre":"uno", "area":10,
                        "listaRutas":[{"nombre":"asdasd", "transporte":"asdasdsad","km_totales":5, "tiempo":"5000",
                        "listaPuntos":[{"nombre":'puntoPrueba1', "lat":"46.73979", "log":"-1.78863", "tipo":"prueba", "oculto": true, "area_total":1000 ,"listaPreguntas":[]},
                                        {"nombre":'puntoPrueba2', "lat":"46.73979", "log":"-1.78863", "tipo":"prueba", "oculto": true, "area_total":1000, "listaPreguntas":[]}]}
                                    ],
                        })
        */
            fetch('http://137.116.219.96:80/localizaciones/nuevaLocalizacion', {
                method: 'POST',
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
                //{"0":"una", "1":"dos", "2":"tres"} 'JAJAJA', 'JOJOJO', 'JUJUJU' "respuesta_correcta":'1'
                body: JSON.stringify({
                        "nombre":currentEventIvi.localizacion, "area":0,
                        "listaRutas":[{"nombre":currentEventIvi.rutaNombre, "transporte":currentEventIvi.transporte,"km_totales":5, "tiempo":"5000",
                        "listaPuntos":[{"nombre":currentEventIvi.puntoNombre, "lat":currentEventIvi.lat, "log":currentEventIvi.log, "tipo":"prueba", "oculto": true, "area_total":1000, "ruta": JSON.stringify(currentEventIvi.rutas) ,"listaPreguntas":[{"pregunta":'¿unajeje?', "puntuacion_pregunta":20,  "listaRespuestas":[]}]},
                                        {"nombre":'puntoPrueba2', "lat":"46.73979", "log":"-1.78863", "tipo":"prueba", "oculto": true, "area_total":1000, "listaPreguntas":[{"pregunta":'¿unajeje?', "puntuacion_pregunta":20,  "listaRespuestas":[]}]}]}
                                    ],
                        })
                
            })
            .then((response) =>{
                response.json()
                console.log('response', response);
                this.setState({ ivi, visibleIvi: false, clickMapStatus: null, newTraceDenmStart: null, currentEventIvi: null, customCur: "" });
               })
            .then((responseJson)=>{ 
            //console the response 
                console.log('responsejson', responseJson);
                this.setState({ ivi, visibleIvi: false, clickMapStatus: null, newTraceDenmStart: null, currentEventIvi: null, customCur: "" });
                })
            .catch((error)=> {
                console.log('error', error);
            });
    };
    
   
    //On cancel in Zones panel
    handleCancelWithZones = () => this.setState({ visibleDenm: false, visibleDenm2: false, visibleIvi: false,clickMapStatus: null, newTraceDenmStart: null, currentEventDenm: null, currentEventIvi: null, customCur: "" });
    handleCreateDenm = () => {
        const { form } = this.formRef.props;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }

            const { denm, latLonClick, denm_cause_code } = this.state;

            //Get token
            let objUser = JSON.parse(localStorage.getItem("currentUser"));
            let token = (objUser && objUser.token) ? objUser.token : "";

            //If not require traces, send request
            if (!values.traces) {
              console.log("SIN TRAZAS, ACTIVA EL CURSOS")
            } else {
                //To get traces
                console.log(values.rutaNombre.value)
                this.setState({
                    currentEventDenm: {
                       // cause_code: denm_cause_code,
                       // relevance_distance: values.relevanceDistance,
                       // relevance_traffic_direction: values.relevanceTrafficDirection,
                       /* subcause_code: values.subCauseCode,
                       spm: values.speed_limit,
                       localizacion: values.localizacion,
                       area: values.area,
                       rutaNombre: values.rutaNombre,
                       transporte: values.transporte,
                       puntoNombre: values.puntoNombre,*/
                        localizacion: values.localizacion.value,
                        rutaNombre: values.rutaNombre.value,
                        transporte: values.transporte,
                        puntoNombre: values.puntoNombre,
                        lat: latLonClick.lat,
                        log: latLonClick.lng,
                        rutas: []
                    },
                    visibleDenm: false,
                    clickMapStatus: "denm",
                    customCur: "add-start-zone-cur"
                })
            }
            //Reset form
            form.resetFields();
            
        });
    };
    //On add denm in Zones panel
    handleCreateDenmWithZones = () => {
        let { currentEventDenm, denm } = this.state;
        if (!currentEventDenm) return;

        let objUser = JSON.parse(localStorage.getItem("currentUser"));
        let token = (objUser && objUser.token) ? objUser.token : "";
        console.log(this.state.currentEventDenm.localizacion)
        fetch(`http://137.116.219.96:80/puntos/nuevoPunto/${this.state.currentEventDenm.localizacion}/${this.state.currentEventDenm.rutaNombre}`, {
            method: 'POST',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            //{"0":"una", "1":"dos", "2":"tres"} 'JAJAJA', 'JOJOJO', 'JUJUJU' "respuesta_correcta":'1'
            body: JSON.stringify({
                
                        "nombre": currentEventDenm.puntoNombre,
                        "lat": currentEventDenm.lat,
                        "log": currentEventDenm.log,
                        "area_total": 132,
                        "oculto": true,
                        "tipo": "Pruebas",
                        "ruta": null,
                        "listaPreguntas": [
                            {
                                "pregunta": "Quien tres",
                                "listaRespuestas": [
                                    "DAbiz El tonto",
                                    "Torron el Tonto",
                                    "Iker Martinez Dios Supremo"
                                ],
                                "respuesta_correcta": null,
                                "puntuacion_pregunta": 8
                            }
                        ]
                    })
            
        })
        .then((response) =>{
            response.json()
            console.log('response', response);
            this.setState({ denm, visibleIvi: false, visibleDenm: false, clickMapStatus: null, newTraceDenmStart: null, currentEventIvi: null, customCur: "" });
           })
        .then((responseJson)=>{ 
        //console the response 
            console.log('responsejson', responseJson);
            this.setState({ denm, visibleDenm: false, clickMapStatus: null, newTraceDenmStart: null, currentEventIvi: null, customCur: "" });
            })
            .catch(err => console.log("error", err));
    };
    //On accept denm modal (Send request or open add traces mode)
    handleCreateIvi = () => {
        const { form } = this.formRefIvi.props;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }

            const { ivi, latLonClick } = this.state;

            let objUser = JSON.parse(localStorage.getItem("currentUser"));
            let token = (objUser && objUser.token) ? objUser.token : "";

            //If not need traces
            if (!values.traces) {
              
                fetch('http://137.116.219.96:80/localizaciones/nuevaLocalizacion', {
                    method: 'POST',
                    headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                    },
                
                    body: JSON.stringify({
                        lat: latLonClick.lat,
                        lon: latLonClick.lng})
                })
                .then((response) =>response.json())
                .then((responseJson)=>{ 
                //console the response 
                    console.log('response', responseJson);
                    })
                .catch((error)=> {
                    console.log('error', error);
                });
            } else {
                this.setState({
                    currentEventIvi: {
                        spm: values.speed_limit,
                        localizacion: values.localizacion,
                        area: values.area,
                        rutaNombre: values.rutaNombre,
                        transporte: values.transporte,
                        puntoNombre: values.puntoNombre,
                        
                        lat: latLonClick.lat,
                        log: latLonClick.lng,
                        rutas: []
                       // relevance_zones: []
                    },
                    visibleIvi: false,
                    clickMapStatus: "detection",
                    customCur: "add-detection-zone-cur"
                })
            }

            //Reset form
            form.resetFields();
        });
    };
    
    //To add new zone in denm and relevation or detection in ivi
    handleNewZone = (e) => {
        let { clickMapStatus, newTraceDenmStart, currentEventDenm, currentEventIvi } = this.state;
        if (!clickMapStatus) return;
        if (clickMapStatus === "denm") {
            if (!newTraceDenmStart) {
                this.setState({ newTraceDenmStart: e.latlng, customCur: "add-end-zone-cur" })
            } else {
                

                routingService.getRoute(newTraceDenmStart.lat, newTraceDenmStart.lng, e.latlng.lat, e.latlng.lng)
                    .then(response => {
                        currentEventDenm.rutas.push(response.array);
                        if (response) this.setState({ currentEventDenm, newTraceDenmStart: null, customCur: "add-start-zone-cur" });
                    });
                
            }
        }
        else if (clickMapStatus === "detection") {
            let insideParking = PointInPolygon([currentEventIvi.lat, currentEventIvi.log], polygonZone)

            if (insideParking) {
                let points = routingService.getRouteParkingTrackAlfon(currentEventIvi.latitude, currentEventIvi.long, e.latlng.lat, e.latlng.lng);

                currentEventIvi.detection_zones.push(points);
            
                this.setState({ currentEventIvi });
            } else {
                //console.log(e.latLonClick.lat, e.latLonClick.lng)
                routingService.getRoute(e.latlng.lat, e.latlng.lng, currentEventIvi.lat, currentEventIvi.log)
                    .then(response => {
                        currentEventIvi.rutas.push(response.array);
                        if (response) this.setState({ currentEventIvi });
                    });

                
            }
        }


    };

    //Change IVI mouse
    changeZoneType = (clickMapStatus) => this.setState({ clickMapStatus, customCur: 'add-' + clickMapStatus + '-zone-cur' });

    //Remove Denm zone
    removeZone = (i) => {
        let currentEventDenm = this.state.currentEventDenm;
        if (currentEventDenm && currentEventDenm.zones && currentEventDenm.zones[i]) currentEventDenm.zones.splice(i, 1);
        this.setState({ currentEventDenm });
    }
    //remove ivi detection none
    removeZoneDetection = (i) => {
        let currentEventIvi = this.state.currentEventIvi;
        if (currentEventIvi && currentEventIvi.rutas && currentEventIvi.rutas[i]) currentEventIvi.rutas.splice(i, 1);
        this.setState({ currentEventIvi });
    }

    //RENDER PARA LO VISUAL
    render() {
        const { tile_map, position, zoom, ivi, currentEventIvi, visibleIvi, visibleDenm, usuarios, customCur, currentEventDenm, denm } = this.state;
        console.log(ivi)
        
        return (
            <Col span={24} style={{ padding: 0 }}>
                <Button style={{padding:'0px'}} type="primary" block>
                        <Link to="/login">Vuelta al login</Link>       
                    </Button>

                <NewDenm
                    wrappedComponentRef={this.saveFormRef}
                    visible={visibleDenm}
                    onCancel={this.handleCancelDenm}
                    onCreate={this.handleCreateDenm}
                />
                {/*Ivi modal*/}
                <NewIvi
                    wrappedComponentRef={this.saveFormRefIvi}
                    visible={visibleIvi}
                    onCancel={this.handleCancelIvi}
                    onCreate={this.handleCreateIvi}
                />
         
            

                {/*Map object*/}
                <Map
                    center={position}
                    zoom={zoom}
                    style={{  height: 'calc(101vh - 70px)' }}
                    onClick={this.handleNewZone}
                    zoomControl={false}
                    contextmenu={true}
                    contextmenuWidth={450}
                    maxZoom={20}
                    //Menu on right click
                    contextmenuItems={[
                        
                        {
                            text: 'Insertar ruta',
                            icon: icono,
                            callback: (e) => this.openIviModal(e),
                            hideOnSelect: true
                            
                        },
                        {
                            text: 'Insertar punto',
                            icon: icono,
                            callback: (e) => this.openDenmModal(e),
                            hideOnSelect: true
                            
                        },'-', {
                            text: 'Zoom in',
                            icon: ZoomIn,
                            callback: this.zoomIn
                        }, {
                            text: 'Zoom out',
                            icon: ZoomOut,
                            callback: this.zoomOut
                        }
                    ]}
                    className={customCur}
                    ref={map => this.map = map}
                >

                     {/*Panel to add zones on Ivi*/}
                    <Control position="topright" >
                        <PanelIvi
                            objIvi={currentEventIvi}
                            visible={visibleIvi}
                            onCreate={() => this.handleCreateIviWithZones()}
                            onCancel={() => this.handleCancelWithZones()}
                            onChangeRadio={(val) => this.changeZoneType(val)}
                            removeZoneDetection={(i) => this.removeZoneDetection(i)}
                        />
                    </Control>
                  
                    {/*Panel to add zones on Ivi*/}
                    <Control position="topright" >
                        <PanelDenm
                            objIvi2={currentEventDenm}
                            visible={visibleDenm}
                            onCreate={() => this.handleCreateDenmWithZones()}
                            onCancel={() => this.handleCancelWithZones()}
                            onChangeRadio={(val) => this.changeZoneType(val)}
                            removeZoneDetection={(i) => this.removeZoneDetection(i)}
                        />
                    </Control>
                    <ZoomControl position="topright" />
                    <TileLayer
                        url={tile_map}
                        attribution={map_tiles[1].value === tile_map ? map_tiles[1].attribution : "&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"}
                    />

                    {/*To select map tiles*/}
                    <Control position="bottomleft" style={{position: 'fixed', marginLeft:'49%'}}>
                        <Select size="small" defaultValue={getLabelOfTile(tile_map)} onChange={this.handleChangeTile}>
                            {map_tiles.map((obj, i) => <Option key={"map_tile_" + i} value={obj.value}>{obj.label}</Option>)}
                        </Select>
                    </Control>
                    {/*To select map tiles*/}
                    <Control position="topleft">
                        <Geolocation
                            render={({
                                position: { coords: { latitude, longitude } = {} } = {},
                                //error,
                                getCurrentPosition
                            }) => {
                                if (latitude && longitude && position[0] !== latitude && position[1] !== longitude) this.setState({ position: [latitude, longitude] })
                                //this.map.setView(new L.LatLng(40.737, -73.923), 8);
                                return <Button shape="circle" ghost onClick={() => getCurrentPosition()} ><FontAwesomeIcon icon={faMapMarkerAlt} /></Button>
                            }
                            }
                        />
                    </Control>
                    {
                        //If exist Denm to add zone
                        currentEventDenm && <Marker
                            position={[currentEventDenm.lat, currentEventDenm.log]}
                            icon={L.icon({
                                iconUrl: icono,
                                iconSize: [35, 31],
                                iconAnchor: [17, 27],
                                className: "image_grey"
                            })
                            }></Marker>
                    }
                    {
                        ////If exist Ivi to add zones
                        currentEventIvi && <Marker
                            position={[currentEventIvi.lat, currentEventIvi.log]}
                            icon={L.icon({
                                iconUrl: icono,
                                iconSize: [30, 30],
                                iconAnchor: [15, 15],
                                className: "image_grey"
                            })
                            }></Marker>
                    }
                    {
                        //Zone with not added to DB
                        currentEventDenm && currentEventDenm.zones && currentEventDenm.zones.map((zone, n) => {
                            let obj_zone = [];
                            zone && zone.forEach((el, i) => { obj_zone.push({ lat: el[1], lng: el[0] }) });
                            return <Polyline key={"prov-poly-" + n} positions={obj_zone} color="#CCCCCC" weight={12} opacity={0.8} />
                        })
                    }

                      {
                          
                        //Zone detection with not added to DB
                        currentEventIvi && currentEventIvi.rutas && currentEventIvi.rutas.map((zone, n) => {
                            let obj_zone = [];
                            zone && zone.forEach((el, i) => { obj_zone.push({ lat: el[1], lng: el[0] }) });
                            return <Polyline key={"ivi-poly-detection-" + n} positions={obj_zone} color="#999999" weight={12} opacity={0.8} />
                        })
                    }

                    {
                        //Zone relevance with not added to DB
                        currentEventIvi && currentEventIvi.relevance_zones && currentEventIvi.relevance_zones.map((zone, n) => {
                            let obj_zone = [];
                            zone && zone.forEach((el, i) => { obj_zone.push({ lat: el[1], log: el[0] }) });
                            return <Polyline key={"ivi-poly-relevance-" + n} positions={obj_zone} color="#CCCCCC" weight={12} opacity={0.8} />
                        })
                    }
                    {/**     <Control>
                        <Chat>
                        </Chat>
                    </Control>*/}
                
                   
                    {ivi.map((objIvi, nombre) => 
                    objIvi.listaRutas.map((rutas, index) =>
                    rutas.listaPuntos.map((puntos, index2)=>
                    puntos.listaPreguntas.map((preguntas, index3)=>
                    <MarkerIvi preguntas={preguntas} objIvi={objIvi} rutas={rutas} puntos={puntos} key={`marker-ivi-${nombre}`} handleDelete={() => this.handleDeleteIvi(objIvi.nombre)} 
                    
                    />
                    )
                   
                    )
                    )
                   
                    )}
                    
                    {
                        usuarios.map((objIvi, id_usuario) =>
                        <MarkerUsuarios objIvi={objIvi} key={`marker-ivi2-${id_usuario}`} />
                        )
                    }

                    </Map>
            </Col>
        );
    }

}

export default MapTodo;
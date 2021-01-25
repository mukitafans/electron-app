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
import PanelIvi from "./Panels/PanelIvi.jsx";
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


            visibleIvi: false


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
        /*
        fetch(`http://137.116.219.96:80/localizaciones/all`)
        .then(res => res.json())
        .then(
            (result)=>{
                console.log(result)
            }
        )*/
            
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
     handleDeleteIvi = (id) => {
        let objUser = JSON.parse(localStorage.getItem("currentUser"));
        let token = (objUser && objUser.token) ? objUser.token : "";

        axios.post(globals.url_api + 'ivi_del',
            { id: id },
            { headers: { 'x-access-token': token } },
        )
            .then(res => {
                if (res.status === 200) {
                    const { ivi } = this.state;
                    let newMarkers = ivi.filter(obj => obj.id !== id);
                    this.map.leafletElement.closePopup();
                    this.setState({ ivi: newMarkers });
                }
            })
            .catch(err => console.log("error", err));
    };

    //GUARDAR FORM 
    //Save form IVI
    saveFormRefIvi = formRef => this.formRefIvi = formRef;

    //Abrir formulario para añadir ruta
    openIviModal = (e) => this.setState({ visibleIvi: true, latLonClick: e.latlng });
    handleCancelIvi = () => {
        this.setState({ visibleIvi: false });
        const { form } = this.formRefIvi.props;
        form.resetFields();
    };

    //On add ivi in Zones panel
    handleCreateIviWithZones = () => {
        let { currentEventIvi, ivi } = this.state;
        if (!currentEventIvi) return;

        let objUser = JSON.parse(localStorage.getItem("currentUser"));
        let token = (objUser && objUser.token) ? objUser.token : "";
        /*
        axios.post(globals.url_api + 'ivi', {
            spm: currentEventIvi.spm,
            lat: currentEventIvi.latitude,
            lon: currentEventIvi.long,
            valid_from: currentEventIvi.valid_from,
            valid_to: currentEventIvi.valid_to,
            cause_code: currentEventIvi.cause_code,
            //relevance_points: JSON.stringify(currentEventIvi.relevance_zones),
            detection_points: JSON.stringify(currentEventIvi.detection_zones)
        }, {
            headers: { 'x-access-token': token },
        })
            .then(res => {
                if (res.status === 201) {
                    ivi.push(res.data.ivi);
                    this.setState({ ivi, visibleDenm: false, clickMapStatus: null, newTraceDenmStart: null, currentEventIvi: null, customCur: "" });
                }
            })
            .catch(err => console.log("error", err));*/
            fetch('http://137.116.219.96:80/localizaciones/nuevaLocalizacion', {
                method: 'POST',
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
            
                body: JSON.stringify({
                        "nombre":'Prueba4nocaso', "area":10,
                        "listaRutas":[{"nombre":'pruebaruta1', "transporte":'pie',"km_totales":11, "tiempo":"5000",
                        "listaPuntos":[{"nombre":'puntoPrueba1', "lat":currentEventIvi.latitude, "log":currentEventIvi.long, "tipo":"prueba", "oculto": true, "area_total":1000, "listaPreguntas":[]},
                                        {"nombre":'puntoPrueba2', "lat":"46.33979", "log":"-1.78863", "tipo":"prueba", "oculto": true, "area_total":1000, "listaPreguntas":[]}]}
                                    ],
                        })
            })
            .then((response) =>response.json())
            .then((responseJson)=>{ 
            //console the response 
                console.log('response', responseJson);
                })
            .catch((error)=> {
                console.log('error', error);
            });
    };

    //On cancel in Zones panel
    handleCancelWithZones = () => this.setState({ visibleDenm: false, visibleDenm2: false, visibleIvi: false, visibleIvi2: false,clickMapStatus: null, newTraceDenmStart: null, currentEventDenm: null, currentEventIvi: null, customCur: "" });

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
                let data = {nombre: 'irun', listaRutas: [{nombre: 'Ruta99', listaPuntos:[]}]}
                /*axios.post(globals.url_api + 'ivi', {
                    spm: values.speed_limit,
                    lat: latLonClick.lat,
                    lon: latLonClick.lng
                  
                }, {
                    headers: { 'x-access-token': token },
                })
                    .then(res => {
                        if (res.status === 201) {
                            ivi.push(res.data.ivi);
                            this.setState({ ivi, visibleIvi: false });
                            form.resetFields();
                        }
                    })
                    .catch(err => console.log("error", err));*/
                fetch('http://137.116.219.96:80/localizaciones/nuevaLocalizacion', {
                    method: 'POST',
                    headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                    },
                
                    body: JSON.stringify({
                            "jsonrpc":"2.0",
                            "method":"call",
                            "params":{"nombre":"donosti"},
                            "id":844267375})
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
                    
                        latitude: latLonClick.lat,
                        long: latLonClick.lng,
                        detection_zones: []
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
          console.log('mal')
        }
        else if (clickMapStatus === "detection") {
            let insideParking = PointInPolygon([currentEventIvi.latitude, currentEventIvi.long], polygonZone)

            if (insideParking) {
                //AQUI ENEKO
                //let points = routingService.getRouteParking(currentEventIvi.latitude, currentEventIvi.long, e.latlng.lat, e.latlng.lng);
                let points = routingService.getRouteParkingTrackAlfon(currentEventIvi.latitude, currentEventIvi.long, e.latlng.lat, e.latlng.lng);

                currentEventIvi.detection_zones.push(points);
            
                this.setState({ currentEventIvi });
            } else {

                routingService.getRoute(e.latlng.lat, e.latlng.lng, currentEventIvi.latitude, currentEventIvi.long)
                    .then(response => {
                        currentEventIvi.detection_zones.push(response.array);
                        if (response) this.setState({ currentEventIvi });
                    });
            }
        }


    };

    //Change IVI mouse
    changeZoneType = (clickMapStatus) => this.setState({ clickMapStatus, customCur: 'add-' + clickMapStatus + '-zone-cur' });

    //remove ivi detection none
    removeZoneDetection = (i) => {
        let currentEventIvi = this.state.currentEventIvi;
        if (currentEventIvi && currentEventIvi.detection_zones && currentEventIvi.detection_zones[i]) currentEventIvi.detection_zones.splice(i, 1);
        this.setState({ currentEventIvi });
    }

    //RENDER PARA LO VISUAL
    render() {
        const { tile_map, position, zoom, ivi, currentEventIvi, visibleIvi, usuarios } = this.state;
        console.log(ivi)
        
        return (
            <Col span={24} style={{ padding: 0 }}>
                <Button style={{padding:'0px'}} type="primary" block>
                        <Link to="/login">Vuelta al login</Link>       
                    </Button>


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
                            //hideOnSelect: true
                            
                        },
                        {
                            text: 'Insertar punto',
                            icon: icono,
                            callback: (e) => this.openIviModal(e),
                            //hideOnSelect: true
                            
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
                    //className={customCur}
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
                        //Zone detection with not added to DB
                        currentEventIvi && currentEventIvi.detection_zones && currentEventIvi.detection_zones.map((zone, n) => {
                            let obj_zone = [];
                            zone && zone.forEach((el, i) => { obj_zone.push({ lat: el[1], log: el[0] }) });
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
                    <MarkerIvi puntos={puntos} key={`marker-ivi-${index2}`} handleDelete={() => this.handleDeleteIvi(puntos.nombre),console.log(puntos)} 
                    
                    />
                    )
                    )
                   
                    )}
                    
                    {
                        usuarios.map((objIvi, id_usuario) =>
                        <MarkerUsuarios objIvi={objIvi} key={`marker-ivi2-${id_usuario}`, console.log(usuarios)} />
                        )
                    }

                    </Map>
            </Col>
        );
    }

}

export default MapTodo;
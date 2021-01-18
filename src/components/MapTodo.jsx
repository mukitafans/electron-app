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

    componentDidMount() {
        //Get token to request
        let objUser = JSON.parse(localStorage.getItem("currentUser"));
        let token = (objUser && objUser.token) ? objUser.token : "";

        //Get all events
        axios.get(globals.url_api, {
            headers: { 'x-access-token': token }
        })
            .then(res => (res.status === 200) && this.setState({ivi: res.data.ivi }));
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
            .catch(err => console.log("error", err));
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

            //Get valid dates to send 
            let valid_from = values.dates[0].utcOffset(0);
            valid_from.set({ hour: 0, minute: 0, second: 0 });

            let valid_to = values.dates[1].utcOffset(0);
            valid_to.set({ hour: 23, minute: 59, second: 59 });

            const { ivi, latLonClick } = this.state;

            let objUser = JSON.parse(localStorage.getItem("currentUser"));
            let token = (objUser && objUser.token) ? objUser.token : "";

            //If not need traces
            if (!values.traces) {
                axios.post(globals.url_api + 'ivi', {
                    spm: values.speed_limit,
                    lat: latLonClick.lat,
                    lon: latLonClick.lng,
                    valid_from: valid_from.unix(),
                    valid_to: valid_to.unix()
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
                    .catch(err => console.log("error", err));
            } else {
                this.setState({
                    currentEventIvi: {
                        spm: values.speed_limit,
                        valid_from: valid_from.unix(),
                        valid_to: valid_to.unix(),
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
            if (!newTraceDenmStart) {
                this.setState({ newTraceDenmStart: e.latlng, customCur: "add-end-zone-cur" })
            } else {
                let insideParking = PointInPolygon([currentEventDenm.lat, currentEventDenm.lon], polygonZone)

                if (insideParking) {
                    //AQUI ENEKO
                    //let points = routingService.getRouteParking(newTraceDenmStart.lat, newTraceDenmStart.lng, e.latlng.lat, e.latlng.lng);
                    let points = routingService.getRouteParkingTrackAlfon(newTraceDenmStart.lat, newTraceDenmStart.lng, e.latlng.lat, e.latlng.lng);

                    currentEventDenm.zones.push(points);
                    this.setState({ currentEventDenm, newTraceDenmStart: null, customCur: "add-start-zone-cur" });
                } else {

                    routingService.getRoute(newTraceDenmStart.lat, newTraceDenmStart.lng, e.latlng.lat, e.latlng.lng)
                        .then(response => {
                            currentEventDenm.zones.push(response.array);
                            if (response) this.setState({ currentEventDenm, newTraceDenmStart: null, customCur: "add-start-zone-cur" });
                        });
                }
            }
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
        else if (clickMapStatus === "relevance") {
            let insideParking = PointInPolygon([currentEventIvi.latitude, currentEventIvi.long], polygonZone)

            if (insideParking) {
                //AQUI ENEKO
                //let points = routingService.getRouteParking(currentEventIvi.latitude, currentEventIvi.long, e.latlng.lat, e.latlng.lng);
                let points = routingService.getRouteParkingTrackAlfon(currentEventIvi.latitude, currentEventIvi.long, e.latlng.lat, e.latlng.lng);

                currentEventIvi.relevance_zones.push(points);
                this.setState({ currentEventIvi });
            } else {

                routingService.getRoute(currentEventIvi.latitude, currentEventIvi.long, e.latlng.lat, e.latlng.lng)
                    .then(response => {
                        currentEventIvi.relevance_zones.push(response.array);
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
        const { tile_map, position, zoom, ivi, currentEventIvi, visibleIvi } = this.state;
        return (
            <Col span={24} style={{ padding: 0 }}>
                <Button style={{padding:'0px'}} type="primary" block>
                        <Link to="/login">Lista de rutas</Link>       
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
                            icon: ZoomControl,
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
                            removeZoneRelevance={(i) => this.removeZoneRelevance(i)}
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

                    <Control>
                        <Chat>
                        </Chat>
                    </Control>
                    
                    {ivi.map((objIvi, id) => <MarkerIvi objIvi={objIvi} key={`marker-ivi-${id}`} handleDelete={() => this.handleDeleteIvi(objIvi.id)} />)}

                    </Map>
            </Col>
        );
    }

}

export default MapTodo;
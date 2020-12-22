import React from "react";
//To request HTTP
import axios from "axios";

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
import { Col, Select, Button } from 'antd';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'

//Variables globales
import { globals } from "../variables/config.js";



const { Option } = Select;

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


            //Start position and zoom
            //position: [43.290863, -1.983663],
            position: [43.34659, -1.78743],
            zoom: 15,




        };
    }
    //FUNCIONES APARTIR DE AQUI

    componentDidMount() {
        //Get token to request
        let objUser = JSON.parse(localStorage.getItem("currentUser"));
        let token = (objUser && objUser.token) ? objUser.token : "";

        //Get all events
        axios.get(globals.url_api + 'data', {
            headers: { 'x-access-token': token }
        })
            .then(res => (res.status === 200) && this.setState({ poi: res.data.poi, denm: res.data.denm, ivi: res.data.ivi }));
    }

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



    //RENDER PARA LO VISUAL
    render() {
        const { tile_map, position, zoom } = this.state;
        return (
            <Col span={24} style={{ padding: 0 }}>
                {/*Map object*/}
                <Map
                    center={position}
                    zoom={zoom}
                    style={{ height: 'calc(100vh - 70px)' }}
                    onClick={this.handleNewZone}
                    zoomControl={false}
                    contextmenu={true}
                    contextmenuWidth={250}
                    maxZoom={20}
                    //Menu on right click
                    contextmenuItems={[
                        
                        {
                            text: 'Prueba',
                            icon: ZoomControl,
                            
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
                    </Map>
            </Col>
        );
    }

}

export default MapTodo;
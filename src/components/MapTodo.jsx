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
import { Col, Select, Button, Radio, Drawer } from 'antd';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'

//Variables globales
import { globals } from "../variables/config.js";


//Componentes
import Chat from "./Chat.jsx";


const { Option } = Select;

const RadioGroup = Radio.Group;

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
            placement: 'left' 


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


    //RENDER PARA LO VISUAL
    render() {
        const { tile_map, position, zoom } = this.state;
        return (
            <Col span={24} style={{ padding: 0 }}>
                
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


                    </Map>
            </Col>
        );
    }

}

export default MapTodo;
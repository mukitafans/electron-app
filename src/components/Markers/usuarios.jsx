import React from "react";

import icono from '../../assets/img/logo.png'

//Leaflet
import { Marker, Popup, Polyline } from 'react-leaflet'
import L, { marker } from 'leaflet';

import moment from "moment"; //To use dates

import { Row, Col, Card, Icon, Avatar, Divider, Popconfirm, Button } from 'antd';

const { Meta } = Card;

class MarkerUsuarios extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            objIvi: null
        };
    }

    //Get Ivi
    componentDidMount() {
        this.setState({ objIvi: this.props.objIvi });
    }

    //On change Ivi
    componentDidUpdate(prevProps) {
        if (this.props.objIvi !== prevProps.objIvi) {
            this.setState({ objIvi: this.props.objIvi });
        }
      
    }

    render() {
        const { objIvi } = this.state;

        //If valid object
        if (objIvi && objIvi.lat && objIvi.log) {

            //Header pop up
            let title = objIvi.usuario,
                subimage = icono;
               
            //Marker icon speed    
            const markerSpeed = L.icon({
                iconUrl: icono,
                markerColor: 'blue', prefix: 'fa',
                iconSize: [30, 30],
                iconAnchor: [15, 15],
                
                
            });

         

            return (
                <div>

                    {/* Show marker */}
                    <Marker position={[objIvi.lat, objIvi.log]} icon={markerSpeed}>

                        {/* Show pop up */}
                        <Popup closeButton={false} >
                            <Card size="small" bordered={false} style={{ width: 300 }}>
                                {/* Header of pop up */}
                                <Meta
                                    avatar={
                                        <Avatar size={50} shape="square" src={subimage} />
                                    }
                                    title={title}
                                    description={  <Col className="col_text" span={24}><span className="col_label">{"Puntuacion del usuario: "}</span>
                                        {objIvi.puntuacion_total}
                                    </Col>}
                                />
                                <Divider />
                                {/* Show data */}
                                <Row gutter={[16, 8]}>
                                    
                                    <Col className="col_text" span={24}>
                                    <span className="col_label">{"Ruta activa: "}</span>
                                        {objIvi.ruta_activa}
                                    </Col>
                                    
                                    <Col className="col_text" span={24}>
                                    <span className="col_label">{"Email del usuario: "}</span>
                                        {objIvi.email}
                                    </Col>
                                    {/*
                                    <Col className="col_text" span={12}>
                                        <span className="col_label">{"Lat: "}</span>
                                        {objIvi.latitude && objIvi.latitude.toFixed(5)}
                                    </Col>
                                    <Col className="col_text" span={12}>
                                        <span className="col_label">{"Lon: "}</span>
                                        {objIvi.long && objIvi.long.toFixed(5)}
                                    </Col>
                                    */}
                                    
                                </Row>
                                <Divider />

                        
                            </Card>
                        </Popup>
                    </Marker>
                </div>
            );
        }
        else return null


    }

}

export default MarkerUsuarios;

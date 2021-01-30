import React from "react";

import icono from '../../assets/img/marker.png'

//Leaflet
import { Marker, Popup, Polyline } from 'react-leaflet'
import L from 'leaflet';

import moment from "moment"; //To use dates

import { Row, Col, Card, Icon, Avatar, Divider, Popconfirm, Button } from 'antd';

const { Meta } = Card;

class MarkerIvi extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            objIvi: null,
            rutas: null,
            puntos: null
        };
    }

    //Get Ivi
    componentDidMount() {
        this.setState({ objIvi: this.props.objIvi, puntos: this.props.puntos, rutas: this.props.rutas });
    }

    //On change Ivi
    componentDidUpdate(prevProps) {
        if (this.props.objIvi !== prevProps.objIvi) {
            this.setState({ objIvi: this.props.objIvi });
        }
        if (this.props.puntos !== prevProps.puntos) {
            this.setState({ puntos: this.props.puntos });
        }
        
        if (this.props.rutas !== prevProps.rutas) {
            this.setState({ rutas: this.props.rutas });
        }
    }

    render() {
        const { objIvi, puntos, rutas } = this.state;

        //If valid object
        if (puntos && puntos.lat && puntos.log) {

            //Header pop up
            let title = "Ruta "+puntos.nombre,
                subimage = icono;
               
            //Marker icon speed    
            const markerSpeed = L.icon({
                iconUrl: icono,
                markerColor: 'blue', prefix: 'fa',
                iconSize: [30, 30],
                iconAnchor: [15, 15],
                
                
            });

         
            //Detection data 
                      
            let detection_array = JSON.parse(puntos.ruta);
            let obj_detection = [];
            detection_array && detection_array.forEach(array => {
                let newObj = [];
                array.forEach(el => {
                    newObj.push({ lat: el[1], lng: el[0] })
                });
                obj_detection.push(newObj);
            });

            return (
                <div>
                    {/* Show traces detection and relevance */}
                    <Polyline positions={obj_detection} color="#FEB41C" weight={12} opacity={0.6} />

                    {/* Show marker */}
                    <Marker position={[puntos.lat, puntos.log]} icon={markerSpeed}>

                        {/* Show pop up */}
                        <Popup closeButton={false} >
                            <Card size="small" bordered={false} style={{ width: 300 }}>
                                {/* Header of pop up */}
                                <Meta
                                    avatar={
                                        <Avatar size={50} shape="square" src={subimage} />
                                    }
                                    title={title}
                                  
                                />
                                <Divider />
                                {/* Show data */}
                                <Row gutter={[16, 8]}>
                                
                                    <Col className="col_text" span={24}>
                                        <span className="col_label">{"Localizacion: "}</span>
                                        {objIvi.nombre}
                                    </Col>
                                    <Col className="col_text" span={24}>
                                        <span className="col_label">{"Nombre ruta: "}</span>
                                        {rutas.nombre}
                                    </Col>
                                    <Col className="col_text" span={24}>
                                        <span className="col_label">{"Transporte: "}</span>
                                        {rutas.transporte}
                                    </Col> 
                                    <Col className="col_text" span={12}>
                                        <span className="col_label">{"Area total: "}</span>
                                        {puntos.area_total && puntos.area_total.toFixed(5)}
                                    </Col>
                                   
                                    
                                </Row>
                                <Divider />

                                {/* To delete event */}
                                <Row gutter={[16, 16]}>
                                    <Col className="col_text" span={24}>
                                        <Popconfirm
                                            title="Are you sure delete this event?"
                                            onConfirm={this.props.handleDelete}
                                            //onCancel={cancel}
                                            okText="Yes"
                                            cancelText="No"
                                        >
                                            <Button type="danger" ghost block>
                                                <Icon type="delete" key="delete" /> Delete
                                        </Button>
                                        </Popconfirm>
                                    </Col>
                                </Row>
                            </Card>
                        </Popup>
                    </Marker>
                </div>
            );
        }
        else return null


    }

}

export default MarkerIvi;

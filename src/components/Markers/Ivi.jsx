import React from "react";

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
        if (objIvi && objIvi.latitude && objIvi.long) {

            //Header pop up
            let title = "Speed limit",
                subimage = "/images/speed_limit/" + objIvi.spm + ".png";

            //Marker icon speed    
            const markerSpeed = L.icon({
                iconUrl: "/images/speed_limit/" + objIvi.spm + ".png",
                iconSize: [30, 30],
                iconAnchor: [15, 15],
            });

            //Relevance data
            let relevace_array = JSON.parse(objIvi.relevance_points);
            let obj_relevance = [];
            relevace_array && relevace_array.forEach(array => {
                let newObj = [];
                array.forEach(el => {
                    newObj.push({ lat: el[1], lng: el[0] })
                });
                obj_relevance.push(newObj);
            });

            //Detection data
            let detection_array = JSON.parse(objIvi.detection_points);
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
                    <Polyline positions={obj_relevance} color="#FF720F" weight={12} opacity={0.6} />

                    {/* Show marker */}
                    <Marker position={[objIvi.latitude, objIvi.long]} icon={markerSpeed}>

                        {/* Show pop up */}
                        <Popup closeButton={false} >
                            <Card size="small" bordered={false} style={{ width: 300 }}>
                                {/* Header of pop up */}
                                <Meta
                                    avatar={
                                        <Avatar size={50} shape="square" src={subimage} />
                                    }
                                    title={title}
                                    description={moment(parseInt(objIvi.timestamp) * 1000).format("YYYY/MM/DD HH:mm:ss")}
                                />
                                <Divider />
                                {/* Show data */}
                                <Row gutter={[16, 8]}>
                                    <Col className="col_text" span={24}>
                                        <span className="col_label">{"Valid from: "}</span>
                                        {moment(parseInt(objIvi.valid_from) * 1000).format("YYYY/MM/DD HH:mm:ss")}
                                    </Col>
                                    <Col className="col_text" span={24}>
                                        <span className="col_label">{"Valid to: "}</span>
                                        {moment(parseInt(objIvi.valid_to) * 1000).format("YYYY/MM/DD HH:mm:ss")}
                                    </Col>
                                    <Col className="col_text" span={12}>
                                        <span className="col_label">{"Lat: "}</span>
                                        {objIvi.latitude && objIvi.latitude.toFixed(5)}
                                    </Col>
                                    <Col className="col_text" span={12}>
                                        <span className="col_label">{"Lon: "}</span>
                                        {objIvi.long && objIvi.long.toFixed(5)}
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

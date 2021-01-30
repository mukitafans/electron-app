import React from "react";
import img from '../../assets/img/logo.png'
import { Row, Col, Card, Icon, Avatar, Divider, Button, List, Radio } from 'antd';
import moment from 'moment';

const { Meta } = Card;

class PanelIviPunto extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            objIvi2: null
        };
    }

    componentDidMount() {
        this.setState({ objIvi2: this.props.objIvi2 });
    }

    componentDidUpdate(prevProps) {
        if (this.props.objIvi2 !== prevProps.objIvi2) {
            this.setState({ objIvi2: this.props.objIvi2 });
        }
    }

    render() {
        const { objIvi2 } = this.state

        if (objIvi2 && objIvi2.lat && objIvi2.log) {

            let title = "Insercion de ruta",
                subimage = img;

            return (
                <Card size="small" title="Add traces and save" bordered={false} style={{ width: 500 }}>
                    <Meta
                        avatar={
                            <Avatar size={50} shape="square" src={subimage} />
                        }
                        title={title}
                        description={"Introduce todos los campos"}
                    />
                    <Divider />
                    <Row gutter={[16, 8]}>
                      
                        <Col className="col_text" span={8}>
                        <span className="col_label">{"Localizacion: "}</span>
                            {objIvi2.localizacion}
                            
                        </Col>
                        <Col className="col_text" span={8}>
                        <span className="col_label">{"Nombre ruta: "}</span>
                            {objIvi2.rutaNombre}
                            
                        </Col>
                        <Col className="col_text" span={8}>
                        <span className="col_label">{"Nombre punto: "}</span>
                            {objIvi2.puntoNombre}
                            
                        </Col>
                       
                        <Col className="col_text" span={12}>
                            <span className="col_label">{"Lat: "}</span>
                            {objIvi2.lat && objIvi2.lat.toFixed(5)}
                        </Col>
                        <Col className="col_text" span={12}>
                            <span className="col_label">{"Lon: "}</span>
                            {objIvi2.log && objIvi2.log.toFixed(5)}
                        </Col>
                    </Row>
                    <Divider />
                    <Row gutter={[16, 16]}>
                        <Col className="col_text" span={24}>
                            <div style={{ marginTop: 16 }}>
                                <h4>Preguntas del punto</h4>
                            </div>
                        </Col>
                    </Row>
                    <Col className="col_text" span={8}>
                        <span className="col_label">{"Pregunta: "}</span>
                            {objIvi2.preguntaPunto}
                            
                        </Col>
                        <Col className="col_text" span={8}>
                        <span className="col_label">{"Respuesta 1: "}</span>
                            {objIvi2.respuesta1}
                            
                        </Col>
                        <Col className="col_text" span={8}>
                        <span className="col_label">{"Respuesta 2: "}</span>
                            {objIvi2.respuesta2}
                            
                        </Col>
                        <Col className="col_text" span={8}>
                        <span className="col_label">{"Respuesta3: "}</span>
                            {objIvi2.respuesta3}
                            
                        </Col>
                        <Col className="col_text" span={8}>
                        <span className="col_label">{"Respuesta Correcta: "}</span>
                            {objIvi2.respuestaCorrecta}
                        </Col>
                    <Divider />
                    <Row gutter={[16, 16]}>
                        <Col className="col_text" span={16}>
                            <Button type="primary" icon="plus-square" onClick={this.props.onCreate} ghost block>Add event</Button>
                        </Col>
                        <Col className="col_text" span={8}>
                            <Button type="danger" icon="stop" onClick={this.props.onCancel} ghost block></Button>
                        </Col>
                    </Row>
                </Card>
            );
        }
        else return null
    }

}

export default PanelIviPunto;

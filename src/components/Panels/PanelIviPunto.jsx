import React from "react";
import img from '../../assets/img/logo.png'
import { Row, Col, Card, Icon, Avatar, Divider, Button, List, Radio } from 'antd';
import moment from 'moment';

const { Meta } = Card;

class PanelIvi2 extends React.Component {
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
                        <span className="col_label">{"Transporte: "}</span>
                            {objIvi2.transporte}
                            
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
                                <Radio.Group defaultValue="detection" size="small" style={{ display: "block" }} onChange={(val) => this.props.onChangeRadio(val.target.value)}>
                                    <Radio.Button value="detection">Rutas</Radio.Button>
                                   {/*NOTAS
                                   <Radio.Button value="relevance">Relevance</Radio.Button>
                                   */} 
                                </Radio.Group>
                            </div>
                        </Col>
                    </Row>
                    <Row gutter={[16, 16]}>
                        <Col className="col_text" span={24}>
                            <List
                                size="small"
                                header={<div>Rutas</div>}
                                bordered
                                dataSource={objIvi2.rutas}
                                renderItem={(_, i) => <List.Item actions={[<span key={"list-zone-det-delete" + i}><Icon type="delete" onClick={() => this.props.removeZoneDetection(i)} style={{ fontSize: '16px', color: '#ff7875' }} /></span>]}>{"Zone detection " + (i + 1)}</List.Item>}
                            />
                        </Col>
                       
                    </Row>
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

export default PanelIvi2;

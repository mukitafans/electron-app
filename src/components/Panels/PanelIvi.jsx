import React from "react";

import { Row, Col, Card, Icon, Avatar, Divider, Button, List, Radio } from 'antd';
import moment from 'moment';

const { Meta } = Card;

class PanelIvi extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            objIvi: null
        };
    }

    componentDidMount() {
        this.setState({ objIvi: this.props.objIvi });
    }

    componentDidUpdate(prevProps) {
        if (this.props.objIvi !== prevProps.objIvi) {
            this.setState({ objIvi: this.props.objIvi });
        }
    }

    render() {
        const { objIvi } = this.state

        if (objIvi && objIvi.latitude && objIvi.long) {

            let title = "Speed limit",
                subimage = "/images/speed_limit/" + objIvi.spm + ".png";

            return (
                <Card size="small" title="Add traces and save" bordered={false} style={{ width: 500 }}>
                    <Meta
                        avatar={
                            <Avatar size={50} shape="square" src={subimage} />
                        }
                        title={title}
                        description={"Speed limit"}
                    />
                    <Divider />
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
                                header={<div>Detection Zones</div>}
                                bordered
                                dataSource={objIvi.detection_zones}
                                renderItem={(_, i) => <List.Item actions={[<span key={"list-zone-det-delete" + i}><Icon type="delete" onClick={() => this.props.removeZoneDetection(i)} style={{ fontSize: '16px', color: '#ff7875' }} /></span>]}>{"Zone detection " + (i + 1)}</List.Item>}
                            />
                        </Col>
                        <Col className="col_text" span={24}>
                            <List
                                size="small"
                                header={<div>Relevance Zones</div>}
                                bordered
                                dataSource={objIvi.relevance_zones}
                                renderItem={(_, i) => <List.Item actions={[<span key={"list-zone-rel-delete" + i}><Icon type="delete" onClick={() => this.props.removeZoneRelevance(i)} style={{ fontSize: '16px', color: '#ff7875' }} /></span>]}>{"Zone relevance " + (i + 1)}</List.Item>}
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

export default PanelIvi;

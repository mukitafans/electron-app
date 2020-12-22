import React from "react";

import MapTodo from '../components/MapTodo.jsx'

import { Row } from 'antd';

class Map extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <Row type="flex" justify="space-between" gutter={12} style={{ margin: 0, marginTop: "2px" }} >
                <MapTodo />
            </Row>
        );
    }

}

export default Map;
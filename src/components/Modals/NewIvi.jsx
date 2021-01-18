import React from "react";

import { Modal, Form, Select, DatePicker, Switch } from 'antd';

import moment from "moment"; //For use dates

const { Option } = Select;

const { RangePicker } = DatePicker;

const IviCreateForm = Form.create({ name: 'form_ivi_in_modal' })(
    // eslint-disable-next-line
    class extends React.Component {

        constructor(props) {
            super(props)
            this.state = {
                speed_selected: 30 //Default speed
            };
        }

        render() {
            const { visible, onCancel, onCreate, form } = this.props;
            const { speed_selected } = this.state;
            const { getFieldDecorator } = form;

            return (
                <Modal
                    visible={visible}
                    title={"Formulario de insercion de rutas"}
                    okText="Añadir"
                    onCancel={onCancel}
                    onOk={onCreate}
                >
                    <Form layout="vertical">

                        <Form.Item label="Speed limit">
                            
                        </Form.Item>

                       

                        <Form.Item label="Añadir ruta?" className="collection-create-form_last-form-item">
                            {getFieldDecorator('traces', { valuePropName: "checked", initialValue: true })(
                                <Switch checkedChildren="Yes" unCheckedChildren="No" />,
                            )}
                        </Form.Item>

                        <img className="signals" src={""} alt="Signal"></img>
                    </Form>
                </Modal>
            );
        }
    },
);

export default IviCreateForm;
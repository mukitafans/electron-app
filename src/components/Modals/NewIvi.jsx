import React from "react";

import { Modal, Form, Select, DatePicker, Switch, Input } from 'antd';

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
                        <Form.Item label="Nombre de la localizacion" name="localizacion">
                        {getFieldDecorator('localizacion', {
                                    //initialValue: speed_selected,
                                    rules: [{ required: true, message: 'Introduce el nombre de la localizacion!' }],
                                })(
                                    <Input/>
                                )}
                        </Form.Item>
                        <Form.Item label="Area de la localizacion" name="area">
                        {getFieldDecorator('area', {
                                    //initialValue: speed_selected,
                                    rules: [{ required: true, message: 'Introduce el area de la localizacion!' }],
                                })(
                                    <Input/>
                                )}
                        </Form.Item>
                        <Form.Item label="Nombre de la ruta" name="rutaNombre">
                        {getFieldDecorator('rutaNombre', {
                                    //initialValue: speed_selected,
                                    rules: [{ required: true, message: 'Introduce el nombre de la ruta!' }],
                                })(
                                    <Input/>
                                )}
                        </Form.Item>
                        <Form.Item label="Transporte" name="transporte">
                        {getFieldDecorator('transporte', {
                                    //initialValue: speed_selected,
                                    rules: [{ required: true, message: 'Introduce el transporte de la ruta!' }],
                                })(
                                    <Input/>
                                )}
                        </Form.Item>
                        <Form.Item label="Nombre de el punto" name="puntoNombre">
                        {getFieldDecorator('puntoNombre', {
                                    //initialValue: speed_selected,
                                    rules: [{ required: true, message: 'Introduce el nombre de el punto!' }],
                                })(
                                    <Input/>
                                )}
                        </Form.Item>
                        

                        <Form.Item label="Añadir ruta?" className="collection-create-form_last-form-item">
                            {getFieldDecorator('traces', { valuePropName: "checked", initialValue: true })(
                                <Switch checkedChildren="Yes" unCheckedChildren="No" />,
                            )}
                        </Form.Item>

                    </Form>
                </Modal>
            );
        }
    },
);

export default IviCreateForm;
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
                                    <Input placeholder="Introduce el nombre de la localizacion"/>
                                )}
                        </Form.Item>
                        <Form.Item label="Nombre de la ruta" name="rutaNombre">
                        {getFieldDecorator('rutaNombre', {
                                    //initialValue: speed_selected,
                                    rules: [{ required: true, message: 'Introduce el nombre de la ruta!' }],
                                })(
                                    <Input placeholder="Introduce el nombre de la ruta"/>
                                )}
                        </Form.Item>
                        <Form.Item label="Transporte" name="transporte">
                        {getFieldDecorator('transporte', {
                                    //initialValue: speed_selected,
                                    rules: [{ required: true, message: 'Introduce el transporte de la ruta!' }],
                                })(
                                <Select placeholder="Selecciona el tipo de tranporte" >
                                    <Option value="pie">A pie</Option>
                                    <Option value="coche">Vehiculo motorizado</Option>
                                    <Option value="bici">Bicicleta</Option>
                                </Select>,
                                )}
                        </Form.Item>
                        <Form.Item label="Nombre de el punto" name="puntoNombre">
                        {getFieldDecorator('puntoNombre', {
                                    //initialValue: speed_selected,
                                    rules: [{ required: true, message: 'Introduce el nombre de el punto!' }],
                                })(
                                    <Input placeholder="Introduce el nombre del punto"/>
                                )}
                        </Form.Item>

                        <Form.Item label="Pregunta del punto" name="preguntaPunto">
                        {getFieldDecorator('preguntaPunto', {
                                    //initialValue: speed_selected,
                                    rules: [{ required: true, message: 'Introduce la pregunta del punto!' }],
                                })(
                                    <Input placeholder="Introduce la pregunta con interrogantes"/>
                                )}
                        </Form.Item>

                        <Form.Item label="Respuesta 1" name="respuesta1">
                        {getFieldDecorator('respuesta1', {
                                    //initialValue: speed_selected,
                                    rules: [{ required: true, message: 'Introduce la respuesta del punto!' }],
                                })(
                                    <Input placeholder="Introduce la respuesta"/>
                                )}
                        </Form.Item>
                        <Form.Item label="Respuesta 2" name="respuesta2">
                        {getFieldDecorator('respuesta2', {
                                    //initialValue: speed_selected,
                                    rules: [{ required: true, message: 'Introduce la respuesta del punto!' }],
                                })(
                                    <Input placeholder="Introduce la respuesta"/>
                                )}
                        </Form.Item>

                        <Form.Item label="Respuesta 3" name="respuesta3">
                        {getFieldDecorator('respuesta3', {
                                    //initialValue: speed_selected,
                                    rules: [{ required: true, message: 'Introduce la respuesta del punto!' }],
                                })(
                                    <Input placeholder="Introduce la respuesta"/>
                                )}
                        </Form.Item>
                     
                        <Form.Item label="Respuesta Correcta" name="respuestaCorrecta">
                        {getFieldDecorator('respuestaCorrecta', {
                                    //initialValue: speed_selected,
                                    rules: [{ required: true, message: 'Introduce la respuesta del punto!' }],
                                })(
                                <Select placeholder="Selecciona la respuesta correcta" >
                                    <Option value="0">Respuesta 1</Option>
                                    <Option value="1">Respuesta 2</Option>
                                    <Option value="2">Respuesta 3</Option>
                                </Select>,
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
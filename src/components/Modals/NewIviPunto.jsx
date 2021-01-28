import React from "react";

import { Modal, Form, DatePicker, Switch, Input } from 'antd';

import moment from "moment"; //For use dates
import Select from 'react-select';
import axios from 'axios';

const { Option } = Select;

const { RangePicker } = DatePicker;

const IviCreateForm2 = Form.create({ name: 'form_ivi_in_modal2' })(
    // eslint-disable-next-line
    class extends React.Component {

        constructor(props) {
            super(props)
            this.state = {
                selectOptions : [],
                nombre: ''
            };
        }
        componentDidMount(){
            this.getOptions()
            this.getOptions2()
        }
        /*
        componentDidUpdate(){
            this.getOptions()
            this.getOptions2()
        }*/
        async getOptions(){
            const res = await axios.get('http://137.116.219.96:80/localizaciones/all')
            const data = res.data
        
            const options = data.map(d => ({
              "value" : d.nombre,
              "label" : d.nombre
        
            }))
        
            this.setState({selectOptions: options})
        
          } //http://137.116.219.96:80/localizaciones/{nombre}
        async getOptions2(e){
            console.log(e)
            const res = await axios.get(`http://137.116.219.96:80/rutas/buscarRutasporloc/${e}`)
            const data = res.data
        
            const options = data.map(d => ({
                "value" : d.nombre,
                "label" : d.nombre
        
            }))
        
            this.setState({selectOptions2: options})
    
        }
       
        handleChange(e){
            console.log(e)
            this.setState({nombre:e.value, nombre:e.label})
        }

        render() {
            const { visible, onCancel, onCreate, form } = this.props;
            const { speed_selected } = this.state;
            const { getFieldDecorator } = form;

            return (
                <Modal
                    visible={visible}
                    title={"Formulario de insercion de puntos"}
                    okText="Añadir"
                    onCancel={onCancel}
                    onOk={onCreate}
                >
                    <Form layout="vertical">
                        <Form.Item label="Selecciona la localizacion" name="localizacion">
                        {getFieldDecorator('localizacion', {
                                    initialValue: 'Hondarribia',
                                    rules: [{ required: true, message: 'Introduce el nombre de la localizacion!' }],
                                })(
                                    <Select options={this.state.selectOptions} onChange={(e) =>{this.getOptions2(e.value); this.handleChange.bind(this)}  } />
                                )}
                        </Form.Item>
                        <Form.Item label="Selecciona la ruta" name="rutaNombre">
                        {getFieldDecorator('rutaNombre', {
                                    //initialValue: 'Hondarribia',
                                    rules: [{ required: true, message: 'Introduce el nombre de la ruta!' }],
                                })(
                                    <Select options={this.state.selectOptions2} onChange={(e) =>{ this.getOptions2(this)}, this.handleChange.bind(this) } />
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

export default IviCreateForm2;
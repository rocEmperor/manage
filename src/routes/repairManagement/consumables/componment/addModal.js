'use strict';
import React from 'react';
import { Modal, Row, Col, Form, Input, Select, Button, Icon } from "antd";
const Option = Select.Option;
const FormItem = Form.Item;
import "./modal.less"
let k = 0
class AddModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    }
  }
  handleOk() {
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      let list = []
      for (let i = 0; i < this.state.data.length; i++) {
        let s1 = {}
        s1.cate_id = values[`cate_id-${i}-${k}`];
        s1.name = values[`name-${i}-${k}`];
        s1.num = values[`num-${i}-${k}`];
        s1.price = values[`price-${i}-${k}`];
        s1.price_unit = values[`price_unit-${i}-${k}`];
        if (this.props.edit) {
          s1.material_id = this.state.data[i].id
        }
        list.push(s1)
      }
      this.props.handleOk(list)
    });
  }
  componentDidMount() {
    this.setState({
      data: this.props.data
    })
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!nextProps.edit && !this.props.visible) {  //新增
      this.setState({
        data: [{
          cate_id: "",
          name: "",
          num: "",
          price: "",
          price_unit: ""
        }]
      })
    }
    if (this.props.data != nextProps.data) {
      if (nextProps.edit) { //编辑
        this.setState({
          data: nextProps.data
        })
      }
    }
  }
  handleCancel() {
    this.props.handleCancel()
  }
  add() {
    k++
    const arr = this.state.data;
    arr.push({
      cate_id: "",
      name: "",
      num: "",
      price: "",
      price_unit: ""
    })
    this.setState({
      data: arr
    })
  }
  remove(index) {
    k++
    const arr = this.state.data;
    Array.prototype.del = function (index) {
      if (isNaN(index) || index >= this.length) {
        return false;
      }
      for (let i = 0, n = 0; i < this.length; i++) {
        if (this[i] != this[index]) {
          this[n++] = this[i];
        }
      }
      this.length -= 1;
    };
    arr.del(index)
    this.setState({
      data: arr
    })
  }
  change(value, index, e) {
    const arr = this.state.data;
    arr[index][`${value}`] = e.target.value
    this.setState({
      data: arr
    })
  }
  changeSelect(name, index, value) {
    if ((typeof name == 'string')) {
      let arrs = this.state.data;
      arrs[index][`${name}`] = value
      this.setState({
        data: arrs
      }, () => {
      })
    }
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const title = this.props.edit ? "耗材编辑" : "耗材新增"

    const formItems = this.state.data.map((value, index) => {
      return (
        <Row key={index}>
          <Col span={5}>
            <FormItem label={''}>
              {getFieldDecorator(`cate_id-${index}-${k}`, {
                rules: [{
                  required: true,
                  message: '请选择'
                }],
                initialValue: value.cate_id,
              })(
                <Select
                  style={{ width: '80%' }}
                  placeholder="请选择"
                  onChange={this.changeSelect.bind(this, "cate_id", index)}
                >
                  {this.props.materialType.map((value, index) => {
                    return <Option value={value.id} key={index}>{value.name}</Option>
                  })}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={5}>
            <FormItem label={''}>
              {getFieldDecorator(`name-${index}-${k}`, {
                rules: [{
                  required: true,
                  message: '请输入',
                }],
                initialValue: value.name,
                onChange: this.change.bind(this, "name", index),
              })(
                <Input placeholder="请输入" style={{ width: '80%' }} />
              )}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem label={''}>
              {getFieldDecorator(`price-${index}-${k}`, {
                rules: [{
                  required: true,
                  message: '请输入正确单价',
                  pattern: /^[+]?[\d]+(([\.]{1}[\d]+)|([\d]*))$/
                }],
                initialValue: value.price,
                onChange: this.change.bind(this, "price", index),
              })(
                <Input type="number" min="0" placeholder="请输入" style={{ width: '90%' }} />
              )}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem label={''}>
              {getFieldDecorator(`price_unit-${index}-${k}`, {
                rules: [{
                  required: true,
                  message: '请选择',
                }],
                initialValue: value.price_unit,
              })(
                <Select
                  style={{ width: '90%' }}
                  placeholder="请选择"
                  onChange={this.changeSelect.bind(this, "price_unit", index)}
                >
                  {this.props.materialUnit.map((value, index) => {
                    return <Option value={value.key.toString()} key={index}>{value.value}</Option>
                  })}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem label={''}>
              {getFieldDecorator(`num-${index}-${k}`, {
                rules: [{
                  required: true,
                  message: '请输入正确数量',
                  pattern: /^[+]?[\d]+(([\.]{1}[\d]+)|([\d]*))$/
                }],
                initialValue: value.num,
                onChange: this.change.bind(this, "num", index),
              })(
                <Input placeholder="请输入" min="0" type="number" style={{ width: '90%' }} />
              )}
            </FormItem>
          </Col>
          <Col span={2}>
            {this.props.edit == false ? <Icon
              style={{
                cursor: "pointer",
                position: "relative",
                top: "4px",
                fontSize: "24px",
                color: "#999",
                transition: "all .3s"
              }}
              type="minus-circle-o"
              onClick={this.remove.bind(this, index)}
            /> : ""}
          </Col>
        </Row>
      )
    })
    return (
      <Modal
        title={title}
        visible={this.props.visible}
        onOk={this.handleOk.bind(this)}
        onCancel={this.handleCancel.bind(this)}
      >
        <Row>
          <Col span={5}><div className="lable">材料/服务分类</div></Col>
          <Col span={5}><div className="lable">材料/服务名称</div></Col>
          <Col span={4}><div className="lable">单价</div></Col>
          <Col span={4}><div className="lable">单位</div></Col>
          <Col span={4}><div className="lable">数量</div></Col>
        </Row>
        {formItems}
        {this.props.edit == false ?
          <FormItem>
            <Button type="dashed" onClick={this.add.bind(this)} className="addbtn">
              <Icon type="plus" /> 新增
            </Button>
          </FormItem> : ""
        }
      </Modal>
    )
  }
}
AddModal = Form.create({})(AddModal);
export default AddModal;

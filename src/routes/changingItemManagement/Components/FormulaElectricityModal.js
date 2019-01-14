import React from 'react'
import {Row, Col, Button, Modal, Form, Input, Select,InputNumber,message } from 'antd'
const FormItem = Form.Item;
const Option = Select.Option;
const formItemLayout1 = {
  labelCol: {
    span: 12
  },
  wrapperCol: {
    span: 12
  }
};
const formItemLayout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 8
  }
};
class FormulaElectricityModal extends React.Component {
  constructor (props) {
    super(props);
    this.handleCancel1 = this.handleCancel1.bind(this);
    this.handleOnSubmit= this.handleOnSubmit.bind(this);
    this.state={
      type:''
    }
  }
  componentDidMount (){
    let { items } = this.props;
    this.setState({
      type: items ? items.type : ''
    })
  }
  handleOnSubmit (e) {
    this.props.form.validateFields((errors, values) => {
      if (errors) {
        return;
      }
      if(Number(this.props.form.getFieldValue('phase_list1')) >= Number(this.props.form.getFieldValue('phase_list3'))){
        message.error('二档用量需大于一档用量',3);
      }else if(Number(this.props.form.getFieldValue('price1'))<=0.01){
        message.error('金额数值不能低于0.01',3)
      }else{

        e.preventDefault();
        this.props.form.validateFields()
        let phase_list = [
          {"ton":this.props.form.getFieldValue('phase_list1'),"price":Number(this.props.form.getFieldValue('phase_list2')) || ''},
          {"ton":this.props.form.getFieldValue('phase_list3'),"price":Number(this.props.form.getFieldValue('phase_list4')) || ''},
          {"ton":"0","price":Number(this.props.form.getFieldValue('phase_list6')) || ''}
        ];
        this.props.onSubmit(
          this.props.form.getFieldValue('type'),
          this.props.form.getFieldValue('price1'),
          phase_list,
          this.props.form.getFieldValue('del_decimal_way'),
          this.props.form.getFieldValue('calc_rule')
        )
      }

    })
  }

  handleCancel1 () {
    this.props.form.resetFields();
    this.props.handleCancel1();
    this.setState({
      type: this.props.items.type
    })
  }
  handleChange (value) {
    this.setState({
      type: value
    })
  }
  render () {
    let items = this.props.items;
    return (
      <div>
        <Modal
          title="计费标准设置"
          visible={this.props.visible}
          onOk={this.props.onOk}
          onCancel={this.handleCancel1}
          footer={[
            <Button key="back" size="large" onClick={this.handleCancel1}>
              关闭
            </Button>,
            <Button key="submit" type="primary" size="large" loading={this.props.loading} onClick={this.handleOnSubmit}>
              保存
            </Button>,
          ]}
        >
          <Form onSubmit={this.handleOnSubmit}>
            <FormItem {...formItemLayout} label="计算公式:">
              {this.props.form.getFieldDecorator('type', {
                rules: [{
                  required: true,
                  message: '计算公式不能为空'
                }],
                initialValue: items ? items.type : ''
              })(
                <Select onChange={this.handleChange.bind(this)} placeholder="请选择计算公式">
                  <Option key={1} value="1">固定价格</Option>
                  <Option key={2} value="2">阶梯价格</Option>
                </Select>
              )}
            </FormItem>
            {this.state.type == 1 ?
              <FormItem label="标准单价：" {...formItemLayout} >
                {this.props.form.getFieldDecorator('price1', {
                  rules: [{
                    pattern: /(^[1-9]([0-9]){1,4}\.\d{1,4}$)|(^[1-9]{1,5}\.\d{1,4}$)|(^0\.[0-9][1-9][0-9]{0,2}$)|(^0\.[0-9][0-9][1-9][0-9]{0,1}$)|(^0\.[0-9][0-9][0-9][1-9]$)|(^0\.[1-9]([0-9]){0,3}?$)|(^[1-9]{1,5}$)|(^[1-9]([0-9]){1,4}$)/,
                    required: true,
                    message: '格式错误（正整数或小数点后四位）'
                  }],
                  initialValue: items ? items.price : ''
                } )(
                  <InputNumber min={0}/>
                )}
              </FormItem> : ''
            }

            {this.state.type == 2 ?
              <div>
                <Row>
                  <Col span={12}>
                    <FormItem label="一档用量：" {...formItemLayout1} >
                      {this.props.form.getFieldDecorator('phase_list1', {
                        rules: [{
                          pattern: /^[1-9]+[0-9]*]*$/,
                          required: true,
                          message: '请输入大于0的整数'
                        }],
                        initialValue: items && items.phase_list.length > 0 ? items.phase_list[0].ton : ""
                      })(
                        <InputNumber min={0} />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="一档单价：" {...formItemLayout1} >
                      {this.props.form.getFieldDecorator('phase_list2', {
                        rules: [{
                          pattern: /(^[1-9]([0-9]){1,4}\.\d{1,4}$)|(^[1-9]{1,5}\.\d{1,4}$)|(^0\.[0-9][1-9][0-9]{0,2}$)|(^0\.[0-9][0-9][1-9][0-9]{0,1}$)|(^0\.[0-9][0-9][0-9][1-9]$)|(^0\.[1-9]([0-9]){0,3}?$)|(^[1-9]{1,5}$)|(^[1-9]([0-9]){1,4}$)/,
                          required: true,
                          message: '格式错误（正整数或小数点后四位）'
                        }],
                        initialValue: items && items.phase_list.length > 0 ? items.phase_list[0].price : ""
                      } )(
                        <Input addonBefore="￥" />
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem label="二档用量：" {...formItemLayout1} >
                      {this.props.form.getFieldDecorator('phase_list3', {
                        rules: [{
                          pattern: /^[1-9]+[0-9]*]*$/,
                          required: true,
                          message: '请输入大于0的整数'
                        }],
                        initialValue: items && items.phase_list.length > 0 ? items.phase_list[1].ton : ""
                      } )(
                        <InputNumber min={0} />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="二档单价：" {...formItemLayout1} >
                      {this.props.form.getFieldDecorator('phase_list4', {
                        rules: [{
                          pattern:/(^[1-9]([0-9]){1,4}\.\d{1,4}$)|(^[1-9]{1,5}\.\d{1,4}$)|(^0\.[0-9][1-9][0-9]{0,2}$)|(^0\.[0-9][0-9][1-9][0-9]{0,1}$)|(^0\.[0-9][0-9][0-9][1-9]$)|(^0\.[1-9]([0-9]){0,3}?$)|(^[1-9]{1,5}$)|(^[1-9]([0-9]){1,4}$)/,
                          required: true,
                          message: '格式错误（正整数或小数点后四位）'
                        }],
                        initialValue: items && items.phase_list.length > 0 ?items.phase_list[1].price : ""
                      } )(
                        <Input addonBefore="￥" />
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem label="三档用量：" {...formItemLayout1} >
                      {this.props.form.getFieldDecorator('phase_list5',{
                        rules: [{message: '只能输入整数'}],
                        initialValue:'∞'
                      } )(
                        <InputNumber min={0} disabled={true} />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="三档单价：" {...formItemLayout1} >
                      {this.props.form.getFieldDecorator('phase_list6', {
                        rules: [{
                          pattern: /(^[1-9]([0-9]){1,4}\.\d{1,4}$)|(^[1-9]{1,5}\.\d{1,4}$)|(^0\.[0-9][1-9][0-9]{0,2}$)|(^0\.[0-9][0-9][1-9][0-9]{0,1}$)|(^0\.[0-9][0-9][0-9][1-9]$)|(^0\.[1-9]([0-9]){0,3}?$)|(^[1-9]{1,5}$)|(^[1-9]([0-9]){1,4}$)/,
                          required: true,
                          message: '格式错误（正整数或小数点后四位）'
                        }],
                        initialValue: items && items.phase_list.length > 0 ? items.phase_list[2].price : ""
                      } )(
                        <Input addonBefore="￥" />
                      )}
                    </FormItem>
                  </Col>
                </Row>
              </div>: ''
            }
            <FormItem {...formItemLayout} label="计算规则:">
              {this.props.form.getFieldDecorator('calc_rule',{
                rules: [{
                  required: true,
                  message: '计算规则不能为空'
                }],
                initialValue: items ? items.calc_rule : ''
              })(
                <Select placeholder="请选择计算公式" notFoundContent="没有数据">
                  <Option value="1">整数</Option>
                  <Option value="2">小数点后一位</Option>
                  <Option value="3">小数点后两位</Option>
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="去尾公式:">
              {this.props.form.getFieldDecorator('del_decimal_way',{
                rules: [{
                  required: true,
                  message: '去尾方式不能为空'
                }],
                initialValue: items ? items.del_decimal_way : ''
              })(
                <Select placeholder="请选择去尾方式" notFoundContent="没有数据">
                  <Option value="1">四舍五入</Option>
                  <Option value="2">向上取整</Option>
                  <Option value="3">向下取整</Option>
                </Select>
              )}
            </FormItem>
          </Form>
        </Modal>
      </div>
    )
  }
}
FormulaElectricityModal = Form.create({})(FormulaElectricityModal)
export default FormulaElectricityModal

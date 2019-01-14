import React from 'react'
import { Button, Modal, Form, Input } from 'antd'

class FormulaEditWaterModal extends React.Component {
  constructor(props) {
    super(props);
    this.handleOnCancel = this.handleOnCancel.bind(this);
    this.handleOnSubmit = this.handleOnSubmit.bind(this);
  }

  handleOnCancel() {
    this.props.form.resetFields();
    this.props.onCancels()
  }

  handleOnSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) { return; }
      this.props.onSubmits(
        this.props.form.getFieldValue('waterPrice')
      );
    })
  }

  render() {
    //console.log(this.props,'this.props222');

    return (
      <div>
        <Modal
          visible={this.props.visible}
          title="编辑公式"
          onOk={this.props.onOk}
          onCancel={this.handleOnCancel}
          footer={[
            <Button key="back" size="large" onClick={this.handleOnCancel}>
              关闭
            </Button>,
            <Button key="submit" type="primary" size="large" loading={this.props.loading} onClick={this.handleOnSubmit}>
              保存
            </Button>,
          ]}>
          <Form onSubmit={this.handleOnSubmit}>
            <Form.Item
              labelCol={{span: 6}}
              wrapperCol={ {span: 14}}
              label="用水量">
              {this.props.form.getFieldDecorator('waterPrice', {
                rules: [{
                  required: true,
                  message: '请输入用水单价（最多5位，小数点后两位）',
                  pattern:/(^[1-9]([0-9]){1,4}\.\d{1,2}$)|(^[1-9]{1,5}\.\d{1,2}$)|(^0\.\d[1-9]$)|(^0\.[1-9]\d?$)|(^[1-9]{1,5}$)|(^[1-9]([0-9]){1,4}$)/,
                }],
                initialValue: this.props.price?this.props.price.price:''
              })(
                <Input placeholder="请输入用水单价" addonAfter="元/方"/>
              )}
            </Form.Item>
          </Form>
        </Modal>
      </div>
    )
  }
}


FormulaEditWaterModal = Form.create({})(FormulaEditWaterModal);

export default FormulaEditWaterModal

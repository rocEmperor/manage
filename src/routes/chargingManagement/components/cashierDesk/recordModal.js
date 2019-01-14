import React from 'react';
import { Modal, Form, Input, Button, Select, Icon, message } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import './index.less';

function RecordModal (props) {
  let { visible, handleCancel, infoList, form, prop, getListFn, modelType, recordLoading } = props;
  let { dispatch } = prop;
  let { getFieldDecorator } = form;
  function onOk () {
    let formKeyItems = ['invoiceType', 'invoiceSum', 'invoiceHead', 'taxSum'];
    form.validateFields(formKeyItems, (err, values) =>{
      if (err) return;
      let editStr = infoList.type && infoList.invoice_no ? '编辑' : '保存';
      let formData = {};
      formData.income_id = infoList.record_id;
      formData.invoice_no = values.invoiceSum;
      formData.tax_no = values.taxSum;
      formData.title = values.invoiceHead;
      formData.type = values.invoiceType;
      dispatch({
        type: modelType+'/invoiceEdit',
        payload: formData,
        callback: () => {
          message.success(`${editStr}成功`);
          handleCancel();
          getListFn();
        }
      })
    })
  }
  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };
  return (
    <Modal
      title="发票记录"
      visible={visible}
      className="recordModal"
      footer={null}
      destroyOnClose={true}
      onCancel={() => handleCancel('recordModalVisible')}
    >
      <div className="hint">
        <Icon type="exclamation-circle" className="icon"/>
        <span className="cont">电子发票功能正在加紧对接中，如您有电子发票需求，请与我们联系，我们将优先为您安排对接；</span>
      </div>
      <FormItem {...formItemLayout} label="发票类型">
        {getFieldDecorator('invoiceType', {
          rules: [{required: true, message: '请选择发票类型'}],
          initialValue: infoList.type ? `${infoList.type}` : undefined
        })(
          <Select placeholder="请选择发票类型">
            <Option value="1">普通发票</Option>
            <Option value="2">增值税普通发票</Option>
            <Option value="3">增值税专用发票</Option>
          </Select>
        )}
      </FormItem>
      <FormItem {...formItemLayout} label="发票号">
        {getFieldDecorator('invoiceSum', {
          rules: [{
            required: true,
            message: '请输入发票号并且输入字符必须是数字',
            pattern: /^[0-9]*$/
          }],
          initialValue: infoList.invoice_no ? infoList.invoice_no: null
        })(
          <Input placeholder="请输入发票号" maxLength={20}/>
        )}
      </FormItem>
      <FormItem {...formItemLayout} label="发票抬头">
        {getFieldDecorator('invoiceHead', {
          initialValue: infoList.title ? infoList.title : null
        })(
          <Input placeholder="请输入发票抬头"/>
        )}
      </FormItem>
      <FormItem {...formItemLayout} label="税号">
        {getFieldDecorator('taxSum', {
          initialValue: infoList.tax_no ? infoList.tax_no: null,
          rules: [{
            message: '输入字符必须是数字和字母',
            pattern: /^[0-9A-Za-z]+$/
          }]
        })(
          <Input placeholder="请输入税号" maxLength={18}/>
        )}
      </FormItem>
      <div className="btn">
        <Button type="primary" onClick={() => onOk()} style={{marginRight: 20}} loading={recordLoading}>
          {infoList.type && infoList.invoice_no ? '编辑' : '保存'}
        </Button>
        <Button onClick={() => handleCancel('recordModalVisible')}>取消</Button>
      </div>
    </Modal>
  )
}

export default RecordModal;

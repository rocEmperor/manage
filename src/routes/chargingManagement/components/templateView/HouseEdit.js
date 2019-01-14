import React from 'react'
import { Form, Input, Button } from 'antd';
const { TextArea } = Input;

function Component(props) {
  const {form,info,okLoading} = props;
  const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 14 },
    //style: { maxWidth: '600px' }
  }
  /**
   * 模板编辑提交
   * @param {object} e 
   */
  const handleOk = (e) => {
    e.preventDefault()
    form.validateFields((err, values) => {
      if (!err) {
        let payload = {
          ...values,
          community_id: sessionStorage.getItem("communityId"),
          first_area: '房号：1期1幢1单元101室'
        }
        props.dispatch({ type: 'TemplateEditModel/templateAdd', payload })
      }
    })
  }
  /**
   * 取消编辑
   */
  const handleCancel = () => {
    window.location.href = '#/printTemplate'
  }


  return (
    <Form>
      <Form.Item label="模板类型" {...formItemLayout}>
        {form.getFieldDecorator('model_type', {
          initialValue: 2,
          rules: [{ required: true, message: '请选择模板类型!' }],
        })(
          <span>物业费(按户催缴)</span>
        )}
      </Form.Item>
      <Form.Item label="模板标题" {...formItemLayout}>
        {form.getFieldDecorator('model_title', {
          initialValue: info.model_title,
          //onChange: handleChange,
          rules: [{ required: true, message: '值不能为空!' }],
        })(
          <Input type="text" placeholder="请输入模板标题" />
        )}
      </Form.Item>
      <Form.Item label="自定义文本区域1" {...formItemLayout}>
        {form.getFieldDecorator('second_area', {
          initialValue: info.second_area,
          rules: [
            { required: true, message: '值不能为空!' },
            { type: "string", pattern: /^(\S|\s){0,500}$/, message: '最多500字!' }
          ],
        })(
          <TextArea
            rows={6}
            placeholder="请输入模板标题" />
        )}
      </Form.Item>
      <Form.Item wrapperCol={{ span: 16, offset: 8 }}>
        <Button
          type="primary"
          style={{ marginRight: '10px' }}
          onClick={handleOk}
          loading={okLoading}
        >确定</Button>
        <Button
          onClick={handleCancel}
        >取消</Button>
      </Form.Item>
    </Form>
  )
}


Form.create()(Component)

export default Component

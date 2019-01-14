import React from 'react';
import { connect } from 'react-redux';
import { Breadcrumb, Card, Button, Input, Form, Radio } from 'antd';
import queryString from 'query-string';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

function ChangingItemAdd (props) {
  let { dispatch, ChangingItemAddModel, layout, form, location } = props;
  let { info } = ChangingItemAddModel;
  let { getFieldDecorator } = form;
  let hasSubmit = false;
  let query = undefined;
  let search = location.search;
  if (search.indexOf('id') !== -1) {
    query = queryString.parse(search);
  }

  function handleSubmit () {
    form.validateFields((errors, values) => {
      if (errors) {
        return;
      }
      if (!hasSubmit) {
        hasSubmit = true;
        if(query === undefined){
          dispatch({
            type: 'ChangingItemAddModel/billCostAdd',
            payload: {
              community_id: layout.communityId,
              describe: values.describe,
              name: values.name,
              status: values.status
            },
            callback: () => {
              hasSubmit = false
              window.location.href = "#/changingItemManagement";
            },
            err: () => { hasSubmit = false }
          })
        } else {
          dispatch({
            type: 'ChangingItemAddModel/billCostEdit',
            payload: {
              community_id: layout.communityId,
              describe: values.describe,
              name: values.name,
              id: query.id,
              status: values.status
            },
            callback: () => {
              hasSubmit = false
              window.location.href = "#/changingItemManagement";
            },
            err: () => { hasSubmit = false }
          })
        }
      }
    })
  }

  function handleBack (e) {
    history.back();
  }
  const formItemLayout = {
    labelCol: {
      span: 3
    },
    wrapperCol: {
      span: 8
    }
  };
  return (
    <div className="page-content">
      <Breadcrumb separator=">">
        <Breadcrumb.Item>计费管理</Breadcrumb.Item>
        <Breadcrumb.Item><a href="#/changingItemManagement">计费项目管理</a></Breadcrumb.Item>
        <Breadcrumb.Item>计费项目{query === undefined ? "新增" : "编辑"}</Breadcrumb.Item>
      </Breadcrumb>
      <Card className="section">
        <Form>
          <FormItem label="收费项目" {...formItemLayout}>
            {getFieldDecorator('name', {
              rules: [{
                type: "string",
                pattern: /^([\u4e00-\u9fa5a-zA-Z0-9]){2,10}$/,
                required: true,
                message: '格式错误（2-10位数字、字母、文字）'
              }],
              initialValue: info.name})(
              <Input type="text" maxLength="10"/>
            )}
          </FormItem>
          <FormItem label="项目说明" {...formItemLayout}>
            {getFieldDecorator('describe', {
              rules: [{
                type: "string",
                pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]+$/,
                required: true,
                message: '格式错误（1-20位数字、字母、文字）'}],
              initialValue: info.describe})(
              <Input type="textarea" rows={4} maxLength="20"/>
            )}
          </FormItem>
          <FormItem label="项目状态" {...formItemLayout} required>
            {getFieldDecorator('status',{initialValue: info ? parseInt(info.status) : 1})(
              <RadioGroup>
                <Radio value={1}>启用</Radio>
                <Radio value={2}>禁用</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem wrapperCol={{span: 22, offset: 3}}>
            <Button type="ghost" onClick={handleBack}>返回</Button>
            <Button type="primary" className="ml1" onClick={handleSubmit}>提交</Button>
          </FormItem>
        </Form >
      </Card>
    </div>
  )
}
export default connect(state => {
  return {
    ChangingItemAddModel: state.ChangingItemAddModel,
    layout: state.MainLayout
  }
})(Form.create({})(ChangingItemAdd));

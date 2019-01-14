import React from 'react';
import { connect } from 'dva';
import { Form, Breadcrumb, Input, Button, Card } from 'antd';
import { Link } from 'react-router-dom';
import Ueditor from '../../components/Ueditor/index';
const FormItem = Form.Item;
function AddShowResult (props) {
  let { dispatch, form, addShowResult } = props;
  let { sending, vote_id, discount_content } = addShowResult;
  const { getFieldDecorator } = form;
  function handleSubmit (e) {
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      if (sending) {
        dispatch({
          type: 'AddShowResultModel/submit',
          payload: {
            sending: false
          },
          values: values
        });
        setTimeout(() => {
          dispatch({
            type: 'AddShowResultModel/concat',
            payload: { sending: true }
          })
        }, 1000);
      }
    });
  }

  function handleBack (e) {
    history.go(-1);
  }

  function handleEditor (e, id) {
    dispatch({
      type: 'AddShowResultModel/concat',
      payload: {
        discount_content: e
      }
    })
  }
  const formItemLayout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 6 }
  };
  const formItemLayout2 = {
    labelCol: { span: 3 },
    wrapperCol: { span: 21 }
  };

  return (
    <div className="page-content">
      <Breadcrumb separator="/">
        <Breadcrumb.Item>投票管理</Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to={`viewVote?id=${vote_id}`}>投票详情</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>新增公示结果</Breadcrumb.Item>
      </Breadcrumb>
      <Card>
        <section className="section">
          <Form>
            <FormItem {...formItemLayout} label="标题" hasFeedback>
              {getFieldDecorator('title',{
                rules: [{
                  type: "string",
                  pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]+$/,
                  required: true,
                  message: '格式错误（1-64位数字、字母、文字）'}
                ]})(
                <Input maxLength={64} placeholder="请输入标题"/>
              )}
            </FormItem>
            <FormItem {...formItemLayout2} label="内容" hasFeedback required>
              {getFieldDecorator('editor1')(
                <Ueditor content={discount_content} getValues={handleEditor}/>
              )}
            </FormItem>
            <FormItem wrapperCol={{ span: 22, offset: 3 }}>
              <Button type="primary" onClick={handleSubmit}>提交</Button>
              <Button type="ghost" className="ml1" onClick={handleBack}>返回</Button>
            </FormItem>
          </Form>
        </section>
      </Card>
    </div>
  )
}
export default connect(state => {
  return {
    addShowResult: state.AddShowResultModel,
    layout: state.MainLayout
  }
})(Form.create({})(AddShowResult));

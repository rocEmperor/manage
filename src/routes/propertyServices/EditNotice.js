import React from 'react';
import { connect } from 'dva';
import { Form, Breadcrumb, Input, Button, Card } from 'antd';
import Ueditor from '../../components/Ueditor/index.js';
const FormItem = Form.Item;
function EditNotice(props) {
  let { dispatch, form, loading, info, ueditorContent, id } = props;
  
  const { getFieldDecorator } = props.form;
  const formItemLayout = {
    labelCol: { span: 2 },
    wrapperCol: { span: 6 },
  };
  const formItemLayout2 = {
    labelCol: { span: 2 },
    wrapperCol: { span: 22 },
  };
  function handleBack(e) {
    history.go(-1);
  }
  function handleEditor(e, id) {
    if (id == 'content') {
      dispatch({
        type: 'EditNoticeModel/concat',
        payload: {
          ueditorContent: e,
        }
      });
    }
  }
  function handleSubmit(e) {
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      let { title } = values;
      let payload = {
        title,
        id: info.id,
        content: ueditorContent,
        community_id: sessionStorage.getItem("communityId"),
      }
      dispatch({ type: 'EditNoticeModel/sunNoticeEdit', payload });
    })
  }
  const ueedit = (
    <div>
      {id != '' && ueditorContent ? <Ueditor id="content" height="200px" getValues={handleEditor.bind(this)} content={ueditorContent} /> : null}
    </div>
  );
  return (
    <div>
      <Breadcrumb separator="/">
        <Breadcrumb.Item>物业服务</Breadcrumb.Item>
        <Breadcrumb.Item><a href="#/sunNotice">小区公告</a></Breadcrumb.Item>
        <Breadcrumb.Item>编辑小区公告</Breadcrumb.Item>
      </Breadcrumb>
      <Card>
        <section className="section">
          <Form>
            <FormItem {...formItemLayout} label="公告标题" hasFeedback>
              {getFieldDecorator('title', { rules: [{ type: "string", pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]+$/, required: true, message: '格式错误（1-30位数字、字母、文字）' }], initialValue: info.title })(<Input maxLength={30} placeholder="请输入公告标题" />)}
            </FormItem>

            {
              (info && id != '') ?
                <FormItem {...formItemLayout2} label="内容" hasFeedback required>
                  {getFieldDecorator('editor')(
                    ueedit
                  )}
                </FormItem> : ""
            }

            <FormItem wrapperCol={{ span: 22, offset: 3 }}>
              <Button type="primary" onClick={handleSubmit} loading={loading}>提交</Button>
              <Button type="ghost" className="ml1" onClick={handleBack.bind(this)}>返回</Button>
            </FormItem>
          </Form>
        </section>
      </Card>
    </div>
  )
}
function mapStateToProps(state) {
  return {
    ...state.EditNoticeModel,
    loading: state.loading.models.EditNoticeModel,
  }
}
export default connect(mapStateToProps)(Form.create()(EditNotice));
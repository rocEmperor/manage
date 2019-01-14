import React from 'react';
import { connect } from 'dva';
import { Form, Breadcrumb, Input, Button, Select, Card } from 'antd';
import Ueditor from '../../components/Ueditor/index.js';
import Image from '../../components/Image/';
const FormItem = Form.Item;
const Option = Select.Option;
function EditNews(props) {
  const { dispatch, noticeType, sendType, info, params, img_url, loading, form, id, discount_content } = props;
  const { getFieldDecorator } = props.form;
  const formItemLayout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 6 },
  };
  const formItemLayout2 = {
    labelCol: { span: 2 },
    wrapperCol: { span: 22 },
  };
  function handleChangeVal(value) {
    dispatch({
      type: 'EditNewsModel/getSendType',
      payload: {
        status: value,
      }
    })
  }
  function handleEditor(e, id) {
    if (id == 'content') {
      dispatch({
        type: 'EditNewsModel/concat',
        payload: {
          discount_content: e,
        }
      });
    }
  }
  function handleBack(e) {
    history.go(-1);
  }
  function handleImage(id, e) {
    dispatch({
      type: 'EditNewsModel/concat',
      payload: {
        change_img: true,
      }
    });
    if (e.length > 0) {
      dispatch({
        type: 'EditNewsModel/concat',
        payload: {
          business_img: e[0].response ? e[0].response.data.filepath : '',
          business_img_local: e[0].response ? e[0].response.data.localPath : '',
          img_url: e,
        }
      });
      form.setFieldsValue({ 'business_img': e[0].response ? e[0].response.data.filepath : '' });
    } else {
      form.setFieldsValue({ 'business_img': '' });
      form.validateFields(['business_img'], (err, values) => {
        if (err) {
          return;
        }
      })
      dispatch({
        type: 'EditNewsModel/concat',
        payload: {
          business_img: '',
          business_img_local: '',
          img_url: [],
        }
      });
    }
  }
  function handleSubmit(e) {
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      let { title, describe, notice_type, send_type, business_img } = values;
      let payload = {
        title,
        id: info.id,
        describe,
        notice_type,
        send_type,
        content: discount_content,
        community_id: sessionStorage.getItem("communityId"),
        img_url: business_img
      }
      dispatch({ type: 'EditNewsModel/newsEdit', payload });
    })
  }
  const ueedit = (
    <div>
      {id != '' && info.content ? <Ueditor id="content" height="200px" getValues={handleEditor.bind(this)} content={info.content} /> : null}
    </div>
  );
  return (
    <div>
      <Breadcrumb separator="/">
        <Breadcrumb.Item>物业服务</Breadcrumb.Item>
        <Breadcrumb.Item><a href="#/newsManager">消息管理</a></Breadcrumb.Item>
        <Breadcrumb.Item>编辑消息</Breadcrumb.Item>
      </Breadcrumb>
      <Card>
        <Form>
          <FormItem {...formItemLayout} label="消息标题" hasFeedback>
            {getFieldDecorator('title', { rules: [{ type: "string", pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]+$/, required: true, message: '格式错误（1-30位数字、字母、文字）' }], initialValue: info.title })(<Input maxLength={30} placeholder="请输入消息标题" />)}
          </FormItem>
          <FormItem label="消息类型" {...formItemLayout}>
            {getFieldDecorator('notice_type', { rules: [{ required: true, message: '请选择消息类型' }], initialValue: info.notice_type })(
              <Select placeholder="请选择消息类型" notFoundContent="没有数据" onChange={handleChangeVal.bind(this)} >
                {noticeType.map((value, index) => { return <Option key={index} value={value.key}>{value.value}</Option> })}
              </Select>
            )}
          </FormItem>
          {params.status == 2 || info.notice_type == 2 && params.status != 1 ?
            <FormItem {...formItemLayout} label="新闻首图">
              {getFieldDecorator('business_img', {
                rules: [{ required: true, message: '请上传新闻首图!' }],
                initialValue: info.img_url
              })(
                <Image id="business_img" file={img_url} handleImage={handleImage.bind(this)} size={1} />
              )}
            </FormItem> : ''
          }
          {params.status == 1 || info.notice_type == 1 && params.status != 2 ?
            <FormItem label="消息描述：" {...formItemLayout}>
              {getFieldDecorator('describe', { rules: [{ required: true, message: '请输入消息描述', whitespace: true }], initialValue: info.describe })(<Input type="textarea" maxLength={50} placeholder="请输入消息描述" />)}
            </FormItem> : ''
          }
          <FormItem label="发送对象" {...formItemLayout}>
            {getFieldDecorator('send_type', { rules: [{ required: true, message: '请选择发送对象' }], initialValue: info.send_type ? info.send_type : undefined })(
              <Select placeholder="请选择发送对象" notFoundContent="没有数据">
                {sendType.map((value, index) => { return <Option key={index} value={String(value.key)}>{value.value}</Option> })}
              </Select>
            )}
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
      </Card>
    </div>
  )
}
function mapStateToProps(state) {
  return {
    ...state.EditNewsModel,
    loading: state.loading.models.EditNewsModel,
  }
}
export default connect(mapStateToProps)(Form.create()(EditNews));
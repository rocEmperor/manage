import React from 'react';
import { connect } from 'dva';
import { Form, Breadcrumb, Input, Button, Select, Card, } from 'antd';
import Ueditor from '../../components/Ueditor/index.js';
import Image from '../../components/Image/';
const FormItem = Form.Item;
const Option = Select.Option;
let discount_content="";
function AddNews(props){
  const { dispatch, noticeType, sendType, params, img_url, form, loading,business_img,business_img_local } = props
  const {
    getFieldDecorator
  } = props.form;
  const formItemLayout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 6 },
  };
  const formItemLayout2 = {
    labelCol: { span: 3 },
    wrapperCol: { span: 21 },
  };
  function handleBack(e) {
    history.go(-1);
  }
  function handleEditor(e,id){
    if(id=='editor'){
      discount_content = e;
    }
  }
  function handleChangeVal(value) {
    dispatch({
      type: 'AddNewsModel/getSendType',
      payload: {
        status:value,
      }
    })
  }
  function handleImage(id,e){
    dispatch({
      type: 'AddNewsModel/concat',
      payload: {
        change_img:true,
      }
    });
    if(e.length>0){
      dispatch({
        type: 'AddNewsModel/concat',
        payload: {
          business_img:e[0].response?e[0].response.data.filepath:'',
          business_img_local:e[0].response?e[0].response.data.localPath:'',
          img_url:e,
        }
      });
      form.setFieldsValue({'business_img':e[0].response?e[0].response.data.filepath:''});
    }else{
      form.setFieldsValue({'business_img':''});
      form.validateFields(['business_img'],(err, values) => {
        if (err) {
          return;
        }
      })
      dispatch({
        type: 'AddNewsModel/concat',
        payload: {
          business_img:'',
          business_img_local:'',
          img_url:[],
        }
      });
    }

  }
  function handleSubmit(e){
    form.setFieldsValue({ 'business_img':img_url });
    form.validateFields((err, values) => {
      if(err){
        return;
      }
      let {title,describe,notice_type,send_type} = values;
      let payload = {
        title,
        describe,
        notice_type,
        send_type,
        img_url:business_img,
        business_img_local:business_img_local,
        content:discount_content,
        community_id:sessionStorage.getItem("communityId")
      }
      dispatch({type:'AddNewsModel/newsAdd',payload});
    })
  }
  return (
    <div>
      <Breadcrumb separator="/">
        <Breadcrumb.Item>物业服务</Breadcrumb.Item>
        <Breadcrumb.Item><a href="#/newsManager">消息管理</a></Breadcrumb.Item>
        <Breadcrumb.Item>新增消息</Breadcrumb.Item>
      </Breadcrumb>
      <Card>
        <Form>
          <FormItem {...formItemLayout} label="消息标题" hasFeedback>
            {getFieldDecorator('title',{rules:[{type: "string",pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]+$/,required: true, message: '格式错误（1-30位数字、字母、文字）'}]})(<Input maxLength={30} placeholder="请输入消息标题"/>)}
          </FormItem>
          <FormItem label="消息类型" {...formItemLayout}>
            {getFieldDecorator('notice_type',{rules:[{required: true, message: '请选择消息类型'}]})(
              <Select placeholder="请选择消息类型" notFoundContent="没有数据" onChange={handleChangeVal.bind(this)} >
                {noticeType.map((value,index)=>{return <Option key={index} value={value.key}>{value.value}</Option>})}
              </Select>
            )}
          </FormItem>
          {
            params.status == 2?
              <FormItem {...formItemLayout} label="新闻首图">
                {getFieldDecorator('business_img', {
                  rules: [{ required: true, message: '请上传新闻首图!' }],
                })(
                  <Image id="business_img" file={img_url} handleImage={handleImage.bind(this)} size={1}/>
                )}
              </FormItem>:''
          }
          {
            params.status == 1?
              <FormItem label="消息描述：" {...formItemLayout}>
                {getFieldDecorator('describe',{rules:[{required:true,message:'请输入消息描述',whitespace:true}]})(<Input type="textarea" maxLength={50} placeholder="请输入消息描述"/>)}
              </FormItem>:''
          }
          <FormItem label="发送对象" {...formItemLayout}>
            {getFieldDecorator('send_type',{rules:[{required: true, message: '请选择发送对象'}]})(
              <Select placeholder="请选择发送对象" notFoundContent="没有数据">
                {sendType.map((value,index)=>{return <Option key={index} value={String(value.key)}>{value.value}</Option>})}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout2} label="内容" hasFeedback required>
            {getFieldDecorator('editor')(
              <Ueditor id="content" height="200px" getValues={handleEditor.bind(this)} />
            )}
          </FormItem>
          <FormItem wrapperCol={{ span: 22, offset: 3 }}>
            <Button type="primary" onClick={handleSubmit} loading={loading}>提交</Button>
            <Button type="ghost" className="ml1" onClick={handleBack.bind(this)}>返回</Button>
          </FormItem>
        </Form>
      </Card>
    </div>
  )
}

function mapStateToProps(state){
  return {
    ...state.AddNewsModel,
    loading: state.loading.models.AddNewsModel,
  }
}
export default connect(mapStateToProps)(Form.create()(AddNews));
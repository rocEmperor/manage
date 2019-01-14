import React from 'react';
import { connect } from 'dva';
import { Form, Breadcrumb, Input, Button, Card, Select, Switch, Radio, Row, Col } from 'antd';
import Ueditor from '../../components/Ueditor/index.js';
import Image from '../../components/Image/';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
import './index.less';
const { TextArea } = Input;
let discount_content = "";


function AddNotice(props) {
  let { dispatch, form, loading, type, img_url, img_top, info, id } = props;
  const { getFieldDecorator } = props.form;
  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };
  const formItemLayout2 = {
    labelCol: { span: 3 },
    wrapperCol: { span: 21 },
  };
  function handleEditor(e, id) {
    if (id == 'editor') {
      discount_content = e;
    }
  }
  function handleSubmit(e) {
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      let { title, proclaim_type, proclaim_cate, is_top } = values;
      let payload = {
        title,
        proclaim_type,
        proclaim_cate,
        is_top: is_top == true ? '2' : '1',
        img_url: type == 2 ? values.img_url : type == 3 ? values.img_top : '',
        content: type == 1 ? values.content : discount_content,
        community_id: sessionStorage.getItem("communityId"),
      }
      if (id) {
        payload.id = id;
        dispatch({ type: 'AddNoticeModel/sunNoticeEdit', payload });
      } else {
        dispatch({ type: 'AddNoticeModel/sunNoticeAdd', payload });
      }

    })
  }
  function handleBack(e) {
    history.go(-1)
  }
  function onChange(val) {
    form.setFieldsValue({ 'img_url': '' });
    dispatch({
      type: 'AddNoticeModel/concat',
      payload: {
        type: val.target.value,
        img_url: '',
        img_top: '',
      }
    });
  }
  function handleImage(id, e) {
    if (id == 'img_top') {
      if (e.length > 0) {
        dispatch({
          type: 'AddNoticeModel/concat',
          payload: {
            img_top: e,
          }
        });
        form.setFieldsValue({ 'img_top': e[0].response ? e[0].response.data.filepath : '' });
      } else {
        form.setFieldsValue({ 'img_top': '' });
        form.validateFields(['img_top'], (err, values) => {
          if (err) {
            return;
          }
        })
        dispatch({
          type: 'AddNoticeModel/concat',
          payload: {
            img_top: [],
          }
        });
      }
    } else {
      if (e.length > 0) {
        dispatch({
          type: 'AddNoticeModel/concat',
          payload: {
            img_url: e,
          }
        });
        form.setFieldsValue({ 'img_url': e[0].response ? e[0].response.data.filepath : '' });
      } else {
        form.setFieldsValue({ 'img_url': '' });
        form.validateFields(['img_url'], (err, values) => {
          if (err) {
            return;
          }
        })
        dispatch({
          type: 'AddNoticeModel/concat',
          payload: {
            img_url: [],
          }
        });
      }
    }
  }
  function reloadInfo(info) {
    dispatch({
      type: 'AddNoticeModel/concat',
      payload: {
        info: info
      }
    });
  }
  function titleChange(e) {
    info.title = e.target.value;
    reloadInfo(info);
  }
  return (
    <div>
      <Breadcrumb separator="/">
        <Breadcrumb.Item>物业服务</Breadcrumb.Item>
        <Breadcrumb.Item><a href="#/sunNotice">小区公告</a></Breadcrumb.Item>
        <Breadcrumb.Item>{id != '' ? '编辑小区公告' : '新增小区公告'}</Breadcrumb.Item>
      </Breadcrumb>
      <Card>
        <Form>
          <Row>
            <Col span={12}>
              <FormItem {...formItemLayout} label="公告标题" >
                {getFieldDecorator('title', {
                  initialValue: info && info.title ? info.title : '',
                  rules: [{
                    type: "string",
                    pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]+$/,
                    required: true,
                    message: '格式错误（1-30位数字、字母、文字）'
                  }],
                  onChange: titleChange.bind(this)
                })(<Input maxLength={30} placeholder="请输入公告标题" />)}
              </FormItem>
              <FormItem label="公告分类" {...formItemLayout}>
                {getFieldDecorator('proclaim_type', {
                  initialValue: info && info.proclaim_type ? info.proclaim_type : '',
                  rules: [{
                    required: true,
                    message: '请选择公告分类',
                  }]
                })(
                  <Select className="select-100 mr-5" placeholder="请选择公告分类">
                    <Option value="1">通知</Option>
                    <Option value="2">新闻</Option>
                    <Option value="3">公告</Option>
                  </Select>
                )}
              </FormItem>
              <FormItem label="公告类型" {...formItemLayout}>
                {getFieldDecorator('proclaim_cate', {
                  initialValue: info && info.proclaim_cate ? parseInt(info.proclaim_cate) : type,
                  rules: [{
                    required: true,
                    message: '请选择公告类型',
                  }],
                })(
                  <RadioGroup onChange={onChange.bind(this)} placeholder="请选择公告类型">
                    <Radio value={1}>文字</Radio>
                    <Radio value={2}>图片</Radio>
                    <Radio value={3}>图文信息</Radio>
                  </RadioGroup>
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="置顶" >
                {getFieldDecorator('is_top', {
                  valuePropName: 'checked',
                  initialValue: info && info.is_top ? info.is_top == 1 ? false : true : false,
                })(
                  <Switch />
                )}
              </FormItem>
              {type == 1 ?
                <FormItem {...formItemLayout} label="公告内容" >
                  {getFieldDecorator('content', {
                    initialValue: info && info.content && parseInt(info.proclaim_cate) == 1 ? info.content : '',
                    rules: [{
                      required: true,
                      message: '请输入公告内容',
                    }],
                  })(
                    <TextArea rows={4} />
                  )}
                </FormItem>
                : null}
              {type == 2 ?
                <FormItem {...formItemLayout} label="公告图片">
                  {getFieldDecorator('img_url', {
                    rules: [{ required: true, message: "请上传公告图片" }],
                    initialValue: info && info.img_url && info.img_url.length > 0 && parseInt(info.proclaim_cate) == 2 ? info.img_url[0].url : '',
                  })(
                    <Image id="img_url" file={img_url} handleImage={handleImage.bind(this)} size={1} />
                  )}
                  <p offset={8}>建议尺寸 1060*556 px，支持 .jpg .jpeg .png 格式，小于5M</p>
                </FormItem>
                : null}
              {type == 3 ?
                <FormItem {...formItemLayout} label="封面图片">
                  {getFieldDecorator('img_top', {
                    rules: [{ required: true, message: "请上传封面图片" }],
                    initialValue: info && info.img_url && info.img_url.length > 0 && parseInt(info.proclaim_cate) == 3 ? info.img_url[0].url : '',
                  })(
                    <Image id="img_top" file={img_top} handleImage={handleImage.bind(this)} size={1} />
                  )}
                  <p offset={8}>建议尺寸 1060*556 px，支持 .jpg .jpeg .png 格式，小于5M</p>
                </FormItem>

                : null}
            </Col>
            {
              type == 3 ?
                (img_top.length > 0 ? <Col span={10} offset={2}>
                  <div className="imgBlock">
                    <img src={id ? `${info.img_url[0].url}?imageView2/1/w/340/h/180` : `${img_top[0].response.data.filepath}?imageView2/1/w/340/h/180`} className="imgSize"/>
                    <div className="title">{info.title ? info.title : '标题'}</div>
                  </div>
                </Col> : <Col span={10} offset={2}>
                  <div className="imgBlock">
                    <div className="selSize">封面图片</div>
                    <div className="title">{info.title ? info.title : '标题'}</div>
                  </div>
                </Col>) : null
            }
          </Row>
          {id == '' && type == 3 || id != '' && info.proclaim_cate != 3 && type == 3 ?
            <FormItem {...formItemLayout2} label="内容" hasFeedback required>
              {getFieldDecorator('editor')(
                <Ueditor id="content" height="200px" getValues={handleEditor.bind(this)} />
              )}
            </FormItem>
            : null}
          {id != '' && info && info.content && type == 3 ?
            <FormItem {...formItemLayout2} label="内容" hasFeedback required>
              {getFieldDecorator('editor')(
                <Ueditor id="content" height="200px" getValues={handleEditor.bind(this)} content={parseInt(info.proclaim_cate) == 3 ? info.content : ""} />
              )}
            </FormItem>
            : null}
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
    ...state.AddNoticeModel,
    loading: state.loading.models.AddNoticeModel,
  }
}
export default connect(mapStateToProps)(Form.create()(AddNotice));
import React from 'react';
import { connect } from 'dva';
import { Form, Input, Breadcrumb, Card, Select, Button } from 'antd';
import { Link } from 'react-router-dom';
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;

function AddTemplateOne(props) {
  let { dispatch, form, info } = props;
  const { getFieldDecorator } = form;
  /**
   * 新增/编辑 表单提交
   */
  function handleSubmit(e) {
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      if(info==''){
        dispatch({
          type: 'AddTemplateOneModel/templateAdd',
          payload: {
            name: values.name,
            type: values.type,
            paper_size: values.paper_size,
            layout: values.layout,
            num: values.num,
            note: values.note,
          },
          callback: (val) => {
            window.location.href = "#/addTemplateTwo?id=" + val.id + "&template_type=" + values.type;
          }
        });
      }else{
        dispatch({
          type: 'AddTemplateOneModel/templateEdit',
          payload: {
            id:info.id,
            name: values.name,
            type: values.type,
            paper_size: values.paper_size,
            layout: values.layout,
            num: values.num,
            note: values.note,
          },
          callback: (val) => {
            window.location.href = "#/addTemplateTwo?id=" + val.id +"&template_type="+values.type;
          }
        });
      }
      
    })
  }
  /**
   * 返回
   */
  function handleBack() {
    history.go(-1);
  }

  // 布局
  const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 10 },
  };

  return (
    <div>
      <Breadcrumb separator=">">
        <Breadcrumb.Item><Link to="/printTemplate">票据模版管理</Link></Breadcrumb.Item>
        <Breadcrumb.Item>{info == '' ? '新增模版' :'编辑模版'}</Breadcrumb.Item>
      </Breadcrumb>
      <Card className="section">
        <Form>
          <FormItem label="模版名称：" {...formItemLayout}>
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入15字以内模版名称！', pattern: /^[^ ]{0,15}$/,},],
              initialValue: info.name,
            })(
              <Input maxLength={15} placeholder="请输入模版名称" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="模版类型" >
            {getFieldDecorator('type', {
              rules: [{ required: true, message: '请选择模版类型!' }],
              initialValue: info.type,
            })(
              <Select placeholder="请选择模版类型" disabled={info == '' ?false:true}>
                <Option value="1">通知单模版</Option>
                <Option value="2">收据模版</Option>
              </Select>
            )}
          </FormItem>   
          <FormItem {...formItemLayout} label="纸张大小" >
            {getFieldDecorator('paper_size', {
              rules: [{ required: true, message: '请选择纸张大小!' }],
              initialValue: info.paper_size,
            })(
              <Select placeholder="请选择纸张大小">
                <Option value="1">A4</Option>
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="打印布局" >
            {getFieldDecorator('layout', {
              rules: [{ required: true, message: '请选择打印布局!' }],
              initialValue: info.layout,
            })(
              <Select placeholder="请选择打印布局">
                <Option value="1">纵向</Option>
              </Select>
            )}
          </FormItem>
          <FormItem label="内容数量：" {...formItemLayout}>
            {getFieldDecorator('num',{
              rules: [{ required: true, message: '请输入1-10内容数量!', pattern: /^([0-9]|10)$/ }],
              initialValue: info.num,
            })(
              <Input maxLength={15} addonAfter="行" placeholder="请输入内容数量" />
            )}
            <span>内容数量即打印的收费项目的数量，单位行</span>
          </FormItem>
          <FormItem label="备注：" {...formItemLayout}>
            {getFieldDecorator('note', {
              rules: [{ required: false, message: '请输入100字以内备注!', pattern: /^.{0,100}$/, }],
              initialValue: info.note,
            })(
              <TextArea rows={4} placeholder="请输入备注"/>
            )}
          </FormItem>

          <Button type="primary" onClick={handleSubmit.bind(this)} style={{marginLeft:'30%'}}>提交</Button>
          <Button className="ml1" type="ghost" onClick={handleBack.bind(this)}>返回</Button>
        </Form>
      </Card>
    </div>
  );
}

function mapStateToProps(state) {
  return { ...state.AddTemplateOneModel, loading: state.loading.models.AddTemplateOneModel };
}
export default connect(mapStateToProps)(Form.create()(AddTemplateOne));

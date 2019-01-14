import React from 'react';
import { connect } from 'dva';
import { Form, Breadcrumb, Card,  Input, Row, Button } from 'antd';

const FormItem = Form.Item;

function AddGuide(props) {
  let {dispatch, form, info, id, loading} = props;
  const { getFieldDecorator } = props.form;
  const formItemLayout = {
    labelCol: {
      span: 4
    },
    wrapperCol: {
      span: 8
    },
  }
  function handleSubmit(e){
    form.validateFields((err, values) => {
      if(err){
        return;
      }
      let {title, type, phone, address} = values;
      let payload = {
        title,
        type,
        phone,
        address,
        community_id:sessionStorage.getItem("communityId"),
      };
      if(id) {
        payload = {...payload, id:id};
      }
      let func =id ? 'AddGuideModel/editGuide' : 'AddGuideModel/addGuide';
      dispatch({type: func, payload});
    })
  }
	
  function handleBack(){
    history.go(-1);
  }
  return(
    <div>
      <Breadcrumb separator=">">
        <Breadcrumb.Item>物业服务</Breadcrumb.Item>
        <Breadcrumb.Item><a href="#/communityGuide">办事指南</a></Breadcrumb.Item>
        <Breadcrumb.Item>{id?"编辑":"新增"}指南</Breadcrumb.Item>
      </Breadcrumb>
      <Card className="section">
        <Form>
          <FormItem label="标题" {...formItemLayout}>
            {getFieldDecorator('title', {
              rules: [{ required: true, message: '请输入标题',whitespace:true },{pattern:/^(.*)$/,message:'请输入35以内的文字'}],
              initialValue:info?info.title:''
            })(
              <Input type="text" maxLength={35} placeholder="请输入标题"/>
            )}
          </FormItem>          
          <FormItem label="联系电话" {...formItemLayout}>
            {getFieldDecorator('phone', {
              rules: [{ required: true, message: '请输入联系电话',whitespace:true },{pattern:/^((0\d{2,3}-\d{7,8})|(1\d{10}))$/,message:'请输入正确的联系电话'}],
              initialValue:info?info.phone:''
            })(
              <Input type="text" maxLength={35} placeholder="请输入联系电话"/>
            )}
          </FormItem>
          <FormItem label="地址" {...formItemLayout}>
            {getFieldDecorator('address', {
              rules: [{ required: true, message: '请输入地址',whitespace:true }],
              initialValue:info?info.address:''
            })(
              <Input type="text" placeholder="请输入地址" maxLength="200"/>
            )}
          </FormItem>
          <Row>
            <FormItem wrapperCol={{ span: 12, offset: 2 }}>
              <Button type="primary" onClick={handleSubmit} loading={loading} className="mr1" >确认</Button>
              <Button type="ghost" onClick={handleBack}>返回</Button>
            </FormItem>
          </Row>
        </Form>
      </Card>
    </div>
  )
}

function mapStateToProps(state){
  return {
    ...state.AddGuideModel,
    loading: state.loading.models.AddGuideModel,
  }
}
export default connect(mapStateToProps)(Form.create()(AddGuide));
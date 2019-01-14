import React from 'react';
import { connect } from 'dva';
import {Form,Row,Col,Select,Input,Card,Breadcrumb,Button} from 'antd';
import Image from '../../../components/Image/';
import TreeSelects from '../../../components/TreeSelect/index';
const FormItem = Form.Item;

function Repairsign (props){
  const { dispatch, form, img_url, loading, departmentList, staffList, repair_id, type,unfoldList } = props;
  const {
    getFieldDecorator
  } =  form;
  const formItemLayout = {
    labelCol: {
      span: 6
    },
    wrapperCol: {
      span: 10
    },
  }
  const formItemLayout2 = {
    labelCol: {
      span: 6
    },
    wrapperCol: {
      span: 16
    },
  }
  function handleImage(id, fileList) {
    form.setFieldsValue({ repair_imgs: fileList })
    if (fileList.length>0){
      dispatch({
        type: 'RepairsignModel/concat',
        payload: {
          img_url: fileList,
        }
      });
    }else{
      dispatch({
        type: 'RepairsignModel/concat',
        payload: {
          img_url:[],
        }
      });
    }
  }
  function Change(value){
    form.resetFields(['operator_id']);
    dispatch({
      type:'RepairsignModel/getGroupUsers',
      payload: {
        group_id:value,
        community_id: sessionStorage.getItem("communityId")
      }
    })
  }
  function handleBack(){
    history.go(-1)
  }
  function handleSubmit(e){
    form.validateFields((err,values) => {
      if(err){
        return;
      }
      let {operator_id,amount,repair_content} = values;
      //图片
      let repair_imgs = [];
      let imgsLen = values.repair_imgs && values.repair_imgs.length;
      if (values.repair_imgs !== undefined && imgsLen !== 0) {
        for (let i = 0; i < imgsLen; i++) {
          if (values.repair_imgs[i].response) {
            repair_imgs[i] = values.repair_imgs[i].response.data.filepath
          } else {
            repair_imgs[i] = values.repair_imgs[i].url
          }
        }
      }
      let payload = {
        repair_id,
        operator_id,
        amount,
        repair_content,
        repair_imgs
      }
      dispatch({
        type:'RepairsignModel/makeComplete',
        payload,
      })
    })
  }
  return (
    <div>
      <Breadcrumb separator="/">
        <Breadcrumb.Item>报修管理</Breadcrumb.Item>
        <Breadcrumb.Item><a href="javascript:history.go(-1)">{type == 1 ? '报事报修' : '疑难问题'}</a></Breadcrumb.Item>
        <Breadcrumb.Item>标记完成</Breadcrumb.Item>
      </Breadcrumb>
      <Card>
        <Form>
          <Row>
            <Col span={24}>
              <TreeSelects 
                label={'部门'} 
                multiple={false} 
                placeholder={'请选择'}
                id={'id'}
                form={form}
                data={departmentList}
                callBack={Change}
                formItemLayout={formItemLayout}
                unfoldList={unfoldList}
              />
              <FormItem label="员工" {...formItemLayout}>
                {getFieldDecorator('operator_id',{
                  rules: [
                    {required: true, message: '请选择!'},
                  ],
                  initialValue:undefined
                })(
                  <Select placeholder="请选择">
                    {staffList.map((value,index) => {
                      return <Select.Option key={index} value={value.id.toString()}>{value.name}</Select.Option>
                    })}
                  </Select>
                )}
              </FormItem>
              <FormItem label="金额" {...formItemLayout}>
                {getFieldDecorator('amount',{
                  initialValue:undefined
                })(
                  <Input addonAfter="金额" placeholder="请输入金额" />
                )}
              </FormItem>
              <FormItem label="处理结果" {...formItemLayout2}>
                {getFieldDecorator('repair_content',{
                  rules: [{type: 'string',pattern:/^[^ ]{1,200}$/, required: true,message: "请输入处理结果（200字以内）"}],
                  initialValue:""
                })(<Input type="textarea" placeholder="处理结果" /> )}
              </FormItem>
              <FormItem label="上传图片" {...formItemLayout}>
                {getFieldDecorator('repair_imgs', {
                })(
                  <Image id="repair_imgs" file={img_url} handleImage={handleImage.bind(this)} />
                )}
              </FormItem>
              <FormItem wrapperCol={{ span: 22, offset: 24 }} style={{width:"200px"}}>
                <Button type="primary" onClick={handleSubmit} loading={loading}>确定</Button>
                <Button type="ghost" className="ml1" onClick={handleBack.bind(this)}>返回</Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  )
}

function mapStateToProps(state){
  return {
    ...state.RepairsignModel,
    loading: state.loading.models.RepairsignModel,
  }
}
export default connect(mapStateToProps)(Form.create()(Repairsign));

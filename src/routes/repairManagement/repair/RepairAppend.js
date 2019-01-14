import React from 'react';
import { connect } from 'dva';
import {Form,Row,Col,Select,Input,Card,Breadcrumb,Button} from 'antd';
import Image from '../../../components/Image/';
import TreeSelects from '../../../components/TreeSelect/index';
const FormItem = Form.Item;

function RepairAppend (props){
  const { dispatch,form,img_url,loading,departmentList,staffList,repair_id,unfoldList } = props;
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
  
  function handleImage(id,e){

    dispatch({
      type: 'RepairsignModel/concat',
      payload: {
        change_img:true,
      }
    });
    if(e.length>0){
      let arr_img = [];
      let arr_img_local = [];
      e.map((item,index)=>{
        arr_img.push(item.response ? e[index].response.data.filepath : '');
        arr_img_local.push(item.response ? e[index].response.data.localPath : '')
      })
      dispatch({
        type: 'RepairsignModel/concat',
        payload: {
          business_img: arr_img.slice(),
          business_img_local: arr_img_local.slice(),
          img_url:e.slice(),
        }
      });
      form.setFieldsValue({ 'repair_imgs': arr_img.slice()});
    }else{
      form.setFieldsValue({'repair_imgs':''});
      form.validateFields(['repair_imgs'],(err, values) => {
        if (err) {
          return;
        }
      })
      dispatch({
        type: 'RepairsignModel/concat',
        payload: {
          business_img:'',
          business_img_local:'',
          img_url:[],
        }
      });
    }

  }
  function Change(value){
    form.resetFields(['operator_id']);
    dispatch({
      type:'RepairAppendModel/getGroupUsers',
      payload: {
        group_id:value,
        community_id: sessionStorage.getItem("communityId")
      }
    })
  }
  function handleSubmit(e){
    form.validateFields((err,values) => {
      if(err){
        return;
      }
      let { operator_id, repair_content, repair_imgs} = values;
      let payload = {
        repair_id,
        operator_id,
        repair_content,
        repair_imgs
      }
      dispatch({
        type:'RepairAppendModel/addRecord',
        payload,
      })
    })
  }
  function handleBack(){
    history.go(-1)
  }
  return (
    <div>
      <Breadcrumb separator="/">
        <Breadcrumb.Item>报修管理</Breadcrumb.Item>
        <Breadcrumb.Item><a href="#/repair">报修管理</a></Breadcrumb.Item>
        <Breadcrumb.Item>添加维修记录</Breadcrumb.Item>
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
    ...state.RepairAppendModel,
    loading:state.loading.models.RepairAppendModel
  }
}
export default connect(mapStateToProps)(Form.create()(RepairAppend));

import React from 'react';
import { connect } from 'dva';
import { Form,Breadcrumb,Card,Row,Col,Select,Input,Button,message } from 'antd';
import TreeSelects from '../../../components/TreeSelect/index';
const FormItem = Form.Item;
function RepairAllocation (props){
  const { dispatch, form, loading, departmentList, staffList, repair_id, type,unfoldList } = props;
  const {
    getFieldDecorator
  } = form;
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
  function Change(value){
    form.resetFields(['user_id']);
    dispatch({
      type:'RepairAllocationModel/getGroupUsers',
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
      let {user_id,finish_time,remark,leave_msg} = values;
      if(values.finish_time >24){
        message.info("期望完成时间最大为24");
        return;
      }
      let payload = {
        repair_id,
        user_id,
        finish_time,
        remark,
        leave_msg,
      }
      dispatch({
        type:'RepairAllocationModel/assignRepair',
        payload,
      })
    })
  }
  return (
    <div>
      <Breadcrumb separator="/">
        <Breadcrumb.Item>报修管理</Breadcrumb.Item>
        <Breadcrumb.Item><a href="javascript:history.go(-1)">{type == 1 ? '报事报修' : '疑难问题'}</a></Breadcrumb.Item>
        <Breadcrumb.Item>分配</Breadcrumb.Item>
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
                {getFieldDecorator('user_id',{
                  rules: [
                    {required: true, message: '请选择!'},
                  ],
                })(
                  <Select placeholder="请选择">
                    {staffList.map((value,index) => {
                      return <Select.Option key={index} value={value.id.toString()}>{value.name}</Select.Option>
                    })}
                  </Select>
                )}
              </FormItem>
              <FormItem label="期望完成时间" {...formItemLayout}>
                {getFieldDecorator('finish_time',{
                  rules: [
                    {pattern:/^[0-9]+(.[0-9]{1,2})?$/,required: true, message: '请输入时间!'},
                  ],
                })(<Input type="text" placeholder="请输入时间" addonAfter="小时" /> )}
              </FormItem>
              <FormItem label="备注" {...formItemLayout2}>
                {getFieldDecorator('remark')(<Input type="textarea" placeholder="有什么话和维修师傅说吗？（业主不会看到该消息）" /> )}
              </FormItem>
              <FormItem label="留言" {...formItemLayout2}>
                {getFieldDecorator('leave_msg')(<Input type="textarea" placeholder="请提交给业主的留言、反馈" /> )}
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
function mapStateToProps(state) {
  return {
    ...state.RepairAllocationModel,
    loading:state.loading.models.RepairAllocationModel
  }
}
export default connect(mapStateToProps)(Form.create()(RepairAllocation));

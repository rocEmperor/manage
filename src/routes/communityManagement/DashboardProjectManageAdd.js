import React from 'react';
import { connect } from 'dva';
import { Breadcrumb, Card, Select, Button, Input, Form, Radio } from 'antd';
import queryString from 'query-string';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
// 布局
const formItemLayout = {
  labelCol: {
    span: 5
  },
  wrapperCol: {
    span: 8
  },
};
let hasSubmit = false;
function DashboardProjectManageAdd(props){
  let { dispatch,form,type,value1,value2,loading,id,info, location } = props;
  const { getFieldDecorator } = form;
  let queryList = queryString.parse(location.search);
  /**
   * 监听公摊项目类型
   * @param  {String} value
   * value = 1 电梯用电
   * value = 2 楼道用电
   * value = 3 小区整体用水用电
   */
  function handleChange(value){
    dispatch({
      type:'DashboardProjectManageAddModel/concat',
      payload:{
        type:value,
      }
    })
  }
  /**
   * 监听对应表盘
   * @param  {Object} e
   */
  function onChange1(e){
    dispatch({
      type:'DashboardProjectManageAddModel/concat',
      payload:{
        value1:e.target.value,
      }
    })
  }
  /**
   * 监听表盘状态
   * @param  {Object} e
   */
  function onChange2(e){
    dispatch({
      type:'DashboardProjectManageAddModel/concat',
      payload:{
        value2:e.target.value,
      }
    })
  }
  /**
   * 新增/编辑 公摊项目表单提交
   */
  function handleConfirmAdd(){
    form.validateFields((err,values)=>{
      if(err){
        return;
      }
      if (!hasSubmit) {
        hasSubmit = true;
        let {shared_type,name,panel_type,panel_status,start_num,remark}=values;
        let payload = {
          shared_type,
          name,
          panel_type,
          panel_status,
          start_num,
          remark,
          community_id:sessionStorage.getItem('communityId'),
        }
        if(id){
          payload = {...payload,id:id,}
        }
        let func = id ? 'DashboardProjectManageAddModel/sharedEdit' : 'DashboardProjectManageAddModel/sharedAdd';
        dispatch({
          type: func,
          payload: payload,
          callback: () => {
            hasSubmit = false;
            // history.go(-1);
            if (Object.hasOwnProperty.call(queryList, 'curTabPaneKey')) {
              window.location.hash = `#dashboardManage?curTabPaneKey=${queryList.curTabPaneKey}`
            } else {
              window.location.hash = '#dashboardManage'
            }
          },
          err: () => {
            hasSubmit = false;
          }
        });
      }
    })
  }
  /**
   * 返回公摊项目管理页面
   */
  function handleBack(){
    // history.back();
    if (Object.hasOwnProperty.call(queryList, 'curTabPaneKey')) {
      window.location.hash = `#dashboardManage?curTabPaneKey=${queryList.curTabPaneKey}`
    } else {
      window.location.hash = '#dashboardManage'
    }
  }
  return (
    <div>
      <Breadcrumb separator=">">
        <Breadcrumb.Item>小区管理</Breadcrumb.Item>
        <Breadcrumb.Item><a onClick={handleBack}>仪表管理</a></Breadcrumb.Item>
        <Breadcrumb.Item>{Object.hasOwnProperty.call(queryList, 'id') ? '编辑公摊项目' : '新增公摊项目'}</Breadcrumb.Item>
      </Breadcrumb>
      <Card>
        <Form>
          <FormItem {...formItemLayout} label="公摊项目类型:">
            {getFieldDecorator('shared_type',{rules:[{required: true,message: '请选择！'}],initialValue:info?info.shared_type:null})(
              <Select onChange={handleChange.bind(this)} placeholder="请选择">
                <Option key={1} value="1">电梯用电</Option>
                <Option key={2} value="2">楼道用电</Option>
                <Option key={3} value="3">小区整体用水用电</Option>
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="电梯编号/楼道号/项目名称:" hasFeedback>
            {getFieldDecorator('name',{rules:[{type: "string",pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/,required: true, message: '请输入电梯编号/楼道号/项目名称'}],initialValue:info?info.name:null})(<Input maxLength={15} placeholder="请输入项目名称"/>)}
          </FormItem>

          <FormItem label="对应表盘：" {...formItemLayout} >
            {getFieldDecorator('panel_type',{rules:[{required: true,message: '请选择！'}],initialValue:info?Number(info.panel_type):value1} )(
              <RadioGroup onChange={onChange1.bind(this)}>
                <Radio value={2}>电表</Radio>
                {
                  type == 3?<Radio value={1}>水表</Radio>:null
                }
              </RadioGroup>)}
          </FormItem>
          <FormItem label="表盘状态：" {...formItemLayout} >
            {getFieldDecorator('panel_status', {rules:[{required: true,message: '请选择！'}],initialValue:info?Number(info.panel_status):value2})(
              <RadioGroup onChange={onChange2.bind(this)}>
                <Radio value={1}>正常</Radio>
                <Radio value={2}>异常</Radio>
              </RadioGroup>)}
          </FormItem>
          <FormItem {...formItemLayout} label="起始读数:">
            {getFieldDecorator('start_num',{rules:[{required: true,message: '请输入起始读数'},{pattern:/^\d+(?:\.\d{1,2})?$/,message: '格式错误（10位以内，小数点后两位）'}],initialValue:info.start_num})(
              <Input maxLength={10} placeholder="请输入起始读数"/>
            )}
          </FormItem>
          <FormItem label="备注：" {...formItemLayout}>
            {getFieldDecorator('remark',{initialValue:info?info.remark:null})(<Input type="textarea" maxLength={200} placeholder="请输入备注"/>)}
          </FormItem>
          <FormItem label=" " {...formItemLayout}  colon={false}>
            <Button type="primary" onClick={handleConfirmAdd.bind(this)} loading={loading}>提交</Button>
            <Button type="ghost"  className="ml1" onClick={handleBack.bind(this)}>返回</Button>
          </FormItem>
        </Form>
      </Card>
    </div>
  )
}
function mapStatusToProps(state){
  return {
    ...state.DashboardProjectManageAddModel,
    loading:state.loading.models.DashboardProjectManageAddModel,
  }
}
export default connect (mapStatusToProps)(Form.create()(DashboardProjectManageAdd))

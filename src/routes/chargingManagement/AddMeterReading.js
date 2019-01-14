import React from 'react'
import {Breadcrumb,Card,Select,Button,Input,Form,message} from 'antd';
import { connect } from 'dva';
import { Link } from 'react-router-dom';
import { getCommunityId } from '../../utils/util';
import queryString from 'query-string';
const FormItem = Form.Item;
const Option = Select.Option;
const formItemLayout = {
  labelCol: {
    span: 3
  },
  wrapperCol: {
    span: 8
  },
}
function AddMeterReading(props){
  const {dispatch,form,amountMoney,data,loading,info,recordNumber,name,status,id1,period_id,id,ID, location} = props;
  const {getFieldDecorator} = form;
  let queryList = queryString.parse(location.search);
  function handleBack(e){
    history.back();
  }
  function handleConfirmAdd(){
    props.form.validateFields((errors, values)=>{
      if (errors) {
        return;
      }
      if(ID){
        if(amountMoney!=null){
          dispatch({
            type:"AddMeterReadingModel/recordEdit",
            payload:{
              'community_id':getCommunityId(),
              id:ID,
              amount:amountMoney,
              current_num:values.current_num,
              latest_num:values.latest_num,
              period_id:period_id,
              shared_id:id1?id1:info.shared_id,
              shared_type:values.shared_type,
            }
          })
        }
      }else{
        if(amountMoney!=null){
          dispatch({
            type:"AddMeterReadingModel/recordAdd",
            payload:{
              'community_id':getCommunityId(),
              amount:amountMoney,
              current_num:values.current_num,
              latest_num:values.latest_num,
              period_id:period_id,
              shared_id:id,
              shared_type:values.shared_type,
            }
          })
        }else if(amountMoney == null){
          message.success('计费公式不存在!');
        }
      }
    })
  }
  function handleChange(e,value,recordNumber){
    if(e == "shared_type"){
      dispatch({
        type: 'AddMeterReadingModel/sharedPeriodList',
        payload: {community_id:getCommunityId(),shared_type:value,},
      });
      props.form.resetFields(['name','latest_num']);
      recordNumber = undefined;
    }else if(e == "name"){
      data.map((item)=>{
        if(item.name == value){
          dispatch({
            type: 'AddMeterReadingModel/concat',
            payload: {values:value,id:item.id},
          });
          dispatch({
            type: 'AddMeterReadingModel/recordNumber',
            payload: {shared_id:item.id},
          });
        }
      })
    }
  }
  function onChangeUserName(e,value){

  }
  function onBlurUserName(value){
    let param1 = {
      shared_id:id,
      current_num:value.target.value,
      latest_num:recordNumber,
      shared_type:status,
    }
    dispatch({
      type: 'AddMeterReadingModel/getRecordMoney',
      payload: param1,
    });
  }
  return(
    <div>
      <Breadcrumb separator=">">
        <Breadcrumb.Item>收费费管理</Breadcrumb.Item>
        <Breadcrumb.Item><a href="#/readingManagement">抄表管理</a></Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to={`/loggingData?id=${period_id}`}>
            录入数据
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          {{}.hasOwnProperty.call(queryList, 'type') && queryList.type === 'edit' ?"编辑抄表数据":"新增抄表数据"}
        </Breadcrumb.Item>
      </Breadcrumb>
      <Card>
        <Form>
          <FormItem {...formItemLayout} label="公摊项目类型:">
            {getFieldDecorator('shared_type',{rules:[{required: true,message: '请选择！'}],initialValue:info?info.shared_type:"请选择"})(
              <Select placeholder="请选择" onChange={handleChange.bind(this,"shared_type")}>
                <Option key={0} value="0">请选择</Option>
                <Option key={1} value="1">电梯用电</Option>
                <Option key={2} value="2">楼道用电</Option>
                <Option key={3} value="3">小区整体用水用电</Option>
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="电梯编号/楼道号/项目名称:">
            {getFieldDecorator('name',{rules:[{type: "string",required: true, message: '格式错误'}],initialValue:name?name:'请选择'})(
              <Select
                optionFilterProp="children"
                showSearch
                placeholder="请选择"
                onChange={handleChange.bind(this,"name")}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {data?data.map((item)=>{
                  return <Option key={item.id} value={item.name}>{item.name}</Option>
                }):''}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="上次读数:">
            {getFieldDecorator('latest_num',{rules:[{pattern:/^\d+(?:\.\d{2})?$/,required: true,message: '格式错误（小数点后两位）'}],initialValue:info&&!recordNumber?info.latest_num:recordNumber})(
              <Input disabled={true} onChange={onChangeUserName.bind(this,"3")} maxLength={10} placeholder="请输入上次读数"/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="本次读数:">
            {getFieldDecorator('current_num',{rules:[{pattern:/^\d+(?:\.\d{2})?$/,required: true,message: '格式错误（小数点后两位）'}],initialValue:info?info.current_num:null})(
              <Input onChange={onBlurUserName.bind(this)} maxLength={10} placeholder="请输入本次读数"/>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="对应金额:">
            <div>{amountMoney!=null?amountMoney+"元":''}</div>
          </FormItem>
          <FormItem wrapperCol={{span: 22, offset: 3}}>
            <Button type="primary" onClick={handleConfirmAdd.bind(this)} loading={loading}>提交</Button>
            <Button type="ghost"  className="ml1" onClick={handleBack.bind(this)}>返回</Button>
          </FormItem>
        </Form>
      </Card>
    </div>
  )
}
function mapStateToProps(state) {
  return {
    ...state.AddMeterReadingModel,
  }
}
export default connect(mapStateToProps)(Form.create()(AddMeterReading));

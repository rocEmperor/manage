import React from 'react';
import {Checkbox, Form, Select, Input,  } from 'antd'
const CheckboxGroup = Checkbox.Group;
const Option = Select.Option;
const formItemLayout = {
  labelCol: {span: 6},
  wrapperCol: {span: 14},
}
function Step2(props){
  let {from} = props;
  function changePushType(value){
    props.dispatch({
      type:"GenerateBillModel/concat",
      payload:{
        pushType:value
      }
    })
  }
  function changeCycle(value){
    props.dispatch({
      type:"GenerateBillModel/concat",
      payload:{
        cycle_Type:value,
        getMonthList:[]
      }
    })
    if(value == 1){
      props.dispatch({
        type:"GenerateBillModel/concat",
        payload:{
          plainOptions:[]
        }
      })
    }else if(value == 2){
      props.dispatch({
        type:"GenerateBillModel/concat",
        payload:{
          plainOptions:['上半年（1-6月）','下半年（7-12月）']
        }
      })
    }else if(value == 3){
      props.dispatch({
        type:"GenerateBillModel/concat",
        payload:{
          plainOptions:['一季度','二季度','三季度','四季度']
        }
      })
    }else{
      props.dispatch({
        type:"GenerateBillModel/concat",
        payload:{
          plainOptions:['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
        }
      })
    }
  }
  function getMonth(value){
    let arr = [];
    props.generateBill.plainOptions.map((val,index)=>{
      value.map((value,inx)=>{
        if(value == val){
          arr.push(index+1);
        }
      })
    })
    props.dispatch({
      type:"GenerateBillModel/concat",
      payload:{
        getMonthList:arr
      }
    })
  }
  function handleChange(){}
  return (
    <div>
      <Form style={{marginTop: 40, marginBottom: 50}}>
        <Form.Item label="缴费项目" {...formItemLayout}>
          {from.getFieldDecorator('cost_id', {
            rules: [{
              required: true,
              message: '请选择一个缴费项目'
            }],
          })(
            <Select placeholder="请选择缴费项目">
              {props.generateBill.costList.map((value, index) => {
                return (
                  <Select.Option key={index} value={value.key}>{value.label}</Select.Option>
                )
              })}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="选择公式" {...formItemLayout}>
          {from.getFieldDecorator('formula_id', {
            rules: [{
              required: true,
              message: '请选择一个公式'
            }],
            onChange: handleChange,
          })(
            <Select placeholder="请选择公式">
              {props.generateBill.calcList.map((value, index) => {
                return (
                  <Select.Option key={index} value={value.id}>{value.name} 【{value.formula}】</Select.Option>
                )
              })}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="生成周期" {...formItemLayout}>
          {from.getFieldDecorator('cycle_days', {
            rules: [{
              required: true,
              message: '请选择一个生成周期'
            }],
            initialValue:'4'
          })(
            <Select placeholder="请选择生成周期" onChange={changeCycle.bind(this)}>
              {props.generateBill.cycle_days.map((value, index) => {
                return (
                  <Select.Option key={index} value={value.key}>{value.name}</Select.Option>
                )
              })}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="算费年份" {...formItemLayout}>
          {from.getFieldDecorator('year', {
            rules: [{
              required: true,
              message: '请选择一个算费年份'
            }],
          })(
            <Select placeholder="请选择算费年份">
              {props.generateBill.year.map((value, index) => {
                return (
                  <Select.Option key={index} value={value.key}>{value.name}</Select.Option>
                )
              })}
            </Select>
          )}

        </Form.Item>
        {
          props.generateBill.cycle_Type!=1?<Form.Item {...formItemLayout} label="具体账期" required>
            {from.getFieldDecorator('timeArrList')(
              <CheckboxGroup options={props.generateBill.plainOptions} onChange={getMonth.bind(this)}/>
            )}
          </Form.Item>:""
        }
        {
          props.generateBill.cycle_Type==4?<Form.Item label="推送方式" {...formItemLayout}>
            {from.getFieldDecorator('push_type', {
              rules: [{
                required: true,
                message: '请选择一个推送方式'
              }],
              initialValue:'2'
            })(
              <Select placeholder="请选择推送方式" onChange={changePushType.bind(this)}>
                {props.generateBill.push_type.map((value, index) => {
                  return (
                    <Select.Option key={index} value={value.key}>{value.name}</Select.Option>
                  )
                })}
              </Select>
            )}
          </Form.Item>:""
        }

        {
          (props.generateBill.cycle_Type == 4 && props.generateBill.pushType == 2)?<Form.Item
            label="每月推送时间"
            {...formItemLayout}
          >
            {from.getFieldDecorator('auto_day', {
              rules: [{
                required: true,
                message: '请选择每月推送时间'
              }],
            })(
              <Select placeholder="请选择每月推送时间">
                <Option key="1" value="1">1</Option>
                <Option key="2" value="2">2</Option>
                <Option key="3" value="3">3</Option>
                <Option key="4" value="4">4</Option>
                <Option key="5" value="5">5</Option>
                <Option key="6" value="6">6</Option>
                <Option key="7" value="7">7</Option>
                <Option key="8" value="8">8</Option>
                <Option key="9" value="9">9</Option>
                <Option key="10" value="10">10</Option>
                <Option key="11" value="11">11</Option>
                <Option key="12" value="12">12</Option>
                <Option key="13" value="13">13</Option>
                <Option key="14" value="14">14</Option>
                <Option key="15" value="15">15</Option>
                <Option key="16" value="16">16</Option>
                <Option key="17" value="17">17</Option>
                <Option key="18" value="18">18</Option>
                <Option key="19" value="19">19</Option>
                <Option key="20" value="20">20</Option>
                <Option key="21" value="21">21</Option>
                <Option key="22" value="22">22</Option>
                <Option key="23" value="23">23</Option>
                <Option key="24" value="24">24</Option>
                <Option key="25" value="25">25</Option>
                <Option key="26" value="26">26</Option>
                <Option key="27" value="27">27</Option>
                <Option key="28" value="28">28</Option>
              </Select>
            )}
          </Form.Item>:""
        }
        <Form.Item label="账单周期" {...formItemLayout}>
          {from.getFieldDecorator('bill_day', {
            rules: [{
              required: true,
              message: '请输入账单周期'
            }],
          })(
            <Input type="text" placeholder="请输入账单周期" addonAfter="天"/>
          )}
        </Form.Item>
      </Form>
    </div>
  )
}

export default Step2;
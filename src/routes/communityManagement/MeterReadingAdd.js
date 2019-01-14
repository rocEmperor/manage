import React from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Breadcrumb, Card, Select, DatePicker} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import { Link } from 'react-router-dom';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
import {getCommunityId} from '../../utils/util';

let query = {
  community_id: getCommunityId(),
  group: undefined,
  building: undefined,
  unit: undefined,
}
let hasSubmit = false;

function MeterReadingAdd(props) {
  const { dispatch, form, id, info, loading, groupOption, buildingOption, unitOption, roomOption, datatime } = props;
  const { getFieldDecorator } = props.form;
  /**
   * 编辑/新增水表 表单提交
   */
  function handleSubmit(e) {
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      if (!hasSubmit) {
        hasSubmit = true;
        let {meter_no,group,building,unit,room,meter_status,start_ton,cycle_time,payment_time,remark}=values;
        let payload = {meter_no,group,building,unit,room,meter_status,start_ton,cycle_time,payment_time,remark,community_id:getCommunityId()};
        payload.start_time = datatime == undefined ? values.start_time._i : datatime;
        if(id) {
          payload = {...payload, water_meter_id: id};
        }
        let func = id ? 'MeterReadingAddModel/meterReadingEdit' : 'MeterReadingAddModel/meterReadingAdd';
        dispatch({
          type: func,
          payload: payload,
          callback: () => {
            hasSubmit = false;
            history.go(-1);
          },
          err: () => {
            hasSubmit = false;
          }
        });
      }
    })
  }
  /**
   * 返回水表管理页面
   */
  function handleBack() {
    history.go(-1);
  }
  // 布局
  const formItemLayout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 7 },
  };
  /**
   * 级联列表
   * @param  {string} mark
   * @param  {string} val
   * mark = group  苑/期/区
   * mark = building  幢
   * mark = unit 单元
   */
  function selectChange(mark, val) {
    query[mark] = val;
    if (mark === 'group') {
      form.setFieldsValue({building: '', unit: '', room: ''});
      query.building = undefined;
      query.unit = undefined;
      dispatch({
        type: 'MeterReadingAddModel/buildingList',
        payload: query
      });
    } else if (mark === 'building') {
      form.setFieldsValue({unit: '', room: ''});
      query.unit = undefined;
      dispatch({
        type: 'MeterReadingAddModel/unitList',
        payload: query
      });
    } else if (mark === 'unit') {
      form.resetFields(['room']);
      form.setFieldsValue({room: ''});
      dispatch({
        type: 'MeterReadingAddModel/roomList',
        payload: query
      });
    }
  }
  /**
   * 配置时间选择框禁选范围
   * @param  {Object} current
   */
  function disabledDate(current){
    return current && current.valueOf() > Date.now();
  }
  /**
   * 监听抄表时间
   * @param  {string} dateString
   */
  function dataChange(date, dateString){
    dispatch({
      type: 'MeterReadingAddModel/concat',
      payload: {
        datatime:dateString
      }
    })
  }
  return (
    <div>
      <Breadcrumb separator=">">
        <Breadcrumb.Item>小区管理</Breadcrumb.Item>
        <Breadcrumb.Item><Link to="/meterReadingManager">水表管理</Link></Breadcrumb.Item>
        <Breadcrumb.Item>{id ? '编辑' : '新增'}水表</Breadcrumb.Item>
      </Breadcrumb>
      <Card className="section">
        <Form>
          <FormItem {...formItemLayout} label="表身号">
            {getFieldDecorator('meter_no',{
              rules:[{type: "string",pattern: /^[0-9]+$/,required: true, message: '请输入最多15位表身号'}],initialValue:info.meter_no
            })(
              <Input placeholder="请输入表身号" maxLength={15}/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="苑/期/区" hasFeedback>
            {getFieldDecorator('group',{
              rules:[{required: true, message: '请选择苑/期/区'}],initialValue:info.group
            })(
              <Select placeholder="请选择苑/期/区" showSearch={true} notFoundContent="没有数据" onChange={selectChange.bind(this,'group')}>
                {groupOption.map((value,index)=>{return <Option  key={index} value={value.name}>{value.name}</Option>})}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="幢" hasFeedback>
            {getFieldDecorator('building',{
              rules:[{required: true, message: '请选择幢'}],initialValue:info.building
            })(
              <Select placeholder="请选择幢" showSearch={true} notFoundContent="没有数据" onChange={selectChange.bind(this,'building')}>
                {buildingOption.map((value,index)=>{return <Option  key={index} value={value.name}>{value.name}</Option>})}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="单元" hasFeedback>
            {getFieldDecorator('unit',{
              rules:[{required: true, message: '请选择单元'}],initialValue:info.unit
            })(
              <Select placeholder="请选择单元" showSearch={true} notFoundContent="没有数据" onChange={selectChange.bind(this,'unit')}>
                {unitOption.map((value,index)=>{return <Option  key={index} value={value.name}>{value.name}</Option>})}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="室" hasFeedback>
            {getFieldDecorator('room',{
              rules:[{required: true, message: '请选择室'}],initialValue:info.room
            })(
              <Select placeholder="请选择室" showSearch={true} notFoundContent="没有数据">
                {roomOption.map((value,index)=>{return <Option  key={index} value={value.name}>{value.name}</Option>})}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="水表状态">
            {getFieldDecorator('meter_status',{
              rules:[{required: true, message: '请选择水表状态'}],initialValue:info.meter_status
            })(
              <Select placeholder="请选择水表状态"  >
                <Option key={1} value="1">正常</Option>
                <Option key={2} value="2">损坏</Option>
                <Option key={3} value="3">停用</Option>
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="上次抄表时间">
            {getFieldDecorator('start_time',{
              rules:[{required: false, message: '上次抄表时间'}],initialValue:moment(info.start_time)
            })(
              <DatePicker format="YYYY-MM-DD" style={{width:'100%'}} placeholder="请选择时间" disabledDate={disabledDate.bind(this)} onChange={dataChange.bind(this)}/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="起始读数">
            {getFieldDecorator('start_ton',{
              rules:[{type: 'string',pattern:/^[0-9]{1,10}$/,required: true, message: '请输入起始读数(10位以内，正整数和0)'}],initialValue:info.start_ton
            })(
              <Input placeholder="请输入起始读数"/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="抄表周期">
            {getFieldDecorator('cycle_time',{
              rules:[{required: true, message: '请选择抄表周期'}],initialValue:info.cycle_time
            })(
              <Select placeholder="请选择抄表周期"  >
                <Option key={1} value="1">1个月</Option>
                <Option key={2} value="2">2个月</Option>
                <Option key={3} value="3">3个月</Option>
                <Option key={4} value="4">4个月</Option>
                <Option key={5} value="5">5个月</Option>
                <Option key={6} value="6">6个月</Option>
                <Option key={7} value="7">7个月</Option>
                <Option key={8} value="8">8个月</Option>
                <Option key={9} value="9">9个月</Option>
                <Option key={10} value="10">10个月</Option>
                <Option key={11} value="11">11个月</Option>
                <Option key={12} value="12">12个月</Option>
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="账期">
            {getFieldDecorator('payment_time',{
              rules:[{type: "string",pattern: /^[0-9]+$/,required: true, message: '请输入正整数'}],initialValue:info.payment_time
            })(
              <Input placeholder="请输入账期" addonAfter="天"/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="备注">
            {getFieldDecorator('remark',{
              rules:[{required: false, message: '请输入备注'}],initialValue:info.remark
            })(
              <Input  type="textarea" rows={4} placeholder="请输入备注" />
            )}
          </FormItem>
          <FormItem wrapperCol={{ span: 12, offset: 3 }}>
            <Button type="primary" onClick={handleSubmit} loading={loading} className="mr1">确定</Button>
            <Button type="ghost" onClick={handleBack}>返回</Button>
          </FormItem>
        </Form>
      </Card>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    ...state.MeterReadingAddModel,
    loading: state.loading.models.MeterReadingAddModel,
  };
}
export default connect(mapStateToProps)(Form.create()(MeterReadingAdd));

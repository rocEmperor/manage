import React from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Breadcrumb, Card, Select, DatePicker} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const formItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 6 },
};
let query = {
  community_id:sessionStorage.getItem('communityId'),
  group: undefined,
  building: undefined,
  unit: undefined,
}
let hasSubmit = false;
function ElectricityReadingAdd(props){
  const { dispatch, form,info,id,loading, group, building, unit, room,isAdd,datatime  } = props;
  const { getFieldDecorator } = props.form;
  /**
   * 返回电表管理页面
   */
  function handleBack(){
    history.go(-1);
  }
  /**
   * 编辑/新增电表 表单提交
   */
  function handleSubmit(e){
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      if (!hasSubmit) {
        hasSubmit = true;
        let {meter_no,group,building,unit,room,meter_status,start_ton,cycle_time,payment_time,remark}=values;
        let payload = {
          meter_no,
          group,
          building,
          unit,
          room,
          meter_status,start_ton,
          start_time:datatime,
          cycle_time,payment_time,remark,
          community_id:sessionStorage.getItem('communityId')
        };
        if(id) {
          payload = {...payload, meter_id:id, start_time:datatime==undefined?values.start_time._i:datatime};
        }
        let func = id ? 'ElectricityReadingAddModel/electrictReadingEdit' : 'ElectricityReadingAddModel/electrictReadingAdd';
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
   * 级联列表
   * @param  {String} mark
   * @param  {String} val
   * mark = group  苑/期/区
   * mark = building  幢
   * mark = unit  单元
   */
  function selectChange(mark, val){
    query[mark] = val;
    if(mark === 'group'){
      form.setFieldsValue({building: '', unit: '', room: ''});
      query.building = undefined;
      query.unit = undefined;
      dispatch({
        type: 'ElectricityReadingAddModel/buildingList',
        payload: query
      });
    }else if(mark === 'building'){
      form.setFieldsValue({unit: '', room: ''});
      query.unit = undefined;
      dispatch({
        type: 'ElectricityReadingAddModel/unitList',
        payload: query
      });
    }else if(mark === 'unit'){
      form.setFieldsValue({room: ''});
      dispatch({
        type: 'ElectricityReadingAddModel/roomList',
        payload: query
      });
    }
  }
  /**
   * 监听 上次抄表时间
   * @param  {String} dateString
   */
  function dataChange(date, dateString){
    dispatch({
      type: 'ElectricityReadingAddModel/concat',
      payload: {
        datatime:dateString
      }
    })
  }
  /**
   * 配置时间选择框不可选择项
   * @param  {Object} current
   */
  function disabledDate(current) {
    return current && current.valueOf() > Date.now();
  }
  return (
    <div>
      <Breadcrumb separator="/">
        <Breadcrumb.Item><a>小区管理</a></Breadcrumb.Item>
        <Breadcrumb.Item><a href="#/electricityManage">电表管理</a></Breadcrumb.Item>
        <Breadcrumb.Item>{isAdd==true?"新增":"编辑"}电表</Breadcrumb.Item>
      </Breadcrumb>
      <Card className="section">
        <Form>
          <FormItem {...formItemLayout} label="表身号">
            {getFieldDecorator('meter_no',{rules:[{type: "string",pattern: /^[0-9]+$/,required: true, message: '请输入最多15位表身号'}],initialValue:info?info.meter_no:""})(
              <Input placeholder="请输入表身号" maxLength={15}/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="苑/期/区">
            {getFieldDecorator('group',{rules:[{type: "string",required: true, message: '请选择配置范围'}],
              initialValue:info.group?info.group:undefined
            })(
              <Select placeholder="请选择苑/期/区" showSearch={true} onChange={selectChange.bind(this, 'group')} >
                {group.map((value, index) => {
                  return <Option key={index} value={value.name}>{value.name}</Option>
                })}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="幢">
            {getFieldDecorator('building',{rules:[{required: true, message: '请选择配置范围'}],
              initialValue:info.building?info.building:undefined
            })(
              <Select placeholder="请选择幢" showSearch={true} onChange={selectChange.bind(this, 'building')} >
                {building.map((value, index) => {
                  return <Option key={index} value={value.name}>{value.name}</Option>
                })}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="单元">
            {getFieldDecorator('unit',{rules:[{required: true, message: '请选择配置范围'}],
              initialValue:info.unit?info.unit:undefined
            })(
              <Select placeholder="请选择单元" showSearch={true} onChange={selectChange.bind(this, 'unit')} >
                {unit.map((value, index) => {
                  return <Option key={index} value={value.name}>{value.name}</Option>
                })}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="室">
            {getFieldDecorator('room',{rules:[{required: true, message: '请选择配置范围'}],
              initialValue:info.room?info.room:undefined
            })(
              <Select placeholder="请选择室" showSearch={true}>
                {room.map((value, index) => {
                  return <Option key={index} value={value.name}>{value.name}</Option>
                })}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="电表状态">
            {getFieldDecorator('meter_status',{rules:[{required: true, message: '请选择水表状态'}],initialValue:info.meter_status})(
              <Select placeholder="请选择电表状态"  >
                <Option key={1} value="1">正常</Option>
                <Option key={2} value="2">损坏</Option>
                <Option key={3} value="3">停用</Option>
              </Select>
            )}
          </FormItem>
          {isAdd == true?
            <FormItem {...formItemLayout} label="上次抄表时间">
              {getFieldDecorator('start_time',{rules:[{required: false, message: '上次抄表时间'}]})(
                <DatePicker format="YYYY-MM-DD" style={{width:'100%'}} placeholder="请选择时间" disabledDate={disabledDate.bind(this)} onChange={dataChange.bind(this)}/>
              )}
            </FormItem>
            :
            <FormItem {...formItemLayout} label="上次抄表时间">
              {getFieldDecorator('start_time',{rules:[{required: false, message: '上次抄表时间'}],initialValue:moment(info.start_time)})(
                <DatePicker format="YYYY-MM-DD" style={{width:'100%'}} placeholder="请选择时间" disabledDate={disabledDate.bind(this)} onChange={dataChange.bind(this)}/>
              )}
            </FormItem>
          }
          <FormItem {...formItemLayout} label="起始读数">
            {getFieldDecorator('start_ton',{rules:[{type: 'string',pattern:/^[0-9]{1,10}$/,required: true, message: '请输入起始读数(10位以内，正整数和0)'}],initialValue:info.start_ton})(
              <Input placeholder="请输入起始读数"/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="抄表周期">
            {getFieldDecorator('cycle_time',{rules:[{required: true, message: '请选择抄表周期'}],initialValue:info.cycle_time})(
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
            {getFieldDecorator('payment_time',{rules:[{type: "string",pattern: /^[0-9]+$/,required: true, message: '请输入正整数'}],initialValue:info.payment_time})(
              <Input placeholder="请输入账期" addonAfter="天"/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="备注">
            {getFieldDecorator('remark',{rules:[{required: false, message: '请输入备注'}],initialValue:info.remark})(
              <Input  type="textarea" rows={4} placeholder="请输入备注" />
            )}
          </FormItem>
          <FormItem wrapperCol={{ span: 12, offset: 2 }}>
            <Button type="ghost" onClick={handleBack.bind(this)} className="mr1">返回</Button>
            <Button type="primary" className="ant-btn-lg" loading={loading} onClick={handleSubmit.bind(this)}>确定</Button>
          </FormItem>
        </Form>
      </Card>
    </div>
  )
}
function mapStateToProps(state) {
  return {
    ...state.ElectricityReadingAddModel,
    loading: state.loading.models.ElectricityReadingAddModel,
  };
}
export default connect(mapStateToProps)(Form.create()(ElectricityReadingAdd));

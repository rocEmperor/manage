import React from 'react';
import { connect } from 'dva';
import { Form, Breadcrumb, Card, Input, Select, Button, message } from 'antd';
import './index.css';
const Option = Select.Option;
import Time from '../../components/Time/index';

function InspectPlanAdd(props) {
  let { dispatch, form, detail, lineList, selected, id, userList, arrData, arrWeekData, arrMonthData, arrYearData, addVisible } = props;
  
  const { getFieldDecorator, validateFields } = form;
  const formItemLayout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 7 },
  }

  /**
   * 巡检周期为周-月 时间重复性判断
   * @param {*} dataType arrWeekData/arrMonthData
   */
  function execTypeWeekMonth(dataType) {
    let allData = [];
    dataType.map(items => {
      allData.push({
        startItem: {
          weekDay: Number(items.start),
          hour: Number(items.startTime)
        },
        endItem: {
          weekDay: Number(items.end),
          hour: Number(items.endTime)
        }
      })
    })

    let flag = false;
    for (let i = 0; i < allData.length; i++) {
      if ((allData[i].startItem.weekDay > allData[i].endItem.weekDay) || (allData[i].startItem.weekDay == allData[i].endItem.weekDay && allData[i].endItem.hour <= allData[i].startItem.hour)) {
        message.error(`第${i + 1}条数据的开始时间必须大于结束时间`);
        flag = true;
        return flag;
      }
      for (let j = 0; j < allData.length; j++) {
        if (i > j) {
          if ((allData[j].startItem.weekDay > allData[i].startItem.weekDay || (allData[j].startItem.weekDay == allData[i].startItem.weekDay && allData[j].startItem.hour > allData[i].startItem.hour))
            && (allData[j].startItem.weekDay > allData[i].endItem.weekDay) || (allData[j].startItem.weekDay == allData[i].endItem.weekDay && allData[j].startItem.hour >= allData[i].endItem.hour)) {
            continue;
          } else if ((allData[j].endItem.weekDay < allData[i].startItem.weekDay || (allData[j].endItem.weekDay == allData[i].startItem.weekDay && allData[j].endItem.hour <= allData[i].startItem.hour))
            && (allData[j].endItem.weekDay < allData[i].endItem.weekDay) || (allData[j].endItem.weekDay == allData[i].endItem.weekDay && allData[j].endItem.hour < allData[i].endItem.hour)) {
            continue;
          } else {
            message.error(`第${i + 1}条数据所选时间段重复`);
            flag = true;
            break;
          }
        }
      }
    }
    return flag;
  }
  /**
   * 巡检周期为天 时间重复性判断
   * @param {*} dayData arrData
   */
  function execTypeDay(dayData) {
    let flag = false;
    for (let i = 0; i < dayData.length; i++) {
      if (dayData[i].endTime <= dayData[i].startTime) {
        message.error(`第${i + 1}条数据的结束时间必须大于开始时间`);
        flag = true;
        return flag;
      }
      for (let j = 0; j < dayData.length; j++) {
        if (i > j) {
          if ((dayData[j].startTime < dayData[i].startTime && dayData[i].startTime < dayData[j].endTime) || (dayData[j].startTime < dayData[i].endTime && dayData[i].endTime < dayData[j].endTime) || (dayData[j].startTime == dayData[i].startTime && dayData[j].endTime == dayData[i].endTime)) {
            message.error(`第${i + 1}条数据所选时间段重复`);
            flag = true;
            return flag;
          }
        }
      }
    }
    return flag;
  }
  /**
   * 巡检周期为年 时间重复性判断
   * @param {*} dataType arrYearData
   */
  function execTypeYear(dataType) {
    let flag = false;
    for (let i = 0; i < dataType.length; i++) {
      if ((dataType[i].startMonth > dataType[i].endMonth) || (dataType[i].startMonth == dataType[i].endMonth && dataType[i].startDay > dataType[i].endDay) || ((dataType[i].startMonth == dataType[i].endMonth) && (dataType[i].startDay == dataType[i].endDay) && (dataType[i].endTime <= dataType[i].startTime))) {
        message.error(`第${i + 1}条数据的结束时间必须大于开始时间`);
        flag = true;
        return flag;
      }
      for (let j = 0; j < dataType.length; j++) {
        if (i > j) {
          if ((dataType[j].startMonth > dataType[i].startMonth || (dataType[j].startMonth == dataType[i].startMonth && dataType[j].startDay > dataType[i].startDay) || (dataType[j].startMonth == dataType[i].startMonth && dataType[j].startDay == dataType[i].startDay && dataType[j].startTime > dataType[i].startTime))
            && (dataType[j].startMonth > dataType[i].endMonth || (dataType[j].startMonth == dataType[i].endMonth && dataType[j].startDay > dataType[i].endDay) || (dataType[j].startMonth == dataType[i].endMonth && dataType[j].startDay == dataType[i].endDay && dataType[j].startTime >= dataType[i].endTime))
          ) {
            continue;
          } else if ((dataType[j].endMonth < dataType[i].startMonth || (dataType[j].endMonth == dataType[i].startMonth && dataType[j].endDay < dataType[i].startDay) || (dataType[j].endMonth == dataType[i].startMonth && dataType[j].endDay == dataType[i].startDay && dataType[j].endTime <= dataType[i].startTime))
            && (dataType[j].endMonth < dataType[i].endMonth || (dataType[j].endMonth == dataType[i].endMonth && dataType[j].endDay < dataType[i].endDay) || (dataType[j].endMonth == dataType[i].endMonth && dataType[j].endDay == dataType[i].endDay && dataType[j].endTime < dataType[i].endTime))) {
            continue;
          } else {
            message.error(`第${i + 1}条数据所选时间段重复`);
            flag = true;
            break;
          }
        }
      }
    }
    return flag;
  }
  
  /**
   * 计划新增提交
   * @param {*} e 
   */
  function handleSubmit(e) {
    validateFields((err, values) => {
      let time_list = [];
      if (selected == 1) {
        let res = execTypeDay(arrData);
        if(res){
          return false;
        }
        for (let i = 0; i < arrData.length; i++) {
          time_list.push({
            hours_start: arrData[i].startTime,
            hours_end: arrData[i].endTime
          })
        }
      } else if (selected == 2) {
        let res = execTypeWeekMonth(arrWeekData);
        if(res){
          return false;
        }
        for (let i = 0; i < arrWeekData.length; i++) {
          time_list.push({
            week_start: arrWeekData[i].start,
            week_end: arrWeekData[i].end,
            hours_start: arrWeekData[i].startTime,
            hours_end: arrWeekData[i].endTime
          })
        }
      } else if (selected == 3) {
        let res = execTypeWeekMonth(arrMonthData);
        if(res){
          return false;
        }
        for (let i = 0; i < arrMonthData.length; i++) {
          time_list.push({
            day_start: arrMonthData[i].start,
            day_end: arrMonthData[i].end,
            hours_start: arrMonthData[i].startTime,
            hours_end: arrMonthData[i].endTime
          })
        }
      } else {
        let res = execTypeYear(arrYearData);
        if(res){
          return false;
        }
        for(let i = 0;i < arrYearData.length; i++){
          time_list.push({
            month_start: arrYearData[i].startMonth,
            month_end: arrYearData[i].endMonth,
            day_start: arrYearData[i].startDay,
            day_end: arrYearData[i].endDay,
            hours_start: arrYearData[i].startTime,
            hours_end: arrYearData[i].endTime
          })
        }
      }
      let params = {};
      params.time_list = time_list;
      params.community_id = sessionStorage.getItem("communityId");
      params.name = values.name;
      params.line_id = values.line_id;
      params.exec_type = values.exec_type;
      params.user_list = values.user_list;
      if (err) {
        return;
      }
      if (id) {
        dispatch({
          type: 'InspectPlanAdd/getPlanEdit',
          payload: { ...params, id }
        });
      } else {
        dispatch({
          type: 'InspectPlanAdd/getPlanAdd',
          payload: params
        });
      }
    });
  }

  //返回上一页
  function handleBack(e) {
    history.go(-1);
  }
  // onchange exec_type
  function selectedExecType(val) {
    dispatch({
      type: 'InspectPlanAdd/concat',
      payload: {
        selected: val,
        addVisible: true,
        arrData: [{
          startTime: '',
          endTime: '',
          key: 1
        }],
        arrWeekData: [{
          start: '',
          startTime: '',
          end: '',
          endTime: '',
          key: 1
        }],
        arrMonthData: [{
          start: '',
          startTime: '',
          end: '',
          endTime: '',
          key: 1
        }],
        arrYearData: [{
          startMonth: '',
          startDay: '',
          startTime: '',
          endMonth: '',
          endDay: '',
          endTime: '',
          key: 1
        }],
      }
    })
    form.resetFields(['startTime-0-1','endTime-0-1','start-0-1','end-0-1','startMonth-0-1','endMonth-0-1','startDay-0-1','endDay-0-1']);
  }
  // 是否可添加开始时间与结束时间
  function isAdd(){
    if(arrData.length >= 11 || arrWeekData.length >= 11 || arrMonthData.length >= 11 || arrYearData.length >= 11){
      dispatch({
        type:'InspectPlanAdd/concat',
        payload: {
          addVisible: false
        }
      })
    }
  }
  const timeProps = {
    arrData:arrData,
    arrWeekData:arrWeekData,
    arrMonthData:arrMonthData,
    arrYearData:arrYearData,
    execType:selected,
    form:form,
    execTypeWeekMonth:execTypeWeekMonth.bind(),
    execTypeDay:execTypeDay.bind(),
    execTypeYear:execTypeYear.bind(),
    addVisible: addVisible,
    isAdd: isAdd.bind(this)
  }
  return (<div>
    <Breadcrumb separator="/">
      <Breadcrumb.Item>设备巡检</Breadcrumb.Item>
      <Breadcrumb.Item><a href="#/inspectPlanManagement">巡检计划管理</a></Breadcrumb.Item>
      <Breadcrumb.Item>{id ? '编辑' : '新增'}</Breadcrumb.Item>
    </Breadcrumb>
    <Card>
      <Form>
        <Form.Item label="计划名称" {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: detail.name,
            rules: [{ required: true, message: '请输入计划名称!' }],
          })(
            <Input type="text" placeholder="请输入计划名称" maxLength={15} />
          )}
        </Form.Item>

        <Form.Item label="对应线路" {...formItemLayout}>
          {getFieldDecorator('line_id', {
            initialValue: detail.line_id,
            rules: [{ required: true, message: '请选择对应线路!' }],
          })(
            <Select placeholder="请选择对应线路" showSearch>
              {lineList ? lineList.map((value, index) => { return <Option key={index} value={value.id}>{value.name}</Option> }) : null}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="巡检周期" {...formItemLayout}>
          {getFieldDecorator('exec_type', {
            initialValue: detail.exec_type,
            rules: [{ required: true, message: '请选择巡检周期' }],
            onChange: selectedExecType.bind(this)
          })(
            <Select placeholder="请选择巡检周期">
              <Option key="1" value="1">按天</Option>
              <Option key="2" value="2">按周</Option>
              <Option key="3" value="3">按月</Option>
              <Option key="4" value="4">按年</Option>
            </Select>
          )}
        </Form.Item>
        <Time  {...timeProps}/>

        <Form.Item label="执行人员" {...formItemLayout} className="mt1">
          {getFieldDecorator('user_list', {
            initialValue: detail.user_list && detail.user_list.length > 0 ? detail.user_list.map(function (val) { return (val.user_id).toString() }) : undefined,
            rules: [{ required: true, message: '请选择执行人员!' }],
          })(
            <Select placeholder="请选择执行人员" mode="multiple">
              {userList.length > 0 ? userList.map((value, index) => { return <Option key={index} value={value.id}>{value.truename}</Option> }) : null}
            </Select>
          )}
        </Form.Item>
        <Form.Item style={{ maxWidth: '600px' }} wrapperCol={{ span: 8, offset: 4 }}>
          <Button type="primary" onClick={handleSubmit}>确定</Button>
          <Button className="ml1" onClick={handleBack}>返回</Button>
        </Form.Item>
      </Form>

    </Card>
  </div>)
}

function mapStateToProps(state) {
  return {
    ...state.InspectPlanAdd,
    loading: state.loading.models.InspectPlanAdd
  };
}
export default connect(mapStateToProps)(Form.create()(InspectPlanAdd));
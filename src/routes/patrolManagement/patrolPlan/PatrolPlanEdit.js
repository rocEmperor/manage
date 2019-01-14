import React from 'react';
import { connect } from 'dva';
import { Form, Breadcrumb, Card, Input, Select, DatePicker, Row, Col, InputNumber, TimePicker, Button } from 'antd';
const Option = Select.Option;
import moment from 'moment';

function PatrolPlanEdit(props) {
  const { dispatch, form, detail, lineList, execType, selectExecType, selectUserList, userList, community_id, id } = props;
  const { getFieldDecorator, validateFields } = form;
  //布局
  const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 12 },
    style: { maxWidth: '600px' }
  }
  //弹框确认新增
  function handleOk() {
    validateFields((err, values) => {
      if (err) {
        return;
      }
      dispatch({
        type: 'PatrolPlanEdit/getPlanEdit',
        payload: {
          community_id: community_id,
          id: id,
          name: values.name,
          line_id: values.line_id,
          start_date: values.startdate.format('YYYY-MM-DD'),
          end_date: values.enddate.format('YYYY-MM-DD'),
          exec_type: values.exec_type,
          interval_x: values[`interval_x${selectExecType}`],
          interval_y: values[`interval_y${selectExecType}`] ? values[`interval_y${selectExecType}`] : 0,
          start_time: values.starttime.format('HH:mm'),
          end_time: values.endtime.format('HH:mm'),
          error_range: values.error_range,
          user_list: values.user_list,
        }
      });
    })
  }
  //返回上一页
  function handleBack(e) {
    history.go(-1);
  }

  return (<div>
    <Breadcrumb separator="/">
      <Breadcrumb.Item>巡更管理</Breadcrumb.Item>
      <Breadcrumb.Item><a href="#/patrolPlan">巡更计划管理</a></Breadcrumb.Item>
      <Breadcrumb.Item>编辑</Breadcrumb.Item>
    </Breadcrumb>
    <Card>
      <Form>
        <Form.Item label="计划名称" {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: detail.name,
            rules: [{ required: true, message: '请输入计划名称!' }],
          })(
            <Input type="text" placeholder="请输入计划名称" maxLength={10} disabled />
          )}
        </Form.Item>
        <Form.Item label="对应线路" {...formItemLayout}>
          {getFieldDecorator('line_id', {
            initialValue: detail.line_id,
            rules: [{ required: true, message: '请选择对应线路!' }],
          })(
            <Select placeholder="请选择" disabled>
              {lineList ? lineList.map((value, index) => { return <Option key={index} value={value.id}>{value.name}</Option> }) : null}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="开始日期" {...formItemLayout}>
          {getFieldDecorator('startdate', {
            initialValue: detail.start_date ? moment(detail.start_date) : null,
            rules: [{ required: true, message: '请输入开始日期!' }],
          })(
            <DatePicker format={'YYYY-MM-DD'} disabled />
          )}
        </Form.Item>
        <Form.Item label="结束日期" {...formItemLayout}>
          {getFieldDecorator('enddate', {
            initialValue: detail.end_date ? moment(detail.end_date) : null,
            rules: [{ required: true, message: '请输入结束日期!' }],
          })(
            <DatePicker disabled />
          )}
        </Form.Item>
        <Form.Item label="计划类型" {...formItemLayout}>
          {getFieldDecorator('exec_type', {
            initialValue: detail.exec_type,
            rules: [{ required: true, message: '请选择计划类型!' }],
          })(
            <Select placeholder="请选择" disabled>
              {execType ? execType.map((value, index) => { return <Option key={index} value={value.key}>{value.value}</Option> }) : null}
            </Select>
          )}
        </Form.Item>
        {/*按天执行*/}
        {selectExecType == 1
          ? <Form.Item label="执行间隔" {...formItemLayout}>
            <Row gutter={4}>
              <Col span={1} style={{ width: 'auto' }}>每</Col>
              <Col span={6}>
                {getFieldDecorator(`interval_x${selectExecType}`, {
                  initialValue: detail.interval_x,
                  rules: [{ required: true, message: '请输入执行间隔!' }],
                })(
                  <InputNumber min={1} max={90} style={{ width: '100%' }} disabled />
                )}
              </Col>
              <Col span={8}>天执行计划</Col>
            </Row>
          </Form.Item>
          : null}
        {/*按周执行*/}
        {selectExecType == 2
          ? <Form.Item label="执行间隔" {...formItemLayout}>
            <Row gutter={4}>
              <Col span={1} style={{ width: 'auto' }}>每</Col>
              <Col span={6}>
                {getFieldDecorator(`interval_x${selectExecType}`, {
                  initialValue: detail.interval_x,
                  rules: [{ required: true, message: '请输入执行间隔!' }],
                })(
                  <InputNumber min={1} max={365} style={{ width: '100%' }} disabled />
                )}
              </Col>
              <Col span={4} style={{ width: 'auto' }}>周的周</Col>
              <Col span={6}>
                {getFieldDecorator(`interval_y${selectExecType}`, {
                  initialValue: detail.interval_y,
                  rules: [{ required: true, message: '请输入执行间隔!' }],
                })(
                  <InputNumber min={1} max={7} style={{ width: '100%' }} disabled />
                )}
              </Col>
              <Col span={7}>执行</Col>
            </Row>
          </Form.Item>
          : null}
        {/*按月执行*/}
        {selectExecType == 3
          ? <Form.Item label="执行间隔" {...formItemLayout}>
            <Row gutter={4}>
              <Col span={1} style={{ width: 'auto' }}>每</Col>
              <Col span={6}>
                {getFieldDecorator(`interval_x${selectExecType}`, {
                  initialValue: detail.interval_x,
                  rules: [{ required: true, message: '请输入执行间隔!' }],
                })(
                  <InputNumber min={1} max={365} style={{ width: '100%' }} disabled />
                )}
              </Col>
              <Col span={4} style={{ width: 'auto' }}>个月的</Col>
              <Col span={6}>
                {getFieldDecorator(`interval_y${selectExecType}`, {
                  initialValue: detail.interval_y,
                  rules: [{ required: true, message: '请输入执行间隔!' }],
                })(
                  <InputNumber min={1} max={365} style={{ width: '100%' }} disabled />
                )}
              </Col>
              <Col span={7}>号执行</Col>
            </Row>
          </Form.Item>
          : null}
        <Form.Item label="开始时间" {...formItemLayout}>
          {getFieldDecorator('starttime', {
            initialValue: detail.start_time ? moment(detail.start_time, 'HH:mm') : null,
            rules: [{ required: true, message: '请输入开始时间!' }],
          })(
            <TimePicker minuteStep={30} format={'HH:mm'} disabled />
          )}
        </Form.Item>
        <Form.Item label="结束时间" {...formItemLayout}>
          {getFieldDecorator('endtime', {
            initialValue: detail.end_time ? moment(detail.end_time, 'HH:mm') : null,
            rules: [{ required: true, message: '请输入结束时间!' }],
          })(
            <TimePicker minuteStep={30} format={'HH:mm'} disabled />
          )}
        </Form.Item>
        <Form.Item label="允许误差" {...formItemLayout}>
          <Row gutter={4}>
            <Col span={6}>
              {getFieldDecorator('error_range', {
                initialValue: detail.error_range,
                rules: [{ required: true, message: '请输入允许误差!' }],
              })(
                <InputNumber min={0} style={{ width: '100%' }} disabled />
              )}
            </Col>
            <Col span={8}>分钟</Col>
          </Row>
        </Form.Item>
        {
          detail.is_edit == 0 ?
            <Form.Item label="执行人员" {...formItemLayout}>
              {getFieldDecorator('user_list', {
                initialValue: selectUserList && selectUserList.length > 0 ? selectUserList.map(function (val) { return val.id }) : undefined,
                rules: [{ required: true, message: '请选择执行人员!' }],
              })(
                <Select placeholder="请选择" mode="multiple" disabled>
                  {userList.length > 0 ? userList.map((value, index) => { return <Option key={index} value={value.id}>{value.truename}</Option> }) : null}
                </Select>
              )}
            </Form.Item>
            :
            userList.length > 0 ?
              <Form.Item label="执行人员" {...formItemLayout}>
                {getFieldDecorator('user_list', {
                  initialValue: selectUserList && selectUserList.length > 0 ? selectUserList.map(function (val) { return val.id }) : undefined,
                  rules: [{ required: true, message: '请选择执行人员!' }],
                })(
                  <Select placeholder="请选择" mode="multiple">
                    {userList.length > 0 ? userList.map((value, index) => { return <Option key={index} value={value.id}>{value.truename}</Option> }) : null}
                  </Select>
                )}
              </Form.Item>
              :
              null
        }
        <Form.Item style={{ maxWidth: '600px' }} wrapperCol={{ span: 8, offset: 4 }}>
          <Button type="primary" onClick={handleOk}>确定</Button>
          <Button className="ml1" onClick={handleBack}>返回</Button>
        </Form.Item>
      </Form>
    </Card>
  </div>)
}

function mapStateToProps(state) {
  return {
    ...state.PatrolPlanEdit,
  };
}
export default connect(mapStateToProps)(Form.create()(PatrolPlanEdit));
import React from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Form, Breadcrumb, Card, Input, Select, DatePicker, Row, Col, InputNumber, TimePicker, Button, Modal } from 'antd';
const Option = Select.Option;

function PatrolPlanAdd(props) {
  const { dispatch, form, detail, lineList, execType, selectExecType, visible, userList, startValue, community_id } = props;
  const { getFieldDecorator, validateFields } = form;
  //布局
  const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 12 },
    style: { maxWidth: '700px' }
  }
  //调取用户列表接口
  function handleSubmit(e) {
    validateFields(['name', 'line_id', 'startdate', 'enddate', 'exec_type', `interval_x${selectExecType}`, `interval_y${selectExecType}`, 'starttime', 'endtime', 'error_range'], (err, values) => {
      if (err) {
        return;
      }
      dispatch({
        type: 'PatrolPlanAdd/getPlanUserList',
        payload: {
          community_id: community_id,
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
        }
      });
    });
  }
  //返回上一页
  function handleBack(e) {
    history.go(-1);
  }
  function disabledDate(current) {
    return current && current.valueOf() < Date.now() - 8640000;
  }
  function disabledEndDate(endValue) {
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() - 8640000 < startValue.valueOf();
  }
  //计划类型选择
  function selectChange(value) {
    dispatch({
      type: 'PatrolPlanAdd/concat',
      payload: { selectExecType: value }
    });
  }
  function onStartChange(value) {
    dispatch({
      type: 'PatrolPlanAdd/concat',
      payload: { startValue: value }
    });

  }
  //弹框确认新增
  function handleOk() {
    validateFields((err, values) => {
      if (err) {
        return;
      }
      dispatch({
        type: 'PatrolPlanAdd/getPlanAdd',
        payload: {
          community_id: community_id,
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
  //弹框关闭
  function handleCancel() {
    dispatch({
      type: 'PatrolPlanAdd/concat',
      payload: { visible: false }
    });
  }

  return (<div>
    <Breadcrumb separator="/">
      <Breadcrumb.Item>巡更管理</Breadcrumb.Item>
      <Breadcrumb.Item><a href="#/patrolPlan">巡更计划管理</a></Breadcrumb.Item>
      <Breadcrumb.Item>新增</Breadcrumb.Item>
    </Breadcrumb>
    <Card>
      <Form>
        <Form.Item label="计划名称" {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: detail.name,
            rules: [{ required: true, message: '请输入计划名称!' }],
          })(
            <Input type="text" placeholder="请输入计划名称" maxLength={10} />
          )}
        </Form.Item>

        <Form.Item label="对应线路" {...formItemLayout}>
          {getFieldDecorator('line_id', {
            initialValue: detail.line_id,
            rules: [{ required: true, message: '请选择对应线路!' }],
          })(
            <Select placeholder="请选择">
              {lineList ? lineList.map((value, index) => { return <Option key={index} value={value.id}>{value.name}</Option> }) : null}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="开始日期" {...formItemLayout}>
          {getFieldDecorator('startdate', {
            initialValue: detail.start_date ? moment(detail.start_date) : null,
            rules: [{ required: true, message: '请输入开始日期!' }],
          })(
            <DatePicker format={'YYYY-MM-DD'} disabledDate={disabledDate} onChange={onStartChange} />
          )}
        </Form.Item>
        <Form.Item label="结束日期" {...formItemLayout}>
          {getFieldDecorator('enddate', {
            initialValue: detail.end_date ? moment(detail.end_date) : null,
            rules: [{ required: true, message: '请输入结束日期!' }],
          })(
            <DatePicker disabledDate={disabledEndDate} />
          )}
        </Form.Item>
        <Form.Item label="计划类型" {...formItemLayout}>
          {getFieldDecorator('exec_type', {
            initialValue: detail.exec_type,
            rules: [{ required: true, message: '请选择计划类型!' }],
          })(
            <Select placeholder="请选择" onChange={selectChange}>
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
                  <InputNumber min={1} max={90} style={{ width: '100%' }} />
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
                  <InputNumber min={1} max={365} style={{ width: '100%' }} />
                )}
              </Col>
              <Col span={4} style={{ width: 'auto' }}>周的周</Col>
              <Col span={6}>
                {getFieldDecorator(`interval_y${selectExecType}`, {
                  initialValue: detail.interval_y,
                  rules: [{ required: true, message: '请输入执行间隔!' }],
                })(
                  <InputNumber min={1} max={7} style={{ width: '100%' }} />
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
                  <InputNumber min={1} max={365} style={{ width: '100%' }} />
                )}
              </Col>
              <Col span={4} style={{ width: 'auto' }}>个月的</Col>
              <Col span={6}>
                {getFieldDecorator(`interval_y${selectExecType}`, {
                  initialValue: detail.interval_y,
                  rules: [{ required: true, message: '请输入执行间隔!' }],
                })(
                  <InputNumber min={1} max={365} style={{ width: '100%' }} />
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
            <TimePicker minuteStep={30} defaultOpenValue={moment('00:00', 'HH:mm')} format={'HH:mm'} />
          )}
        </Form.Item>
        <Form.Item label="结束时间" {...formItemLayout}>
          {getFieldDecorator('endtime', {
            initialValue: detail.end_time ? moment(detail.end_time, 'HH:mm') : null,
            rules: [{ required: true, message: '请输入结束时间!' }],
          })(
            <TimePicker minuteStep={30} defaultOpenValue={moment('00:00', 'HH:mm')} format={'HH:mm'} />
          )}
        </Form.Item>
        <Form.Item label="允许误差" {...formItemLayout}>
          <Row gutter={4}>
            <Col span={6}>
              {getFieldDecorator('error_range', {
                initialValue: detail.error_range,
                rules: [{ required: true, message: '请输入允许误差!' }],
              })(
                <InputNumber min={0} style={{ width: '100%' }} />
              )}
            </Col>
            <Col span={8}>分钟</Col>
          </Row>
        </Form.Item>
        <Form.Item style={{ maxWidth: '600px' }} wrapperCol={{ span: 8, offset: 4 }}>
          <Button type="primary" onClick={handleSubmit}>确定</Button>
          <Button className="ml1" onClick={handleBack}>返回</Button>
        </Form.Item>
      </Form>
      {/*执行人员弹框*/}
      <Modal
        title="选择执行人员"
        okText="提交"
        cancelText="取消"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form>
          <Form.Item label="执行人员" {...formItemLayout}>
            {getFieldDecorator('user_list', {
              initialValue: detail.user_list && detail.user_list.length > 0 ? detail.user_list.map(function (val) { return val.id }) : undefined,
              rules: [{ required: true, message: '请选择执行人员!' }],
            })(
              <Select placeholder="请选择" mode="multiple">
                {userList.length > 0 ? userList.map((value, index) => { return <Option key={index} value={value.id}>{value.truename}</Option> }) : null}
              </Select>
            )}
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  </div>)
}

function mapStateToProps(state) {
  return {
    ...state.PatrolPlanAdd,
    loading: state.loading.models.PatrolPlanAdd
  };
}
export default connect(mapStateToProps)(Form.create()(PatrolPlanAdd));
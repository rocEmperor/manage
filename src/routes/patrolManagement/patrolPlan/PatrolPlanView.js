import React from 'react';
import { connect } from 'dva';
import { Form, Breadcrumb, Card, Button } from 'antd';

function PatrolPlanView(props) {
  const { detail, selectExecType } = props;
  //布局
  const formItemLayout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 18 },
    style: { marginBottom: '2px' }
  }
  //返回上一页
  function handleBack(e) {
    history.go(-1);
  }

  return (<div>
    <Breadcrumb separator="/">
      <Breadcrumb.Item>巡更管理</Breadcrumb.Item>
      <Breadcrumb.Item><a href="#/patrolPlan">巡更计划管理</a></Breadcrumb.Item>
      <Breadcrumb.Item>详情</Breadcrumb.Item>
    </Breadcrumb>
    <Card>
      <Form>
        <Form.Item label="计划名称" {...formItemLayout}>
          <span>{detail.name}</span>
        </Form.Item>
        <Form.Item label="对应线路" {...formItemLayout}>
          <span>{detail.line_name}</span>
        </Form.Item>
        <Form.Item label="开始日期" {...formItemLayout}>
          <span>{detail.start_date}</span>
        </Form.Item>
        <Form.Item label="结束日期" {...formItemLayout}>
          <span>{detail.end_date}</span>
        </Form.Item>
        <Form.Item label="计划类型" {...formItemLayout}>
          <span>{detail.exec_type_name}</span>
        </Form.Item>
        {selectExecType == 1
          ? <Form.Item label="执行间隔" {...formItemLayout}>
            <span>每{detail.interval_x}天执行计划</span>
          </Form.Item>
          : null}
        {selectExecType == 2
          ? <Form.Item label="执行间隔" {...formItemLayout}>
            <span>每{detail.interval_x}周的周{detail.interval_y}执行</span>
          </Form.Item>
          : null}
        {selectExecType == 3
          ? <Form.Item label="执行间隔" {...formItemLayout}>
            <span>每{detail.interval_x}个月的{detail.interval_y}号执行</span>
          </Form.Item>
          : null}
        <Form.Item label="开始时间" {...formItemLayout}>
          <span>{detail.start_time}</span>
        </Form.Item>
        <Form.Item label="结束时间" {...formItemLayout}>
          <span>{detail.end_time}</span>
        </Form.Item>
        <Form.Item label="允许误差" {...formItemLayout}>
          <span>{detail.error_range}分钟</span>
        </Form.Item>
        <Form.Item label="执行人员" {...formItemLayout}>
          {detail.user_list ? detail.user_list.map((value) => <span key={value.id}>{value.name}&nbsp;&nbsp;&nbsp;</span>) : null}
        </Form.Item>
        <Form.Item style={{ marginTop: '20px' }} wrapperCol={{ span: 8, offset: 3 }}>
          <Button onClick={handleBack}>返回</Button>
        </Form.Item>
      </Form>
    </Card>
  </div>)
}

function mapStateToProps(state) {
  return {
    ...state.PatrolPlanView
  };
}
export default connect(mapStateToProps)(Form.create()(PatrolPlanView));
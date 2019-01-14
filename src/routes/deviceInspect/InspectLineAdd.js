import React from 'react';
import { connect } from 'dva';
import { Form, Breadcrumb, Card, Input, Button, Transfer } from 'antd';


function InspectLineAdd(props) {
  let { dispatch, form, loading, id, detail, mockData, targetKeys, community_id } = props;
  const { getFieldDecorator } = form;
  //布局
  const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 17 },
    style: { maxWidth: '600px' }
  }
  //选择巡检点
  function handleChange(nextTargetKeys, direction, moveKeys) {
    dispatch({
      type: 'InspectLineAdd/concat', payload: { targetKeys: nextTargetKeys }
    });
  }
  //提交
  function handleSubmit(e) {
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      if (id) {//编辑
        dispatch({
          type: 'InspectLineAdd/getLineEdit',
          payload: { ...values, community_id, id }
        });
      } else {//新增
        dispatch({
          type: 'InspectLineAdd/getLineAdd',
          payload: { ...values, community_id }
        });
      }
    });

  }
  //返回上一页
  function handleBack(e) {
    history.go(-1);
  }
  return (<div>
    <Breadcrumb separator="/">
      <Breadcrumb.Item>设备巡检</Breadcrumb.Item>
      <Breadcrumb.Item><a href="#/inspectLineManagement">巡检线路管理</a></Breadcrumb.Item>
      <Breadcrumb.Item>{id ? '编辑' : '新增'}</Breadcrumb.Item>
    </Breadcrumb>
    <Card>
      <Form>
        <Form.Item label="线路名称" {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: detail.name,
            rules: [{ required: true, message: '请输入线路名称!' }, { pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/, message: "输入格式有误!" }],
          })(
            <Input type="text" placeholder="请输入线路名称" maxLength={15} />
          )}
        </Form.Item>
        <Form.Item label="负责人" {...formItemLayout}>
          {getFieldDecorator('head_name', {
            initialValue: detail.head_name,
            rules: [{ required: true, message: '请输入负责人!' }, { pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/, message: "输入格式有误!" }],
          })(
            <Input type="text" placeholder="请输入负责人" maxLength={15} />
          )}
        </Form.Item>
        <Form.Item label="联系电话" {...formItemLayout}>
          {getFieldDecorator('head_mobile', {
            initialValue: detail.head_mobile,
            rules: [{ required: true, message: '请输入联系电话!' }, { pattern: /^1\d{10}$/, message: "您输入的手机号有误!" }],
          })(
            <Input type="text" placeholder="请输入联系电话" />
          )}
        </Form.Item>
        <Form.Item label="选择巡检点" {...formItemLayout}>
          {getFieldDecorator('pointList', {
            initialValue: targetKeys,
            rules: [{ required: true, message: '请选择巡检点!' }],
          })(
            <Transfer
              titles={['未选择的地点', '已选择的地点']}
              dataSource={mockData}
              targetKeys={targetKeys}
              onChange={handleChange}
              render={item => item.title}
              notFoundContent=""
            />
          )}
        </Form.Item>
        <Form.Item style={{ maxWidth: '600px' }} wrapperCol={{ span: 8, offset: 4 }}>
          <Button type="primary" onClick={handleSubmit} loading={loading}>提交</Button>
          <Button className="ml1" onClick={handleBack}>返回</Button>
        </Form.Item>
      </Form>
    </Card>
  </div>)
}
function mapStateToProps(state) {
  return {
    ...state.InspectLineAdd,
    loading: state.loading.models.InspectLineAdd
  };
}
export default connect(mapStateToProps)(Form.create()(InspectLineAdd));

import React from 'react';
import { connect } from 'dva';
import { Form, Breadcrumb, Card, Input, Button, TreeSelect } from 'antd';

function ParkingLotManagementAddEdit(props) {
  const { loading, form, dispatch, id, detail, treeData, community_id } = props;
  const { getFieldDecorator } = form;

  /**
   * 布局
   */
  const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 17 },
    style: { maxWidth: '600px' }
  }
  /**
   * 提交
   */
  function handleSubmit(e) {
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const handleValues = { ...values, community_id };
      if (id) {//编辑
        dispatch({
          type: 'ParkingLotManagementAddEdit/getLotAreaEdit',
          payload: { ...handleValues, id }
        });
      } else {//新增
        dispatch({
          type: 'ParkingLotManagementAddEdit/getLotAreaAdd',
          payload: { ...handleValues }
        });
      }
    });
  }
  /**
   * 返回上一页
   */
  function handleBack(e) {
    history.go(-1);
  }
  return (<div>
    <Breadcrumb separator=">">
      <Breadcrumb.Item>停车管理</Breadcrumb.Item>
      <Breadcrumb.Item><a href="#/parkingLotManagement">车场管理</a></Breadcrumb.Item>
      <Breadcrumb.Item>{id ? '编辑' : '新增'}</Breadcrumb.Item>
    </Breadcrumb>
    <Card>
      <Form>
        <Form.Item label="上级停车场名称" {...formItemLayout}>
          {getFieldDecorator('parent_id', {
            initialValue: Object.keys(detail).length!=0?String(detail.parent_id):'0',
            rules: [{ required: true, message: '请选择上级停车场名称!' }],
          })(
            <TreeSelect
              dropdownStyle={{ maxHeight: 200, overflow: 'auto' }}
              treeData={treeData}
              placeholder="请选择上级停车场名称"
              treeDefaultExpandedKeys={["0"]}
              disabled={id?true:false}
            />
          )}
        </Form.Item>
        <Form.Item label="名称" {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: detail.name,
            rules: [{ required: true, message: '请输入名称!' }],
          })(
            <Input type="text" placeholder="请输入名称" maxLength={30} />
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
    ...state.ParkingLotManagementAddEdit,
    loading: state.loading.models.ParkingLotManagementAddEdit
  };
}
export default connect(mapStateToProps)(Form.create()(ParkingLotManagementAddEdit));

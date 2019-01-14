import React from 'react';
import { connect } from 'dva';
import { Form, Breadcrumb, Card, Input, Button, TreeSelect } from 'antd';
const { TextArea } = Input;

function DeviceClassifyAddEdit(props) {
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
          type: 'DeviceClassifyAddEdit/getDeviceCategoryEdit',
          payload: { ...handleValues, id }
        });
      } else {//新增
        dispatch({
          type: 'DeviceClassifyAddEdit/getDeviceCategoryAdd',
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
      <Breadcrumb.Item>设备管理</Breadcrumb.Item>
      <Breadcrumb.Item><a href="#/deviceClassify">设备分类</a></Breadcrumb.Item>
      <Breadcrumb.Item>{id ? '编辑' : '新增'}</Breadcrumb.Item>
    </Breadcrumb>
    <Card>
      <Form>
        <Form.Item label="上级类别" {...formItemLayout}>
          {getFieldDecorator('parent_id', {
            initialValue: detail.parent_id,
            rules: [{ required: true, message: '请选择上级类别!' }],
          })(
            <TreeSelect
              dropdownStyle={{ maxHeight: 200, overflow: 'auto' }}
              treeData={treeData}
              placeholder="请选择"
              treeDefaultExpandedKeys={["0"]}
            />
          )}
        </Form.Item>
        <Form.Item label="类别名称" {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: detail.name,
            rules: [{ required: true, message: '请输入类别名称!' }],
          })(
            <Input type="text" placeholder="请输入类别名称" maxLength={15} />
          )}
        </Form.Item>
        <Form.Item label="类别说明" {...formItemLayout}>
          {getFieldDecorator('note', {
            initialValue: detail.note,
          })(
            <TextArea rows={4} placeholder="请输入类别说明" maxLength={100} />
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
    ...state.DeviceClassifyAddEdit,
    loading: state.loading.models.DeviceClassifyAddEdit
  };
}
export default connect(mapStateToProps)(Form.create()(DeviceClassifyAddEdit));

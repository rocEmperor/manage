import React from 'react';
import { connect } from 'dva';
import { Form, Breadcrumb, Card, Button } from 'antd';
import moment from 'moment';

function DeviceRegisterShow(props) {
  const { form, dispatch, detail, img_url } = props;
  const { getFieldDecorator } = form;

  /**
   * 布局
   */
  const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 17 },
    style: { maxWidth: '600px', marginBottom: "10px" }
  }
  /**
   * 文件下载
   * @param {object} file 
   */
  function downloadFile(file) {
    dispatch({
      type: 'DeviceRegisterShow/getDownFile',
      payload: {
        file_name: file.name ? file.name : '',
        file_url: file.url ? file.url : ''
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
      <Breadcrumb.Item><a href="#/deviceRegister">设备保养登记</a></Breadcrumb.Item>
      <Breadcrumb.Item>查看</Breadcrumb.Item>
    </Breadcrumb>
    <Card>
      <Form>
        <Form.Item label="设备分类" {...formItemLayout}>
          {getFieldDecorator('category_id', {
            initialValue: detail.category_id,
            rules: [{ required: true, message: '请选择设备分类!' }],
          })(
            <span>{detail.category_name}</span>
          )}
        </Form.Item>
        <Form.Item label="对应设备" {...formItemLayout}>
          {getFieldDecorator('device_id', {
            initialValue: detail.device_id,
            rules: [{ required: true, message: '请选择对应设备!' }],
          })(
            <span>{detail.device_name}</span>
          )}
        </Form.Item>
        <Form.Item label="设备编号" {...formItemLayout}>
          {getFieldDecorator('device_no', {
            initialValue: detail.device_no,
            rules: [{ required: true, message: '请获取设备编号!' }],
          })(
            <span>{detail.device_no}</span>
          )}
        </Form.Item>
        <Form.Item label="保养时间" {...formItemLayout}>
          {getFieldDecorator('data', {
            initialValue: [detail.start_at ? moment(detail.start_at) : null, detail.end_at ? moment(detail.end_at) : null],
            rules: [{ required: true, message: '请选择保养时间!' }],
          })(
            <span>{detail.start_at} ~ {detail.end_at}</span>
          )}
        </Form.Item>
        <Form.Item label="设备保养人" {...formItemLayout}>
          {getFieldDecorator('repair_person', {
            initialValue: detail.repair_person,
            rules: [{ required: true, message: '请输入设备保养人!' }],
          })(
            <span>{detail.repair_person}</span>
          )}
        </Form.Item>
        <Form.Item label="保养要求与目的" {...formItemLayout}>
          {getFieldDecorator('content', {
            initialValue: detail.content,
          })(
            <span>{detail.content}</span>
          )}
        </Form.Item>
        <Form.Item label="保养状态" {...formItemLayout}>
          {getFieldDecorator('status', {
            initialValue: detail.status,
            rules: [{ required: true, message: '请选择保养状态!' }],
          })(
            <span>{detail.status_name}</span>
          )}
        </Form.Item>
        <Form.Item label="保养检查结果" {...formItemLayout}>
          {getFieldDecorator('check_note', {
            initialValue: detail.check_note,
          })(
            <span>{detail.check_note}</span>
          )}
        </Form.Item>
        <Form.Item label="检查人" {...formItemLayout}>
          {getFieldDecorator('check_person', {
            initialValue: detail.check_person,
            rules: [{ required: true, message: '请输入检查人!' }],
          })(
            <span>{detail.check_person}</span>
          )}
        </Form.Item>
        <Form.Item label="检查日期" {...formItemLayout}>
          {getFieldDecorator('check_at', {
            initialValue: detail.check_at ? moment(detail.check_at) : null,
            rules: [{ required: true, message: '请输入检查日期!' }],
          })(
            <span>{detail.check_at}</span>
          )}
        </Form.Item>
        <Form.Item label="上传附件" {...formItemLayout}>
          {getFieldDecorator('file_url', {
            initialValue: img_url,
          })(
            <div>
              {img_url.length > 0 ?
                img_url.map((value, index) => {
                  return <div key={index}><a href="javascript:;" onClick={downloadFile.bind(this, value)}>{value.name}</a></div>
                }) : null}
            </div>
          )}
        </Form.Item>

        <Form.Item style={{ maxWidth: '600px' }} wrapperCol={{ span: 17, offset: 4 }}>
          <Button className="ml1" onClick={handleBack}>返回</Button>
        </Form.Item>
      </Form>
    </Card>
  </div>)
}
function mapStateToProps(state) {
  return {
    ...state.DeviceRegisterShow,
    loading: state.loading.models.DeviceRegisterShow
  };
}
export default connect(mapStateToProps)(Form.create()(DeviceRegisterShow));
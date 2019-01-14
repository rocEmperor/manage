import React from 'react';
import { connect } from 'dva';
import { Form, Breadcrumb, Card, Button, Input, Select, DatePicker, Radio, TreeSelect } from 'antd';
const Option = Select.Option;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const RadioGroup = Radio.Group;
import UploadFile from '../../../components/UploadFile/index';
import moment from 'moment';

function DeviceRegisterAddEdit(props) {
  const { dispatch, form, loading, id, community_id, detail, treeData, deviceIdType, img_url } = props;
  const { getFieldDecorator } = form;

  /**
   * 布局
   */
  const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 17 },
    style: { maxWidth: '700px' }
  }
  /**
   * 提交
   */
  function handleSubmit(e) {
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      /**日期格式化 */
      if (values.data && values.data.length > 0) {
        values.start_at = values.data[0].format('YYYY-MM-DD');
        values.end_at = values.data[1].format('YYYY-MM-DD');
        delete values.data;
      } else {
        delete values.data;
      }
      values.check_at = values.check_at ? values.check_at.format('YYYY-MM-DD') : '';
      /**
       * 文件上传
       */
      let urls = [];
      let urls_name = [];
      let imgsLen = values.file_url && values.file_url.length;
      if (values.file_url !== undefined && imgsLen !== 0) {
        for (let i = 0; i < imgsLen; i++) {
          if (values.file_url[i].response) {
            urls[i] = values.file_url[i].response.data.filepath;
            urls_name[i] = values.file_url[i].name;
          } else {
            urls[i] = values.file_url[i].url;
            urls_name[i] = values.file_url[i].name;
          }
        }
      }
      let file_url_str = "";
      let file_name_str = "";
      if (urls.length > 0) {
        file_url_str = urls.join(",");
        file_name_str = urls_name.join(",");
      }
      values.file_url = file_url_str;
      values.file_name = file_name_str;
      if (id) {//编辑
        dispatch({
          type: 'DeviceRegisterAddEdit/getDeviceRepairEdit',
          payload: { ...values, community_id, id }
        });
      } else {//新增
        dispatch({
          type: 'DeviceRegisterAddEdit/getDeviceRepairAdd',
          payload: { ...values, community_id }
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
  /**
   * 请选择设备分类显示对应设备
   * @param {*} value 
   */
  function onChangeTree(value) {
    form.setFieldsValue({ device_id: undefined, device_no: undefined });
    dispatch({
      type: 'DeviceRegisterAddEdit/getDeviceDropDown',
      payload: { community_id, category_id: value }
    });
  }
  /**
   * 选择对应设备设置设备编号
   * @param {*} value 
   * @param {*} option 
   */
  function onChangeDevice(value, option) {
    props.form.setFieldsValue({
      device_no: option.props.device_no
    });
  }
  /**
   * 文件上传
   */
  const uploadFileProps = {
    size: 1,
    file: img_url,
    acceptType: ".pdf,.zip,.txt,.jpg,.rar,.wps,.png,.jpeg,.doc,.docx,.ppt,.pptx,.xls,.xlsx",
    handleImage(id, fileList) {
      form.setFieldsValue({ file_url: fileList })
    },
    downloadFile(file) {
      dispatch({
        type: 'DeviceRegisterAddEdit/getDownFile',
        payload: {
          file_name: file.name ? file.name : '',
          file_url: file.url ? file.url : ''
        }
      });
    }
  }
  return (<div>
    <Breadcrumb separator=">">
      <Breadcrumb.Item>设备管理</Breadcrumb.Item>
      <Breadcrumb.Item><a href="#/deviceRegister">设备保养登记</a></Breadcrumb.Item>
      <Breadcrumb.Item>{id ? '编辑' : '新增'}</Breadcrumb.Item>
    </Breadcrumb>
    <Card>
      <Form>
        <Form.Item label="设备分类" {...formItemLayout}>
          {getFieldDecorator('category_id', {
            initialValue: detail.category_id,
            rules: [{ required: true, message: '请选择设备分类!' }],
          })(
            <TreeSelect
              dropdownStyle={{ maxHeight: 200, overflow: 'auto' }}
              treeData={treeData}
              placeholder="请选择"
              treeDefaultExpandedKeys={["0"]}
              onChange={onChangeTree}
            />
          )}
        </Form.Item>
        <Form.Item label="对应设备" {...formItemLayout}>
          {getFieldDecorator('device_id', {
            initialValue: detail.device_id,
            rules: [{ required: true, message: '请选择对应设备!' }],
          })(
            <Select placeholder="请选择" notFoundContent="没有数据" onChange={onChangeDevice.bind(this)}>
              {deviceIdType ? deviceIdType.map((value, index) => { return <Option key={index} value={value.id} device_no={value.device_no}>{value.name}</Option> }) : null}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="设备编号" {...formItemLayout}>
          {getFieldDecorator('device_no', {
            initialValue: detail.device_no,
            rules: [{ required: true, message: '请获取设备编号!' }],
          })(
            <Input type="text" placeholder="请获取设备编号" maxLength={15} disabled />
          )}
        </Form.Item>
        <Form.Item label="保养时间" {...formItemLayout}>
          {getFieldDecorator('data', {
            initialValue: detail.start_at && detail.end_at ? [moment(detail.start_at), moment(detail.end_at)] : undefined,
            rules: [{ required: true, message: '请选择保养时间!' }],
          })(
            <RangePicker />
          )}
        </Form.Item>
        <Form.Item label="设备保养人" {...formItemLayout}>
          {getFieldDecorator('repair_person', {
            initialValue: detail.repair_person,
            rules: [{ required: true, message: '请输入设备保养人!' }],
          })(
            <Input type="text" placeholder="请输入设备保养人" maxLength={15} />
          )}
        </Form.Item>
        <Form.Item label="保养要求与目的" {...formItemLayout}>
          {getFieldDecorator('content', {
            initialValue: detail.content,
          })(
            <TextArea rows={4} placeholder="请输入保养要求与目的" maxLength={200} />
          )}
        </Form.Item>
        <Form.Item label="保养状态" {...formItemLayout}>
          {getFieldDecorator('status', {
            initialValue: detail.status ? detail.status : "1",
            rules: [{ required: true, message: '请选择保养状态!' }],
          })(
            <RadioGroup>
              <Radio value={"1"}>合格</Radio>
              <Radio value={"2"}>不合格</Radio>
            </RadioGroup>
          )}
        </Form.Item>
        <Form.Item label="保养检查结果" {...formItemLayout}>
          {getFieldDecorator('check_note', {
            initialValue: detail.check_note,
          })(
            <TextArea rows={4} placeholder="请输入保养检查结果" maxLength={200} />
          )}
        </Form.Item>
        <Form.Item label="检查人" {...formItemLayout}>
          {getFieldDecorator('check_person', {
            initialValue: detail.check_person,
            rules: [{ required: true, message: '请输入检查人!' }],
          })(
            <Input type="text" placeholder="请输入检查人" maxLength={15} />
          )}
        </Form.Item>
        <Form.Item label="检查日期" {...formItemLayout}>
          {getFieldDecorator('check_at', {
            initialValue: detail.check_at ? moment(detail.check_at) : null,
            rules: [{ required: true, message: '请输入检查日期!' }],
          })(
            <DatePicker />
          )}
        </Form.Item>
        <Form.Item label="上传附件" {...formItemLayout} extra="可以上传.pdf,.zip,.txt,.jpg,.rar,.wps,.png,.jpeg,.doc,.docx,.ppt,.pptx,.xls,.xlsx格式的文件">
          {getFieldDecorator('file_url', {
            initialValue: img_url,
          })(
            <UploadFile {...uploadFileProps} />
          )}
        </Form.Item>
        <Form.Item style={{ maxWidth: '700px' }} wrapperCol={{ span: 17, offset: 4 }}>
          <Button type="primary" onClick={handleSubmit} loading={loading}>提交</Button>
          <Button className="ml1" onClick={handleBack}>返回</Button>
        </Form.Item>

      </Form>
    </Card>
  </div>)
}
function mapStateToProps(state) {
  return {
    ...state.DeviceRegisterAddEdit,
    loading: state.loading.models.DeviceRegisterAddEdit
  };
}
export default connect(mapStateToProps)(Form.create()(DeviceRegisterAddEdit));

import React from 'react';
import { connect } from 'dva';
import { Form, Breadcrumb, Card, Input, Button, TreeSelect, Select, DatePicker } from 'antd';
const Option = Select.Option;
const { TextArea } = Input;
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
import UploadFile from '../../../components/UploadFile/index';

function AccidentRecordAdd(props) {
  const { loading, form, dispatch, id, detail, treeData, community_id, deviceIdType, img_url } = props;

  const { getFieldDecorator } = form;
  /**
   * 布局
   */
  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
    style: { maxWidth: '800px' }
  }
  /**
   * 提交
   */
  function handleSubmit(e) {
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      values.happen_at = values.happen_at ? values.happen_at.format('YYYY-MM-DD HH') : '';
      values.scene_at = values.scene_at ? values.scene_at.format('YYYY-MM-DD HH') : '';
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
          type: 'AccidentRecordAdd/accidentEdit',
          payload: { ...values, community_id, id }
        });
      } else {//新增
        dispatch({
          type: 'AccidentRecordAdd/accidentAdd',
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
    form.setFieldsValue({ device_id: undefined});
    dispatch({
      type: 'AccidentRecordAdd/deviceDropDown',
      payload: { community_id, category_id: value }
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
        type: 'AccidentRecordAdd/getDownFile',
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
      <Breadcrumb.Item><a href="#/accidentRecord">重大事故记录</a></Breadcrumb.Item>
      <Breadcrumb.Item>{id ? '编辑' : '新增'}</Breadcrumb.Item>
    </Breadcrumb>
    <Card>
      <Form>
        <Form.Item label="设备分类" {...formItemLayout}>
          {getFieldDecorator('category_id', {
            initialValue: detail.category_id,
            rules: [{ required: true, message: '请选择设备分类' }],
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
            rules: [{ required: true, message: '请选择对应设备' }],
          })(
            <Select placeholder="请选择对应设备">
              {deviceIdType ? deviceIdType.map((value, index) => { return <Option key={index} value={value.id}>{value.name}</Option> }) : null}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="事故发生时间" {...formItemLayout}>
          {getFieldDecorator('happen_at', {
            initialValue: Object.keys(detail).length == 0 ? null : moment(detail.happen_at),
            rules: [{ required: true, message: '请选择事故发生时间' }]
          })(<DatePicker format="YYYY-MM-DD HH:00" showTime={{ format: 'HH' }} showToday={false} placeholder="请选择事故发生时间" style={{ width: "100%" }} />
          )}
        </Form.Item>
        <Form.Item label="出现场时间" {...formItemLayout}>
          {getFieldDecorator('scene_at', {
            initialValue: Object.keys(detail).length == 0 ? null : moment(detail.scene_at),
            rules: [{ required: true, message: '请选择出现场时间' }],
          })(<DatePicker format="YYYY-MM-DD HH:00" showTime={{ format: 'HH' }} showToday={false} placeholder="请选择出现场时间" style={{ width: "100%" }} />
          )}
        </Form.Item>
        <Form.Item label="出现场人员" {...formItemLayout}>
          {getFieldDecorator('scene_person', {
            initialValue: detail.scene_person
          })(<Input type="text" placeholder="请输入出现场人员" maxLength={15} />
          )}
        </Form.Item>
        <Form.Item label="确认人" {...formItemLayout}>
          {getFieldDecorator('confirm_person', {
            initialValue: detail.confirm_person
          })(<Input type="text" placeholder="请输入确认人" maxLength={15} />
          )}
        </Form.Item>
        <Form.Item label="事件事故描述及损失范围" {...formItemLayout}>
          {getFieldDecorator('describe', {
            initialValue: detail.describe,
          })(
            <TextArea rows={4} placeholder="请输入事件事故描述及损失范围" maxLength={200} />
          )}
        </Form.Item>
        <Form.Item label="事故原因及处理意见" {...formItemLayout}>
          {getFieldDecorator('opinion', {
            initialValue: detail.opinion,
          })(
            <TextArea rows={4} placeholder="请输入事故原因及处理意见" maxLength={200} />
          )}
        </Form.Item>
        <Form.Item label="处理结果" {...formItemLayout}>
          {getFieldDecorator('result', {
            initialValue: detail.result,
          })(
            <TextArea rows={4} placeholder="请输入处理结果" maxLength={200} />
          )}
        </Form.Item>
        <Form.Item label="事故描述附件上传" {...formItemLayout} extra="可以上传.pdf,.zip,.txt,.jpg,.rar,.wps,.png,.jpeg,.doc,.docx,.ppt,.pptx,.xls,.xlsx格式的文件">
          {getFieldDecorator('file_url', {
            initialValue: img_url,
          })(
            <UploadFile {...uploadFileProps} />
          )}
        </Form.Item>
        <Form.Item style={{ maxWidth: '800px' }} wrapperCol={{ span: 14, offset: 6 }}>
          <Button type="primary" onClick={handleSubmit} loading={loading}>提交</Button>
          <Button className="ml1" onClick={handleBack}>返回</Button>
        </Form.Item>
      </Form>
    </Card>
  </div>)
}
function mapStateToProps(state) {
  return {
    ...state.AccidentRecordAdd,
    loading: state.loading.models.AccidentRecordAdd
  };
}
export default connect(mapStateToProps)(Form.create()(AccidentRecordAdd));

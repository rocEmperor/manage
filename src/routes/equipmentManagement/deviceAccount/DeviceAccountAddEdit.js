import React from 'react';
import { connect } from 'dva';
import { Form, Breadcrumb, Card, Button, Input, Select, Row, Col, DatePicker, TreeSelect } from 'antd';
const Option = Select.Option;
const { TextArea } = Input;
import moment from 'moment';
import UploadFile from '../../../components/UploadFile/index';
import { checkPhone } from '../../../utils/util';

function DeviceAccountAddEdit(props) {
  const { dispatch, form, loading, id, community_id, detail, statusType, treeData, scrappedStatus, img_url } = props;
  const { getFieldDecorator } = form;

  /**
   * 布局
   */
  const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 18 },
  }
  const formItemLayout2 = {
    labelCol: { span: 3 },
    wrapperCol: { span: 21 },
  }
  /**
   * 提交
   */
  function handleSubmit(e) {
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      values.plan_scrap_at = values.plan_scrap_at ? values.plan_scrap_at.format('YYYY-MM-DD') : '';
      values.start_at = values.start_at ? values.start_at.format('YYYY-MM-DD') : '';
      values.expired_at = values.expired_at ? values.expired_at.format('YYYY-MM-DD') : '';

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
          type: 'DeviceAccountAddEdit/getDeviceEdit',
          payload: { ...values, community_id, id }
        });
      } else {//新增
        dispatch({
          type: 'DeviceAccountAddEdit/getDeviceAdd',
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
   * 设备状态选择
   * @param {*} value 设备状态id
   */
  function handleChange(value) {
    dispatch({
      type: 'DeviceAccountAddEdit/concat',
      payload: { scrappedStatus: value }
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
        type: 'DeviceAccountAddEdit/getDownFile',
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
      <Breadcrumb.Item><a href="#/deviceAccount">设备台账</a></Breadcrumb.Item>
      <Breadcrumb.Item>{id ? '编辑' : '新增'}</Breadcrumb.Item>
    </Breadcrumb>
    <Card>
      <Form>
        <Row>
          <Col span={12}>
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
                />
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="设备名称" {...formItemLayout}>
              {getFieldDecorator('name', {
                initialValue: detail.name,
                rules: [{ required: true, message: '请输入设备名称!' }],
              })(
                <Input type="text" placeholder="请输入设备名称" maxLength={15} />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item label="设备编号" {...formItemLayout}>
              {getFieldDecorator('device_no', {
                initialValue: detail.device_no,
                rules: [{ required: true, message: '请输入设备编号!' }],
              })(
                <Input type="text" placeholder="请输入设备编号" maxLength={15} />
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="技术规格" {...formItemLayout}>
              {getFieldDecorator('technology', {
                initialValue: detail.technology,
              })(
                <Input type="text" placeholder="请输入技术规格" maxLength={15} />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item label="数量" {...formItemLayout}>
              {getFieldDecorator('num', {
                initialValue: detail.num,
                rules: [{ pattern: /^[0-9]+$/, message: "输入格式有误!" }],
              })(
                <Input type="text" placeholder="请输入数量" />
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="单价" {...formItemLayout}>
              {getFieldDecorator('price', {
                initialValue: detail.price,
                rules: [{ pattern: /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/, message: "输入格式有误!" }],
              })(
                <Input type="text" placeholder="请输入单价" />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item label="供应商" {...formItemLayout}>
              {getFieldDecorator('supplier', {
                initialValue: detail.supplier,
                rules: [{ required: true, message: '请输入供应商!' }],
              })(
                <Input type="text" placeholder="请输入供应商" maxLength={15} />
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="供应商电话" {...formItemLayout}>
              {getFieldDecorator('supplier_tel', {
                initialValue: detail.supplier_tel,
                rules: [{ required: true, message: '请输入供应商电话!' }, { validator: checkPhone.bind(this), message: '请输入手机号码！' }],
              })(
                <Input type="text" placeholder="请输入供应商电话" />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item label="安装地点" {...formItemLayout}>
              {getFieldDecorator('install_place', {
                initialValue: detail.install_place,
                rules: [{ required: true, message: '请输入安装地点!' },],
              })(
                <Input type="text" placeholder="请输入安装地点" maxLength={15} />
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="设备负责人" {...formItemLayout}>
              {getFieldDecorator('leader', {
                initialValue: detail.leader,
                rules: [{ required: true, message: '请输入设备负责人!' },],
              })(
                <Input type="text" placeholder="请输入设备负责人" maxLength={15} />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item label="设备状态" {...formItemLayout}>
              {getFieldDecorator('status', {
                initialValue: detail.status,
                rules: [{ required: true, message: '请选择设备状态!' }],
              })(
                <Select placeholder="请选择" notFoundContent="没有数据" onChange={handleChange}>
                  {statusType ? statusType.map((value, index) => { return <Option key={index} value={value.id}>{value.name}</Option> }) : null}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="拟报废日期" {...formItemLayout}>
              {getFieldDecorator('plan_scrap_at', {
                initialValue: detail.plan_scrap_at ? moment(detail.plan_scrap_at) : null,
                rules: [{ required: true, message: '请输入拟报废日期!' }],
              })(
                <DatePicker />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item label="出厂日期" {...formItemLayout}>
              {getFieldDecorator('start_at', {
                initialValue: detail.start_at ? moment(detail.start_at) : null,
              })(
                <DatePicker />
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="保修截止日期" {...formItemLayout}>
              {getFieldDecorator('expired_at', {
                initialValue: detail.expired_at ? moment(detail.expired_at) : null,
              })(
                <DatePicker />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item label="寿命年限" {...formItemLayout}>
              {getFieldDecorator('age_limit', {
                initialValue: detail.age_limit,
                rules: [{ pattern: /^[0-9]+$/, message: "输入格式有误!" }],
              })(
                <Input type="text" placeholder="请输入寿命年限" maxLength={15} />
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="保修单位" {...formItemLayout}>
              {getFieldDecorator('repair_company', {
                initialValue: detail.repair_company,
                rules: [],
              })(
                <Input type="text" placeholder="请输入保修单位" maxLength={15} />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item label="制造单位" {...formItemLayout}>
              {getFieldDecorator('make_company', {
                initialValue: detail.make_company,
                rules: [],
              })(
                <Input type="text" placeholder="请输入制造单位" maxLength={15} />
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="制造单位电话" {...formItemLayout}>
              {getFieldDecorator('make_company_tel', {
                initialValue: detail.make_company_tel,
                rules: [{ validator: checkPhone.bind(this), message: '请输入手机号码！' }],
              })(
                <Input type="text" placeholder="请输入制造单位电话" />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item label="安装单位" {...formItemLayout}>
              {getFieldDecorator('install_company', {
                initialValue: detail.install_company,
                rules: [],
              })(
                <Input type="text" placeholder="请输入安装单位" maxLength={15} />
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="安装单位电话" {...formItemLayout}>
              {getFieldDecorator('install_company_tel', {
                initialValue: detail.install_company_tel,
                rules: [{ validator: checkPhone.bind(this), message: '请输入手机号码！' }],
              })(
                <Input type="text" placeholder="请输入安装单位电话" />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={20}>
            <Form.Item label="备注" {...formItemLayout2}>
              {getFieldDecorator('note', {
                initialValue: detail.note,
                rules: [],
              })(
                <TextArea rows={4} placeholder="请输入备注" maxLength={200} />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={20}>
            <Form.Item label="设备资料附件" {...formItemLayout2} extra="可以上传.pdf,.zip,.txt,.jpg,.rar,.wps,.png,.jpeg,.doc,.docx,.ppt,.pptx,.xls,.xlsx格式的文件">
              {getFieldDecorator('file_url', {
                initialValue: img_url,
              })(
                <UploadFile {...uploadFileProps} />
              )}
            </Form.Item>
          </Col>
        </Row>
        {scrappedStatus == 2 ?
          <span>
            <Row>
              <Col span={12}>
                <Form.Item label="报废人" {...formItemLayout}>
                  {getFieldDecorator('scrap_person', {
                    initialValue: detail.scrap_person,
                    rules: [{ required: true, message: '请输入报废人!' }],
                  })(
                    <Input type="text" placeholder="请输入报废人" maxLength={15} />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={20}>
                <Form.Item label="报废说明" {...formItemLayout2}>
                  {getFieldDecorator('scrap_note', {
                    initialValue: detail.scrap_note,
                    rules: [{ required: true, message: '请输入报废说明!' }],
                  })(
                    <TextArea rows={4} placeholder="请输入报废说明" maxLength={200} />
                  )}
                </Form.Item>
              </Col>
            </Row>
          </span>
          : null}
        <Row>
          <Col span={12}>
            <Form.Item style={{ maxWidth: '600px' }} wrapperCol={{ span: 17, offset: 4 }}>
              <Button type="primary" onClick={handleSubmit} loading={loading}>提交</Button>
              <Button className="ml1" onClick={handleBack}>返回</Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  </div>)
}
function mapStateToProps(state) {
  return {
    ...state.DeviceAccountAddEdit,
    loading: state.loading.models.DeviceAccountAddEdit
  };
}
export default connect(mapStateToProps)(Form.create()(DeviceAccountAddEdit));

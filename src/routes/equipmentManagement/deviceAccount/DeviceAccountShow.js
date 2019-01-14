import React from 'react';
import { connect } from 'dva';
import { Form, Breadcrumb, Card, Row, Col, Button } from 'antd';
import moment from 'moment';
import { checkPhone } from '../../../utils/util';

function DeviceAccountShow(props) {
  const { form, dispatch, detail, img_url, scrappedStatus } = props;
  const { getFieldDecorator } = form;
  /**
   * 布局
   */
  const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 18 },
    style: { marginBottom: "10px" }
  }
  const formItemLayout2 = {
    labelCol: { span: 3 },
    wrapperCol: { span: 21 },
    style: { marginBottom: "10px" }
  }
  /**
   * 文件下载
   * @param {object} file 
   */
  function downloadFile(file) {
    dispatch({
      type: 'DeviceAccountShow/getDownFile',
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
      <Breadcrumb.Item><a href="#/deviceAccount">设备台账</a></Breadcrumb.Item>
      <Breadcrumb.Item>查看</Breadcrumb.Item>
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
                <span>{detail.category_name}</span>
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="设备名称" {...formItemLayout}>
              {getFieldDecorator('name', {
                initialValue: detail.name,
                rules: [{ required: true, message: '请输入设备名称!' }],
              })(
                <span>{detail.name}</span>
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
                <span>{detail.device_no}</span>
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="技术规格" {...formItemLayout}>
              {getFieldDecorator('technology', {
                initialValue: detail.technology,
              })(
                <span>{detail.technology}</span>
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
                <span>{detail.num}</span>
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="单价" {...formItemLayout}>
              {getFieldDecorator('price', {
                initialValue: detail.price,
                rules: [{ pattern: /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/, message: "输入格式有误!" }],
              })(
                <span>{detail.price}</span>
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
                <span>{detail.supplier}</span>
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="供应商电话" {...formItemLayout}>
              {getFieldDecorator('supplier_tel', {
                initialValue: detail.supplier_tel,
                rules: [{ required: true, message: '请输入供应商电话!' }, { validator: checkPhone.bind(this), message: '请输入手机号码！' }],
              })(
                <span>{detail.supplier_tel}</span>
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
                <span>{detail.install_place}</span>
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="设备负责人" {...formItemLayout}>
              {getFieldDecorator('leader', {
                initialValue: detail.leader,
                rules: [{ required: true, message: '请输入设备负责人!' },],
              })(
                <span>{detail.leader}</span>
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
                <span>{detail.status_name}</span>
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="拟报废日期" {...formItemLayout}>
              {getFieldDecorator('plan_scrap_at', {
                initialValue: detail.plan_scrap_at ? moment(detail.plan_scrap_at) : null,
                rules: [{ required: true, message: '请输入拟报废日期!' }],
              })(
                <span>{detail.plan_scrap_at}</span>
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
                <span>{detail.start_at}</span>
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="保修截止日期" {...formItemLayout}>
              {getFieldDecorator('expired_at', {
                initialValue: detail.expired_at ? moment(detail.expired_at) : null,
              })(
                <span>{detail.expired_at}</span>
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
                <span>{detail.age_limit}</span>
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="保修单位" {...formItemLayout}>
              {getFieldDecorator('repair_company', {
                initialValue: detail.repair_company,
                rules: [],
              })(
                <span>{detail.repair_company}</span>
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
                <span>{detail.make_company}</span>
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="制造单位电话" {...formItemLayout}>
              {getFieldDecorator('make_company_tel', {
                initialValue: detail.make_company_tel,
                rules: [{ validator: checkPhone.bind(this), message: '请输入手机号码！' }],
              })(
                <span>{detail.make_company_tel}</span>
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
                <span>{detail.install_company}</span>
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="安装单位电话" {...formItemLayout}>
              {getFieldDecorator('install_company_tel', {
                initialValue: detail.install_company_tel,
                rules: [{ validator: checkPhone.bind(this), message: '请输入手机号码！' }],
              })(
                <span>{detail.install_company_tel}</span>
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
                <span>{detail.note}</span>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item label="设备资料附件" {...formItemLayout}>
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
                    <span>{detail.scrap_person}</span>
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
                    <span>{detail.scrap_note}</span>
                  )}
                </Form.Item>
              </Col>
            </Row>
          </span>
          : null}

        <Row>
          <Col span={12}>
            <Form.Item style={{ maxWidth: '600px' }} wrapperCol={{ span: 17, offset: 4 }}>
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
    ...state.DeviceAccountShow,
    loading: state.loading.models.DeviceAccountShow
  };
}
export default connect(mapStateToProps)(Form.create()(DeviceAccountShow));
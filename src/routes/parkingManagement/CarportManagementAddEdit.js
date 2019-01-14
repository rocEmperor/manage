import React from 'react';
import { connect } from 'dva';
import { Form, Breadcrumb, Card, Select, Input, Button, Row, Col } from 'antd';
const Option = Select.Option;
import { checkPhone, getCommunityId } from '../../utils/util';

function CarportManagementAddEdit(props) {
  const { form, dispatch, loading, id, community_id, detail, groupData, buildingData, unitData, roomData, lotOption, lotAreaOption, typeOption, statusOption } = props;
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
   * 楼幢筛选
   * @param {*} params 
   */
  function selectChange(name, val) {
    let validate = ["community_id", "group", "building", "unit", "room"];
    const searchModel = 'CarportManagementAddEdit';
    if (name == "group") {
      form.setFieldsValue({building:'',unit:'',room:''});
      form.validateFields(validate, (err, values) => {
        const param = {
          community_id,
          group: val
        };
        dispatch({
          type: `${searchModel}/getBuildings`,
          payload: param,
        });
      })
    }
    if (name == "building") {
      form.setFieldsValue({unit:'',room:''});
      form.validateFields(validate, (err, values) => {
        const param = {
          community_id,
          group: values.group,
          building: val
        };
        dispatch({
          type: `${searchModel}/getUnits`,
          payload: param,
        });
      })
    }
    if (name === 'unit') {
      form.setFieldsValue({room:''});
      form.validateFields(validate, (err, values) => {
        const param = {
          community_id,
          group: values.group,
          building: values.building,
          unit: val
        };
        dispatch({
          type: `${searchModel}/getRooms`,
          payload: param,
        });
      })
    }
  }
  /**
   * 停车场选择显示停车区域列表
   * @param {*} params 停车场val
   */
  function lotOptionChange(params) {
    form.setFieldsValue({ lot_area_id: undefined });
    dispatch({
      type: 'CarportManagementAddEdit/getLotAreaList',
      payload: { lot_id: params, community_id: getCommunityId() }
    });
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
          type: 'CarportManagementAddEdit/getCarportEdit',
          payload: { ...handleValues, id }
        });
      } else {//新增
        dispatch({
          type: 'CarportManagementAddEdit/getCarportAdd',
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
      <Breadcrumb.Item><a href="#/carportManagement">车位管理</a></Breadcrumb.Item>
      <Breadcrumb.Item>{id ? '编辑' : '新增'}</Breadcrumb.Item>
    </Breadcrumb>
    <Card>
      <Form>
        <Form.Item label="停车场" {...formItemLayout}>
          {getFieldDecorator('lot_id', {
            initialValue: detail.lot_id?String(detail.lot_id):undefined,
            rules: [{ required: true, message: '请选择停车场!' }],
          })(
            <Select placeholder="请选择" notFoundContent="没有数据" onChange={lotOptionChange.bind(this)} showSearch optionFilterProp="children">
              {lotOption.map((value, index) => { return <Option key={index} value={String(value.id)}>{value.name}</Option> })}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="停车区域" {...formItemLayout}>
          {getFieldDecorator('lot_area_id', {
            initialValue: Object.keys(detail).length!=0?String(detail.lot_area_id):undefined,
            rules: []
          })(
            <Select placeholder="请选择" notFoundContent="没有数据" showSearch optionFilterProp="children">
              {lotAreaOption.map((value, index) => { return <Option key={index} value={String(value.id)}>{value.name}</Option> })}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="车位号" {...formItemLayout}>
          {getFieldDecorator('car_port_num', {
            initialValue: detail.car_port_num,
            rules: [{ required: true, message: '请输入车位号!' }],
          })(
            <Input type="text" placeholder="请输入车位号" maxLength={20} />
          )}
        </Form.Item>
        <Form.Item label="车位类型" {...formItemLayout}>
          {getFieldDecorator('car_port_type', {
            initialValue: detail.car_port_type?String(detail.car_port_type):undefined,
            rules: [{ required: true, message: '请选择车位类型!' }],
          })(
            <Select placeholder="请选择">
              {typeOption.map((value, index) => { return <Option key={index} value={String(value.id)}>{value.name}</Option> })}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="车位面积" {...formItemLayout}>
          {getFieldDecorator('car_port_area', {
            initialValue: detail.car_port_area,
            rules: [],
          })(
            <Input type="text" placeholder="请输入车位面积" maxLength={20} addonAfter="m²" />
          )}
        </Form.Item>
        <Form.Item label="使用状态" {...formItemLayout}>
          {getFieldDecorator('car_port_status', {
            initialValue: Object.keys(detail).length!=0?String(detail.car_port_status):undefined,
            rules: [{ required: true, message: '请选择使用状态!' }],
          })(
            <Select placeholder="请选择">
              {statusOption.map((value, index) => { return <Option key={index} value={String(value.id)}>{value.name}</Option> })}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="关联房产" {...formItemLayout}>
          <Row gutter={6}>
            <Col span={6}>
              <Form.Item>
                {getFieldDecorator('group', {
                  initialValue: detail.group,
                  rules: [],
                })(
                  <Select placeholder="苑\期\区" onChange={selectChange.bind(this, 'group')} showSearch optionFilterProp="children" notFoundContent="没有数据">
                    {groupData ? groupData.map((value, index) => {
                      return <Option key={index} value={value.name}>{value.name}</Option>
                    }) : null}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item>
                {getFieldDecorator('building', {
                  initialValue: detail.building,
                  rules: [],
                })(
                  <Select placeholder="幢" onChange={selectChange.bind(this, 'building')} showSearch optionFilterProp="children" notFoundContent="没有数据">
                    {buildingData ? buildingData.map((value, index) => {
                      return <Option key={index} value={value.name}>{value.name}</Option>
                    }) : null}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item>
                {getFieldDecorator('unit', {
                  initialValue: detail.unit,
                  rules: [],
                })(
                  <Select placeholder="单元" onChange={selectChange.bind(this, 'unit')} showSearch optionFilterProp="children" notFoundContent="没有数据">
                    {unitData ? unitData.map((value, index) => {
                      return <Option key={index} value={value.name}>{value.name}</Option>
                    }) : null}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item>
                {getFieldDecorator('room', {
                  initialValue: detail.room,
                  rules: [],
                })(
                  <Select placeholder="室" onChange={selectChange.bind(this, 'room')} showSearch optionFilterProp="children" notFoundContent="没有数据">
                    {roomData ? roomData.map((value, index) => {
                      return <Option key={index} value={value.name}>{value.name}</Option>
                    }) : null}
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item label="产权人" {...formItemLayout}>
          {getFieldDecorator('room_name', {
            initialValue: detail.room_name,
            rules: [],
          })(
            <Input type="text" placeholder="请输入产权人" maxLength={20} />
          )}
        </Form.Item>
        <Form.Item label="联系电话" {...formItemLayout}>
          {getFieldDecorator('room_mobile', {
            initialValue: detail.room_mobile,
            rules: [{ validator: checkPhone.bind(this), message: '请输入正确的手机号码！' }],
          })(
            <Input type="text" placeholder="请输入联系电话" maxLength={20} />
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
    ...state.CarportManagementAddEdit,
    loading: state.loading.models.CarportManagementAddEdit
  };
}
export default connect(mapStateToProps)(Form.create()(CarportManagementAddEdit));

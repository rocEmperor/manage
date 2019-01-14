import React from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Form, Breadcrumb, Card, Input, Button, Radio, Select, Row, Col, DatePicker } from 'antd';
import { getCommunityId, checkPhone } from '../../utils/util';
const RadioGroup = Radio.Group;
const Option = Select.Option;
const { RangePicker } = DatePicker;
let query = {
  community_id: getCommunityId(),
  group: undefined,
  building: undefined,
  unit: undefined,
};
function CarportManagementRegister(props) {
  const { form, dispatch, loading, community_id, id, detail, groupData, buildingData, name, tel, unitData, roomData, isOwner, ownerTypeOption } = props;
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
  function selectChange(mark, val) {
    query[mark] = val;
    if (mark == 'group') {
      dispatch({
        type: 'CarportManagementRegister/concat',
        payload: {
          name: "",
          tel: ""
        }
      })
      form.setFieldsValue({building:'',unit:'',room:'',member_id:''});
      query.building = undefined;
      query.unit = undefined;
      dispatch({
        type: 'CarportManagementRegister/getBuildings',
        payload: query
      });
    } else if (mark == 'building') {
      dispatch({
        type: 'CarportManagementRegister/concat',
        payload: {
          name: "",
          tel: ""
        }
      })
      form.setFieldsValue({unit:'',room:'',member_id:''});
      query.unit = undefined;
      dispatch({
        type: 'CarportManagementRegister/getUnits',
        payload: query
      });
    } else if (mark == 'unit') {
      dispatch({
        type: 'CarportManagementRegister/concat',
        payload: {
          name: "",
          tel: ""
        }
      })
      form.setFieldsValue({room:'',member_id:''});
      dispatch({
        type: 'CarportManagementRegister/getRooms',
        payload: query
      });
    } else if (mark == 'room') {
      dispatch({
        type: 'CarportManagementRegister/concat',
        payload: {
          name: "",
          tel: ""
        }
      })
      dispatch({
        type: 'CarportManagementRegister/getFindOwner',
        payload: query
      });
    }
  }
  /**
   * 是否住户选择
   * @param {*} e
   */
  function onChangeIsOwner(e) {
    dispatch({
      type: "CarportManagementRegister/concat",
      payload: { isOwner: e.target.value },
    });
  }
  function ownerTypeChange(val) {
    ownerTypeOption ? ownerTypeOption.map(item => {
      if (item.member_id == val) {
        dispatch({
          type: 'CarportManagementRegister/concat',
          payload: {
            name: item.name,
            tel: item.mobile
          }
        })
      }
    }) : []
  }

  /**
   * 提交
   */
  function handleSubmit(e) {
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      if (values.date && values.date.length > 0) {
        values.carport_rent_start = values.date[0].format('YYYY-MM-DD');
        values.carport_rent_end = values.date[1].format('YYYY-MM-DD');
        delete values.date;
      } else {
        delete values.date;
      }
      const payload = {
        ...values,
        community_id,
        carport_id: id,
        lot_area_id: detail.lot_area_id,
        lot_id: detail.lot_id,
        room_id: ""
      };
      dispatch({
        type: 'CarportManagementRegister/getCarManageAdd',
        payload
      });

    });
  }
  /**
   * 返回上一页
   */
  function handleBack(e) {
    history.go(-1);
  }
  function disabledDate(current) {
    return current && current.valueOf() < Date.now() - 8640000;
  }
  return (<div>
    <Breadcrumb separator=">">
      <Breadcrumb.Item>停车管理</Breadcrumb.Item>
      <Breadcrumb.Item><a href="#/carportManagement">车位管理</a></Breadcrumb.Item>
      <Breadcrumb.Item>车辆登记</Breadcrumb.Item>
    </Breadcrumb>
    <Card>
      <Form>
        <div style={{ "paddingBottom": "10px", fontSize: '16px' }}>【车辆信息】</div>
        <Form.Item label="车牌号码" {...formItemLayout}>
          {getFieldDecorator('car_num', {
            initialValue: detail.car_num,
            rules: [{ required: true, message: '请输入车牌号码!' }],
          })(
            <Input type="text" placeholder="请输入车牌号码" maxLength={20} />
          )}
        </Form.Item>
        <div style={{ "paddingBottom": "10px", fontSize: '16px' }}>【车主信息】</div>
        <Form.Item label="是否住户" {...formItemLayout}>
          {getFieldDecorator('is_owner', {
            initialValue: detail.is_owner ? detail.is_owner : "1",
            rules: [{ required: true, message: '请选择是否住户!' }],
          })(
            <RadioGroup onChange={onChangeIsOwner}>
              <Radio value={"1"}>是</Radio>
              <Radio value={"2"}>否</Radio>
            </RadioGroup>
          )}
        </Form.Item>
        {
          isOwner == 1 ?
            <div>
              <Form.Item {...formItemLayout} label="苑/期/区">
                {getFieldDecorator('group', {
                  rules: [{ required: true, message: '请选择苑/期/区' }]
                })(
                  <Select placeholder="请选择苑/期/区" showSearch={true} notFoundContent="没有数据" onChange={selectChange.bind(this, 'group')}>
                    {groupData.map((value, index) => { return <Option key={index} value={value.name}>{value.name}</Option> })}
                  </Select>
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label="幢">
                {getFieldDecorator('building', {
                  rules: [{ required: true, message: '请选择幢' }]
                })(
                  <Select placeholder="请选择幢" showSearch={true} notFoundContent="没有数据" onChange={selectChange.bind(this, 'building')}>
                    {buildingData.map((value, index) => { return <Option key={index} value={value.name}>{value.name}</Option> })}
                  </Select>
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label="单元">
                {getFieldDecorator('unit', {
                  rules: [{ required: true, message: '请选择单元' }]
                })(
                  <Select placeholder="请选择单元" showSearch={true} notFoundContent="没有数据" onChange={selectChange.bind(this, 'unit')}>
                    {unitData.map((value, index) => { return <Option key={index} value={value.name}>{value.name}</Option> })}
                  </Select>
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label="室">
                {getFieldDecorator('room', {
                  rules: [{ required: true, message: '请选择室' }]
                })(
                  <Select placeholder="请选择室" showSearch={true} notFoundContent="没有数据" onChange={selectChange.bind(this, 'room')}>
                    {roomData.map((value, index) => { return <Option key={index} value={value.name}>{value.name}</Option> })}
                  </Select>
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label="业主">
                {getFieldDecorator('member_id', {
                  initialValue: detail.member_id,
                  rules: [{
                    required: true, message: '请选择业主'
                  }],
                })(
                  <Select placeholder="请选择业主" onChange={ownerTypeChange.bind(this)} notFoundContent="没有数据" optionFilterProp="children">
                    {ownerTypeOption ? ownerTypeOption.map((value, index) => {
                      return <Option key={index} value={value.member_id}>{value.name}</Option>
                    }) : null}
                  </Select>
                )}
              </Form.Item>
            </div> : null
        }
        <Form.Item label="车主姓名" {...formItemLayout}>
          {getFieldDecorator('user_name', {
            initialValue: detail && !name ? detail.user_name : name,
            rules: [{ required: true, message: '请输入车主姓名!' }],
          })(
            <Input type="text" placeholder="请输入车主姓名" maxLength={20} />
          )}
        </Form.Item>
        <Form.Item label="手机号" {...formItemLayout}>
          {getFieldDecorator('user_mobile', {
            initialValue: detail && !tel ? detail.user_mobile : tel,
            rules: [{ required: true, message: '请输入手机号!' },{validator: checkPhone.bind(this), message: '请输入正确的手机号码！' }],
          })(
            <Input type="text" placeholder="请输入手机号"/>
          )}
        </Form.Item>
        <div style={{ "paddingBottom": "10px", fontSize: '16px' }}>【车场车位信息】</div>
        <Row style={{ "padding": "0 0 30px 60px", "maxWidth": '700px' }}>
          <Col span={12}>停车场：{detail.lot_name}</Col>
          <Col span={12}>停车场区域：{detail.lot_area_name}</Col>
          
        </Row>
        <Row style={{ "padding": "0 0 30px 60px", "maxWidth": '700px' }}>
          <Col span={12}>车位类型：{detail.type ? detail.type.name : ''}</Col>
          <Col span={12}>车位号：{detail.car_port_num}</Col>
          
        </Row>
        <Row style={{ "padding": "0 0 30px 60px", "maxWidth": '700px' }}>
          <Col span={12}>车位状态：{detail.status ? detail.status.name : ''}</Col>
        </Row>
        <Form.Item label="停车卡号" {...formItemLayout}>
          {getFieldDecorator('park_card_no', {
            initialValue: detail.park_card_no,
            rules: [],
          })(
            <Input type="text" placeholder="请输入停车卡号" maxLength={20} />
          )}
        </Form.Item>
        {
          detail.status && detail.status.id != 1 ?
            <div>
              <div style={{ "paddingBottom": "10px", fontSize: '16px' }}>【收费信息】</div>
              <Form.Item label="有效期" {...formItemLayout}>
                {getFieldDecorator('date', {
                  initialValue: detail.carport_rent_start && detail.carport_rent_end ? [moment(detail.carport_rent_start), moment(detail.carport_rent_end)] : undefined,
                  rules: [{ required: true, message: '请选择有效期!' }],
                })(
                  <RangePicker disabledDate={disabledDate.bind(this)} style={{ width: '100%' }}/>
                )}
              </Form.Item>
              <Form.Item label="租金" {...formItemLayout}>
                {getFieldDecorator('carport_rent_price', {
                  initialValue: detail.carport_rent_price,
                  rules: [{ required: true, message: '请输入租金!' }],
                })(
                  <Input type="text" placeholder="请输入租金" addonAfter="元"/>
                )}
              </Form.Item>
            </div> : null
        }


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
    ...state.CarportManagementRegister,
    loading: state.loading.models.CarportManagementRegister
  };
}
export default connect(mapStateToProps)(Form.create()(CarportManagementRegister));

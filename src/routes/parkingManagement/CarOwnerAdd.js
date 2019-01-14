import React from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Form, Breadcrumb, Card, Input, Button, Radio, Select, Modal, DatePicker, Table, Row, Col, message } from 'antd';
const RadioGroup = Radio.Group;
const Option = Select.Option;
const { RangePicker } = DatePicker;
import { noData, getCommunityId,checkPhone } from '../../utils/util';
import './index.less';

function CarOwnerAdd(props) {
  let { form, dispatch, loading, group, building, unit, lot_id, lot_area_id, car_port_status, flag, typeOption, name, tel, carport_id, car_port_num, id, list, totals, params, detail, groupData, buildingData, unitData, roomData, show, isOwner, ownerTypeOption, lotOption, lotAreaOption, statusOption } = props;
  const { getFieldDecorator } = form;

  /**
   * 布局
   */
  const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 17 },
    style: { maxWidth: '600px' }
  }

  const formItemLayout1 = {
    labelCol: { span: 6 },
    wrapperCol: { span: 15 },
    style: { maxWidth: '600px' }
  }
  /**
   * 楼幢筛选
   * @param {*} params 
   */
  function selectChange(mark, val) {
    if (mark == 'group') {
      form.setFieldsValue({building:'',unit:'',room:'',member_id:''});
      dispatch({
        type: 'CarOwnerAdd/concat',
        payload: {
          name: "",
          tel: ""
        }
      })
      dispatch({
        type: 'CarOwnerAdd/concat',
        payload: {
          group: val,
          buildingData: [],
          unitData: [],
          roomData: [],
          ownerTypeOption: []
        }
      });
      dispatch({
        type: 'CarOwnerAdd/getBuildings',
        payload: { group: val, community_id: sessionStorage.getItem("communityId") }
      });
    } else if (mark == 'building') {
      form.setFieldsValue({unit:'',room:'',member_id:''});
      dispatch({
        type: 'CarOwnerAdd/concat',
        payload: {
          name: "",
          tel: ""
        }
      })
      dispatch({
        type: 'CarOwnerAdd/concat',
        payload: {
          building: val,
          unitData: [],
          roomData: [],
          ownerTypeOption: []
        }
      });
      dispatch({
        type: 'CarOwnerAdd/getUnits',
        payload: { group: group, building: val, community_id: sessionStorage.getItem("communityId") }
      });
    } else if (mark == 'unit') {
      form.setFieldsValue({room:'',member_id:''});
      dispatch({
        type: 'CarOwnerAdd/concat',
        payload: {
          name: "",
          tel: ""
        }
      })
      dispatch({
        type: 'CarOwnerAdd/concat',
        payload: {
          unit: val,
          roomData: [],
          ownerTypeOption: []
        }
      });
      dispatch({
        type: 'CarOwnerAdd/getRooms',
        payload: { group: group, building: building, unit: val, community_id: sessionStorage.getItem("communityId") }
      });
    } else if (mark == 'room') {
      form.setFieldsValue({member_id:''});
      dispatch({
        type: 'CarOwnerAdd/concat',
        payload: {
          name: "",
          tel: ""
        }
      })
      dispatch({
        type: 'CarOwnerAdd/getFindOwner',
        payload: {
          group: group,
          building: building,
          unit: unit,
          room: val,
          community_id: sessionStorage.getItem("communityId")
        }
      });
    } else if (mark == 'user_type') {
      ownerTypeOption ? ownerTypeOption.map(item => {
        if (item.member_id == val) {
          dispatch({
            type: 'CarOwnerAdd/concat',
            payload: {
              name: item.name,
              tel: item.mobile
            }
          })
        }
      }) : []
    }
  }
  /**
   * 是否住户选择
   * @param {*} e
   */
  function onChangeIsOwner(e) {
    dispatch({
      type: "CarOwnerAdd/concat",
      payload: { isOwner: e.target.value },
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
      if (car_port_num == '') {
        message.error('请选择车位号');
        return;
      }
      let param = {
        car_num: values.car_num,
        is_owner: values.is_owner,
        group: values.group,
        building: values.building,
        unit: values.unit,
        room: values.room,
        member_id: values.member_id,
        user_name: values.user_name,
        user_mobile: values.user_mobile,
        lot_id: values.lot_id,
        lot_area_id: values.lot_area_id,
        park_card_no: values.park_card_no,
        carport_id: carport_id,
        carport_rent_price: values.carport_rent_price,
        community_id: getCommunityId()
      }
      if (values.date && values.date.length > 0) {
        param.carport_rent_start = values.date[0].format('YYYY-MM-DD');
        param.carport_rent_end = values.date[1].format('YYYY-MM-DD');
        delete values.date;
      } else {
        delete values.date;
      }
      if (id) {
        dispatch({
          type: 'CarOwnerAdd/getCarManageEdit',
          payload: { ...param, id }
        });
      } else {
        dispatch({
          type: 'CarOwnerAdd/getCarManageAdd',
          payload: param
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
  function handleMark(params) {
    form.resetFields(['car_port_type', 'car_port', 'car_port_status']);
    form.setFieldsValue({ lot_id1: lot_id, lot_area_id1: lot_area_id });
    dispatch({
      type: 'CarOwnerAdd/getCarportList',
      payload: {
        lot_id: lot_id,
        lot_area_id: lot_area_id,
        page: 1,
        rows: 10,
        community_id: getCommunityId(),
        car_port_num: "",
        car_port_type: "",
        car_port_status: ""
      }
    })
    dispatch({
      type: 'CarOwnerAdd/concat', payload: {
        show: true
      }
    })
  }
  function handleHidden(params) {
    form.resetFields(['car_port_type', 'car_port', 'car_port_status']);
    dispatch({
      type: 'CarOwnerAdd/concat', payload: {
        show: false
      }
    })
  }

  function handSearch() {
    form.validateFields(['car_port', 'car_port_type', 'car_port_status','lot_id1','lot_area_id1'], (err, values) => {
      const param = {
        car_port_num: values.car_port,
        car_port_type: values.car_port_type,
        car_port_status: values.car_port_status,
        lot_id: values.lot_id1,
        lot_area_id: values.lot_area_id1
      };
      param.page = 1;
      param.rows = 10;
      param.community_id = sessionStorage.getItem("communityId");

      dispatch({
        type: 'CarOwnerAdd/getCarportList', payload: { ...param }
      });
    })
  }

  function handleReset(e) {
    form.resetFields(['car_port_type', 'car_port', 'car_port_status','lot_id1','lot_area_id1']);
    form.setFieldsValue({ lot_id1: '', lot_area_id1: '' });
    dispatch({
      type: 'CarOwnerAdd/getLotAreaList',
      payload: {
        lot_id: lot_id,
        community_id: getCommunityId()
      }
    })
    const param = {
      page: 1,
      rows: 10,
      car_port_num: "",
      car_port_status: "",
      car_port_type: "",
      lot_area_id:'',
      lot_id:''
    }
    dispatch({
      type: 'CarOwnerAdd/getCarportList', payload: param
    });
    
  }
  function handleOk(record) {
    dispatch({
      type: 'CarOwnerAdd/concat',
      payload: {
        car_port_num: record.car_port_num,
        show: false,
        carport_id: record.id,
        car_port_status: record.car_port_status,
        lot_id: record.lot_id,
        lot_area_id: record.lot_area_id != 0 ? record.lot_area_id : "",
        flag: (record.car_port_status == 0 || record.car_port_status == 2) && (detail.carport_id != record.id) ? true : false
      }
    })
    form.setFieldsValue({ lot_area_id: record.lot_area_id != 0 ? record.lot_area_id : "", lot_id: record.lot_id });
    if (detail.carport_id != record.id) {
      form.setFieldsValue({ carport_rent_price: '', carport_rent_start: '', carport_rent_end: '', date:"" })
    } else {
      form.setFieldsValue({ carport_rent_price: detail.carport_rent_price, carport_rent_start: detail.carport_rent_start, carport_rent_end: detail.carport_rent_end })
    }
  }
  const tableProps = {
    columns: [{
      title: '编号',
      dataIndex: 'tid',
      key: 'tid',
      render: noData,
    }, {
      title: '车位号',
      dataIndex: 'car_port_num',
      key: 'car_port_num',
      render: noData,
    }, {
      title: '车位类型',
      dataIndex: 'type',
      key: 'type',
      render: (text, record, index) => {
        return record.type ? record.type.name : noData()
      }
    }, {
      title: '车位状态',
      dataIndex: 'status',
      key: 'status',
      render: (text, record, index) => {
        return record.status ? record.status.name : noData()
      }
    }, {
      title: '车位面积(㎡)',
      dataIndex: 'car_port_area',
      key: 'car_port_area',
      render: noData,
    }, {
      title: '关联房产',
      dataIndex: 'room_address',
      key: 'room_address',
      render: noData,
    }, {
      title: '操作',
      dataIndex: 'make',
      key: 'make',
      render: (text, record) => {
        function TableItemTime() {
          return (
            <div>
              <a onClick={handleOk.bind(this, record)}>选择</a>
            </div>
          )
        }
        return TableItemTime()
      }
    }],
    dataSource: list,
    pagination: {
      showTotal: (total, range) => `共 ${totals} 条`,
      defaultCurrent: 1,
      current: params.page,
      defaultPageSize: 10,
      total: totals,
      onChange: (page, size) => { dispatch({ type: 'CarOwnerAdd/getCarportList', payload: { ...params, page } }) },
    },
    rowKey: (record, index) => index,
    loading: loading,
  }
  // 停车场与停车区域onchange
  function handleChange(sign, val) {
    if (sign == 'lot_id') {
      form.setFieldsValue({ lot_area_id: '' });
      // detail.lot_area_id = "";
      dispatch({
        type: 'CarOwnerAdd/getLotAreaList',
        payload: {
          lot_id: val,
          community_id: getCommunityId()
        }
      })
      dispatch({
        type: 'CarOwnerAdd/concat',
        payload: {
          lot_id: val,
          lot_area_id: "",
          car_port_num: "",
        }
      })
    } else if (sign == 'lot_area_id') {
      dispatch({
        type: 'CarOwnerAdd/concat',
        payload: {
          car_port_num: ""
        }
      })
      dispatch({
        type: 'CarOwnerAdd/concat',
        payload: {
          lot_area_id: val
        }
      })
    }

  }
  // 搜索停车场与停车区域onchange
  function handleChange1(sign, val) {
    if (sign == 'lot_id') {
      form.setFieldsValue({ lot_area_id1: '' });
      // detail.lot_area_id = "";
      dispatch({
        type: 'CarOwnerAdd/getLotAreaList',
        payload: {
          lot_id: val,
          community_id: getCommunityId()
        }
      })
    }
  }
  function disabledDate(current) {
    return current && current.valueOf() < Date.now() - 86400000;
  }
  return (<div>
    <Breadcrumb separator=">">
      <Breadcrumb.Item>停车管理</Breadcrumb.Item>
      <Breadcrumb.Item><a href="#/carOwnerManagement">车辆管理</a></Breadcrumb.Item>
      <Breadcrumb.Item>{id ? '编辑车辆' : '新增车辆'}</Breadcrumb.Item>
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
            initialValue: Object.keys(detail).length != 0 ? detail.room_type : "1",
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
                  rules: [{ required: true, message: '请选择苑/期/区' }],
                  initialValue: detail.group
                })(
                  <Select placeholder="请选择苑/期/区" showSearch={true} notFoundContent="没有数据" onChange={selectChange.bind(this, 'group')}>
                    {groupData.map((value, index) => { return <Option key={index} value={value.name}>{value.name}</Option> })}
                  </Select>
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label="幢">
                {getFieldDecorator('building', {
                  rules: [{ required: true, message: '请选择幢' }],
                  initialValue: detail.building
                })(
                  <Select placeholder="请选择幢" showSearch={true} notFoundContent="没有数据" onChange={selectChange.bind(this, 'building')}>
                    {buildingData.map((value, index) => { return <Option key={index} value={value.name}>{value.name}</Option> })}
                  </Select>
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label="单元">
                {getFieldDecorator('unit', {
                  rules: [{ required: true, message: '请选择单元' }],
                  initialValue: detail.unit
                })(
                  <Select placeholder="请选择单元" showSearch={true} notFoundContent="没有数据" onChange={selectChange.bind(this, 'unit')}>
                    {unitData.map((value, index) => { return <Option key={index} value={value.name}>{value.name}</Option> })}
                  </Select>
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label="室">
                {getFieldDecorator('room', {
                  rules: [{ required: true, message: '请选择室' }],
                  initialValue: detail.room
                })(
                  <Select placeholder="请选择室" showSearch={true} notFoundContent="没有数据" onChange={selectChange.bind(this, 'room')}>
                    {roomData.map((value, index) => { return <Option key={index} value={value.name}>{value.name}</Option> })}
                  </Select>
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label="业主">
                {getFieldDecorator('member_id', {
                  initialValue: detail.member_id != 0 ? detail.member_id : '',
                  rules: [{ required: true, message: '请选择业主' }]
                })(
                  <Select placeholder="请选择业主" notFoundContent="没有数据" showSearch optionFilterProp="children" onChange={selectChange.bind(this, 'user_type')}>
                    {ownerTypeOption ? ownerTypeOption.map((value, index) => {
                      return (value.name ? <Option key={index} value={value.member_id}>{value.name}</Option> : <Option key={index} disabled value={value.member_id}>暂无数据</Option>)
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
            rules: [{ required: true, message: '请输入手机号!' },{ validator: checkPhone.bind(this), message: '请输入正确的手机号！'  }],
          })(
            <Input type="text" placeholder="请输入手机号" />
          )}
        </Form.Item>
        <div style={{ "paddingBottom": "10px", fontSize: '16px' }}>【车场车位信息】</div>
        <Form.Item label="停车场" {...formItemLayout}>
          {getFieldDecorator('lot_id', {
            initialValue: detail.lot_id,
            rules: [{
              required: true, message: '请选择停车场'
            }],
          })(
            <Select placeholder="请选择停车场" notFoundContent="没有数据" showSearch optionFilterProp="children" onChange={handleChange.bind(this, 'lot_id')}>
              {lotOption ? lotOption.map((value, index) => {
                return <Option key={index} value={value.id}>{value.name}</Option>
              }) : null}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="停车区域" {...formItemLayout}>
          {getFieldDecorator('lot_area_id', {
            initialValue: detail && !lot_area_id ? detail.lot_area_id : lot_area_id,
          })(
            <Select placeholder="请选择停车区域" notFoundContent="没有数据" showSearch optionFilterProp="children" onChange={handleChange.bind(this, 'lot_area_id')}>
              {lotAreaOption ? lotAreaOption.map((value, index) => {
                return <Option key={index} value={value.id}>{value.name}</Option>
              }) : null}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="停车卡号" {...formItemLayout}>
          {getFieldDecorator('park_card_no', {
            initialValue: detail.park_card_no,
            rules: [],
          })(
            <Input type="text" placeholder="请输入停车卡号" maxLength={20} />
          )}
        </Form.Item>
        <Form.Item label="车位号" {...formItemLayout}>
          {getFieldDecorator('car_port_num', {
            initialValue: detail.car_port_num,
          })(
            <div>
              <span>{car_port_num ? car_port_num : ''}</span> <Button type="primary" disabled={lot_id ? false : true} onClick={handleMark}>选择车位号</Button>
            </div>
          )}
        </Form.Item>
        {
          car_port_status != 1 ?
            <div>
              <div style={{ "paddingBottom": "10px", fontSize: '16px' }}>【收费信息】</div>
              <Form.Item label="有效期" {...formItemLayout}>
                {getFieldDecorator('date', {
                  initialValue: detail.carport_rent_start && detail.carport_rent_end ? [moment(detail.carport_rent_start), moment(detail.carport_rent_end)] : undefined,
                  rules: [{ required: true, message: '请选择有效期!' }],
                })(
                  <RangePicker disabled={id && !flag ? true : false} disabledDate={disabledDate.bind(this)} style={{ width: '100%' }} />
                )}
              </Form.Item>
              <Form.Item label="租金" {...formItemLayout}>
                {getFieldDecorator('carport_rent_price', {
                  initialValue: detail.carport_rent_price,
                  rules: [{ required: true, message: '请输入租金!' }],
                })(
                  <Input type="text" placeholder="请输入租金" disabled={id && !flag ? true : false} addonAfter="元" />
                )}
              </Form.Item>
            </div>
            : null
        }


        <Form.Item style={{ maxWidth: '600px' }} wrapperCol={{ span: 8, offset: 4 }}>
          <Button type="primary" onClick={handleSubmit} loading={loading}>提交</Button>
          <Button className="ml1" onClick={handleBack}>返回</Button>
        </Form.Item>
      </Form>

      <Modal title="选择车位号" visible={show} onCancel={handleHidden} footer={null} width="860px">
        <Card className="section">
          <Form>
            <Row>
              <Col span={8}>
                <Form.Item label="停车场" {...formItemLayout1}>
                  {getFieldDecorator('lot_id1', {
                    initialValue: detail && !lot_id ? detail.lot_id : lot_id,
                  })(
                    <Select placeholder="请选择停车场" notFoundContent="没有数据" showSearch optionFilterProp="children" onChange={handleChange1.bind(this, 'lot_id')}>
                      {lotOption ? lotOption.map((value, index) => {
                        return <Option key={index} value={value.id}>{value.name}</Option>
                      }) : null}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="停车区域" {...formItemLayout1}>
                  {getFieldDecorator('lot_area_id1', {
                    initialValue: detail && !lot_area_id ? detail.lot_area_id : lot_area_id,
                  })(
                    <Select placeholder="请选择停车区域" notFoundContent="没有数据" showSearch optionFilterProp="children" onChange={handleChange1.bind(this, 'lot_area_id')}>
                      {lotAreaOption ? lotAreaOption.map((value, index) => {
                        return <Option key={index} value={value.id}>{value.name}</Option>
                      }) : null}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="车位类型" {...formItemLayout1}>
                  {getFieldDecorator('car_port_type')(
                    <Select placeholder="请选择车位类型" notFoundContent="没有数据">
                      {typeOption.map((value, index) => { return <Option key={index} value={String(value.id)}>{value.name}</Option> })}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              
            </Row>
            <Row>
              <Col span={8}>
                <Form.Item label="车位号" {...formItemLayout1}>
                  {getFieldDecorator('car_port')(<Input type="text" placeholder="请输入车位号" />
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="车位状态" {...formItemLayout1}>
                  {getFieldDecorator('car_port_status')(
                    <Select placeholder="请选择车辆状态" notFoundContent="没有数据">
                      {statusOption.map((value, index) => { return <Option key={index} value={String(value.id)}>{value.name}</Option> })}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={6} style={{ paddingLeft: '35px' }} className="fr">
                <Button type="primary" onClick={handSearch} className="mr1" style={{ marginLeft: '10px' }} >查询</Button>
                <Button type="ghost" onClick={handleReset}>重置</Button>
              </Col>
            </Row>
          </Form>
        </Card>
        <Table className="mt1" {...tableProps} />
      </Modal>
    </Card>

  </div>)
}
function mapStateToProps(state) {
  return {
    ...state.CarOwnerAdd,
    loading: state.loading.models.CarOwnerAdd
  };
}
export default connect(mapStateToProps)(Form.create()(CarOwnerAdd));

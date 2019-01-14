
import React from 'react';
import { connect } from 'dva';
import { Form, Breadcrumb, Card, Input, Button, Select, Icon, Row, Col, message, DatePicker } from 'antd';
import { Link } from 'react-router-dom';
const FormItem = Form.Item;
const Option = Select.Option;
import './index.less';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

function AddCarOwner(props) {
  const { dispatch, form, typeOption, lotsOption, tradingOption, addVisible, id, typeVisible, arrData, groupOption, buildingOption, unitOption, key, roomOption, info, group, building } = props;
  const { getFieldDecorator } = form;
  const formItemLayout = {
    labelCol: {
      span: 3,
    },
    wrapperCol: {
      span: 7,
    },
  };

  function selectChange(mark, val) {
    if (mark == 'group') {
      form.setFieldsValue({ building: '', unit: '', room: '' });
      dispatch({
        type: 'AddCarOwner/concat',
        payload: { group: val }
      });
      dispatch({
        type: 'AddCarOwner/buildingList',
        payload: { group: val, community_id: sessionStorage.getItem("communityId") }
      });
    } else if (mark == 'building') {
      form.setFieldsValue({ unit: '', room: '' });
      dispatch({
        type: 'AddCarOwner/concat',
        payload: { building: val }
      });
      dispatch({
        type: 'AddCarOwner/unitList',
        payload: { group: group, building: val, community_id: sessionStorage.getItem("communityId") }
      });
    } else if (mark == 'unit') {
      form.setFieldsValue({ room: '' });
      dispatch({
        type: 'AddCarOwner/roomList',
        payload: { group: group, building: building, unit: val, community_id: sessionStorage.getItem("communityId") }
      });
    }
  }

  function handleSubmit(e) {
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      let list = [];
      arrData.map((value, index) => {
        list.push(value.name);
      })
      let lot_id = '';
      lotsOption.map((value, index) => {
        if (value.name == values.lot_name) {
          lot_id = value.id;
        }
      })

      if (list.length == 0) {
        message.error('请输入车牌号！');
        return;
      }
      if (id) { // 编辑
        dispatch({
          type: 'AddCarOwner/EditUser',
          payload: {
            id: id,
            community_id: sessionStorage.getItem("communityId"),
            expired: values.expired ? values.expired.format('YYYY-MM-DD') : '',
            lot_id: lot_id,
            lot_name: values.lot_name,
            mobile: values.mobile,
            name: values.name,
            group: values.group,
            building: values.building,
            unit: values.unit,
            room: values.room,
            plate: list,
            rent_amount: values.rent_amount,
            room_address: values.room_address,
            room_id: values.room_id,
            tran_type: (values.tran_type).toString(),
            type: (values.type).toString(),
          }
        })

      } else { //新增
        dispatch({
          type: 'AddCarOwner/AddSubmit',
          payload: {
            community_id: sessionStorage.getItem("communityId"),
            expired: values.expired ? values.expired.format('YYYY-MM-DD') : '',
            lot_id: lot_id,
            lot_name: values.lot_name,
            mobile: values.mobile,
            name: values.name,
            group: values.group,
            building: values.building,
            unit: values.unit,
            room: values.room,
            plate: list,
            rent_amount: values.rent_amount,
            room_address: values.room_address,
            room_id: values.room_id,
            tran_type: (values.tran_type).toString(),
            type: (values.type).toString(),
          }
        })
      }
    })
  }

  function handleBack() {
    history.go(-1);
  }

  // change交易类型
  function changeType(val){
    if(val == 2){
      dispatch({
        type: 'AddCarOwner/concat',
        payload: {
          typeVisible:true,
        }
      })
    }else if(val == 1){
      dispatch({
        type: 'AddCarOwner/concat',
        payload: {
          typeVisible:false,
        }
      })
    }
  }

  function addLotName() {
    let arr = arrData;
    if (arr.length >= 2) {
      dispatch({
        type: 'AddCarOwner/concat',
        payload: {
          addVisible: false,
        }
      })
    }
    arr.push({
      name: "",
      key: key + 1
    })
    dispatch({
      type: 'AddCarOwner/concat',
      payload: {
        arrData: arr,
        key: key + 1
      }
    })
  }
  // 删除车牌号
  function removeLotName(index) {
    const arr = arrData;
    if (arr.length <= 3) {
      dispatch({
        type: 'AddCarOwner/concat',
        payload: {
          addVisible: true,
        }
      })
    }
    Array.prototype.del = function (index) {
      if (isNaN(index) || index >= this.length) {
        return false;
      }
      for (let i = 0, n = 0; i < this.length; i++) {
        if (this[i] != this[index]) {
          this[n++] = this[i];
        }
      }
      this.length -= 1;
    };

    arr.del(index);
    dispatch({
      type: 'AddCarOwner/concat',
      payload: {
        arrData: arr,
        key: key + 1
      }
    })
  }
  function disabledDate(current) {
    return current && current.valueOf() < Date.now() - 8640000;
  }
  function change(value, index, e) {
    const arr = arrData;
    arr[index][`${value}`] = e.target.value;
    dispatch({
      type: 'AddCarOwner/concat',
      payload: {
        arrData: arr,
      }
    })
  }
  getFieldDecorator('keys', { initialValue: [] });

  let divContent = "";
  if (arrData.length == 1) {
    divContent = arrData.map((value, index) => {
      return (<Row key={index}>
        <Col span={20}>
          <FormItem label={''}>
            {getFieldDecorator(`name-${index}-${value.key}`, { initialValue: value.name, rules: [{ required: true, message: '请输入', }], onChange: change.bind(this, "name", index) })(<Input placeholder="请输入车牌号码" />)}
          </FormItem>
        </Col>

      </Row>)
    })
  } else {
    divContent = arrData.map((value, index) => {
      return (<Row key={index}>
        <Col span={20}>
          <FormItem label={''}>
            {getFieldDecorator(`name-${index}-${value.key}`, { initialValue: value.name, rules: [{ required: true, message: '请输入', }], onChange: change.bind(this, "name", index) })(<Input placeholder="请输入车牌号码" />)}
          </FormItem>
        </Col>
        <Col span={4}>
          <Icon type="minus-circle-o" onClick={removeLotName.bind(this, index)} />
        </Col>
      </Row>)
    })
  }

  return (
    <div>
      <Breadcrumb separator=">">
        <Breadcrumb.Item>停车管理</Breadcrumb.Item>
        <Breadcrumb.Item><Link to="/carOwnerManagement">车位管理</Link></Breadcrumb.Item>
        <Breadcrumb.Item>{id ? '编辑' : '新增'}车主</Breadcrumb.Item>
      </Breadcrumb>
      <Card>
        <Form>
          <FormItem {...formItemLayout} label="车主姓名" hasFeedback>
            {getFieldDecorator('name', {
              rules: [{ type: "string", pattern: /^[0-9\u3b4e-\ue82d]+$/, required: true, message: '请输入车主姓名(10个以内汉字)' }],
              initialValue: info.name
            })(
              <Input maxLength={20} placeholder="请输入车主姓名" />
            )}
          </FormItem>

          <FormItem label="车主类型" {...formItemLayout}>
            {getFieldDecorator('type', {
              rules: [{ type: 'number', required: true, message: '请选择车主类型', whitespace: true }],
              initialValue: info.type ? info.type.id : ''
            })(
              <Select placeholder="请选择车主类型" notFoundContent="没有数据" style={{ width: '100%' }}>
                {typeOption.map((value, index) => { return <Option key={index} value={value.id}>{value.name}</Option> })}
              </Select>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="苑/期/区" hasFeedback>
            {getFieldDecorator('group', {
              rules: [{ required: true, message: '请选择苑/期/区' }], initialValue: info.group
            })(
              <Select placeholder="请选择苑/期/区" showSearch={true} notFoundContent="没有数据" onChange={selectChange.bind(this, 'group')}>
                {groupOption.map((value, index) => { return <Option key={index} value={value.name}>{value.name}</Option> })}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="幢" hasFeedback>
            {getFieldDecorator('building', {
              rules: [{ required: true, message: '请选择幢' }], initialValue: info.building
            })(
              <Select placeholder="请选择幢" showSearch={true} notFoundContent="没有数据" onChange={selectChange.bind(this, 'building')}>
                {buildingOption.map((value, index) => { return <Option key={index} value={value.name}>{value.name}</Option> })}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="单元" hasFeedback>
            {getFieldDecorator('unit', {
              rules: [{ required: true, message: '请选择单元' }], initialValue: info.unit
            })(
              <Select placeholder="请选择单元" showSearch={true} notFoundContent="没有数据" onChange={selectChange.bind(this, 'unit')}>
                {unitOption.map((value, index) => { return <Option key={index} value={value.name}>{value.name}</Option> })}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="室" hasFeedback>
            {getFieldDecorator('room', {
              rules: [{ required: true, message: '请选择室' }], initialValue: info.room
            })(
              <Select placeholder="请选择室" showSearch={true} notFoundContent="没有数据">
                {roomOption.map((value, index) => { return <Option key={index} value={value.name}>{value.name}</Option> })}
              </Select>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="联系电话" hasFeedback>
            {getFieldDecorator('mobile', {
              rules: [{ required: true, message: '请输入联系电话' }],
              initialValue: info.mobile
            })(
              <Input maxLength={20} placeholder="请输入联系电话" />
            )}
          </FormItem>

          <FormItem label="交易类型" {...formItemLayout}>
            {getFieldDecorator('tran_type', {
              rules: [{ type: 'number',required: true, message: '请选择交易类型', whitespace: true }],
              initialValue: info.tran_type ? info.tran_type.id : ''
            })(
              <Select placeholder="请选择交易类型" onChange={changeType.bind(this)} notFoundContent="没有数据" style={{ width: '100%' }} disabled={id ? true : false}>
                {tradingOption.map((value, index) => { return <Option key={index} value={value.id}>{value.name}</Option> })}
              </Select>
            )}
          </FormItem>

          <FormItem label="车位号" {...formItemLayout}>
            {getFieldDecorator('lot_name', {
              initialValue: info ? info.lot_name + '' : undefined
            })(
              <Select placeholder="请选择车位号" notFoundContent="没有数据">
                {lotsOption.map((value, index) => { return <Option key={index} value={String(value.id)}>{value.name}</Option> })}
              </Select>
            )}
          </FormItem>

          <Row>
            <Col span={3}>
              <p style={{ textAlign: 'right', color: 'rgba(0, 0, 0, 0.65)', marginRight: '5px' }}><span style={{ color: '#f04134' }}>*</span>车牌号码:</p>
            </Col>
            <Col span={7}>
              <div className="inputsStyle">
                {divContent}
              </div>
              {addVisible == true ? <Col span={24}><Button type="ghost" className="add" onClick={addLotName.bind(this)}><Icon type="plus" />新增车牌号码</Button></Col> : ''}
            </Col>
          </Row>
          {typeVisible == true ?
            <div>
              {id && info.rent_amount != "" ?
                <div>
                  <Row>
                    <FormItem {...formItemLayout} label="有效期至" >
                      {getFieldDecorator('expired', { initialValue: info.expired ? moment(info.expired) : "", rules: [{ required: true, message: '请选择有效期' }], })(
                        <DatePicker style={{ width: '100%' }} disabled disabledDate={disabledDate.bind(this)} />
                      )}
                    </FormItem>
                  </Row>
                  <Row>
                    <FormItem {...formItemLayout} label="租金" >
                      {getFieldDecorator('rent_amount', { initialValue: info.rent_amount ? info.rent_amount + "" : "", rules: [{ type: 'string', pattern: /^[0-9]+(.[0-9]{1,2})?$/, required: true, message: '请输入租金(正整数或小数点后保留两位)' }], })(
                        <Input placeholder="请输入租金" disabled addonAfter="元" />
                      )}
                    </FormItem>
                  </Row>
                </div>
                :
                <div>
                  <Row>
                    <FormItem {...formItemLayout} label="有效期至" >
                      {getFieldDecorator('expired', { initialValue: info.expired ? moment(info.expired) : "", rules: [{ required: true, message: '请选择有效期' }], })(
                        <DatePicker style={{ width: '100%' }} disabledDate={disabledDate.bind(this)} />
                      )}
                    </FormItem>
                  </Row>
                  <Row>
                    <FormItem {...formItemLayout} label="租金" >
                      {getFieldDecorator('rent_amount', { initialValue: info.rent_amount ? info.rent_amount + "" : "", rules: [{ type: 'string', pattern: /^[0-9]+(.[0-9]{1,2})?$/, required: true, message: '请输入租金(正整数或小数点后保留两位)' }], })(
                        <Input placeholder="请输入租金" addonAfter="元" />
                      )}
                    </FormItem>
                  </Row>
                </div>
              }
            </div>
            : ""}
          <FormItem wrapperCol={{ span: 12, offset: 3 }}>
            <Button type="primary" className="mr1 mt1" onClick={handleSubmit}>确定</Button>
            <Button type="ghost" className="mt1" onClick={handleBack} >返回</Button>
          </FormItem>
        </Form>
      </Card>
    </div>
  )
}

function mapStateToProps(state) {
  return {
    ...state.AddCarOwner,
    loading: state.loading.models.AddCarOwner
  };
}
export default connect(mapStateToProps)(Form.create()(AddCarOwner));

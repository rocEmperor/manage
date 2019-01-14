
import React from 'react';
import { connect } from 'dva';
import { Form, Breadcrumb, Card, Input, Button, Select, Icon, Row, Col, message, DatePicker } from 'antd';
import { Link } from 'react-router-dom';
const FormItem = Form.Item;
const Option = Select.Option;
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

function DoorCardAddNormal(props) {
  const { dispatch, form, addVisible, id, arrData, groupOption, buildingOption, unitOption, key, roomOption, info, group, building, unit, userList, carType } = props;
  
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
      form.setFieldsValue({building:'',unit:'',room:'',identity_type:''});
      dispatch({
        type: 'DoorCardAddNormal/concat',
        payload: { 
          group: val,
          buildingOption:[],
          unitOption:[],
          roomOption:[],
          userList:[]
        }
      });
      dispatch({
        type: 'DoorCardAddNormal/buildingList',
        payload: { group: val, community_id: sessionStorage.getItem("communityId") }
      });
    } else if (mark == 'building') {
      form.setFieldsValue({unit:'',room:'',identity_type:''});
      dispatch({
        type: 'DoorCardAddNormal/concat',
        payload: { 
          building: val,
          unitOption:[],
          roomOption:[],
          userList:[]
        }
      });
      dispatch({
        type: 'DoorCardAddNormal/unitList',
        payload: { group: group, building: val, community_id: sessionStorage.getItem("communityId") }
      });
    } else if (mark == 'unit') {
      form.setFieldsValue({room:'',identity_type:''});
      dispatch({
        type: 'DoorCardAddNormal/concat',
        payload: { 
          unit: val,
          roomOption:[],
          userList:[]
        }
      });
      dispatch({
        type: 'DoorCardAddNormal/roomList',
        payload: { group: group, building: building, unit: val, community_id: sessionStorage.getItem("communityId") }
      });
    }else if(mark == 'room') {
      form.setFieldsValue({identity_type:''});
      dispatch({
        type: 'DoorCardAddNormal/concat',
        payload: { 
          userList:[]
        }
      });
      dispatch({
        type: 'DoorCardAddNormal/userList',
        payload: { group: group, building: building, unit: unit, room: val, community_id: sessionStorage.getItem("communityId") }
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

      if (list.length == 0) {
        message.error('请输入门卡卡号！');
        return;
      }
      let name = '';
      let mobile = '';
      let identity = '';
      userList.length!=0?userList.map(item=>{
        if(values.identity_type == item.mobile){
          mobile = item.mobile;
          name = item.name;
          identity = item.identity_type;
        }
      }):null
      if (id) { // 编辑
        dispatch({
          type: 'DoorCardAddNormal/doorCardEdit',
          payload: {
            id: id,
            community_id: sessionStorage.getItem("communityId"),
            group: values.group,
            building: values.building,
            unit: values.unit,
            room: values.room,
            card_num: list.join(),
            expires_in: values.expires_in ? values.expires_in.format('YYYY-MM-DD') : '',
            identity_type: identity,
            card_type: values.card_type,
            type: 1,
            name:name,
            mobile:mobile
          }
        })

      } else { //新增
        dispatch({
          type: 'DoorCardAddNormal/doorCardAdd',
          payload: {
            community_id: sessionStorage.getItem("communityId"),
            expires_in: values.expires_in ? values.expires_in.format('YYYY-MM-DD') : '',
            group: values.group,
            building: values.building,
            unit: values.unit,
            room: values.room,
            card_num: list.join(),
            identity_type: values.identity_type,
            card_type: values.card_type,
            type: 1,
            name:name,
            mobile:mobile
          }
        })
      }
    })
  }

  function handleBack() {
    history.go(-1);
  }

  function addLotName() {
    let arr = arrData;
    if (arr.length >= 4) {
      dispatch({
        type: 'DoorCardAddNormal/concat',
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
      type: 'DoorCardAddNormal/concat',
      payload: {
        arrData: arr.slice(),
        // key: key + 1
      }
    })
  }
  // 删除车牌号
  function removeLotName(index) {
    const arr = arrData;
    if (arr.length <= 4) {
      dispatch({
        type: 'DoorCardAddNormal/concat',
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
      type: 'DoorCardAddNormal/concat',
      payload: {
        arrData: arr.slice(),
        // key: key + 1
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
      type: 'DoorCardAddNormal/concat',
      payload: {
        arrData: arr,
      }
    })
  }
  let divContent = arrData.map((value, index) => {
    return (<Row key={index}>
      <Col span={20}>
        <FormItem label={''}>
          {getFieldDecorator(`name-${index}-${value.key}`, { initialValue: value.name, rules: [{ required: true, message: '请输入门卡卡号',pattern: /^([a-zA-Z0-9]).{0,12}$/ }], onChange: change.bind(this, "name", index) })(<Input placeholder="请输入门卡卡号" disabled={id?true:false} maxLength="12" style={{ width: '100%' }} />)}
        </FormItem>
      </Col>
      {
        arrData.length != 1 ?
          <Col span={3}>
            <a onClick={removeLotName.bind(this, index)} style={{ marginTop: '11px', marginLeft: '15px', display: 'inline-block' }}>删除</a>
          </Col> : null
      }
    </Row>)
  })


  return (
    <div>
      <Breadcrumb separator=">">
        <Breadcrumb.Item>智能门禁</Breadcrumb.Item>
        <Breadcrumb.Item><Link to="/doorCardManagement">门卡管理</Link></Breadcrumb.Item>
        <Breadcrumb.Item>{id ? '编辑' : '新增'}普通卡</Breadcrumb.Item>
      </Breadcrumb>
      <Card>
        <Form>
          <FormItem {...formItemLayout} label="苑/期/区">
            {getFieldDecorator('group', {
              rules: [{ required: true, message: '请选择苑/期/区' }], initialValue: info.group
            })(
              <Select placeholder="请选择苑/期/区" showSearch={true} notFoundContent="没有数据" onChange={selectChange.bind(this, 'group')}>
                {groupOption.map((value, index) => { return <Option key={index} value={value.name}>{value.name}</Option> })}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="幢">
            {getFieldDecorator('building', {
              rules: [{ required: true, message: '请选择幢' }], initialValue: info.building
            })(
              <Select placeholder="请选择幢" showSearch={true} notFoundContent="没有数据" onChange={selectChange.bind(this, 'building')}>
                {buildingOption.map((value, index) => { return <Option key={index} value={value.name}>{value.name}</Option> })}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="单元">
            {getFieldDecorator('unit', {
              rules: [{ required: true, message: '请选择单元' }], initialValue: info.unit
            })(
              <Select placeholder="请选择单元" showSearch={true} notFoundContent="没有数据" onChange={selectChange.bind(this, 'unit')}>
                {unitOption.map((value, index) => { return <Option key={index} value={value.name}>{value.name}</Option> })}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="室">
            {getFieldDecorator('room', {
              rules: [{ required: true, message: '请选择室' }], initialValue: info.room
            })(
              <Select placeholder="请选择室" showSearch={true} notFoundContent="没有数据" onChange={selectChange.bind(this, 'room')}>
                {roomOption.map((value, index) => { return <Option key={index} value={value.name}>{value.name}</Option> })}
              </Select>
            )}
          </FormItem>
          <FormItem label="业主" {...formItemLayout}>
            {getFieldDecorator('identity_type', {
              rules: [{ required: true, message: '请选择业主' }],
              initialValue: info.mobile ? String(info.mobile) : undefined
            })(
              <Select placeholder="请选择业主" notFoundContent="没有数据" style={{ width: '100%', marginTop: '10px' }}>
                {
                  userList.map((value, index) => { return (value.name?<Option key={index} value={value.mobile}>{value.name}</Option>:<Option key={index} disabled value={value.mobile}>暂无数据</Option>) })
                }
              </Select>
            )}
          </FormItem>
          <Row>
            <Col span={3}>
              <p style={{ textAlign: 'right', color: '#333', marginRight: '5px', marginTop: '11px' }}><span style={{ color: '#f5222d' }}>*</span>门卡卡号:</p>
            </Col>
            <Col span={7}>
              <div className="inputsStyle">
                {divContent}
              </div>
              {addVisible == true && id == '' ? <Col span={24}><Button type="ghost" className="add" onClick={addLotName.bind(this)}><Icon type="plus" />新增门卡卡号</Button></Col> : ''}
            </Col>
          </Row>
          <FormItem label="门卡类型" {...formItemLayout}>
            {getFieldDecorator('card_type', {
              rules: [{ required: true, message: '请选择门卡类型' }],
              initialValue: info.card_type ? info.card_type : undefined
            })(
              <Select placeholder="请选择门卡类型" notFoundContent="没有数据" style={{ width: '100%', marginTop: '10px' }}>
                {carType.map((value, index) => { return <Option key={index} value={value.key}>{value.value}</Option> })}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="有效截止日期" >
            {getFieldDecorator('expires_in', { initialValue: info.expires_in ? moment(info.expires_in) : null, rules: [{ required: true, message: '请选择有效截止日期' }], })(
              <DatePicker style={{ width: '100%' }} disabledDate={disabledDate.bind(this)} placeholder="请选择有效截止日期" />
            )}
          </FormItem>
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
    ...state.DoorCardAddNormal,
    loading: state.loading.models.DoorCardAddNormal
  };
}
export default connect(mapStateToProps)(Form.create()(DoorCardAddNormal));

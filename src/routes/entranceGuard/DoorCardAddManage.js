
import React from 'react';
import { connect } from 'dva';
import { Form, Breadcrumb, Card, Input, Button, Select, Icon, Row, Col, message, DatePicker, Transfer } from 'antd';
import { Link } from 'react-router-dom';
const FormItem = Form.Item;
const Option = Select.Option;
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
import { checkPhone } from '../../utils/util';

function DoorCardAddManage(props) {
  const { dispatch, form, addVisible, id, arrData, key, info,targetKeys, mockData, carType } = props;
  
  const { getFieldDecorator } = form;
  const formItemLayout = {
    labelCol: {
      span: 3,
    },
    wrapperCol: {
      span: 7,
    },
  };
  const formItemLayout1 = {
    labelCol: {
      span: 3,
    },
    wrapperCol: {
      span: 12,
    },
  };

  //选择授权门禁
  function handleChange(nextTargetKeys, direction, moveKeys) {
    dispatch({
      type: 'DoorCardAddManage/concat', payload: { targetKeys: nextTargetKeys }
    });
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
      if (id) { // 编辑
        dispatch({
          type: 'DoorCardAddManage/doorCardEdit',
          payload: {
            id: id,
            community_id: sessionStorage.getItem("communityId"),
            group: values.group,
            building: values.building,
            unit: values.unit,
            room: values.room,
            card_num: list.join(),
            expires_in: values.expires_in ? values.expires_in.format('YYYY-MM-DD') : '',
            card_type: values.card_type,
            type:2,
            name: values.name,
            mobile: values.mobile,
            devices_id: (values.devices_id).join()
          }
        })

      } else { //新增
        dispatch({
          type: 'DoorCardAddManage/doorCardAdd',
          payload: {
            community_id: sessionStorage.getItem("communityId"),
            expires_in: values.expires_in ? values.expires_in.format('YYYY-MM-DD') : '',
            group: values.group,
            building: values.building,
            unit: values.unit,
            room: values.room,
            card_num: list.join(),
            card_type: values.card_type,
            type:2,
            name: values.name,
            mobile: values.mobile,
            devices_id: (values.devices_id).join()
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
        type: 'DoorCardAddManage/concat',
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
      type: 'DoorCardAddManage/concat',
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
        type: 'DoorCardAddManage/concat',
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
      type: 'DoorCardAddManage/concat',
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
      type: 'DoorCardAddManage/concat',
      payload: {
        arrData: arr,
      }
    })
  }
  function filterOption(inputValue, option){
    return option.name.indexOf(inputValue) > -1;
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
        <Breadcrumb.Item>{id ? '编辑' : '新增'}管理卡</Breadcrumb.Item>
      </Breadcrumb>
      <Card>
        <Form>
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
          <FormItem {...formItemLayout} label="客户姓名" hasFeedback>
            {getFieldDecorator('name', {
              rules: [{ required: true, message:'请填写客户姓名' }],
              initialValue: info.name
            })(
              <Input maxLength={10} placeholder="请输入姓名"/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="手机号码" hasFeedback>
            {getFieldDecorator('mobile', {
              rules: [{ required: true, message: '请输入手机号码' }, { validator: checkPhone.bind(this), message: '请输入手机号码！' }],
              initialValue: info.mobile
            })(
              <Input maxLength={20} placeholder="请输入手机号" />
            )}
          </FormItem>
          <FormItem label="授权门禁" {...formItemLayout1}>
            {getFieldDecorator('devices_id', {
              initialValue: targetKeys,
              rules: [{ required: true, message: '请选择授权门禁!' }],
            })(
              <Transfer
                titles={['未授权门禁', '已授权门禁']}
                dataSource={mockData}
                targetKeys={targetKeys}
                onChange={handleChange}
                render={item => item.name}
                rowKey={item => item.id}
                notFoundContent=""
                showSearch
                filterOption={filterOption}
              />
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
    ...state.DoorCardAddManage,
    loading: state.loading.models.DoorCardAddManage
  };
}
export default connect(mapStateToProps)(Form.create()(DoorCardAddManage));

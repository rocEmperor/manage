import React from 'react';
import { connect } from 'dva';
import { Form, Breadcrumb, Card, Select, Button, Input, Row, message } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
let query = {
  community_id: sessionStorage.getItem("communityId"),
  group: '',
  building: '',
  unit: ''
}
function PackageAdd(props) {
  const { dispatch, form, id, info, loading, expressCompany, groupOption, buildingOption, unitOption, roomOption, noteList } = props;
  const searchModel = 'PackageAddModel';
  const { getFieldDecorator } = props.form;
  const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 10 },
  };
  function selectChange(mark, val) {
    query[mark] = val;
    if (mark == 'group') {
      form.setFieldsValue({ building: '', unit: '', room: '' });
      dispatch({
        type: searchModel + '/buildingList',
        payload: query
      });
    } else if (mark == 'building') {
      form.setFieldsValue({ unit: '', room: '' });
      dispatch({
        type: searchModel + '/unitList',
        payload: query
      });
    } else if (mark == 'unit') {
      form.setFieldsValue({ room: '' });
      dispatch({
        type: searchModel + '/roomList',
        payload: query
      });
    }
  }
  //新增
  function handleSubmit(e) {
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      if (values.group && values.building && values.unit && values.room) {
        //
      } else if ((!values.group) && (!values.building) && (!values.unit) && (!values.room)) {
        //
      } else if (values.group == "") {
        message.error('请完善房屋信息！');
        return;
      }
      else if (values.building == "") {
        message.error('请完善房屋信息！');
        return;
      }
      else if (values.unit == "") {
        message.error('请完善房屋信息！');
        return;
      }
      else if (values.room == "") {
        message.error('请完善房屋信息！');
        return;
      }
      let { expressCompany, tracking_no, receiver, mobile, group, building, unit, room, note, delivery_id } = values;
      let payload = { expressCompany, tracking_no, receiver, mobile, group, building, unit, room, note, delivery_id, community_id: sessionStorage.getItem("communityId") };
      if (id) {
        payload = { ...payload, id: id };
      }
      let func = id ? 'PackageAddModel/packageEdit' : 'PackageAddModel/packageCreate';
      dispatch({ type: func, payload });
    })
  }
  function handleBack(e) {
    history.go(-1)
  }
  return (
    <div>
      <Breadcrumb separator=">">
        <Breadcrumb.Item>物业服务</Breadcrumb.Item>
        <Breadcrumb.Item><a href="#/packageManagement">小区包裹</a></Breadcrumb.Item>
        <Breadcrumb.Item>{id ? "编辑包裹" : "新增包裹"}</Breadcrumb.Item>
      </Breadcrumb>
      <Card className="section">
        <Form>
          <FormItem label="快递公司" {...formItemLayout}>
            {getFieldDecorator('delivery_id', {
              initialValue: info.delivery ? String(info.delivery.id) : '',
              rules: [{ required: true, message: '请选择快递公司' }],
            })(
              <Select placeholder="请选择分类" notFoundContent="没有数据">
                {expressCompany.map((value, index) => {
                  return <Option key={index} value={String(value.id)}>{value.name}</Option>
                })}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="运单号" >
            {getFieldDecorator('tracking_no', { initialValue: info.tracking_no, rules: [{ required: true, type: 'string', pattern: /^[0-9a-zA-Z]{1,20}$/, message: '请输入20以内数字加字母' }], })(
              <Input placeholder="请输入运单号" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="收件人姓名" >
            {getFieldDecorator('receiver', { initialValue: info.receiver, rules: [{ required: true, type: 'string', pattern: /^[^ ]{1,20}$/, message: '请输入收件人姓名（20字符以内）' }], })(
              <Input placeholder="请输入收件人姓名" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="手机号码" >
            {getFieldDecorator('mobile', { initialValue: info.mobile, rules: [{ required: true, type: 'string', pattern: /^1[0-9]{10}$/, message: '请输入11位正确手机号码' }], })(
              <Input placeholder="请输入手机号码" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="苑/期/区" hasFeedback>
            {getFieldDecorator('group', { initialValue: info.group ? info.group : '' })(
              <Select placeholder="请选择苑/期/区" notFoundContent="没有数据" showSearch={true} onChange={selectChange.bind(this, 'group')} >
                {groupOption.map((value, index) => { return <Option key={index} value={String(value.name)}>{value.name}</Option> })}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="幢">
            {getFieldDecorator('building', {
              initialValue: info.building ? info.building : '',

            })(
              <Select placeholder="请选择幢" notFoundContent="没有数据" showSearch={true} onChange={selectChange.bind(this, 'building')} >
                {buildingOption.map((value, index) => { return <Option key={index} value={String(value.name)}>{value.name}</Option> })}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="单元">
            {getFieldDecorator('unit', {
              initialValue: info.unit ? info.unit : '',
            })(
              <Select placeholder="请选择单元" notFoundContent="没有数据" showSearch={true} onChange={selectChange.bind(this, 'unit')} >
                {unitOption.map((value, index) => { return <Option key={index} value={String(value.name)}>{value.name}</Option> })}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="室">
            {getFieldDecorator('room', {
              initialValue: info.room ? info.room : '',
            })(
              <Select placeholder="请选择室" showSearch={true} notFoundContent="没有数据" >
                {roomOption.map((value, index) => { return <Option key={index} value={String(value.name)}>{value.name}</Option> })}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="快递备注">
            {getFieldDecorator('note', { initialValue: info.note ? String(info.note.id) : '', rules: [{ required: true, message: '请选择快递备注' }] })(
              <Select placeholder="请选择快递备注" >
                {noteList.map((value, index) => {
                  return <Option key={index} value={String(value.id)}>{value.name}</Option>
                })}
              </Select>
            )}
          </FormItem>
          <Row>
            <FormItem wrapperCol={{ span: 12, offset: 2 }}>
              <Button type="primary" onClick={handleSubmit} className="mr1" loading={loading}>确认</Button>
              <Button type="ghost" onClick={handleBack.bind(this)}>返回</Button>
            </FormItem>
          </Row>
        </Form>
      </Card>
    </div>
  )
}

function mapStateToProps(state) {
  return {
    ...state.PackageAddModel,
    loading: state.loading.models.PackageAddModel,
  }
}
export default connect(mapStateToProps)(Form.create()(PackageAdd));

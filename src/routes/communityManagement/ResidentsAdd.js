import React from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Breadcrumb, Card, Select, Row, Col, DatePicker, Cascader, Checkbox} from 'antd';
const FormItem = Form.Item;
import moment from 'moment';
const Option = Select.Option;
import { Link } from 'react-router-dom';
import {checkPhone} from '../../utils/util';
import {getCommunityId} from '../../utils/util';
// import Image from '../../components/Image/index';
let query = {
  community_id: getCommunityId(),
  group: undefined,
  building: undefined,
  unit: undefined,
};
let hasSubmit = false;
function ResidentsAdd(props) {
  const { dispatch, form, id, info, loading, groupOption, buildingOption, unitOption, roomOption, nation, curType, isLong, curIdentity,
    change_detail, face, household_type, identity_type, live_detail, live_type, marry_status, labelType, houseArea } = props;
  const { getFieldDecorator } = props.form;

  /**
   * 编辑/新增住户 表单提交
   */
  function handleSubmit(e) {
    // if (change_img ==false){
    //   form.setFieldsValue({ face_url: info.face_url })
    // }
    let validateArr = ['name', 'mobile', 'group', 'building', 'unit', 'room', 'identity_type'];
    if (curIdentity === '3' && !isLong) {
      validateArr = ['name', 'mobile', 'group', 'building', 'unit', 'room', 'identity_type', 'time_end'];
    }
    form.validateFields(validateArr, (err, value) => {
      let values = form.getFieldsValue();
      if (err) { return }
      if (!hasSubmit) {
        hasSubmit = true;
        let { name, sex, mobile, card_no, group, building, unit, room, identity_type, enter_time, reason, work_address,
          user_label_id, qq, wechat, email, telephone, emergency_contact, emergency_mobile, nation,
          face, marry_status, household_type, household_area, household_address, residence_number, live_type, live_detail,
          change_detail, change_before, change_after, time_end
        }=values;
        // if (change_img == false) {
        //   face_url = info.face_url ? info.face_url.url:'';
        // }else{
        //   if (face_url && face_url.length != 0) {
        //     face_url = face_url[0].response.data.filepath
        //   }
        // }
        let room_id = '';
        if (id) {  // 编辑
          room_id = info.room_id
        } else {
          roomOption.forEach((val, idx) => {  // 新增
            if (val.name == room) {
              room_id = val.id;
            }
          });
        }
        if (curIdentity === '3' && isLong) {
          time_end = '0'
        } else if (curIdentity === '3') {
          time_end = time_end.format('YYYY-MM-DD')
        }
        if (enter_time) {
          enter_time = enter_time.format('YYYY-MM-DD');
        }
        let household_province;
        let household_city;
        if (household_area){
          household_province = household_area[0];
          household_city = household_area[1];
          household_area = household_area[2]
        }
        let payload = { name, sex, mobile, card_no, group, building, unit, room, identity_type, enter_time, reason,
          work_address, user_label_id, qq, wechat, email, telephone, emergency_contact, emergency_mobile, time_end, room_id,
          nation, face, marry_status, household_type, household_province, household_city, household_area, household_address, residence_number, live_type,
          live_detail, change_detail, change_before, change_after,community_id:getCommunityId()};
        if(id) {
          payload = {...payload, id:id};
        }
        if (payload.sex == 0) {
          payload.sex = undefined;
        }
        let func = id ? 'ResidentsAddModel/editResidents' : 'ResidentsAddModel/createResidents';
        dispatch({
          type: func,
          payload: payload,
          callback: () => {
            hasSubmit = false;
            if (curType) {
              window.location.hash = `#/residentsManage?type=${curType}`
            } else {
              window.location.hash = '#/residentsManage'
            }
          },
          err: () => {
            hasSubmit = false
          }
        });
      }
    })
  }

  // function handImgChange(id, fileList) {
  //   dispatch({
  //     type: 'ResidentsAddModel/concat',
  //     payload:{
  //       change_img: true
  //     }
  //   });
  //   if (fileList.length > 0) {
  //     form.setFieldsValue({ face_url: fileList })
  //   }else{
  //     form.setFieldsValue({ face_url: '' });
  //   }
  // }



  /**
   * 返回住户管理页面
   */
  function handleBack() {
    history.go(-1);
  }
  // 布局
  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };
  const formItemLayout1 = {
    labelCol: { span: 8 },
    wrapperCol: { span: 14 },
  };
  /**
   * 级联列表
   * @param  {string} mark
   * @param  {string} val
   * mark = group  苑/期/区
   * mark = building  幢
   * mark = unit 单元
   */
  function selectChange(mark, val) {
    query[mark] = val;
    if (mark == 'group') {
      form.setFieldsValue({ building: '', unit: '', room: '' });
      query.building = undefined;
      query.unit = undefined;
      dispatch({
        type: 'ResidentsAddModel/buildingList',
        payload: query
      });
    } else if (mark == 'building') {
      form.setFieldsValue({ unit: '', room: '' });
      query.unit = undefined;
      dispatch({
        type: 'ResidentsAddModel/unitList',
        payload: query
      });
    } else if (mark == 'unit') {
      form.setFieldsValue({ room: '' });
      dispatch({
        type: 'ResidentsAddModel/roomList',
        payload: query
      });
    }
  }
  /*
    * 不可选择日期
    * */
  function disabledDate(current) {
    return current && current < moment().endOf('day');
  }
  /*
  * 监听有效期变化
  * */
  function liveDateChange (val) {
    form.setFieldsValue({time_end: null});
    dispatch({
      type: 'ResidentsAddModel/concat',
      payload: { isLong: val.target.checked }
    })
  }
  function datePickerChange (val) {
    dispatch({
      type: 'ResidentsAddModel/concat',
      payload: { isLong: false }
    })
  }
  /*
    * 监听身份变化
    * */
  function identityChange (val) {
    dispatch({
      type: 'ResidentsAddModel/concat',
      payload: { curIdentity: val }
    })
  }

  return (
    <div>
      <Breadcrumb separator=">">
        <Breadcrumb.Item>小区管理</Breadcrumb.Item>
        <Breadcrumb.Item><Link to="/residentsManage">住户管理</Link></Breadcrumb.Item>
        <Breadcrumb.Item>{id ? '编辑' : '新增'}住户</Breadcrumb.Item>
      </Breadcrumb>
      <Card className="section">
        <Form>
          <Card className="mt1">
            <p>基础信息</p>
            <Row>
              <Col span={12}>
                <FormItem {...formItemLayout} label="姓名" >
                  {getFieldDecorator('name',{
                    rules:[{type: "string",pattern: /^[0-9\u3b4e-\ue82d]+$/,required: true, message: '格式错误（1-10位数字、文字）'}],
                    initialValue:info.name
                  })(
                    <Input maxLength={10} placeholder="请输入姓名" disabled={info.status && info.status == '2' ? true : false}/>
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label="性别" >
                  {getFieldDecorator('sex',{
                    initialValue: info.sex == 1 ? '1' : (info.sex == 2 ? '2':'0')
                  })(
                    <Select placeholder="请选择性别">
                      <Option key={0} value="0">请选择</Option>
                      <Option key={1} value="1">男</Option>
                      <Option key={2} value="2">女</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label="手机号码" >
                  {getFieldDecorator('mobile',{
                    rules:[{required: true, message: '请输入手机号码'},{validator: checkPhone.bind(this), message:'请输入手机号码！'}],
                    initialValue:info.mobile
                  })(
                    <Input maxLength={20} placeholder="请输入手机号" disabled={info.status && info.status == '2' ? true : false}/>
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label="身份证号" >
                  {getFieldDecorator('card_no',{
                    rules:[{type: "string",pattern: /^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/, message: '身份证号输入错误！'}],
                    initialValue:info.card_no
                  })(
                    <Input maxLength={20} placeholder="请输入身份证号"/>
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label="苑/期/区" >
                  {getFieldDecorator('group',{
                    rules:[{required: true, message: '请选择苑/期/区'}],
                    initialValue:info.group
                  })(
                    <Select disabled={id?true:false} showSearch={true} placeholder="请选择苑/期/区" notFoundContent="没有数据" onChange={selectChange.bind(this,'group')}>
                      {groupOption.map((value,index)=>{return <Option  key={index} value={value.name}>{value.name}</Option>})}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label="幢" >
                  {getFieldDecorator('building',{
                    rules:[{required: true, message: '请选择幢'}],
                    initialValue:info.building
                  })(
                    <Select disabled={id?true:false} showSearch={true} placeholder="请选择幢" notFoundContent="没有数据" onChange={selectChange.bind(this,'building')}>
                      {buildingOption.map((value,index)=>{return <Option  key={index} value={value.name}>{value.name}</Option>})}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label="单元" >
                  {getFieldDecorator('unit',{
                    rules:[{required: true, message: '请选择单元'}],
                    initialValue:info.unit
                  })(
                    <Select disabled={id?true:false} showSearch={true} placeholder="请选择单元" notFoundContent="没有数据" onChange={selectChange.bind(this,'unit')}>
                      {unitOption.map((value,index)=>{return <Option  key={index} value={value.name}>{value.name}</Option>})}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label="室" >
                  {getFieldDecorator('room',{
                    rules:[{required: true, message: '请选择室'}],
                    initialValue:info.room
                  })(
                    <Select disabled={id?true:false} showSearch={true} placeholder="请选择室" notFoundContent="没有数据">
                      {roomOption.map((value,index)=>{return <Option  key={index} value={value.name}>{value.name}</Option>})}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label="身份" >
                  {getFieldDecorator('identity_type', {
                    rules: [{ required: true, message: '请选择身份' }],
                    initialValue: info.identity_type
                  })(
                    <Select placeholder="请选择身份" onChange={identityChange} disabled={info.status && info.status == '2' ? true : false}>
                      {identity_type ? identity_type.map((item) => {
                        return <Option key={item.id} value={item.id.toString()}>{item.name}</Option>
                      }) : null}
                    </Select>
                  )}
                </FormItem>
              </Col>
              {curIdentity === '3'
                ? <Col span={12}>
                  <Col span={18}>
                    <FormItem label="有效期" {...formItemLayout1}>
                      {getFieldDecorator('time_end', {
                        rules: [{ required: true, message: '请选择(可选具体日期或长期)'}],
                        initialValue: info.time_end ? moment(info.time_end, "YYYY-MM-DD") : null
                      })(
                        <DatePicker format="YYYY-MM-DD" style={{width: '100%'}} onChange={datePickerChange} disabledDate={disabledDate}/>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={6} style={{marginTop: 8}}>
                    <Checkbox onChange={liveDateChange} checked={isLong}>长期</Checkbox>
                  </Col>
                </Col>
                : null}
              <Col span={12}>
                <FormItem {...formItemLayout} label="入住时间" >
                  {getFieldDecorator('enter_time', {
                    initialValue: info.enter_time?moment(info.enter_time, "YYYY-MM-DD"):null
                  })(
                    <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} placeholder="请选择时间"/>
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label="入住原因" >
                  {getFieldDecorator('reason', {
                    rules: [{ type: "string", pattern: /^.{0,150}$/, message: '格式错误（1-150位任意字符）' }],
                    initialValue: info.reason
                  })(
                    <Input maxLength={150} placeholder="请输入入住原因" />
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label="工作单位" >
                  {getFieldDecorator('work_address', {
                    rules: [{ type: "string", pattern: /^.{0,15}$/, message: '格式错误（1-15位任意字符）' }],
                    initialValue: info.work_address
                  })(
                    <Input maxLength={15} placeholder="请输入工作单位" />
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label="住户标签" >
                  {getFieldDecorator('user_label_id', {
                    initialValue: info.user_label_id
                  })(
                    <Select
                      optionFilterProp="children"
                      showSearch
                      mode="multiple"
                      placeholder="请选择住户标签"
                    >
                      {labelType ? labelType.map((item) => {
                        return <Option key={item.id} value={item.id.toString()}>{item.name}</Option>
                      }) : null}
                    </Select>
                  )}
                </FormItem>
              </Col>
              {/* <Col span={12}>
                <FormItem {...formItemLayout} label="人脸照片" >
                  {getFieldDecorator('face_url', {
                    rules: [{ required: isRequire == true ? true : false, message: '请上传人脸照片' }],
                  })(
                    <Image file={info && info.face_url ? [info.face_url]:[]} id="buildImgs" handleImage={handImgChange} size={1} />
                  )}
                </FormItem>
              </Col> */}
            </Row>
          </Card>
          <Card className="mt1">
            <p>联系信息</p>
            <Row>
              <Col span={12}>
                <FormItem {...formItemLayout} label="QQ号" >
                  {getFieldDecorator('qq', {
                    rules: [{ type: "string", pattern: /^.{0,15}$/, message: '格式错误（1-15位任意字符）' }],
                    initialValue: info.qq
                  })(
                    <Input maxLength={15} placeholder="请输入QQ号" />
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label="微信号" >
                  {getFieldDecorator('wechat', {
                    rules: [{ type: "string", pattern: /^.{0,15}$/, message: '格式错误（1-15位任意字符）' }],
                    initialValue: info.wechat
                  })(
                    <Input maxLength={15} placeholder="请输入微信号" />
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label="电子邮箱" >
                  {getFieldDecorator('email', {
                    rules: [{ type: "string", pattern: /^.{0,15}$/, message: '格式错误（1-15位任意字符）' }],
                    initialValue: info.email
                  })(
                    <Input maxLength={15} placeholder="请输入电子邮箱" />
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label="家庭电话" >
                  {getFieldDecorator('telephone', {
                    rules: [{ type: "string", pattern: /^.{0,15}$/, message: '格式错误（1-15位任意字符）' }],
                    initialValue: info.telephone
                  })(
                    <Input maxLength={15} placeholder="请输入家庭电话" />
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label="紧急联系人" >
                  {getFieldDecorator('emergency_contact', {
                    rules: [{ type: "string", pattern: /^.{0,15}$/, message: '格式错误（1-15位任意字符）' }],
                    initialValue: info.emergency_contact
                  })(
                    <Input maxLength={15} placeholder="请输入紧急联系人" />
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label="紧急联系电话" >
                  {getFieldDecorator('emergency_mobile', {
                    rules: [{ type: "string", pattern: /^.{0,15}$/, message: '格式错误（1-15位任意字符）' }],
                    initialValue: info.emergency_mobile
                  })(
                    <Input maxLength={15} placeholder="请输入紧急联系电话" />
                  )}
                </FormItem>
              </Col>
            </Row>
          </Card>
          <Card className="mt1">
            <p>其他信息</p>
            <Row>
              <Col span={12}>
                <FormItem {...formItemLayout} label="民族" >
                  {getFieldDecorator('nation', {
                    initialValue: info.nation == 0 ? undefined : info.nation
                  })(
                    <Select placeholder="请选择民族">
                      {nation ? nation.map((item) => {
                        return <Option key={item.id} value={item.id.toString()}>{item.name}</Option>
                      }) : null}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label="政治面貌" >
                  {getFieldDecorator('face', {
                    initialValue: info.face == 0 ? undefined : info.face
                  })(
                    <Select placeholder="请选择政治面貌">
                      {face ? face.map((item) => {
                        return <Option key={item.id} value={item.id.toString()}>{item.name}</Option>
                      }) : null}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label="婚姻状况" >
                  {getFieldDecorator('marry_status', {
                    initialValue: info.marry_status == 0 ? undefined : info.marry_status
                  })(
                    <Select placeholder="请选择婚姻状况">
                      {marry_status ? marry_status.map((item) => {
                        return <Option key={item.id} value={item.id.toString()}>{item.name}</Option>
                      }) : null}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label="户口类型" >
                  {getFieldDecorator('household_type', {
                    initialValue: info.household_type == 0 ? undefined : info.household_type
                  })(
                    <Select placeholder="请选择户口类型">
                      {household_type ? household_type.map((item) => {
                        return <Option key={item.id} value={item.id.toString()}>{item.name}</Option>
                      }) : null}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label="户籍地址" >
                  {getFieldDecorator('household_area', {
                    initialValue: [info.household_province, info.household_city, info.household_area]
                  })(
                    < Cascader options={houseArea } placeholder = "请选择" changeOnSelect />
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label="详细地址" >
                  {getFieldDecorator('household_address', {
                    rules: [{ type: "string", pattern: /^.{0,30}$/, message: '格式错误（1-30位任意字符）' }],
                    initialValue: info.household_address
                  })(
                    <Input maxLength={30} placeholder="请输入详细地址" />
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label="暂住证号码" >
                  {getFieldDecorator('residence_number', {
                    rules: [{ type: "string", pattern: /^.{0,30}$/, message: '格式错误（1-30位任意字符）' }],
                    initialValue: info.residence_number
                  })(
                    <Input maxLength={30} placeholder="请输入暂住证号码" />
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label="居住类型" >
                  {getFieldDecorator('live_type', {
                    initialValue: info.live_type == 0 ? undefined : info.live_type
                  })(
                    <Select placeholder="请选择居住类型">
                      {live_type ? live_type.map((item) => {
                        return <Option key={item.id} value={item.id.toString()}>{item.name}</Option>
                      }) : null}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label="居住情况" >
                  {getFieldDecorator('live_detail', {
                    initialValue: info.live_detail == 0 ? undefined : info.live_detail
                  })(
                    <Select placeholder="请选择居住情况">
                      {live_detail ? live_detail.map((item) => {
                        return <Option key={item.id} value={item.id.toString()}>{item.name}</Option>
                      }) : null}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label="变动情况" >
                  {getFieldDecorator('change_detail', {
                    initialValue: info.change_detail == 0 ? undefined : info.change_detail
                  })(
                    <Select placeholder="请选择变动情况">
                      {change_detail ? change_detail.map((item) => {
                        return <Option key={item.id} value={item.id.toString()}>{item.name}</Option>
                      }) : null}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label="变动前地址" >
                  {getFieldDecorator('change_before', {
                    rules: [{ type: "string", pattern: /^.{0,30}$/, message: '格式错误（1-30位任意字符）' }],
                    initialValue: info.change_before
                  })(
                    <Input maxLength={30} placeholder="请输入变动前地址" />
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label="变动后地址" >
                  {getFieldDecorator('change_after', {
                    rules: [{ type: "string", pattern: /^.{0,30}$/, message: '格式错误（1-30位任意字符）' }],
                    initialValue: info.change_after
                  })(
                    <Input maxLength={30} placeholder="请输入变动后地址" />
                  )}
                </FormItem>
              </Col>
            </Row>
          </Card>
          <div style={{marginTop: 24}}>
            <FormItem wrapperCol={{ span: 12, offset: 3 }}>
              <Button type="primary" onClick={handleSubmit} loading={loading} className="mr1">确定</Button>
              <Button type="ghost" onClick={handleBack}>返回</Button>
            </FormItem>
          </div>
        </Form>
      </Card>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    ...state.ResidentsAddModel,
    loading: state.loading.models.ResidentsAddModel,
  };
}
export default connect(mapStateToProps)(Form.create()(ResidentsAdd));

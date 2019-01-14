import React from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';
import { Breadcrumb, Card, Select, Button, Input, Form, Row, Col, DatePicker } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
import Image from '../../components/Image/index';

function SignRentalHouse (props) {
  let { dispatch, form, SignRentalHouseModel, location } = props;
  let { contract_imgs, tenant_cardimg, rent_start_time, rent_end_time, tenant_cardimg_back, member_cardimg, member_cardimg_back, phoneNum, members, info, pay_period, uploadToken, price } = SignRentalHouseModel;
  const { getFieldDecorator } = form;
  let query = queryString.parse(location.search);

  function cardImgFn (val) {
    return val.length > 0 ? val[0].response.data.filepath : '';
  }

  function handSubmit (){
    form.validateFields((err, values) => {
      if (err) { return; }
      let urls = [];
      if (contract_imgs !== undefined && contract_imgs.length !== 0) {
        let imgLen = contract_imgs.length;
        for (let i = 0; i < imgLen; i++) {
          urls[i] = contract_imgs[i].response.data.filepath
        }
      }
      const tenant_cardimg1 = cardImgFn(tenant_cardimg);
      const tenant_cardimg_back1 = cardImgFn(tenant_cardimg_back);
      const member_cardimg1 = cardImgFn(member_cardimg);
      const member_cardimg_back1 = cardImgFn(member_cardimg_back);
      let name = '';
      let phone = phoneNum;
      members.map ((value, index) => {
        if (value.member_id === values.member_id) {
          name = value.name;
          if (phone === '') {
            phone = value.mobile;
          }
        }
      });
      const id = query.id;
      let formData = {
        contract_imgs: urls,
        member_card_no: values.member_card_no,
        member_cardimg: member_cardimg1,
        member_cardimg_back: member_cardimg_back1,
        member_id: values.member_id,
        member_mobile: phone,
        pay_period: values.pay_period,
        pledge_amount: values.pledge_amount,
        rent_end_time: rent_end_time,
        rent_start_time: rent_start_time,
        member_name: name,
        rent_reserve_id: id,
        rent_price: values.rent_price,
        tenant_card_no: values.tenant_card_no,
        tenant_cardimg: tenant_cardimg1,
        tenant_cardimg_back: tenant_cardimg_back1,
        tenant_mobile: values.tenant_mobile,
        tenant_name: values.tenant_name,
      };
      dispatch({
        type: 'SignRentalHouseModel/getRentReserveRentContract',
        payload: formData
      })
    })
  }

  function handleBack (e) {
    history.go(-1);
  }

  function changeName (val){
    members.map((value, index) => {
      if(value.member_id === val){
        dispatch({
          type: 'SignRentalHouseModel/concat',
          payload: {
            phoneNum: value.mobile
          }
        })
      }
    })
  }

  function changePay (e){
    let rent_price = form.getFieldValue('rent_price');
    let pledge_amount = form.getFieldValue('pledge_amount');
    let newPrice = '';
    if (rent_price !== '' && pledge_amount !== undefined) {
      newPrice = parseFloat(rent_price * e) + parseFloat(pledge_amount) + parseFloat(0.3 * rent_price);
      dispatch({
        type: 'SignRentalHouseModel/concat',
        payload: {
          price: newPrice.toFixed(2)
        }
      })
    }
  }

  function changeAmount (e){
    let value = e.target.value;
    let pay_period = form.getFieldValue('pay_period');
    let rent_price = form.getFieldValue('rent_price');
    // let pledge_amount = form.getFieldValue('pledge_amount');
    let newPrice = '';
    if (pay_period !== undefined && rent_price !== '' && value !== '') {
      newPrice = parseFloat(parseFloat(rent_price) * pay_period) + parseFloat(value) + parseFloat(0.3 * rent_price);
      dispatch({
        type: 'SignRentalHouseModel/concat',
        payload: {
          price: newPrice.toFixed(2)
        }
      })
    }
  }

  function changePrice (e) {
    let val = e.target.value;
    let pay_period = form.getFieldValue('pay_period');
    // let rent_price = form.getFieldValue('rent_price');
    let pledge_amount = form.getFieldValue('pledge_amount');
    let newPrice = '';
    if (pay_period !== undefined && pledge_amount !== undefined && val !== '') {
      newPrice = parseFloat(val * pay_period) + parseFloat(pledge_amount) + parseFloat(0.3 * val);
      dispatch({
        type: 'SignRentalHouseModel/concat',
        payload: {
          price: newPrice.toFixed(2)
        }
      })
    }
  }

  function downLoadContract () {
    dispatch({
      type: 'SignRentalHouseModel/getDownContact',
      payload: {}
    })
  }

  function handleImage (id, e) {
    let imgData = {};
    imgData[id] = e;
    form.setFieldsValue(imgData);
    dispatch({
      type: 'SignRentalHouseModel/concat',
      payload: imgData
    })
  }

  //时间控件onchange
  function dataChange (date, dateString) {
    dispatch({
      type: 'SignRentalHouseModel/concat',
      payload: {
        rent_start_time: dateString[0],
        rent_end_time: dateString[1]
      }
    })
  }
  const formItemLayout = {
    labelCol: { span: 2 },
    wrapperCol: { span: 8 }
  };
  const formItemLayout2 = {
    labelCol: { span: 6 },
    wrapperCol: { span: 12 }
  };
  const formItemLayout3 = {
    labelCol: { span: 6 },
    wrapperCol: { span: 13 }
  };
  let styleList1 = {textAlign: 'right', marginRight: '10px', marginBottom: '10px'};
  return (
    <div className="page-content">
      <Breadcrumb separator=">">
        <Breadcrumb.Item>租房管理</Breadcrumb.Item>
        <Breadcrumb.Item><a href="#/orderRoomManagement">预约看房管理</a></Breadcrumb.Item>
        <Breadcrumb.Item>签约</Breadcrumb.Item>
      </Breadcrumb>
      <Card className="section">
        <Form>
          <Row justify="start">
            <Col span={2}>
              <p style={styleList1}>房屋信息:</p>
            </Col>
            <Col span={5}>
              <p>{info.address}</p>
            </Col>
          </Row>
          <Row justify="start">
            <Col span={2}>
              <p style={styleList1}>房屋面积:</p>
            </Col>
            <Col span={5}>
              <p>{info.house_space ? `${info.house_space}㎡` : ''}</p>
            </Col>
          </Row>
          <FormItem {...formItemLayout} label="房屋租金">
            {getFieldDecorator('rent_price',
              {initialValue: info.expired_rent_price,
                rules: [{
                  type: 'string',
                  pattern: /^[0-9]+(.[0-9]{1,2})?$/,
                  required: true,
                  message: '请输入房屋租金(正整数或小数点后保留两位)'
                }]})(
              <Input placeholder="请输入房屋租金" addonAfter="元/月" onChange={changePrice}/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="押金">
            {getFieldDecorator('pledge_amount',
              {rules: [{
                type: 'string',
                pattern: /^[0-9]+(.[0-9]{1,2})?$/,
                required: true,
                message: '请输入押金(正整数或小数点后保留两位)'
              }]})(
              <Input placeholder="请输入押金" addonAfter="元" onChange={changeAmount}/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="支付方式">
            {getFieldDecorator('pay_period', {rules: [{required: true, message: '请选择支付方式'}]})(
              <Select placeholder="请选择支付方式" onChange={changePay} >
                {pay_period.map((value, index) => {
                  return (
                    <Option key={index} value={`${value.key}`}>
                      {value.value}
                    </Option>
                  )
                })}
              </Select>
            )}
          </FormItem>
          <FormItem label="租房周期" {...formItemLayout} required>
            {getFieldDecorator('rent_time', {rules: [{required: true, message: '请选择租房周期'}]})(
              <RangePicker placeholder={['开始时间', '结束时间' ]} onChange={dataChange} />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="本期支付金额">
            {getFieldDecorator('start_ton', {initialValue: Object.is(price, NaN) ? '' : price })(
              <Input placeholder="请输入本期支付金额" disabled addonAfter="元" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="上传合同" required>
            {getFieldDecorator('contract_imgs', {rules: [{required: true, message: '请上传合同照片'}]})(
              <Image token={uploadToken} handleImage={handleImage} size={5}/>
            )}
            <a onClick={downLoadContract}>下载合同模板</a>
          </FormItem>
          <Row>
            <Col span={9}>
              <FormItem {...formItemLayout3} label="租客姓名">
                {getFieldDecorator('tenant_name',
                  {initialValue: info.reserve_name,
                    rules:[{
                      type: "string",
                      pattern: /^[\u4e00-\u9fa5]+$/,
                      required: true,
                      message: '请输入租客姓名(10个字以内汉字)'
                    }]})(
                  <Input placeholder="请输入租客姓名" />
                )}
              </FormItem>
              <FormItem {...formItemLayout3} label="联系电话">
                {getFieldDecorator('tenant_mobile',
                  {initialValue: info.reserve_mobile,
                    rules:[{
                      type: "string",
                      pattern:/^1[3|4|5|7|8|9][0-9]{9}$/,
                      required: true,
                      message: '请输入联系电话'
                    }]})(
                  <Input placeholder="请输入联系电话" />
                )}
              </FormItem>
              <FormItem {...formItemLayout3} label="身份证号码">
                {getFieldDecorator('tenant_card_no',
                  {rules:[{
                    type: "string",
                    pattern: /^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/,
                    required: true,
                    message: '请输入身份证号码'
                  }]})(
                  <Input placeholder="请输入身份证号码" />
                )}
              </FormItem>
              <FormItem {...formItemLayout2} label="身份证(正面)" required>
                {getFieldDecorator('tenant_cardimg', {rules: [{required: true, message: '请上传身份证(正面)照片'}]})(
                  <Image token={uploadToken} handleImage={handleImage} size={1} id="tenant_cardimg" />
                )}
              </FormItem>
              <FormItem {...formItemLayout2} label="身份证(反面)" required>
                {getFieldDecorator('tenant_cardimg_back', {rules: [{required: true, message: '请上传身份证(反面)照片'}]})(
                  <Image token={uploadToken} handleImage={handleImage} size={1} id="tenant_cardimg_back" />
                )}
              </FormItem>
            </Col>
            <Col span={12} style={{borderLeft: '1px dashed #ddd'}}>
              <FormItem {...formItemLayout2} label="业主姓名">
                {getFieldDecorator('member_id',
                  {initialValue: info.member_id, rules: [{required: true, message: '请选择业主姓名'}]})(
                  <Select placeholder="请选择业主姓名" onChange={changeName} >
                    {members.map((value, index) => {
                      return (
                        <Option key={index} value={value.member_id}>
                          {value.name}
                        </Option>
                      )
                    })}
                  </Select>
                )}
              </FormItem>
              {
                phoneNum === ''
                  ? <FormItem {...formItemLayout2} label="业主电话" required>
                    {getFieldDecorator('member_mobile',{initialValue: info.member_mobile})(
                      <Input placeholder="请输入业主姓名" disabled />
                    )}
                  </FormItem>
                  : <FormItem {...formItemLayout2} label="业主电话" required>
                    {getFieldDecorator('member_mobile',{initialValue: phoneNum})(
                      <Input placeholder="请输入业主姓名" disabled />
                    )}
                  </FormItem>
              }
              <FormItem {...formItemLayout2} label="身份证号码">
                {getFieldDecorator('member_card_no',
                  {rules: [{
                    type: "string",
                    pattern: /^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/,
                    required: true,
                    message: '请输入身份证号码'
                  }]})(
                  <Input placeholder="请输入身份证号码" />
                )}
              </FormItem>
              <FormItem {...formItemLayout2} label="身份证(正面)" required>
                {getFieldDecorator('member_cardimg', {rules: [{required: true, message: '请上传身份证(正面)照片'}]})(
                  <Image token={uploadToken} handleImage={handleImage} size={1} id="member_cardimg" />
                )}
              </FormItem>
              <FormItem {...formItemLayout2} label="身份证(反面)" required>
                {getFieldDecorator('member_cardimg_back', {rules: [{required: true, message: '请上传身份证(反面)照片'}]})(
                  <Image token={uploadToken} handleImage={handleImage} size={1} id="member_cardimg_back" />
                )}
              </FormItem>
            </Col>
          </Row>
          <FormItem wrapperCol={{ span: 12, offset: 2 }}>
            <Button type="ghost" onClick={handleBack}  className="mr1">返回</Button>
            <Button type="primary" onClick={handSubmit}>发布</Button>
          </FormItem>
        </Form>
      </Card>
    </div>
  )
}
export default connect(state => {
  return {
    SignRentalHouseModel: state.SignRentalHouseModel,
  }
})(Form.create({})(SignRentalHouse));

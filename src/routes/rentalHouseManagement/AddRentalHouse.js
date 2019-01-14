import React from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';
import { Breadcrumb, Card, Select, Button, Input, Form, Radio, message } from 'antd';
import Image from '../../components/Image/index';
const FormItem = Form.Item;
const Option = Select.Option
const RadioGroup = Radio.Group;
function AddRentalHouse(props) {
  const { AddRentalHouseModel, layout, dispatch, form, location } = props;
  const { getFieldDecorator } = form;
  const { groupData, buildingData, unitData, roomData, ownerInfo, labels, phoneNum, roomId, showRoom,
    pay_way, decorate_degree, space, detailInfo, group, building, unit, room, member_id, params, hasSubmit } = AddRentalHouseModel;
  let currentId = undefined;
  let query = queryString.parse(location.search);
  if (query.id) {
    currentId = query.id;
  }
  /*
  * 重置房屋面积，业主电话，业主姓名
  * */
  function resetInfos() {
    dispatch({
      type: 'concat',
      payload: {
        ownerInfo: [],
        phoneNum: '',
        space: '',
      }
    });
  }
  /*
  * 监听期/苑/区 幢 单元 室 级联列表
  * param {String} mark
  * param {String} val
  * */
  function selectChange(mark, val) {
    params[mark] = val;
    if (mark === 'group') {
      form.resetFields(['unit', 'room', 'building', 'house_space', 'member_id']);
      resetInfos();
      dispatch({
        type: 'AddRentalHouseModel/concat',
        payload: {
          buildingData: [],
          unitData: [],
          roomData: []
        }
      });
      dispatch({
        type: 'AddRentalHouseModel/getBuildingList',
        payload: params
      });
    } else if (mark === 'building') {
      form.resetFields(['unit', 'room', 'house_space', 'member_id']);
      resetInfos();
      dispatch({
        type: 'AddRentalHouseModel/concat',
        payload: {
          unitData: [],
          roomData: []
        }
      });
      dispatch({
        type: 'AddRentalHouseModel/getUnitList',
        payload: params
      });
    } else if (mark === 'unit') {
      form.resetFields(['room', 'house_space', 'member_id']);
      resetInfos();
      dispatch({
        type: 'AddRentalHouseModel/concat',
        payload: {
          roomData: []
        }
      });
      dispatch({
        type: 'AddRentalHouseModel/getRoomList',
        payload: params
      });
    } else if (mark === 'room') {
      if (params.group !== '' && params.building !== '' && params.unit !== '') {
        let tarData = {
          group: params.group,
          building: params.building,
          unit: params.unit,
          room: params.room,
          community_id: layout.communityId
        };
        dispatch({
          type: 'AddRentalHouseModel/getHouseSourceGetOwner',
          payload: tarData
        });
      }
    }
  }
  /*
  * 监听业主姓名变化，同步业主电话
  * param {String} val
  * */
  function changeName(val) {
    ownerInfo.map((value, index) => {
      if (value.member_id === val) {
        dispatch({
          type: 'AddRentalHouseModel/concat',
          payload: { phoneNum: value.mobile }
        });
      }
    });
  }
  /*
  * 切换出租类型
  * param {String} val
  * */
  function roomType(val) {
    if (val.target.value == 2) {
      dispatch({
        type: 'AddRentalHouseModel/concat',
        payload: { showRoom: true }
      });
    } else if (val.target.value == 1) {
      dispatch({
        type: 'AddRentalHouseModel/concat',
        payload: { showRoom: false }
      });
    }
  }
  function handImgChange(id, fileList) {
    form.setFieldsValue({ imgs: fileList })
    if (fileList.length > 9) {
      dispatch({
        type: 'AddRentalHouseModel/concat',
        payload: {
          isUpload: false
        }
      });
    } else {
      dispatch({
        type: 'AddRentalHouseModel/concat',
        payload: {
          isUpload: true
        }
      });
    }
  }

  function normFile(e) {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  }

  function handleBack(e) {
    history.go(-1);
  }

  function handleSubmit() {
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      let urls = [];
      let imgsLen = values.imgs && values.imgs.length;
      if (values.imgs !== undefined && imgsLen !== 0) {
        for (let i = 0; i < imgsLen; i++) {
          if (values.imgs[i].response) {
            urls[i] = values.imgs[i].response.data.filepath;
          } else {
            urls[i] = values.imgs[i].url;
          }
        }
      }
      if (parseInt(values.floor_total) < parseInt(values.floor_level)) {
        message.info("总楼层数不能小于楼层数！")
        return;
      }
      let formData = {
        community_id: layout.communityId,
        contact_mobile: phoneNum,
        decorate_degree: values.decorate_degree,
        expired_rent_price: values.expired_rent_price,
        floor_level: values.floor_level,
        floor_total: values.floor_total,
        hall_num: values.hall_num,
        house_space: values.house_space,
        imgs: urls,
        kitchen_num: values.kitchen_num,
        labels: values.labels,
        member_id: values.member_id,
        pay_way: values.pay_way,
        rent_desc: values.rent_desc,
        rent_title: values.rent_title,
        rent_way: values.rent_way,
        room_id: roomId,
        room_num: values.room_num,
        single_no: values.single_no,
        toilet_num: values.toilet_num,
        rent_ref: 2
      };
      if (currentId) {
        formData.rent_id = currentId;
        dispatch({
          type: 'AddRentalHouseModel/getHouseSourceEditRent',
          payload: formData,
          callback: () => {
            form.resetFields();
            window.location.href = '#/rentalHouseManagement';
          },
          err: () => {
          }
        });
      } else {
        dispatch({
          type: 'AddRentalHouseModel/getHouseSourceAddRent',
          payload: formData,
          callback: () => {
            form.resetFields();
            window.location.href = '#/rentalHouseManagement';
          },
          err: () => {
          }
        });
      }
    })
  }
  const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 17 },
    style: { maxWidth: '700px' }
  };
  const formItemLayout2 = {
    labelCol: { span: 4 },
    wrapperCol: { span: 10 },
    style: { maxWidth: '700px' }
  };
  let labs = [];
  if (detailInfo) {
    if (detailInfo.labels) {
      detailInfo.labels.map((value, index) => {
        labs.push(value.id);
      });
    }
  }
  // const uploadButton = (
  //   <div>
  //     <Icon type='plus' />
  //     <div className='ant-upload-text'>选择图片</div>
  //   </div>
  // )
  return (
    <div className="page-content">
      <Breadcrumb separator=">">
        <Breadcrumb.Item>租房管理</Breadcrumb.Item>
        <Breadcrumb.Item><a href="#/rentalHouseManagement">租房房源管理</a></Breadcrumb.Item>
        <Breadcrumb.Item>{currentId ? '编辑' : '新增'}房源</Breadcrumb.Item>
      </Breadcrumb>
      <Card className="section">
        <Form>
          <FormItem label="期/苑/区" {...formItemLayout2}>
            {getFieldDecorator('group', { initialValue: group ? group : undefined, rules: [{ required: true, message: '请选择期/苑/区' }] })(
              <Select placeholder="请选择期/苑/区" onChange={(val) => selectChange('group', val)} >
                {groupData.map((value, index) => {
                  return (
                    <Option key={index} value={value.name}>{value.name}</Option>
                  )
                })
                }
              </Select>
            )}
          </FormItem>
          <FormItem label="幢" {...formItemLayout2}>
            {getFieldDecorator('building', { initialValue: building ? building : undefined, rules: [{ required: true, message: '请选择幢' }] })(
              <Select placeholder="请选择幢" onChange={(val) => selectChange('building', val)}>
                {buildingData.map((value, index) => {
                  return (
                    <Option key={index} value={value.name}>{value.name}</Option>
                  )
                })
                }
              </Select>
            )}
          </FormItem>
          <FormItem label="单元" {...formItemLayout2}>
            {getFieldDecorator('unit', { initialValue: unit ? unit : undefined, rules: [{ required: true, message: '请选择单元' }] })(
              <Select placeholder="请选择单元" onChange={(val) => selectChange('unit', val)}>
                {unitData.map((value, index) => {
                  return (
                    <Option key={index} value={value.name}>{value.name}</Option>
                  )
                })
                }
              </Select>
            )}
          </FormItem>
          <FormItem label="室" {...formItemLayout2}>
            {getFieldDecorator('room', { initialValue: room ? room : undefined, rules: [{ required: true, message: '请选择室' }] })(
              <Select placeholder="请选择室" onChange={(val) => selectChange('room', val)}>
                {roomData.map((value, index) => {
                  return (
                    <Option key={index} value={value.name}>{value.name}</Option>
                  )
                })
                }
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout2} label="房屋面积" >
            {getFieldDecorator('house_space', {
              initialValue: space,
              rules: [{
                type: 'string',
                pattern: /(^[1-9]([0-9]){1,4}\.\d{1,2}$)|(^[1-9]{1,5}\.\d{1,2}$)|(^0\.\d[1-9]$)|(^0\.[1-9]\d?$)|(^[1-9]{1,5}$)|(^[1-9]([0-9]){1,4}$)/,
                required: true,
                message: '请输入房屋面积(整数5位以内,小数点后保留两位)'
              }]
            })(
              <Input placeholder="请输入房屋面积" addonAfter="㎡" />
            )}
          </FormItem>
          <FormItem label="室" {...formItemLayout2}>
            {getFieldDecorator('room_num', {
              initialValue: detailInfo.room_num,
              rules: [{
                required: true,
                message: '请输入室'
              }, { pattern: /^[1-9]([0-9]){0,9}$/, message: '输入的室格式有误' }]
            })(
              <Input placeholder="请输入室" addonAfter="室" />
            )}
          </FormItem>
          <FormItem label="厅" {...formItemLayout2}>
            {getFieldDecorator('hall_num', {
              initialValue: detailInfo.hall_num,
              rules: [{
                type: 'string',
                required: true,
                message: '请输入厅'
              }, { pattern: /^[0-9]{1,10}$/, message: '输入的厅格式有误' }]
            })(
              <Input placeholder="请输入厅" addonAfter="厅" />
            )}
          </FormItem>
          <FormItem label="厨" {...formItemLayout2}>
            {getFieldDecorator('kitchen_num', {
              initialValue: detailInfo.kitchen_num,
              rules: [{
                type: 'string',
                pattern: /^[0-9]{1,10}$/,
                required: true,
                message: '请输入厨'
              }]
            })(
              <Input placeholder="请输入厨" addonAfter="厨" />
            )}
          </FormItem>
          <FormItem label="卫" {...formItemLayout2}>
            {getFieldDecorator('toilet_num', {
              initialValue: detailInfo.toilet_num,
              rules: [{
                type: 'string',
                pattern: /^[0-9]{1,10}$/,
                required: true,
                message: '请输入卫'
              }]
            })(
              <Input placeholder="请输入卫" addonAfter="卫" />
            )}
          </FormItem>
          <FormItem label="楼层" {...formItemLayout2}>
            {getFieldDecorator('floor_level', {
              initialValue: detailInfo.floor_level,
              rules: [{
                type: 'string',
                pattern: /^[1-9]([0-9]){0,9}$/,
                required: true,
                message: '请输入所在楼层'
              }]
            })(
              <Input placeholder="请输入第几层" addonBefore="第" addonAfter="层" />
            )}
          </FormItem>
          <FormItem label="总层数" {...formItemLayout2}>
            {getFieldDecorator('floor_total', {
              initialValue: detailInfo.floor_total,
              rules: [{
                type: 'string',
                pattern: /^[1-9]\d{0,10}$/,
                required: true,
                message: '请输入总楼层大于0'
              }]
            })(
              <Input placeholder="请输入总层数" addonAfter="层" />
            )}
          </FormItem>
          <FormItem {...formItemLayout2} label="出租类型" required>
            {getFieldDecorator('rent_way', {
              initialValue: detailInfo.rent_way ? detailInfo.rent_way : '1',
              rules: [{ required: true, message: '请选择出租类型' }]
            })(
              <RadioGroup onChange={roomType}>
                <Radio value="1">整租</Radio>
                <Radio value="2">单间</Radio>
              </RadioGroup>
            )}
          </FormItem>
          {showRoom === true
            ? <FormItem {...formItemLayout2} label="房号" required>
              {getFieldDecorator('single_no', {
                initialValue: detailInfo.single_no,
                rules: [{
                  type: 'string',
                  pattern: /^[0-9]{1,10}$/,
                  required: true,
                  message: '请输入房号(0或正整数)'
                }]
              })(
                <Input placeholder="请输入房号" addonAfter="号" />
              )}
            </FormItem>
            : ''}
          <FormItem {...formItemLayout2} label="期望租金">
            {getFieldDecorator('expired_rent_price', {
              initialValue: detailInfo.expired_rent_price,
              rules: [{
                type: 'string',
                pattern: /(^[1-9]([0-9]){1,4}\.\d{1,2}$)|(^[1-9]{1,5}\.\d{1,2}$)|(^0\.\d[1-9]$)|(^0\.[1-9]\d?$)|(^[1-9]{1,5}$)|(^[1-9]([0-9]){1,4}$)/,
                required: true,
                message: '请输入期望租金(整数5位以内,小数点后保留两位)'
              }]
            })(
              <Input placeholder="请输入期望租金" addonAfter="元/月" />
            )}
          </FormItem>
          <FormItem {...formItemLayout2} label="装修程度">
            {getFieldDecorator('decorate_degree', {
              initialValue: detailInfo.decorate_degree ? detailInfo.decorate_degree : undefined,
              rules: [{ required: true, message: '请选择装修程度' }]
            })(
              <Select placeholder="请选择装修程度"  >
                {decorate_degree.map((value, index) => {
                  return <Option key={index} value={`${value.key}`}>{value.value}</Option>
                })}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="房屋图片">
            {getFieldDecorator('imgs', {
              rules: [{ required: true, message: '请上传房屋图片!' }],
              valuePropName: 'fileList',
              initialValue: detailInfo.imgs,
              normalize: normFile,
            })(
              <Image file={detailInfo !== '' ? detailInfo.imgs : []} id="buildImgs" handleImage={handImgChange} size={10} />
            )}
          </FormItem>
          <FormItem {...formItemLayout2} label="标题">
            {getFieldDecorator('rent_title', {
              initialValue: detailInfo.rent_title,
              rules: [{
                type: 'string',
                // pattern: /^[\u4e00-\u9fa5]{1,30}$/,
                required: true,
                message: '请输入文字30个以内'
              }]
            })(
              <Input placeholder="请输入标题" maxLength="30"/>
            )}
          </FormItem>
          <FormItem {...formItemLayout2} label="房屋描述">
            {getFieldDecorator('rent_desc', {
              initialValue: detailInfo.rent_desc,
              rules: [{
                type: 'string',
                pattern: /^[^ ]{5,1500}$/,
                required: true,
                message: '请输入房屋描述（5-1500字）'
              }]
            })(
              <Input type="textarea" rows={4} placeholder="请输入房屋描述" />
            )}
          </FormItem>
          <FormItem {...formItemLayout2} label="周边配套">
            {getFieldDecorator('labels', {
              initialValue: labs,
              rules: [{
                required: false,
                message: '请选择房屋标签'
              }]
            })(
              <Select placeholder="请选择房屋标签" mode="tags" >
                {labels.map((value, index) => {
                  return (
                    <Option key={index} value={value.id}>{value.name}</Option>
                  )
                })}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout2} label="支付方式">
            {getFieldDecorator('pay_way', {
              initialValue: detailInfo.pay_way ? detailInfo.pay_way : undefined,
              rules: [{ required: true, message: '请选择支付方式' }]
            })(<Select placeholder="请选择支付方式"  >
              {pay_way.map((value, index) => {
                return (
                  <Option key={index} value={`${value.key}`}>{value.value}</Option>
                )
              })}
            </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout2} label="业主姓名">
            {getFieldDecorator('member_id', {
              initialValue: member_id,
              rules: [{ required: true, message: '请选择业主姓名' }]
            })(<Select placeholder="请选择业主姓名" onChange={changeName} >
              {ownerInfo.map((value, index) => {
                return (
                  <Option key={index} value={value.member_id}>{value.name}</Option>
                )
              })}
            </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout2} label="业主电话" required>
            {getFieldDecorator('phone', { initialValue: phoneNum })(
              <Input placeholder="请输入业主电话" disabled />
            )}
          </FormItem>
          <FormItem wrapperCol={{ span: 12, offset: 4 }} style={{ maxWidth: '700px' }}>
            <Button type="ghost" onClick={handleBack} className="mr1">返回</Button>
            <Button type="primary" onClick={handleSubmit} loading={hasSubmit}>发布</Button>
          </FormItem>
        </Form>
      </Card>
    </div>
  )
}
export default connect(state => {
  return {
    AddRentalHouseModel: state.AddRentalHouseModel,
    layout: state.MainLayout
  }
})(Form.create({})(AddRentalHouse));

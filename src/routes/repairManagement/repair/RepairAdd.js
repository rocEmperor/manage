import React from 'react';
import { connect } from 'dva';
import { Form, Breadcrumb, Row, Col, Cascader, Select, Input, DatePicker, Card, Button } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import Image from '../../../components/Image/index';
import { checkPhone } from '../../../utils/util';

function RepairAdd(props) {
  const { form, dispatch, loading, type, fromList, groupData, buildingData, unitData, roomData, types, query, community_id } = props;
  const { getFieldDecorator } = form;

  function typeChange(val) {
    type.map((value, index) => {
      if (value.value == val[0]) {
        if (value.relate == 1) {
          dispatch({
            type: 'RepairAdd/concat',
            payload: { types: false }
          })
        } else {
          dispatch({
            type: 'RepairAdd/concat',
            payload: { types: true }
          })
        }
      }
    })
  }
  function disabledDate(current) {
    // return current && current.valueOf() < Date.now() - 8640000;
  }
  //提交
  function handleSubmit(e) {
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      //时间
      if (values.date) {
        values.expired_repair_time = values.date.format('YYYY-MM-DD');
        delete values.date;
      } else {
        delete values.date;
      }
      //图片
      let repair_imgs = [];
      let imgsLen = values.repair_imgs && values.repair_imgs.length;
      if (values.repair_imgs !== undefined && imgsLen !== 0) {
        for (let i = 0; i < imgsLen; i++) {
          if (values.repair_imgs[i].response) {
            repair_imgs[i] = values.repair_imgs[i].response.data.filepath
          } else {
            repair_imgs[i] = values.repair_imgs[i].url
          }
        }
      }
      dispatch({
        type: 'RepairAdd/getAddRepair',
        payload: { ...values, community_id, repair_imgs }
      });
    });
  }
  //返回上一页
  function handleBack(e) {
    history.go(-1);
  }
  // 各搜索项列表获取
  function selectChange(mark, val) {
    query[mark] = val;
    if (mark == 'group') {
      form.resetFields(['building', 'unit', 'room']);
      dispatch({
        type: 'RepairAdd/concat',
        payload: {
          unitData: [],
          roomData: []
        }
      })
      dispatch({
        type: 'RepairAdd/getBuildings',
        payload: query
      })
    } else if (mark == 'building') {
      form.resetFields(['unit', 'room']);
      dispatch({
        type: 'RepairAdd/concat',
        payload: {
          roomData: []
        }
      })
      dispatch({
        type: 'RepairAdd/getUnits',
        payload: query
      })
    } else if (mark == 'unit') {
      form.resetFields(['room']);
      dispatch({
        type: 'RepairAdd/getRooms',
        payload: query
      })
    }
  }
  //图片上传
  function handImgChange(id, fileList) {
    form.setFieldsValue({ repair_imgs: fileList })
  }
  function normFile(e) {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  }

  return (<div>
    <Breadcrumb separator=">">
      <Breadcrumb.Item>报修管理</Breadcrumb.Item>
      <Breadcrumb.Item><a href="#/repair">报修管理</a></Breadcrumb.Item>
      <Breadcrumb.Item>新增</Breadcrumb.Item>
    </Breadcrumb>
    <Card>
      <Form layout="inline">
        <Row>
          <Col sm={24} md={24} lg={24} style={{ marginBottom: "24px" }} >
            <FormItem label="订单类型">
              {getFieldDecorator('repair_type', { rules: [{ required: true, message: "请选择" }], onChange: typeChange.bind(this) })(
                <Cascader options={type} placeholder="请选择" style={{ width: 260 }} />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col sm={24} md={24} lg={24} style={{ marginBottom: "24px" }} >
            <FormItem label="报修来源" >
              {getFieldDecorator('repair_from', { rules: [{ required: true, message: "请选择" }], })(
                <Select placeholder="请选择" style={{ width: 160 }}>
                  {fromList.map((value, index) => {
                    return <Option key={index} value={value.key.toString()}>{value.value}</Option>
                  })}
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          {!types ?
            <Col sm={24} md={24} lg={24} style={{ marginBottom: "24px" }}>
              <Form.Item label="报修地址：">
                {getFieldDecorator('group', { rules: [{ required: true, message: "请选择" }], onChange: selectChange.bind(this, 'group') })(<Select style={{ width: 120 }} placeholder="苑\期\区" notFoundContent="没有数据">
                  {groupData.map((value, index) => {
                    return <Option key={index} value={value.name}>{value.name}</Option>
                  })}
                </Select>)}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator('building', { rules: [{ required: true, message: "请选择" }], onChange: selectChange.bind(this, 'building') })(<Select style={{ width: 80 }} placeholder="幢" notFoundContent="没有数据">
                  {buildingData.map((value, index) => {
                    return <Option key={index} value={value.name}>{value.name}</Option>
                  })}
                </Select>)}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator('unit', { rules: [{ required: true, message: "请选择" }], onChange: selectChange.bind(this, 'unit') })(<Select style={{ width: 80 }} placeholder="单元" notFoundContent="没有数据">
                  {unitData.map((value, index) => {
                    return <Option key={index} value={value.name}>{value.name}</Option>
                  })}
                </Select>)}
              </Form.Item>
              <Form.Item >
                {getFieldDecorator('room', { rules: [{ required: true, message: "请选择" }] })(<Select style={{ width: 80 }} placeholder="室" allowClear notFoundContent="没有数据">
                  {roomData.map((value, index) => {
                    return <Option key={index} value={value.name}>{value.name}</Option>
                  })}
                </Select>)}
              </Form.Item>
            </Col> : ""}
          <Col sm={24} md={24} lg={24} style={{ marginBottom: "24px" }} >
            <FormItem label="报修内容：">
              {getFieldDecorator('repair_content', { rules: [{ required: true, message: "请输入报修内容" }], })(
                <Input type="textarea" style={{ width: 390 }} maxLength={200} rows={4} />
              )}
            </FormItem>
          </Col>
          <Col sm={24} md={24} lg={24} style={{ marginBottom: "24px" }} >
            <FormItem style={{ marginLeft: 72 }} required>
              {getFieldDecorator('repair_imgs', {
                valuePropName: 'fileList',
                normalize: normFile,
              })(
                <Image handleImage={handImgChange} size={5} />
              )}
            </FormItem>
          </Col>
          <Col sm={24} md={24} lg={24} style={{ marginBottom: "24px" }} >
            <FormItem label="期望上门时间：">
              {getFieldDecorator('date', { rules: [{ required: true, message: "请选择" }], })(
                <DatePicker
                  showToday={false}
                  format="YYYY-MM-DD"
                  placeholder="请选择"
                  disabledDate={disabledDate.bind(this)}
                />
              )}
            </FormItem>
            <FormItem >
              {getFieldDecorator('expired_repair_type', { rules: [{ required: true, message: "请选择" }], })(
                <Select style={{ width: 80 }} placeholder="请选择">
                  <Option value="1">上午</Option>
                  <Option value="2">下午</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col sm={24} md={24} lg={24} style={{ marginBottom: "24px" }} >
            <FormItem label="联系电话：" >
              {getFieldDecorator('contact_mobile', { rules: [{ required: true, message: '请输入手机号码' }, { validator: checkPhone.bind(this), message: '请输入手机号码！' }], })(
                <Input placeholder="请输入11位手机号" />
              )}
            </FormItem>
          </Col>
        </Row>
        <Form.Item wrapperCol={{ span: 24, offset: 11 }}>
          <Button type="primary" onClick={handleSubmit} loading={loading}>提交</Button>
          <Button className="ml1" onClick={handleBack}>返回</Button>
        </Form.Item>
      </Form>
    </Card>
  </div>)
}
function mapStateToProps(state) {
  return {
    ...state.RepairAdd,
    loading: state.loading.models.RepairAdd
  };
}
export default connect(mapStateToProps)(Form.create()(RepairAdd));
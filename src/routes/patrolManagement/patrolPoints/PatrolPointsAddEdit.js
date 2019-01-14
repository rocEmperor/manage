import React from 'react';
import { connect } from 'dva';
import { Form, Breadcrumb, Card, Input, Select, Button } from 'antd';
const Option = Select.Option;
import Map from '../../../components/Map/index.js';

function PatrolPointsAddEdit(props) {
  let { dispatch, form, id, pointsdetail, positionType, photoType, loading, show, cityName, modalType, location_name, community_id, map } = props;
  const { getFieldDecorator, validateFields } = form;
  //布局
  const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 14 },
    style: { maxWidth: '600px' }
  }
  //提交
  function handleSubmit(e) {
    validateFields((err, values) => {
      if (err) {
        return;
      }
      if (id) {//编辑
        dispatch({
          type: 'PatrolPointsAddEdit/getPointsEdit',
          payload: { ...values, community_id, lon: map.split(",")["0"], lat: map.split(",")["1"], location_name, id }
        });
      } else {//新增
        dispatch({
          type: 'PatrolPointsAddEdit/getPointsAdd',
          payload: { ...values, community_id, lon: map.split(",")["0"], lat: map.split(",")["1"], location_name }
        });
      }
    });
  }
  //地图显示
  function handleClick(e) {
    dispatch({
      type: 'PatrolPointsAddEdit/concat',
      payload: { show: Math.random() }
    });
  }
  function handleMap(e, location_name) {
    dispatch({
      type: 'PatrolPointsAddEdit/concat',
      payload: {
        map: e,
        location_name: location_name,
        changeMap: true,
      }
    });
  }
  //返回上一页
  function handleBack(e) {
    history.go(-1);
  }
  //选择
  function selectChange(name, value) {
    if (value == 2) {
      dispatch({
        type: 'PatrolPointsAddEdit/concat',
        payload: {
          location_name: "",
          map: ""
        }
      });
    }
    dispatch({
      type: 'PatrolPointsAddEdit/concat',
      payload: { modalType: value }
    });
  }
  return (<div>
    <Breadcrumb separator="/">
      <Breadcrumb.Item>巡更管理</Breadcrumb.Item>
      <Breadcrumb.Item><a href="#/patrolPoints">巡更点管理</a></Breadcrumb.Item>
      <Breadcrumb.Item>{id ? '编辑' : '新增'}</Breadcrumb.Item>
    </Breadcrumb>
    <Card>
      <Form>
        <Map type={show} data={'杭州市|一号线'} cityName={cityName} handleMap={handleMap} />
        <Form.Item label="巡更点名称" {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: pointsdetail.name,
            rules: [{ required: true, message: '请输入巡更点名称!' }, { pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/, message: "输入格式有误!" }],
          })(
            <Input type="text" placeholder="请输入巡更点名称" maxLength={10} />
          )}
        </Form.Item>
        <Form.Item label="定位打卡" {...formItemLayout}>
          {getFieldDecorator('need_location', {
            initialValue: pointsdetail.need_location,
            rules: [{ required: true, message: '请选择定位打卡!' }],
          })(
            <Select placeholder="请选择" onChange={selectChange.bind(this, "location")}>
              {positionType ? positionType.map((value, index) => { return <Option key={index} value={value.key}>{value.value}</Option> }) : null}
            </Select>
          )}
        </Form.Item>
        {modalType == "1" ?
          <Form.Item label="地理位置" {...formItemLayout}>
            {getFieldDecorator('location', {
            })(
              <Button type="primary" onClick={handleClick}>获取经纬度</Button>
            )}
            <div>{location_name ? location_name : null}</div>
          </Form.Item>
          : ''}
        <Form.Item label="是否需要拍照" {...formItemLayout}>
          {getFieldDecorator('need_photo', {
            initialValue: pointsdetail.need_photo,
            rules: [{ required: true, message: '请选择是否需要拍照!' }],
          })(
            <Select placeholder="请选择">
              {photoType ? photoType.map((value, index) => { return <Option key={index} value={value.key}>{value.value}</Option> }) : null}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="巡更说明" {...formItemLayout}>
          {getFieldDecorator('note', {
            initialValue: pointsdetail.note,
          })(
            <Input type="textarea" placeholder="请输入巡更说明" maxLength={200} rows={3} />
          )}
        </Form.Item>
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
    ...state.PatrolPointsAddEdit
  };
}
export default connect(mapStateToProps)(Form.create()(PatrolPointsAddEdit));

import React from 'react';
import { connect } from 'dva';
import { Form, Breadcrumb, Card, Input, Select, Button, TreeSelect } from 'antd';
const Option = Select.Option;
import Map from '../../components/Map/index.js';

function InspectPointAdd(props) {
  let { dispatch, form, id, pointsdetail, deviceIdType, positionType, photoType, loading, treeData, show, cityName, modalType, location_name, community_id, map } = props;
  
  const { getFieldDecorator, validateFields } = form;

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
          type: 'InspectPointAdd/getPointsEdit',
          payload: { ...values, community_id, lon: (map.split(",")["0"])=="null"?"0.000000":map.split(",")["0"], lat: (map.split(",")["1"])=="null"?"0.000000":map.split(",")["1"], location_name, id }
        });
      } else {//新增
        dispatch({
          type: 'InspectPointAdd/getPointsAdd',
          payload: { ...values, community_id, lon: map.split(",")["0"], lat: map.split(",")["1"], location_name }
        });
      }
    });
  }
  //地图显示
  function handleClick(e) {
    dispatch({
      type: 'InspectPointAdd/concat',
      payload: { show: Math.random() }
    });
  }
  function handleMap(e, location_name) {
    dispatch({
      type: 'InspectPointAdd/concat',
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
        type: 'InspectPointAdd/concat',
        payload: {
          location_name: "",
          map: ""
        }
      });
    }
    dispatch({
      type: 'InspectPointAdd/concat',
      payload: { modalType: value }
    });
  }
  /**
   * 请选择设备分类显示对应设备
   * @param {*} value 
   */
  function onChangeTree(value) {
    form.setFieldsValue({ device_id: undefined });
    dispatch({
      type: 'InspectPointAdd/deviceDropDown',
      payload: { community_id, category_id: value }
    });
  }

  return (<div>
    <Breadcrumb separator="/">
      <Breadcrumb.Item>设备巡检</Breadcrumb.Item>
      <Breadcrumb.Item><a href="#/inspectPointManagement">巡检点管理</a></Breadcrumb.Item>
      <Breadcrumb.Item>{id ? '编辑' : '新增'}</Breadcrumb.Item>
    </Breadcrumb>
    <Card>
      <Form>
        <Map type={show} data={'杭州市|一号线'} cityName={cityName} handleMap={handleMap} />
        <Form.Item label="巡检点名称" {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: pointsdetail.name,
            rules: [{ required: true, message: '请输入巡检点名称' }, { pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/, message: "输入格式有误!" }],
          })(
            <Input type="text" placeholder="请输入巡检点名称" maxLength={15} />
          )}
        </Form.Item>
        <Form.Item label="设备类别" {...formItemLayout}>
          {getFieldDecorator('category_id', {
            initialValue: pointsdetail.category_id,
            rules: [{ required: true, message: '请选择设备类别' }],
          })(
            <TreeSelect
              dropdownStyle={{ maxHeight: 200, overflow: 'auto' }}
              treeData={treeData}
              placeholder="请选择设备类别"
              treeDefaultExpandedKeys={["0"]}
              onChange={onChangeTree}
            />
          )}
        </Form.Item>
        <Form.Item label="对应设备" {...formItemLayout}>
          {getFieldDecorator('device_id', {
            initialValue: pointsdetail.device_id,
            rules: [{ required: true, message: '请选择对应设备' }],
          })(
            <Select placeholder="请选择对应设备">
              {deviceIdType ? deviceIdType.map((value, index) => { return <Option key={index} value={value.id}>{value.name}</Option> }) : null}
            </Select>
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
    ...state.InspectPointAdd
  };
}
export default connect(mapStateToProps)(Form.create()(InspectPointAdd));

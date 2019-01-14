import React from 'react';
import { Form, Row,Col, Select} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
function Community(props){
  let { dispatch,form,groupData,buildingData,unitData,roomData,communityId} = props;
  const { getFieldDecorator } = form;
  const formItemLayout ={labelCol: {span: 6}, wrapperCol: {span: 16}};
  function selectChange(name, val){
    const searchModel = 'ChargesCollectableDetailedModel';
    if (name === 'group') {
      form.resetFields(['building','unit','room']);
      const param = {
        community_id: communityId,
        group: val
      };
      dispatch({
        type: `${searchModel}/getBuildingList`,
        payload: param,
      });
    }
    if (name === 'building') {
      form.resetFields(['unit', 'room']);
      let values = form.getFieldsValue();
      const param = {
        community_id: communityId,
        group: values.group,
        building:val
      };
      dispatch({
        type: `${searchModel}/getUnitList`,
        payload: param,
      });
    }
    if (name === 'unit') {
      form.resetFields(['room']);
      let values = form.getFieldsValue();
      const param = {
        community_id: communityId,
        group: values.group,
        building:values.building,
        unit:val
      };
      dispatch({
        type: `${searchModel}/getRoomList`,
        payload: param,
      });
    }
  }
  return(
    <div>
      <Row>
        <Col span={ 6 }>
          <FormItem label= "关联房屋" {...formItemLayout}>
            {getFieldDecorator('group', {
              onChange: selectChange.bind(this, 'group'),
            })(
              <Select className="mr1"
                showSearch={true}
                placeholder="请选择房屋"
                notFoundContent="没有数据">
                {groupData?groupData.map((value, index) => {
                  return <Option key={index} value={value.name}>{value.name}</Option>
                }):null}
              </Select>)}
          </FormItem>
        </Col>
        <Col span={4}>
          <FormItem>
            {getFieldDecorator('building', {
              onChange: selectChange.bind(this, 'building'),
            })(
              <Select
                placeholder= "幢" showSearch={true}
                notFoundContent="没有数据">
                {buildingData?buildingData.map((value, index) => {
                  return <Option key={index} value={value.name}>{value.name}</Option>
                }):null}
              </Select>)}
          </FormItem>
        </Col>
        <Col span={4}>
          <FormItem >
            {getFieldDecorator('unit', {
              onChange:selectChange.bind(this, 'unit'),
            })(
              <Select
                placeholder= "单元" showSearch={true}
                notFoundContent="没有数据">
                {unitData?unitData.map((value, index) => {
                  return <Option key={index} value={value.name}>{value.name}</Option>
                }):null}
              </Select>)}
          </FormItem>
        </Col>
        <Col span={4}>
          <FormItem>
            {getFieldDecorator('room', {
            })(
              <Select
                placeholder= "室" showSearch={true}
                notFoundContent="没有数据">
                {roomData?roomData.map((value, index) => {
                  return <Option key={index} value={value.name}>{value.name}</Option>
                }):null}
              </Select>)}
          </FormItem>
        </Col>
      </Row>
    </div>
  )
}
export default Community;
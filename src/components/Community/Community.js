import React from 'react';
import { connect } from 'dva';
import { Form, Col, Select} from 'antd';
import { getCommunityId } from "../../utils/util"
const FormItem = Form.Item;
const Option = Select.Option;

class Community extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      community_id: getCommunityId()
    };
    if (this.props.allDatas.community) {
      this.props.dispatch({
        type: 'CommunityModel/getCommunityList',
        payload: {}
      });
    }
    this.props.dispatch({
      type: 'CommunityModel/getGroupList',
      payload: {community_id:  getCommunityId()}
    });
  }

  selectChange (name, val) {
    if (this.props.getNewCommunityId) {
      this.props.getNewCommunityId(val);
    }
    const searchModel = 'CommunityModel';
    const { form, dispatch } = this.props;
    let { community_id } = this.state;
    if (name === 'community') {
      form.resetFields(['group', 'building', 'unit', 'room']);
      if (val) {
        const param={
          community_id: val
        };
        this.setState({
          community_id: val
        });
        dispatch({
          type: `${searchModel}/getGroupList`,
          payload: param,
        });
      }
    }
    if (name === 'group') {
      form.resetFields(['building','unit','room']);
      const param = {
        community_id: community_id,
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
        community_id: community_id,
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
        community_id: community_id,
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

  render(){
    let { communityList, groupData, buildingData, unitData, roomData, allDatas, form} = this.props;
    let { community, group, building, unit, room, formItem} = allDatas;
    const formItemLayout = formItem ? formItem : {labelCol: {span: 6}, wrapperCol: {span: 16}};
    const { getFieldDecorator } = form;
    return (
      <Col span={community ? 24 : 18}>
        {community
          ? <Col span={6}>
            <FormItem label={community.label ? community.label : "房屋"} {...formItemLayout}>
              {getFieldDecorator('community_id', {
                initialValue: getCommunityId(),
                rules: [{required: community.required ? community.required : false, message: "请选择"}],
                onChange: this.selectChange.bind(this, 'community')})(
                <Select placeholder={community.placeholder ? community.placeholder : "小区名称"} showSearch={true}>
                  {communityList?communityList.map((value, index) => {
                    return <Option key={index} value={value.id.toString()}>{value.name}</Option>
                  }):null}
                </Select>)}
            </FormItem>
          </Col>
          : null}
        {group
          ? <Col span={community ? 6 : 8}>
            <FormItem label={group.label ? group.label : "房屋信息"}  {...formItemLayout}>
              {getFieldDecorator('group', {
                onChange: this.selectChange.bind(this, 'group'),
                rules: [{required: group.required ? group.required : false, message: "请选择"}]
              })(
                <Select className="mr1"
                  showSearch={true}
                  placeholder={group.placeholder ? group.placeholder : "苑\\期\\区"}
                  notFoundContent="没有数据">
                  {groupData?groupData.map((value, index) => {
                    return <Option key={index} value={value.name}>{value.name}</Option>
                  }):null}
                </Select>)}
            </FormItem>
          </Col>
          : null}
        {building
          ? <Col span={community ? 4 : 5}>
            <FormItem>
              {getFieldDecorator('building', {
                onChange: this.selectChange.bind(this, 'building'),
                rules: [{required: building.required ? building.required : false, message: "请选择"}]
              })(
                <Select
                  placeholder={building.placeholder ? building.placeholder : "幢"} showSearch={true}
                  notFoundContent="没有数据">
                  {buildingData?buildingData.map((value, index) => {
                    return <Option key={index} value={value.name}>{value.name}</Option>
                  }):null}
                </Select>)}
            </FormItem>
          </Col>
          : null}
        {unit
          ? <Col span={community ? 4 : 5}>
            <FormItem >
              {getFieldDecorator('unit', {
                onChange:this.selectChange.bind(this, 'unit'),
                rules: [{required: unit.required ? unit.required : false, message: "请选择"}]
              })(
                <Select
                  placeholder={unit.placeholder ? unit.placeholder : "单元"} showSearch={true}
                  notFoundContent="没有数据">
                  {unitData?unitData.map((value, index) => {
                    return <Option key={index} value={value.name}>{value.name}</Option>
                  }):null}
                </Select>)}
            </FormItem>
          </Col>
          : null}
        {room
          ? <Col span={community ? 4 : 5}>
            <FormItem>
              {getFieldDecorator('room', {
                rules: [{required: room.required ? room.required : false, message: "请选择"}]
              })(
                <Select
                  placeholder={room.placeholder ? room.placeholder : "室"} showSearch={true}
                  notFoundContent="没有数据">
                  {roomData?roomData.map((value, index) => {
                    return <Option key={index} value={value.name}>{value.name}</Option>
                  }):null}
                </Select>)}
            </FormItem>
          </Col>
          : null}
      </Col>
    );
  }
}

function mapStateToProps(state) {
  return { ...state.CommunityModel };
}
export default connect(mapStateToProps)(Community);

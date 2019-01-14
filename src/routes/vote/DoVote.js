import React from 'react';
import { connect } from 'dva';
import './index.less';
import { Breadcrumb, Card, Select, Button, Input, Form, Radio, Checkbox, Row, Modal } from 'antd';
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
const Option = Select.Option;
let query = {
  community_id: '',
  group: '',
  building: '',
  room: '',
  unit: ''
};
function DoVote (props) {
  let { dispatch, doVote, form } = props;
  let { vote_id, data, owner, member_info, groupData, buildingData, unitData, roomData, member_id, mobile, visible, community_id } = doVote;
  let { getFieldDecorator } = form;
  query.community_id = community_id;
  function selectChange (mark, val) {
    query[mark] = val;
    if (mark === 'group') {
      dispatch({
        type: 'DoVoteModel/buildingList',
        payload: query
      });
      form.resetFields(['building', 'unit', 'room', 'area', 'member_id', 'phone'])
    } else if (mark === 'building') {
      dispatch({
        type: 'DoVoteModel/unitList',
        payload: query
      });
      form.resetFields(['unit', 'room', 'area', 'member_id', 'phone'])
    } else if (mark === 'unit') {
      dispatch({
        type: 'DoVoteModel/roomList',
        payload: query
      });
      form.resetFields(['room','area','member_id','phone'])
    } else if (mark === 'room') {
      form.resetFields(['area','member_id','phone'])
      dispatch({
        type: 'DoVoteModel/houseSourceGetOwner',
        payload: query
      });
    }
    dispatch({
      type: 'DoVoteModel/concat',
      payload: { mobile: '' }
    })
  }
  function userChange (e) {
    owner.user && owner.user.map(item => {
      if(item.member_id == e){
        form.setFieldsValue({
          phone:item.mobile
        });
        dispatch({
          type: 'DoVoteModel/concat',
          payload: { mobile: item.mobile }
        })
      }
    })
  }
  function handleSubmit () {
    form.validateFields((errors, values) => {
      if (errors) {
        return false;
      }
      let len = data.problems.length;
      let vote_det = [];
      for(let i = 0; i < len; i++){
        let obj = {};
        obj.problem_id = data.problems[i].problem_id;
        obj.options = [];
        if(data.problems[i].option_type == 1){
          let objs = {
            option_id: values[`option${i}`]
          };
          obj.options.push(objs);
        } else {
          let opts = values[`option${i}`];
          opts.map(item => {
            let objs={
              option_id:item
            };
            obj.options.push(objs);
          })
        }
        vote_det.push(obj);
      }
      let parm = {
        vote_id: vote_id,
        room_id: owner.room_id,
        member_id: values.member_id,
        vote_det: vote_det
      };
      dispatch({
        type: 'DoVoteModel/voteDo',
        payload: parm
      })
    })
  }
  function handleCancel () {
    dispatch({
      type: 'DoVoteModel/concat',
      payload: { visible: false }
    });
    form.resetFields();
    history.go(-1);
  }
  function onOk () {
    form.resetFields();
    dispatch({
      type: 'DoVoteModel/voteShowDet',
      payload: {
        vote_id: vote_id,
        member_id: member_id || 0
      }
    });
    dispatch({
      type: 'DoVoteModel/concat',
      payload: {
        visible: false,
        mobile: ''
      }
    });
  }

  const radioStyle = { display: 'block' };
  const disable = {};
  if(member_id){
    disable.disabled = true
  }
  return (
    <div className="page-content doVoteBox">
      <Breadcrumb separator=">">
        <Breadcrumb.Item>投票管理</Breadcrumb.Item>
        {
          member_id
            ? <Breadcrumb.Item><a href="javascript:history.go(-2)">投票详情</a></Breadcrumb.Item>
            :<Breadcrumb.Item><a href="javascript:history.go(-1)">投票详情</a></Breadcrumb.Item>
        }
        {
          member_id
            ? <Breadcrumb.Item><a href="javascript:history.go(-1)">人员详情</a></Breadcrumb.Item>
            : null
        }
        <Breadcrumb.Item>{member_id ? '人员投票详情' : '线下数据录入'}</Breadcrumb.Item>
      </Breadcrumb>
      <Card className="mt1">
        <h2>{data.vote_name}</h2>
        <div>{data.vote_desc}</div>
        <Form layout="inline">
          <h3>投票内容</h3>
          {data.problems && data.problems.map((item, index)=>{
            if (item.option_type == 1) {
              return (
                <Row key={index}>
                  <Form.Item label="">
                    <div>{`${index + 1}.${item.title}【${item.option_type_desc}】`}</div>
                    {getFieldDecorator(`option${index}`, {
                      rules: [{required: true, message: "请选择"}],
                      initialValue: '1420'
                    })(
                      <RadioGroup>
                        {item.options.map((items, idx) => {
                          let props = {};
                          if (member_id) {
                            props.disabled = true;
                            if (items.is_checked != 1) {
                              props.value = items.option_id;
                            }
                          } else {
                            props.value = items.option_id;
                          }
                          return (
                            <Radio style={radioStyle} {...props} key={idx}>
                              {items.title}
                              { item.vote_type == 2 ? <img style={{width: 80}} src={items.image_url}/> : null }
                              { item.vote_type == 2 ? <div style={{whiteSpace: 'initial'}}>{items.option_desc}</div> : null }
                            </Radio>
                          )
                        })}
                      </RadioGroup>
                    )}
                  </Form.Item>
                </Row>
              )
            } else {
              return (
                <Row key={index}>
                  <Form.Item label="">
                    <div>{`${index + 1}.${item.title}【${item.option_type_desc}】`}</div>
                    {getFieldDecorator(`option${index}`, {
                      rules: [{required: true, message: "请选择"}]
                    })(
                      member_id
                        ? <div>
                          {item.options.map((items, idx) => {
                            let props = {};
                            props.disabled = true;
                            props.value = items.option_id;
                            if(items.is_checked == 1){
                              props.checked = true;
                            }
                            return (
                              <Checkbox style={radioStyle} {...props} key={idx}>
                                {items.title}
                                { item.vote_type == 2 ? <img style={{width: 80}} src={items.image_url}/> : null }
                                { item.vote_type == 2 ? <div style={{whiteSpace: 'initial'}}>{items.option_desc}</div> : null }
                              </Checkbox>
                            )
                          })}
                        </div>
                        : <CheckboxGroup>
                          {item.options.map((items, idx) => {
                            let props = {};
                            props.value = items.option_id;
                            return (
                              <Checkbox style={radioStyle} {...props} key={idx}>
                                {items.title}
                                { item.vote_type == 2 ? <img style={{width: 80}} src={items.image_url}/> : null }
                                { item.vote_type == 2 ? <div style={{whiteSpace: 'initial'}}>{items.option_desc}</div> : null }
                              </Checkbox>
                            )
                          })}
                        </CheckboxGroup>
                    )}
                  </Form.Item>
                </Row>
              )
            }
          })}
          <h3>业主信息</h3>
          <Row style={{ marginBottom: 10 }}>
            <Form.Item label="房屋信息">
              {getFieldDecorator('group', {
                rules: [{
                  required: true,
                  message: '请选择苑/期/区'
                }],
                onChange: (val) => selectChange('group', val),
                initialValue: member_id && member_info.group ? member_info.group : undefined
              })(
                <Select style={{ width: 170 }} placeholder="苑\期\区" notFoundContent="没有数据" {...disable}>
                  {groupData.map((value, index) => {
                    return <Option key={index} value={value.name}>{value.name}</Option>
                  })}
                </Select>)}
            </Form.Item>
            <Form.Item >
              {getFieldDecorator('building',{
                rules: [{
                  required: true,
                  message: '请选择幢'
                }],
                onChange: (val) => selectChange('building', val) ,
                initialValue: member_id && member_info.group ? member_info.building : undefined
              })(
                <Select style={{ width: 100 }} placeholder="幢" notFoundContent="没有数据" {...disable}>
                  {buildingData.map((value, index) => {
                    return <Option key={index} value={value.name}>{value.name}</Option>
                  })}
                </Select>)}
            </Form.Item>
            <Form.Item >
              {getFieldDecorator('unit', {
                rules: [{
                  required: true,
                  message: '请选择单元'
                }],
                onChange: (val) => selectChange('unit', val) ,
                initialValue: member_id && member_info.group ? member_info.unit : undefined
              })(
                <Select style={{ width: 100 }} placeholder="单元" notFoundContent="没有数据" {...disable}>
                  {unitData.map((value, index) => {
                    return <Option key={index} value={value.name}>{value.name}</Option>
                  })}
                </Select>)}
            </Form.Item>
            <Form.Item >
              {getFieldDecorator('room', {
                rules: [{
                  required: true,
                  message: '请选择室'
                }],
                onChange: (val) => selectChange('room', val) ,
                initialValue: member_id && member_info.group ? member_info.room : undefined
              })(
                <Select style={{ width: 100 }} placeholder="室" allowClear notFoundContent="没有数据" {...disable}>
                  {roomData.map((value, index) => {
                    return <Option key={index} value={value.name}>{value.name}</Option>
                  })}
                </Select>)}
            </Form.Item>
          </Row>
          <Row style={{ marginBottom: 10 }}>
            <Form.Item label="房屋面积">
              {getFieldDecorator('area', {
                rules: [{required: true, message: '请选择房屋面积'}],
                initialValue: member_id && member_info.group ? member_info.charge_area : owner.charge_area
              })(
                <Input disabled={true} style={{ width: 160 }} placeholder="房屋面积"/>
              )}
            </Form.Item>
          </Row>
          <Row style={{ marginBottom: 10 }}>
            <Form.Item label="业主姓名">
              {getFieldDecorator('member_id', {
                rules: [{
                  required: true,
                  message: '请选择业主姓名'
                }],
                onChange: userChange,
                initialValue: member_id && member_info.group ? member_info.name : undefined
              })(
                <Select style={{ width: 160 }} placeholder="请选择业主" allowClear notFoundContent="没有数据" {...disable}>
                  {owner.user && owner.user.map((value, index) => {
                    return <Option key={index} value={value.member_id}>{value.name}</Option>
                  })}
                </Select>)}
            </Form.Item>
          </Row>
          <Row style={{ marginBottom: 10 }}>
            <Form.Item label="联系电话">
              {getFieldDecorator('phone', {
                rules: [{
                  required: true,
                  message: '请选择联系电话'
                }],
                initialValue: member_id && member_info.group ? member_info.mobile : mobile
              })(
                <Input disabled={true} style={{ width: 160 }} placeholder="联系电话"/>
              )}
            </Form.Item>
          </Row>
        </Form>
        {
          !member_id
            ? <div>
              <Button onClick={handleCancel} type="ghost">返回</Button>
              <Button style={{ marginLeft: 10}} onClick={handleSubmit} type="primary">提交</Button>
            </div>
            : null
        }
      </Card>
      <Modal title="提交成功" visible={visible} onOk={onOk} onCancel={handleCancel}>
        <div>投票信息已提交，是否继续录入？</div>
      </Modal>
    </div>
  )
}

export default connect(state => {
  return {
    layout:state.MainLayout,
    doVote: state.DoVoteModel,
  }
})(Form.create({})(DoVote));

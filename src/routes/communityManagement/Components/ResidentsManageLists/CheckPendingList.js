import React from 'react';
import { Table, Form, Modal, Row, Col, DatePicker, Input, Select, Checkbox, message } from 'antd';
import { connect } from 'dva';
import { Link } from 'react-router-dom';
import { noData , getCommunityId} from '../../../../utils/util';
const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;
import moment from 'moment';
let query = {
  community_id: getCommunityId(),
  group: '',
  building: '',
  unit: ''
};

function CheckPending (props) {
  let { list, loading, totals, params, dispatch, ResidentsManageModel, form } = props;
  let { visibleIn, visibleFaild, curIdentity, isLong, groupData, buildingData, unitData, roomData, noPassId, inId, curGroup, curBuilding, curUnit, curRoom, endTime } = ResidentsManageModel;
  let { getFieldDecorator } = form;
  /**
   * 查询表格数据
   * @param  {Object} params
   */
  function reload(params){
    dispatch({
      type: 'ResidentsManageModel/getListOther',
      payload: params,
      listType: '0'
    });
  }
  /**
   * 切换表格页码
   */
  function handlePaginationChange(page, size){
    const param = {...params, page};
    param.type = '0';
    reload(param);
  }
  /*
  * 显示迁入弹框
  * */
  function showInModal (record) {
    let room = record.room;
    dispatch({type: 'ResidentsManageModel/concat', payload: { loading: true }});
    let communityList = {
      group: room.group,
      building: room.building,
      unit: room.unit,
      room: room.room,
      id: record.id
    };
    query.group = room.group;
    query.building = room.building;
    query.unit = room.unit;
    // 查询当前苑期区，幢，单元，室下拉数据
    dispatch({
      type: 'ResidentsManageModel/requireAll',
      payload: communityList,
      callback: () => {
        dispatch({
          type: 'ResidentsManageModel/concat',
          payload: {
            visibleIn: true,
            inId: communityList.id,
            loading: false,
            curIdentity: record.identity_type,
            curGroup: room.group,
            curBuilding: room.building,
            curUnit: room.unit,
            curRoom: room.room,
          }
        });
        if (record.time_end == 0) {
          dispatch({
            type: 'ResidentsManageModel/concat',
            payload: { isLong: true }
          });
        } else if (record.time_end != 0) {
          dispatch({
            type: 'ResidentsManageModel/concat',
            payload: { endTime: moment(record.time_end, dateFormat) }
          });
        }
      }
    });
  }
  /*
 * 显示不通过弹框
 * */
  function showFaildModal(record) {
    dispatch({
      type: 'ResidentsManageModel/concat',
      payload: {
        visibleFaild: true,
        noPassId: record.id
      }
    })
  }
  /*
  * 隐藏弹框
  * @params {String} key
  * */
  function handleCancel (key) {
    let payload = {};
    payload[key] = false;
    payload.noPassId = '';
    payload.inId = '';
    resetValue();
    dispatch({
      type: 'ResidentsManageModel/concat',
      payload: payload
    })
  }
  /*
  * 不通过提交
  * */
  function handleOkFaild () {
    form.validateFields(['reason'], (err, values) => {
      if (err) return false;
      let formData = {};
      formData.message = values.reason;
      formData.id = noPassId;
      dispatch({
        type: 'ResidentsManageModel/hasNoPass',
        payload: formData,
        callback: () => {
          message.success("操作成功！");
          const param = {...params};
          reload(param);
          dispatch({
            type: 'ResidentsManageModel/concat',
            payload: {
              visibleFaild: false,
              noPassId: ''
            }
          })
        }
      })
    })
  }
  /*
  * 迁入提交
  * */
  function handleOkCheck () {
    let validateArr = ['identity_type', 'end_time', 'group', 'building', 'unit', 'room'];
    if (isLong) {
      validateArr = ['identity_type', 'group', 'building', 'unit', 'room'];
    }
    form.validateFields(validateArr, (err, values) => {
      if (err) return false;
      let formData = {};
      let room_id = '';
      formData.identity_type = values.identity_type;
      if (values.end_time) {
        formData.end_time = values.end_time.format('YYYY-MM-DD');
      } else {
        formData.end_time = '0'
      }
      roomData.forEach((val) => {
        if (val.name === values.room) {
          room_id = val.id
        }
      });
      formData.id = inId;
      formData.building = values.building;
      formData.group = values.group;
      formData.room = values.room;
      formData.unit = values.unit;
      formData.type = '2';
      formData.room_id = room_id;
      dispatch({
        type: 'ResidentsManageModel/moveInHouse',
        payload: formData,
        callback: () => {
          message.success("操作成功！");
          resetValue();
          dispatch({
            type: 'ResidentsManageModel/concat',
            payload: {
              visibleIn: false,
              inId: ''
            }
          });
          const param = {...params};
          reload(param);
        }
      });
    })
  }
  /*
  * 监听身份变化
  * */
  function identityChange (val) {
    dispatch({
      type: 'ResidentsManageModel/concat',
      payload: { curIdentity: val }
    })
  }
  function resetValue () {
    dispatch({
      type: 'ResidentsManageModel/concat',
      payload: {
        groupData: [],
        unitData: [],
        roomData: [],
        curIdentity: '1',
        buildingData: [],
        isLong: false,
        visibleIn: false,
        curGroup: undefined,
        curBuilding: undefined,
        curUnit: undefined,
        curRoom: undefined,
        endTime: null
      }
    });
  }
  /*
  * 监听有效期变化
  * */
  function liveDateChange (val) {
    form.setFieldsValue({end_time: null});
    dispatch({
      type: 'ResidentsManageModel/concat',
      payload: { isLong: val.target.checked }
    })
  }
  function datePickerChange (val) {
    dispatch({
      type: 'ResidentsManageModel/concat',
      payload: { isLong: false }
    })
  }
  /*
  * 不可选择日期
  * */
  function disabledDate(current) {
    return current && current < moment().endOf('day');
  }
  // 各搜索项列表获取
  function selectChange (mark, val) {
    query[mark] = val;
    query.community_id = getCommunityId();
    if (mark === 'group') {
      form.setFieldsValue({ unit: undefined });
      form.setFieldsValue({ building: undefined });
      form.setFieldsValue({ room: undefined });
      query.building = undefined;
      query.unit = undefined;
      dispatch({
        type: 'ResidentsManageModel/buildingList',
        payload: query
      })
    } else if (mark === 'building') {
      form.setFieldsValue({ unit: undefined });
      form.setFieldsValue({ room: undefined });
      query.unit = undefined;
      dispatch({
        type: 'ResidentsManageModel/unitList',
        payload: query
      })
    } else if (mark === 'unit') {
      form.setFieldsValue({ room: undefined });
      dispatch({
        type: 'ResidentsManageModel/roomList',
        payload: query
      })
    }
  }
  // 表格分页配置
  const pagination = {
    current: params.page,
    onChange: handlePaginationChange,
    total: parseInt(totals),
    showTotal: totals => `共${totals}条`,
    defaultCurrent: 1
  };
  // 表格列配置
  const columns = [{
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    render: noData,
  }, {
    title: '手机号码',
    dataIndex: 'mobile',
    key: 'mobile',
    render: noData,
  }, {
    title: '身份证号',
    dataIndex: 'card_no',
    key: 'card_no',
    render: noData,
  }, {
    title: '对应房屋',
    dataIndex: 'house',
    key: 'house',
    render: (text, record) => {
      let room = record.room;
      return room ? (<span>{`${room.group}${room.building}${room.unit}${room.room}`}</span>):'-'      
    }
  }, {
    title: '身份',
    dataIndex: 'identity_type_des',
    key: 'identity_type_des',
    render: noData,
  }, {
    title: '有效期',
    dataIndex: 'time_end',
    key: 'time_end',
    render: (text, record) => {
      if (record.time_end == 0) {
        return <span>长期</span>
      } else {
        return <span>{record.time_end}</span>
      }
    }
  }, {
    title: '提交时间',
    dataIndex: 'create_at',
    key: 'create_at',
    render: noData,
  }, {
    title: '操作',
    key: 'action3',
    render: (text, record) => {
      let linkView = `/residentsViewTwo?id=${record.id}&type=CheckPending`;
      return (
        <span>
          <Link to={linkView} className="table-operating mr1">查看</Link>
          <a className="table-operating" onClick={() => showInModal(record)}>迁入</a>
          <a className="table-operating" onClick={() => showFaildModal(record)}>不通过</a>
        </span>
      )
    },
  }];
  const formItemLayout = {
    labelCol: {
      span: 5
    },
    wrapperCol: {
      span: 14
    },
  };
  const formItemLayout1 = {
    labelCol: {
      span: 7
    },
    wrapperCol: {
      span: 14
    },
  };
  const dateFormat = 'YYYY-MM-DD';
  return (
    <div>
      <Table
        className="mt1"
        dataSource={list}
        columns={columns}
        loading={loading}
        rowKey={record => record.id}
        pagination={pagination}
      />
      <Modal
        title="迁入房屋"
        visible={visibleIn}
        onOk={handleOkCheck}
        key="check_key"
        onCancel={() => handleCancel('visibleIn')}
        destroyOnClose={true}
      >
        <Form>
          <FormItem label="苑\期\区：" {...formItemLayout} style={{marginBottom: 10}}>
            {getFieldDecorator('group', {
              rules: [{required: true, message: "请选择"}],
              initialValue: curGroup
            })(
              <Select
                className="mr-5"
                placeholder="苑\期\区"
                showSearch={true}
                notFoundContent="没有数据"
                onChange={(val) => selectChange('group', val)}>
                {groupData.map((value, index) => {
                  return <Option key={index} value={value.name}>{value.name}</Option>
                })}
              </Select>)}
          </FormItem>
          <FormItem label="幢：" {...formItemLayout} style={{marginBottom: 10}}>
            {getFieldDecorator('building', {
              rules: [{required: true, message: "请选择"}],
              initialValue: curBuilding
            })(
              <Select
                className="select-100 mr-5"
                placeholder="幢"
                showSearch={true}
                notFoundContent="没有数据"
                onChange={(val) => selectChange('building', val)}>
                {buildingData.map((value, index) => {
                  return <Option key={index} value={value.name}>{value.name}</Option>
                })}
              </Select>)}
          </FormItem>
          <FormItem label="单元：" {...formItemLayout} style={{marginBottom: 10}}>
            {getFieldDecorator('unit', {
              rules: [{required: true, message: "请选择"}],
              initialValue: curUnit
            })(
              <Select
                className="select-100 mr-5"
                placeholder="单元"
                showSearch={true}
                notFoundContent="没有数据"
                onChange={(val) => selectChange('unit', val)}>
                {unitData.map((value, index) => {
                  return <Option key={index} value={value.name}>{value.name}</Option>
                })}
              </Select>)}
          </FormItem>
          <FormItem label="室：" {...formItemLayout} style={{marginBottom: 10}}>
            {getFieldDecorator('room', {
              rules: [{required: true, message: "请选择"}],
              initialValue: curRoom
            })(
              <Select
                className="select-100 mr-5"
                placeholder="室"
                showSearch={true}
                notFoundContent="没有数据"
                onChange={(val) => selectChange('room', val)}>
                {roomData.map((value, index) => {
                  return <Option key={index} value={value.name}>{value.name}</Option>
                })}
              </Select>)}
          </FormItem>
          <FormItem label="身份" {...formItemLayout} style={{marginBottom: 10}}>
            {getFieldDecorator('identity_type', {
              rules: [{ required: true, message: '请选择身份' }],
              initialValue: curIdentity
            })(
              <Select onChange={identityChange}>
                <Option value="1">业主</Option>
                <Option value="2">家人</Option>
                <Option value="3">租客</Option>
              </Select>
            )}
          </FormItem>
          {curIdentity === '3'
            ? <Row>
              <Col span={16}>
                <FormItem label="有效期" {...formItemLayout1} style={{marginBottom: 10, marginLeft: 12}}>
                  {getFieldDecorator('end_time', {
                    rules: [{ required: true, message: '请选择(可选具体日期或长期)'}],
                    initialValue: endTime
                  })(
                    <DatePicker format={dateFormat} onChange={datePickerChange} disabledDate={disabledDate}/>
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <Checkbox style={{marginLeft: '-10px', marginTop: 10}} onChange={liveDateChange} checked={isLong}>长期</Checkbox>
              </Col>
            </Row>
            : null}
        </Form>
      </Modal>
      <Modal
        title="不通过"
        visible={visibleFaild}
        onOk={handleOkFaild}
        onCancel={() => handleCancel('visibleFaild')}
        destroyOnClose={true}
      >
        <Form>
          <FormItem label="不通过原因" {...formItemLayout} style={{marginBottom: 12}}>
            {getFieldDecorator('reason', {
              rules: [{ required: true, message: '请填写不通过原因' }],
            })(
              <TextArea
                placeholder="请输入原因，最多不超过50字符"
                autosize={{ minRows: 2, maxRows: 6 }}
                style={{verticalAlign: '-28px'}}
                maxLength={50}/>
            )}
          </FormItem>
        </Form>
      </Modal>
    </div>
  )
}

function mapStateToProps(state) {
  return {
    ResidentsManageModel: { ...state.ResidentsManageModel }
  };
}
export default connect(mapStateToProps)(Form.create()(CheckPending));

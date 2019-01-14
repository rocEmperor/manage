import React from 'react';
import { Card, Table, Row, Col, Popconfirm, Modal, Form, Select, DatePicker, Checkbox, Breadcrumb, message } from 'antd';
import { Link } from 'react-router-dom';
import { connect } from 'dva';
import moment from 'moment';
const FormItem = Form.Item;
const Option = Select.Option;

function ResidentsViewOne (props) {
  const { infoList, relatedHouseList, relatedResidentList, searchType, editId, housePage, residentPage, residentTotals, houseTotals, visible, dispatch, form, curHouse,
    curIdentity, isLong, endTime, loadingHouse, loadingResident, labelType, curId } = props;
  const { getFieldDecorator } = form;
  const styleList = { fontSize: 18, fontWeight: 600, marginBottom: 12 };
  const styleList1 = { marginBottom: 12 };
  const styleList2 = { textAlign: 'right' };
  const dateFormat = 'YYYY-MM-DD';
  /*
  * 创建信息行
  * @params {String} lable 信息标题
  * @params {String || Array} val 信息对应infoList里面的字段 Array -> 户籍地址
  * */
  function createInfo (lable, val) {
    let result = '';
    if (typeof val === 'string') {
      result = <Row>
        <Col span={6} style={styleList2}>{lable}：</Col>
        <Col span={18}>{infoList[val] ? infoList[val] : ''}</Col>
      </Row>
    } else {
      let values = Object.values(val);
      let res = '';
      values.map((value) => {
        let curVal = infoList[value] ? infoList[value] : '';
        res += curVal;
      });
      result = <Row>
        <Col span={6} style={styleList2}>{lable}：</Col>
        <Col span={18}>{res}</Col>
      </Row>
    }
    return result
  }
  /*
  * 监听相关房屋分页变化
  * @params {number} page
  * */
  function housePageChange (page) {
    dispatch({
      type: 'ResidentsViewOneModel/concat',
      payload: { housePage: page }
    });
    dispatch({
      type: 'ResidentsViewOneModel/getRelatedHouseList',
      payload: {
        id: infoList.member_id,
        page: page,
        rows: 10
      }
    })
  }
  /*
  * 监听相关住户分页变化
  * @params {number} page
  * */
  function residentPageChange (page) {
    dispatch({
      type: 'ResidentsViewOneModel/concat',
      payload: { residentPage: page }
    });
    dispatch({
      type: 'ResidentsViewOneModel/getRelatedResidentList',
      payload: {
        id: infoList.member_id,
        page: page,
        rows: 10
      }
    })
  }
  /*
  * 迁出房屋
  * @params {Object} record
  * */
  function outInfo (record) {
    let formData = { id: record.id };
    dispatch({
      type: 'ResidentsViewOneModel/moveOutPerson',
      payload: formData,
      callback: () => {
        message.success('迁出成功');
        dispatch({
          type: 'ResidentsViewOneModel/getRelatedHouseList',
          payload: {
            id: infoList.member_id,
            page: housePage,
            rows: 10
          }
        })
        dispatch({
          type: 'ResidentsViewOneModel/getRelatedResidentList',
          payload: { id: infoList.member_id, page: residentPage, rows: 10 }
        });
      }
    })
  }
  /*
  * 不可选择日期
  * */
  function disabledDate(current) {
    return current && current < moment().endOf('day');
  }
  /*
   * 点击编辑按钮
   * */
  function showModal (record) {
    dispatch({
      type: 'ResidentsViewOneModel/concat',
      payload: {
        visible: true,
        editId: record.id,
        curIdentity: record.identity_type,
        curHouse: `${record.group}${record.building}${record.unit}${record.room}`
      }
    });
    if (record.identity_type == '3') {
      if (record.time_end == '0') {
        dispatch({
          type: 'ResidentsViewOneModel/concat',
          payload: { isLong: true, endTime: null }
        })
      } else {
        dispatch({
          type: 'ResidentsViewOneModel/concat',
          payload: { endTime: moment(record.time_end, dateFormat), isLong: false }
        });
      }
    }
  }
  /*
   * 确认编辑房屋
   * */
  function handleOk (e) {
    let validateArr = ['identity_type', 'end_time'];
    if (isLong) {
      validateArr = ['identity_type'];
    }
    form.validateFields(validateArr, (err, values) => {
      if (err) return false;
      let formData = {};
      formData.id = editId;
      formData.identity_type = values.identity_type;
      if (values.end_time) {
        formData.end_time = values.end_time.format('YYYY-MM-DD');
      } else {
        formData.end_time = '0'
      }
      dispatch({
        type: 'ResidentsViewOneModel/relatedHouseEdit',
        payload: formData,
        callback: () => {
          message.success('编辑成功');
          dispatch({
            type: 'ResidentsViewOneModel/getRelatedHouseList',
            payload: { id: infoList.member_id, page: housePage, rows: 10 }
          });
          dispatch({
            type: 'ResidentsViewOneModel/getRelatedResidentList',
            payload: { id: infoList.member_id, page: residentPage, rows: 10 }
          });
          dispatch({
            type: 'ResidentsViewOneModel/concat',
            payload: {
              visible: false,
              curIdentity: '',
              curHouse: ''
            }
          })
        }
      });
    });
  }
  /*
  * 取消编辑房屋
  * */
  function handleCancel (e) {
    dispatch({
      type: 'ResidentsViewOneModel/concat',
      payload: {
        visible: false,
        curIdentity: '',
        curHouse: ''
      }
    })
  }
  /*
  * 监听身份变化
  * */
  function identityChange (val) {
    dispatch({
      type: 'ResidentsViewOneModel/concat',
      payload: { curIdentity: val }
    })
  }
  /*
  * 监听有效期变化
  * */
  function liveDateChange (val) {
    form.setFieldsValue({end_time: null});
    dispatch({
      type: 'ResidentsViewOneModel/concat',
      payload: { isLong: val.target.checked }
    })
  }
  function datePickerChange (val) {
    dispatch({
      type: 'ResidentsViewOneModel/concat',
      payload: { isLong: false }
    })
  }
  /*
  * 住户标签
  * */
  function getLabel () {
    let res = [];
    if (infoList.user_label_id) {
      infoList.user_label_id.forEach((val, index) => {
        labelType.forEach((val1, index1) => {
          if (val === val1.id) {
            res.push(val1.name);
          }
        })
      })
    }
    return res.join('，');
  }
  // 相关房屋列配置
  const columnsHouse = [{
    title: '关联房屋',
    dataIndex: 'name',
    key: 'name',
    render: (text, record) => {
      let groupName = record.group ? record.group : '';
      let buildingName = record.building ? record.building : '';
      let unitName = record.unit ? record.unit : '';
      let roomName = record.room ? record.room : '';
      return (
        <span>{`${groupName}${buildingName}${unitName}${roomName}`}</span>
      )
    }
  }, {
    title: '物业类型',
    dataIndex: 'property_type',
    key: 'property_type',
    render: (text, record) => {
      return (
        <span>{record.roomInfo ? record.roomInfo.property_type_desc : ''}</span>
      )
    }
  }, {
    title: '房屋状态',
    dataIndex: 'status',
    key: 'status',
    render: (text, record) => {
      return (
        <span>{record.roomInfo ? record.roomInfo.status_desc : ''}</span>
      )
    }
  }, {
    title: '房屋面积',
    dataIndex: 'charge_area',
    key: 'charge_area',
    render: (text, record) => {
      return (
        <span>{record.roomInfo ? record.roomInfo.charge_area : ''}</span>
      )
    }
  }, {
    title: '身份',
    dataIndex: 'identity_type',
    key: 'identity_type',
    render: (text, record) => {
      let result = '';
      if (record.identity_type == 1) {
        result = '业主'
      } else if (record.identity_type == 2) {
        result = '家人'
      } else if (record.identity_type == 3) {
        result = '租客'
      }
      return (
        <span>{result}</span>
      )
    }
  }, {
    title: '有效期',
    dataIndex: 'time_end',
    key: 'time_end',
    render: (text, record) => {
      return (
        <span>{record.time_end == '0' ? '长期' : record.time_end}</span>
      );
    }
  }, {
    title: '操作',
    dataIndex: 'operate',
    key: 'operate',
    render: (text, record) => {
      return (
        <div>
          {curId !== record.id ? <Popconfirm title="确定要迁出这个房屋么？" onConfirm={outInfo.bind(this, record)}>
            <a href="javascript:;" style={{marginRight: 10}}>迁出</a>
          </Popconfirm> : null}
          {curId !== record.id
            ? record.status && record.status == '2' ? null : <a href="javascript:;" onClick={() => showModal(record)}>编辑</a>
            : null}
        </div>
      )
    }
  }];
  // 相关住户列配置
  const columnsResident = [{
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  }, {
    title: '手机号码',
    dataIndex: 'mobile',
    key: 'mobile',
  }, {
    title: '性别',
    dataIndex: 'sex',
    key: 'sex',
    render: (text, record) => {
      return record.sex == 1 ? <span>男</span> : <span>女</span>
    }
  }, {
    title: '身份证号',
    dataIndex: 'card_no',
    key: 'card_no',
    render: (text, record) => {
      return record.card_no ? <span>{record.card_no}</span> : <span>-</span>
    }
  }, {
    title: '对应房屋',
    dataIndex: 'address',
    key: 'address',
    render: (text, record) => {
      let groupName = record.group ? record.group : '';
      let buildingName = record.building ? record.building : '';
      let unitName = record.unit ? record.unit : '';
      let roomName = record.room ? record.room : '';
      return (
        <span>{`${groupName}${buildingName}${unitName}${roomName}`}</span>
      );
    }
  }, {
    title: '身份',
    dataIndex: 'identity_type_des',
    key: 'identity_type_des',
  }, {
    title: '有效期',
    dataIndex: 'time_end',
    key: 'time_end',
    render: (text, record) => {
      return record.time_end == 0 ? <span>长期</span> : <span>{record.time_end}</span>
    }
  }, {
    title: '认证状态',
    dataIndex: 'status_desc',
    key: 'status_desc',
  }, {
    title: '认证时间',
    dataIndex: 'auth_time',
    key: 'auth_time',
  }, {
    title: '操作',
    dataIndex: 'operate',
    key: 'operate',
    render: (text, record) => {
      let linkView = `/residentsViewOne?id=${record.id}&type=AlreadySettleIn`;
      return (
        <div>
          {record.id !== curId
            ? <Link to={linkView} className="table-operating mr1">查看详情</Link>
            : null}
        </div>
      )
    }
  }];
  // 相关房屋分页配置
  const housePagination = {
    current: housePage,
    onChange: housePageChange,
    total: parseInt(houseTotals),
    showTotal: houseTotals => `共${houseTotals}条`,
    defaultCurrent:1,
    defaultPageSize: 10,
  };
  // 相关住户分页配置
  const residentPagination = {
    current: residentPage,
    onChange: residentPageChange,
    total: parseInt(residentTotals),
    showTotal: residentTotals => `共${residentTotals}条`,
    defaultCurrent:1,
    defaultPageSize: 10,
  };

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
  return (
    <div>
      <Breadcrumb separator=">">
        <Breadcrumb.Item>小区管理</Breadcrumb.Item>
        <Breadcrumb.Item><Link to="/residentsManage">住户管理</Link></Breadcrumb.Item>
        <Breadcrumb.Item>查看详情</Breadcrumb.Item>
      </Breadcrumb>
      <Card style={{marginBottom: 20}}>
        <div style={styleList}>住户详情</div>
        <Row>
          <Col span={24} style={styleList1}>基础信息</Col>
          <Col span={12} style={styleList1}>{createInfo('姓名', 'name')}</Col>
          <Col span={12} style={styleList1}>
            <Row>
              <Col span={6} style={styleList2}>性别：</Col>
              <Col span={18}>{infoList.sex && infoList.sex == 1 ? '男': '女'}</Col>
            </Row>
          </Col>
          <Col span={12} style={styleList1}>{createInfo('手机号码', 'mobile')}</Col>
          <Col span={12} style={styleList1}>{createInfo('身份证号', 'card_no')}</Col>
          <Col span={12} style={styleList1}>{createInfo('苑/期/区', 'group')}</Col>
          <Col span={12} style={styleList1}>{createInfo('幢', 'building')}</Col>
          <Col span={12} style={styleList1}>{createInfo('单元', 'unit')}</Col>
          <Col span={12} style={styleList1}>{createInfo('室', 'room')}</Col>
          <Col span={12} style={styleList1}>{createInfo('身份', 'identity_type_desc')}</Col>
          <Col span={12} style={styleList1}>
            <Row>
              <Col span={6} style={styleList2}>有效期：</Col>
              <Col span={18}>{infoList.time_end == 0 ? '长期': infoList.time_end}</Col>
            </Row>
          </Col>
          <Col span={12} style={styleList1}>{createInfo('入住时间', 'enter_time')}</Col>
          <Col span={12} style={styleList1}>{createInfo('入住原因', 'reason')}</Col>
          <Col span={12} style={styleList1}>{createInfo('工作单位', 'work_address')}</Col>
          <Col span={12} style={styleList1}>
            <Row>
              <Col span={6} style={styleList2}>住户标签：</Col>
              <Col span={18}>{getLabel()}</Col>
            </Row>
          </Col>
          <Col span={24} style={styleList1}>联系信息</Col>
          <Col span={12} style={styleList1}>{createInfo('QQ号', 'qq')}</Col>
          <Col span={12} style={styleList1}>{createInfo('微信号', 'wechat')}</Col>
          <Col span={12} style={styleList1}>{createInfo('电子邮箱', 'email')}</Col>
          <Col span={12} style={styleList1}>{createInfo('家庭电话', 'telephone')}</Col>
          <Col span={12} style={styleList1}>{createInfo('紧急联系人', 'emergency_contact')}</Col>
          <Col span={12} style={styleList1}>{createInfo('紧急联系电话', 'emergency_mobile')}</Col>
          <Col span={24} style={styleList1}>其他信息</Col>
          <Col span={12} style={styleList1}>{createInfo('民族', 'nation_desc')}</Col>
          <Col span={12} style={styleList1}>{createInfo('政治面貌', 'face_desc')}</Col>
          <Col span={12} style={styleList1}>{createInfo('婚姻状况', 'marry_status_desc')}</Col>
          <Col span={12} style={styleList1}>{createInfo('户口类型', 'household_type_desc')}</Col>
          <Col span={12} style={styleList1}>
            {createInfo('户籍地址', ['household_province', 'household_city', 'household_area'])}
          </Col>
          <Col span={12} style={styleList1}>{createInfo('详细地址', 'household_address')}</Col>
          <Col span={12} style={styleList1}>{createInfo('暂住证号码', 'residence_number')}</Col>
          <Col span={12} style={styleList1}>{createInfo('居住类型', 'live_type_desc')}</Col>
          <Col span={12} style={styleList1}>{createInfo('居住情况', 'live_detail_desc')}</Col>
          <Col span={12} style={styleList1}>{createInfo('变动情况', 'change_detail_desc')}</Col>
          <Col span={12} style={styleList1}>{createInfo('变动前地址', 'change_after')}</Col>
          <Col span={12} style={styleList1}>{createInfo('变动后地址', 'change_before')}</Col>
        </Row>
      </Card>
      {searchType === 'AlreadySettleIn'
        ? <Card>
          <div style={styleList}>相关房屋</div>
          <Table
            dataSource={relatedHouseList}
            columns={columnsHouse}
            pagination={housePagination}
            loading={loadingHouse}
            rowKey={record => record.id}/>
          <div style={styleList}>相关住户</div>
          <Table
            dataSource={relatedResidentList}
            columns={columnsResident}
            loading={loadingResident}
            pagination={residentPagination}
            rowKey={record => record.id}/>
        </Card>
        : null}
      <Modal
        title="编辑"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        destroyOnClose={true}
      >
        <Form>
          <FormItem label="房屋" {...formItemLayout} style={{marginBottom: 10}}>
            {getFieldDecorator('home')(
              <div>{curHouse}</div>
            )}
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
          {curIdentity == '3'
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
            : null
          }
        </Form>
      </Modal>
    </div>
  )
}

function mapStateToProps(state) {
  return {
    ...state.ResidentsViewOneModel
  };
}
export default connect(mapStateToProps)(Form.create()(ResidentsViewOne))

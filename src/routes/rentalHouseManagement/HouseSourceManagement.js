import React from 'react';
import { connect } from 'dva';
import { Link } from 'react-router-dom';
import { Table, Breadcrumb, Card, Select, Button, Icon, Input, Form, Row, Col, Modal, DatePicker, Popconfirm } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { author } from '../../utils/util';
import Community from '../../components/Community/Community.js';
import { checkPhone } from '../../utils/util';
moment.locale('zh-cn');

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

function HouseSourceManagement(props) {
  let { dispatch, loadingState, form, showOrder, list, totals, rent_ref, status, params, layout, id, pub_start_time, pub_end_time, is_reset } = props;
  const { getFieldDecorator } = form;
  if (is_reset == true) {
    form.resetFields();
    dispatch({
      type: 'HouseSourceManagementModel/concat',
      payload: {
        is_reset: false,
      }
    });
  }
  list = list.map((value, index) => {
    value.key = index;
    return value;
  });
  /*
  * 监听pageSize变化
  * size Number
  * */
  function handleShowSizeChange(current, size) {
    params.page = 1;
    params.rows = size;
    params.community_id = layout.communityId;
    dispatch({
      type: 'HouseSourceManagementModel/getList',
      payload: params
    });
  }
  /*
  * 监听页码变化
  * page Number
  * */
  function handlePaginationChange(page) {
    params.page = page;
    params.community_id = layout.communityId;
    dispatch({
      type: 'HouseSourceManagementModel/getList',
      payload: params
    });
  }
  /*
 * 监听 开始时间 结束时间
 * dateString String
 * */
  function dataChange(date, dateString) {
    dispatch({
      type: 'HouseSourceManagementModel/concat',
      payload: {
        pub_start_time: dateString[0],
        pub_end_time: dateString[1]
      }
    });
  }
  /*
  * 查询
  * */
  function handSearch() {
    form.validateFields(['member_name', 'mobile', 'rent_ref', 'status', 'group', 'building', 'unit', 'room', 'time'], (err, values) => {
      params.page = 1;
      params.rows = 10;
      params.member_name = values.member_name;
      params.mobile = values.mobile;
      params.rent_ref = values.rent_ref;
      params.status = values.status;
      params.group = values.group;
      params.building = values.building;
      params.unit = values.unit;
      params.room = values.room;
      params.pub_start_time = pub_start_time;
      params.pub_end_time = pub_end_time;
      dispatch({
        type: 'HouseSourceManagementModel/getList',
        payload: params
      });
    });
  }
  /*
  * 取消委托
  * id Number
  * */
  function cancel(id) {
    dispatch({
      type: 'HouseSourceManagementModel/getCancelEntrust',
      payload: { rent_id: id }
    });
  }
  /*
  * 取消预约看房
  * */
  function handleCancel() {
    dispatch({
      type: 'HouseSourceManagementModel/concat',
      payload: { showOrder: false }
    });
    form.resetFields();
  }
  /*
  * 点击预约看房
  * id String
  * */
  function order(id) {
    dispatch({
      type: 'HouseSourceManagementModel/concat',
      payload: { showOrder: true, id: id }
    });
  }
  /*
  * 确认预约看房
  * */
  function handleOk() {
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      dispatch({
        type: 'HouseSourceManagementModel/getHouseSourcePropertyCreate',
        payload: {
          house_rent_id: id,
          reserve_time: values.reserve_time.format('YYYY-MM-DD HH:mm'),
          reserve_name: values.reserve_name,
          contact_mobile: values.contact_mobile
        },
        callback (){
          form.resetFields();
        }
      })
      !showOrder && form.resetFields(['reserve_time', 'reserve_name', 'contact_mobile']);
    })
  }
  /*
  * 重置
  * */
  function handleReset() {
    let params = {
      page: 1,
      rows: 10,
      member_name: '',
      mobile: '',
      rent_ref: '',
      status: '',
      group: '',
      building: '',
      unit: '',
      room: '',
      community_id: layout.communityId,
      pub_start_time: '',
      pub_end_time: '',
    };
    form.resetFields();
    dispatch({
      type: 'HouseSourceManagementModel/concat',
      payload: {
        buildingData: [],
        unitData: [],
        roomData: [],
        params: params,
        pub_start_time: undefined,
        pub_end_time: undefined,
      }
    });
    dispatch({
      type: 'HouseSourceManagementModel/getList',
      payload: params
    })
    dispatch({
      type: 'CommunityModel/concat',
      payload: {
        unitData: [],
        roomData: [],
        buildingData: [],
      }
    });
  }
  const columns = [
    { title: '房屋信息', dataIndex: 'address', key: 'address' },
    { title: '出租标题', dataIndex: 'rent_title', key: 'rent_title' },
    { title: '来源', dataIndex: 'rent_ref_desc', key: 'rent_ref_desc' },
    { title: '业主姓名', dataIndex: 'name', key: 'name' },
    { title: '联系电话', dataIndex: 'contact_mobile', key: 'contact_mobile' },
    { title: '出租类型', dataIndex: 'rent_way_desc', key: 'rent_way_desc' },
    { title: '房型', dataIndex: 'house_type', key: 'house_type' },
    { title: '期望租金', dataIndex: 'expired_rent_price', key: 'expired_rent_price' },
    { title: '发布时间', dataIndex: 'created_at', key: 'created_at' },
    { title: '状态', dataIndex: 'status_desc', key: 'status_desc' },
    {
      title: '操作',
      dataIndex: 'desc',
      render: (text, record) => {
        let link = `/addRentalHouse?id=${record.id}`;
        let link1 = `/houseSourceDetails?id=${record.id}`;
        let spacingStyle = { marginLeft: 10 }
        if (record.status === '1') {
          return (
            <div>
              {author('details') ? <Link to={link1} style={spacingStyle}>查看详情</Link> : null}
              {author('cancelEntrust') ?
                <Popconfirm title="确定要取消委托？" okText="确认" cancelText="取消" onConfirm={() => cancel(record.id)}>
                  <a className="y-m-l-10" style={spacingStyle}>取消委托</a>
                </Popconfirm>
                : null}
              {record.rent_ref !== 1 && author('edit') ? <Link to={link} style={spacingStyle}>编辑</Link> : ''}
            </div>
          )
        } else if (record.status === '2') {
          return (
            <div>
              {author('orderLookHouse') ? <a onClick={() => order(record.id)} style={spacingStyle}>预约看房</a> : null}
              {author('details') ? <Link to={link1} style={spacingStyle}>查看详情</Link> : null}
              {author('cancelEntrust') ?
                <Popconfirm title="确定要取消委托？" okText="确认" cancelText="取消" onConfirm={() => cancel(record.id)}>
                  <a className="y-m-l-10" style={spacingStyle}>取消委托</a>
                </Popconfirm>
                : null}
            </div>
          )
        } else if (record.status === '5') {
          return (
            <div>
              {author('details') ? <Link to={link1} style={spacingStyle}>查看详情</Link> : null}
              {author('cancelEntrust') ?
                <Popconfirm title="确定要取消委托？" okText="确认" cancelText="取消" onConfirm={() => cancel(record.id)}>
                  <a className="y-m-l-10" style={spacingStyle}>取消委托</a>
                </Popconfirm>
                : null}
              {record.rent_ref !== 1 && author('edit') ? <Link to={link} style={spacingStyle}>编辑</Link> : ''}
            </div>
          )
        } else if (record.status === '6') {
          return (
            <div>
              {author('details') ? <Link to={link1} style={spacingStyle}>查看详情</Link> : null}
              {record.rent_ref !== 1 && author('edit') ? <Link to={link} style={spacingStyle}>编辑</Link> : ''}
            </div>
          )
        } else {
          return (
            <div>
              {author('details') ? <Link to={link1} style={spacingStyle}>查看详情</Link> : null}
            </div>
          )
        }
      }
    }];
  const formItemLayout = {
    labelCol: {
      span: 6
    },
    wrapperCol: {
      span: 14
    }
  };
  const formItemLayout2 = {
    labelCol: {
      span: 3
    },
    wrapperCol: {
      span: 21
    }
  };
  const pagination = {
    current: params.page,
    pageSize: params.rows,
    onShowSizeChange: handleShowSizeChange,
    onChange: handlePaginationChange,
    defaultPageSize: 10,
    total: parseInt(totals),
    showTotal(total, range) {
      return `共 ${totals} 条`
    },
  };
  return (
    <div className="page-content">
      <Breadcrumb separator=">">
        <Breadcrumb.Item>租房管理</Breadcrumb.Item>
        <Breadcrumb.Item>租房房源管理</Breadcrumb.Item>
      </Breadcrumb>
      <Card className="section">
        <Form>
          <Row>
            <Col span={6}>
              <FormItem label="业主姓名：" {...formItemLayout}>
                {
                  getFieldDecorator('member_name')(
                    <Input placeholder="请输入业主姓名" />
                  )
                }
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="联系电话：" {...formItemLayout}>
                {
                  getFieldDecorator('mobile')(
                    <Input placeholder="请输入联系电话" />
                  )
                }
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="房屋来源：" {...formItemLayout}>
                {getFieldDecorator('rent_ref')(
                  <Select placeholder="请选择房屋来源">
                    {rent_ref.length > 0 && rent_ref.map((value, index) => {
                      return (
                        <Option key={value.key} value={`${value.key}`}>
                          {value.value}
                        </Option>
                      )
                    })}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="房屋状态：" {...formItemLayout}>
                {getFieldDecorator('status')(
                  <Select placeholder="请选择房屋状态">
                    {status.length > 0 && status.map((value, index) => {
                      return (
                        <Option key={value.key} value={`${value.key}`}>
                          {value.value}
                        </Option>
                      )
                    })}
                  </Select>
                )}
              </FormItem>
            </Col>

          </Row>
          <Row>
            <Community form={form} allDatas={{ group: {}, building: {}, unit: {}, room: {} }} />
            <Col span={12}>
              <FormItem label="发布时间：" {...formItemLayout2}>
                {getFieldDecorator('time')(
                  <RangePicker placeholder={['开始时间', '结束时间']} style={{ width: '96%' }} onChange={dataChange} />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={5} offset={19}>
              <Button type="primary" className="mr1" onClick={handSearch}>
                查询
              </Button>
              <Button type="ghost" onClick={handleReset}>
                重置
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
      <Card className="mt1">
        <Link to="/addRentalHouse">
          {author('publishHouse') ?
            <span><Button type="primary"><Icon type="plus" />发布房源</Button></span>
            : null}
        </Link>
        <Table columns={columns} className="mt1" pagination={pagination} dataSource={list} rowKey={record => record.key} loading={loadingState} />
      </Card>
      <Modal title="预约看房" visible={showOrder} onOk={handleOk} onCancel={handleCancel} okText="确认" cancelText="取消">
        <Form>
          <FormItem {...formItemLayout} label="看房时间">
            {getFieldDecorator('reserve_time', { rules: [{ required: true, message: '请选择看房时间' }] })(
              <DatePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: '100%' }} />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="预约人">
            {getFieldDecorator('reserve_name', { rules: [{ type: "string", pattern: /^[\u4e00-\u9fa5]+$/, required: true, message: '请输入预约人(10个以内汉字)' }] })(
              <Input type="text" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="联系电话">
            {getFieldDecorator('contact_mobile', { rules: [{ required: true, message: '请输入手机号码' }, { validator: checkPhone.bind(this), message: '请输入手机号码！' }], })(
              <Input type="text" />
            )}
          </FormItem>
        </Form>
      </Modal>
    </div>
  )
}

function mapStateToProps(state) {
  return {
    ...state.HouseSourceManagementModel,
    layout: state.MainLayout
  }
}

export default connect(mapStateToProps)(Form.create()(HouseSourceManagement));

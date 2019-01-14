import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { author }from '../../utils/util';
import { Table, Breadcrumb, Card, Select, Button, Input, Form, Row, Col, Modal, DatePicker} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option
const { RangePicker } = DatePicker;

function OrderRoomManagement (props) {
  let { dispatch, OrderRoomManagementModel, layout, form } = props;
  let { list, totals, reserve_status, params, sign, id, reserve_time_start, reserve_time_end, loading,is_reset,statusId } = OrderRoomManagementModel;
  
  let { getFieldDecorator } = form;
  list = list.map((value, index) => {
    value.key = index
    return value;
  });
  if (is_reset == true) {
    form.resetFields();
    dispatch({
      type: 'OrderRoomManagementModel/concat',
      payload: {
        is_reset: false,
      }
    });
  }
  function showSign (id){
    dispatch({
      type: 'OrderRoomManagementModel/concat',
      payload: { sign: true, id: id }
    })
  }

  function handleCancel (){
    dispatch({
      type: 'OrderRoomManagementModel/concat',
      payload: { sign: false}
    })
  }

  function handleOk () {
    form.validateFields((err, values) => {
      if(err){
        return;
      }
      dispatch({
        type: 'OrderRoomManagementModel/getRentReserveTakeLook',
        payload: {
          reserve_id: id,
          take_look_note: values.take_look_note
        }
      })
    })
  }

  //搜索列表
  function handSearch (val) {
    form.validateFields((err, values) => {
      params.page = 1;
      params.rows = 10;
      params.member_name = values.member_name;
      params.member_mobile = values.member_mobile;
      params.status = values.status;
      params.reserve_name = values.reserve_name;
      params.reserve_mobile = values.reserve_mobile;
      params.reserve_time_start = reserve_time_start;
      params.reserve_time_end = reserve_time_end;
      params.community_id= layout.communityId;
      dispatch({
        type: 'OrderRoomManagementModel/rentReservePropertyList',
        payload: params
      })
    });
  }

  function handleReset (e) {
    form.resetFields();
    dispatch({
      type: 'OrderRoomManagementModel/rentReservePropertyList',
      payload: {community_id: layout.communityId,status:statusId}
    })
    dispatch({
      type: 'OrderRoomManagementModel/concat',
      payload: {
        params:{
          page: 1,
          rows: 10,
          member_name: '',
          member_mobile: '',
          status: statusId,
          reserve_name: '',
          reserve_mobile: '',
          community_id: layout.communityId,
          reserve_time_start: '',
          reserve_time_end: ''
        }
      }
    });
  }

  function handlePaginationChange (page) {
    params.page = page;
    params.community_id = layout.communityId;
    dispatch({
      type: 'OrderRoomManagementModel/rentReservePropertyList',
      payload: params
    })
  }

  function handleShowSizeChange (current, size) {
    params.page = 1;
    params.rows = size;
    params.community_id = layout.communityId;
    dispatch({
      type: 'OrderRoomManagementModel/rentReservePropertyList',
      payload: params
    })
  }

  //时间控件onchange
  function dataChange (date, dateString){
    dispatch({
      type: 'OrderRoomManagementModel/concat',
      payload: {
        reserve_time_start: dateString[0],
        reserve_time_end: dateString[1]
      }
    })
  }
  const columns = [{
    title: '预约编号',
    dataIndex: 'serial_no',
    key: 'serial_no'
  }, {
    title: '房屋信息',
    dataIndex: 'address',
    key: 'address'
  }, {
    title: '业主姓名',
    dataIndex: 'member_name',
    key: 'member_name'
  }, {
    title: '业主电话',
    dataIndex: 'member_mobile',
    key: 'member_mobile',
  }, {
    title: '预约人',
    dataIndex: 'reserve_name',
    key: 'reserve_name'
  }, {
    title: '联系电话',
    dataIndex: 'reserve_mobile',
    key: 'reserve_mobile'
  }, {
    title: '看房时间',
    dataIndex: 'reserve_time',
    key: 'reserve_time'
  }, {
    title: '状态',
    dataIndex: 'status_desc',
    key: 'status_desc'
  }, {
    title: '操作',
    dataIndex: 'desc',
    render: (text, record) => {
      let link2 = `/signRentalHouse?id=${record.id}`;
      let link1 = `/viewOrderRoom?id=${record.id}`;
      let marginStyle = { marginRight: 10 };
      if (record.status == 1) {
        return (
          <div>
            {author('signTakeLook') ? <a onClick={() => showSign(record.id)} style={marginStyle}>标记为已带看</a> : null}
            <Link to={link1} style={marginStyle}>查看详情</Link>
            {record.can_sign == 1 && author('signContract') ? <Link to={link2}>签约</Link> : ''}
          </div>
        )
      }else if(record.status == 2 || record.status == 3){
        return (
          <div>
            <Link to={link1} style={marginStyle}>查看详情</Link>
            {record.can_sign == 1 && author('signContract') ? <Link to={link2}>签约</Link> : ''}
          </div>
        )
      }else{
        return (
          <div>
            <Link to={link1}>查看详情</Link>
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
    // showSizeChanger: true,
    // showQuickJumper: true,
    current: params.page,
    pageSize: params.rows,
    onShowSizeChange: handleShowSizeChange,
    onChange: handlePaginationChange,
    // pageSizeOptions: ['10', '20', '30', '40'],
    defaultPageSize: 10,
    total: parseInt(totals),
    showTotal (total, range) {
      return `共 ${totals} 条`
    }
  };

  return (
    <div className="page-content">
      <Breadcrumb separator=">">
        <Breadcrumb.Item>租房管理</Breadcrumb.Item>
        <Breadcrumb.Item>预约看房管理</Breadcrumb.Item>
      </Breadcrumb>
      <Card className="section">
        <Form>
          <Row>
            <Col span={6}>
              <FormItem label="业主姓名：" {...formItemLayout}>
                {getFieldDecorator('member_name')(<Input placeholder="请输入业主姓名" />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="业主电话：" {...formItemLayout}>
                {getFieldDecorator('member_mobile')(<Input placeholder="请输入业主电话" />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="预约状态：" {...formItemLayout}>
                {getFieldDecorator('status', {initialValue: params.status ? parseInt(params.status)+'' : undefined})(
                  <Select placeholder="请选择预约状态">
                    {reserve_status.map((value, index) => {
                      return (
                        <Option key={index} value={`${value.key}`}>{value.value}</Option>
                      )
                    })}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="预约人：" {...formItemLayout}>
                {getFieldDecorator('reserve_name')(<Input placeholder="请输入预约人" />)}
              </FormItem>
            </Col>
          </Row>
          <Row >
            <Col span={6}>
              <FormItem label="预约人电话：" {...formItemLayout}>
                {getFieldDecorator('reserve_mobile')(<Input placeholder="请输入预约人电话" />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="看房时间：" {...formItemLayout2}>
                {getFieldDecorator('reserve_time')( <RangePicker style={{width:'96%'}} onChange={dataChange} /> )}
              </FormItem>
            </Col>
            <Col span={5} offset={1}>
              <Button type="primary" className="mr1" onClick={handSearch} >查询</Button>
              <Button type="ghost" onClick={handleReset}>重置</Button>
            </Col>
          </Row>
        </Form>
      </Card>
      <Card className="mt1">
        <Table columns={columns} className="mt1" pagination={pagination} dataSource={list} rowKey={record => record.key} loading={loading}/>
      </Card>
      <Modal title="标记为已带看" visible={sign} onOk={handleOk} onCancel={handleCancel} okText="确认" cancelText="取消">
        <Form>
          <FormItem {...formItemLayout} label="带看备注">
            {getFieldDecorator('take_look_note',
              { rules: [{
                type: 'string',
                pattern: /^[^ ]{1,200}$/,
                required: true,
                message: '请输入备注(请勿输入空格)'
              }]})(
              <Input type="text"/>
            )}
          </FormItem>
        </Form>
      </Modal>
    </div>
  )
}
export default connect(state => {
  return {
    OrderRoomManagementModel: state.OrderRoomManagementModel,
    layout: state.MainLayout
  }
})(Form.create({})(OrderRoomManagement));

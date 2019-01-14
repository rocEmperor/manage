import React from 'react';
import { connect } from 'react-redux';
import { Table, Breadcrumb, Card, Button, Input, Form, Row, Col, DatePicker } from 'antd';
const FormItem = Form.Item;
const { RangePicker } = DatePicker;

import { author } from '../../utils/util';
import Community from '../../components/Community/Community.js';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

function RentalIncome(props) {
  let { dispatch, layout, RentalIncomeModel, form } = props;
  let { list, totals, totalMoney, params, settle_time_start, settle_time_end, loading, is_reset } = RentalIncomeModel;
  let { getFieldDecorator } = form;
  if (is_reset == true) {
    form.resetFields();
    dispatch({
      type: 'RentalIncomeModel/concat',
      payload: {
        is_reset: false,
      }
    });
  }
  //搜索列表
  function handSearch(val) {
    form.validateFields((err, values) => {
      params.page = 1;
      params.rows = 10;
      params.bill_order_no = values.bill_order_no;
      params.group = values.group;
      params.building = values.building;
      params.unit = values.unit;
      params.room = values.room;
      params.settle_time_start = settle_time_start;
      params.settle_time_end = settle_time_end;
      dispatch({
        type: 'RentalIncomeModel/getIncomPropertyList',
        payload: { ...params }
      })
    });
  }

  function handleReset(e) {
    dispatch({
      type: 'RentalIncomeModel/concat',
      payload: {
        params: {
          page: 1,
          rows: 10,
          community_id: layout.communityId,
          bill_order_no: '',
          group: '',
          building: '',
          unit: '',
          room: '',
          settle_time_start: '',
          settle_time_end: ''
        }
      }
    });
    form.resetFields();
    dispatch({
      type: 'RentalIncomeModel/getIncomPropertyList',
      payload: {
        community_id: layout.communityId
      }
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

  function handlePaginationChange(page) {
    params.page = page;
    params.community_id = layout.communityId;
    dispatch({
      type: 'RentalIncomeModel/getIncomPropertyList',
      payload: params
    })
  }

  function handleShowSizeChange(current, size) {
    params.page = 1;
    params.rows = size;
    params.community_id = layout.communityId;
    dispatch({
      type: 'RentalIncomeModel/getIncomPropertyList',
      payload: params
    })
  }

  // 导出
  function handleExport() {
    form.validateFields((err, values) => {
      if (values.bill_order_no === undefined) {
        values.bill_order_no = ''
      }
      if (values.group === undefined) {
        values.group = ''
      }
      if (values.building === undefined) {
        values.building = ''
      }
      if (values.unit === undefined) {
        values.unit = ''
      }
      if (values.room === undefined) {
        values.room = ''
      }
      let dataList = {};
      dataList.bill_order_no = values.bill_order_no;
      dataList.building = values.building;
      dataList.group = values.group;
      dataList.unit = values.unit;
      dataList.room = values.room;
      dataList.community_id = layout.communityId;
      dataList.settle_time_start = settle_time_start;
      dataList.settle_time_end = settle_time_end;
      dispatch({
        type: 'RentalIncomeModel/propertyExport',
        payload: dataList
      })
    });
  }

  //时间控件onchange
  function dataChange(date, dateString) {
    dispatch({
      type: 'RentalIncomeModel/concat',
      payload: {
        settle_time_start: dateString[0],
        settle_time_end: dateString[1]
      }
    })
  }
  const columns = [{
    title: '订单编号',
    dataIndex: 'bill_order_no',
    key: 'bill_order_no'
  }, {
    title: '房屋信息',
    dataIndex: 'address',
    key: 'address',
    render: (text, record) => {
      return (
        <div>{record.group}{record.building}{record.unit}{record.room}</div>
      )
    }
  }, {
    title: '租金（元）',
    dataIndex: 'bill_amount',
    key: 'bill_amount'
  }, {
    title: '收益金额（元）',
    dataIndex: 'income_amount',
    key: 'income_amount'
  }, {
    title: '签约时间',
    dataIndex: 'settle_time',
    key: 'settle_time'
  }];

  const formItemLayout = {
    labelCol: {
      span: 6
    },
    wrapperCol: {
      span: 18
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
    showTotal(total, range) {
      return `总收益金额 ${totalMoney} 元,共 ${totals} 条`
    }
  }

  return (
    <div className="page-content">
      <Breadcrumb separator=">">
        <Breadcrumb.Item>租房管理</Breadcrumb.Item>
        <Breadcrumb.Item>租房收益</Breadcrumb.Item>
      </Breadcrumb>
      <Card className="section">
        <Form>
          <Row>
            <Col span={6}>
              <FormItem label="订单编号：" {...formItemLayout}>
                {getFieldDecorator('bill_order_no')(<Input placeholder="请输入订单编号" />)}
              </FormItem>
            </Col>
            <Community form={form} allDatas={{ group: {}, building: {}, unit: {}, room: {} }} />
          </Row>
          <Row>
            <Col span={12}>
              <FormItem label="签约时间：" {...formItemLayout2}>
                {getFieldDecorator('settle_time')(
                  <RangePicker
                    format="YYYY-MM-DD"
                    placeholder={['开始时间', '结束时间']}
                    style={{ width: '96%' }}
                    onChange={dataChange}
                  />)}
              </FormItem>
            </Col>
            <Col span={6} offset={2}>
              <Button type="primary" className="mr1" onClick={handSearch} >查询</Button>
              <Button type="ghost" onClick={handleReset}>重置</Button>
              {
                author('export')
                  ? <Button type="primary" onClick={handleExport} className="mr1" style={{ marginLeft: '10px' }} >导出</Button>
                  : null
              }
            </Col>
          </Row>
        </Form>
      </Card>
      <Card className="mt1">
        <Table columns={columns} className="mt1" pagination={pagination} dataSource={list} rowKey={record => record.id} loading={loading} />
      </Card>
    </div>
  )
}
export default connect(state => {
  return {
    RentalIncomeModel: state.RentalIncomeModel,
    layout: state.MainLayout
  }
})(Form.create({})(RentalIncome));


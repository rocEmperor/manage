import React from 'react';
import { connect } from 'dva';
import { message, Table, Breadcrumb, Card, Button, Select, Input, Form, Row, Col, Popconfirm, Alert, DatePicker } from 'antd';
import './index.css';
const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

let selectArr = [];
let query = {
  community_id: sessionStorage.getItem("communityId"),
  group: '',
  building: '',
  unit: '',
};

function Bills(props) {
  const { form, type, costType, statusType, billInfo, data, totals, params, dispatch, selectedRowKeys, selectedNum, selectedIds, groupData, buildingData, unitData, roomData } = props;
  const { getFieldDecorator, } = form;

  function reload(params) {
    dispatch({
      type: 'BillsTypeModel/getBillDetailList',
      payload: params,
    });

    // dispatch({
    //   type: 'BillsTypeModel/concat',
    //   payload: {
    //     params: { params }
    //   },
    // });

  }
  function handleReset() {
    form.resetFields();
    params.page = 1;
    params.rows = 10;
    params.community_id = sessionStorage.getItem("communityId");
    params.building = "";
    params.group = "";
    params.unit = "";
    params.room = "";
    params.year = "";
    params.acct_period_start = "";
    params.acct_period_end = "";
    params.pay_time_end = "";
    params.pay_time_start = "";
    params.status = "";
    params.trade_no = "";
    params.costList = [];
    params.source = type;
    form.validateFields((err, values) => {
      reload(params);
    })
  }
  function handSearch() {
    form.validateFields((err, values) => {
      const param = values;
      param.page = 1;
      param.rows = 10;
      param.source = type;
      let arr = [];
      costType.map(item => {
        if (values.costList != undefined) {
          values.costList.map(items => {
            if (items == item.label) {
              arr.push(item.key);
            }
          })
        }
      })
      param.community_id = sessionStorage.getItem("communityId");
      param.costList = arr;
      if (values.dateS && values.dateS.length > 0) {
        param.acct_period_start = values.dateS ? values.dateS[0].format('YYYY-MM-DD') : '';
        param.acct_period_end = values.dateS ? values.dateS[1].format('YYYY-MM-DD') : '';
      } else {
        param.acct_period_start = '';
        param.acct_period_end = '';
      }
      if (values.time && values.time.length > 0) {
        param.pay_time_start = values.time ? values.time[0].format('YYYY-MM-DD') : '';
        param.pay_time_end = values.time ? values.time[1].format('YYYY-MM-DD') : '';
      } else {
        param.pay_time_start = '';
        param.pay_time_end = '';
      }
      reload(param);
    })
  }
  function pageChange(page) {
    const param = { ...params, page };
    reload(param);
  }
  function handleExport() {
    let arr = [];
    costType.map(item => {
      if (params.costList != undefined) {
        params.costList.map(items => {
          if (items == item.label) {
            arr.push(item.key);
          }
        })
      }
    })
    params.costList = arr;

    if (totals == 0) {
      message.info('暂无账单数据');
    } else {
      dispatch({
        type: 'BillsTypeModel/exportBill',
        payload: params,
      })
    }
  }
  // 各搜索项列表获取
  function selectChange(mark, val) {
    query[mark] = val;
    query.community_id = sessionStorage.getItem("communityId");
    if (mark === 'group') {
      handleReset();
      form.resetFields(['room', 'unit', 'building']);
      query.building = undefined;
      query.unit = undefined;
      query.room = undefined;
      dispatch({
        type: 'BillsTypeModel/buildingList',
        payload: query
      })
    } else if (mark === 'building') {
      form.resetFields(['room', 'unit']);
      query.unit = undefined;
      query.room = undefined;
      dispatch({
        type: 'BillsTypeModel/unitList',
        payload: query
      })
    } else if (mark === 'unit') {
      form.resetFields(['room']);
      query.room = undefined;
      dispatch({
        type: 'BillsTypeModel/roomList',
        payload: query
      })
    }
  }
  function billsAllRemove() {
    dispatch({
      type: 'BillsTypeModel/removeAllData',
      payload: params,
    })
  }
  function billsRemove(bill_id) {
    let arr;
    if (bill_id) {
      arr = [bill_id];
    } else {
      if (selectedNum == 0) {
        message.error('请选择至少一条数据删除');
      } else {
        arr = selectedIds;
      }
    }
    dispatch({
      type: 'BillsTypeModel/removeBills',
      payload: {
        bill_list: arr,
        community_id: sessionStorage.getItem("communityId")
      },
    })
  }
  function BillsAllGenerate() {
    dispatch({
      type: 'BillsTypeModel/generateAllBill',
      payload: params,
    })
  }
  function BillsGenerate(bill_id) {
    let arr;
    if (bill_id) {
      arr = [bill_id];
    } else {
      if (selectedNum == 0) {
        message.error('请选择至少一条数据删除');
      } else {
        arr = selectedIds;
      }
    }
    dispatch({
      type: 'BillsTypeModel/generateBill',
      payload: {
        bill_list: arr,
        community_id: sessionStorage.getItem("communityId")
      },
    })
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      let selectedId = [];
      for (let i = 0; i < selectedRows.length; i++) {
        selectedId.push(selectedRows[i].bill_id);
      }
      dispatch({
        type: 'BillsTypeModel/concat',
        payload: {
          selectedRowKeys: selectedRowKeys,
          selectedNum: selectedRowKeys.length,
          selectedIds: selectedId
        },
      });
      selectArr = selectedRowKeys;
    },
    onSelect: (record, selected, selectedRows) => {
      dispatch({
        type: 'BillsTypeModel/concat',
        payload: {
          selectedNum: selectArr.length,
        },
      });
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      dispatch({
        type: 'BillsTypeModel/concat',
        payload: {
          selectedNum: selectArr.length,
        },
      });
    },
  };
  const columns = [
    {
      title: '苑/期/区',
      dataIndex: 'group',
      key: 'group',
    }, {
      title: '幢',
      dataIndex: 'building',
      key: 'building',
    }, {
      title: '单元',
      dataIndex: 'unit',
      key: 'unit',
    }, {
      title: '室',
      dataIndex: 'room',
      key: 'room',
    }, {
      title: '账期开始时间',
      dataIndex: 'acct_period_start',
      key: 'acct_period_start',
    }, {
      title: '账期结束时间',
      dataIndex: 'acct_period_end',
      key: 'acct_period_end',
    }, {
      title: '缴费项目',
      dataIndex: 'cost_name',
      key: 'cost_name',
    }, {
      title: '应缴金额',
      dataIndex: 'bill_entry_amount',
      key: 'bill_entry_amount',
    }, {
      title: '已缴金额',
      dataIndex: 'paid_entry_amount',
      key: 'paid_entry_amount',
    }, {
      title: '优惠金额',
      dataIndex: 'prefer_entry_amount',
      key: 'prefer_entry_amount',
    }, {
      title: '账单状态',
      dataIndex: 'status',
      key: 'status',
    }, {
      title: '上传时间',
      dataIndex: 'create_at',
      key: 'create_at',
    }, {
      title: '操作',
      key: 'action',
      dataIndex: 'action',
      render: (text, record) => {
        return (
          <span>
            <Popconfirm title="确定要删除这条待生成账单么？" onConfirm={billsRemove.bind(this, record.bill_id)}>
              <a className="mr1">删除</a>
            </Popconfirm>
            <a onClick={BillsGenerate.bind(this, record.bill_id)}>生成账单</a>
          </span>
        )
      }
    }];
  const columns1 = [
    {
      title: '苑/期/区',
      dataIndex: 'group',
      key: 'group',
    }, {
      title: '幢',
      dataIndex: 'building',
      key: 'building',
    }, {
      title: '单元',
      dataIndex: 'unit',
      key: 'unit',
    }, {
      title: '室',
      dataIndex: 'room',
      key: 'room',
    }, {
      title: '账期开始时间',
      dataIndex: 'acct_period_start',
      key: 'acct_period_start',
    }, {
      title: '账期结束时间',
      dataIndex: 'acct_period_end',
      key: 'acct_period_end',
    }, {
      title: '缴费项目',
      dataIndex: 'cost_name',
      key: 'cost_name',
    }, {
      title: '应缴金额',
      dataIndex: 'bill_entry_amount',
      key: 'bill_entry_amount',
    }, {
      title: '已缴金额',
      dataIndex: 'paid_entry_amount',
      key: 'paid_entry_amount',
    }, {
      title: '账单状态',
      dataIndex: 'status',
      key: 'status',
    }];
  const columns2 = [
    {
      title: '苑/期/区',
      dataIndex: 'group',
      key: 'group',
    }, {
      title: '幢',
      dataIndex: 'building',
      key: 'building',
    }, {
      title: '单元',
      dataIndex: 'unit',
      key: 'unit',
    }, {
      title: '室',
      dataIndex: 'room',
      key: 'room',
    }, {
      title: '账期开始时间',
      dataIndex: 'acct_period_start',
      key: 'acct_period_start',
    }, {
      title: '账期结束时间',
      dataIndex: 'acct_period_end',
      key: 'acct_period_end',
    }, {
      title: '缴费项目',
      dataIndex: 'cost_name',
      key: 'cost_name',
    }, {
      title: '应缴金额',
      dataIndex: 'bill_entry_amount',
      key: 'bill_entry_amount',
    }, {
      title: '已缴金额',
      dataIndex: 'paid_entry_amount',
      key: 'paid_entry_amount',
    }, {
      title: '账单状态',
      dataIndex: 'status',
      key: 'status',
    }, {
      title: '缴费时间',
      dataIndex: 'pay_time',
      key: 'pay_time',
    }];
  const columns3 = [
    {
      title: '苑/期/区',
      dataIndex: 'group',
      key: 'group',
    }, {
      title: '幢',
      dataIndex: 'building',
      key: 'building',
    }, {
      title: '单元',
      dataIndex: 'unit',
      key: 'unit',
    }, {
      title: '室',
      dataIndex: 'room',
      key: 'room',
    }, {
      title: '账期开始时间',
      dataIndex: 'acct_period_start',
      key: 'acct_period_start',
    }, {
      title: '账期结束时间',
      dataIndex: 'acct_period_end',
      key: 'acct_period_end',
    }, {
      title: '缴费项目',
      dataIndex: 'cost_name',
      key: 'cost_name',
    }, {
      title: '应缴金额',
      dataIndex: 'bill_entry_amount',
      key: 'bill_entry_amount',
    }, {
      title: '已缴金额',
      dataIndex: 'paid_entry_amount',
      key: 'paid_entry_amount',
    }, {
      title: '优惠金额',
      dataIndex: 'prefer_entry_amount',
      key: 'prefer_entry_amount',
    }, {
      title: '账单状态',
      dataIndex: 'status',
      key: 'status',
    }, {
      title: '缴费时间',
      dataIndex: 'pay_time',
      key: 'pay_time',
    }];
  const statisticalInfo =
    `共有 ${totals} 条
      应缴金额 ${billInfo.bill_entry_amount ? billInfo.bill_entry_amount : 0} 元，
      已缴金额 ${billInfo.paid_entry_amount ? billInfo.paid_entry_amount : 0} 元`;
  const PaginationProps = {
    total: +totals,
    current: params.page,
    defaultPageSize: 10,
    showTotal: (total) => `共${total}条`,
    onChange: pageChange,
  }
  const formItem = { labelCol: { span: 6 }, wrapperCol: { span: 16 } };
  const formItem1 = { labelCol: { span: 3 }, wrapperCol: { span: 21 } };
  return (
    <div>
      <Breadcrumb separator=">">
        <Breadcrumb.Item>收费管理</Breadcrumb.Item>
        <Breadcrumb.Item><a href="#/billManage">账单管理</a></Breadcrumb.Item>
        <Breadcrumb.Item>{type == 1 ? '应收' : (type == 2 ? '已收' : (type == 3 ? '优惠' : (type == 4 ? '待收' : '待生成')))}账单</Breadcrumb.Item>
      </Breadcrumb>
      <Card className="section">
        <Form>
          <Row>
            <Col span={6}>
              <Form.Item label="房屋信息:" style={{ marginBottom: 20 }} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
                {getFieldDecorator('group', {
                  initialValue: params.group == '' || params.group == 'undefined' ? undefined : params.group
                })(
                  <Select className="mr-5"
                    placeholder="苑\期\区"
                    showSearch={true}
                    notFoundContent="没有数据"
                    onChange={(val) => selectChange('group', val)}>
                    {groupData.map((value, index) => {
                      return <Option key={index} value={value.name}>{value.name}</Option>
                    })}
                  </Select>)}
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item style={{ marginBottom: 20 }} wrapperCol={{ span: 24 }}>
                {getFieldDecorator('building', {
                  initialValue: params.building == '' || params.building == 'undefined' ? undefined : params.building
                })(
                  <Select className="select-100 mr-5"
                    placeholder="幢"
                    showSearch={true}
                    notFoundContent="没有数据"
                    onChange={(val) => selectChange('building', val)}>
                    {buildingData.map((value, index) => {
                      return <Option key={index} value={value.name}>{value.name}</Option>
                    })}
                  </Select>)}
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item style={{ marginBottom: 20 }} wrapperCol={{ span: 24 }}>
                {getFieldDecorator('unit', {
                  initialValue: params.unit == '' || params.unit == 'undefined' ? undefined : params.unit
                })(
                  <Select className="select-100 mr-5"
                    placeholder="单元"
                    showSearch={true}
                    notFoundContent="没有数据"
                    onChange={(val) => selectChange('unit', val)}>
                    {unitData.map((value, index) => {
                      return <Option key={index} value={value.name}>{value.name}</Option>
                    })}
                  </Select>)}
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item style={{ marginBottom: 20 }} wrapperCol={{ span: 24 }}>
                {getFieldDecorator('room', {
                  initialValue: params.room == '' || params.room == 'undefined' ? undefined : params.room
                })(
                  <Select className="select-100 mr-5"
                    placeholder="室"
                    showSearch={true}
                    notFoundContent="没有数据">
                    {roomData.map((value, index) => {
                      return <Option key={index} value={value.name}>{value.name}</Option>
                    })}
                  </Select>)}
              </Form.Item>
            </Col>
            <Col span={6}>
              <FormItem label="收费项目" {...formItem}>
                {getFieldDecorator('costList', { initialValue: params.costList != "" ? params.costList : [] })(
                  <Select mode="multiple" placeholder="请选择收费项目" style={{ width: 200 }}>
                    {
                      costType.map((value, index) => {
                        return <Option key={value.key} value={value.label}>{value.label}</Option>
                      })
                    }
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            {type != 5 ?
              <Col span={6}>
                <Form.Item label="账单状态" {...formItem}>
                  {getFieldDecorator('status')(
                    <Select placeholder="请选择账单状态">
                      {statusType.map((value, index) =>
                        <Option key={value.key} value={value.key.toString()}>{value.value}</Option>
                      )}
                    </Select>)
                  }
                </Form.Item>
              </Col>
              : null
            }
            <Col span={6}>
              <Form.Item label="交易流水号" {...formItem}>
                {getFieldDecorator('trade_no')(<Input placeholder="请输入交易流水号" />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="账  期" {...formItem1}>
                {getFieldDecorator('dateS')(<RangePicker style={{ width: '96%' }} />)}
              </Form.Item>
            </Col>
            {
              type == 4 ? null :
                <Col span={12}>
                  <Form.Item label={type == 5 ? '上传时间' : '缴费时间'} {...formItem1}>
                    {getFieldDecorator('time')(<RangePicker style={{ width: '96%' }} />)}
                  </Form.Item>
                </Col>
            }

            <Col span={6} className="fr">
              <Button type="primary" onClick={handSearch}>查询</Button>
              <Button className="ml1" type="ghost" onClick={handleReset}>重置</Button>
            </Col>
          </Row>
        </Form>
      </Card>
      <Card className="section">
        <div className="btn-group-left">
          <Button className="mr1" type="primary" onClick={handleExport}>导出账单</Button>
          {type == 5 ?
            <Popconfirm title="确定要删除全部数据吗？" onConfirm={billsAllRemove}>
              <Button className="mr1">全部删除</Button>
            </Popconfirm>
            : null}
          {type == 5 ? <Button className="mr1" onClick={billsRemove.bind(this, '')}>批量删除</Button> : null}
          {type == 5 ?
            <Popconfirm title="确定要生成全部账单吗？" onConfirm={BillsAllGenerate}>
              <Button className="mr1">全部生成</Button>
            </Popconfirm>
            : null}
          {type == 5 ? <Button onClick={BillsGenerate.bind(this, '')}>批量生成</Button> : null}
        </div>
        <h4 style={{ marginTop: '10px', marginBottom: '10px' }}>{statisticalInfo}</h4>
        {type == 5 ? <Alert message={`已选择${selectedNum}条数据`} type="info" showIcon /> : null}
        <Table rowSelection={type == 5 ? rowSelection : null} columns={type == 1 ? columns2 : (type == 2 ? columns2 : (type == 3 ? columns3 : (type == 4 ? columns1 : columns)))} dataSource={data} pagination={PaginationProps} rowKey={record => record.bill_id} />
      </Card>
    </div>
  )
}

function mapStateToProps(state) {
  return {
    ...state.BillsTypeModel,
  }
}
export default connect(mapStateToProps)(Form.create()(Bills));
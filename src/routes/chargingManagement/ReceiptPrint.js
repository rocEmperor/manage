import React from 'react';
import { connect } from 'dva';
import Print from "../../components/Print/";
import { getCommunityId } from '../../utils/util';
import { Table, Breadcrumb, Card, Select, Button, Form, message, DatePicker, Alert, Spin, Col, Row } from 'antd';
const Option = Select.Option;
const { RangePicker } = DatePicker;
const columnsList = {
  chargingItem: '收费项目',
  billDate: '帐期',
  chargingAmount: '计费用量',
  money: '金额',
  favourableMoney: '优惠金额',
  shouldTotal: '应交小计（元）',
  thisPay: '本次付款（元）',
  MTC: '收费方式'
};
let query={
  community_id: getCommunityId(),
  group: '',
  building: '',
  unit: '',
};
let selectArr = [];
function ReceiptPrint (props) {
  let { dispatch, form, ReceiptPrintModel } = props;
  let {is_reset} = ReceiptPrintModel
  if (is_reset == true) {
    form.resetFields();
    dispatch({
      type: 'ReceiptPrintModel/concat',
      payload: {
        is_reset: false,
      }
    });
  }
  let {
    endTime,
    startTime,
    visible,
    loading,
    selectedNum,
    selectDataSource,
    data,
    roomsData,
    costType,
    groupData,
    buildingData,
    unitData,
    roomData,
    info, bill_list, reportData, selectedRowKeys} = ReceiptPrintModel;
  let { getFieldDecorator } = form;
  function showModal () {
    if (data.length !== 0) {
      let flag = true;
      if (selectArr.length === 0) {
        message.destroy();
        message.info("请选择账单！");
        return;
      } else {
        if (flag) {
          let parma = {
            bill_list: selectArr,
            community_id: query.community_id,
            room_id: roomsData.room_id,
          };
          dispatch({
            type: 'ReceiptPrintModel/concat',
            payload: { visible: true }
          });
          dispatch({
            type: 'ReceiptPrintModel/getPrintBill',
            payload: parma
          })
        }
      }
    }
  }
  function handleBack () {
    // history.back();
    selectArr = [];
    dispatch({
      type: 'ReceiptPrintModel/concat',
      payload: {
        selectedNum: 0,
        selectedRowKeys: [],
        selectDataSource: []
      }
    })
  }
  function hide () {
    dispatch({
      type: 'ReceiptPrintModel/concat',
      payload: {
        visible: false
      }
    })
  }
  // 搜索按钮
  function handSearch (val) {
    form.validateFields((err, values) => {
      let arr = [];
      costType.map((item) => {
        if (values.cost_list !== undefined) {
          values.cost_list.map((items) => {
            if (items == item.label) {
              arr.push(item.key);
            }
          })
        }
      });
      if(err){ return }
      dispatch({
        type: 'ReceiptPrintModel/concat',
        payload: {
          current: 1,
          searchLoading: true
        }
      });
      dispatch({
        type: 'ReceiptPrintModel/getList',
        payload: {
          community_id: getCommunityId(),
          group: values.group,
          unit: values.unit,
          building: values.building,
          room: values.room,
          cost_list: arr,
          // model_type:values.model_type,
          acct_period_end: endTime,
          acct_period_start: startTime
        },
        callback: true
      })
    });
  }

  // 搜索重置
  function handleReset (e) {
    selectArr = [];
    dispatch({
      type: 'ReceiptPrintModel/concat',
      payload: {
        searchLoading: false,                   // 搜索按钮状态
        tableType: '',                           // 搜索结果table的显示类型，1：按单元收缴table 2:按户收缴table
        startTime: '',                            // 开始时间
        endTime: '',                              // 结束时间
        printShow1: false,
        printShow2: false,
        data: [],                                  // 存储按户收缴数据
        selectedNum: 0,
        selectedRowKeys: [],
        selectDataSource: []
      }
    });
    form.resetFields();
    dispatch({
      type: 'ReceiptPrintModel/concat',
      payload: {
        submitLoading: false,
        totals: 0,
        data: [],              // 账单列表
        roomsData: {},
        reportData: {}
      }
    })
  }
  // 各搜索项列表获取
  function selectChange (mark, val) {
    query[mark] = val;
    query.community_id = getCommunityId();
    if (mark === 'group') {
      handleReset();
      form.resetFields(['room', 'unit', 'building']);
      query.building = undefined;
      query.unit = undefined;
      query.room = undefined;
      dispatch({
        type: 'ReceiptPrintModel/buildingList',
        payload: query
      })
    } else if (mark === 'building') {
      form.resetFields(['room', 'unit']);
      query.unit = undefined;
      query.room = undefined;
      dispatch({
        type: 'ReceiptPrintModel/unitList',
        payload: query
      })
    } else if (mark === 'unit') {
      form.resetFields(['room']);
      query.room = undefined;
      dispatch({
        type: 'ReceiptPrintModel/roomList',
        payload: query
      })
    }
  }
  // 时间控件change
  function timeChange (date, dateString) {
    dispatch({
      type: 'ReceiptPrintModel/concat',
      payload: {
        startTime: dateString[0],
        endTime: dateString[1]
      }
    })
  }
  function number () {
    dispatch({
      type: 'ReceiptPrintModel/numberPlus',
      payload: { community_id: getCommunityId() }
    })
  }
  const noData = (text, record) => {
    return (
      <span>{text ? text : '-'}</span>
    )
  };
  function createPrintTable () {
    let result = { columns: [], dataSource: [] };
    for (let k in columnsList) {
      result.columns.push({
        title: columnsList[k],
        dataIndex: k,
        key: k
      })
    }
    bill_list.map((value, index) => {
      result.dataSource.push({
        key: `${index}`,
        chargingItem: value.cost_name,
        billDate: value.acct_period_time_msg,
        chargingAmount: value.use_ton,
        thisPay: value.paid_entry_amount,
        MTC: value.pay_channel,
        money: value.bill_entry_amount,
        favourableMoney: value.prefer_entry_amount,
        shouldTotal: value.paid_entry_amount
      })
    });
    return result;
  }
  const columns = [{
    title: '账期',
    dataIndex: 'acct_period_time_msg',
    key: 'acct_period_time_msg',
  }, {
    title: '应缴金额',
    dataIndex: 'bill_entry_amount',
    key: 'bill_entry_amount',
    render: noData,
  }, {
    title: '实收金额',
    dataIndex: 'paid_entry_amount',
    key: 'paid_entry_amount',
  },{
    title: '缴费方式',
    dataIndex: 'pay_channel',
    key: 'pay_channel',
  }];

  const columns1 = [{
    title: '账期',
    dataIndex: 'acct_period_time_msg',
    key: 'acct_period_time_msg',
  },{
    title: '用水量(吨)',
    dataIndex: 'use_ton',
    key: 'use_ton',
  },{
    title: '起始度数',
    dataIndex: 'latest_ton',
    key: 'latest_ton',
  }, {
    title: '应缴金额',
    dataIndex: 'bill_entry_amount',
    key: 'bill_entry_amount',
    render: noData,
  }, {
    title: '实收金额',
    dataIndex: 'paid_entry_amount',
    key: 'paid_entry_amount',
  },{
    title: '缴费方式',
    dataIndex: 'pay_channel',
    key: 'pay_channel',
  }];

  const columns2 = [{
    title: '账期',
    dataIndex: 'acct_period_time_msg',
    key: 'acct_period_time_msg',
  },{
    title: '用电量(度)',
    dataIndex: 'use_ton',
    key: 'use_ton',
  },{
    title: '起始度数',
    dataIndex: 'latest_ton',
    key: 'latest_ton',
  }, {
    title: '应缴金额(元)',
    dataIndex: 'bill_entry_amount',
    key: 'bill_entry_amount',
    render: noData,
  }, {
    title: '实收金额(元)',
    dataIndex: 'paid_entry_amount',
    key: 'paid_entry_amount',
  },{
    title: '缴费方式',
    dataIndex: 'pay_channel',
    key: 'pay_channel',
  }];

  let formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 }
  };
  let formItemLayout2 = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 }
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      let arr1, arr2 = [];
      if (selectDataSource.length == 0) {
        selectedRows.map((item) => {
          if (item.paid_entry_amount === undefined) {
            item.paid_entry_amount = item.bill_entry_amount;
          }
        });
        dispatch({
          type: 'ReceiptPrintModel/concat',
          payload: { selectDataSource:selectedRows }
        })
      } else {
        selectDataSource.map((item) => {
          selectedRows.map((items, indexs) => {
            if (items.bill_id == item.bill_id) {
              selectedRows.splice(indexs, 1);
            }
          })
        });
        arr1 = selectDataSource.concat(selectedRows);

        selectedRowKeys.map((item) => {
          arr1.map((items) => {
            if (items.bill_id == item) {
              if(items.paid_entry_amount === undefined){
                items.paid_entry_amount = items.bill_entry_amount;
              }
              arr2.push(items);
            }
          })
        });
        dispatch({
          type: 'ReceiptPrintModel/concat',
          payload: { selectDataSource: arr2 }
        })
      }

      data.map((item, index) => {
        item.list.map((val, indx) => {
          val.disabled = false;
          selectedRowKeys.map((value, indexs) => {
            if(val.bill_id === value){
              val.disabled = true;
            }
          })
        })
      });
      dispatch({
        type: 'ReceiptPrintModel/concat',
        payload: { selectedRowKeys: selectedRowKeys }
      });
      selectArr = selectedRowKeys;
    },
    onSelect: (record, selected, selectedRows) => {
      dispatch({
        type: 'ReceiptPrintModel/concat',
        payload: { selectedNum: selectArr.length }
      });
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      dispatch({
        type: 'ReceiptPrintModel/concat',
        payload: { selectedNum: selectArr.length, flag: true }
      });
    },
    getCheckboxProps: record => ({
      disabled: record.name === 'Disabled User'
    }),
  };
  return (
    <div className="page-content">
      <Breadcrumb separator=">">
        <Breadcrumb.Item>收费管理</Breadcrumb.Item>
        <Breadcrumb.Item>收款收据打印</Breadcrumb.Item>
      </Breadcrumb>
      <Card className="section" style={{padding: 0}}>
        <Form>
          <Row>
            <Col span={6}>
              <Form.Item label="关联房屋:" style={{ marginBottom: 20 }} labelCol={{ span: 8 }} wrapperCol={{ span: 15 }}>
                {getFieldDecorator('group', {rules: [{required: true, message: "请选择"}]})(
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
              <Form.Item  style={{marginBottom: 20}} wrapperCol={{span: 24}}>
                {getFieldDecorator('building', {rules: [{required: true, message: "请选择"}]})(
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
              <Form.Item  style={{marginBottom: 20}} wrapperCol={{span: 24}}>
                {getFieldDecorator('unit', {rules: [{ required: true, message: "请选择" }]})(
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
              <Form.Item  style={{marginBottom: 20}} wrapperCol={{span: 24}}>
                {getFieldDecorator('room', { rules: [{ required: true, message: "请选择" }]})(
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
              <Form.Item label="收费项目：" style={{ marginBottom: 20 }} {...formItemLayout}>
                {getFieldDecorator('cost_list')(
                  <Select mode="multiple" placeholder="请选择收费项目">
                    {
                      costType.map((value, index)=>{
                        return <Option key={value.key} value={value.label}>{value.label}</Option>
                      })
                    }
                  </Select>)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label="账期：" {...formItemLayout2}>
                {getFieldDecorator('time')(
                  <RangePicker onChange={timeChange} style={{ width: '96%' }} />
                )}
              </Form.Item>
            </Col>
            <Col span={4} offset={8}>
              <Button type="primary" onClick={handSearch}>查询</Button>
              <Button type="ghost" onClick={handleReset} style={{ marginLeft: 15 }}>重置</Button>
            </Col>
          </Row>
        </Form>
      </Card>
      <Card className="section" style={{padding: 0}}>
        <h2>{roomsData.community_name}{roomsData.group}{roomsData.building}{roomsData.unit}{roomsData.room}</h2>
        <h3 style={{margin: '5px 0 40px 0'}}>
          已缴金额: {reportData.paid_entry_amount ? reportData.paid_entry_amount : 0}元,
          共缴费：{reportData.total_num ? reportData.total_num : 0}笔
        </h3>
        <Alert message={`已选择${selectedNum}条数据`} type="info" showIcon/>
        {
          data.map((item, index) => {
            return (
              <Card style={{marginBottom: 25}} key={index}>
                <h2 style={{marginBottom: 15}}>{item.cost_name}</h2>
                <Spin tip="Loading..." size="large" spinning={loading}>
                  <Table rowSelection={rowSelection}
                    dataSource={item.list}
                    columns={item.cost_name === '水费' ? columns1 : (item.cost_name === '电费' ? columns2 : columns)}
                    rowKey={record => record.bill_id}
                    pagination={false}
                  />
                  {/* <Pagination {...PaginationProps} className="fr mtb1"/> */}
                </Spin>
              </Card>
            )
          })
        }
        {selectArr.length > 0
          ? <div className="btn-group-left" style={{marginTop: 10, textAlign: 'center'}}>
            <Button type="primary" onClick={showModal} style={{marginRight: 15}}>确认选择</Button>
            <Button onClick={handleBack}>取消</Button>
          </div>
          : null}
        <Print
          visible={visible}
          bill_list={bill_list}
          info={info}
          hide={hide}
          number={number}
          columns={createPrintTable().columns}
          dataSource={createPrintTable().dataSource}
          printType="receiptPrint"
        />
      </Card>
    </div>
  )
}

export default connect(state => {
  return {
    layout: state.MainLayout,
    ReceiptPrintModel: state.ReceiptPrintModel,
  }
})(Form.create({})(ReceiptPrint));

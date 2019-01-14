import React from 'react';
import { connect } from 'dva';
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import Print from '../../components/Print/';
import Modes from './components/billManage/CollectionsModal';
import Lock from './components/billManage/CollectionsErrorModal';
import Community from '../../components/Community/Community';
import { getCommunityId } from '../../utils/util';
import { Table, Breadcrumb, Card, Select, Button, Input, Form, message, Spin, Alert, Row } from 'antd';
import styles from './index.css';
const columnsListPrint = {
  chargingItem: '收费项目',
  billDate: '帐期',
  chargingAmount: '计费用量',
  money: '金额',
  favourableMoney: '优惠金额',
  shouldTotal: '应交小计（元）',
  thisPay: '本次付款（元）',
  MTC: '收费方式'
};
const FormItem = Form.Item;
const Option = Select.Option;
let sending = true;
let queryList = {
  community_id: getCommunityId(),
  group: '',
  building: '',
  unit: ''
};
let selectArr = [];

function Collections(props) {
  let { dispatch, CollectionsModel, layout, form, location } = props;
  let { selectedNum, selectedRowKeys, selectDataSource, data, loading,
    info, typeOption, visible, visible2, visible1, payType, roomsData, reportData, info2, bill_list, lockArr, success_count, defeat_count } = CollectionsModel;
  let { getFieldDecorator } = form;
  let query = queryString.parse(location.search);
  const formItemLayout = {
    labelCol: {
      span: 6
    },
    wrapperCol: {
      span: 18
    },
  };

  function handleBack() {
    selectArr = [];
    history.back();
  }
  function hide() {
    queryList.room_id = query.id;
    dispatch({
      type: 'CollectionsModel/getList',
      payload: queryList
    });
    dispatch({
      type: 'CollectionsModel/visibleChange',
      payload: {
        name: 'hide',
        type: 2
      }
    });
    handleReset();
  }
  // 搜索按钮
  function handSearch(val) {
    dispatch({
      type: 'CollectionsModel/concat',
      payload: {
        current: 1,
        searchLoading: true,
        selectedRowKeys: [],
        selectedNum: 0,
        selectDataSource: []
      }
    });
    selectArr = '';
    form.validateFields((err, values) => {
      let { group, unit, room, building } = values;
      queryList.group = group;
      queryList.building = building;
      queryList.unit = unit;
      queryList.room = room;
      dispatch({
        type: 'CollectionsModel/getList',
        payload: {
          community_id: layout.communityId,
          group,
          unit,
          room,
          building,
        },
        callback: true
      })
    });
  }

  function handleReset(e) {
    dispatch({
      type: 'CollectionsModel/concat',
      payload: {
        current: 1,
        selectedRowKeys: [],
        selectedNum: 0
      }
    });
    selectArr = '';
    form.resetFields(['group', 'unit', 'room', 'building']);
    dispatch({                       // 重置页面，恢复初始状态
      type: 'CollectionsModel/concat',
      payload: {
        page: 1,
        loading: false,
        submitLoading: false,
        totals: 0,
        data: [],
        info: [],
        visible: false,
        visible2: false
      }
    });
  }

  function showModal() {
    if (data.length !== 0) {
      let flag = true;
      data.map((item) => {
        if (item.list.length !== 0) {
          item.list.map((items) => {
            selectedRowKeys.map((itm) => {
              if (items.bill_id === itm) {
                form.validateFields([`paid_entry_amount_${items.bill_id}`], (err, values) => {
                  if ((values[`paid_entry_amount_${items.bill_id}`] == items.bill_entry_amount) && items.paid_way == 2) {
                    message.info('应缴金额等于实收金额时不能分次付清');
                    flag = false;
                  }
                  if (err) {
                    flag = false;
                  }
                })
              }
            })
          })
        }
      });
      if (selectArr.length === 0) {
        message.destroy();
        message.info("请选择收款账单！");
        return;
      } else {
        if (flag) {
          dispatch({
            type: 'CollectionsModel/visibleChange',
            payload: {
              name: 'show',
              type: 1
            }
          })
        }
      }
    }
  }

  function changeSelect(id, val) {
    for (let i = 0; i < selectDataSource.length; i++) {
      if (selectDataSource[i].bill_id === id) {
        selectDataSource[i].paid_entry_amount = val.target.value;
      }
    }
  }
  function changeType(id, index, val) {
    for (let j = 0; j < selectDataSource.length; j++) {
      if (selectDataSource[j].bill_id === id) {
        selectDataSource[j].paid_way = val;
      }
    }
  }
  function number() {
    dispatch({
      type: 'CollectionsModel/numberPlus',
      payload: { community_id: getCommunityId() }
    })
  }
  function createSelectFn(record, index) {
    return (
      <div>
        <form>
          <FormItem {...formItemLayout}>
            {getFieldDecorator(`paid_way_${record.bill_id}`, { initialValue: `${payType[0].key}` })(
              <Select type="text" style={{ width: 120 }} onChange={(val) => changeType(record.bill_id, index, val)}>
                {Options}
              </Select>
            )}
          </FormItem>
        </form>
      </div>
    )
  }
  function createInputFn(record, index) {
    return (
      <div>
        <form>
          <FormItem {...formItemLayout}>
            {getFieldDecorator(`paid_entry_amount_${record.bill_id}`, {
              rules: [{
                required: true,
                pattern: /(^[1-9]([0-9]){1,4}\.\d{1,2}$)|(^[1-9]{1,5}\.\d{1,2}$)|(^0\.\d[1-9]$)|(^0\.[1-9]\d?$)|(^[1-9]{1,5}$)|(^[1-9]([0-9]){1,4}$)/,
                message: '请输入金额(正整数或小数点后两位)'
              }],
              initialValue: record.bill_entry_amount
            })(
              <Input type="text" style={{ width: 120 }} disabled={!record.disabled} onChange={(val) => changeSelect(record.bill_id, val)} />
            )}
          </FormItem>
        </form>
      </div>
    )
  }
  function createColumnsFn(list, target, type) {
    let curList = { ...list };
    if (type === 0) {
      delete curList.use_ton;
      delete curList.latest_ton;
    } else if (type === 1) {
      curList.use_ton = '用水量(吨)'
    } else if (type === 2) {
      curList.use_ton = '用电量(度)'
    }
    for (let k in curList) {
      let obj = { title: curList[k], dataIndex: k, key: k };
      if (k === 'paid_entry_amount') {
        obj.render = (text, record, index) => {
          return createInputFn(record, index)
        };
      }
      if (k === 'paid_way') {
        obj.render = (text, record, index) => {
          let paid_way = form.getFieldValue(`paid_way_${record.bill_id}`);
          record.paid_way = paid_way ? paid_way : `${payType[0].key}`;
          return createSelectFn(record, index);
        };
      }
      target.push(obj)
    }
  }
  function createPrintTable() {
    let result = { columns: [], dataSource: [] };
    for (let k in columnsListPrint) {
      result.columns.push({
        title: columnsListPrint[k],
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
  function sendingChange(result) {
    selectArr = [];
    sending = result
  }
  const Options = payType.map((item, index) => {
    return <Option key={index} value={`${item.key}`}>{item.value}</Option>
  });
  let columnsList = {
    acct_period_time_msg: '账期',
    use_ton: '',
    latest_ton: '起始度数',
    bill_entry_amount: '应缴金额',
    paid_entry_amount: '实收金额',
    paid_way: '缴费方式'
  };
  let columns = [];
  let columns1 = [];
  let columns2 = [];
  createColumnsFn(columnsList, columns, 0);
  createColumnsFn(columnsList, columns1, 1);
  createColumnsFn(columnsList, columns2, 2);

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      let arr1, arr2 = [];
      if (selectDataSource.length === 0) {
        selectedRows.map((item) => {
          if (item.paid_entry_amount === undefined) {
            item.paid_entry_amount = item.bill_entry_amount;
          }
        });
        dispatch({
          type: 'CollectionsModel/concat',
          payload: { selectDataSource: selectedRows }
        });
      } else {
        selectDataSource.map((item) => {
          selectedRows.map((items, indexs) => {
            if (items.bill_id === item.bill_id) {
              selectedRows.splice(indexs, 1);
            }
          })
        });
        arr1 = selectDataSource.concat(selectedRows);
        selectedRowKeys.map((item) => {
          arr1.map((items) => {
            if (items.bill_id === item) {
              if (items.paid_entry_amount === undefined) {
                items.paid_entry_amount = items.bill_entry_amount;
              }
              arr2.push(items);
            }
          })
        });
        dispatch({
          type: 'CollectionsModel/concat',
          payload: { selectDataSource: arr2 }
        });
      }
      data.map((item, index) => {
        item.list.map((val, indx) => {
          val.disabled = false;
          selectedRowKeys.map((value, indexs) => {
            if (val.bill_id === value) {
              val.disabled = true;
            }
          })
        })
      });
      dispatch({
        type: 'CollectionsModel/concat',
        payload: { selectedRowKeys: selectedRowKeys }
      });
      selectArr = selectedRowKeys;
    },
    onSelect: () => {
      dispatch({
        type: 'CollectionsModel/concat',
        payload: { selectedNum: selectArr.length }
      });
    },
    onSelectAll: () => {
      dispatch({
        type: 'CollectionsModel/concat',
        payload: {
          selectedNum: selectArr.length,
          flag: true
        }
      });
    },
    getCheckboxProps: record => ({
      disabled: record.name === 'Disabled User'
    }),
  };
  return (
    <div className="page-content">
      <Breadcrumb separator=">">
        {query.type === 'index' ? <Breadcrumb.Item>首页</Breadcrumb.Item> : <Breadcrumb.Item>收费管理</Breadcrumb.Item>}
        {query.type === 'index'
          ? <Breadcrumb.Item>线下收款</Breadcrumb.Item>
          : <Breadcrumb.Item><Link to="/billManage">账单管理</Link></Breadcrumb.Item>}
        {query.type !== 'index'
          ? <Breadcrumb.Item><Link to={`/billsView?id=${query.id}`}>账单详情</Link></Breadcrumb.Item>
          : null}
        {query.type !== 'index' ? <Breadcrumb.Item>线下收款</Breadcrumb.Item> : null}
      </Breadcrumb>
      {query.type === 'index'
        ? <Card className="section section_coll" style={{ padding: 0 }}>
          <Form>
            <Row>
              <Community form={form}
                allDatas={{
                  group: { label: '房屋：' },
                  building: {},
                  unit: {},
                  room: {}
                }}
              />

              <div className="fr">
                
                <Button type="primary" onClick={handSearch} className={styles['btn-group-right-btn']}>查询</Button>
                <Button type="ghost" onClick={handleReset} className="ml1">重置</Button>
              </div>
            </Row>
          </Form>
        </Card>
        : null}

      <Card className="section section_table">
        <h2 className={styles['til-1']} style={{ margin: '15px 0 0 15px' }}>{roomsData.community_name}{roomsData.group}{roomsData.building}{roomsData.unit}{roomsData.room}</h2>
        <h3 style={{ margin: '5px 0 40px 15px' }} className={styles['til-2']}>
          应收金额：{reportData.bill_entry_amount ? reportData.bill_entry_amount : 0}元,
          已缴金额: {reportData.paid_entry_amount ? reportData.paid_entry_amount : 0}元,
          欠费金额：{reportData.owe_entry_amount ? reportData.owe_entry_amount : 0}元
        </h3>
        <Alert message={`已选择${selectedNum}条数据`} type="info" showIcon />
        {data.map((item, index) => {
          return (
            <Card style={{ marginBottom: '25px' }} key={index} className="enrty_card">
              <h2 style={{ marginBottom: '15px' }} className={styles['til-1']}>{item.cost_name}</h2>
              <Spin tip="Loading..." size="large" spinning={loading}>
                <Table rowSelection={rowSelection}
                  dataSource={item.list}
                  columns={item.cost_name === '水费' ? columns1 : (item.cost_name === '电费' ? columns2 : columns)}
                  rowKey={record => record.bill_id} pagination={false} />
              </Spin>
            </Card>
          )
        })}
        {selectArr.length > 0
          ? <div className="btn-group-left" style={{ marginTop: 10, textAlign: 'center', height: 35 }}>
            <Button type="primary" onClick={showModal}>确认选择</Button>
            <Button onClick={handleBack} style={{ marginLeft: 15 }}>取消</Button>
          </div>
          : null}
        <Modes
          props={props}
          payType={payType}
          roomDataList={roomsData}
          selectedData={selectDataSource}
          roomId={query.id}
          selectedRows={selectDataSource}
          typeOption={typeOption}
          visible={visible}
          sending={sending}
          selectArr={selectArr}
          sendingChange={sendingChange}
          billId={info.out_room_id}
        />
        <Lock
          props={props}
          lockArr={lockArr}
          roomId={query.id}
          visible={visible1}
          sending={sending}
          queryList={queryList}
          sendingChange={sendingChange}
          defeat_count={defeat_count}
          success_count={success_count}
        />
        <Print
          visible={visible2}
          bill_list={bill_list}
          info={info2}
          hide={hide}
          number={number}
          printType="receiptPrint"
          columns={createPrintTable().columns}
          dataSource={createPrintTable().dataSource}
        />
      </Card>
    </div>
  )
}

export default connect(state => {
  return {
    CollectionsModel: state.CollectionsModel,
    layout: state.MainLayout
  }
})(Form.create({})(Collections));

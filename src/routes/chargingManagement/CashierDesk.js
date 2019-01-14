import React from 'react';
import { connect } from 'dva';
import { Breadcrumb, Card, Form, Col, Button, Table, Input, Select, message } from 'antd';
import { Link } from 'react-router-dom';
import Print from '../../components/Print/';
import Lock from './components/cashierDesk/billLockModal';
import Community from '../../components/Community/Community';
import GatheringModal from './components/cashierDesk/gatheringModal';
import { getCommunityId, toInteger, author } from '../../utils/util'
import './index.css';
const Option = Select.Option;
const FormItem = Form.Item;
let queryList = {
  community_id: getCommunityId(),
  group: '',
  building: '',
  unit: ''
};

function CashierDesk (props) {
  let { form, CashierDeskModel, dispatch, layout } = props;
  let { getFieldDecorator } = form;
  let { loading, data, payableTotal, typeOption, checkIdsList, modalData, visible, dataObj, collectTotal, defeat_count, visibleLook, gatheringLoading1, gatheringLoading2,
    checkValueList, favourableTotal, unpaidTotal, visiblePrint, payType, reportData, roomsData, tableKey, lockArr, success_count, selectedRowKeys, templateList, dataSource } = CashierDeskModel;
  const formItemLayout = {
    labelCol: {
      span: 6
    },
    wrapperCol: {
      span: 18
    },
  };
  function getListFn () {
    form.validateFields(['group', 'building', 'unit', 'room'], (errors, values) => {
      if (errors) {
        return false;
      }
      queryList.group = values.group;
      queryList.building = values.building;
      queryList.unit = values.unit;
      queryList.room = values.room;
      dispatch({
        type: 'CashierDeskModel/getList',
        payload: {
          group: values.group,
          unit: values.unit,
          building: values.building,
          room: values.room,
          community_id: layout.communityId,
        }
      })
    })
  }
  // 搜索
  function handSearch () {
    getListFn()
  }
  // 重置 --- 回复页面默认状态
  function handleReset () {
    form.resetFields();
    dispatch({
      type: 'CashierDeskModel/concat',
      payload: {
        data: [],
        visible: false,
        visiblePrint: false,
        modalData: [],
        currentPage: 1,
        checkIdsList: [],
        checkValueList: {},
        totals: 0,
        dataObj: {},
        collectTotal: 0,
        favourableTotal: 0,
        unpaidTotal: 0,
        tableKey: ++tableKey,
        reportData: {},
        roomsData: {}
      }
    })
  }

  // 点击收款
  function gatheringClick () {
    let validateList = [];
    data.forEach((val, index) => {
      validateList.push(`paid_entry_${val.bill_id}`)
    });
    form.validateFields(validateList, (err, value) => {
      if (err) return;
      for (let k in checkValueList) {
        if (checkValueList[k].payWay == 2 && (checkValueList[k].factMoney >= checkValueList[k].bill_entry_amount)) {
          message.info('分次付清时实收金额应该小于应缴金额！');
          return false;
        }
      }
      form.resetFields(['pay_channel', 'remark']);
      let modalTableData = [];
      let data = countFn(checkValueList);
      for (let k in data.res) {
        let val = data.res[k];
        let target = {};
        target.cost_name = val.cost_name;
        target.bill_entry_amount = val.bill_entry_amount/data.times;
        target.prefer_entry_amount = val.factMoney/data.times;
        let dValue = val.bill_entry_amount - val.factMoney;
        if (val.payWay === '1') {
          target.unpaid = 0;
          target.favourable = dValue >= 0 ? dValue/data.times : 0
        } else {
          target.favourable = 0;
          target.unpaid = dValue >= 0 ? dValue/data.times : 0
        }
        target.entry_way = val.payWay === '1' ? '一次付清' : '分次付清';
        target.bill_id = val.bill_id;
        modalTableData.push(target)
      }
      form.resetFields(['template_id']);
      dispatch({
        type: 'CashierDeskModel/concat',
        payload: {
          visible: true,
          modalData: [...modalTableData],
          collectTotal: data.collectTotal,
          favourableTotal: data.favourableTotal,
          unpaidTotal: data.unpaidTotal,
          payableTotal: data.payableTotal
        }
      })
    });
  }
  // 计算实收总计，优惠总计，未付总计
  function countFn (checkValueList) {
    let target = {...checkValueList};
    let collectTotal = 0; // 实收总计
    let favourableTotal = 0;  // 优惠总计
    let unpaidTotal = 0;  // 未付总计
    let payableTotal = 0; // 应缴总计
    // 勾选的账单金额转换为正整数
    let arr = {};
    for (let k in target) {
      let { bill_entry_amount, factMoney, payWay, cost_name, bill_id } = target[k];
      let obj = {
        bill_entry_amount: toInteger(bill_entry_amount),
        payWay: payWay,
        bill_id: bill_id,
        cost_name: cost_name,
        factMoney: toInteger(factMoney)
      };
      arr[k] = obj;
    }
    // 获取转换后最大的放大倍数
    let times = 1;
    for (let k in arr) {
      if (arr[k].bill_entry_amount.times > times) {
        times = arr[k].bill_entry_amount.times
      }
      if (arr[k].factMoney.times > times) {
        times = arr[k].bill_entry_amount.times
      }
    }
    // 重新生成勾选账单的金额数组
    let res = {};
    for (let k in arr) {
      res[k] = {
        bill_entry_amount: arr[k].bill_entry_amount.num*(times/arr[k].bill_entry_amount.times),
        payWay: arr[k].payWay,
        cost_name: arr[k].cost_name,
        bill_id: arr[k].bill_id,
        factMoney: arr[k].factMoney.num*(times/arr[k].factMoney.times),
      }
    }
    // 计算对应金额 --- 结果为整数，当return时需要出以最大倍数times
    for (let k in res) {
      // 判断用户是否输入实收金额，已经输入了才进行计算
      if (res[k].factMoney) {
        payableTotal = payableTotal + res[k].bill_entry_amount; // 应缴总计
        collectTotal = collectTotal + res[k].factMoney; // 实收总计
        // 一次付清计算优惠金额
        if (res[k].payWay === '1') {
          let favourable = res[k].bill_entry_amount - res[k].factMoney;
          if (favourable <= 0) {
            favourable = 0;
          }
          favourableTotal = favourableTotal + favourable;
        } else { // 多次付清计算未付金额
          let unpaid = res[k].bill_entry_amount - res[k].factMoney;
          if (unpaid <= 0) {
            unpaid = 0;
          }
          unpaidTotal = unpaidTotal + unpaid;
        }
      }
    }
    return {
      collectTotal: collectTotal/times,
      unpaidTotal: unpaidTotal/times,
      favourableTotal: favourableTotal/times,
      payableTotal: payableTotal/times,
      res: res,
      times: times
    }
  }
  // 实收金额---输入框失去焦点
  function moneyBlur (record, e) {
    let val = e.target.value;
    let match = val.match(/(^[1-9]([0-9]){1,4}\.\d{1,2}$)|(^[1-9]{1,5}\.\d{1,2}$)|(^0\.\d[1-9]$)|(^0\.[1-9]\d?$)|(^[1-9]{1,5}$)|(^[1-9]([0-9]){1,4}$)/);
    if (match) {
      val = parseFloat(val);
      checkValueList[record.bill_id].factMoney = val;
    } else {
      checkValueList[record.bill_id].factMoney = 0;
    }
    let data = countFn(checkValueList);
    dispatch({
      type: 'CashierDeskModel/concat',
      payload: {
        checkValueList: {...checkValueList},
        collectTotal: data.collectTotal,
        favourableTotal: data.favourableTotal,
        unpaidTotal: data.unpaidTotal,
        currentMoney: val,
        payableTotal: data.payableTotal
      }
    });
  }
  // 监听实收金额变化
  function moneyChange (record, e) {
    let val = e.target.value;
    checkValueList[record.bill_id].factMoney = val;
    dispatch({
      type: 'CashierDeskModel/concat',
      payload: {
        checkValueList: {...checkValueList},
      }
    });
  }
  // 监听缴费方式变化
  function handleChange(id, value) {
    checkValueList[id].payWay = value;
    let data = countFn(checkValueList);
    dispatch({
      type: 'CashierDeskModel/concat',
      payload: {
        checkValueList: {...checkValueList},
        collectTotal: data.collectTotal,
        favourableTotal: data.favourableTotal,
        unpaidTotal: data.unpaidTotal,
        payableTotal: data.payableTotal
      }
    })
  }
  // 取消收款
  function handleCancel (e) {
    dispatch({type: 'CashierDeskModel/concat', payload: {visible: false}})
  }
  // 保存 / 保存并打印
  function handleOk (type) {
    form.validateFields(['pay_channel','template_id'], (err, values) => {
      if (err) return;
      let bills = [];
      for (let k in checkValueList) {
        bills.push({
          pay_amount: checkValueList[k].factMoney,
          bill_id: checkValueList[k].bill_id,
          pay_type: checkValueList[k].payWay
        })
      }
      let typeUrl = '';
      if (type === 1) { // 保存
        typeUrl = 'CashierDeskModel/submitCharge';
      } else { // 保存并打印
        typeUrl = 'CashierDeskModel/saveAndPrint';
      }

      if (type === 2 && values.template_id == undefined) {
        message.info("请先选择打印模版！");
        return;
      }

      dispatch({
        type: typeUrl,
        payload: {
          bill_list: bills,
          room_id: roomsData.room_id,
          pay_channel: values.pay_channel,
          content: form.getFieldValue('remark'),
          community_id: getCommunityId(),
          template_id: values.template_id
        },
        callback: () => {
          form.validateFields(['group', 'building', 'unit', 'room'], (errors, values) => {
            if (errors) { return false; }
            dispatch({
              type: 'CashierDeskModel/getList',
              payload: {
                group: values.group,
                unit: values.unit,
                building: values.building,
                room: values.room,
                community_id: layout.communityId,
              }
            })
          })
          form.resetFields(['template_id']);
        }
      });
    });
  }

  // 关闭打印弹层
  function printHide () {
    getListFn();
    dispatch({
      type: 'CashierDeskModel/concat',
      payload: { visiblePrint: false }
    })
  }

  function number() {
    dispatch({
      type: 'CashierDeskModel/numberPlus',
      payload: { community_id: getCommunityId() }
    })
  }

  const columns = [
    {
      title: '缴费项目',
      dataIndex: 'cost_name',
      key: 'cost_name',
    },{
      title: '账期',
      dataIndex: 'acct_period_time_msg',
      key: 'acct_period_time_msg',
    }, {
      title: '应缴金额',
      dataIndex: 'bill_entry_amount',
      key: 'bill_entry_amount',
    }, {
      title: '实收金额',
      dataIndex: 'prefer_entry_amount',
      key: 'prefer_entry_amount',
      render: (text, record) => {
        return (
          <form>
            <FormItem {...formItemLayout}>
              {getFieldDecorator(`paid_entry_${record.bill_id}`, {
                rules: [{
                  required: true,
                  pattern: /(^[1-9]([0-9]){1,4}\.\d{1,2}$)|(^[1-9]{1,5}\.\d{1,2}$)|(^0\.\d[1-9]$)|(^0\.[1-9]\d?$)|(^[1-9]{1,5}$)|(^[1-9]([0-9]){1,4}$)/,
                  message: '请输入金额(正整数或小数点后两位)'
                }],
                initialValue: record.bill_entry_amount
              })(
                <Input
                  type="text"
                  style={{ width: 120 }}
                  disabled={checkIdsList.indexOf(record.bill_id) === -1 ? true : false}
                  onBlur= {(e) => moneyBlur(record, e)}
                  onChange={(e) => moneyChange(record, e)} />
              )}
            </FormItem>
          </form>
        )
      }
    }, {
      title: '缴费方式',
      dataIndex: 'owe_entry_amount',
      key: 'owe_entry_amount',
      render: (text, record) => {
        let curValue = '1';
        if (checkIdsList.indexOf(record.bill_id) !== -1) {
          curValue = checkValueList[record.bill_id].payWay
        }
        return (
          <Select
            defaultValue="1"
            value={curValue}
            disabled={checkIdsList.indexOf(record.bill_id) === -1 ? true : false}
            onChange={(val) => handleChange(record.bill_id, val)}>
            {payType.map((val, index) => {
              return <Option value={`${val.key}`} key={index}>{val.value}</Option>
            })}
          </Select>
        )
      }
    }];

  const rowSelection = {
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      let result = [];
      let target = {};
      selectedRows.forEach((value) => {
        result.push(value.bill_id)
      });
      result.forEach((val) => {
        target[val] = dataObj[val]
      });
      // 当未选择时，实收金额恢复到默认值
      for(let k in dataObj) {
        if (result.indexOf(k) === -1) {
          form.resetFields(`paid_entry_${dataObj[k].bill_id}`)
        }
      }
      let data = countFn(target);
      dispatch({
        type: 'CashierDeskModel/concat',
        payload: {
          checkIdsList: [...result],
          checkValueList: {...target},
          collectTotal: data.collectTotal,
          favourableTotal: data.favourableTotal,
          unpaidTotal: data.unpaidTotal,
          payableTotal: data.payableTotal,
          selectedRowKeys: selectedRowKeys
        }
      })
    }
  };
  // 收款弹层 info 列表
  let modalInfo = {
    payableTotal: payableTotal,
    collectTotal: collectTotal,
    favourableTotal: favourableTotal,
    unpaidTotal: unpaidTotal,
  };
  return (
    <div className="CashierDesk">
      <Breadcrumb separator=">">
        <Breadcrumb.Item>收费管理</Breadcrumb.Item>
        <Breadcrumb.Item>收银台</Breadcrumb.Item>
      </Breadcrumb>
      <Card className="section">
        <Form>
          <Community
            form={form}
            allDatas={{group:{required: true}, building: {required: true}, unit:{required: true}, room:{required: true}}}/>
        </Form>
        <Col style={{textAlign: 'right'}} className="fr">
          <Button type="primary" onClick={() => handSearch()}>查询</Button>
          <Button className="ml1" type="ghost" onClick={() => handleReset()}>重置</Button>
        </Col>
      </Card>
      <div className="til">
        <span className="left">收银台</span>
        {author('gatheringRecord') ? <Link className="right" to="gatheringRecord">收款记录</Link> : null}
      </div>
      <Card className="section">
        <div className="table_til">收费明细</div>
        <div>
          <span>
            {
              Object.keys(roomsData).length === 0
                ? '房屋信息：'
                : `房屋信息：${roomsData.community_name}${roomsData.group}${roomsData.building}${roomsData.unit}${roomsData.room}`
            }
          </span>
          {
            Object.keys(roomsData).length === 0
              ? <span style={{float: 'right'}}>业主：</span>
              : <span style={{float: 'right'}}>{`业主：${roomsData.room_user_info}`}</span>
          }

        </div>
        <Table
          key={tableKey}
          className="mt1"
          loading={loading}
          columns={columns}
          dataSource={data}
          pagination={false}
          rowSelection={rowSelection}
          rowKey={record => record.bill_id} />
        <div className="money_info">
          <div className="item_1">
            {`应收金额：${reportData.bill_entry_amount ? reportData.bill_entry_amount : 0}元,
            已缴金额: ${reportData.paid_entry_amount ? reportData.paid_entry_amount : 0}元,
            欠费金额：${reportData.owe_entry_amount ? reportData.owe_entry_amount : 0}元`}
          </div>
          <div style={{color: 'red'}}>
            {`实收总计：${collectTotal}元   优惠总计：${favourableTotal}元   未付总计：${unpaidTotal}元`}
          </div>
        </div>
        <div style={{textAlign: 'center'}}>
          {author('gathering') ? <Button
            type="primary"
            style={{width: '25%'}}
            disabled={checkIdsList.length === 0 ? true : false}
            size="large"
            onClick={() => gatheringClick()}>
            收款
          </Button> : null}
          <GatheringModal
            visible={visible}
            handleCancel={handleCancel}
            form={form}
            roomsData={roomsData}
            modalData={modalData}
            typeOption={typeOption}
            modalInfo={modalInfo}
            templateList={templateList}
            gatheringLoading2={gatheringLoading2}
            gatheringLoading1={gatheringLoading1}
            handleOk={handleOk} />
          <Lock
            props={props}
            lockArr={lockArr}
            roomId={roomsData.room_id}
            visible={visibleLook}
            queryList={queryList}
            defeat_count={defeat_count}
            success_count={success_count}
            tableKey={tableKey}
          />
          <Print
            visible={visiblePrint}
            hide={printHide}
            dataSource={dataSource}
            number={number}
          />
        </div>
      </Card>
    </div>
  )
}
export default connect((state) => {
  return {
    CashierDeskModel: state.CashierDeskModel,
    layout: state.MainLayout
  }
})(Form.create()(CashierDesk));

import React from 'react';
import { connect } from 'dva';
import { Breadcrumb, Table, Card, Form } from 'antd';
const createForm = Form.create;
let columnsList = {
  create_at: '账单生成时间',
  acct_period_time_msg: '账期',
  use_ton: '',
  latest_ton: '起度',
  current_ton:'止度',
  formula:'单价',
  bill_entry_amount: '应缴金额（元）',
  paid_entry_amount: '已缴金额（元）',
  prefer_entry_amount: '优惠金额（元）',
  status: '缴费状态',
  pay_channel: '支付方式',
  remark: '支付备注'
};
/*
* 生成表格列
* list Object
* target Array
* type Number
* */
function pushColumnsFn (list, target, type) {
  let curList = { ...list };
  if (type === 1) {
    delete curList.use_ton;
    delete curList.latest_ton;
    delete curList.current_ton;
    delete curList.formula;
  } else if (type === 2) {
    curList.use_ton = '用水量（吨）';
  } else if (type === 3) {
    curList.use_ton = '用电量（度）'
  }
  for (let k in curList) {
    target.push({
      title: curList[k],
      dataIndex: k,
      key: k
    })
  }
}
let columns = [];
let columns1 = [];
let columns2 = [];
pushColumnsFn(columnsList, columns, 1);
pushColumnsFn(columnsList, columns1, 2);
pushColumnsFn(columnsList, columns2, 3);
function BillView (props) {
  let { BillsViewModel } = props;
  let { roomData, total, dataList, reportData, loading } = BillsViewModel;
  dataList = dataList.map((item) => {
    item.list.map((items,index)=>{
      items.key = index;
      return items;
    });
    return item;
  });
  return (
    <div className="page-content">
      <Breadcrumb separator="/">
        <Breadcrumb.Item>收费管理</Breadcrumb.Item>
        <Breadcrumb.Item><a href="#/billManage">账单管理</a></Breadcrumb.Item>
        <Breadcrumb.Item>账单详情</Breadcrumb.Item>
      </Breadcrumb>
      <Card>
        <h1 className="mb1" style={{fontWeight: 'bold'}}>
          {roomData.group}{roomData.building}{roomData.unit}{roomData.room}
        </h1>
        <h2 style={{fontWeight: 'bold', color: 'rgba(0,0,0,.85)'}}>
          共{total}条账单, 应收金额:{reportData.bill_entry_amount ? reportData.bill_entry_amount : 0}元,
          已缴金额:{reportData.paid_entry_amount ? reportData.paid_entry_amount : 0}元,
          欠费金额: {reportData.owe_entry_amount ? reportData.owe_entry_amount : 0}元
          {/*<Link to={`/collections?type=detail&id=${query.id}`}>*/}
          {/*<Button type="primary" className="ml1">线下收款</Button>*/}
          {/*</Link>*/}
        </h2>
      </Card>
      {
        dataList.map((item, index)=>{
          return (
            <Card className="mt1" key={index}>
              {item.reportData.map((val, index1) => {
                return (
                  <div key={index1}>
                    <h2 style={{fontWeight: 'bold', color: 'rgba(0,0,0,.85)'}}>
                      {val.cost_name}:{val.number}条账单, 应收金额:{val.bill_entry_amount}元，
                      已缴金额:{val.paid_entry_amount}元
                      欠费金额:{val.owe_entry_amount}元
                    </h2>
                    <Table columns={val.cost_type == 2 ? columns1 : (val.cost_type == 3 ? columns2 : columns)}
                      style={{marginTop: 25}}
                      loading={loading}
                      dataSource={item.list}
                      pagination={false}/>
                  </div>
                )
              })}
            </Card>
          )
        })
      }
    </div>
  )
}
export default connect(state => {
  return {
    BillsViewModel: state.BillsViewModel,
    loading: state.loading.models.BillManagementModel,
    layout: state.MainLayout
  }
})(createForm()(BillView));

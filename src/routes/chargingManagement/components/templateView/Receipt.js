import React from 'react';
import { Table, Spin, Row } from 'antd';
import { noData } from '../../../../utils/util';

function Component(info) {
  let loading = true;
  if(info){
    loading = false;
  }
  const data = [
    {id:1, project: '', time: '', num: '', price: '', amount: '',preferential: '',money:'',pay:'',method:'' },
    {id:2, project: '', time: '', num: '', price: '', amount: '',preferential: '',money:'',pay:'',method:'' },
    {id:3, project: '', time: '', num: '', price: '', amount: '',preferential: '',money:'',pay:'',method:'' },
  ]
  const columns = [{
    title: '收费项目',
    dataIndex: 'project',
    render: noData
  },{
    title: '帐期',
    dataIndex: 'time',
    render: noData
  },{
    title: '计费用量',
    dataIndex: 'num',
    render: noData
  },{
    title: '金额',
    dataIndex: 'amount',
    render: noData
  },{
    title: '优惠金额（元）',
    dataIndex: 'preferential',
    render: noData
  },{
    title: '应交小计（元）',
    dataIndex: 'money',
    render: noData
  },{
    title: '本次付款（元）',
    dataIndex: 'pay',
    render: noData
  },{
    title: '收费方式',
    dataIndex: 'method',
    render: noData
  }];
  
  return (
    <Spin
      tip="Loading..."
      spinning={loading}
    >
      <h2 style={{ textAlign: 'center' }}>{info.model_title}</h2>
      <Row className="mt1 mb1">
        <span style={{width:'33.3%',display:'inline-block'}}>小区名称：***</span>
        <span style={{width:'33.3%',display:'inline-block',textAlign:'center'}}>房间号：***</span>
        <span style={{width:'33.3%',display:'inline-block',textAlign:'right'}}>房屋面积：***㎡</span>
      </Row>
      <Table
        rowKey={record => record.id}
        bordered={false}
        columns={columns}
        dataSource={data}
        pagination={false}
      />
      <Row className="mt1">
        <span>合计：***</span>
      </Row>
      <Row className="mt1">
        <span style={{width:'33.3%',display:'inline-block'}}>收款人：{info.first_area}</span>
        <span style={{width:'33.3%',display:'inline-block',textAlign:'center'}}>收款单位：{info.second_area}</span>
        <span style={{width:'33.3%',display:'inline-block',textAlign:'right'}}>收款时间：***</span>
      </Row>
      <Row className="mt1">
        <span>备注：{info.remark?info.remark:'此处展示备注信息，最多可以展示1500个字。'}</span>
      </Row>
    </Spin>
  )
}

export default Component

import React from 'react';
import { Table, Spin } from 'antd';
import { noData } from '../../../../utils/util';

function Component(info) {
  let loading = true;
  if(info){
    loading = false;
  }
  const data = [{id:1, area: '', time: '', num: '', start: '', money: '' },
    {id:2, area: '', time: '', num: '', start: '', money: '' },
    {id:3, area: '', time: '', num: '', start: '', money: '' },];
  const columns = [{
    title: '房屋信息',
    dataIndex: 'area',
    render: noData
  }, {
    title: '帐期',
    dataIndex: 'time',
    render: noData
  }, {
    title: '用电量（度）',
    dataIndex: 'num',
    render: noData
  }, {
    title: '起始度数',
    dataIndex: 'start',
    render: noData
  }, {
    title: '应缴金额（元）',
    dataIndex: 'money',
    render: noData
  }];
  
  return (
    <Spin
      tip="Loading..."
      spinning={loading}
    >
      <h2 style={{ textAlign: 'center' }}>{info.model_title}</h2>
      <Table
        rowKey={record => record.id}
        bordered={false}
        title={() => info.first_area?info.first_area:'自定义文本区域'}
        footer={() => info.second_area?info.second_area:'自定义文本区域'}
        columns={columns}
        dataSource={data}
        pagination={false}
      />
    </Spin>
  )
}

export default Component

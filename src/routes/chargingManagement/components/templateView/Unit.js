import React from 'react';
import { Table, Spin } from 'antd';
import { noData } from '../../../../utils/util';

function Component(info) {
  let loading = true;
  if(info){
    loading = false;
  }
  const data = [{id: 1, area: '', building: '', unit: '', room: '', project: '', start: '', end: '', money: '' },
    {id: 2, area: '', building: '', unit: '', room: '', project: '', start: '', end: '', money: '' },
    {id: 3, area: '', building: '', unit: '', room: '', project: '', start: '', end: '', money: '' },];
  const columns = [{
    title: '苑/期/区',
    dataIndex: 'area',
    render: noData
  }, {
    title: '幢',
    dataIndex: 'building',
    render: noData
  }, {
    title: '单元',
    dataIndex: 'unit',
    render: noData
  }, {
    title: '室号',
    dataIndex: 'room',
    render: noData
  }, {
    title: '收费项目',
    dataIndex: 'project',
    render: noData
  }, {
    title: '账期开始时间',
    dataIndex: 'start',
    render: noData
  }, {
    title: '账期结束时间',
    dataIndex: 'end',
    render: noData
  }, {
    title: '金额',
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


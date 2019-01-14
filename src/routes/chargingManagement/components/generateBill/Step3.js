import React from 'react';
import {Table,Pagination} from 'antd';
let communityParams = {
  page:1,
  rows:10,
  source:5,
  task_id:"",
  community_id:"",
}
function Step3(props){
  const columns = [{
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
  }];
  function handleShowSizeChange(current, size){
    communityParams.page = 1;
    communityParams.rows = size;
    communityParams.task_id = props.taSkId;
    communityParams.community_id = sessionStorage.getItem('communityId');
    props.dispatch({
      type: 'GenerateBillModel/billdetailList',
      payload: communityParams
    })
  }
  function handlePaginationChange(page){
    communityParams.community_id = sessionStorage.getItem('communityId');
    communityParams.page = page;
    communityParams.task_id = props.taSkId;
    props.dispatch({
      type: 'GenerateBillModel/billdetailList',
      payload: communityParams
    })
  }
  const PaginationProps = {
    className: 'y-card-pagination',
    showTotal(total, range){
      const tableAmount = props.tableAmount ? props.tableAmount : '0'
      return '共搜索到 ' + props.tableTotals + ' 条，共计应缴金额 ' +tableAmount + ' 元'
    },
    defaultCurrent: 1,
    defaultPageSize: 10,
    current: communityParams.page,
    total: Number(props.tableTotals),
    onShowSizeChange: handleShowSizeChange.bind(this),
    onChange: handlePaginationChange.bind(this),
  }

  return (
    <div>
      <Table
        rowKey={record => record.bill_id}
        columns={columns}
        dataSource={props.tableData}
        loading={props.loading}
        pagination={false}
      />
      <Pagination {...PaginationProps}/>
    </div>
  )
}

export default Step3;
import React from 'react';
import { connect } from 'react-redux';
import { Breadcrumb, Table, Card } from 'antd';

function GovernmentNotice (props) {
  let { dispatch, GovernmentNoticeModel, layout, loading } = props;
  let { data, paginationTotal, localsize,param } = GovernmentNoticeModel;
  /*
  * 监听页码改变
  * page Number
  * */
  function handlePaginationChange (page) {
    param.community_id = layout.communityId;
    param.page = page;
    dispatch({
      type: 'GovernmentNoticeModel/getList',
      payload: param
    });
  }
  /*
  * 监听pageSize改变
  * size Number
  * */
  function handleShowSizeChange (current, size) {
    param.community_id = layout.communityId;
    param.rows = size;
    dispatch({ type: 'GovernmentNoticeModel/concat', payload: { localsize: size }});
    dispatch({
      type: 'GovernmentNoticeModel/getList',
      payload: param
    });
  }
  /*
  * 查看详情
  * record Object
  * */
  function linkToDetail (record) {
    dispatch({
      type: 'GovernmentNoticeModel/newRead',
      payload: {
        id: record.id,
        community_id: layout.communityId
      }
    });
    location.href = `#/governmentNoticeView?id=${record.obj_id}`;
  }
  const columns = [{
    title: '消息标题',
    dataIndex: 'title',
    key: 'title'
  }, {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (text, record) => {
      return (
        record.status == 1 ? <span>未读</span> : <span>已读</span>
      )
    }
  }, {
    title: '时间',
    dataIndex: 'create_at',
    key: 'create_at'
  },{
    title: '操作',
    dataIndex:'desc',
    key: 'desc',
    render: (text, record) => {
      return (
        <a href="javascript:;" onClick={linkToDetail.bind(this, record)}>查看详情</a>
      )
    }
  }
  ];
  const pagination = {
    current: param.page,
    pageSize: localsize,
    onShowSizeChange: handleShowSizeChange,
    onChange: handlePaginationChange,
    total: parseInt(paginationTotal),
    pageSizeOptions: ['10', '20','30','40'],
    defaultPageSize: 10,
    showTotal(total, range){
      return ` ${paginationTotal} 条数据`
    },
  }
  return (
    <div className="page-content">
      <Breadcrumb separator="/">
        <Breadcrumb.Item>政务通知</Breadcrumb.Item>
        <Breadcrumb.Item>政务通知</Breadcrumb.Item>
      </Breadcrumb>
      <Card className="mt1">
        <Table columns={columns} dataSource={data} className="mt1" pagination={pagination} rowKey={record => record.id} loading={loading}/>
      </Card>
    </div>
  )
}
export default connect(state => {
  return {
    GovernmentNoticeModel: state.GovernmentNoticeModel,
    layout: state.MainLayout,
    loading: state.loading.models.GovernmentNoticeModel
  }
})(GovernmentNotice);
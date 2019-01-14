import React from 'react';
import { connect } from 'dva';
import { Link } from 'react-router-dom';
import { Table, Breadcrumb, Card, Button, Form, Popconfirm} from 'antd';
import { author } from '../../utils/util';
function Vote (props) {
  let { dispatch, VoteModel, layout } = props;
  let { total, data, current, loading } = VoteModel;
  function pageChange (page, pageSize) {
    dispatch({
      type: 'VoteModel/concat',
      payload: {
        current:page
      }
    });
    dispatch({
      type: 'VoteModel/getList',
      payload: {
        community_id: layout.communityId,
        page: page
      }
    })
  }
  function handleDelete(record) {
    dispatch({
      type: 'VoteModel/voteOnOff',
      payload: {
        vote_id: record.id,
        type: 1
      }
    })
  }
  function handleOnOff (record) {
    let status = '';
    if(record.status == 1){
      status = 2;
    }else{
      status = 1;
    }
    dispatch({
      type: 'VoteModel/voteOnOff',
      payload: {
        vote_id: record.id,
        status: status,
        type: 2
      }
    })
  }
  function addVote () {
    window.location.href = '#addVote';
  }
  const noData = (text, record) => {
    return (
      <span>{text ? text : '-'}</span>
    )
  };
  const columns = [{
    title: '投票名称',
    dataIndex: 'vote_name',
    key: 'vote_name',
    render: noData
  }, {
    title: '投票人数',
    dataIndex: 'totals',
    key: 'totals',
    render: noData
  }, {
    title: '状态',
    dataIndex: 'vote_status',
    key: 'vote_status',
    render: noData
  }, {
    title: '操作',
    key: 'id',
    render: (text, record)=>{
      return (
        <div>
          {author("details")?<Link to={`viewVote?id=${record.id}`}>
            <span className="mlr1">查看</span>
          </Link>:null}
         
          {
            author("delete")?record.status != 1
              ? <Popconfirm title="确定要删除这个投票吗？" onConfirm={() => handleDelete(record)}>
                <a className="mlr" style={{marginLeft: 10}}>删除</a>
              </Popconfirm>
              : null:null
          }
          {
            author("showHide")?record.status == 1
              ? <Popconfirm title="确定要隐藏这个投票吗？" onConfirm={() => handleOnOff(record)}>
                <a className="mlr" style={{marginLeft: 10}}>隐藏</a>
              </Popconfirm>
              : null:null
          }
          {
            author("showHide")?record.status != 1
              ? <a  onClick={() => handleOnOff(record)} className="mlr" style={{marginLeft: 10}}>显示</a>
              : null:null
          }
        </div>
      )
    },
  }];
  const statisticalInfo = `共有 ${total} 条`;
  const PaginationProps = {
    total: parseInt(total),
    current: current,
    showQuickJumper: false,
    defaultPageSize: 10,
    showTotal: (total) => statisticalInfo,
    onChange: pageChange
  };
  return (
    <div className="page-content">
      <Breadcrumb separator=">">
        <Breadcrumb.Item>投票管理</Breadcrumb.Item>
        <Breadcrumb.Item>投票管理</Breadcrumb.Item>
      </Breadcrumb>
      <Card className="section child-section">
        {author("add")?<Button type="primary" onClick={addVote} className="mr1" style={{marginBottom: '10px'}} >新增投票</Button>:null}
        <Table columns={columns} dataSource={data} pagination={PaginationProps} rowKey={record => record.id} loading={loading}/>
      </Card>
    </div>
  )
}

export default connect(state => {
  return {
    layout:state.MainLayout,
    VoteModel: state.VoteModel,
  }
})(Form.create({})(Vote));

import React from 'react';
import { connect } from 'dva';
import { Breadcrumb, Card, Form, Button, Table, Popconfirm } from 'antd';
import { Link } from 'react-router-dom';
import { author } from '../../utils/util';

function CommunityGuide(props) {
  let { dispatch, list, totals, loading, params } = props;
  
  /**
   * 
   * @param {status} record
   * record.status.id = 1 显示
   * record.status.id = 2 隐藏
   */

  function handleOk(record) {
    const param = params;
    dispatch({
      type: 'CommunityGuideModel/guideOpenDown',
      payload: {
        id: record.id,
        status: record.status.id == 1 ? 2 : 1,
        params: param,
      }
    })
  }
  const columns = [{
    title: '标题',
    dataIndex: 'title',
    key: 'title',
    width: '12%',
    render: (text, record) => {
      if (text) {
        return <div>
          <span title={text}>{text.length > 15 ? text.substring(0, 15) + '...' : text}</span>
        </div>
      }
    }
  }, {
    title: '电话',
    dataIndex: 'phone',
    key: 'phone',
  }, {
    title: '地址',
    dataIndex: 'address',
    key: 'address',
    width: '50%',
    render: (text, record) => {
      if (text) {
        return <div>
          <span title={text}>{text.length > 15 ? text.substring(0, 15) + '...' : text}</span>
        </div>
      }
    }
  }, {
    title: '操作',
    dataIndex: 'desc',
    render: (text, record) => {
      let iLink = `/addGuide?id=${record.id}`;
      return <div>
        {author('edit') ? <Link to={iLink}>编辑</Link> : null}
        {
          author('showHide') ?
            <Popconfirm title={record.status.id == 1 ? '是否确认隐藏?' : '是否确认显示?'} onConfirm={handleOk.bind(this, record)}>
              <a className="ml1">{record.status.id == 1 ? '隐藏' : '显示'}</a>
            </Popconfirm> : null
        }
      </div>
    }
  }];
  const pagination = {
    showTotal(total, range) {
      return `共${totals}条`
    },
    defaultCurrent: 1,
    current: params.page,
    total: parseInt(totals),
    pageSizeOptions: ['10', '20', '30', '40'],
    defaultPageSize: 10,
    onChange: (page, size) => { dispatch({ type: 'CommunityGuideModel/getList', payload: { ...params, page } }) },
  }

  const tableProps = {
    rowKey: record => record.id,
    loading: loading,
    columns: columns,
    dataSource: list
  };

  return (
    <div>
      <Breadcrumb separator="/">
        <Breadcrumb.Item>物业服务</Breadcrumb.Item>
        <Breadcrumb.Item>办事指南</Breadcrumb.Item>
      </Breadcrumb>
      <Card>
        {
          author('add')?<Link to="/addGuide" > <Button type="primary">新增指南</Button> </Link>:null
        }
        
        <Table className="mt1" {...tableProps} pagination={pagination} />
      </Card>
    </div>
  )
}

function mapStateToProps(state) {
  return {
    ...state.CommunityGuideModel,
    loading: state.loading.models.CommunityGuideModel,
  }
}
export default connect(mapStateToProps)(Form.create()(CommunityGuide))

import React from 'react';
import { connect } from 'dva';
import { Form, Breadcrumb, Card, Button, Table, Popconfirm, message } from 'antd';
import { Link } from 'react-router-dom';
import { noData, author } from '../../../utils/util';

function DeviceClassify(props) {
  const { dispatch, loading, list, paginationTotal, params } = props;
  
  /**
   * 表格
   */
  const tableProps = {
    columns: [{
      title: '类别名称',
      dataIndex: 'label',
      key: 'label',
      width: "30%",
      render: noData
    }, {
      title: '类别说明',
      dataIndex: 'note',
      key: 'note',
      width: "50%",
      render: noData
    }, {
      title: '操作',
      dataIndex: 'desc',
      width: "20%",
      render: (text, record) => {
        return <div>
          {author('edit') ?
            <a className="mr1" onClick={onClickEdit.bind(this, record)} >编辑</a>
            : null}
          <Popconfirm title="确定要删除吗？" onConfirm={removeInfo.bind(this, record)}>
            {author('remove') ?
              <a className="margin-right-10">删除</a>
              : null}
          </Popconfirm>
        </div>
      }
    }],
    dataSource: list.slice(),
    pagination: {
      total: paginationTotal ? Number(paginationTotal) : '',
      current: params.page,
      defaultCurrent: 1,
      defaultPageSize: 10,
      showTotal: (total, range) => `共有 ${paginationTotal} 条`,
      onChange: (page, pageSize) => {
        dispatch({
          type: 'DeviceClassify/getDeviceCategoryList',
          payload: { ...params, page }
        })
      },
    },
    rowKey: record => record.key,
    loading: loading
  }

  function onClickEdit(record) {
    if (record.type == 1) {
      message.error('默认设备类别不可编辑！');
    } else {
      window.location.href = `#/deviceClassifyEdit?id=${record.value}`;
    }
  }
  /**
   * 设备分类删除
   */
  function removeInfo(record) {
    dispatch({
      type: 'DeviceClassify/getDeviceCategoryDelete', payload: { id: record.value, community_id: params.community_id }
    });
  }

  return (<div>
    <Breadcrumb separator=">">
      <Breadcrumb.Item>设备管理</Breadcrumb.Item>
      <Breadcrumb.Item>设备分类</Breadcrumb.Item>
    </Breadcrumb>
    <Card className="mt1">
      {author('add') ?
        <Link to="/deviceClassifyAdd">
          <Button type="primary">新增类别</Button>
        </Link>
        : null}
      <Table className="mt1" {...tableProps} />
    </Card>
  </div>)
}
function mapStateToProps(state) {
  return {
    ...state.DeviceClassify,
    loading: state.loading.models.DeviceClassify
  };
}
export default connect(mapStateToProps)(Form.create()(DeviceClassify));

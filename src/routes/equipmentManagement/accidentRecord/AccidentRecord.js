import React from 'react';
import { connect } from 'dva';
import { Form, Breadcrumb, Card, Button, Table, Popconfirm } from 'antd';
import { Link } from 'react-router-dom';
import { noData, author, download, getCommunityId } from '../../../utils/util';

function AccidentRecord(props) {
  const { dispatch, loading, list, paginationTotal, params, form } = props;
  /**
   * 表格props
   */
  const tableProps = {
    columns: [{
      title: '设备编号',
      dataIndex: 'device_no',
      key: 'device_no',
      render: noData
    }, {
      title: '设备名称',
      dataIndex: 'device_name',
      key: 'device_name',
      render: noData
    }, {
      title: '确认人',
      dataIndex: 'confirm_person',
      key: 'confirm_person',
      render: noData
    }, {
      title: '事故发生时间',
      dataIndex: 'happen_at',
      key: 'happen_at',
      render: noData
    }, {
      title: '事件事故描述及损失范围',
      dataIndex: 'describe',
      key: 'describe',
      render: (text, record) => {
        if (text) {
          if (text.length > 10) {
            return <span title={text}>{text.substring(0, 10) + '...'}</span>
          } else {
            return text
          }
        } else {
          return noData()
        }
      }
    }, {
      title: '处理结果',
      dataIndex: 'result',
      key: 'result',
      render: (text, record) => {
        if (text) {
          if (text.length > 10) {
            return <span title={text}>{text.substring(0, 10) + '...'}</span>
          } else {
            return text
          }
        } else {
          return noData()
        }
      }
    }, {
      title: '操作',
      dataIndex: 'desc',
      render: (text, record) => {
        let link = `/accidentRecordAdd?id=${record.id}`;
        let link1 = `/accidentRecordView?id=${record.id}`;
        return <div>
          {author('view') ?
            <Link to={link1} className="mr1">查看</Link>
            : null}
          {author('edit') ?
            <Link to={link} className="mr1">编辑</Link>
            : null}
          <Popconfirm title="确定要删除吗？" onConfirm={removeInfo.bind(this, record)}>
            {author('remove') ?
              <a className="margin-right-10">删除</a>
              : null}
          </Popconfirm>
        </div>
      }
    }],
    dataSource: list,
    pagination: {
      total: paginationTotal ? Number(paginationTotal) : '',
      current: params.page,
      defaultCurrent: 1,
      defaultPageSize: 10,
      showTotal: (total, range) => `共有 ${paginationTotal} 条`,
      onChange: (page, pageSize) => {
        dispatch({
          type: 'AccidentRecord/getAccidentList',
          payload: { ...params, page }
        })
      },
    },
    rowKey: record => record.id,
    loading: loading
  }
  /**
   * 删除
   */
  function removeInfo(record) {
    dispatch({
      type: 'AccidentRecord/accidentDelete', payload: { id: record.id, community_id: getCommunityId() }
    });
  }
  /**
   * 记录导出方法
  */
  function handleExport() {
    form.validateFields((err, values) => {
      let param = values;
      param.community_id = getCommunityId();
      dispatch({
        type: 'AccidentRecord/accidentExport',
        payload: param,
        callback(data) {
          download(data);
        }
      });
    });
  }
  return (<div>
    <Breadcrumb separator=">">
      <Breadcrumb.Item>设备管理</Breadcrumb.Item>
      <Breadcrumb.Item>重大事故记录</Breadcrumb.Item>
    </Breadcrumb>
    <Card className="mt1">
      {author('add') ?
        <Link to="/accidentRecordAdd">
          <Button type="primary">新增记录</Button>
        </Link>
        : null}
      {author('export') ?
        <Button type="primary" className="ml1" onClick={handleExport.bind(this)}>导出</Button>
        : null}
      <Table className="mt1" {...tableProps} />
    </Card>
  </div>)
}
function mapStateToProps(state) {
  return {
    ...state.AccidentRecord,
    loading: state.loading.models.AccidentRecord
  };
}
export default connect(mapStateToProps)(Form.create()(AccidentRecord));

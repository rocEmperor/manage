import React from 'react';
import { Table, Form, Popconfirm } from 'antd';
import { connect } from 'dva';
import { Link } from 'react-router-dom';
import { author, noData } from '../../../../utils/util';

function AlreadySettleInList (props) {
  let { list, loading, totals, params, dispatch } = props;
  /**
   * 查询表格数据
   * @param  {Object} params
   */
  function reload(params){
    dispatch({
      type: 'ResidentsManageModel/getList',
      payload: params,
      listType: '1'
    });
  }
  /**
   * 切换表格页码
   */
  function handlePaginationChange(page, size){
    const param = {...params, page};
    reload(param);
  }
  /**
   * 删除住户
   * @param  {Object} text
   */
  function removeInfo(text){
    dispatch({
      type: 'ResidentsManageModel/deleteResidents',
      payload: {
        id: text.id,
        params
      },
      listType: '1'
    });
  }
  /**
   * 迁出住户
   * @param  {Object} text
   */
  function outInfo (text) {
    dispatch({
      type: 'ResidentsManageModel/moveOutPerson',
      payload: {
        id: text.id
      },
      callback: () => {
        const param = { ...params };
        reload(param);
      }
    });
  }
  // 表格分页配置
  const pagination = {
    current: params.page,
    onChange: handlePaginationChange,
    total: parseInt(totals),
    showTotal: totals => `共${totals}条`,
    defaultCurrent: 1
  };
  // 表格列配置
  const columns = [{
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    render: noData,
  }, {
    title: '手机号码',
    dataIndex: 'mobile',
    key: 'mobile',
    render: noData,
  }, {
    title: '性别',
    dataIndex: 'sex',
    key: 'sex',
    render: (text, record) => {
      if (text == '1') {
        return (<span>男</span>)
      } else if (text == '2') {
        return (<span>女</span>)
      } else {
        return (<span>未知</span>)
      }
    },
  }, {
    title: '身份证号',
    dataIndex: 'card_no',
    key: 'card_no',
    render: noData,
  }, {
    title: '对应房屋',
    dataIndex: 'group',
    key: 'group',
    render: (text, record) => {
      return (<span>{record.group + record.building + record.unit + record.room}</span>)
    },
  }, {
    title: '身份',
    dataIndex: 'identity_type_desc',
    key: 'identity_type_desc',
    render: noData,
  }, {
    title: '有效期',
    dataIndex: 'time_end',
    key: 'time_end',
    render: (text, record) => {
      if (record.time_end == '0') {
        return <span>长期</span>
      } else {
        return <span>{record.time_end}</span>
      }
    }
  }, {
    title: '认证状态',
    dataIndex: 'status_desc',
    key: 'status_desc'
  }, {
    title: '认证时间',
    dataIndex: 'auth_time',
    key: 'auth_time',
    render: noData,
  }, {
    title: '操作',
    key: 'action3',
    render: (text, record) => {
      let link = `/residentsAdd?id=${record.id}&type=AlreadySettleIn`;
      let linkView = `/residentsViewOne?id=${record.id}&type=AlreadySettleIn`;
      return (
        <span>
          <Link to={linkView} className="table-operating mr1">查看</Link>
          {author('edit') ? <Link to={link} className="table-operating mr1">编辑</Link> : null}
          {record.status != 2 && author('delete')
            ? <Popconfirm title="确定要删除这个住户么？" onConfirm={removeInfo.bind(this, text)}>
              <a className="table-operating">删除</a>
            </Popconfirm>
            : null}
          <Popconfirm title="确定要迁出这个住户么？" onConfirm={outInfo.bind(this, text)}>
            <a className="table-operating">迁出</a>
          </Popconfirm>
        </span>
      )
    },
  }];
  return (
    <div>
      <Table
        className="mt1"
        dataSource={list}
        columns={columns}
        loading={loading}
        rowKey={record => record.id}
        pagination={pagination}
      />
    </div>
  )
}
function mapStateToProps(state) {
  return {
    ResidentsManageModel: { ...state.ResidentsManageModel }
  };
}
export default connect(mapStateToProps)(Form.create()(AlreadySettleInList));

import React from 'react';
import { Table, Form, Popconfirm, message } from 'antd';
import { connect } from 'dva';
import { Link } from 'react-router-dom';
import { noData } from '../../../../utils/util';

function Failed (props) {
  let { list, loading, totals, params, dispatch } = props;
  /**
   * 查询表格数据
   * @param  {Object} params
   */
  function reload(params){
    dispatch({
      type: 'ResidentsManageModel/getListOther',
      payload: params,
      listType: '2'
    });
  }
  /**
   * 切换表格页码
   */
  function handlePaginationChange(page, size){
    const param = {...params, page};
    param.type = '2';
    reload(param);
  }
  /*
  * 删除住户
  * @params {Object} record
  * */
  function removeInfo (record) {
    let formData = {};
    formData.id = record.id;
    dispatch({
      type: 'ResidentsManageModel/auditDelete',
      payload: formData,
      callback: () => {
        message.success("删除成功！");
        const param = {...params};
        param.type = '2';
        reload(param)
      }
    })
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
    title: '身份证号',
    dataIndex: 'card_no',
    key: 'card_no',
    render: noData,
  }, {
    title: '对应房屋',
    dataIndex: 'house',
    key: 'house',
    render: (text, record) => {
      let room = record.room;
      return (<span>{`${room.group}${room.building}${room.unit}${room.room}`}</span>)
    }
  }, {
    title: '身份',
    dataIndex: 'identity_type_des',
    key: 'identity_type_des',
    render: noData,
  }, {
    title: '操作',
    key: 'action3',
    render: (text, record) => {
      let linkView = `/residentsViewTwo?id=${record.id}&type=Failed`;
      return (
        <span>
          <Link to={linkView} className="table-operating mr1">查看</Link>
          <Popconfirm title="确定要删除这个住户么？" onConfirm={removeInfo.bind(this, record)}>
            <a className="table-operating">删除</a>
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
export default connect(mapStateToProps)(Form.create()(Failed));

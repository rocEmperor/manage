import React from 'react';
import { connect } from 'dva';
import { Form, Breadcrumb, Card, Table, Button, Popconfirm } from 'antd';
import { Link } from 'react-router-dom';
import { author } from '../../../utils/util';
import SearchBox from './components/SearchBox.js'
//let arrId=[]
function GroupManagement(props) {
  const { dispatch, loading, list,form,is_reset,is_flag,arrId } = props;
  if (is_reset == true) {
    form.resetFields();
    dispatch({
      type: 'GroupManagement/concat',
      payload: {
        is_reset: false,
      }
    });
  }
  /**
   * 判断数据是否有效
   * @param  {string} text
   * @return {string}
   */
  /*
    function renderColumns(text, record) {
      return (Object.prototype.toString.call(text) === '[object String]' && text !== '') ? text : '-'
    }
  */
  /**
   * 删除数据
   * @param  {string} id
   */
  function deletes(id) {
    dispatch({
      type: 'GroupManagement/getDeleteManage',
      payload: {
        group_id: id
      }
    });
  }
  //表格
  const tableProps = {
    columns: [{
      title: '部门名称',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => {
        if(record.checked == true){
          return <span className="color" key={record.id}>{record.name}</span>
        }else{
          return <span key={record.id}>{record.name}</span>
        }
      }
    },{
      title: '员工数',
      dataIndex: 'users',
      key: 'users',
    }, {
      title: '操作',
      dataIndex: 'unit',
      key: 'unit',
      render: (text, record) => {
        let link = `/groupManagementEdit?id=${record.id}`;
        return <div>

          {author('edit')&&record.can_edit!=false ? <Link to={link} className="mr1">编辑</Link> : null}
          {author('delete')&&record.can_edit!=false ? <Popconfirm title="确定要删除该部门吗？" onConfirm={deletes.bind(this, record.id)}>
            <a className="mlr1">删除</a>
          </Popconfirm> : null}
        </div>
      },
    }],
    dataSource: Array.isArray(list)&&list.length>0?list:[],
    rowKey: record => {
      return record.id;
    },
    loading: loading,
    pagination:false,
    //defaultExpandAllRows:is_flag,
    defaultExpandedRowKeys:arrId,
    //expandedRowKeys:arrId,
  }
  const all = {
    form,
    list,      
    dispatch,
  }
  return (
    <div>
      <Breadcrumb separator=">">
        <Breadcrumb.Item>系统设置</Breadcrumb.Item>
        <Breadcrumb.Item>部门管理</Breadcrumb.Item>
      </Breadcrumb>
      <SearchBox {...all} />
      <Card className="mt1">
        {author('add') ? <Link to="/groupManagementAdd"><Button type="primary" style={{ marginBottom: "10px" }}>新增部门</Button></Link> : null}
        {is_flag?<Table {...tableProps} />:null}
      </Card>
    </div>
  )
}
function mapStateToProps(state) {
  return {
    ...state.GroupManagement,
    loading: state.loading.models.GroupManagement
  };
}
export default connect(mapStateToProps)(Form.create()(GroupManagement));

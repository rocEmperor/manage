import React from 'react';
import { connect } from 'dva';
import { Form, Breadcrumb, Card, Row, Col, Input, Button, Table, Popover, Modal,Popconfirm,TreeSelect } from 'antd';
import { Link } from 'react-router-dom';
import { author } from '../../../utils/util';

function UserManagement(props) {
  const { unfoldList,form, dispatch, loading, list, paginationTotal,is_reset, params, managerId,groupList } = props;
  const { getFieldDecorator } = form;
  if (is_reset == true) {
    form.resetFields();
    dispatch({
      type: 'UserManagement/concat',
      payload: {
        is_reset: false,
      }
    });
  }
  // 布局
  const formItemLayout = {
    labelCol: {
      span: 6
    },
    wrapperCol: {
      span: 16
    },
    style: {
      marginBottom: "0"
    }
  };
  const formItemLayout1 = {
    labelCol: { span: 4 },
    wrapperCol: { span: 14 },
    style: { maxWidth: '600px' }
  };
  // 表格配置项
  const tableProps = {
    columns: [{
      title: '姓名',
      dataIndex: 'truename',
      render: renderColumns
    }, {
      title: '性别',
      dataIndex: 'sex',
      render: (text, record) => (record.sex == '1') ? '男' : '女'
    }, {
      title: '部门',
      dataIndex: 'group_name',
      render: renderColumns
    }, {
      title: '手机号',
      dataIndex: 'mobile',
      render: renderColumns
    }, {
      title: '菜单权限',
      dataIndex: 'menus',
      render: (text, record, index) => renderAuthorityDetails(record.menus)
    }, {
      title: '小区权限',
      dataIndex: 'communitys',
      render: (text, record, index) => renderAuthorityDetails(record.communitys)
    }, {
      title: '状态',
      dataIndex: 'is_enable',
      render: (text, record) => (record.is_enable == '1') ? '启用' : '禁用'
    }, {
      title: '操作',
      dataIndex: 'operate',
      render: (text, record, index) => {
        const isDark = (record.id == managerId||record.level==1) ? { color: '#999' } : {};
        return (
          <div>
            {author('edit') ? <a style={isDark} onClick={onEdit.bind(this, record)} className="mr1">编辑</a> : null}
            {author('startEndUse') ? <a style={isDark} className="mr1" onClick={onChangeStatus.bind(this, record)}>{(record.is_enable == '1') ? '禁用' : '启用'}</a> : null}
            {(record.id!=managerId&&record.level!='1')&&author('delete')?<Popconfirm title="确定要删除该员工吗？" onConfirm={deletes.bind(this, record.id)}>
              <a style={isDark} className="mlr1">删除</a>
            </Popconfirm>:author('delete')?<a style={isDark} className="mlr1">删除</a>:''}
          </div>
        )
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
          type: 'UserManagement/getManageManages',
          payload: { ...params, page }
        })
      },
    },
    rowKey: record => record.id,
    loading: loading
  };
  /**
   * 编辑跳转
   * @param  {Object} value
   */
  function onEdit(value) {
    if (value.id != managerId&&value.level!='1') {
      location.href = `#/userManagementEdit?group_id=${value.group_id}&id=${value.id}`;
    }
  }
  /**
   * 启用/禁用
   * @param  {Object} value
   */
  function onChangeStatus(value) {
    if (value.id != managerId&&value.level!='1') {
      Modal.confirm({
        title: (value.is_enable == '1') ? '确认禁用该员工？' : '确认启用该员工？',
        content: (value.is_enable == '1') ? '禁用员工后，该员工将无法登录系统' : '启用员工后，该员工将可以正常登录系统',
        onOk() {
          dispatch({
            type: 'UserManagement/getChangeManage', payload: {
              is_enable: (value.is_enable) == '1' ? '2' : '1',
              user_id: value.id
            }
          });
        },
        onCancel() {
        }
      })
    }
  }

  /**
   * 判断数据是否有效
   * @param  {string} text
   * @return {string}
   */
  function renderColumns(text, record) {
    return (Object.prototype.toString.call(text) === '[object String]' && text !== '') ? text : '-'
  }
  /**
   * 权限详情
   * @param  {Array} data
   */
  function renderAuthorityDetails(data) {
    return (
      <Popover title="权限详情" content={data.map((value, index) => {
        return (
          <span key={index}>{(index + 1) + '. ' + value.name}<br /></span>
        )
      })}>
        <a>查看详情</a>
      </Popover>
    )
  }
  /**
   * 搜索
   */
  function handSearch() {
    form.validateFields((err, values) => {
      dispatch({
        type: 'UserManagement/getManageManages', payload: { ...params, ...values, page: 1 }
      });
    })
  }
  /**
   * 重置
   */
  function handleReset() {
    form.resetFields();
    form.validateFields((err, values) => {
      const payload = {
        page: 1,
        rows: 10,
        name: '',
        group_id:'',
      };
      dispatch({
        type: 'UserManagement/getManageManages', payload
      });
    })
  }
  /**
   * 删除
   */
  function deletes(id){
    if(id!=managerId){
      dispatch({
        type:"UserManagement/getDeleteManage",
        payload: {
          user_id:id,
        }
      })
    }
  }
  return (<div>
    <Breadcrumb separator=">">
      <Breadcrumb.Item>系统设置</Breadcrumb.Item>
      <Breadcrumb.Item>员工管理</Breadcrumb.Item>
    </Breadcrumb>
    <Card>
      <Form>
        <Row>
          <Col span={8}>
            <Form.Item label="部门" {...formItemLayout1}>
              {getFieldDecorator('group_id')(<TreeSelect treeDefaultExpandedKeys={unfoldList?unfoldList:[]} placeholder="请选择部门" treeData={groupList}/>
              )}
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="员工" {...formItemLayout}>
              {getFieldDecorator('name')(<Input type="text" placeholder="请输入姓名/手机号码" />
              )}
            </Form.Item>
          </Col>
          <Col style={{float: 'right'}}>
            <Button type="primary" onClick={handSearch} className="mr1" style={{ marginLeft: '10px' }} >查询</Button>
            <Button type="ghost" onClick={handleReset}>重置</Button>
          </Col>
        </Row>
      </Form>
    </Card>
    <Card className="mt1">
      {author('add') ? <Link to="/userManagementAdd">
        <Button type="primary">新增员工</Button>
      </Link> : null}
      <Table className="mt1" {...tableProps} />
    </Card>
  </div>)
}
function mapStateToProps(state) {
  return {
    ...state.UserManagement,
    loading: state.loading.models.UserManagement
  };
}
export default connect(mapStateToProps)(Form.create()(UserManagement));

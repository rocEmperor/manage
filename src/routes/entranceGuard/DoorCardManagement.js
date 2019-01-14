import React from 'react';
import { connect } from 'dva';
import { Link } from 'react-router-dom';
import { Breadcrumb, Form, Card, Select, Button, Input, Col, Row, Table, Popconfirm,message } from 'antd';
import { author } from '../../utils/util';
import Community from '../../components/Community/Community.js';
const FormItem = Form.Item;
const Option = Select.Option;

function DoorCardManagement(props) {
  const { dispatch, form, list, totals, params, loading, is_reset, selectedRowKeys,selectedIds } = props;
  const { getFieldDecorator } = form;

  if (is_reset == true) {
    form.resetFields();
    dispatch({
      type: 'DoorCardManagement/concat',
      payload: {
        is_reset: false,
      }
    });
  }
  function reload(params) {
    dispatch({
      type: 'DoorCardManagement/doorCarList',
      payload: params,
    });
    dispatch({
      type: 'DoorCardManagement/concat',
      payload: { params: params },
    });
  }

  //搜索确定
  function handleSubmit(e) {
    form.validateFields((err, values) => {
      const param = {
        status: values.status,
        group: values.group,
        time_status: values.time_status,
        type: values.type,
        card_num: values.card_num,
        building: values.building,
        unit: values.unit,
        room: values.room
      };
      param.page = 1;
      param.rows = 10;
      param.community_id = sessionStorage.getItem("communityId");
      reload(param);
    })
  }
  //重置按钮
  function handleReset() {
    form.resetFields();
    form.validateFields((err, values) => {
      const param = {
        page: 1,
        rows: 10,
        community_id: sessionStorage.getItem("communityId"),
        card_num:'',
        type:'',
        status:'',
        time_status:'',
        group:'',
        building:'',
        unit:'',
        room:''
      }
      reload(param);
      const params = {
        unitData:[],
        roomData:[],
        buildingData:[],
      };
      dispatch({
        type: 'CommunityModel/concat',
        payload: params
      });
    })
  }
  /**
   * 启用/禁用
   * @param {status} record
   * record.status = 1 启用
   * record.status = 2 禁用
   */
  function handleOk(record) {
    dispatch({
      type: 'DoorCardManagement/doorCarDisabled',
      payload: {
        id: record.id,
        status: record.status == 1 ? 2 : 1,
      }
    })
  }

  // 批量启用/禁用
  function handleSelDisabled(status) {
    if (selectedRowKeys.length == 0) {
      message.error('请选择至少一条数据进行操作');
    } else {
      dispatch({
        type: 'DoorCardManagement/doorCarSelDisabled', payload: {
          community_id: params.community_id,
          id: selectedIds.join(),
          status: status
        }
      });
    }
  }
  // 删除
  function deleteData(record) {
    dispatch({
      type: 'DoorCardManagement/doorCarDelete', payload: {
        community_id: params.community_id,
        id: record.id,
      }
    });
  }
  const formItemLayout = {
    labelCol: {
      span: 6
    },
    wrapperCol: {
      span: 16
    },
  };
  const formItemLayout1 = {
    labelCol: {
      span: 7
    },
    wrapperCol: {
      span: 15
    },
  };
  const columns = [{
    title: '门卡号',
    dataIndex: 'card_num',
    key: 'card_num',
  }, {
    title: '楼宇单元',
    dataIndex: 'unit_name',
    key: 'unit_name',
  }, {
    title: '室',
    dataIndex: 'room',
    key: 'room',
  }, {
    title: '门卡过期状态',
    dataIndex: 'time_status_name',
    key: 'time_status_name',
  }, {
    title: '门卡类别',
    dataIndex: 'type_name',
    key: 'type_name',
  }, {
    title: '门卡状态',
    dataIndex: 'status',
    key: 'status',
    render: (text,record) => {
      return <span>{record.status==1?'启用':'禁用'}</span>
    }
  }, {
    title: '操作',
    dataIndex: 'desc',
    render: (text, record) => {
      let link = record.type == 1?`/doorCardAddNormal?id=${record.id}`:`/doorCardAddManage?id=${record.id}`;
      return <div>
        <div>
          {
            author('disabled') ?
              <Popconfirm title={record.status == 1 ? '确定禁用吗' : '确定启用吗?'} okText="确认" cancelText="取消" onConfirm={handleOk.bind(this, record)}>
                <a className="ml1">{record.status == 1 ? '禁用' : '启用'}</a>
              </Popconfirm> : null
          }
          {author('edit') ? <Link to={link} className="ml1">编辑</Link> : null}
          {
            author('delete') ?
              <Popconfirm title="确定删除吗？" okText="确认" cancelText="取消" onConfirm={deleteData.bind(this, record)}>
                <a className="ml1">删除</a>
              </Popconfirm> : null
          }
        </div>
      </div>
    }
  }];
  const pagination = {
    showTotal(total, range) {
      return '共 ' + totals + ' 条'
    },
    defaultCurrent: 1,
    current: params.page,
    defaultPageSize: 10,
    total: Number(totals),
    onChange: (page, size) => { dispatch({ type: 'DoorCardManagement/doorCarList', payload: { ...params, page } }) },
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      let selectedId = [];
      for (let i = 0; i < selectedRows.length; i++) {
        selectedId.push(selectedRows[i].id);
      }
      dispatch({
        type: 'DoorCardManagement/concat',
        payload: {
          selectedRowKeys: selectedRowKeys,
          selectedIds: selectedId
        }
      })
    }
  };
  const tableProps = {
    rowKey: record => record.id,
    loading: loading,
    columns: columns,
    dataSource: list,
    rowSelection: rowSelection
  };
  return (
    <div className="page-content">
      <Breadcrumb separator=">">
        <Breadcrumb.Item>智能门禁</Breadcrumb.Item>
        <Breadcrumb.Item>门卡管理</Breadcrumb.Item>
      </Breadcrumb>
      <Card className="section">
        <Form>
          <Row>
            <Community form={form} allDatas={{ group: {}, building: {}, unit: {}, room: {} }} />
            <Col span={6}>
              <FormItem label="门卡卡号" {...formItemLayout}>
                {getFieldDecorator('card_num')(<Input placeholder="请输入门卡卡号" />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <FormItem label="门卡类别" {...formItemLayout}>
                {getFieldDecorator('type')(
                  <Select placeholder="请选择门卡类型">
                    <Option key="1" value="1">普通卡</Option>
                    <Option key="2" value="2">管理卡</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="门卡过期状态" {...formItemLayout1}>
                {getFieldDecorator('time_status')(
                  <Select placeholder="请选择门卡过期状态">
                    <Option key="1" value="1">未过期</Option>
                    <Option key="2" value="2">已过期</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="门卡状态" {...formItemLayout}>
                {getFieldDecorator('status')(
                  <Select placeholder="请选择门卡状态">
                    <Option key="1" value="1">启用</Option>
                    <Option key="2" value="2">禁用</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={5} offset={1} className="fr">
              <Button type="primary" className="mr1" onClick={handleSubmit}>查询</Button>
              <Button type="ghost" onClick={handleReset}>重置</Button>
            </Col>
          </Row>
        </Form>
      </Card>
      <Card className="mt1">
        {
          author('add') ? <Link to="/doorCardAddNormal"><Button type="primary">普通卡授权</Button></Link> : null
        }
        {
          author('add') ? <Link to="/doorCardAddManage"><Button type="primary" className="ml1">管理卡授权</Button></Link> : null
        }
        {
          author('disabled') ? <Button type="primary" className="ml1" onClick={handleSelDisabled.bind(this,1)}>批量启用</Button> : null
        }
        {
          author('disabled') ? <Button type="primary" className="ml1" onClick={handleSelDisabled.bind(this,2)}>批量禁用</Button> : null
        }
        <Table className="mt1" {...tableProps} pagination={pagination} />
      </Card>
    </div>
  )
}

function mapStateToProps(state) {
  return {
    ...state.DoorCardManagement,
    loading: state.loading.models.DoorCardManagement
  };
}
export default connect(mapStateToProps)(Form.create()(DoorCardManagement));
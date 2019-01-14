import React from 'react';
import { connect } from 'dva';
import { Form, Breadcrumb, Card, Row, Col, Button, Table, Popover, Popconfirm, Select } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import { Link } from 'react-router-dom';
import { author } from '../../utils/util';

function InspectPlanManagement(props) {
  const { dispatch, form, loading, list, paginationTotal, params, is_reset, lines, plans,userList } = props;
  const { getFieldDecorator } = form;
  if (is_reset == true) {
    form.resetFields();
    dispatch({
      type: 'InspectPlanManagement/concat',
      payload: {
        is_reset: false,
      }
    });
  }
  //布局
  const formItemLayout = {
    labelCol: {
      span: 6
    },
    wrapperCol: {
      span: 16
    },
  }
  //没有数据
  function renderColumns(text, record) {
    return (Object.prototype.toString.call(text) === '[object String]' && text !== '') ? text : '-'
  }
  // 状态启用停用
  function handleStatus(record){
    dispatch({
      type: 'InspectPlanManagement/planStatus',
      payload: {
        community_id: sessionStorage.getItem("communityId"),
        id: record.id,
        status: record.status=='已启用'?'2':'1'
      }
    })
  }
  //表格
  const tableProps = {
    columns: [{
      title: '计划名称',
      dataIndex: 'name',
      key: 'name',
      render: renderColumns
    }, {
      title: '对应线路',
      dataIndex: 'line_name',
      key: 'line_name',
      render: renderColumns
    }, {
      title: '巡检周期',
      dataIndex: 'exec_type',
      key: 'exec_type',
      render: renderColumns
    }, {
      title: '执行人员',
      dataIndex: 'user_list',
      key: 'user_list',
      render: (text, record) => {

        const content = (
          <div>
            {text.map(function (data) {
              return <p key={data.user_id}>{data.user_name}</p>
            })}
          </div>
        );
        return text ? <Popover content={content} title="执行人员">查看执行人员</Popover> : "-"
      }
    }, {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: renderColumns
    }, {
      title: '操作',
      dataIndex: 'desc',
      render: (text, record) => {
        let link1 = `/inspectPlanManagementView?id=${record.id}`;
        let link2 = `/inspectPlanAdd?id=${record.id}`;
        return <div>
          {author("edit") && record.status == '已停用' ? <Link to={link2} className="mr1">编辑</Link> : null}
          {author('remove') && record.status == '已停用' ? <Popconfirm title="确定要删除吗？" onConfirm={removeInfo.bind(this, record)}>
            <a>删除</a>
          </Popconfirm> : null}
          {author("view") ? <Link to={link1} className="ml1 mr1">查看</Link> : null}
          {author("disabled") ? <Popconfirm title={record.status=='已启用'?'确认要将该计划停用吗?':'确定要将该计划启用吗?'} onConfirm={handleStatus.bind(this, record)}><a className="mr1">{record.status=='已启用'?'停用':'启用'}</a></Popconfirm> : null}
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
          type: 'InspectPlanManagement/getPlanList',
          payload: { ...params, page }
        })
      },
    },
    rowKey: record => record.id,
    loading: loading
  }
  //搜索
  function handSearch(val) {

    form.validateFields((err, values) => {
      dispatch({
        type: 'InspectPlanManagement/getPlanList', payload: { ...params, ...values, page: 1 }
      });
    })
  }
  //重置
  function handleReset(val) {
    form.resetFields();
    form.validateFields((err, values) => {
      const payload = {
        page: 1,
        rows: 10,
        plan_id:'',
        line_id: '',
        status:'',
        user_id:'',
        exec_type:''
      }
      dispatch({
        type: 'InspectPlanManagement/getPlanList', payload
      });
    })
  }
  //删除
  function removeInfo(record) {
    dispatch({
      type: 'InspectPlanManagement/planDelete', payload: { id: record.id }
    });
  }
  return (<div>
    <Breadcrumb separator="/">
      <Breadcrumb.Item>设备巡检</Breadcrumb.Item>
      <Breadcrumb.Item>巡检计划管理</Breadcrumb.Item>
    </Breadcrumb>
    <Card>
      <Form>
        <Row>
          <Col span={6}>
            <FormItem label="计划名称" {...formItemLayout}>
              {getFieldDecorator('plan_id')(
                <Select placeholder="请选择计划" showSearch optionFilterProp="children">
                  {plans ? plans.map((value, index) => { return <Option key={index} value={value.id}>{value.name}</Option> }) : null}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="对应线路" {...formItemLayout}>
              {getFieldDecorator('line_id')(
                <Select placeholder="请选择对应线路" showSearch optionFilterProp="children">
                  {lines ? lines.map((value, index) => { return <Option key={index} value={value.id}>{value.name}</Option> }) : null}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <Form.Item label="状态" {...formItemLayout}>
              {getFieldDecorator('status')(
                <Select placeholder="请选择状态">
                  <Option value="">全部</Option>
                  <Option key="1" value="1">已启用</Option>
                  <Option key="2" value="2">已停用</Option>
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="执行人员" {...formItemLayout}>
              {getFieldDecorator('user_id')(
                <Select placeholder="请选择执行人员" showSearch={true} optionFilterProp="children">
                  {userList ? userList.map((value, index) => { return <Option key={index} value={value.id}>{value.truename}</Option> }) : null}
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={6}>
            <Form.Item label="巡检周期" {...formItemLayout}>
              {getFieldDecorator('exec_type')(
                <Select placeholder="请选择巡检周期">
                  <Option key="1" value="1">按天</Option>
                  <Option key="2" value="2">按周</Option>
                  <Option key="3" value="3">按月</Option>
                  <Option key="4" value="4">按年</Option>
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col className="fr" span={6}>
            <Button type="primary" onClick={handSearch} className="mr1" style={{ marginLeft: '10px' }} >查询</Button>
            <Button type="ghost" onClick={handleReset}>重置</Button>
          </Col>
        </Row>
      </Form>
    </Card>
    <Card className="mt1">
      {author("add") ? <Link to="/inspectPlanAdd">
        <Button type="primary">新增计划</Button>
      </Link> : null}
      <Table className="mt1" {...tableProps} />
    </Card>
  </div>)

}

function mapStateToProps(state) {
  return {
    ...state.InspectPlanManagement,
    loading: state.loading.models.InspectPlanManagement
  };
}
export default connect(mapStateToProps)(Form.create()(InspectPlanManagement));
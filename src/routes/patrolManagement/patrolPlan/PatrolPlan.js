import React from 'react';
import { connect } from 'dva';
import { Form, Breadcrumb, Card, Row, Col, Input, Button, Table, Popover, Popconfirm, DatePicker } from 'antd';
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
import { Link } from 'react-router-dom';
import { author } from '../../../utils/util';

function PatrolPlan(props) {
  const { dispatch, form, loading, list, paginationTotal, params,is_reset } = props;
  const { getFieldDecorator } = form;
  if (is_reset == true) {
    form.resetFields();
    dispatch({
      type: 'PatrolPlan/concat',
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
  const formItemLayout2 = {
    labelCol: {
      span: 3
    },
    wrapperCol: {
      span: 21
    },
  }
  //没有数据
  function renderColumns(text, record) {
    return (Object.prototype.toString.call(text) === '[object String]' && text !== '') ? text : '-'
  }
  //表格
  const tableProps = {
    columns: [{
      title: '序号',
      dataIndex: 'tid',
      key: 'tid'
    }, {
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
      title: '开始日期',
      dataIndex: 'start_date',
      key: 'start_date',
      render: renderColumns
    }, {
      title: '结束日期',
      dataIndex: 'end_date',
      key: 'end_date',
      render: renderColumns
    }, {
      title: '执行人员',
      dataIndex: 'user_list',
      key: 'user_list',
      render: (text, record) => {
        const content = (
          <div>
            {text.map(function (data) {
              return <p key={data.id}>{data.name}</p>
            })}
          </div>
        );
        return text ? <Popover content={content} title="执行人员">查看执行人员</Popover> : "-"
      }
    }, {
      title: '操作',
      dataIndex: 'desc',
      render: (text, record) => {
        let link1 = `/patrolPlanView?id=${record.id}`;
        let link2 = `/patrolPlanEdit?id=${record.id}`;
        return <div>
          {author("details")?<Link to={link1} className="mr1">查看</Link>:null}
          {author("edit")?<Link to={link2} className="mr1">编辑</Link>:null}
          {author('delete')?<Popconfirm title="确定要删除吗？" onConfirm={removeInfo.bind(this, record)}>
            <a>删除</a>
          </Popconfirm>:null}
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
          type: 'PatrolPlan/getPlanList',
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
      let start_time;
      let end_time;
      if (values.date && values.date.length > 0) {
        start_time = values.date[0].format('YYYY-MM-DD');
        end_time = values.date[1].format('YYYY-MM-DD');
        delete values.date;
      } else {
        start_time = '';
        end_time = '';
        delete values.date;
      }
      dispatch({
        type: 'PatrolPlan/getPlanList', payload: { ...params, ...values, start_time, end_time, page: 1 }
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
        name: '',
        line_name: '',
        user: '',
        start_time: '',
        end_time: '',
      }
      dispatch({
        type: 'PatrolPlan/getPlanList', payload
      });
    })
  }
  //删除
  function removeInfo(record) {
    dispatch({
      type: 'PatrolPlan/getPlanDelete', payload: { id: record.id }
    });
  }
  return (<div>
    <Breadcrumb separator="/">
      <Breadcrumb.Item>巡更管理</Breadcrumb.Item>
      <Breadcrumb.Item>巡更计划管理</Breadcrumb.Item>
    </Breadcrumb>
    <Card>
      <Form>
        <Row>
          <Col span={6}>
            <FormItem label="计划名称" {...formItemLayout}>
              {getFieldDecorator('name')(<Input type="text" placeholder="请输入计划名称" />
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="对应线路" {...formItemLayout}>
              {getFieldDecorator('line_name')(<Input type="text" placeholder="请输入对应线路" />
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="执行人员" {...formItemLayout}>
              {getFieldDecorator('user')(<Input type="text" placeholder="请输入执行人员" />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="计划时间" {...formItemLayout2}>
              {getFieldDecorator('date')(<RangePicker style={{width:'96%'}} />
              )}
            </FormItem>
          </Col>
          <Col className="fr" span={6}>
            <Button type="primary" onClick={handSearch} className="mr1" style={{ marginLeft: '10px' }} >查询</Button>
            <Button type="ghost" onClick={handleReset}>重置</Button>
          </Col>
        </Row>
      </Form>
    </Card>
    <Card className="mt1">
      {author("add")?<Link to="/patrolPlanAdd">
        <Button type="primary">新增计划</Button>
      </Link>:null}
      <Table className="mt1" {...tableProps} />
    </Card>
  </div>)

}

function mapStateToProps(state) {
  return {
    ...state.PatrolPlan,
    loading: state.loading.models.PatrolPlan
  };
}
export default connect(mapStateToProps)(Form.create()(PatrolPlan));
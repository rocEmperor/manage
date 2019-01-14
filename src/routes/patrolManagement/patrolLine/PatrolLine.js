import React from 'react';
import { connect } from 'dva';
import { Form, Breadcrumb, Card, Row, Col, Input, Button, Table, Popover, Popconfirm, message } from 'antd';
const FormItem = Form.Item;
import { Link } from 'react-router-dom';
import { author } from '../../../utils/util';
function PatrolLine(props) {
  const { dispatch, form, loading, list, paginationTotal, params,is_reset } = props;
  const { getFieldDecorator } = form;
  if (is_reset == true) {
    form.resetFields();
    dispatch({
      type: 'PatrolLine/concat',
      payload: {
        is_reset: false,
      }
    });
  }
  //布局
  const formItemLayout = {
    labelCol: {
      span: 8
    },
    wrapperCol: {
      span: 14
    },
  }
  //没有数据
  function renderColumns(text, record) {
    return (Object.prototype.toString.call(text) === '[object String]' && text !== '') ? text : '-'
  }
  //删除
  function removeInfo(record) {
    if (record.is_del === "0") {
      message.info('当前时间段不可删除，请先修改对应巡更计划');
    } else {
      dispatch({
        type: 'PatrolLine/getLineDelete', payload: { id: record.id }
      });
    }
  }
  //表格
  const tableProps = {
    columns: [{
      title: '序号',
      dataIndex: 'tid',
      key: 'tid'
    }, {
      title: '线路名称',
      dataIndex: 'name',
      key: 'name',
      render: renderColumns
    }, {
      title: '负责人',
      dataIndex: 'head_name',
      key: 'head_name',
      render: renderColumns
    }, {
      title: '联系电话',
      dataIndex: 'head_moblie',
      key: 'head_moblie',
      render: renderColumns
    }, {
      title: '查看巡更点',
      dataIndex: 'points_list',
      key: 'points_list',
      render: (text, record) => {
        const content = (
          <div>
            {text.map(function (data) {
              return <p key={data.key}>{data.title}</p>
            })}
          </div>
        );
        return text ? <Popover content={content} title="巡更点">查看巡更点</Popover> : "-"
      }
    }, {
      title: '线路说明',
      dataIndex: 'note',
      key: 'note',
      render: renderColumns
    }, {
      title: '操作',
      dataIndex: 'desc',
      render: (text, record) => {
        let link2 = `/patrolLineEdit?id=${record.id}`;
        return <div>
          {author("edit")?<Link to={link2} className="mr1">编辑</Link>:null}
          {author("delete")?<Popconfirm title="确定要删除吗？" onConfirm={removeInfo.bind(this, record)}>
            <a className="margin-right-10">删除</a>
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
          type: 'PatrolLine/getLineList',
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
        type: 'PatrolLine/getLineList', payload: { ...params, ...values, page: 1 }
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
        head: '',
        points_name: '',
      }
      dispatch({
        type: 'PatrolLine/getLineList', payload
      });
    })
  }
  return (<div>
    <Breadcrumb separator="/">
      <Breadcrumb.Item>巡更管理</Breadcrumb.Item>
      <Breadcrumb.Item>巡更线路管理</Breadcrumb.Item>
    </Breadcrumb>
    <Card>
      <Form>
        <Row>
          <Col span={6}>
            <FormItem label="线路名称" {...formItemLayout}>
              {getFieldDecorator('name')(<Input type="text" placeholder="请输入线路名称" />
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="负责人" {...formItemLayout}>
              {getFieldDecorator('head')(<Input type="text" placeholder="请输入负责人" />
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="巡更点名称" {...formItemLayout}>
              {getFieldDecorator('points_name')(<Input type="text" placeholder="请输入巡更点名称" />
              )}
            </FormItem>
          </Col>
          <Col className="fr" span={4}>
            <Button type="primary" onClick={handSearch} className="mr1" style={{ marginLeft: '10px' }} >查询</Button>
            <Button type="ghost" onClick={handleReset}>重置</Button>
          </Col>

        </Row>
      </Form>
    </Card>
    <Card className="mt1">
      {author("add")?<Link to="/patrolLineAdd">
        <Button type="primary">新增线路</Button>
      </Link>:null}
      <Table className="mt1" {...tableProps} />
    </Card>
  </div>)
}
function mapStateToProps(state) {
  return {
    ...state.PatrolLine,
    loading: state.loading.models.PatrolLine
  };
}
export default connect(mapStateToProps)(Form.create()(PatrolLine));
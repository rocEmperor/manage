import React from 'react';
import { connect } from 'dva';
import { Form, Breadcrumb, Card, Row, Col, Input, Button, Table, Popover, Popconfirm, message, Select } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import { Link } from 'react-router-dom';
import { author } from '../../utils/util';

function InspectLineManagement(props) {
  const { dispatch, form, loading, list, paginationTotal, params, is_reset, points, lines } = props;
  const { getFieldDecorator } = form;
  if (is_reset == true) {
    form.resetFields();
    dispatch({
      type: 'InspectLineManagement/concat',
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
      message.info('当前时间段不可删除，请先修改对应巡检计划');
    } else {
      dispatch({
        type: 'InspectLineManagement/getLineDelete', payload: { id: record.id }
      });
    }
  }
  //表格
  const tableProps = {
    columns: [{
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
      dataIndex: 'head_mobile',
      key: 'head_mobile',
      render: renderColumns
    }, {
      title: '包含巡检点',
      dataIndex: 'pointList',
      key: 'pointList',
      render: (text, record) => {
        const content = (
          <div>
            {text&&text.map(function (data) {
              return <p key={data.id}>{data.name}</p>
            })}
          </div>
        );
        return text ? <Popover content={content} title="巡检点">查看巡检点</Popover> : "-"
      }
    }, {
      title: '操作',
      dataIndex: 'desc',
      render: (text, record) => {
        let link2 = `/inspectLineAdd?id=${record.id}`;
        return <div>
          {author("edit") ? <Link to={link2} className="mr1">编辑</Link> : null}
          {author("remove") ? <Popconfirm title="确定要删除吗？" onConfirm={removeInfo.bind(this, record)}>
            <a className="margin-right-10">删除</a>
          </Popconfirm> : null}
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
          type: 'InspectLineManagement/getLineList',
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
        type: 'InspectLineManagement/getLineList', payload: { ...params, ...values, page: 1 }
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
        head_name: '',
        point_id: '',
        line_id:''
      }
      dispatch({
        type: 'InspectLineManagement/getLineList', payload
      });
    })
  }
  return (<div>
    <Breadcrumb separator="/">
      <Breadcrumb.Item>设备巡检</Breadcrumb.Item>
      <Breadcrumb.Item>巡检线路管理</Breadcrumb.Item>
    </Breadcrumb>
    <Card>
      <Form>
        <Row>
          <Col span={6}>
            <FormItem label="线路名称" {...formItemLayout}>
              {getFieldDecorator('line_id')(
                <Select placeholder="请选择线路名称" showSearch optionFilterProp="children">
                  {lines ? lines.map((value, index) => { return <Option key={index} value={value.id}>{value.name}</Option> }) : null}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="负责人" {...formItemLayout}>
              {getFieldDecorator('head_name')(<Input type="text" placeholder="请输入负责人或联系方式" />
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="巡检点名称" {...formItemLayout}>
              {getFieldDecorator('point_id')(
                <Select placeholder="请选择巡检点名称" showSearch optionFilterProp="children">
                  {points ? points.map((value, index) => { return <Option key={index} value={value.key}>{value.title}</Option> }) : null}
                </Select>
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
      {author("add") ? <Link to="/inspectLineAdd">
        <Button type="primary">新增线路</Button>
      </Link> : null}
      <Table className="mt1" {...tableProps} />
    </Card>
  </div>)
}
function mapStateToProps(state) {
  return {
    ...state.InspectLineManagement,
    loading: state.loading.models.InspectLineManagement
  };
}
export default connect(mapStateToProps)(Form.create()(InspectLineManagement));
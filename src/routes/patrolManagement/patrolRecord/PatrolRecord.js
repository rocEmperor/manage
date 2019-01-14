import React from 'react';
import { connect } from 'dva';
import { Form, Breadcrumb, Card, Row, Col, Input, Select, DatePicker, Button, Table, } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
import { Link } from 'react-router-dom';
import { getCommunityId, download } from '../../../utils/util';
import {  author } from '../../../utils/util';
function PatrolRecord(props) {
  const { dispatch, form, loading, status, execType2, lineList2, list, paginationTotal, params,is_reset } = props;
  const { getFieldDecorator } = form;
  if (is_reset == true) {
    form.resetFields();
    dispatch({
      type: 'PatrolRecord/concat',
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
      key: 'tid',
    }, {
      title: '巡更时间',
      dataIndex: 'patrol_time',
      key: 'patrol_time',
      render: renderColumns
    }, {
      title: '执行人员',
      dataIndex: 'user_name',
      key: 'user_name',
      render: renderColumns
    }, {
      title: '所属计划',
      dataIndex: 'plan_name',
      key: 'plan_name',
      render: renderColumns
    }, {
      title: '对应线路',
      dataIndex: 'line_name',
      key: 'line_name',
      render: renderColumns
    }, {
      title: '对应巡更点',
      dataIndex: 'point_name',
      key: 'point_name',
      render: renderColumns
    }, {
      title: '巡更状态',
      dataIndex: 'status_des',
      key: 'status_des',
      render: renderColumns
    }, {
      title: '操作',
      dataIndex: 'desc',
      render: (text, record) => {
        return <div>
          {author("details")?<Link to={`/patrolRecordView?id=${record.id}`} className="margin-right-10">查看详情</Link>:null}
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
          type: 'PatrolRecord/getRecordList',
          payload: { ...params, page }
        })
      },
    },
    rowKey: record => record.id,
    loading: loading
  }
  //搜索
  function handSearch() {
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
        type: 'PatrolRecord/getRecordList', payload: { ...params, ...values, start_time, end_time, page: 1 }
      });
    })
  }
  //重置
  function handleReset() {
    form.resetFields();
    form.validateFields((err, values) => {
      const payload = {
        page: 1,
        rows: 10,
        points_name: '',
        user_name: '',
        status: '',
        plan_id: '',
        line_id: '',
        start_time: '',
        end_time: '',
      }
      dispatch({
        type: 'PatrolRecord/getRecordList', payload
      });
    })
  }
  //导出报表
  function exportReport() {
    const points_name = params.points_name ? params.points_name : '';
    const user_name = params.user_name ? params.user_name : '';
    const status = params.status ? params.status : '';
    const plan_id = params.plan_id ? params.plan_id : '';
    const line_id = params.line_id ? params.line_id : '';
    const start_time = params.start_time ? params.start_time : '';
    const end_time = params.end_time ? params.end_time : '';
    dispatch({
      type: 'PatrolRecord/downFiles',
      payload: {
        "community_id": getCommunityId(),
        points_name:points_name,
        user_name:user_name,
        status:status,
        plan_id:plan_id,
        line_id:line_id,
        start_time:start_time,
        end_time:end_time,
      },callback(data){
        download(data);
      }
    });
  }
  return (<div>
    <Breadcrumb separator="/">
      <Breadcrumb.Item>巡更管理</Breadcrumb.Item>
      <Breadcrumb.Item>巡更记录</Breadcrumb.Item>
    </Breadcrumb>
    <Card>
      <Form>
        <Row>
          <Col span={6}>
            <FormItem label="巡更点名称" {...formItemLayout}>
              {getFieldDecorator('points_name')(<Input type="text" placeholder="请输入巡更点名称" />
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="执行人员" {...formItemLayout}>
              {getFieldDecorator('user_name')(<Input type="text" placeholder="请输入执行人员" />
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="巡更状态" {...formItemLayout}>
              {getFieldDecorator('status')(
                <Select placeholder="请选择" notFoundContent="没有数据">
                  {status ? status.map((value, index) => { return <Option key={index} value={value.key}>{value.value}</Option> }) : null}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="所属计划" {...formItemLayout}>
              {getFieldDecorator('plan_id')(
                <Select placeholder="请选择" notFoundContent="没有数据">
                  {execType2 ? execType2.map((value, index) => { return <Option key={index} value={value.plan_id}>{value.plan_name}</Option> }) : null}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="对应线路" {...formItemLayout}>
              {getFieldDecorator('line_id')(
                <Select  placeholder="请选择" notFoundContent="没有数据">
                  {lineList2 ? lineList2.map((value, index) => { return <Option key={index} value={value.line_id}>{value.line_name}</Option> }) : null}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="巡更时间" {...formItemLayout2}>
              {getFieldDecorator('date')(<RangePicker style={{width:'96%'}} />
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
      {author('export')?<Button type="primary" onClick={exportReport}>导出报表</Button>:null}
      <Table className="mt1" {...tableProps} />
    </Card>
  </div>)
}

function mapStateToProps(state) {
  return {
    ...state.PatrolRecord,
    loading: state.loading.models.PatrolRecord
  };
}
export default connect(mapStateToProps)(Form.create()(PatrolRecord));
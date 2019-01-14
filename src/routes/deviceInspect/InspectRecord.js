import React from 'react';
import { connect } from 'dva';
import { Form, Breadcrumb, Card, Row, Col, Button, Table, Select, DatePicker,Input } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
import { Link } from 'react-router-dom';
import { author, getCommunityId, download } from '../../utils/util';

function InspectRecord(props) {
  const { dispatch, form, loading, list, paginationTotal, params, is_reset, userList } = props;
  const { getFieldDecorator } = form;
  if (is_reset == true) {
    form.resetFields();
    dispatch({
      type: 'InspectRecordModel/concat',
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
  const formItem1 = { labelCol: { span: 3 }, wrapperCol: { span: 21 } };
  //没有数据
  function renderColumns(text, record) {
    return (Object.prototype.toString.call(text) === '[object String]' && text !== '') ? text : '-'
  }
  //表格
  const tableProps = {
    columns: [{
      title: '任务名称',
      dataIndex: 'task_name',
      key: 'task_name',
      render: renderColumns
    }, {
      title: '对应线路',
      dataIndex: 'line_name',
      key: 'line_name',
      render: renderColumns
    }, {
      title: '执行人员',
      dataIndex: 'user_name',
      key: 'user_name',
      render: renderColumns
    }, {
      title: '规定开始时间',
      dataIndex: 'start_at',
      key: 'start_at',
      render: renderColumns
    }, {
      title: '规定结束时间',
      dataIndex: 'end_at',
      key: 'end_at',
      render: renderColumns
    }, {
      title: '完成时间',
      dataIndex: 'finish_at',
      key: 'finish_at',
      render: renderColumns
    }, {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: renderColumns,
      width: '6%'
    }, {
      title: '巡检点数量',
      dataIndex: 'point_count',
      key: 'point_count',
      render: renderColumns
    }, {
      title: '完成数量',
      dataIndex: 'finish_count',
      key: 'finish_count',
      render: renderColumns
    }, {
      title: '漏检数量',
      dataIndex: 'miss_count',
      key: 'miss_count',
      render: renderColumns
    }, {
      title: '异常数量',
      dataIndex: 'issue_count',
      key: 'issue_count',
      render: renderColumns
    }, {
      title: '完成率',
      dataIndex: 'finish_rate',
      key: 'finish_rate',
      render: renderColumns,
      width: '6%'
    }, {
      title: '操作',
      dataIndex: 'desc',
      render: (text, record) => {
        let link = `/inspectRecordView?id=${record.id}`;
        return <div>
          {author("view") ? <Link to={link} className="mr1">查看详情</Link> : null}
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
          type: 'InspectRecordModel/inspectRecordList',
          payload: { ...params, page }
        })
      },
    },
    rowKey: record => record.id,
    loading: loading
  }
  // 导出
  function handleExport() {
    form.validateFields((err, values) => {
      dispatch({
        type: 'InspectRecordModel/inspectRecordExport',
        payload: {...params},
        callback(data) {
          download(data);
        }
      });
    });
  }
  //搜索
  function handSearch(val) {
    form.validateFields((err, values) => {
      let param = {};
      param.start_at = values.time ? values.time[0].format('YYYY-MM-DD') : '';
      param.end_at = values.time ? values.time[1].format('YYYY-MM-DD') : '';
      param.plan_name = values.plan_name;
      param.line_name = values.line_name;
      param.status = values.status;
      param.user_id = values.user_id;
      param.community_id = getCommunityId();
      dispatch({
        type: 'InspectRecordModel/inspectRecordList', payload: { ...params, ...param, page: 1 }
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
        plan_name: '',
        line_name: '',
        status: '',
        start_at: "",
        end_at: "",
        user_id: ""
      }
      dispatch({
        type: 'InspectRecordModel/inspectRecordList', payload
      });
    })
  }
  return (<div>
    <Breadcrumb separator="/">
      <Breadcrumb.Item>设备巡检</Breadcrumb.Item>
      <Breadcrumb.Item>巡检记录</Breadcrumb.Item>
    </Breadcrumb>
    <Card>
      <Form>
        <Row>
          <Col span={6}>
            <FormItem label="任务名称" {...formItemLayout}>
              {getFieldDecorator('plan_name')(
                <Input type="text" placeholder="请输入任务名称" />
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="对应线路" {...formItemLayout}>
              {getFieldDecorator('line_name')(
                <Input type="text" placeholder="请输入对应线路名称" />
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="任务状态" {...formItemLayout}>
              {getFieldDecorator('status')(
                <Select placeholder="请选择任务状态">
                  <Option value="">全部</Option>
                  <Option key="1" value="1">未完成</Option>
                  <Option key="2" value="2">部分完成</Option>
                  <Option key="3" value="3">已完成</Option>
                </Select>
              )}
            </FormItem>
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
          <Col span={12}>
            <Form.Item label="任务时间" {...formItem1}>
              {getFieldDecorator('time')(<RangePicker style={{ width: '96%' }} />)}
            </Form.Item>
          </Col>
          <Col className="fr" span={4}>
            <Button type="primary" onClick={handSearch} className="mr1" style={{ marginLeft: '10px' }} >查询</Button>
            <Button type="ghost" onClick={handleReset}>重置</Button>
          </Col>

        </Row>
      </Form>
    </Card>
    <Card className="mt1">
      {author("export") ?
        <Button type="primary" onClick={handleExport.bind(this)}>导出记录</Button> : null}
      <Table className="mt1" {...tableProps} />
    </Card>
  </div>)
}
function mapStateToProps(state) {
  return {
    ...state.InspectRecordModel,
    loading: state.loading.models.InspectRecordModel
  };
}
export default connect(mapStateToProps)(Form.create()(InspectRecord));
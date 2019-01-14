import React from 'react';
import { connect } from 'dva';
import { Form, Breadcrumb, Card, Row, Col, Button, Table, Select, DatePicker, Input } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
import { Link } from 'react-router-dom';
import { author, getCommunityId, download } from '../../utils/util';

function OutlierData(props) {
  const { dispatch, form, loading, list, paginationTotal, params, is_reset, userList } = props;
  const { getFieldDecorator } = form;
  if (is_reset == true) {
    form.resetFields();
    dispatch({
      type: 'OutlierData/concat',
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
      dataIndex: 'plan_name',
      key: 'plan_name',
      render: renderColumns
    }, {
      title: '对应线路',
      dataIndex: 'line_name',
      key: 'line_name',
      render: renderColumns
    }, {
      title: '对应巡检点',
      dataIndex: 'point_name',
      key: 'point_name',
      render: renderColumns
    }, {
      title: '对应设备',
      dataIndex: 'device_name',
      key: 'device_name',
      render: renderColumns
    }, {
      title: '设备状态',
      dataIndex: 'device_status',
      key: 'device_status',
      render: renderColumns
    }, {
      title: '巡检人员',
      dataIndex: 'user_name',
      key: 'user_name',
      render: renderColumns
    }, {
      title: '完成时间',
      dataIndex: 'finish_at',
      key: 'finish_at',
      render: renderColumns
    }, {
      title: '操作',
      dataIndex: 'desc',
      render: (text, record) => {
        let link = `/outlierDataView?id=${record.id}`;
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
          type: 'OutlierData/outlierDataList',
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
        type: 'OutlierData/outlierDataExport',
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
      param.community_id = getCommunityId();
      param.start_at = values.time ? values.time[0].format('YYYY-MM-DD') : '';
      param.end_at = values.time ? values.time[1].format('YYYY-MM-DD') : '';
      param.plan_name = values.plan_name;
      param.line_name = values.line_name;
      param.user_id = values.user_id;
      dispatch({
        type: 'OutlierData/outlierDataList', payload: { ...params, ...param, page: 1 }
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
        plan_name: "",
        line_name: "",
        user_id: "",
        start_at: "",
        end_at: ""
      }
      dispatch({
        type: 'OutlierData/outlierDataList', payload
      });
    })
  }
  return (<div>
    <Breadcrumb separator="/">
      <Breadcrumb.Item>设备巡检</Breadcrumb.Item>
      <Breadcrumb.Item>异常数据汇总</Breadcrumb.Item>
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
    ...state.OutlierData,
    loading: state.loading.models.OutlierData
  };
}
export default connect(mapStateToProps)(Form.create()(OutlierData));
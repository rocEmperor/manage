import React from 'react';
import { connect } from 'dva';
import { Form, Breadcrumb, Card, Input, DatePicker, Button, Table, Row, Col } from 'antd';
const { RangePicker } = DatePicker;

function LogManagement(props) {
  const { dispatch, loading, form, list, paginationTotal, params,is_reset } = props;
  const { getFieldDecorator } = form;
  if (is_reset == true) {
    form.resetFields();
    dispatch({
      type: 'LogManagement/concat',
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
  };
  const formItemLayout2 = {
    labelCol: {
      span: 3
    },
    wrapperCol: {
      span: 21
    },
  };
  /**
   * 判断数据是否有效
   * @param  {string} text
   * @return {string}
   */
  function renderColumns(text, record) {
    return (<span>{text ? text : '-'}</span>)
  }
  // 表格配置项
  const tableProps = {
    columns: [{
      title: '日志编号',
      dataIndex: 'id',
      key: 'id',
      render: renderColumns,
    }, {
      title: '用户姓名',
      dataIndex: 'operate_name',
      key: 'operate_name',
      render: renderColumns,
    }, {
      title: '手机号码',
      dataIndex: 'operate_mobile',
      key: 'operate_mobile',
      render: renderColumns,
    }, {
      title: '操作内容',
      dataIndex: 'operate_content',
      key: 'operate_content',
      render: (text, record) => {
        return (record.operate_menu + "-" + record.operate_type + "-" + record.operate_content)
      },
    }, {
      title: '操作时间',
      dataIndex: 'operate_time',
      key: 'operate_time',
      render: renderColumns,
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
          type: 'LogManagement/getCommOperateLog',
          payload: { ...params, page }
        })
      },
    },
    rowKey: record => record.id,
    loading: loading
  };
  /**
   * 搜索
   */
  function handSearch() {
    form.validateFields((err, values) => {
      let operate_time_start;
      let operate_time_end;
      if (values.date && values.date.length > 0) {
        operate_time_start = values.date[0].format('YYYY-MM-DD');
        operate_time_end = values.date[1].format('YYYY-MM-DD');
        delete values.date;
      } else {
        operate_time_start = '';
        operate_time_end = '';
        delete values.date;
      }
      dispatch({
        type: 'LogManagement/getCommOperateLog', payload: {
          ...params,
          ...values,
          page: 1,
          operate_time_start,
          operate_time_end,
        }
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
        operate_time_start: '',
        operate_time_end: '',
      }
      dispatch({
        type: 'LogManagement/getCommOperateLog', payload
      });
    })
  }

  return (<div>
    <Breadcrumb separator=">">
      <Breadcrumb.Item>系统设置</Breadcrumb.Item>
      <Breadcrumb.Item>日志管理</Breadcrumb.Item>
    </Breadcrumb>
    <Card>
      <Form>
        <Row>
          <Col span={6}>
            <Form.Item label="姓名/手机：" {...formItemLayout}>
              {getFieldDecorator('name')(
                <Input placeholder="用户姓名/手机号码" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="操作日期：" {...formItemLayout2}>
              {getFieldDecorator('date')(
                <RangePicker style={{width:'96%'}}/>
              )}
            </Form.Item>
          </Col>
          <div style={{textAlign: 'right'}}>
            <Button type="primary" onClick={handSearch.bind(this)} className="mr1">查询</Button>
            <Button type="ghost" onClick={handleReset.bind(this)}>重置</Button>
          </div>
        </Row>
      </Form>
    </Card>
    <Card className="mt1">
      <Table className="mt1" {...tableProps} />
    </Card>
  </div>)
}
function mapStateToProps(state) {
  return {
    ...state.LogManagement,
    loading: state.loading.models.LogManagement
  };
}
export default connect(mapStateToProps)(Form.create()(LogManagement));

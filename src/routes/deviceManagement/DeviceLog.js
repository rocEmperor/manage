import React from 'react';
import { connect } from 'dva';
import { Form, Breadcrumb, Card, Input, Select, Row, Col, Button, Table, DatePicker } from 'antd';
const Option = Select.Option;
const { RangePicker } = DatePicker;
import './DeviceManagement.css';

function DeviceLog(props) {
  const { dispatch, form, loading, groupData, buildingData, unitData, data, totals, params, group,is_reset } = props;
  const { getFieldDecorator } = form;
  if (is_reset == true) {
    form.resetFields();
    dispatch({
      type: 'DeviceLog/concat',
      payload: {
        is_reset: false,
      }
    });
  }
  /**
   * 级联列表
   * @param  {string} name
   * @param  {string} val
   * name = group 关联门禁
   * name = building 幢
   */
  function selectChange(name, val) {
    if (name === 'group') {
      props.form.resetFields(['building', 'unit']);
      dispatch({
        type: 'DeviceLog/concat', payload: { group: val }
      });
      dispatch({
        type: 'DeviceLog/getBuildings', payload: { community_id: params.community_id, group: val }
      });
    } else if (name === 'building') {
      props.form.resetFields(['unit']);
      dispatch({
        type: 'DeviceLog/getUnits', payload: { community_id: params.community_id, group: group, building: val }
      });
    }
  }
  /**
   * 搜索
   */
  function handleSearch() {
    form.validateFields((err, values) => {
      let start;
      let end;
      if (values.date && values.date.length > 0) {
        start = values.date[0].format('YYYY-MM-DD');
        end = values.date[1].format('YYYY-MM-DD');
        delete values.date;
      } else {
        delete values.date;
      }
      dispatch({
        type: 'DeviceLog/getOpendoorLog', payload: { ...params, ...values, start, end, page: 1 }
      });
    })
  }
  /**
   * 重置
   */
  function handleReset() {
    dispatch({
      type: 'DeviceLog/concat',
      payload: {
        group: '',
        buildingData: []
      }
    });
    form.resetFields();
    form.validateFields((err, values) => {
      const param = {
        page: 1,
        rows: 10,
        username: "",
        group: "",
        building: "",
        unit: "",
        start: "",
        end: ""
      }
      dispatch({
        type: 'DeviceLog/getOpendoorLog', payload: param
      });
    })
  }
  function changeRangePicker (dates, dateStrings) {
    form.setFieldsValue({date: dates})
  }
  /**
   * 判断数据是否有效
   * @param  {string} text
   */
  const noData = (text, record) => {
    return (
      <span>{text ? text : '-'}</span>
    )
  };
  // 表格列配置
  const columns = [{
    title: '设备类型',
    key: 'door_type',
    render: (text, record) => {
      return record.door_type.name
    },
  }, {
    title: '设备号',
    dataIndex: 'device_id',
    key: 'device_id',
    render: noData,
  }, {
    title: '业主姓名',
    dataIndex: 'username',
    key: 'username',
    render: noData,
  }, {
    title: '关联门禁',
    dataIndex: 'community',
    key: 'community',
    render: (text, record) => {
      return <span>{text.name} {record.group} {record.building} {record.unit}</span>
    },
  }, {
    title: '开门方式',
    dataIndex: 'open_type',
    key: 'open_type',
    render: (text, record) => {
      return text.name
    },
  }, {
    title: '开门时间',
    dataIndex: 'open_at',
    key: 'open_at',
    render: noData,
  }];
  // 表格配置项
  const tableProps = {
    rowKey: record => record.id,
    loading: loading,
    columns: columns,
    dataSource: data
  };
  // 分页
  const pagination = {
    showTotal: (total, range) => `共 ${totals} 条`,
    defaultCurrent: 1,
    current: params.page,
    defaultPageSize: 10,
    total: totals,
    onChange: (page, size) => { dispatch({ type: 'DeviceLog/getOpendoorLog', payload: { ...params, page } }) },
  };
  const formItemLayout = {
    labelCol: {
      span: 6
    },
    wrapperCol: {
      span: 16
    }
  };
  const formItemLayout2 = {
    labelCol: {
      span: 3
    },
    wrapperCol: {
      span: 21
    }
  };
  const formItemLayout1 = {
    wrapperCol: {
      span: 24
    }
  };
  return (
    <div>
      <Breadcrumb separator=">">
        <Breadcrumb.Item>门禁管理</Breadcrumb.Item>
        <Breadcrumb.Item>出入记录</Breadcrumb.Item>
      </Breadcrumb>
      <Card className="section">
        <Form>
          <Row>
            <Col span={6}>
              <Form.Item label="业主姓名：" {...formItemLayout}>
                {getFieldDecorator('username')(<Input className="select-150 mr-5" placeholder="请输入业主姓名" />)}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="关联门禁：" {...formItemLayout}>
                {getFieldDecorator('group')(
                  <Select showSearch={true} placeholder="苑\期\区" notFoundContent="没有数据" onChange={selectChange.bind(this, 'group')}>
                    {groupData.map((value, index) => {
                      return <Option key={index} value={value.name}>{value.name}</Option>
                    })}
                  </Select>)}
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item {...formItemLayout1}>
                {getFieldDecorator('building')(
                  <Select showSearch={true} placeholder="幢" notFoundContent="没有数据" onChange={selectChange.bind(this, 'building')}>
                    {buildingData.map((value, index) => {
                      return <Option key={index} value={value.name}>{value.name}</Option>
                    })}
                  </Select>)}
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item  {...formItemLayout1}>
                {getFieldDecorator('unit')(
                  <Select placeholder="单元" notFoundContent="没有数据" showSearch={true}>
                    {unitData.map((value, index) => {
                      return <Option key={index} value={value.name}>{value.name}</Option>
                    })}
                  </Select>)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label="开门时间：" {...formItemLayout2}>
                {getFieldDecorator('date')(
                  <RangePicker onChange={changeRangePicker} style={{width:'96%'}}/>
                )}
              </Form.Item>
            </Col>
            <Col span={4} style={{ textAlign: 'right', paddingRight: '2%' }} offset={6}>
              <Button type="primary" onClick={handleSearch} className="mr1" style={{ marginRight: '10px' }} >查询</Button>
              <Button type="ghost" onClick={handleReset}>重置</Button>
            </Col>
          </Row>
        </Form>
      </Card>
      <Card className="section child-section">
        <Table  {...tableProps} pagination={pagination} loading={loading}/>
      </Card>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    ...state.DeviceLog
  };
}
export default connect(mapStateToProps)(Form.create()(DeviceLog));


import React from 'react';
import { connect } from 'dva';
import { Form, Breadcrumb, Card, Input, Select, Button, Row, Col, Table } from 'antd';
const Option = Select.Option;
import './DeviceManagement.css';

function DeviceManagement(props) {
  const { dispatch, form, groupData, loading, buildingData, unitData, door_type, data, totals, params, group,is_reset } = props;
  const { getFieldDecorator } = form;
  if (is_reset == true) {
    form.resetFields();
    dispatch({
      type: 'DeviceManagement/concat',
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
        type: 'DeviceManagement/concat', payload: { group: val }
      });
      dispatch({
        type: 'DeviceManagement/getBuildings', payload: { community_id: params.community_id, group: val }
      });
    } else if (name === 'building') {
      props.form.resetFields(['unit']);
      dispatch({
        type: 'DeviceManagement/getUnits', payload: { community_id: params.community_id, group: group, building: val }
      });
    }
  }
  /**
   * 重置
   */
  function handleReset() {
    dispatch({
      type: 'DeviceManagement/concat',
      payload: {
        group: '' ,
        buildingData: []
      }
    });
    form.resetFields();
    form.validateFields((err, values) => {
      const param = {
        page: 1,
        rows: 10,
        device_id: "",
        group: "",
        building: "",
        unit: "",
        type: ""
      };
      dispatch({
        type: 'DeviceManagement/getDeviceList', payload: param
      });
    })
  }
  /**
   * 搜索
   */
  function handleSearch(e) {
    form.validateFields((err, values) => {
      dispatch({
        type: 'DeviceManagement/getDeviceList',
        payload: { ...params, ...values }
      });
    })
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
  const columns = [{
    title: '设备类型',
    key: 'type',
    render: (text, record) => {
      return <span>{record.type.name}</span>
    },
  }, {
    title: '设备号',
    dataIndex: 'device_id',
    key: 'device_id',
    render: noData,
  }, {
    title: '供应商',
    key: 'supplier',
    render: (text, record) => {
      return <span>{record.supplier.name}</span>
    },
  }, {
    title: '联系人',
    key: 'contactor',
    render: (text, record) => {
      return <span>{record.contactor.name} {record.contactor.mobile}</span>
    },
  }, {
    title: '关联门禁',
    key: 'community',
    render: (text, record) => {
      return <span>{record.community.name} {record.group} {record.building} {record.unit}</span>
    },
  }, {
    title: '备注',
    dataIndex: 'note',
    key: 'note',
    render: noData,
  }, {
    title: '添加时间',
    dataIndex: 'create_at',
    key: 'create_at',
    render: noData,
  }];

  const tableProps = {
    rowKey: record => record.id,
    // loading: loading,
    columns: columns,
    dataSource: data
  }
  const pagination = {
    showTotal: (total, range) => `共 ${totals} 条`,
    defaultCurrent: 1,
    current: params.page,
    defaultPageSize: 10,
    total: totals,
    onChange: (page, size) => { dispatch({ type: 'DeviceManagement/getDeviceList', payload: { ...params, page } }) },
  };
  const formItemLayout = {
    labelCol: {
      span: 6
    },
    wrapperCol: {
      span: 16
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
        <Breadcrumb.Item>门禁设备管理</Breadcrumb.Item>
      </Breadcrumb>
      <Card className="section">
        <Form className="formbox">
          <Row>
            <Col span={6}>
              <Form.Item label="设备号：" className="mb1" {...formItemLayout}>
                {getFieldDecorator('device_id')(<Input className="select150"  placeholder="请输入设备号" />)}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="关联门禁：" className="mb1" {...formItemLayout}>
                {getFieldDecorator('group')(
                  <Select className="select150"  placeholder="苑\期\区" showSearch={true} notFoundContent="没有数据" onChange={selectChange.bind(this, 'group')}>
                    {groupData.map((value, index) => {
                      return <Option key={index} value={value.name}>{value.name}</Option>
                    })}
                  </Select>)}
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item className="mb1" {...formItemLayout1}>
                {getFieldDecorator('building')(
                  <Select className="select100"  placeholder="幢" showSearch={true} notFoundContent="没有数据" onChange={selectChange.bind(this, 'building')}>
                    {buildingData.map((value, index) => {
                      return <Option key={index} value={value.name}>{value.name}</Option>
                    })}
                  </Select>)}
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item className="mb1" {...formItemLayout1}>
                {getFieldDecorator('unit')(
                  <Select className="select100"  placeholder="单元" showSearch={true} notFoundContent="没有数据">
                    {unitData.map((value, index) => {
                      return <Option key={index} value={value.name}>{value.name}</Option>
                    })}
                  </Select>)}
              </Form.Item>
            </Col>
            
          </Row>
        </Form>
        <Row>
          <Col span={6}>
            <Form.Item label="设备类型：" className="mb1" {...formItemLayout}>
              {getFieldDecorator('type')(<Select style={{width:'100%'}} placeholder="请选择">
                {door_type.length > 0 ? <Option value="">全部</Option> : null}
                {door_type.map((value, index) => {
                  return <Option key={index} value={value.id}>{value.name}</Option>
                })}
              </Select>)}
            </Form.Item>
          </Col>
          <Col span={24} style={{ textAlign: "right", paddingRight: '2%'}}>
            <Button type="primary" onClick={handleSearch} className="mr1" style={{ marginLeft: '10px' }} >查询</Button>
            <Button type="ghost" onClick={handleReset}>重置</Button>
          </Col>
        </Row>
      </Card>
      <Card className="section child-section">
        <Table  {...tableProps} pagination={pagination} loading={loading}/>
      </Card>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    ...state.DeviceManagement
  };
}
export default connect(mapStateToProps)(Form.create()(DeviceManagement));


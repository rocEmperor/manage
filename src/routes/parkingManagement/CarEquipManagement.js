import React from 'react';
import { connect } from 'dva';
import { Form, Breadcrumb, Card, Row, Col, Input, Button, Select, Table } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;


function CarEquipManagement(props) {
  const { dispatch, loading, form, list, typeOption, params, totals,is_reset } = props;
  const { getFieldDecorator } = form;
  if (is_reset == true) {
    form.resetFields();
    dispatch({
      type: 'CarEquipManagement/concat',
      payload: {
        is_reset: false,
      }
    });
  }
  const formItemLayout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 16,
    },
  };
  
  const columns = [{
    title: '编号',
    dataIndex: 'id',
    key: 'id',
  }, {
    title: '设备类型',
    dataIndex: 'equipmentType',
    key: 'equipmentType',
    render: (text, record, index) => {
      return record.type.name
    }
  }, {
    title: '设备号', 
    dataIndex: 'device_id',
    key: 'device_id',
  }, {
    title: '供应商', 
    dataIndex: 'supplier',
    key: 'supplier',
    render: (text, record, index) => {
      return record.supplier.name
    }
  }, {
    title: '联系人', 
    dataIndex: 'phone',
    key: 'phone',
    render: (text, record, index) => {
      return record.supplier.mobile
    }
  }, {
    title: '关联出入口', 
    dataIndex: 'address',
    key: 'address',
  }, {
    title: '备注', 
    dataIndex: 'remark',
    key: 'remark',
  }, {
    title: '添加时间', 
    dataIndex: 'create_at',
    key: 'create_at',
  }]

  const pagination = {
    showTotal: (total, range) => `共 ${totals} 条`,
    defaultCurrent: 1,
    current: params.page,
    defaultPageSize: 10,
    total: totals,
    onChange: (page, size) => { dispatch({ type: 'CarEquipManagement/getCarEquipList', payload: { ...params, page } }) },
  }

  const tableProps = {
    rowKey: record => record.id,
    loading: loading,
    columns: columns,
    dataSource: list
  }

  function handSearch(e) {
    form.validateFields((err, values) => {
      dispatch({
        type: 'CarEquipManagement/getCarEquipList', payload: { ...params, ...values }
      });
    })
  }
  function handleReset(e) {
    form.resetFields();
    form.validateFields((err, values) => {
      const param = {
        page: 1,
        rows: 10,
        address: "",
        device_id: "",
        type: ''
      }
      dispatch({
        type: 'CarEquipManagement/getCarEquipList', payload: param
      });
    })
  }

  return (
    <div>
      <Breadcrumb separator=">">
        <Breadcrumb.Item>停车管理</Breadcrumb.Item>
        <Breadcrumb.Item>停车场设备管理</Breadcrumb.Item>
      </Breadcrumb>
      <Card className="section">
        <Form>
          <Row>
            <Col span={6}>
              <FormItem label="设备号" {...formItemLayout}>
                {getFieldDecorator('device_id')(<Input type="text" placeholder="请输入设备号" />
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="设备类型" {...formItemLayout}>
                {getFieldDecorator('type')(
                  <Select placeholder="请选择设备类型" notFoundContent="没有数据">
                    {typeOption.length > 0 ? <Option value="">全部</Option> : undefined}
                    {
                      typeOption.map((value, index) => { return <Option key={index} value={String(value.id)}>{value.name}</Option> })
                    }
                  </Select>
                )}
              </FormItem>
            </Col>  
            <Col span={6}>
              <FormItem label="关联出入口" {...formItemLayout}>
                {getFieldDecorator('address')(<Input type="text" placeholder="请输入关联出入口" />
                )}
              </FormItem>
            </Col>
            <Col span={6} style={{ textAlign: 'right', paddingRight: '35px' }}>
              <Button type="primary" onClick={handSearch} className="mr1" style={{ marginLeft: '10px' }} >查询</Button>
              <Button type="ghost" onClick={handleReset}>重置</Button>
            </Col>
          </Row>
        </Form>
      </Card>
      <Card>
        <Table className="mt1" {...tableProps} pagination={pagination}  />
      </Card>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    ...state.CarEquipManagement,
    loading: state.loading.models.CarEquipManagement
  };
}
export default connect(mapStateToProps)(Form.create()(CarEquipManagement));
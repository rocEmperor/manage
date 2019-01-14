import React from 'react';
import { connect } from 'dva';
import { Form, Breadcrumb, Card, Row, Col, Input, Button, Select, Table, DatePicker } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;


function GetOutManagement(props) {
  const { dispatch, loading, form, list, typeOption, params, totals,is_reset } = props;
  const { getFieldDecorator } = form;
  if (is_reset == true) {
    form.resetFields();
    dispatch({
      type: 'GetOutManagement/concat',
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
  const formItemLayout2 = {
    labelCol: {
      span: 3,
    },
    wrapperCol: {
      span: 21,
    },
  };
  const formItemLayout3 = {
    labelCol: {
      span: 3,
    },
    wrapperCol: {
      span: 16,
    },
  };
  const columns = [{
    title: '编号',
    dataIndex: 'tid',
    key: 'tid',
  }, {
    title: '车牌号',
    dataIndex: 'car_num',
    key: 'car_num',
  }, {
    title: '出口',
    dataIndex: 'out_address',
    key: 'out_address',
  }, {
    title: '出库时间',
    dataIndex: 'out_time',
    key: 'out_time',
  }, {
    title: '入口',
    dataIndex: 'in_address',
    key: 'in_address',
  }, {
    title: '入库时间',
    dataIndex: 'in_time',
    key: 'in_time',
  }, {
    title: '车辆属性',
    dataIndex: 'name',
    key: 'name',
    render: (text, record, index) => {
      return record.car_type.name
    }
  }, {
    title: '停车时长',
    dataIndex: 'park_time',
    key: 'park_time',
  }, {
    title: '停车费用',
    dataIndex: 'amount',
    key: 'amount',
  }]
  const pagination = {
    showTotal: (total, range) => `共 ${totals} 条`,
    defaultCurrent: 1,
    current: params.page,
    defaultPageSize: 10,
    total: totals,
    onChange: (page, size) => { dispatch({ type: 'GetOutManagement/getOutList', payload: { ...params, page } }) },
  }

  const tableProps = {
    rowKey: record => record.id,
    loading: loading,
    columns: columns,
    dataSource: list
  }

  function handSearch(e) {
    form.validateFields((err, values) => {
      const param = {
        car_num: values.car_num,
        car_type: values.car_type,
        amount_min: values.amount_min,
        amount_max: values.amount_max
      };
      param.page = 1;
      param.rows = 10;
      param.community_id = sessionStorage.getItem("communityId");
      if (values.out_time && values.out_time.length > 0) {
        param.out_time_start = values.out_time ? values.out_time[0].format('YYYY-MM-DD') : '';
        param.out_time_end = values.out_time ? values.out_time[1].format('YYYY-MM-DD') : '';
      }else{
        param.out_time_start = '';
        param.out_time_end = '';
      }
      dispatch({
        type: 'GetOutManagement/getOutList', payload: param
      });
      dispatch({
        type: 'GetOutManagement/concat', payload: {params:param}
      });
    })
  }
  function handleReset(e) {
    form.resetFields();
    form.validateFields((err, values) => {
      const param = {
        page: 1,
        rows: 10,
        plate: "",
        out_time_start:"",
        out_time_end:"",
        amount_min: '',
        amount_max: '',
        car_type: ''
      }
      dispatch({
        type: 'GetOutManagement/getOutList', payload: param
      });
      dispatch({
        type: 'GetOutManagement/concat', payload: { params: param }
      });
    })
  }
  return (
    <div>
      <Breadcrumb separator=">">
        <Breadcrumb.Item>停车管理</Breadcrumb.Item>
        <Breadcrumb.Item>出库记录</Breadcrumb.Item>
      </Breadcrumb>
      <Card className="section">
        <Form>
          <Row>
            <Col span={6}>
              <FormItem label="车牌号" {...formItemLayout}>
                {getFieldDecorator('car_num')(<Input type="text" placeholder="请输入车牌号" />
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="车辆类别" {...formItemLayout}>
                {getFieldDecorator('car_type')(
                  <Select placeholder="请选择车辆属性" notFoundContent="没有数据">
                    {
                      typeOption.map((value, index) => { return <Option key={index} value={String(value.id)}>{value.name}</Option> })
                    }
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="入库时间" {...formItemLayout2}>
                {getFieldDecorator('out_time')(
                  <RangePicker style={{width:'96%'}}/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem label="停车费用：" {...formItemLayout3}>
                {getFieldDecorator('amount_min')(
                  <Input placeholder="请输入起始停车费用" style={{ width: 167, marginRight: '10px' }} addonAfter="元" />
                )}
                <span className="mr1">至</span>
                {getFieldDecorator('amount_max')(
                  <Input placeholder="请输入最大停车费用" style={{ width: 167 }} addonAfter="元" />
                )}
              </FormItem>
            </Col>
            <Col span={10} style={{ textAlign: 'right' }}>
              <Button type="primary" onClick={handSearch} className="mr1" style={{ marginLeft: '10px' }} >查询</Button>
              <Button type="ghost" onClick={handleReset}>重置</Button>
            </Col>
          </Row>
        </Form>
      </Card>
      <Card>
        <Table {...tableProps} pagination={pagination} />
      </Card>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    ...state.GetOutManagement,
    loading: state.loading.models.GetOutManagement
  };
}
export default connect(mapStateToProps)(Form.create()(GetOutManagement));
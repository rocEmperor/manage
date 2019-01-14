import React from 'react';
import { connect } from 'dva';
import { Form, Breadcrumb, Card, Row, Col, Input, Button, Select, Table, DatePicker } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker} = DatePicker;
const dateFormat = 'YYYY-MM-DD';
import moment from 'moment';


function GetInManagement(props) {
  const { dispatch, loading, form, list, typeOption, params, totals,is_reset } = props;
  const { getFieldDecorator } = form;
  if (is_reset == true) {
    form.resetFields();
    dispatch({
      type: 'GetInManagement/concat',
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
  const columns = [{
    title: '编号',
    dataIndex: 'id',
    key: 'id',
  },{
    title: '车牌号',
    dataIndex: 'car_num',
    key: 'plate',
  },{
    title: '入口',
    dataIndex: 'in_address',
    key: 'in_address',
  },{
    title: '入库时间',
    dataIndex: 'in_time',
    key: 'in_time',
  },{
    title: '停车时长',
    dataIndex: 'park_time',
    key: 'park_time',
  },{
    title: '车辆属性',
    dataIndex: 'name',
    key: 'name',
    render: (text, record, index) => {
      return record.car_type.name
    }
  }]
  const pagination = {
    showTotal: (total, range) => `共 ${totals} 条`,
    defaultCurrent: 1,
    current: params.page,
    defaultPageSize: 10,
    total: totals,
    onChange: (page, size) => { dispatch({ type: 'GetInManagement/getInList', payload: { ...params, page } }) },
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
        type: values.type,
      };
      param.page = 1;
      param.rows = 10;
      param.community_id = sessionStorage.getItem("communityId");
      if (values.in_time && values.in_time.length > 0) {
        param.in_time_start = values.in_time ? values.in_time[0].format('YYYY-MM-DD') : '';
        param.in_time_end = values.in_time ? values.in_time[1].format('YYYY-MM-DD') : '';
      }else{
        param.in_time_start = '';
        param.in_time_end = '';
      }
      dispatch({
        type: 'GetInManagement/getInList', payload: param
      });
      dispatch({
        type: 'GetInManagement/concat',
        payload: {
          params: param
        }
      });
    })
  }
  function handleReset(e) {

    form.resetFields();
    form.validateFields((err, values) => {
      const myDate = new Date();
      const year = myDate.getFullYear();
      const month = myDate.getMonth() + 1;
      const getDate = myDate.getDate();
      const time = year + '-' + month + '-' + getDate;
      const param = {
        page: 1,
        rows: 10,
        plate: "",
        in_time_start: time,
        in_time_end: time,
        name:'',
        type:""
      }
      dispatch({
        type: 'GetInManagement/getInList', payload: param
      });
      dispatch({
        type: 'GetInManagement/concat', payload: { params: param }
      });
    })
  }

  return (
    <div>
      <Breadcrumb separator=">">
        <Breadcrumb.Item>停车管理</Breadcrumb.Item>
        <Breadcrumb.Item>在库车辆</Breadcrumb.Item>
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
              <FormItem label="车辆属性" {...formItemLayout}>
                {getFieldDecorator('type')(
                  <Select placeholder="请选择车辆属性" notFoundContent="没有数据">
                    {
                      typeOption.map((value, index) => { return <Option key={index} value={String(value.id)}>{value.name}</Option> })
                    }
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="入库时间" {...formItemLayout2} >
                {getFieldDecorator('in_time',
                  {
                    initialValue: ([moment(params.in_time_start + '', dateFormat), moment(params.in_time_end+'', dateFormat)])
                  }
                )(
                  <RangePicker style={{ width: '96%' }} />
                )}
              </FormItem>
            </Col>
            <Col span={6} style={{ textAlign: 'right' }} className="fr">
              <Button type="primary" onClick={handSearch} className="mr1" style={{ marginLeft: '10px' }} >查询</Button>
              <Button type="ghost" onClick={handleReset}>重置</Button>
            </Col>
          </Row>
        </Form>
      </Card>
      <Card>
        <Table {...tableProps} pagination={pagination}  />
      </Card>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    ...state.GetInManagement,
    loading: state.loading.models.GetInManagement
  };
}
export default connect(mapStateToProps)(Form.create()(GetInManagement));
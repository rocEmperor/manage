import React from 'react';
import { connect } from 'dva';
import { Link } from 'react-router-dom';
import { Breadcrumb, Form, Card, Select, Button, Input, Col, Row, DatePicker, Table, Popconfirm } from 'antd';
import { author } from '../../utils/util';
import Community from '../../components/Community/Community.js';
const FormItem = Form.Item;
const Option = Select.Option;

function PackageManagement(props) {
  const { dispatch, packageStatus, form, expressCompany, list, totals, params, loading, is_reset, statusId } = props;
  const { getFieldDecorator } = form;

  if (is_reset == true) {
    form.resetFields();
    dispatch({
      type: 'PackageManagement/concat',
      payload: {
        is_reset: false,
      }
    });
  }
  function reload(params) {
    dispatch({
      type: 'PackageManagement/getPackageList',
      payload: params,
    });
    dispatch({
      type: 'PackageManagement/concat',
      payload: {params:params},
    });
  }

  //搜索确定
  function handleSubmit(e) {
    form.validateFields((err, values) => {
      const param = {
        receiver: values.receiver,
        mobile: values.mobile,
        status: values.status,
        delivery_id: values.delivery_id,
        tracking_no: values.tracking_no,
        group: values.group,
        building: values.building,
        unit: values.unit,
        room: values.room
      };
      param.page = 1;
      param.rows = 10;
      param.community_id = sessionStorage.getItem("communityId");
      if (values.time && values.time.length > 0) {
        param.time_start = values.time ? values.time[0].format('YYYY-MM-DD') : '';
        param.time_end = values.time ? values.time[1].format('YYYY-MM-DD') : '';
      }else{
        param.time_start = '';
        param.time_end = '';
      }
      reload(param);
    })
  }
  //重置按钮
  function handleReset() {
    form.resetFields();
    form.validateFields((err, values) => {
      const param = {
        page: 1,
        rows: 10,
        community_id: sessionStorage.getItem("communityId"),
        receiver: '',
        mobile: '',
        status: statusId?statusId:"",
        delivery_id: '',
        tracking_no: '',
        time_start: '',
        time_end: '',
        group: '',
        building: '',
        unit: '',
        room: '',
      }
      reload(param);
    })
  }
  /**
   * 
   * @param {status} record
   * record.status.id = 1 未领取
   * record.status.id = 2 已领取
   */
  function handleOk(record) {
    const param = params;
    dispatch({
      type: 'PackageManagement/getPackageReceive',
      payload: {
        id: record.id,
        status: record.status.id == 1 ? 2 : 1,
        params: param,
      }
    })
  }


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
  }
  const {
    RangePicker
  } = DatePicker;
  const columns = [{
    title: '快递公司',
    dataIndex: 'delivery.name',
    key: 'delivery.name',
  }, {
    title: '运单号',
    dataIndex: 'tracking_no',
    key: 'tracking_no',
  }, {
    title: '收件人手机',
    dataIndex: 'mobile',
    key: 'mobile',
  }, {
    title: '收件人',
    dataIndex: 'receiver',
    key: 'receiver',
  }, {
    title: '户号',
    dataIndex: 'room_info',
    key: 'room_info',
  }, {
    title: '包裹状态',
    dataIndex: 'status.name',
    key: 'status.name',
  }, {
    title: '包裹备注',
    dataIndex: 'note.name',
    key: 'note.name',
  }, {
    title: '投放时间',
    dataIndex: 'create_at',
    key: 'create_at',
  }, {
    title: '领取时间',
    dataIndex: 'receive_at',
    key: 'receive_at',
  }, {
    title: '操作',
    dataIndex: 'desc',
    render: (text, record) => {
      let link = `/packageAdd?id=${record.id}`;
      return <div>
        {record.status.id == 1 ?
          <div>
            {author('edit') ? <Link to={link}>编辑</Link> : null}
            {
              author('signConfirmDraw') ?
                <Popconfirm title="确定该包裹已领取？" okText="确认" cancelText="取消" onConfirm={handleOk.bind(this, record)}>
                  <a className="ml1">确认领取</a>
                </Popconfirm> : null
            }
          </div> : ''}
      </div>
    }
  }];
  const pagination = {
    showTotal(total, range) {
      return '共 ' + totals + ' 条'
    },
    defaultCurrent: 1,
    current: params.page,
    defaultPageSize: 10,
    total: totals,
    onChange: (page, size) => { dispatch({ type: 'PackageManagement/getPackageList', payload: { ...params, page } }) },
  };
  const tableProps = {
    rowKey: record => record.id,
    loading: loading,
    columns: columns,
    dataSource: list
  };

  return (
    <div className="page-content">
      <Breadcrumb separator=">">
        <Breadcrumb.Item>物业服务</Breadcrumb.Item>
        <Breadcrumb.Item>小区包裹</Breadcrumb.Item>
      </Breadcrumb>
      <Card className="section">
        <Form>
          <Row>
            <Col span={6}>
              <FormItem label="包裹状态：" {...formItemLayout}>
                {getFieldDecorator('status', { initialValue: statusId ? "1" : undefined })(
                  <Select placeholder="请选择包裹状态">
                    <Option value="">全部</Option>
                    {packageStatus.map((value, index) => {
                      return <Option key={index} value={String(value.id)}>{value.name}</Option>
                    })}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="收件人姓名：" {...formItemLayout}>
                {getFieldDecorator('receiver')(<Input placeholder="请输入收件人姓名" />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="手机号码：" {...formItemLayout}>
                {getFieldDecorator('mobile')(<Input placeholder="请输入手机号码" />)}
              </FormItem>
            </Col>

            <Col span={6}>
              <FormItem label="快递公司：" {...formItemLayout}>
                {getFieldDecorator('delivery_id')(
                  <Select placeholder="请选择快递公司">
                    {expressCompany.map((value, index) => {
                      return <Option key={index} value={String(value.id)}>{value.name}</Option>
                    })}
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Community form={form} allDatas={{ group: {}, building: {}, unit: {}, room: {} }} />
            <Col span={6}>
              <FormItem label="运单号：" {...formItemLayout}>
                {getFieldDecorator('tracking_no')(<Input placeholder="请输入运单号" />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem label="到达时间：" {...formItemLayout2}>
                {getFieldDecorator('time')(<RangePicker style={{width:'96%'}}/>)}
              </FormItem>
            </Col>
            <Col span={5} offset={1} className="fr">
              <Button type="primary" className="mr1" onClick={handleSubmit}>查询</Button>
              <Button type="ghost" onClick={handleReset}>重置</Button>
            </Col>
          </Row>
        </Form>
      </Card>
      <Card className="mt1">
        {
          author('add') ? <Link to="/packageAdd"><Button type="primary">新增包裹</Button></Link> : null
        }

        <Table className="mt1" {...tableProps} pagination={pagination} />
      </Card>
    </div>
  )
}

function mapStateToProps(state) {
  return {
    ...state.PackageManagement,
    loading: state.loading.models.PackageManagement
  };
}
export default connect(mapStateToProps)(Form.create()(PackageManagement));
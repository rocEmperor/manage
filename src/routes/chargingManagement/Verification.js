import React from 'react';
import { connect } from 'dva';
import { Form, Row, Col, Button, Breadcrumb, Table, Select, Card, DatePicker, Popconfirm } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker, MonthPicker} = DatePicker;
import InvoiceModal from './components/cashierDesk/invoiceModal';
import { noData,author } from '../../utils/util';

function Verification(props) {
  let { dispatch, form, list, totals, params, loading, visible, communityList, is_reset, detail } = props;
  if (is_reset == true) {
    form.resetFields();
    dispatch({
      type: 'VerificationModel/concat',
      payload: {
        is_reset: false,
      }
    });
  }
  const { getFieldDecorator } = form;

  // 布局
  const formItemLayout = {
    labelCol: {
      span: 6
    },
    wrapperCol: {
      span: 16
    },
  }

  function reload(params) {
    dispatch({
      type: 'VerificationModel/getList',
      payload: params,
    });
  }

  /**
  * 查询
  */
  function handleSubmit() {
    form.validateFields((err, values) => {
      const param = values;
      if (values.income && values.income.length > 0) {
        param.income_end = values.income[1].format('YYYY-MM-DD');
        param.income_start = values.income[0].format('YYYY-MM-DD');
        delete values.income;
      } else {
        param.income_end = '';
        param.income_start = '';
        delete values.income;
      }
      param.page = 1;
      param.rows = 10;
      if (values.entry_at){
        param.entry_at = values.entry_at.format("YYYY-MM");
      }else{
        param.entry_at = "";
      }
      reload(param);
    })
  }

  /**
   * 重置
   */
  function handleReset() {
    form.resetFields();
    form.validateFields((err, values) => {
      const param = {
        page: 1,
        rows: 10,
        community_id: "",
        check_status: "",
        entry_at:"",
        income_end: "",
        income_start: "",
      }
      reload(param);
    })
  }

  function showModal(record) {
    dispatch({
      type: 'VerificationModel/concat',
      payload: {
        visible: true,
      }
    })
    dispatch({
      type: 'VerificationModel/incomeConfirmInfo',
      payload: {
        id: record.id,
      }
    })
  }

  function confirm(record) {
    dispatch({
      type: 'VerificationModel/billIncomeConfirm',
      payload: {
        check_status: record.check_status,
        income_id:record.id
      }
    })
  }

  /**
   * 切换表格页码
   * @param  {Number} page
   */
  function handlePaginationChange(page, size) {
    const param = { ...params, page };
    reload(param);
  }

  function hideModal() {
    dispatch({
      type: 'VerificationModel/concat',
      payload: {
        visible: false,
      }
    });
  }

  // 表格分页配置
  const pagination = {
    current: params.page,
    onChange: handlePaginationChange,
    total: parseInt(totals),
    showTotal: totals => `共${totals}条`,
    defaultCurrent: 1
  }

  // 表格列配置
  const columns = [{
    title: '交易流水号',
    dataIndex: 'trade_no',
    key: 'trade_no',
    render: noData,
  }, {
    title: '所属小区',
    dataIndex: 'community_name',
    key: 'community_name',
    render: noData,
  }, {
    title: '关联房屋',
    dataIndex: 'room_info',
    key: 'room_info',
    render: noData,
  }, {
    title: '收款日期',
    dataIndex: 'income_time',
    key: 'income_time',
    render: noData,
  }, {
    title: '交易类型',
    dataIndex: 'trade_type_str',
    key: 'trade_type_str'
  },{
    title: '核销金额(元)',
    dataIndex: 'pay_money',
    key: 'pay_money',
    render: noData,
  }, {
    title: '入账月份',
    dataIndex: 'entry_at',
    key: 'entry_at',
    render: noData,
  }, {
    title: '提交人',
    dataIndex: 'check_name',
    key: 'check_name',
    render: noData,
  }, {
    title: '核销状态',
    dataIndex: 'check_status_str',
    key: 'check_status_str',
    render: noData,
  }, {
    title: '核销日期',
    dataIndex: 'review_at',
    key: 'review_at',
    render: noData,
  }, {
    title: '核销人',
    dataIndex: 'review_name',
    key: 'review_name',
    render: noData,
  }, {
    title: '操作',
    dataIndex: 'desc',
    render: (text, record) => {
      return <div>
        {author('details')?<a className="mr1" onClick={showModal.bind(this, record)}>查看明细</a>:null}
        {author('changeStatus') ?<Popconfirm title={record.check_status == 3 ? '确定要核销该账单？' : (record.check_status == 4 ? '确定要撤销核销该账单？' : null)} onConfirm={confirm.bind(this, record)}>
          <a className="table-operating" style={{ marginLeft: '10px' }}>{record.check_status == 3 ? '核销' : (record.check_status == 4 ? '撤销核销' : null)}</a>
        </Popconfirm>:null}
      </div>
    }
  }];


  return (
    <div>
      <Breadcrumb separator=">">
        <Breadcrumb.Item>收费管理</Breadcrumb.Item>
        <Breadcrumb.Item>财务核销</Breadcrumb.Item>
      </Breadcrumb>
      <Card className="section">
        <Form>
          <Row>
            <Col span={6}>
              <FormItem label="核销状态" {...formItemLayout}>
                {getFieldDecorator('check_status')(
                  <Select placeholder="请选择核销状态" notFoundContent="没有数据">
                    <Option value="3">待核销</Option>
                    <Option value="4">已核销</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="入账月份" {...formItemLayout}>
                {getFieldDecorator('entry_at')(
                  <MonthPicker format="YYYY-MM" />
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="收款日期" {...formItemLayout}>
                {getFieldDecorator('income')(
                  <RangePicker format="YYYY-MM-DD" />
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="所属小区" {...formItemLayout}>
                {getFieldDecorator('community_id')(
                  <Select placeholder="请选择所属小区" notFoundContent="没有数据">
                    {communityList.map((value, index) => { return <Option key={index} value={value.id}>{value.name}</Option> })}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col style={{ float: 'right', paddingRight: '2%' }}>
              <Button type="primary" className="mr1" onClick={handleSubmit}>查询</Button>
              <Button type="ghost" onClick={handleReset}>重置</Button>
            </Col>
          </Row>
        </Form>
      </Card>
      <Card>
        <Table className="mt1" dataSource={list} columns={columns} loading={loading} rowKey={record => record.id} pagination={pagination} />
      </Card>
      <InvoiceModal
        visible={visible}
        handleCancel={() => hideModal()}
        prop={props}
        infoList={detail} />
    </div>
  );
}

function mapStateToProps(state) {
  return {
    ...state.VerificationModel,
    loading: state.loading.models.VerificationModel,
  };
}
export default connect(mapStateToProps)(Form.create()(Verification));

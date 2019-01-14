import React from 'react';
import { connect } from 'dva';
import {Table, Breadcrumb, Card, Button, Select, Input, Form, Row, Col, DatePicker, Spin, Pagination, message } from 'antd';
import './index.css';
import { getCommunityId, notRepeating } from "../../utils/util"
import { author } from "../../utils/util"
import Community from '../../components/Community/Community';

const { RangePicker } = DatePicker;
let columnsList = {
  trade_no: '交易流水号',
  acct_period: '账期',
  community_name: '小区名称',
  room_msg: '关联房屋',
  room_status: '房屋状态',
  cost_name: '缴费项目',
  total_amount: '缴费金额',
  trade_type_str: '交易类型',
  pay_channel_name: '支付方式',
  pay_time: '缴费时间',
  buyer_account: '支付账号'
};
let columns1List = {
  trade_no: '交易流水号',
  community_name: '小区名称',
  total_amount: '缴费金额',
  pay_channel_name: '支付方式',
  pay_time: '缴费时间',
  buyer_account: '支付账号',
  car_num:'车牌号',
};
let columns2List = {
  trade_no: '交易流水号',
  community_name: '小区名称',
  room_msg: '关联房屋',
  cost_name: '缴费项目',
  total_amount: '缴费金额',
  pay_channel_name: '支付方式',
  pay_time: '缴费时间',
  buyer_account: '支付账号',
  bill_note: '备注'
};
let columns3List = {
  trade_no: '交易流水号',
  acct_period: '账期',
  community_name: '小区名称',
  room_msg: '关联房屋',
  room_status: '房屋状态',
  cost_name: '缴费项目',
  total_amount: '缴费金额',
  trade_type_str:'交易类型',
  pay_channel_name: '支付方式',
  pay_time: '缴费时间',
  bill_note: '备注',
};
let columns4List = {
  community_name: '小区名称',
  repair_no: '工单编号',
  room_msg: '报修地址',
  created_username: '提交人',
  created_mobile: '联系电话',
  repair_type_str: '报修类型',
  repair_content: '报修内容',
  pay_money: '支付金额（元）',
  pay_time: '缴费时间',
  pay_type_str: '支付方式'
};
let columns = [];
let columns1 = [];
let columns2 = [];
let columns3 = [];
let columns4 = [];
function pushColumns(obj, target) {
  for (let k in obj) {
    target.push({
      title: obj[k],
      dataIndex: k,
      key: k
    })
  }
}
pushColumns(columnsList, columns);
pushColumns(columns1List, columns1);
pushColumns(columns2List, columns2);
pushColumns(columns3List, columns3);
pushColumns(columns4List, columns4);
const FormItem = Form.Item;
const Option = Select.Option;

function ChargeDetailManagement (props) {
  let { dispatch, chargeDetailManagement, form } = props;
  let { costType, flag, data, total, current, loading, communityList, typeOption, reportData, total_money, params } = chargeDetailManagement;
  let { getFieldDecorator } = form;
  
  // 搜索
  function handSearch () {
    dispatch({
      type: 'ChargingDetailManagementModel/concat',
      payload: {
        current: 1,
        loading: true,
        submitLoading: true
      }
    });
    form.validateFields((errors, values) => {
      let arr = [];
      costType.map((item) => {
        if (values.cost_types !== undefined) {
          values.cost_types.map((items) => {
            if(items === item.label){
              arr.push(item.key);
            }
          })
        }
      });
      params.community_id = flag === 3 ? values.community_id1 : values.community_id;
      params.group = values.group;
      params.building = values.building;
      params.unit = values.unit;
      params.room = values.room;
      params.page = 1;
      params.rows = 10;
      params.room_status = values.house_status;
      params.acct_period_start = (values.date && values.date.length !== 0) ? values.date[0].format('YYYY-MM-DD') : '';
      params.acct_period_end = (values.date && values.date.length !== 0) ? values.date[1].format('YYYY-MM-DD') : '';
      params.trade_no = values.trade_no;
      params.pay_channel = values.pay_channel;
      params.trade_type = values.trade_type;
      params.pay_type = values.pay_type;
      params.source = flag;
      params.costList = arr
    });
    dispatch({
      type: 'ChargingDetailManagementModel/getList',
      payload: params,
      callback: true
    })
  }

  //重置
  function handleReset (e) {
    dispatch({
      type: 'ChargingDetailManagementModel/concat',
      payload: { current: 1 }
    });
    params = {
      community_id: sessionStorage.getItem("communityId"),
      group: '',
      building: '',
      unit: '',
      room: '',
      room_status: '',
      date: '',
      trade_no: '',
      costList: '',
      pay_channel: '',
      rows: 10,
      page: 1,
      source: flag,
      trade_type:'',
      pay_type:'',
    };
    dispatch({
      type: 'ChargingDetailManagementModel/concat',
      payload: {
        buildingData: [],
        unitData: [],
        roomData: []
      }
    });
    form.resetFields();
    dispatch({
      type: 'ChargingDetailManagementModel/getList',
      payload: params
    })
  }

  function handleExport () {
    if (data.length === 0) {
      message.error('没有账单数据');
    } else {
      notRepeating(() => {
        dispatch({
          type: 'ChargingDetailManagementModel/chargeExportBill',
          payload: params
        })
      })
    }
  }

  // 分页
  function pageChange (index) {
    dispatch({
      type: 'ChargingDetailManagementModel/concat',
      payload: { current: index }
    });
    params.page = index;
    dispatch({
      type: 'ChargingDetailManagementModel/getList',
      payload: params
    })
  }

  // 分页更改大小
  function showSizeChange (index, num) {
    dispatch({
      type: 'ChargingDetailManagementModel/concat',
      payload: { current: index }
    });
    params.rows = num;
    dispatch({
      type: 'ChargingDetailManagementModel/getList',
      payload: params
    })
  }

  function changeList (type) {
    dispatch({
      type: 'ChargingDetailManagementModel/concat',
      payload: { flag: type, current: 1 }
    });
    params = {
      community_id: sessionStorage.getItem("communityId"),
      group: '',
      building: '',
      unit: '',
      room: '',
      room_status: '',
      date: '',
      trade_no: '',
      costList: '',
      pay_channel: '',
      pay_type:'',
      rows: 10,
      page: 1,
      source: type,
    };
    dispatch({
      type: 'ChargingDetailManagementModel/getList',
      payload: params
    });
    form.resetFields();
  }

  const PaginationProps = {
    total: total,
    current: current,
    defaultPageSize: 10,
    onChange: pageChange,
    onShowSizeChange: showSizeChange,
    showTotal(total, range){
      return `共 ${parseInt(total)} 条`
    },
  };
  let formItemLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 16}
  };
  let formItemLayout2 = {
    labelCol: { span: 3 },
    wrapperCol: { span: 21 }
  };
  return (
    <div className="page-content page-content-detail">
      <Breadcrumb separator=">">
        <Breadcrumb.Item>统计报表</Breadcrumb.Item>
        <Breadcrumb.Item>收费明细管理</Breadcrumb.Item>
      </Breadcrumb>
      <Row className="mb1">
        <Col span={24}>
          <Card>
            <div className="charge_nums">
              <dl className="dl_cls">
                <dt className="dt_cls">本公司共收费</dt><dd>{reportData ? reportData.total_amount : 0}元</dd>
              </dl>
              <dl className="dl_cls">
                <dt className="dt_cls">本年</dt><dd>{reportData ? reportData.year_amount : 0}元</dd>
              </dl>
              <dl className="dl_cls">
                <dt className="dt_cls">本月</dt><dd>{reportData ? reportData.month_amount : 0}元</dd>
              </dl>
              <dl className="last dl_cls">
                <dt className="dt_cls">本周</dt><dd>{reportData ? reportData.week_amount : 0}元</dd>
              </dl>
            </div>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <div className="btn-group-left">
            {author('paymentOnline') ? <Button className="mr1" onClick={() => changeList(1)} type={flag === 1 ? "primary" : ""}>线上缴费</Button> : null}
            {author('scavengingPay') ? <Button className="mr1" onClick={() => changeList(2)} type={flag === 2 ? "primary" : ""}>扫码支付</Button> : null}
            {author('gatheringUnderLine') ? <Button className="mr1" onClick={() => changeList(4)} type={flag === 4 ? "primary" : ""}>线下收款</Button> : null}
            {author('temporaryStop') ? <Button className="mr1" onClick={() => changeList(3)} type={flag === 3 ? "primary" : ""}>临时停车</Button> : null}
            {author('repair') ? <Button className="mr1" onClick={() => changeList(5)} type={flag === 5 ? "primary" : ""}>报事报修</Button> : null}
          </div>
        </Col>
      </Row>
      <Card className="section child-section mt1" style={{padding: 0}}>
        <Form>
          {flag !== 3
            ? <Row justify="start">
              <Community form={form}
                allDatas={{
                  community: {label: '小区名称'},
                  group: {label: '关联房屋'},
                  building: {},
                  unit: {},
                  room: {}}}
              />
              
            </Row>
            : null}
          <Row>
            {flag !== 3 && flag !== 5 ?
              <Col span={6}>
                <FormItem label="收费项目" {...formItemLayout}>
                  {getFieldDecorator('cost_types')(
                    <Select mode="multiple" placeholder="请选择收费项目">
                      {costType.map((value, index) => {
                        return <Option key={value.key} value={value.label}>{value.label}</Option>
                      })}
                    </Select>
                  )}
                </FormItem>
              </Col>
              : null}
            {flag === 3
              ? <Col span={6}>
                <FormItem label="小区名称：" {...formItemLayout}>
                  {getFieldDecorator('community_id1', { initialValue: getCommunityId() })(
                    <Select placeholder="选择小区"
                      notFoundContent="没有数据">
                      {communityList.map((item, index) => {
                        return <Option value={item.id} key={index}>{item.name}</Option>
                      })}
                    </Select>
                  )}
                </FormItem>
              </Col>
              : null}

            {flag === 4 || flag === 1
              ?<span><Col span={6}>
                <FormItem label="房屋状态：" {...formItemLayout}>
                  {getFieldDecorator('house_status')(
                    <Select placeholder="房屋状态" notFoundContent="没有数据" >
                      <Option value="0">全部房屋</Option>
                      <Option value="1">已售房屋</Option>
                      <Option value="2">未售房屋</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label="交易类型：" {...formItemLayout}>
                  {getFieldDecorator('trade_type')(
                    <Select placeholder="交易类型" notFoundContent="没有数据" >
                      <Option value="0">全部</Option>
                      <Option value="1">收款</Option>
                      <Option value="2">退款</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              </span>
              : null}
            {flag !== 5
              ?<Col span={6}>
                <FormItem label="交易流水号" {...formItemLayout}>
                  {getFieldDecorator('trade_no')(
                    <Input type="text" placeholder="请输入流水号"/>
                  )}
                </FormItem>
              </Col>
              :null}
            {flag !== 2 && flag !== 5 ? <Col span={6}>
              <FormItem label="支付方式：" {...formItemLayout}>
                {getFieldDecorator('pay_channel')(
                  <Select placeholder="请选择支付方式" notFoundContent="没有数据">
                    {typeOption.map((value, index) => {
                      return <Option key={index} value={value.key.toString()}>{value.value}</Option>
                    })}
                  </Select>
                )}
              </FormItem>
            </Col>
              : null}
            {flag == 5 ? <Col span={6}>
              <FormItem label="支付方式：" {...formItemLayout}>
                {getFieldDecorator('pay_type')(
                  <Select placeholder="请选择支付方式" notFoundContent="没有数据">
                    <Option value="0">全部</Option>
                    <Option value="2">线下支付</Option>
                    <Option value="1">线上支付</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
              : null}
            <Col span={12}>
              <FormItem label="缴费时间：" {...formItemLayout2}>
                {getFieldDecorator('date')(
                  <RangePicker style={{width:'96%'}}/>
                )}
              </FormItem>
            </Col>
            <Col span={4} offset={flag==2?20:2}>
              <Button type="primary" onClick={handSearch} >查询</Button>
              <Button type="ghost" onClick={handleReset} style={{ marginLeft: 15 }}>重置</Button>
            </Col>
          </Row>
        </Form>
      </Card>
      <Card className="section">
        <span>共{total}条账单, 收费金额: {total_money}元</span>
        {author('exportBill') ? <Button onClick={handleExport} style={{marginLeft: 15}}>导出账单</Button> : null}
        <Spin tip="Loading..." size="large" spinning={loading}>
          <Table dataSource={data}
            pagination={false}
            columns={flag === 1 ? columns : (flag === 2 ? columns2 : (flag === 4 ? columns3 : (flag === 5 ? columns4 :columns1) ) )}
            className="mt1"
            rowKey={record => record.id}
          />
          <Pagination {...PaginationProps} className="fr mtb1" style={{marginTop: 15}}/>
        </Spin>
      </Card>
    </div>
  )
}

export default connect(state => {
  return {
    chargeDetailManagement: state.ChargingDetailManagementModel,
    layout: state.MainLayout,
  }
})(Form.create({})(ChargeDetailManagement));

import React from 'react';
import { connect } from 'dva';
import { Form,Breadcrumb,Card,Table,Row,Col,Select,Button,DatePicker  } from 'antd';
import { download,author } from '../../../utils/util';
const FormItem = Form.Item;
const Option = Select.Option;
const { MonthPicker } = DatePicker;
function ChargeMonthlyStatement (props){
  const { form,communityList,payList,dispatch,params,list,is_reset,loading,type,totals } = props;
  const { getFieldDecorator } = form;
  const formItem = {labelCol: {span: 6},wrapperCol: {span: 16}};
  if (is_reset == true) {
    form.resetFields();
    dispatch({
      type: 'ChargeMonthlyStatementModel/concat',
      payload: {
        is_reset: false,
      }
    });
  }
  /*
    调table列表接口方法
  */
  function reload(param) {
    dispatch({
      type: 'ChargeMonthlyStatementModel/getChannelList',
      payload: param,
    });
  }
  /** 
   * 搜索
  */
  function handSearch(){
    form.validateFields((err,values) => {
      if (err) {
        return
      }
      let arr = [];
      let str;
      payList.map(item=>{
        if(values.cost_id != undefined){
          values.cost_id.map(items=>{
            if(items == item.label){
              arr.push(item.key);
            }
          })
        }
      })
      communityList.map((item)=>{
        if (values.community_id == item.name) {
          str=item.id;
        }
      })
      params.community_id = str;
      params.cost_id = arr;
      params.start_time = values.month?values.month.format("YYYY-MM"):'';
      reload(params)
    })
  }
  /** 
   * 清空
  */
  function handleReset(){
    form.resetFields();
    params.community_id = '';
    params.cost_id = '';
    params.start_time = '';
    dispatch({
      type: 'ChargeMonthlyStatementModel/concat',
      payload:{
        params,
        list:[],
        type:false,
      },
    });
  }
  function handleExport(){
    form.validateFields((err, values) => {
      dispatch({
        type: 'ChargeMonthlyStatementModel/exportChannel',
        payload: {...params},
        callback(data){
          download(data);
        }
      });
    });
  }
  const columns = [{
    title: '小区名称',
    dataIndex: 'community_name',
    key: 'community_name',
    width: 120,
    fixed: 'left',
  },{
    title: '收费项目',
    dataIndex: 'cost_name',
    key: 'cost_name',
    width: 120,
    fixed: 'left',
  }, {
    title: '本月累计收费（元）',
    children: [{
      title: '收当年费用',
      dataIndex: 'charge_amount',
      key: 'charge_amount',
      width: 120,
    },{
      title: '收上年欠费',
      dataIndex: 'charge_last',
      key: 'charge_last',
      width: 120,
    },{
      title: '收历年欠费',
      dataIndex: 'charge_history',
      key: 'charge_history',
      width: 120,
    },{
      title: '预收下年',
      dataIndex: 'charge_advance',
      key: 'charge_advance',
      width: 120,
    },{
      title: '优惠金额合计',
      dataIndex: 'charge_discount',
      key: 'charge_discount',
      width: 120,
    },{
      title: '本月收费合计',
      dataIndex: 'total_charge',
      key: 'total_charge',
      width: 120,
    }],
  }, {
    title: '本年累计收费（元）',
    children: [{
      title: '收当年费用',
      dataIndex: 'year_charge_amount',
      key: 'year_charge_amount',
      width: 120,
    }, {
      title: '收上年欠费',
      dataIndex: 'year_charge_last',
      key: 'year_charge_last',
      width: 120,
    },{
      title: '收历年欠费',
      dataIndex: 'year_charge_history',
      key: 'year_charge_history',
      width: 120,
    },{
      title: '预收下年',
      dataIndex: 'year_charge_advanced',
      key: 'year_charge_advanced',
      width: 120,
    },{
      title: '优惠金额合计',
      dataIndex: 'year_charge_discount',
      key: 'year_charge_discount',
      width: 120,
    },{
      title: '本年收费合计',
      dataIndex: 'year_total_charge',
      key: 'year_total_charge',
      width: 120,
    }],
  }];
  return (
    <div>
      <Breadcrumb separator="/">
        <Breadcrumb.Item>统计报表</Breadcrumb.Item>
        <Breadcrumb.Item>收费月报表</Breadcrumb.Item>
      </Breadcrumb>
      <Card className="section">
        <Form>
          <Row>
            <Col span={6}>
              <FormItem label="所属小区" {...formItem}>
                {getFieldDecorator('community_id',{rules: [{ required: true, message: "请选择所属小区" }]} )(
                  <Select placeholder="请选择所属小区" notFoundContent="没有数据" showSearch={true}>
                    {communityList.map((value, index) => { return <Option key={index} value={value.name.toString()}>{value.name}</Option> })}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="缴费项目" {...formItem}>
                {getFieldDecorator('cost_id', )(
                  <Select mode="multiple" placeholder="请选择缴费项目" notFoundContent="没有数据">
                    {payList.map((value, index) => { return <Option key={index} value={value.label}>{value.label}</Option> })}
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <FormItem label="收费月份" {...formItem}>
                {getFieldDecorator('month',{rules: [{ required: true, message: "请选择收费月份" }]} )(
                  <MonthPicker format="YYYY-MM" />
                )}
              </FormItem>
            </Col>
            <Col span={5} offset={1} className="fr">
              <Button type="primary" onClick={handSearch.bind(this)}>查询</Button>
              <Button className="ml1" type="ghost" onClick={handleReset.bind(this)}>重置</Button>
            </Col>
          </Row>
        </Form>
      </Card>
      <Card>
        {author('export')&&type==true?<Button type="primary" style={{marginLeft:'10px'}} onClick={handleExport.bind(this)}>导出记录</Button>:null}
        <div className="slide">
          <Table
            className="mt1"
            columns={columns}
            dataSource={list}
            loading={loading}
            bordered
            size="middle"
            pagination={false}
            scroll={{ x:1680, y: 440 }}
            rowKey={(record, index) => index}
          />
          {totals?<span className="total">共有 {totals} 条数据</span>:null}
        </div>
      </Card>
    </div>
  )
}

function mapStateToProps(state){
  return {
    ...state.ChargeMonthlyStatementModel,
    loading:state.loading.models.ChargeMonthlyStatementModel
  }
}
export default connect(mapStateToProps)(Form.create()(ChargeMonthlyStatement))
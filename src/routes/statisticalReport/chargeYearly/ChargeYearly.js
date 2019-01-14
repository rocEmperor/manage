import React from 'react';
import { connect } from 'dva';
import { Form,Breadcrumb,Card,Row,Col,Select,Button,Table } from 'antd';
import { download,author } from '../../../utils/util';
const FormItem = Form.Item;
const Option = Select.Option;
function ChargeYearly (props){
  const { form,communityList,payList,dispatch,is_reset,list,loading,params,type,totals } = props;
  const { getFieldDecorator } = form;
  const formItem = {labelCol: {span: 6},wrapperCol: {span: 16}};
  if (is_reset == true) {
    form.resetFields();
    dispatch({
      type: 'ChargeYearlyModel/concat',
      payload: {
        is_reset: false,
      }
    });
  }
  /*
    调table列表接口方法
  */
  function reload(params) {
    dispatch({
      type: 'ChargeYearlyModel/getMonthReportList',
      payload: params,
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
      communityList.map((item)=>{
        if (values.community_id == item.name) {
          str=item.id;
        }
      })
      payList.map(item=>{
        if(values.cost_id != undefined){
          values.cost_id.map(items=>{
            if(items == item.label){
              arr.push(item.key);
            }
          })
        }
      })
      params.community_id = str;
      params.cost_id = arr;
      params.start_time = values.start_time;
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
    reload(params);
    // form.validateFields((err, values) => {
    //   params.community_id = '';
    //   params.cost_id = '';
    //   params.start_time = '';
    //   reload(params);
    // })
  }
  /** 
   * 导出
  */
  function handleExport(){
    form.validateFields((err, values) => {
      dispatch({
        type: 'ChargeYearlyModel/exportMonth',
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
    width:120,
    fixed: 'left',
  },{
    title: '收费项目',
    dataIndex: 'cost_name',
    key: 'cost_name',
    width: 120,
    fixed: 'left',
  },{
    title: '当年应收费（元）',
    children: [{
      title: '当年应收',
      dataIndex: 'bill_amount',
      key: 'bill_amount',
      width: 100,
    },{
      title: '上年欠费',
      dataIndex: 'bill_last',
      key: 'bill_last',
      width: 100,
    },{
      title: '历年欠费',
      dataIndex: 'bill_history',
      key: 'bill_history',
      width: 100,
    },{
      title: '上年预收今年',
      dataIndex: 'bill_advanced',
      key: 'bill_advanced',
      width: 100,
    },{
      title: '合计',
      dataIndex: 'total_bill',
      key: 'total_bill',
      width: 100,
    }],
  }, {
    title: '当年收费情况（元）',
    children: [{
      title: '收当年',
      children:[{
        title: '收当年费用合计',
        dataIndex: 'charge_amount',
        key: 'charge_amount',
        width: 120,
      },{
        title: '优惠金额合计',
        dataIndex: 'charge_discount',
        key: 'charge_discount',
        width: 120,
      }]
    }, {
      title: '收上年欠费',
      children:[{
        title: '收上年欠费合计',
        dataIndex: 'charge_last',
        key: 'charge_last',
        width: 120,
      },{
        title: '优惠金额合计',
        dataIndex: 'charge_last_discount',
        key: 'charge_last_discount',
        width: 120,
      }]
    },{
      title: '收历年欠费',
      children:[{
        title: '收历年欠费合计',
        dataIndex: 'charge_history',
        key: 'charge_history',
        width: 120,
      },{
        title: '优惠金额合计',
        dataIndex: 'charge_history_discount',
        key: 'charge_history_discount',
        width: 120,
      }]
    },{
      title: '预收下年',
      children:[{
        title: '预收下年合计',
        dataIndex: 'charge_advanced',
        key: 'charge_advanced',
        width: 120,
      },{
        title: '优惠金额合计',
        dataIndex: 'charge_advanced_discount',
        key: 'charge_advanced_discount',
        width: 120,
      }]
    },{
      title: '当年收费合计',
      // width: 120,
      // dataIndex: 'total_charge',
      // key: 'total_charge',
      children:[{
        title: '已收合计',
        dataIndex: 'total_charge',
        key: 'total_charge',
        width: 80,
      },{
        title: '优惠合计',
        dataIndex: 'total_charge_discount',
        key: 'total_charge_discount',
        width: 80,
      }]
    }],
  }, {
    title: '当年未收（元）',
    children:[{
      title: '当年应收',
      children:[{
        title: '应收',
        dataIndex: 'bill_amounts',
        key: 'bill_amounts',
        width: 120,
      },{
        title: '实际未收',
        dataIndex: 'nocharge_amount',
        key: 'nocharge_amount',
        width: 120,
      }]
    },{
      title: '收上年欠费',
      children:[{
        title: '应收',
        dataIndex: 'bill_lasts',
        key: 'bill_lasts',
        width: 120,
      },{
        title: '实际未收',
        dataIndex: 'nocharge_last',
        key: 'nocharge_last',
        width: 120,
      }]
    },{
      title: '收历年欠费',
      children:[{
        title: '应收',
        dataIndex: 'bill_historys',
        key: 'bill_historys',
        width: 120,
      },{
        title: '实际未收',
        dataIndex: 'nocharge_history',
        key: 'nocharge_history',
        width: 120,
      }]
    },{
      title: '未收合计',
      width: 120,
      dataIndex: 'total_nocharge',
      key: 'total_nocharge',
    }]
  },{
    title: '已收/应收',
    dataIndex: 'rate',
    key: 'rate',
    width: 150,
    fixed: 'right',
  }];
  return (
    <div>
      <Breadcrumb separator="/">
        <Breadcrumb.Item>统计报表</Breadcrumb.Item>
        <Breadcrumb.Item>年收费总况</Breadcrumb.Item>
      </Breadcrumb>
      <Card className="section">
        <Form>
          <Row>
            <Col span={6}>
              <FormItem label="所属小区" {...formItem}>
                {getFieldDecorator('community_id',{rules: [{ required: true, message: "请选择小区" }]} )(
                  <Select placeholder="请选择小区" notFoundContent="没有数据" showSearch={true}>
                    {communityList.map((value, index) => { return <Option key={index} value={value.name.toString()}>{value.name}</Option> })}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="统计年份" {...formItem}>
                {getFieldDecorator('start_time',{rules: [{ required: true, message: "请选择年份" }]} )(
                  <Select placeholder="全部">
                    <Option key="0" value="2015">2015</Option>
                    <Option key="1" value="2016">2016</Option>
                    <Option key="2" value="2017">2017</Option>
                    <Option key="3" value="2018">2018</Option>
                    <Option key="4" value="2019">2019</Option>
                    <Option key="5" value="2020">2020</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <FormItem label="缴费项目" {...formItem}>
                {getFieldDecorator('cost_id', )(
                  <Select mode="multiple" placeholder="请选择缴费项目" notFoundContent="没有数据">
                    {payList.map((value, index) => { return <Option key={value.key} value={value.label}>{value.label}</Option> })}
                  </Select>
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
          <Table rowKey={(record, index) => index} pagination={false} loading={loading} dataSource={list} className="mt1" columns={columns} bordered size="middle" scroll={{ x: 2850, y: 440 }}/>
          {totals?<span className="total">共有 {totals} 条数据</span>:null}
        </div>
      </Card>
    </div>
  )
}

function mapStateToProps(state){
  return {
    ...state.ChargeYearlyModel,
    loading:state.loading.models.ChargeYearlyModel
  }
}
export default connect(mapStateToProps)(Form.create()(ChargeYearly))
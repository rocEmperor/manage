import React from 'react';
import { connect } from 'dva';
import { Form,Breadcrumb,Card,Row,Col,Select,Button,Table } from 'antd';
import Community from './components/Community';
//import Community from '../../../components/Community/Community.js';
import { download,author } from '../../../utils/util';
const FormItem = Form.Item;
const Option = Select.Option;
function ChargesCollectableDetailed (props){
  const { form,payList,dispatch,is_reset,list,loading,params,type,totals,communityList,groupData,buildingData,unitData,roomData,communityId } = props;
  const { getFieldDecorator } = form;
  if (is_reset == true) {
    form.resetFields();
    dispatch({
      type: 'ChargesCollectableDetailedModel/concat',
      payload: {
        is_reset: false,
      }
    });
  }
  const formItem = {labelCol: {span: 6},wrapperCol: {span: 16}};
  const columns = [{
    title: '所属小区',
    dataIndex: 'community_name',
    key: 'community_name',
    width:120,
    fixed: 'left',
  },{
    title: '苑/期/区',
    dataIndex: 'group',
    key: 'group',
    width:120,
    fixed: 'left',
  },{
    title: '房屋信息',
    dataIndex: 'housing',
    key: 'housing',
    width: 140,
    fixed: 'left',
  },{
    title: '房屋面积（㎡）',
    dataIndex: 'charge_area',
    key: 'charge_area',
    width: 120,
    fixed: 'left',
  }, {
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
      //width: 240,
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
      //width: 240,
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
      //width: 240,
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
      //width: 240,
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
      title: '合计',
      // width: 80,
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
    //width: 240,
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
      //width: 240,
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
      //width: 240,
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
      title: '合计',
      width: 120,
      dataIndex: 'total_nocharge',
      key: 'total_nocharge',
    }]
  }];

  // function footer(){
  //   return (
  //     <tfoot>
  //       <tr className="asd">
  //         <td>合计</td>
  //       </tr>
  //       <tr className="asd">
  //         <td>合计</td>
  //       </tr>
  //       <tr className="asd">
  //         <td>合计</td>
  //       </tr>
  //     </tfoot>
  //   )
  // }

  /*
    调table列表接口方法
  */
  function reload(params) {
    dispatch({
      type: 'ChargesCollectableDetailedModel/getList',
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
      let str1;
      payList.map((item) => {
        if (values.cost_id == item.label) {
          str1=item.key;
        }
      });
      params.community_id = communityId;
      params.building = values.building;
      params.group = values.group;
      params.cost_id = str1;
      params.room = values.room;
      params.start_time = values.start_time;
      params.unit = values.unit;
      reload(params)
    })
  }
  /** 
   * 清空
  */
  function handleReset(){
    form.resetFields();
    params.community_id = '';
    params.building = '';
    params.group = '';
    params.cost_id = '';  
    params.room = '';
    params.start_time = '';
    params.unit = '';
    reload(params);
    // form.validateFields((err, values) => {
    //   params.community_id = '';
    //   params.building = '';
    //   params.group = '';
    //   params.cost_id = '';  
    //   params.room = '';
    //   params.start_time = '';
    //   params.unit = '';
    //   reload(params);
    // })
  }
  /** 
   * 导出
  */
  function handleExport(){
    dispatch({
      type: 'ChargesCollectableDetailedModel/exportMonth',
      payload: {...params},
      callback(data){
        download(data);
      }
    });
  }
  function change(e){
    form.resetFields(['group', 'building', 'unit', 'room']);
    let community_Id;
    communityList.map((item)=>{
      if (e == item.name) {
        community_Id=item.id;
      }
    })
    dispatch({
      type: 'ChargesCollectableDetailedModel/concat',
      payload: {communityId:community_Id},
    });
    dispatch({
      type: 'ChargesCollectableDetailedModel/getGroupList',
      payload: {community_id:community_Id},
    });
    // return new Promise((resolve, reject)=>{
    //   dispatch({
    //     type: 'ChargesCollectableDetailedModel/concat',
    //     payload:{communityId:e}
    //   }).then((result) => {
    //     dispatch({
    //       type:"ChargesCollectableDetailedModel/getGroupList",
    //       payload: {community_id:communityId}
    //     })
    //   }).catch((err)=>{

    //   });
    // });
    
  }
  let data={
    dispatch,
    groupData,
    buildingData,
    unitData,
    roomData,
    communityId
  }
  return (
    <div>
      <Breadcrumb separator="/">
        <Breadcrumb.Item>统计报表</Breadcrumb.Item>
        <Breadcrumb.Item>收费项目明细表</Breadcrumb.Item>
      </Breadcrumb>
      <Card className="section">
        <Form>
          <Row>
            <Col span={6}>
              <FormItem label="所属小区" {...formItem}>
                {getFieldDecorator('community_id',{rules: [{ required: true, message: "请选择小区" }]} )(
                  <Select onChange={change.bind(this)} placeholder="请选择小区" notFoundContent="没有数据" showSearch={true}>
                    {communityList.map((value, index) => { return <Option key={value.id} value={value.name.toString()}>{value.name}</Option> })}
                  </Select>
                )}
              </FormItem>
              {/* <Community form={form} allDatas={{community:{label:"所属小区",required:true}, group: {label:"关联房屋",}, building: {}, unit: {}, room: {} }} /> */}
            </Col>
            <Col span={6}>
              <FormItem label="缴费项目" {...formItem}>
                {getFieldDecorator('cost_id',{rules: [{ required: true, message: "请选择缴费项目" }]})(
                  <Select placeholder="请选择缴费项目" notFoundContent="没有数据" showSearch={true}>
                    {payList.map((value, index) => { return <Option key={value.key} value={value.label}>{value.label}</Option> })}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="统计年份" {...formItem}>
                {getFieldDecorator('start_time',{rules: [{ required: true, message: "请选择缴费年份" }]})(
                  <Select placeholder="请选择统计年份">
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
            <Community form={form} {...data}/>
            {/* <Community form={form} allDatas={{community:{}, group: {}, building: {}, unit: {}, room: {} }} /> */}
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
          <Table className="mt1" rowKey={(record, index) => index} loading={loading} dataSource={list} columns={columns} pagination={false} bordered size="middle" scroll={{ x:2960, y: 440 }}/>
          {totals?<span className="total">共有 {totals} 条数据</span>:null}
        </div>
      </Card>
    </div>
  )
}

function mapStateToProps(state){
  return {
    ...state.ChargesCollectableDetailedModel,
    loading: state.loading.effects['ChargesCollectableDetailedModel/getList']||state.loading.effects['ChargesCollectableDetailedModel/getPayList']
  }
}
export default connect(mapStateToProps)(Form.create()(ChargesCollectableDetailed))
import React from 'react';
import { connect } from 'dva';
import { Form,Breadcrumb,Card,Table,Row,Col,Select,Button,DatePicker } from 'antd';
import { download,author } from '../../../utils/util';
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
function CollectionChannelsStatistics (props){
  const { form,loading,communityList,payList,type,dispatch,is_reset,list,params,totals } = props;
  const { getFieldDecorator } = form;
  const formItem = {labelCol: {span: 6},wrapperCol: {span: 16}};
  if (is_reset == true) {
    form.resetFields();
    dispatch({
      type: 'CollectionChannelsStatisticsModel/concat',
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
      type: 'CollectionChannelsStatisticsModel/getChannelList',
      payload: params,
    });
  }
  /** 
   * 搜索
  */
  function handSearch(){
    form.validateFields((err,values) => {
      if(!values.community_id){
        return;
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
      params.start_time = (values.date && values.date.length !== 0) ? values.date[0].format('YYYY-MM-DD') : '';
      params.end_time = (values.date && values.date.length !== 0) ? values.date[1].format('YYYY-MM-DD') : '';
      reload(params)
    })
  }
  /** 
   * 清空
  */
  function handleReset(){
    form.resetFields();
    params.community_id = '';
    params.start_time = '';
    params.end_time = '';
    params.cost_id = '';
    dispatch({
      type: 'CollectionChannelsStatisticsModel/concat',
      payload: {
        params,
        list: [],
        type:false,
      }
    });
  }
  /** 
   * 导出
  */
  function handleExport(){
    form.validateFields((err, values) => {
      dispatch({
        type: 'CollectionChannelsStatisticsModel/exportChannel',
        payload: {...params},
        callback(data){
          download(data);
        }
      });
    });
  }
  // 表格列配置
  const columns = [{
    title: '所属小区',
    dataIndex: 'community_name',
    key: 'community_name',
    //render: noData,
  }, {
    title: '缴费项目',
    dataIndex: 'cost_name',
    key: 'cost_name',
    //render: noData,
  }, {
    title: '线上收款',
    dataIndex: 'line_charge',
    key: 'line_charge',
    //render: noData,
  }, {
    title: '现金',
    dataIndex: 'money',
    key: 'money',
    //render: noData,
  }, {
    title: '支付宝',
    dataIndex: 'alipay',
    //key: 'alipay'
  },{
    title: '微信',
    dataIndex: 'wechat',
    key: 'wechat',
    //render: noData,
  }, {
    title: '刷卡',
    dataIndex: 'card',
    key: 'card',
    //render: noData,
  }, {
    title: '对公',
    dataIndex: 'public',
    key: 'public',
    //render: noData,
  }, {
    title: '支票',
    dataIndex: 'cheque',
    key: 'cheque',
    //render: noData,
  },{
    title: '合计',
    dataIndex: 'count',
    key: 'count',
    //render: noData,
  }];
  return (
    <div>
      <Breadcrumb separator="/">
        <Breadcrumb.Item>统计报表</Breadcrumb.Item>
        <Breadcrumb.Item>收款渠道统计</Breadcrumb.Item>
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
              <FormItem label="缴费项目" {...formItem}>
                {getFieldDecorator('cost_id', )(
                  <Select mode="multiple" placeholder="请选择缴费项目" notFoundContent="没有数据">
                    {payList.map((value, index) => { return <Option key={value.key} value={value.label}>{value.label}</Option> })}
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <FormItem label="统计时间" {...formItem}>
                {getFieldDecorator('date', )(
                  <RangePicker />
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
        <Table className="mt1" dataSource={list} columns={columns} loading={loading} rowKey={(record, index) => index} pagination={false} />
        {totals?<span className="total">共有 {totals} 条数据</span>:null}
      </Card>
    </div>
  )
}

function mapStateToProps(state){
  return {
    ...state.CollectionChannelsStatisticsModel,
    loading:state.loading.models.CollectionChannelsStatisticsModel
  }
}
export default connect(mapStateToProps)(Form.create()(CollectionChannelsStatistics))
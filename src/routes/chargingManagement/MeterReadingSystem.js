import React from 'react'
import {message,Breadcrumb,Card,Button,Input,Table,Form,Row,Col,Popconfirm} from 'antd';
import { connect } from 'dva';
import Community from '../../components/Community/Community.js';
import FailedModals from './components/readingManage/FailedModals.js'
const FormItem = Form.Item;
import { getCommunityId, download,noData } from '../../utils/util';
// 布局
const formItemLayout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 16
  },
}
function MeterReadingSystem(props){
  let {dispatch,form,params,loading,list,ID,type,totals,is_reset,visible,default_count,success_count,error_list,error_count} = props;
  const { getFieldDecorator } = form;
  function reading(param={}){
    dispatch({
      type: 'MeterReadingSystemModel/concat',
      payload: param,
    });
  } 
  if (is_reset == true) {
    form.resetFields();
    reading({is_reset: false})
  }
  /*
    调table列表接口方法
  */
  function reload(param) {
    dispatch({
      type: 'MeterReadingSystemModel/getMeterReadingList',
      payload: param,
    });
  }
  /**
   * 查询
   * @param {*} e 
   */
  function handleSubmit(e){
    form.validateFields(['meter_no','group','building','unit','room'],(err,val)=>{
      const params = val;
      params.bill_type = type;
      params.cycle_id = ID;
      params.page = 1;
      params.rows = 10;
      reload(params)
    })
  }
  /**
   * 重置
   */
  function handleReset(){
    form.resetFields();
    const param = {
      page:1,
      rows:10,
      cycle_id:ID,
      meter_no:'',
      bill_type:type,
      group:'',
      building:'',
      unit:'',
      room:''
    };
    reload(param);
  }
  /*
    导出
  */
  function handleExport(){
    //console.log('222')
    form.validateFields(['meter_no','group','building','unit','room'],(err,val)=>{
      dispatch({
        type: 'MeterReadingSystemModel/reportExport',
        payload: {...params},
        callback(data){
          download(data);
        }
      });
    })
  }
  // function meterChange(record, e,k){
  //   let val = e.target.value;
  //   if(k=='latest_ton'){
  //     reading({latest_ton:val})
  //   }else if(k=='current_ton'){
  //     reading({current_ton:val})
  //   }
  // }
  function meterBlur(record, e,k) {
    props.form.validateFields([`latest_ton_${record.id}`,`current_ton_${record.id}`],(err,val)=>{
      let current =`current_ton_${record.id}`;
      let latest =`latest_ton_${record.id}`;
      let param =  {
        community_id:getCommunityId(),
        current_ton:val[current],
        id:record.id,
        latest_ton:val[latest],
      }
      if(Number(val[current])<Number(val[latest])){
        message.error('本期读数不能小于上期读数!')
      }else{
        dispatch({
          type:"MeterReadingSystemModel/editMeterNum",
          payload:param,
          callback(){
            dispatch({
              type:"MeterReadingSystemModel/getMeterReadingList",
              payload:{...params}
            })
          }
        })
      }
    })
  }
  function handleOk(e){
    let param = {
      cycle_id:ID,
      community_id: getCommunityId(),
    }
    dispatch({
      type:"MeterReadingSystemModel/generateBill",
      payload:param
    })
  }
  /**
   * 切换页码
   * @param  {Number} page
   */
  function handlePaginationChange(page, size) {
    const param = { ...params, page };
    reload(param);
  }
  // 表格列配置
  const columns = [{
    title: '苑/期/区',
    dataIndex: 'group',
    key: 'group',
    render: noData,
    //sorter: true,
  }, {
    title: '幢',
    dataIndex: 'building',
    key: 'building',
    render: noData,
  }, {
    title: '单元',
    dataIndex: 'unit',
    key: 'unit',
    render: noData,
  }, {
    title: '室',
    dataIndex: 'room',
    key: 'room',
    render: noData,
  }, {
    title: '表具类型',
    dataIndex: 'bill_type',
    key: 'bill_type',
    render: noData,
  }, {
    title: '表具编号',
    dataIndex: 'meter_no',
    key: 'meter_no',
    render: noData,
  }, {
    title: '单价',
    dataIndex: 'formula',
    key: 'formula',
    render: noData,
  }, {
    title: '上次抄表时间',
    dataIndex: 'period_start',
    key: 'period_start',
    render: noData,
  }, {
    title: '本次抄表时间',
    dataIndex: 'period_end',
    key: 'period_end',
    render: noData,
  }, {
    title: '上次抄表读数',
    dataIndex: 'latest_ton',
    key: 'latest_ton',
    render: (text, record) => {
      return (
        <form>
          <FormItem {...formItemLayout}>
            {getFieldDecorator(`latest_ton_${record.id}`, {
              rules: [{
                required: true,
                pattern: /(^[0-9]([0-9]){1,9}\.\d{1,2}$)|(^[0-9]{1,5}\.\d{1,2}$)|(^0\.\d[0-9]$)|(^0\.[0-9]\d?$)|(^[0-9]{1,5}$)|(^[0-9]([0-9]){1,9}$)/,
                message: '请输入读数10位以内(正整数或小数点后两位)'
              }],
              initialValue: record.latest_ton
            })(
              <Input
                disabled={record.has_reading=='3'?true:false}
                type="text"
                style={{ width: 120,marginTop:25 }}
                onBlur= {(e) => meterBlur(record, e,'latest_ton')}
                //onChange={(e) => meterChange(record, e,'latest_ton')} 
              />
            )}
          </FormItem>
        </form>
      )
    }
  },{
    title: '本次抄表读数',
    dataIndex: 'current_ton',
    key: 'current_ton',
    render: (text, record) => {
      return (
        <form>
          <FormItem {...formItemLayout}>
            {getFieldDecorator(`current_ton_${record.id}`, {
              rules: [{
                required: true,
                pattern:/(^[1-9]([0-9]){1,9}\.\d{1,2}$)|(^[1-9]{1,5}\.\d{1,2}$)|(^0\.\d[1-9]$)|(^0\.[1-9]\d?$)|(^[1-9]{1,5}$)|(^[1-9]([0-9]){1,9}$)/,
                message: '请输入读数10位以内(正整数或小数点后两位)'
              }],
              initialValue: record.current_ton!=0?record.current_ton:''
            })(
              <Input
                disabled={record.has_reading=='3'?true:false}
                type="text"
                style={{ width: 120,marginTop:25 }}
                onBlur= {(e) => meterBlur(record, e,'current_ton')}
                //onChange={(e) => meterChange(record, e,'current_ton')}
              />
            )}
          </FormItem>
        </form>
      )
    }
  }, {
    title: '抄表用量',
    dataIndex: 'use_ton',
    key: 'use_ton',
    render: noData,
  },{
    title: '抄表费用',
    dataIndex: 'price',
    key: 'price',
    render: noData,
  }];
  const FailedModalsParams= {
    visible,
    default_count,
    success_count,
    error_count,
    error_list,
    ID,
    type,
    params
  }
  // 表格分页配置
  const pagination = {
    current: params.page,
    onChange: handlePaginationChange,
    total: parseInt(totals),
    showTotal: totals => `共${totals}条`,
    defaultCurrent: 1
  };
  return (
    <div>
      <Breadcrumb separator=">">
        <Breadcrumb.Item>抄表管理</Breadcrumb.Item>
        <Breadcrumb.Item>抄表</Breadcrumb.Item>
      </Breadcrumb>
      <Card className="section">
        <Form>
          <Row justify="start">
            <Col span={6}>
              <FormItem label="表身号" {...formItemLayout}>
                {getFieldDecorator('meter_no')(
                  <Input placeholder="表具编号"/>
                )}
              </FormItem>
            </Col>
            <Community form={form} allDatas={{group:{},building:{},unit:{},room:{}}}/>
          </Row>
          <Row>
            <Col style={{float: 'right', paddingRight: '2%'}}>
              <Button type="primary" className="mr1" onClick={handleSubmit}>查询</Button>
              <Button type="ghost" onClick={handleReset}>重置</Button>
            </Col>
          </Row>
        </Form>
      </Card>
      <Card>
        <Button type="primary" style={{ marginLeft: '10px' }} onClick={handleExport.bind(this)}>导出</Button>
        {/* {status=='1'?<Popconfirm title="确定生成账单吗？" onConfirm={handleOk.bind(this)} okText="确定" cancelText="取消">
          <Button type="primary" style={{ marginLeft: '10px' }}>生成账单</Button>
        </Popconfirm>:null} */}
        <Popconfirm title="确定生成账单吗？" onConfirm={handleOk.bind(this)} okText="确定" cancelText="取消">
          <Button type="primary" style={{ marginLeft: '10px' }}>生成账单</Button>
        </Popconfirm>
        <FailedModals dispatch={dispatch}   {...FailedModalsParams}/>
        <Table
          className="mt1"
          loading={loading}
          columns={columns}
          dataSource={list}
          pagination={pagination}
          rowKey={record => record.id} />
      </Card>
    </div>
  )
}
function mapStateToProps(state) {
  return {
    ...state.MeterReadingSystemModel,
    loading: state.loading.models.MeterReadingSystemModel,
  }
}
export default connect(mapStateToProps)(Form.create()(MeterReadingSystem));
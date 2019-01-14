import React from 'react';
import { connect } from 'dva';
import { Form, Row, Col, Button, Breadcrumb, Table, Select, Card, Icon, Input } from 'antd';
import Community from '../../components/Community/Community.js';
import ExImport from '../../components/ExImport/';
import { Link } from 'react-router-dom';
import { noData, author, getCommunityId, download } from '../../utils/util';
const FormItem = Form.Item;
const Option = Select.Option;
const formItemLayout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 16
  },
};
let communityParams = {
  page:1,
  rows:10,
  community_id:'',
  meter_no:"",
  meter_status:"",
  group:"",
  building:"",
  unit:"",
  room:"",
};
function ElectricityManage(props){
  let { dispatch,form,list,totals,params,loading,visible,is_reset} = props;
  if(is_reset == true){
    form.resetFields();
    dispatch({
      type: 'ElectricityManageModel/concat',
      payload: {
        is_reset:false,
      }
    });
  }
  const { getFieldDecorator } = form;
  // 表格列配置
  const columns = [{
    title: '表身号',
    dataIndex: 'meter_no',
    key: 'meter_no',
    render: noData,
  }, {
    title: '对应房屋',
    dataIndex: 'address',
    key: 'address',
    render: noData,
  },{
    title: '开始使用时间',
    dataIndex: 'start_time',
    key: 'start_time',
    render: noData,
  }, {
    title: '起始读数',
    dataIndex: 'start_ton',
    key: 'start_ton',
    render: noData,
  }, {
    title: '电表状态',
    dataIndex: 'meter_status_desc',
    key: 'meter_status_desc',
    render: noData,
  }, {
    title: '抄表周期',
    dataIndex: 'cycle_time',
    key: 'cycle_time',
    render: noData,
  }, {
    title: '账期',
    dataIndex: 'payment_time',
    key: 'payment_time',
    render: noData,
  }, {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
    render: (text, record) => {
      return (<span title={text}>{text != null && text.length > 20 ? text.substring(0, 20) + '...' : text}</span>)
    }
  }, {
    title: '操作',
    dataIndex: 'desc',
    render: (text, record) => {
      let link = `/electricityReadingAdd?id=${record.id}`;
      return <div>
        {author('edit') ? <Link to={link}>编辑</Link> : null}
      </div>
    }
  }];
  /**
   * 监听表格pageSize变化
   * @param  {Number} size
   */
  function handleShowSizeChange(current, size){
    communityParams.page = 1;
    communityParams.rows = size;
    communityParams.community_id = sessionStorage.getItem('communityId');
    dispatch({
      type: 'ElectricityManageModel/getList',
      payload: communityParams
    });
  }
  /**
   * 监听表格分页切换
   * @param  {Number} page
   */
  function handlePaginationChange(page){
    communityParams.community_id = sessionStorage.getItem('communityId');
    communityParams.page = page;
    dispatch({
      type: 'ElectricityManageModel/getList',
      payload: communityParams
    })
  }
  /**
   * 查询
   */
  function handleSubmit(e){
    form.validateFields((err,values)=>{
      const param = values;
      param.page = 1;
      param.rows = 10;
      param.community_id = sessionStorage.getItem('communityId');
      dispatch({
        type:'ElectricityManageModel/getList',
        payload: param,
      })
    })
  }
  /**
   * 重置
   */
  function handleReset(){
    form.resetFields();
    form.validateFields((err,values)=>{
      const param = {
        page:1,
        rows:10,
        community_id:sessionStorage.getItem('communityId'),
        meter_no:"",
        meter_status:"",
        group:"",
        building:"",
        unit:"",
        room:"",
      };
      dispatch({
        type:'ElectricityManageModel/getList',
        payload: param,
      });
      const params = {
        unitData:[],
        roomData:[],
        buildingData:[],
      };
      dispatch({
        type: 'CommunityModel/concat',
        payload: params
      });
    })
  }
  /**
   * 点击批量导入，显示弹框
   */
  function showModal(){
    dispatch({
      type: 'ElectricityManageModel/concat',
      payload:{
        visible:true
      }
    });
  }
  /**
   * 取消批量导入
   */
  function hideModalVisible(){
    dispatch({
      type: 'ElectricityManageModel/concat',
      payload:{
        visible:false,
      }
    });
    handleReset()
  }
  /**
   * 批量导入中的下载模板
   */
  function downFiles() {
    dispatch({
      type: 'ElectricityManageModel/downFiles',
      payload: {
        "community_id": getCommunityId()
      },callback(data){
        download(data);
      }
    });
  }
  // 表格分页配置
  const pagination = {
    // showSizeChanger: true,
    // showQuickJumper: true,
    current: params.page,
    pageSize:params.rows,
    onShowSizeChange: handleShowSizeChange.bind(this),
    onChange: handlePaginationChange.bind(this),
    total: parseInt(totals),
    pageSizeOptions: ['10', '20', '30', '40'],
    defaultPageSize: 10,
    showTotal: (total) => `共有 ${totals} 条`,
  };
  return (
    <div>
      <Breadcrumb separator="/">
        <Breadcrumb.Item>小区管理</Breadcrumb.Item>
        <Breadcrumb.Item>电表管理</Breadcrumb.Item>
      </Breadcrumb>
      <Card>
        <Form>
          <Row>
            <Col span={6}>
              <FormItem label="表身号" {...formItemLayout}>
                {getFieldDecorator('meter_no')(<Input placeholder="请输入表身号" />
                )}
              </FormItem>
            </Col>
            <Community form={form} allDatas={{group:{},building:{},unit:{},room:{}}}/>
          </Row>
          <Row>
            <Col span={6}>
              <FormItem label="电表状态" {...formItemLayout}>
                {getFieldDecorator('meter_status')(
                  <Select placeholder="请选择">
                    <Option value="">全部</Option>
                    <Option key={1} value="1">正常</Option>
                    <Option key={2} value="2">损坏</Option>
                    <Option key={3} value="3">停用</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col style={{float: 'right', paddingRight: '2%'}}>
              <Button type="primary" className="mr1" onClick={handleSubmit}>查询</Button>
              <Button type="ghost" onClick={handleReset}>重置</Button>
            </Col>
          </Row>
        </Form>
      </Card>
      <Card className="mt1">
        {author('add') ? <Link to="/electricityReadingAdd"><span><Button type="primary"><Icon type="plus" />新增电表</Button></span></Link> : null}
        {author('batchLeadingIn') ? <Button type="" className="ml1" onClick={showModal.bind(this)}>批量导入</Button> : null}
        <ExImport id={'communitys'}
          visible={visible}
          callback={hideModalVisible.bind(this)}
          downUrl={downFiles.bind(this)}
          importUrl="/property/electrict/import"/>
        <Table columns={columns} dataSource={list} loading={loading} rowKey={record => record.id} className="mt1" pagination={pagination} />
      </Card>
    </div>
  )
}
function mapStatusToProps(state){
  return {
    ...state.ElectricityManageModel,
    loading: state.loading.models.ElectricityManageModel,
  }
}
export default connect(mapStatusToProps)(Form.create()(ElectricityManage))

import React from 'react'
import {Table,Breadcrumb,Card,Button,Form,} from 'antd';
import { connect } from 'dva';
import Community from '../../components/Community/Community.js';
function LoggingView(props){
  const {dispatch,form,loading,data,totals,statusType,params,period_id} = props;
  function handleReset(e){
    e.preventDefault();
    let params = {
      page:1,
      rows:10,
      group:'',
      building:'',
      unit:'',
      room:'',
      community_id:sessionStorage.getItem("communityId"),
      period_id:period_id
    }
    props.form.resetFields(['group', 'unit', 'room', 'building', 'property_type', 'status']);
    dispatch({
      type:"LoggingViewModel/sharedPeriodBillList",
      payload:params
    })
  }
  function handSearch(val){
    props.form.validateFields((err,values) => {
      params.page = 1;
      params.rows = 10;
      params.group = values.group;
      params.building = values.building;
      params.unit = values.unit;
      params.room = values.room;
      params.community_id = sessionStorage.getItem("communityId");
      params.period_id = period_id;
      dispatch({
        type:"LoggingViewModel/sharedPeriodBillList",
        payload:params
      })
    })
  }
  // function handleExport(){
  //   form.validateFields((err, values) => {
  //     let param = values;
  //     param.community_id = getCommunityId();
  //     param.period_id = period_id;
  //     dispatch({
  //       type: 'PublicAccountManagementViewModel/billDetail',
  //       payload: param,
  //       callback(data){
  //         download(data);
  //       }
  //     });
  //   });
  // }
  function handleIssue(){
    dispatch({
      type:"LoggingViewModel/sharedPeriodpushBill",
      payload:{
        community_id:sessionStorage.getItem("communityId"),
        period_id:period_id,
      },
    })
  }
  function handlEcancel(){
    dispatch({
      type:"LoggingViewModel/sharedPeriodCancelList",
      payload:{
        community_id:sessionStorage.getItem("communityId"),
        period_id:period_id,
      },
      callBack(){
        setTimeout(() => {
          history.back();
        },1000)
      }
    })
  }
  function pageChange(page,current){
    params.page = page;
    params.community_id = sessionStorage.getItem("communityId");
    params.period_id = period_id;
    dispatch({
      type:"LoggingViewModel/sharedPeriodBillList",
      payload:params
    })
  }
  function handleShowSizeChange(current, size){
    params.page = 1;
    params.rows = size;
    params.community_id = sessionStorage.getItem("communityId");
    params.period_id = period_id;
    dispatch({
      type:"LoggingViewModel/sharedPeriodBillList",
      payload:params
    })
  }
  const columns = [{
    title: '房屋信息',
    dataIndex: 'address',
    key:'address',
  },{
    title: '楼段系数',
    dataIndex: 'floor_coe',
    key:'floor_coe',
  }, {
    title: '楼道号',
    dataIndex: 'floor_shared',
    key:'floor_shared',
  }, {
    title: '电梯编号',
    dataIndex: 'lift_shared',
    key:'lift_shared',
  }, {
    title: '电梯用电金额（这里展示总金额）',
    dataIndex: 'elevator_total',
    key:'elevator_total',
  }, {
    title: '电梯应分摊金额',
    dataIndex: 'elevator_shared',
    key:'elevator_shared',
  }, {
    title: '本楼道用电金额(这里展示总金额）',
    dataIndex: 'corridor_total',
    key:'corridor_total',
  }, {
    title: '楼道用电应分摊金额',
    dataIndex: 'corridor_shared',
    key:'corridor_shared',
  }, {
    title: '小区整体用水用电应总金额（这里展示总金额）',
    dataIndex: 'water_electricity_total',
    key:'water_electricity_total',
  }, {
    title: '小区整体用水用电应分摊金额',
    dataIndex: 'water_electricity_shared',
    key:'water_electricity_shared',
  },{
    title: '应分摊总金额',
    dataIndex: 'shared_total',
    key:'shared_total',
  }];
  const PaginationProps = {
    total: Number(totals),
    // showSizeChanger: true,
    // showQuickJumper: true,
    current: params.page,
    pageSize: params.rows,
    defaultPageSize: 10,
    pageSizeOptions: ['10', '20', '30', '40'],
    onChange: pageChange.bind(this),
    onShowSizeChange: handleShowSizeChange.bind(this),
    showTotal: (total) => `共有 ${totals} 条`,
  }
  return (
    <div className="page-content">
      <Breadcrumb separator=">">
        <Breadcrumb.Item>小区管理</Breadcrumb.Item>
        <Breadcrumb.Item>账单管理</Breadcrumb.Item>
      </Breadcrumb>
      <Card className="section">
        <Form>
          <Community form={form} allDatas={{group:{},building:{},unit:{},room:{}}}/>
        </Form>
        <div className="btn-group-right">
          <Button type="primary" onClick={handSearch.bind(this)} loading={loading}>查询</Button>
          <Button type="ghost" onClick={handleReset.bind(this)} className="ml1">重置</Button>
        </div>
      </Card>
      <Card>
        {/* <Button style={{marginBottom:"20px"}} onClick={handleExport.bind(this)}>导出明细</Button> */}
        {statusType == 3?null:<Button type="primary" onClick={handleIssue.bind(this)} loading={loading} style={{marginBottom:"20px",marginLeft:"10px"}}>确认无误并发布账单</Button>}
        {statusType == 3?null:<Button onClick={handlEcancel.bind(this)} style={{marginBottom:"20px",marginLeft:"10px"}}>取消发布账单</Button>}
        <Table columns={columns} dataSource={data} rowKey={record => record.id} loading={loading} pagination={PaginationProps} />
      </Card>
    </div>
  )
}
function mapStateToProps(state) {
  return {
    ...state.LoggingViewModel,
    loading: state.loading.models.LoggingViewModel,
  }
}
export default connect(mapStateToProps)(Form.create()(LoggingView));

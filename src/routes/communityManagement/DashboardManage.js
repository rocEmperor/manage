import React from 'react';
import { connect } from 'dva';
import {Tabs,Breadcrumb, Card, Form , Button, Col, Row, Popconfirm, Table,Icon } from 'antd';
import { Link } from 'react-router-dom';
import Modals from './Components/Modal';
import DashboardSearch from './Components/DashboardSearch'
import ExImport from '../../components/ExImport/';
import { author, download,noData,getCommunityId } from '../../utils/util';
const TabPane = Tabs.TabPane;
const Buttons = (props)=>{
  if(props.curTabPaneKey==='1'||props.curTabPaneKey==='2'||props.curTabPaneKey==='3'){
    return(
      author('add')?<Link to = {`/dashboardProjectManageAdd?curTabPaneKey=${props.curTabPaneKey}`}><span><Button><Icon type="plus" />新增项目</Button></span></Link>:null
    )
  }else if(props.curTabPaneKey==='4'){
    return(
      author('add')?<Link to = {`/dashboardMeterManageAdd?curTabPaneKey=${props.curTabPaneKey}`}><span><Button><Icon type="plus" />新增水表</Button></span></Link>:null
    )
  }else if(props.curTabPaneKey==='5'){
    return(
      author('add')?<Link to = {`/dashboardElectrictyManageAdd?curTabPaneKey=${props.curTabPaneKey}`}><span><Button><Icon type="plus" />新增电表</Button></span></Link>:null
    )
  }
}
const communityParams = {
  page:1,
  rows:10,
  community_id:'',
  name:'',
  panel_status:'',
  panel_type:'',
  shared_type:'',
  current:1
}
const communityParams1 = {
  page:1,
  rows:10,
  community_id:'',
  meter_no:"",
  meter_status:"",
  group:"",
  building:"",
  unit:"",
  room:"",
}
let sharedType = {
  shared_type:'4'
}
const columns1=[
  {
    title: '苑/期/区',
    dataIndex: 'group',
    key: 'group',
    render: noData,
  },
  {
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
  },
  {
    title: '表具类型',
    dataIndex: 'type',
    key: 'type',
    render: noData,
  },
  {
    title: '表具编号',
    dataIndex: 'meter_no',
    key: 'meter_no',
    render: noData,
  },{
    title: '上次抄表时间',
    dataIndex: 'latest_record_time',
    key: 'latest_record_time',
    render: noData,
  }, {
    title: '上次抄表读数',
    dataIndex: 'start_ton',
    key: 'start_ton',
    render: noData,
  },{
    title: '表具状态',
    dataIndex: 'meter_status_desc',
    key: 'meter_status_desc',
    render: noData,
  },{
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
    render: (text, record) => {
      return (<span title={text}>{text != null && text.length > 20 ? text.substring(0, 20) + '...' : text}</span>)
    }
  },
]
const columns2=[
  {
    title: '电梯编号/楼道号/项目名称',
    dataIndex: 'name',
    key:'name',
  }, {
    title: '所属类型',
    dataIndex: 'shared_type',
    key:'shared_type',
  }, {
    title: '仪表类型',
    dataIndex: 'panel_type',
    key:'panel_type',
  },{
    title: '表盘状态',
    dataIndex: 'panel_status_msg',
    key:'panel_status_msg',
  },{
    title: '起始读数',
    dataIndex: 'start_num',
    key:'start_num',
  }, {
    title: '备注',
    dataIndex: 'remark',
    width:"30%",
    key:'remark',
  }, 
]
function DashboardManage (props){
  let {dispatch,form,loading,is_reset,list,totals,curTabPaneKey, calc_msg,visible,visible1,visible2,rule_type,type,params,params1} = props;
  if(is_reset == true){
    form.resetFields();
    dispatch({
      type: 'DashboardManageModel/concat',
      payload: {
        is_reset:false,
      }
    });
  }
  /**
   * 搜索
   */
  function handSearch(){
    form.validateFields((err,values)=>{
      const param = values;
      param.page = 1;
      param.rows = 10;
      param.shared_type = params.shared_type;
      param.community_id = sessionStorage.getItem('communityId');
      const param1 = values;
      param1.page = 1;
      param1.rows = 10;
      param1.community_id = values.community_id || getCommunityId();
      if(curTabPaneKey==='4'){
        delete param1.shared_type;
        dispatch({
          type:'DashboardManageModel/getWaterList',
          payload:param1,
        })
      }else if(curTabPaneKey==='5'){
        delete param1.shared_type;
        dispatch({
          type:'DashboardManageModel/getElectricityList',
          payload: param1,
        })
      }else{
        dispatch({
          type:'DashboardManageModel/getList',
          payload: param,
        })
      }
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
        name:'',
        panel_status:'',
        panel_type:'',
        shared_type:params.shared_type,
      }
      const param1={
        page:1,
        rows:10,
        community_id:sessionStorage.getItem("communityId"),
        meter_no:"",
        meter_status:"",
        group:"",
        building:"",
        unit:"",
        room:"",
      }
      if(curTabPaneKey==='4'){
        dispatch({
          type:'DashboardManageModel/getWaterList',
          payload:param1,
        })
      }else if(curTabPaneKey==='5'){
        dispatch({
          type:'DashboardManageModel/getElectricityList',
          payload: param1,
        })
      }else{
        dispatch({
          type:'DashboardManageModel/getList',
          payload: param,
        })
      }
    })
  }
  /**
   * 电梯，楼道，整体用水用电Tab切换
   * @param  {String} value
   * value = 1  电梯
   * value = 2  楼道
   * value = 3  整体用水用电
   */
  function PooledType(value){
    communityParams.panel_type='';
    communityParams.name='';
    communityParams.panel_status='';
    communityParams.community_id=getCommunityId();
    communityParams.shared_type=value;
    communityParams.page=1;
    communityParams.rows=10;

    communityParams1.page=1;
    communityParams1.rows=10,
    communityParams1.community_id=getCommunityId();
    communityParams1.meter_no="",
    communityParams1.meter_status="",
    communityParams1.group="",
    communityParams1.building="",
    communityParams1.unit="",
    communityParams1.room="",
    sharedType = {
      shared_type:value
    };
    props.form.resetFields();
    dispatch({
      type: 'DashboardManageModel/concat',
      payload: {curTabPaneKey: value}
    });
    if(value==='4'){
      dispatch({
        type:"DashboardManageModel/getWaterList",
        payload: communityParams1
      })
    }else if(value==='5'){
      dispatch({
        type:"DashboardManageModel/getElectricityList",
        payload: communityParams1
      })
    }else{
      dispatch({
        type:"DashboardManageModel/getList",
        payload: communityParams
      })
    }
  }
  /**
   * 点击分摊规则设置，显示弹框
   */
  function handleModal(){
    dispatch({
      type: 'DashboardManageModel/concat',
      payload:{
        visible1:true
      }
    });
  }
  /**
   * 取消批量导入
   */
  function hideModalVisible(e){
    if(e==='water'){
      dispatch({
        type: 'DashboardManageModel/concat',
        payload:{
          visible:false,
        }
      });
      const param = {
        page:1,
        rows:10,
        community_id:getCommunityId(),
        meter_no:"",
        meter_status:"",
        group:"",
        building:"",
        unit:"",
        room:"",
      }
      dispatch({
        type:`DashboardManageModel/${curTabPaneKey==='4'?'getWaterList':'getElectricityList'}`,
        payload: param
      })
      const params = {
        unitData:[],
        roomData:[],
        buildingData:[],
      }
      dispatch({
        type: 'CommunityModel/concat',
        payload: params
      });
    }else if(e==='shared'){
      dispatch({
        type: 'DashboardManageModel/concat',
        payload:{
          visible2:false,
        }
      });
      let params = {};
      params.panel_type='';
      params.name='';
      params.panel_status='';
      params.community_id=sessionStorage.getItem('communityId');
      params.shared_type=curTabPaneKey;
      params.page=1;
      params.rows=10;
      dispatch({
        type:"DashboardManageModel/getList",
        payload: params
      })
    }
  }
  /**
   * 电梯用电分摊规则
   * @param  {Object} val
   * val.target.value = 1 按楼层分摊金额
   * val.target.value = 2 按面积分摊金额
   * val.target.value = 3 按楼层＆面积相结合分摊金额
   */
  function onChange(val){
    dispatch({
      type: 'DashboardManageModel/concat',
      payload:{
        type:val.target.value?val.target.value:rule_type,
      }
    });
  }
  /**
   * 确认分摊规则设置
   */
  function onOk(e,value){
    let query = {
      community_id:sessionStorage.getItem('communityId'),
      rule_type: type?type:rule_type
    }
    return new Promise((resolve, reject) => {
      dispatch({
        type: 'DashboardManageModel/setSharedLift',
        payload:query
      }).then((result) => {
        communityParams.community_id=sessionStorage.getItem('communityId');
        communityParams.shared_type=params.shared_type;
        dispatch({
          type:"DashboardManageModel/getList",
          payload: communityParams
        })
      }).catch((err) => {

      });
    });
  }
  /**
   * 点击批量导入，隐藏弹框
   */
  function showModal(){
    if(curTabPaneKey === '4' || curTabPaneKey === '5'){
      dispatch({
        type: 'DashboardManageModel/concat',
        payload:{
          visible:true
        }
      });
    }else{
      dispatch({
        type: 'DashboardManageModel/concat',
        payload:{
          visible2:true
        }
      });
    }
  }
  /**
   * 取消分摊规则设置，隐藏弹框
   */
  function hideModalVisible1(){
    dispatch({
      type: 'DashboardManageModel/concat',
      payload:{
        visible1:false,
      }
    });
  }
  /**
   * 删除公摊项目表格数据
   * @param  {Object} record
   */
  function removeInfo(record){
    let query = {
      id:record.id,
    }
    let query1 = {
      id:record.id,
      type:curTabPaneKey==='4'?1:2
    }
    if(curTabPaneKey==='4'||curTabPaneKey==='5'){
      return new Promise((resolve, reject)=>{
        dispatch({
          type: 'DashboardManageModel/sharedDeleteMeter',
          payload:query1
        }).then((result) => {
          communityParams1.community_id=sessionStorage.getItem('communityId');
          dispatch({
            type:`DashboardManageModel/${curTabPaneKey==='4'?'getWaterList':'getElectricityList'}`,
            payload: communityParams1
          })
        }).catch((err)=>{
  
        });
      });
    }else{
      return new Promise((resolve, reject)=>{
        dispatch({
          type: 'DashboardManageModel/sharedDelete',
          payload:query
        }).then((result) => {
          communityParams.community_id=sessionStorage.getItem('communityId');
          communityParams.shared_type=params.shared_type;
          dispatch({
            type:"DashboardManageModel/getList",
            payload: communityParams
          })
        }).catch((err)=>{
  
        });
      });
    }

  }
  /**
   * 监听表格pageSize变化
   * @param  {Number} size
   */
  function handleShowSizeChange(current, size){
    if(curTabPaneKey==='4'||curTabPaneKey==='5'){
      communityParams1.page = 1;
      communityParams1.rows = size;
      communityParams1.community_id = sessionStorage.getItem('communityId');
      communityParams1.meter_no=params1.meter_no,
      communityParams1.meter_status=params1.meter_status,
      communityParams1.group=params1.group,
      communityParams1.building=params1.building,
      communityParams1.unit=params1.unit,
      communityParams1.room=params1.room,
      dispatch({
        type: `DashboardManageModel/${curTabPaneKey==='4'?'getWaterList':'getElectricityList'}`,
        payload: communityParams1
      });
    }else{
      communityParams.page = 1;
      communityParams.rows = size;
      communityParams.community_id = sessionStorage.getItem('communityId');
      communityParams.panel_type=params.panel_type;
      communityParams.name=params.name;
      communityParams.panel_status=params.panel_status;
      communityParams.shared_type=params.shared_type;
      dispatch({
        type: 'DashboardManageModel/getList',
        payload: communityParams
      });
    }
  }
  /**
   * 监听表格分页变化
   * @param  {Number} page
   */
  function handlePaginationChange(page){
    if(curTabPaneKey==='4'||curTabPaneKey==='5'){
      communityParams1.community_id = sessionStorage.getItem('communityId');
      communityParams1.page = page;
      communityParams1.rows = params1.rows;
      communityParams1.meter_no=params1.meter_no,
      communityParams1.meter_status=params1.meter_status,
      communityParams1.group=params1.group,
      communityParams1.building=params1.building,
      communityParams1.unit=params1.unit,
      communityParams1.room=params1.room,
      dispatch({
        type: `DashboardManageModel/${curTabPaneKey==='4'?'getWaterList':'getElectricityList'}`,
        payload: communityParams1
      })
    }else{
      communityParams.community_id = sessionStorage.getItem('communityId');
      communityParams.page = page;
      communityParams.shared_type=curTabPaneKey;
      communityParams.rows = params.rows;
      communityParams.panel_type=params.panel_type;
      communityParams.name=params.name;
      communityParams.panel_status=params.panel_status;
      dispatch({
        type: 'DashboardManageModel/getList',
        payload: communityParams
      })
    }
  }
  /**
   * 批量导入中的下载模板
   */
  function downFiles(e) {
    if(e=='shared'){
      dispatch({
        type: 'DashboardManageModel/downFiles',
        payload: {
          "community_id": sessionStorage.getItem('communityId')
        },callback(data){
          download(data);
        }
      });
    }else if(e=='water'){
      dispatch({
        type: `DashboardManageModel/${curTabPaneKey==='4'?'downFilesWater':'downElectricityFiles'}`,
        payload: {
          "community_id": sessionStorage.getItem('communityId')
        },callback(data){
          download(data);
        }
      });
    }
  }
  /**
   *导出
   *
   */
  function handInport(){
    form.validateFields((err, values) => {
      params1.type=curTabPaneKey==='4'?1:2;
      dispatch({
        type: 'DashboardManageModel/meterExport',
        payload: {...params1},
        callback(data){
          download(data);
        }
      });
    });
  }
  // 表格列配置
  let columnsData=curTabPaneKey==='4'||curTabPaneKey==='5'?columns1:columns2
  const columns = [...columnsData,{
    title: '操作',
    dataIndex: 'operation',
    render: (text, record) => {
      let link1 = `/dashboardProjectManageAdd?id=${record.id}&curTabPaneKey=${curTabPaneKey}`;
      let link = `/dashboardMeterManageAdd?id=${record.id}&curTabPaneKey=${curTabPaneKey}`;
      let alink = `/dashboardElectrictyManageAdd?id=${record.id}&curTabPaneKey=${curTabPaneKey}`;
      return(
        <div>
          {curTabPaneKey==='4'&&author('edit')?<Link to={link}>编辑</Link>:null}
          {curTabPaneKey==='5'&&author('edit')?<Link to={alink}>编辑</Link>:null}
          {(curTabPaneKey==='1'||curTabPaneKey==='2'||curTabPaneKey==='3')&&author('edit')?<Link to={link1}>编辑</Link>:null}
          {author('remove')?<Popconfirm title="确定要删除么?" onConfirm={removeInfo.bind(this, record)}>
            <a style={{marginLeft:"10px"}} href="#">删除</a>
          </Popconfirm>:null}
        </div>
      );
    },
  }];
  // 表格分页配置
  const pagination = {
    current: curTabPaneKey==='4'||curTabPaneKey==='5'?params1.page:params.page,
    pageSize:curTabPaneKey==='4'||curTabPaneKey==='5'?params1.rows:params.rows,
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
        <Breadcrumb.Item>仪表管理</Breadcrumb.Item>
      </Breadcrumb>
      <Card className="section">
        <Tabs style={{width:"100%",paddingBottom:"20px"}}
          className="left"
          activeKey={curTabPaneKey}
          onChange={PooledType.bind(this)}>
          <TabPane tab="独立水表" key="4" type="card">
          </TabPane>
          <TabPane tab="独立电表" key="5" type="card">
          </TabPane>
          <TabPane tab="电梯用电" key="1" type="card">
            <div>{calc_msg}</div>
          </TabPane>
          <TabPane tab="楼道用电" key="2" type="card">
            <div>{calc_msg}</div>
          </TabPane>
          <TabPane tab="整体用水用电" key="3" type="card">
            <div>{calc_msg}</div>
          </TabPane>
        </Tabs>
        <Form>
          <DashboardSearch form={form} curTabPaneKey={curTabPaneKey} />
          <Col span={4} offset={2} style={{textAlign:'right',paddingRight:'35px'}}>
            <Button type="primary" onClick={handSearch.bind(this)} loading={loading} className="mr1" style={{marginLeft: '10px'}} >查询</Button>
            <Button type="ghost" onClick={handleReset.bind(this)}>重置</Button>
          </Col>
        </Form>
      </Card>
      <Card className="section">
        <Row>
          {/* <Link to="/electricityReadingAdd"><span><Button type="primary"><Icon type="plus" />新增电表</Button></span></Link>
          <Button type="" className="ml1" onClick={showModal.bind(this)}>批量导入</Button> */}
          <div className="right">
            {author('add')?<Buttons curTabPaneKey={curTabPaneKey}/>:null}
            {author('batchLeadingIn')?<Button style={{marginLeft:"10px"}} onClick={showModal.bind(this)}>批量导入</Button>:null}
            {(curTabPaneKey==='4'||curTabPaneKey==='5')&&author('export')?<Button style={{marginLeft:"10px"}} onClick={handInport.bind(this)}>导出</Button>:null}
            {curTabPaneKey === '1'?<Button style={{marginLeft:"10px"}} onClick={handleModal.bind(this, 1)}>分摊规则设置</Button>:''}
          </div>
        </Row>
        <ExImport id={'communitys'}
          visible={visible}
          callback={hideModalVisible.bind(this,'water')}
          downUrl={downFiles.bind(this,'water')}
          importUrl={`/property/${curTabPaneKey==='4'?'water':'electrict'}/import`}/>
        <ExImport id="communitys"
          visible={visible2}
          callback={hideModalVisible.bind(this,'shared')}
          downUrl={downFiles.bind(this,'shared')}
          importUrl="/property/shared/import" />
        {/* <ExImport id={'communitys'}
          visible={visible3}
          callback={hideModalVisible.bind(this,'electrict')}
          downUrl={downFiles.bind(this)}
          importUrl="/property/electrict/import"/> */}
        <Modals id={'modals'} onOk={onOk} onChange={onChange.bind(this)} sharedType={sharedType} visible={visible1} rule_type={rule_type} callback={hideModalVisible1.bind(this)} />
        <Table style={{marginTop:"20px"}} loading={loading} dataSource={list} columns={columns} rowKey={record => record.id} pagination={pagination} />
      </Card>
    </div>
  )
}
function mapStateToProps(state){
  return {
    ...state.DashboardManageModel,
    loading: state.loading.models.DashboardManageModel,
  }
}
export default connect(mapStateToProps)(Form.create()(DashboardManage))

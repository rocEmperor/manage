import React from 'react';
import { connect } from 'dva';
import {Tabs,Breadcrumb, Card, Form, Input, Select, Button, Col, Row, Popconfirm, Table, } from 'antd';
import { Link } from 'react-router-dom';
import Modals from './Components/Modal';
import ExImport from '../../components/ExImport/';
import { author, download } from '../../utils/util';
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
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
let sharedType = {
  shared_type:'1'
}
function ProjectManagement (props){
  let {dispatch,form,loading,is_reset,list,totals,curTabPaneKey, calc_msg,visible,visible1,rule_type,type,params} = props;
  const { getFieldDecorator } = form;
  if(is_reset == true){
    form.resetFields();
    dispatch({
      type: 'ProjectManagementModel/concat',
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
      dispatch({
        type:'ProjectManagementModel/getList',
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
        name:'',
        panel_status:'',
        panel_type:'',
        shared_type:params.shared_type,
      }
      dispatch({
        type:'ProjectManagementModel/getList',
        payload: param,
      })
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
    communityParams.community_id=sessionStorage.getItem('communityId');
    communityParams.shared_type=value;
    communityParams.page=1;
    communityParams.rows=10;
    sharedType = {
      shared_type:value
    };
    props.form.resetFields();
    dispatch({
      type: 'ProjectManagementModel/concat',
      payload: {curTabPaneKey: value}
    });
    dispatch({
      type:"ProjectManagementModel/getList",
      payload: communityParams
    })
  }
  /**
   * 点击分摊规则设置，显示弹框
   */
  function handleModal(){
    dispatch({
      type: 'ProjectManagementModel/concat',
      payload:{
        visible1:true
      }
    });
  }
  /**
   * 取消批量导入
   */
  function hideModalVisible(){
    dispatch({
      type: 'ProjectManagementModel/concat',
      payload:{
        visible:false,
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
      type:"ProjectManagementModel/getList",
      payload: params
    })
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
      type: 'ProjectManagementModel/concat',
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
        type: 'ProjectManagementModel/setSharedLift',
        payload:query
      }).then((result) => {
        communityParams.community_id=sessionStorage.getItem('communityId');
        communityParams.shared_type=params.shared_type;
        dispatch({
          type:"ProjectManagementModel/getList",
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
    dispatch({
      type: 'ProjectManagementModel/concat',
      payload:{
        visible:true
      }
    });
  }
  /**
   * 取消分摊规则设置，隐藏弹框
   */
  function hideModalVisible1(){
    dispatch({
      type: 'ProjectManagementModel/concat',
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
      id:record.id
    }
    return new Promise((resolve, reject)=>{
      dispatch({
        type: 'ProjectManagementModel/sharedDelete',
        payload:query
      }).then((result) => {
        communityParams.community_id=sessionStorage.getItem('communityId');
        communityParams.shared_type=params.shared_type;
        dispatch({
          type:"ProjectManagementModel/getList",
          payload: communityParams
        })
      }).catch((err)=>{

      });
    });

  }
  /**
   * 监听表格pageSize变化
   * @param  {Number} size
   */
  function handleShowSizeChange(current, size){
    communityParams.page = 1;
    communityParams.rows = size;
    communityParams.community_id = sessionStorage.getItem('communityId');
    dispatch({
      type: 'ProjectManagementModel/getList',
      payload: communityParams
    });
  }
  /**
   * 监听表格分页变化
   * @param  {Number} page
   */
  function handlePaginationChange(page){
    communityParams.community_id = sessionStorage.getItem('communityId');
    communityParams.page = page;
    communityParams.shared_type=curTabPaneKey;
    dispatch({
      type: 'ProjectManagementModel/getList',
      payload: communityParams
    })
  }
  /**
   * 批量导入中的下载模板
   */
  function downFiles() {
    dispatch({
      type: 'ProjectManagementModel/downFiles',
      payload: {
        "community_id": sessionStorage.getItem('communityId')
      },callback(data){
        download(data);
      }
    });
  }
  // 表格列配置
  const columns = [{
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
  }, {
    title: '表盘状态',
    dataIndex: 'panel_status_msg',
    key:'panel_status_msg',
  }, {
    title: '起始读数',
    dataIndex: 'start_num',
    key:'start_num',
  }, {
    title: '备注',
    dataIndex: 'remark',
    width:"30%",
    key:'remark',
  }, {
    title: '操作',
    dataIndex: 'operation',
    render: (text, record) => {
      let link1 = `/projectManagementAdd?id=${record.id}&curTabPaneKey=${curTabPaneKey}`;
      return(
        <div>
          <Link to={link1}>编辑</Link>
          {author('delete')?<Popconfirm title="确定要删除么?" onConfirm={removeInfo.bind(this, record)}>
            <a style={{marginLeft:"10px"}} href="#">删除</a>
          </Popconfirm>:null}
        </div>
      );
    },
  }];
  // 表格分页配置
  const pagination = {
    current: params.page,
    pageSize:params.rows,
    onShowSizeChange: handleShowSizeChange.bind(this),
    onChange: handlePaginationChange.bind(this),
    total: parseInt(totals),
    pageSizeOptions: ['10', '20', '30', '40'],
    defaultPageSize: 10,
    showTotal: (total) => `共有 ${totals} 条`,
  };
  // 布局
  const formItemLayout = {
    labelCol: {
      span: 8
    },
    wrapperCol: {
      span: 16
    },
  };
  return (
    <div>
      <Breadcrumb separator="/">
        <Breadcrumb.Item>小区管理</Breadcrumb.Item>
        <Breadcrumb.Item>公摊项目管理</Breadcrumb.Item>
      </Breadcrumb>
      <Card className="section">
        <Form>
          <Row>
            <Col span={6}>
              <FormItem label="公摊项目名称" {...formItemLayout}>
                {getFieldDecorator('name')(<Input type="text" placeholder="请输入公摊项目"/>)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="仪表类型：" {...formItemLayout}>
                {getFieldDecorator('panel_type')(
                  <Select className="select-150"  placeholder="请选择仪表类型">
                    <Option value="">全部</Option>
                    <Option key={1} value="1">水表</Option>
                    <Option key={2} value="2">电表</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="表盘状态：" {...formItemLayout}>
                {getFieldDecorator('panel_status')(
                  <Select className="select-150"  placeholder="请选择表盘状态">
                    <Option value="">全部</Option>
                    <Option key={1} value="1">正常</Option>
                    <Option key={2} value="2">异常</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={4} offset={2} style={{textAlign:'right',paddingRight:'35px'}}>
              <Button type="primary" onClick={handSearch.bind(this)} loading={loading} className="mr1" style={{marginLeft: '10px'}} >查询</Button>
              <Button type="ghost" onClick={handleReset.bind(this)}>重置</Button>
            </Col>
          </Row>
        </Form>
      </Card>
      <Card className="section">
        <Row>
          <Tabs style={{width:"100%",paddingBottom:"20px"}}
            className="left"
            activeKey={curTabPaneKey}
            onChange={PooledType.bind(this)}>
            <TabPane tab="电梯" key="1" type="card">
              <div>{calc_msg}</div>
            </TabPane>
            <TabPane tab="楼道" key="2" type="card">
              <div>{calc_msg}</div>
            </TabPane>
            <TabPane tab="整体用水用电" key="3" type="card">
              <div>{calc_msg}</div>
            </TabPane>
          </Tabs>
          <div className="right">
            {author('add') ? <Link to = {`/projectManagementAdd?curTabPaneKey=${curTabPaneKey}`}><Button>新增项目</Button></Link> : null}
            {author('batchLeadingIn') ? <Button style={{marginLeft:"10px"}} onClick={showModal.bind(this)}>批量导入</Button> : null}
            {params.shared_type == 1?<Button style={{marginLeft:"10px"}} onClick={handleModal.bind(this, 1)}>分摊规则设置</Button>:''}
          </div>
        </Row>
        <ExImport id="communitys"
          visible={visible}
          callback={hideModalVisible.bind(this)}
          downUrl={downFiles.bind(this)}
          importUrl="/property/shared/import" />
        <Modals id={'modals'} onOk={onOk} onChange={onChange.bind(this)} sharedType={sharedType} visible={visible1} rule_type={rule_type} callback={hideModalVisible1.bind(this)} />
        <Table style={{marginTop:"20px"}} loading={loading} dataSource={list} columns={columns} rowKey={record => record.id} pagination={pagination} />
      </Card>
    </div>
  )
}
function mapStateToProps(state){
  return {
    ...state.ProjectManagementModel,
    loading: state.loading.models.ProjectManagementModel,
  }
}
export default connect(mapStateToProps)(Form.create()(ProjectManagement))

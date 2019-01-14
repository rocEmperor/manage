import React from 'react';
import { connect } from 'dva';
import { Form, Col, Button, Breadcrumb, Table, Popconfirm, Card,Select } from 'antd';
import { Link } from 'react-router-dom';
import { noData,author } from '../../utils/util';
const Option = Select.Option;
//import Community from '../../components/Community/Community.js';
//import { getCommunityId } from '../../utils/util';

function BuildingManagement(props) {
  const { dispatch,form,list,totals,params,loading,groupData,buildingData,unitData,groupId,is_reset } = props;
  const { getFieldDecorator } = form;
  if(is_reset == true){
    form.resetFields();
    dispatch({
      type: 'BuildingManagementModel/concat',
      payload: {
        is_reset:false,
        buildingData:[],
        groupData:[],
        unitData:[],
      }
    });
  }
  /**
   * 查询表格数据
   * @param  {Object} params
   */
  function reload(params) {
    dispatch({
      type: 'BuildingManagementModel/getList',
      payload: params,
    });
  }
  /** 
   * 搜索
  */
  function handSearch(){
    form.validateFields((err,val)=>{
      const param = val;
      param.page = 1;
      param.rows = 10;
      param.group_name = val.group;
      param.building_name = val.building;
      param.unit_name = val.unit;
      reload(param)
    })
  }
  /** 
   * 重置
  */
  function handReset(){
    form.resetFields();
    form.validateFields((err,val)=>{
      const param = {
        page:1,
        rows:10,
        //community_id: sessionStorage.getItem("communityId"),
        group_name:"",
        building_name:"",
        unit_name:"",
      }
      reload(param)
      dispatch({
        type: 'BuildingManagementModel/concat',
        payload: {
          buildingData:[],
          //groupData:[],
          unitData:[],
        }
      });
    })
  }
  /** 
   * 删除
   * @param{number} id
  */
  function removeInfo(e){
    let param = {
      unit_id:e.unit_id
    }
    dispatch({
      type: 'BuildingManagementModel/buildingDelete',
      payload: param,
      callBack(){
        reload(params)
      }
    });
  }
  function batchAdd(){
    window.localStorage.removeItem("buildingInfo_5.5")
    window.location.hash = '/batchAddBuildingOne'
  }
  function handlePaginationChange(page, size){
    const param = {...params,page};
    reload(param)
  }

  // 各搜索项列表获取
  function selectChange (mark, val) {
    //form.resetFields(['unit', 'building']);
    //console.log(mark, val,'lll')
    if (mark === 'group') {
      form.resetFields(['unit', 'building']);
      let groupId;
      groupData.map((item,index)=>{
        if(item.group_name === val){
          groupId=item.group_id
        }
      })
      dispatch({
        type: 'BuildingManagementModel/getBuildingList',
        payload:{
          group_id:groupId,
        },
        callBack:()=>{
          dispatch({
            type: 'BuildingManagementModel/concat',
            payload: {
              groupId:groupId,
            }
          })
        }
      })
    } else if (mark === 'building') {
      let buildingId;
      form.resetFields([ 'unit']);
      buildingData.map((item,index)=>{
        if(item.building_name === val){
          buildingId=item.building_id
        }
      })
      dispatch({
        type: 'BuildingManagementModel/getUnitList',
        payload:{
          building_id:buildingId,
          group_id:groupId,
        }
      })
    }
  }
  // 表格列配置
  const columns = [{
    title: '所属小区',
    dataIndex: 'community_name',
    key: 'community_name',
    render: noData,
  },{
    title: '苑/期/区',
    dataIndex: 'group_name',
    key: 'group_name',
    render: noData,
  }, {
    title: '幢号',
    dataIndex: 'building_name',
    key: 'building_name',
  }, {
    title: '单元',
    dataIndex: 'unit_name',
    key: 'unit_name',
  },{
    title: '操作',
    key: 'action3',
    render: (text, record) => {
      let link = `/editBuilding?unit_id=${record.unit_id}`;
      return (
        <span>
          {author('delete')?<Popconfirm title="确定要删除这个楼宇数据么？" onConfirm={removeInfo.bind(this, text)}>
            <a className="table-operating" style={{ marginLeft: '10px' }}>删除</a>
          </Popconfirm>:null}
          {author('edit')?<Link to={link} className="table-operating">编辑</Link>:null}
        </span>
      )

    },
  }];

  const pagination = {
    current: params.page,
    onChange: handlePaginationChange,
    total: parseInt(totals),
    showTotal: totals => `共${totals}条`,
    defaultCurrent: 1
  }
  return (
    <div>
      <Breadcrumb separator=">">
        <Breadcrumb.Item>小区管理</Breadcrumb.Item>
        <Breadcrumb.Item>楼宇管理</Breadcrumb.Item>
      </Breadcrumb>
      <Card className="section">
        <Form>
          {/* <Community form={form} allDatas={{ group: {label:'苑/期/区'}, building: {}, unit: {}}} /> */}
          <Col span={16}>
            <Col span={10}>
              <Form.Item label="苑\期\区：" style={{marginBottom: 20}} labelCol={{span: 7}} wrapperCol={{ span: 17 }}>
                {getFieldDecorator('group')(
                  <Select className="mr-5"
                    placeholder="苑\期\区"
                    showSearch={true}
                    notFoundContent="没有数据"
                    onChange={(val) => selectChange('group', val)}>
                    {groupData&&groupData.length>0?groupData.map((value, index) => {
                      return <Option key={index} value={value.group_name}>{value.group_name}</Option>
                    }):''}
                  </Select>)}
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item style={{marginBottom: 20}} wrapperCol={{ span: 24 }}>
                {getFieldDecorator('building')(
                  <Select className="select-100 mr-5"
                    placeholder="幢"
                    showSearch={true}
                    notFoundContent="没有数据"
                    onChange={(val) => selectChange('building', val)}>
                    {buildingData&&buildingData.length>0?buildingData.map((value, index) => {
                      return <Option key={index} value={value.building_name}>{value.building_name}</Option>
                    }):''}
                  </Select>)}
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item style={{marginBottom: 20}} wrapperCol={{ span: 24 }}>
                {getFieldDecorator('unit')(
                  <Select className="select-100 mr-5"
                    placeholder="单元"
                    showSearch={true}
                    notFoundContent="没有数据"
                    onChange={(val) => selectChange('unit', val)}>
                    {unitData&&unitData.length>0?unitData.map((value, index) => {
                      return <Option key={index} value={value.unit_name}>{value.unit_name}</Option>
                    }):''}
                  </Select>)}
              </Form.Item>   
            </Col>
          </Col>
          <Col span={4} offset={2}>
            <Button onClick={handSearch} type="primary">搜索</Button>
            <Button onClick={handReset} className="ml1">重置</Button>
          </Col>
        </Form>
      </Card>
      <Card>
        {author('add')?<Link to="/addBuilding"><Button type="primary">新增楼宇</Button></Link>:null}
        {author('batchAdd')?<Button onClick={batchAdd} type="primary" className="ml1">批量新增楼宇</Button>:null}
        <Table
          dataSource={list}
          columns={columns}
          loading={loading}
          rowKey={record => record.unit_id}
          pagination={pagination}
          style={{marginTop: "10px"}}
        />
      </Card>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    ...state.BuildingManagementModel,
    loading: state.loading.models.BuildingManagementModel,
  };
}
export default connect(mapStateToProps)(Form.create()(BuildingManagement));

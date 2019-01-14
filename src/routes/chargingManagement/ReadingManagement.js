import React from 'react'
import {Breadcrumb,Card,Button,Modal,Table,Form,Popconfirm,DatePicker,Tabs} from 'antd';
import { connect } from 'dva';
import { Link } from 'react-router-dom';
import { author, getCommunityId } from '../../utils/util';
import Modals from './components/readingManage/Modals.js'
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
let columnsList = {
  period:'抄表周期',
  meter_time:'本次抄表时间',
  status_msg:'对应状态',
}
let columns1List = {
  period_start:'账单开始时间',
  period_end:'账单结束时间',
  status_msg:'对应状态',
}
let columns1 = [];
let columns2 = [];
function pushColumns(obj={},target){
  for (let k in obj) {
    target.push({
      title: obj[k],
      dataIndex: k,
      key: k
    })
  }
}
pushColumns(columnsList, columns1);
pushColumns(columns1List, columns2); 
function ReadingManagement(props){
  const {dispatch,list,loading,totals,current,form,info,dadaId,modalShow,period_start,period_end,curTabPaneKey,visitShow,is_reset} = props;
  const {getFieldDecorator,} = form;
  if (is_reset == true) {
    form.resetFields();
    dispatch({
      type: 'ReadingManagementModel/concat',
      payload: {
        is_reset: false,
      }
    });
  }
  function pageChange(index){
    dispatch({
      type:"ReadingManagementModel/concat",
      payload:{
        current:index
      }
    })
    if(curTabPaneKey==='1'||curTabPaneKey==='2'){
      dispatch({
        type:"ReadingManagementModel/getMeterReadingList",
        payload:{
          community_id: getCommunityId(),
          type:curTabPaneKey,
          page: index,
          row: 10,
        }
      })
    }else if(curTabPaneKey==='3'){
      dispatch({
        type:"ReadingManagementModel/sharedPeriodList",
        payload:{
          community_id: getCommunityId(),
          page: index,
          rows: 10,
        }
      })
    }
  }
  function editInfo(record){
    dispatch({
      type: 'ReadingManagementModel/sharedPeriodShow',
      payload: {id:record.id},
      callBack(data){
        dispatch({
          type: 'ReadingManagementModel/concat',
          payload: {
            modalShow:true,
            period_end:data.period_end,
            period_start:data.period_start
          },
        });
      }
    });
    props.form.resetFields();
  }
  function removeInfo(record){
    let parm = {
      id:record.id
    }
    dispatch({
      type: 'ReadingManagementModel/sharedPeriodDelete',
      payload: parm,
      callBack(){
        dispatch({
          type: 'ReadingManagementModel/sharedPeriodList',
          payload: {community_id:getCommunityId(),},
        });
      }
    });
  }
  function removeInfo1(record){
    let parm = {
      id:record.id
    }
    dispatch({
      type: 'ReadingManagementModel/meterReadingDelete',
      payload: parm,
      callBack(){
        dispatch({
          type: 'ReadingManagementModel/getMeterReadingList',
          payload: {community_id:getCommunityId(),type:curTabPaneKey},
        });
      }
    });
  }
  function pushLink(record){
    props.history.push(`/loggingData?id=${record.id}`)
  }
  function addModal(e){
    if(e==="1"){
      dispatch({
        type: 'ReadingManagementModel/concat',
        payload: {info:'',dadaId:'',period_end:'',period_start:'',modalShow:true},
      });
    }else if(e==="2"){
      dispatch({
        type: 'ReadingManagementModel/concat',
        payload: {visitShow:true},
      });
    }
    props.form.resetFields();
  }
  function PooledType(values){
    dispatch({
      type: 'ReadingManagementModel/concat',
      payload: {curTabPaneKey: values,current:1}
    });
    if(values==='1'||values==='2'){
      dispatch({
        type: 'ReadingManagementModel/getMeterReadingList',
        payload: {community_id: getCommunityId(),type:values,page:1,row:10}
      });
    }else if(values==='3'){
      dispatch({
        type: 'ReadingManagementModel/sharedPeriodList',
        payload: {community_id: getCommunityId(),page:1,rows:10}
      });
    }
  }
  function handleOk(){
    props.form.validateFields(['period_start','period_end'],(errors, values)=>{
      if(errors){
        return;
      }
      if(dadaId){
        let param1 = {
          id:dadaId,
          community_id:getCommunityId(),
          period_end:period_end?period_end:info.period_end,
          period_start:period_start?period_start:info.period_start,
        }
        dispatch({
          type: 'ReadingManagementModel/electrictReadingEdit',
          payload:param1,
          callBack(){
            dispatch({
              type: 'ReadingManagementModel/sharedPeriodList',
              payload: {community_id:getCommunityId(),},
            });
          }
        })
      }else{
        let param = {
          community_id:getCommunityId(),
          period_end:period_end,
          period_start:period_start
        }
        dispatch({
          type: 'ReadingManagementModel/electrictReadingAdd',
          payload:param,
          callBack(){
            dispatch({
              type: 'ReadingManagementModel/sharedPeriodList',
              payload: {community_id:getCommunityId(),},
            });
          }
        })
      }
    })
  }
  function handleCancel(){
    dispatch({
      type: 'ReadingManagementModel/concat',
      payload: {modalShow:false},
    });
  }
  function onChange(value, dateString){
    dispatch({
      type: 'ReadingManagementModel/concat',
      payload: {period_start:dateString},
    });
  }
  function onChange1(value, dateString){
    dispatch({
      type: 'ReadingManagementModel/concat',
      payload: {period_end:dateString},
    });
  }
  function status(status){
    localStorage.setItem(status,"status")
  }
  let columns3=curTabPaneKey==='1'||curTabPaneKey==='2'?columns1:columns2
  const columns = [...columns3, {
    title: '操作',
    dataIndex: 'operation',
    render: (text, record) => {
      let iLink = `/loggingData?id=${record.id}`;
      let aLink = `/meterReadingSystem?id=${record.id}&type=${curTabPaneKey}`;
      return <div>
        {curTabPaneKey==='3'?<div>
          {record.status === "1"?<span>
            {author('edit') ? <a onClick={editInfo.bind(this,record)}>编辑</a> : null}
            {author('delete') ? <Popconfirm title="确定要删除么？" okText="确认" cancelText="取消" onConfirm={removeInfo.bind(this, record)}>
              <a style={{marginLeft:"10px"}} href="#">删除</a>
            </Popconfirm> : null}
            {author('enteringData') ? <a onClick={pushLink.bind(this,record)} style={{marginLeft:"10px"}}>录入数据</a> : null}
          </span>:""}
          {record.status === "2"?<span>
            {author('edit') ? <a onClick={editInfo.bind(this,record)}>编辑</a> : null}
            {author('delete') ? <Popconfirm title="确定要删除么？" okText="确认" cancelText="取消" onConfirm={removeInfo.bind(this, record)}>
              <a style={{marginLeft:"10px"}} href="#">删除</a>
            </Popconfirm> : null}
            {author('enteringData') ? <Link to={iLink+"&status="+"2"}>录入数据</Link> : null}
          </span>:""}
          {record.status === "3" && author('details') ? <Link onClick={status.bind(this,status)} to={iLink+"&status="+"3"}>查看数据</Link> : null}
        </div>:<div>
          {author('delete')&&record.status==="1" ? <Popconfirm title="确定要删除么？" okText="确认" cancelText="取消" onConfirm={removeInfo1.bind(this, record)}>
            <a href="#">删除</a>
          </Popconfirm> : null}
          {author('enteringData') ? <Link to={aLink} style={{marginLeft:"10px"}}>查看</Link> : null}
        </div>}
      </div>
    }
  }];
  const PaginationProps = {
    total: Number(totals),
    defaultPageSize: 10,
    current: current,
    onChange: pageChange.bind(this),
    showTotal: (total) => `共有 ${Number(totals)} 条`,
  }
  return(
    <div className="page-content">
      <Breadcrumb separator=">">
        <Breadcrumb.Item>收费管理</Breadcrumb.Item>
        <Breadcrumb.Item>抄表管理</Breadcrumb.Item>
      </Breadcrumb>
      <Card>
        <Tabs style={{width:"100%",paddingBottom:"20px"}}
          className="left"
          activeKey={curTabPaneKey}
          onChange={PooledType.bind(this)}>
          <TabPane tab="独立水表" key="1" type="card">
          </TabPane>
          <TabPane tab="独立电表" key="2" type="card">
          </TabPane>
          <TabPane tab="公摊项目" key="3" type="card">
          </TabPane>
        </Tabs>
        {curTabPaneKey==='1'||curTabPaneKey==='2'?
          author('add')?<Button type="primary" className="margin-bottom15" onClick={addModal.bind(this,'2')}>新增</Button>:null
          :
          author('add')?<Button type="primary" className="margin-bottom15" onClick={addModal.bind(this,'1')}>新增账期</Button>:null
        }
        <Modals form={form} dispatch={dispatch} curTabPaneKey={curTabPaneKey} visitShow={visitShow} />
        <Modal
          title={dadaId?"编辑账期":"新增账期"}
          visible={modalShow}
          maskClosable={true}
          onOk={handleOk.bind(this,1)}
          onCancel={handleCancel.bind(this,1)}
          closable={true}
          okText="确认"
          cancelText="取消"
        >
          <Form>
            <FormItem {...formItemLayout} label="账期开始时间 : ">
              {getFieldDecorator('period_start',{rules:[{required: true,message: '请选择开始时间'}],initialValue:info?moment(info.period_start):null})(
                <DatePicker
                  format="YYYY-MM-DD"
                  placeholder="开始时间"
                  onChange={onChange.bind(this)}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="账期结束时间 : ">
              {getFieldDecorator('period_end',{rules:[{required: true,message: '请选择结束时间'}],initialValue:info?moment(info.period_end):null})(
                <DatePicker
                  format="YYYY-MM-DD"
                  placeholder="结束时间"
                  onChange={onChange1.bind(this)}
                />
              )}
            </FormItem>
          </Form>
        </Modal>
        <Table  dataSource={list} loading={loading} columns={columns} rowKey={record => record.id} pagination={PaginationProps} />
      </Card>
    </div>
  )
}
function mapStateToProps(state) {
  return {
    //ReadingManagementModel: state.ReadingManagementModel,
    ...state.ReadingManagementModel,
    loading:state.loading.models.ReadingManagementModel
  }
}
export default connect(mapStateToProps)(Form.create()(ReadingManagement));

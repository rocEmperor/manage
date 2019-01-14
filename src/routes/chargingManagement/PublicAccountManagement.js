import React from 'react'
import {Breadcrumb,Card,Button,Modal,Table,Form,Popconfirm,DatePicker} from 'antd';
import { connect } from 'dva';
import { Link } from 'react-router-dom';
import { author, getCommunityId } from '../../utils/util'
const FormItem = Form.Item;
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
function PublicAccountManagement(props){
  const {dispatch,list,loading,totals,current,form,info,dadaId,modalShow,period_start,period_end} = props;
  const {getFieldDecorator,} = form;
  function pageChange(index){
    dispatch({
      type:"PublicAccountManagementModel/concat",
      payload:{
        current:index
      }
    })
    dispatch({
      type:"PublicAccountManagementModel/sharedPeriodList",
      payload:{
        community_id: getCommunityId(),
        page: index,
        rows: 10,
      }
    })
  }
  function editInfo(record){
    dispatch({
      type: 'PublicAccountManagementModel/sharedPeriodShow',
      payload: {id:record.id},
      callBack(data){
        dispatch({
          type: 'PublicAccountManagementModel/concat',
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
      type: 'PublicAccountManagementModel/sharedPeriodDelete',
      payload: parm,
      callBack(){
        dispatch({
          type: 'PublicAccountManagementModel/sharedPeriodList',
          payload: {community_id:getCommunityId(),},
        });
      }
    });
  }
  function pushLink(record){
    props.history.push(`/publicAccountManagementViewData?id=${record.id}`)
  }
  function addModal(){
    dispatch({
      type: 'PublicAccountManagementModel/concat',
      payload: {info:'',dadaId:'',period_end:'',period_start:'',modalShow:true},
    });
    props.form.resetFields();
  }
  function handleOk(){
    props.form.validateFields((errors, values)=>{
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
          type: 'PublicAccountManagementModel/electrictReadingEdit',
          payload:param1,
          callBack(){
            dispatch({
              type: 'PublicAccountManagementModel/sharedPeriodList',
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
          type: 'PublicAccountManagementModel/electrictReadingAdd',
          payload:param,
          callBack(){
            dispatch({
              type: 'PublicAccountManagementModel/sharedPeriodList',
              payload: {community_id:getCommunityId(),},
            });
          }
        })
      }
    })
  }
  function handleCancel(){
    dispatch({
      type: 'PublicAccountManagementModel/concat',
      payload: {modalShow:false},
    });
  }
  function onChange(value, dateString){
    dispatch({
      type: 'PublicAccountManagementModel/concat',
      payload: {period_start:dateString},
    });
  }
  function onChange1(value, dateString){
    dispatch({
      type: 'PublicAccountManagementModel/concat',
      payload: {period_end:dateString},
    });
  }
  function status(status){
    localStorage.setItem(status,"status")
  }
  const columns = [{
    title: '账单开始时间',
    dataIndex: 'period_start',
    key:'period_start',
  }, {
    title: '账单结束时间',
    dataIndex: 'period_end',
    key:'period_end',
  }, {
    title: '对应状态',
    dataIndex: 'status_msg',
    key:'status_msg',
  }, {
    title: '操作',
    dataIndex: 'operation',
    render: (text, record) => {
      let iLink = `/publicAccountManagementViewData?id=${record.id}`;
      return <div>
        {record.status == "1"?<span>
          {author('edit') ? <a onClick={editInfo.bind(this,record)}>编辑</a> : null}
          {author('delete') ? <Popconfirm title="确定要删除么？" okText="确认" cancelText="取消" onConfirm={removeInfo.bind(this, record)}>
            <a style={{marginLeft:"10px"}} href="#">删除</a>
          </Popconfirm> : null}
          {author('enteringData') ? <a onClick={pushLink.bind(this,record)} style={{marginLeft:"10px"}}>录入数据</a> : null}
        </span>:""}
        {record.status == "2"?<span>
          {author('edit') ? <a onClick={editInfo.bind(this,record)}>编辑</a> : null}
          {author('delete') ? <Popconfirm title="确定要删除么？" okText="确认" cancelText="取消" onConfirm={removeInfo.bind(this, record)}>
            <a style={{marginLeft:"10px"}} href="#">删除</a>
          </Popconfirm> : null}
          {author('enteringData') ? <Link to={iLink+"&status="+"2"}>录入数据</Link> : null}
        </span>:""}
        {record.status == "3" && author('details') ? <Link onClick={status.bind(this,status)} to={iLink+"&status="+"3"}>查看数据</Link> : null}
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
        <Breadcrumb.Item>缴费管理</Breadcrumb.Item>
        <Breadcrumb.Item>公摊账期管理</Breadcrumb.Item>
      </Breadcrumb>
      <Card>
        <Button type="primary" className="margin-bottom15" onClick={addModal.bind(this)}>新增账期</Button>
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
    ...state.PublicAccountManagementModel
  }
}
export default connect(mapStateToProps)(Form.create()(PublicAccountManagement));

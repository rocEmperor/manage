import React from 'react';
import { connect } from 'dva';
import { Form, Row, Col, Button, Breadcrumb, Table, Popconfirm, Card, Input,Modal } from 'antd';
const FormItem = Form.Item;
import { noData,author } from '../../utils/util';
//import { getCommunityId } from '../../utils/util';
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

function AreaManagement(props) {
  const { dispatch,form,list,loading,params,totals,visible,info,id,is_reset } = props;
  const { getFieldDecorator } = form;
  if(is_reset == true){
    form.resetFields();
    dispatch({
      type: 'AreaManagementModel/concat',
      payload: {
        is_reset:false,
      }
    });
  }
  //console.log(id)
  
  /**
   * 查询表格数据
   * @param  {Object} params
   */
  function reload(params={}) {
    dispatch({
      type: 'AreaManagementModel/getList',
      payload: params,
    });
  }
  /** 
   * 搜索
  */
  function handleSubmit(){
    form.validateFields(['group'],(err,val)=>{
      const param = val;
      param.group_name = val.group;
      param.page = 1;
      param.rows = 10;
      delete param.group;
      reload(param)
    })
  }
  /** 
   * 重置
  */
  function handleReset(){
    form.resetFields(['group']);
    form.validateFields(['group'],(err,val)=>{
      const param = {
        page:1,
        rows:10,
        group_name:"",
      }
      reload(param)
    })
  }
  /** 
   * 分页
  */
  function handlePaginationChange(page){
    const param = {...params,page};
    reload(param)
  }
  /** 
   * 删除
  */
  function removeInfo(e){
    let param = {
      group_id:e.group_id
    }
    
    dispatch({
      type: 'AreaManagementModel/areaDelete',
      payload: param,
      callBack(){
        reload(params)
      }
    });
  }
  /** 
   *Modal显示@param 布尔
  */
  function showModal(){
    form.resetFields(['group_name','group_code']);
    dispatch({
      type:'AreaManagementModel/concat',
      payload:{
        visible:true,
        info:{},
        id:'',
      }
    })
  }
  /** 
   *新增，编辑
  */
  function handleOk(){
    form.validateFields(['group_name','group_code'],(err,val)=>{
      if(err){
        return;
      }
      if(id){
        let param = {
          group_id:id,
          group_code:val.group_code,
          group_name:val.group_name,
        }
        dispatch({
          type: 'AreaManagementModel/areaEdit',
          payload:param,
          callBack(){
            reload(params)
          }
        })
      }else{
        let param = {
          group_code:val.group_code,
          group_name:val.group_name
        }
        dispatch({
          type: 'AreaManagementModel/areaAdd',
          payload:param,
          callBack(){
            reload({
              page:1,
              rows:10,
              group_name:"",
            })
          }
        })
      }
    })

  }
  function editInfo(record){
    dispatch({
      type: 'AreaManagementModel/areaInfo',
      payload: {group_id:record.group_id},
      callBack(data){
        dispatch({
          type: 'AreaManagementModel/concat',
          payload: {
            visible:true,
            id:record.group_id,
          },
        });
      }
    });
    props.form.resetFields();
  }
  function handleCancel(){
    dispatch({
      type:'AreaManagementModel/concat',
      payload:{
        visible:false,
      }
    })
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
  },{
    title: '操作',
    key: 'action3',
    render: (text, record) => {
      return (
        <span>
          {author('delete')?<Popconfirm title="确定要删除这个区域数据么？" onConfirm={removeInfo.bind(this, text)}>
            <a className="table-operating" style={{ marginLeft: '10px' }}>删除</a>
          </Popconfirm>:null}
          {author('edit')?<a className="table-operating" onClick={editInfo.bind(this,record)}>编辑</a>:null}
        </span>
      )
    },
  }];
  const pagination={
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
        <Breadcrumb.Item>区域管理</Breadcrumb.Item>
      </Breadcrumb>
      <Card className="section">
        <Form>
          <Row>
            <Col span={6}>
              <Form.Item label="苑\期\区:" style={{ marginBottom: 20 }} labelCol={{ span: 8 }} wrapperCol={{ span: 15 }}>
                {getFieldDecorator('group',)(
                  <Input placeholder="请输入"/>)}
              </Form.Item>
            </Col>
            <Col span={5} offset={13}>
              <Button type="primary" className="mr1" onClick={handleSubmit}>查询</Button>
              <Button type="ghost" onClick={handleReset}>重置</Button>
            </Col>
          </Row>
        </Form>
      </Card>
      <Card>
        {author('add')?<Button type="primary" onClick={showModal}>新增区域</Button>:null}
        <Modal
          title={id?"编辑区域":"新增区域"}
          visible={visible}
          maskClosable={true}
          onOk={handleOk}
          onCancel={handleCancel}
          closable={true}
        >
          <Form>
            <FormItem {...formItemLayout} label="苑\期\区 : ">
              {getFieldDecorator('group_name',{rules:[{required: true,message: '请输入苑/期/区(15字以内)'}],initialValue:info?info.group_name:null})(
                <Input disabled={id?true:false} maxLength={15} placeholder="请输入苑/期/区（15字以内）"/>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="苑/期/区编码 : ">
              {getFieldDecorator('group_code',{rules:[{pattern:/^[0-9]\d*$/,message: '请输入苑/期/区编码(2位正整数以内)'}],initialValue:info?info.group_code:null})(
                <Input maxLength={2} placeholder="请输入苑/期/区编码(2位正整数以内)"/>
              )}
            </FormItem>
          </Form>
        </Modal>
        <Table
          dataSource={list}
          columns={columns}
          loading={loading}
          rowKey={record => record.group_id}
          pagination={pagination}
          style={{marginTop: "10px"}}
        />
      </Card>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    ...state.AreaManagementModel,
    loading: state.loading.models.AreaManagementModel,
  };
}
export default connect(mapStateToProps)(Form.create()(AreaManagement));

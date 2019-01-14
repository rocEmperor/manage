import React from 'react';
import { connect } from 'dva';
import { Form, Row, Col, Button, Breadcrumb, Table, Select, Card, Input, Modal } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import { Link } from 'react-router-dom';
import { noData } from '../../utils/util';
import Community from '../../components/Community/Community.js';
import { getCommunityId, author } from '../../utils/util';

function RightInfoChange(props) {
  let { dispatch, form, list, totals, params, loading, visible, selected,id, statusOption,is_reset } = props;
  if(is_reset == true){
    form.resetFields();
    dispatch({
      type: 'RightInfoChangeModel/concat',
      payload: {
        is_reset:false,
      }
    });
  }
  const { getFieldDecorator } = form;
  /**
   * 查询业主信息列表
   * @param  {Object} params
   */
  function reload(params){
    dispatch({
      type: 'RightInfoChangeModel/getList',
      payload: params,
    });
  }

  /**
   * 点击设置为已受理按钮
   * @param  {Object} record
   */
  function mark(record) {
    dispatch({
      type:'RightInfoChangeModel/concat',
      payload:{
        visible: true,
        id:record.id,
      }
    })
  }
  /**
   * 隐藏设置为已受理弹框
   */
  function hideModalVisible(){
    dispatch({
      type: 'RightInfoChangeModel/concat',
      payload:{
        visible:false,
      }
    });
  }
  /**
   * 查询
   */
  function handleSubmit(){
    form.validateFields((err, values) => {
      const param = values;
      param.page = 1;
      param.rows = 10;
      param.community_id = values.community_id || getCommunityId();
      reload(param);
    })
  }
  /**
   * 确认设置为已受理
   */
  function handleOk(e){
    form.validateFields((err, values) => {
      if(err){
        return;
      }
      dispatch({
        type:'RightInfoChangeModel/changerAccept',
        payload:{
          community_id:getCommunityId(),
          status:values.status_modal,
          remark:values.content,
          changer_id:id,
        }
      })
      dispatch({
        type: 'RightInfoChangeModel/concat',
        payload:{
          visible: false,
          selected:2
        }
      })
      form.resetFields();// 将表单里的数据清空
    });
  }
  /**
   * 发送短信提示
   * @param  {Object} record
   */
  function sendMsg(record){
    dispatch({
      type:'RightInfoChangeModel/changerSendMsg',
      payload:{
        changer_id:record.id
      }
    })
    dispatch({
      type:'RightInfoChangeModel/getList',
      payload:{
        community_id:getCommunityId(),
        page:1,
        row:10
      }
    })
  }
  /**
   * 监听处理结果
   * @param  {String} value
   * value = 2  已变更
   * value = 3  已驳回
   */
  function handleChange(value) {
    dispatch({
      type: 'RightInfoChangeModel/concat',
      payload:{
        selected:value
      }
    })
  }
  /**
   * 重置
   */
  function handleReset(){
    form.resetFields();
    form.validateFields((err, values) => {
      const param = {
        page:1,
        rows:10,
        community_id:getCommunityId(),
        name:"",
        group:"",
        building:"",
        unit:"",
        room:"",
        status:""
      }
      reload(param);
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
  }
  /**
   * 切换表格页码
   * @param  {Number} page
   */
  function handlePaginationChange(page, size){
    const param = {...params, page};
    reload(param);
  }
  // 布局
  const formItemLayout = {
    labelCol: {
      span: 6
    },
    wrapperCol: {
      span: 16
    },
  }
  // 表格分页配置
  const pagination = {
    current: params.page,
    onChange: handlePaginationChange,
    total: parseInt(totals),
    showTotal: totals => `共${totals}条`,
    defaultCurrent:1
  }
  // 表格列配置
  const columns = [{
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    render:noData,
  },{
    title: '手机号码',
    dataIndex: 'mobile',
    key: 'mobile',
    render:noData,
  }, {
    title: '对应房屋',
    dataIndex: 'address',
    key: 'address',
    render:noData,
  }, {
    title: '提交时间',
    dataIndex: 'created_at',
    key: 'created_at',
    render:noData,
  }, {
    title: '当前状态',
    dataIndex: 'status_desc',
    key: 'status_desc',
    render:noData,
  }, {
    title: '操作',
    dataIndex: 'desc',
    render: (text, record) => {
      return <div>
        {record.status==1
          ? author('accept') ? <a className="mr1" onClick={mark.bind(this,record)}>设置为已受理</a> : null
          : author('sendMessage') ? <a className="mr1" onClick={sendMsg.bind(this,record)}>发送短信提示</a> : null
        }
        {author('details') ? <Link to={`/changerView?id=${record.id}`}>查看详情</Link> : null}
      </div>
    }
  }];

  return (
    <div>
      <Breadcrumb separator=">">
        <Breadcrumb.Item>小区管理</Breadcrumb.Item>
        <Breadcrumb.Item>业主信息变更</Breadcrumb.Item>
      </Breadcrumb>
      <Card className="section">
        <Form>
          <Row>
            <Col span={6}>
              <FormItem label="住户" {...formItemLayout}>
                {getFieldDecorator('name')(
                  <Input type="text" placeholder="请输入姓名/手机号"/>
                )}
              </FormItem>
            </Col>
            <Community form={form} allDatas={{group:{},building:{},unit:{},room:{}}}/>
          </Row>
          <Row>
            <Col span={6}>
              <FormItem label="当前状态" {...formItemLayout}>
                {getFieldDecorator('status')(
                  <Select placeholder="请选择当前状态" notFoundContent="没有数据">
                    <Option value="">全部</Option>
                    {statusOption.map((value, index) => { return <Option key={index} value={value.key.toString()}>{value.value}</Option> })}
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
      <Card>
        <Table className="mt1" dataSource={list} columns={columns} loading={loading} rowKey={record => record.id} pagination={pagination}/>
      </Card>
      <Modal title="设置为已受理" visible={visible} onOk={handleOk.bind(this)} onCancel={hideModalVisible.bind(this)}>
        <Form>
          <Row>
            <Col className="mb1">
              <FormItem label="处理结果" {...formItemLayout}>
                {getFieldDecorator('status_modal',{
                  rules: [{ required: true, message: '请选择处理结果'}]
                })(
                  <Select placeholder="请选择处理结果" notFoundContent="没有数据" onChange={handleChange.bind(this)}>
                    <Option key="2" value="2">已变更</Option>
                    <Option key="3" value="3">已驳回</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            {selected == 3?
              <FormItem {...formItemLayout} label="驳回原因">
                {getFieldDecorator('content', {
                  rules: [{ required: true, message: '请输入驳回原因', whitespace: true }],
                })(
                  <Input type="textarea" maxLength={50} placeholder="请输入驳回原因" style={{lineHeight:"20px"}}/>
                )}
              </FormItem>:''
            }
          </Row>
        </Form>
      </Modal>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    ...state.RightInfoChangeModel,
    loading: state.loading.models.RightInfoChangeModel,
  };
}
export default connect(mapStateToProps)(Form.create()(RightInfoChange));

import React from 'react';
import { connect } from 'dva';
import { Form, Row, Col, Button, Breadcrumb, Table, Select, Card, Icon, Input } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import { Link } from 'react-router-dom';
import { noData } from '../../utils/util';
import Community from '../../components/Community/Community.js';
import ExImport from '../../components/ExImport/';
import { getCommunityId, author, download } from '../../utils/util';

function MeterReadingManager(props) {
  let { dispatch, form, list, totals, params, loading, visible,is_reset } = props;
  if(is_reset == true){
    form.resetFields();
    dispatch({
      type: 'MeterReadingManagerModel/concat',
      payload: {
        is_reset:false,
      }
    });
  }
  const { getFieldDecorator } = form;

  /**
   * 查询表格数据
   * @param  {Object} params
   */
  function reload(params){
    dispatch({
      type: 'MeterReadingManagerModel/getList',
      payload: params,
    });
  }

  /**
   * 显示批量导入弹框
   */
  function showModal(){
    dispatch({
      type: 'MeterReadingManagerModel/concat',
      payload:{
        visible:true
      }
    });
  }
  /**
   * 隐藏批量导入弹框
   */
  function hideModalVisible(){
    dispatch({
      type: 'MeterReadingManagerModel/concat',
      payload:{
        visible:false,
      }
    });
    handleReset()
  }
  /**
   * 查询
   */
  function handleSubmit(e){
    form.validateFields((err, values) => {
      const param = values;
      param.page = 1;
      param.rows = 10;
      param.community_id = values.community_id || getCommunityId();
      reload(param);
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
        community_id: values.community_id || getCommunityId(),
        meter_no:"",
        meter_status:"",
        group:"",
        building:"",
        unit:"",
        room:"",
      }
      reload(param);
    });
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
   */
  function handlePaginationChange(page,size){
    const param = {...params, page};
    reload(param);
  }
  /**
   * 批量导入中的下载模板
   */
  function downFiles() {
    dispatch({
      type: 'MeterReadingManagerModel/downFiles',
      payload: {
        "community_id": getCommunityId()
      },callback(data){
        download(data);
      }
    });
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
    title: '表身号',
    dataIndex: 'meter_no',
    key: 'meter_no',
    render: noData,
  }, {
    title: '对应房屋',
    dataIndex: 'address',
    key: 'address',
    render: noData,
  }, {
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
    title: '水表状态',
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
      let link = `/meterReadingAdd?id=${record.id}`;
      return <div>
        {author('edit') ? <Link to={link}>编辑</Link> : null}
      </div>
    }
  }];

  return (
    <div>
      <Breadcrumb separator=">">
        <Breadcrumb.Item>小区管理</Breadcrumb.Item>
        <Breadcrumb.Item>水表管理</Breadcrumb.Item>
      </Breadcrumb>
      <Card className="section">
        <Form>
          <Row justify="start">
            <Col span={6}>
              <FormItem label="表身号" {...formItemLayout}>
                {getFieldDecorator('meter_no')(
                  <Input placeholder="表身号"/>
                )}
              </FormItem>
            </Col>
            <Community form={form} allDatas={{group:{},building:{},unit:{},room:{}}}/>
          </Row>
          <Row>
            <Col span={6}>
              <FormItem label="水表状态" {...formItemLayout}>
                {getFieldDecorator('meter_status')(
                  <Select className="select-150 mr-5" placeholder="请选择水表状态" notFoundContent="没有数据">
                    <Option value="">全部</Option>
                    <Option value="1">正常</Option>
                    <Option value="2">损坏</Option>
                    <Option value="3">停用</Option>
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
        {author('add') ? <Link to="/meterReadingAdd"><Button type="primary"><Icon type="plus" />新增水表</Button></Link> : null}
        {author('batchLeadingIn') ? <Button type="primary" style={{marginLeft:'10px'}} onClick={showModal.bind(this)}>批量导入</Button> : null}
        <ExImport id={'communitys'}
          visible={visible}
          callback={hideModalVisible.bind(this)}
          downUrl={downFiles.bind(this)}
          importUrl="/property/water/import"/>
        <Table className="mt1" dataSource={list} columns={columns} loading={loading} rowKey={record => record.id} pagination={pagination}/>
      </Card>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    ...state.MeterReadingManagerModel,
    loading: state.loading.models.MeterReadingManagerModel,
  };
}
export default connect(mapStateToProps)(Form.create()(MeterReadingManager));

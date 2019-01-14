import React from 'react';
import { connect } from 'dva';
import { Link } from 'react-router-dom';
import {Table, Breadcrumb, Card, Button, Select, Form, Row, Col, } from 'antd';
import './index.css';
// import moment from 'moment';
const FormItem = Form.Item;
const Option = Select.Option;
import Community from '../../components/Community/Community.js';
import ExImport from '../../components/ExImport/';
import { author } from '../../utils/util';

function BillManage(props) {
  const { form, dispatch,is_reset, costType, data, totals, params, reportData, visible1, visible2, typeOption, loading } = props;
  const {getFieldDecorator,} = form;
  const {total_amount,pay_amount,prefer_amount,collection_amount,general_amount} = reportData;
  if (is_reset == true) {
    form.resetFields();
    dispatch({
      type: 'BillManagementModel/concat',
      payload: {
        is_reset: false,
      }
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
   * reload for pageChange search reset
   * @param {object} params
   */
  function reload(params){
    dispatch({
      type: 'BillManagementModel/getBillList',
      payload: params,
    });
  }
  /**
   * reset
   * 搜索项及列表重置为默认数据
   */
  function handleReset(){
    form.resetFields();
    form.validateFields((err, values) => {
      const param = {
        page:1,
        rows:10,
        community_id: sessionStorage.getItem("communityId"),
        group:[],
        unit:[],
        room:[],
        building:[],
        year:"",
        costList:"",
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
   * search
   * 数据检索
   */
  function handSearch(){
    form.validateFields((err, values) => {
      let arr = [];
      costType.map(item=>{
        if(values.costList != undefined){
          values.costList.map(items=>{
            if(items == item.label){
              arr.push(item.key);
            }
          })
        }
      })
      const param = values;
      param.page = 1;
      param.rows = 10;
      param.costList = arr;
      param.community_id = sessionStorage.getItem("communityId");
      reload(param);
    })
  }
  /**
   * pageChange
   * 修改分页并更新列表数据
   * @param {number} page
   */
  function pageChange(page){
    const param = {...params, page};
    reload(param);
  }
  function handleGenerateBill(){
    location.href = '#/generateBill'
    //props.localtion.pathname = "generateBill/step1"
  }
  function handleImport(type){
    dispatch({
      type: 'BillManagementModel/concat',
      payload: {
        visible2: type == 1 ? false : true,
        visible1: type == 1 ? true : false
      }
    });
  }
  function hideModalVisible() {
    dispatch({
      type: 'BillManagementModel/concat',
      payload: {
        visible2: false,
        visible1: false
      }
    });
    handleReset();
  }
  function downFiles() {
    dispatch({
      type: 'BillManagementModel/downFiles',
      payload: {
        community_id: sessionStorage.getItem("communityId")
      }
    });
  }
  function downFilesMore() {
    dispatch({
      type: 'BillManagementModel/downFilesMore',
      payload: {
        community_id: sessionStorage.getItem("communityId")
      }
    });
  }
  function handleExport(){
    dispatch({
      type: 'BillManagementModel/export',
      payload: params,
    });
  }
  const columns = [
    {
      title: '房屋信息',
      dataIndex: 'room_msg',
      key: 'room_msg',
    },{
      title: '应缴金额（元）',
      dataIndex: 'bill_entry_amount',
      key: 'bill_entry_amount',
    }, {
      title: '已缴金额（元）',
      dataIndex: 'paid_entry_amount',
      key: 'paid_entry_amount',
    }, {
      title: '优惠金额（元）',
      dataIndex: 'prefer_entry_amount',
      key: 'prefer_entry_amount',
    }, {
      title: '欠费金额（元）',
      dataIndex: 'owe_entry_amount',
      key: 'owe_entry_amount',
    },{
      title: '操作',
      key: 'action3',
      dataIndex: '',
      render: (text, record, index) => {
        return (
          <span>
            {
              author('details')?<Link to={`/billsView?id=${record.room_id}&year=${params.year}&costList=${params.costList}`} className="mr1">查看详情</Link>:null
            }
            {
              author('add')?<Link to={`/billsAdd?id=${record.room_id}`}>新增账单</Link>:null
            }
          </span>
        )
      }
    }];
  const PaginationProps = {
    current: params.page,
    onChange: pageChange,
    total: parseInt(totals),
    showTotal: totals => `共${totals}条`,
    defaultCurrent:1,
    defaultPageSize: 10,
  }
  const formItem = {labelCol: {span: 6},wrapperCol: {span: 16}};
  return (
    <div>
      <Breadcrumb separator=">">
        <Breadcrumb.Item>收费管理</Breadcrumb.Item>
        <Breadcrumb.Item>账单管理</Breadcrumb.Item>
      </Breadcrumb>
      <Card className="section">
        <Form>
          <Row>
            <Community form={form} allDatas={{group:{},building:{},unit:{},room:{}}}/>
            <Col span={6}>
              <FormItem label="时间段" {...formItem}>
                {getFieldDecorator('year')(
                  <Select placeholder="请选择时间段">
                    <Option key="0" value="2015">2015</Option>
                    <Option key="1" value="2016">2016</Option>
                    <Option key="2" value="2017">2017</Option>
                    <Option key="3" value="2018">2018</Option>
                    <Option key="4" value="2019">2019</Option>
                    <Option key="5" value="2020">2020</Option>
                  </Select>)
                }
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <FormItem label="收费项目" {...formItem}>
                {getFieldDecorator('costList', )(
                  <Select mode="multiple" placeholder="请选择收费项目">
                    {costType.map((value, index) => {
                      return <Option key={value.key} value={value.label}>{value.label}</Option>
                    })}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={5} offset={1} className="fr">
              <Button type="primary" onClick={handSearch.bind(this)}>查询</Button>
              <Button className="ml1" type="ghost" onClick={handleReset.bind(this)}>重置</Button>
            </Col>
          </Row>
        </Form>
      </Card>
      <Row className="mb1">
        <Col span={24}>
          <Card>
            <div className="bill_nums">
              <Link to={`/billsType?type=1&group=${params.group}&building=${params.building}&unit=${params.unit}&room=${params.room}&year=${params.year}&costList=${params.costList}`}>
                <dl><dt>应收账单</dt><dd><span style={{marginRight:'15px'}}>账单：{total_amount?total_amount.number:0}</span> 账单金额：{total_amount?total_amount.money:0}</dd></dl>
              </Link>
              <Link to={`/billsType?type=2&group=${params.group}&building=${params.building}&unit=${params.unit}&room=${params.room}&year=${params.year}&costList=${params.costList}`}>
                <dl><dt>已收账单</dt><dd><span style={{marginRight:'15px'}}>账单：{pay_amount?pay_amount.number:0}</span>账单金额：{pay_amount?pay_amount.money:0}</dd></dl>
              </Link>
              <Link to={`/billsType?type=3&group=${params.group}&building=${params.building}&unit=${params.unit}&room=${params.room}&year=${params.year}&costList=${params.costList}`}>
                <dl><dt>优惠账单</dt><dd><span style={{marginRight:'15px'}}>账单：{prefer_amount?prefer_amount.number:0}</span>账单金额：{prefer_amount?prefer_amount.money:0}</dd></dl>
              </Link>
              <Link to={`/billsType?type=4&group=${params.group}&building=${params.building}&unit=${params.unit}&room=${params.room}&year=${params.year}&costList=${params.costList}`}>
                <dl><dt>待收账单</dt><dd><span style={{marginRight:'15px'}}>账单：{collection_amount?collection_amount.number:0}</span>账单金额：{collection_amount?collection_amount.money:0}</dd></dl>
              </Link>
              <Link to={`/billsType?type=5&group=${params.group}&building=${params.building}&unit=${params.unit}&room=${params.room}&year=${params.year}&costList=${params.costList}`}>
                <dl className="last"><dt>待生成账单</dt><dd><span style={{marginRight:'15px'}}>账单：{general_amount?general_amount.number:0}</span>账单金额：{general_amount?general_amount.money:0}</dd></dl>
              </Link>
            </div>
          </Card>
        </Col>
      </Row>
      <Card className="section">
        <div className="btn-group-left">
          {
            author('generatingBill')?<Button className="mr1" type="primary" onClick={handleGenerateBill.bind(this)}>生成账单</Button>:null
          }

          <ExImport
            id={'billManage'}
            visible={visible1}
            callback={hideModalVisible.bind(this)}
            importUrl="/property/alipay-cost/bill-import"
            downUrl={downFiles.bind(this)}
          />
          <ExImport
            id={'billmanageMore'}
            visible={visible2}
            callback={hideModalVisible.bind(this)}
            importUrl="/property/alipay-cost/bill-batch-import"
            downUrl={downFilesMore.bind(this)}
            list={typeOption}
          />
          {
            author('leadingInBill')?<Button className="mr1" onClick={handleImport.bind(this,1)}>导入账单</Button>:null
          }
          {
            author('batchReceipts')?<Button className="mr1" onClick={handleImport.bind(this,2)}>批量收款</Button>:null
          }
          {
            author('exportBill')?<Button className="mr1" onClick={handleExport.bind(this)}>导出账单</Button>:null
          }

        </div>
        <Table className="mt1"  loading={loading} columns={columns} dataSource={data} pagination={PaginationProps} rowKey={record => record.room_id} />
      </Card>
    </div>
  )
}

function mapStateToProps(state) {
  return {
    ...state.BillManagementModel,
    loading: state.loading.models.BillManagementModel
  }
}
export default connect(mapStateToProps)(Form.create()(BillManage));

import React from 'react';
import { connect } from 'dva';
import { Form, Row, Col, Button, Breadcrumb, Select, Card, Icon, Input, Tabs } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
import { Link } from 'react-router-dom';
import { download } from '../../utils/util';
import Community from '../../components/Community/Community.js';
import ExImport from '../../components/ExImport/';
import AlreadySettleInList from './Components/ResidentsManageLists/AlreadySettleInList'
import CheckPending from './Components/ResidentsManageLists/CheckPendingList';
import AlreadySettleOutList from './Components/ResidentsManageLists/AlreadySettleOutList';
import Failed from './Components/ResidentsManageLists/FailedList';
import { getCommunityId, author } from '../../utils/util';

function ResidentsManage(props) {
  let { dispatch, form, totals, params, loading, is_reset, visible, visible1, identity_type,
    labelType, curTab, settleInList, checkPendingList, settleOutList, failedList } = props;
  const { getFieldDecorator } = form;
  if(is_reset == true){
    form.resetFields();
    dispatch({
      type: 'ResidentsManageModel/concat',
      payload: {
        is_reset:false,
      }
    });
  }
  /**
   * 查询表格数据 --- 已迁入/已迁出
   * @param  {Object} params
   */
  function reload(params, listType){
    dispatch({
      type: 'ResidentsManageModel/getList',
      payload: params,
      listType: listType
    });
  }
  /**
   * 查询表格数据 --- 待审核/未通过
   * @param  {Object} params
   */
  function reloadOther(params, listType){
    dispatch({
      type: 'ResidentsManageModel/getListOther',
      payload: params,
      listType: listType
    });
  }
  /**
   * 导出文件
   */
  function handleExport() {
    form.validateFields((err, values) => {
      let param = values;
      param.community_id = getCommunityId();
      dispatch({
        type: 'ResidentsManageModel/residentsExport',
        payload: param,
        callback(data){
          download(data);
        }
      });
    });
  }
  /**
   * 显示批量导入弹框
   */
  function showModal(val){
    if(val == 1){
      dispatch({
        type: 'ResidentsManageModel/concat',
        payload: {
          visible: true
        }
      });
    }else{
      dispatch({
        type: 'ResidentsManageModel/concat',
        payload: {
          visible1: true
        }
      });
    }
  }
  /**
   * 隐藏批量导入弹框
   */
  function hideModalVisible(){
    dispatch({
      type: 'ResidentsManageModel/concat',
      payload:{
        visible:false,
        visible1:false
      }
    });
    handleReset()
  }
  /**
   * 查询
   */
  function handleSubmit(e) {
    form.validateFields(['name', 'identity_type', 'status', 'user_label_id', 'group', 'unit', 'building','room'],(err, values) => {
      if (curTab === 'Failed' || curTab === 'CheckPending') {
        values.user_label_id = undefined;
        values.status = undefined;
      }
      const param = values;
      param.page = 1;
      param.rows = 10;
      param.community_id = values.community_id || getCommunityId();
      reqList(param, curTab)
    })
  }
  /**
   * 重置
   */
  function handleReset(){
    form.resetFields();
    form.validateFields(['name', 'identity_type', 'status', 'user_label_id', 'group', 'unit', 'building', 'room'],(err, values) => {
      const param = {
        page:1,
        rows:10,
        community_id: getCommunityId(),
        name: undefined,
        group: undefined,
        unit: undefined,
        building: undefined,
        room: undefined,
        identity_type: undefined,
        status: undefined,
        user_label_id: undefined,
      };
      reqList(param, curTab)
    });
    const params = {
      unitData:[],
      roomData:[],
      buildingData:[],
    };
    dispatch({
      type: 'CommunityModel/concat',
      payload: params
    });
  }
  /**
   * 批量导入中的下载模板
   */
  function downFiles() {
    dispatch({
      type: 'ResidentsManageModel/downFiles',
      payload: {
        "community_id": getCommunityId()
      },callback(data){
        download(data);
      }
    });
  }
  function reqList (param, key) {
    if (key === 'Failed' || key === 'CheckPending') {
      if (!param.status) {
        if (key === 'Failed') {
          param.status = '2'
        } else if (key === 'CheckPending') {
          param.status = '0'
        }
      }
      reloadOther(param, param.status);
    } else {
      if (!param.move_status) {
        if (key === 'AlreadySettleIn') {
          param.move_status = '1';
        } else if (key === 'AlreadySettleOut') {
          param.move_status = '2';
        }
      }
      reload(param, param.move_status);
    }
  }
  /*
  * 监听tab组件切换
  * */
  function tabChange(key) {
    dispatch({
      type: 'ResidentsManageModel/concat',
      payload: { curTab: key }
    });
    form.resetFields();
    let param = {};
    param.group = undefined;
    param.unit = undefined;
    param.room = undefined;
    param.name = undefined;
    param.identity_type = undefined;
    param.label_type = undefined;
    param.type = undefined;
    param.building = undefined;
    param.status = undefined;
    param.page = 1;
    param.rows = 10;
    param.community_id = getCommunityId();
    reqList(param, key)
  }
  // 布局
  const formItemLayout = {
    labelCol: {
      span: 6
    },
    wrapperCol: {
      span: 16
    },
  };
  return (
    <div>
      <Breadcrumb separator=">">
        <Breadcrumb.Item>小区管理</Breadcrumb.Item>
        <Breadcrumb.Item>住户管理</Breadcrumb.Item>
      </Breadcrumb>
      <Card className="section">
        <Form>
          <Row>
            <Col span={6}>
              <FormItem label="住 户" {...formItemLayout}>
                {getFieldDecorator('name')(
                  <Input placeholder="请输入姓名/手机号码"/>
                )}
              </FormItem>
            </Col>
            <Community form={form} allDatas={{group:{},building:{},unit:{},room:{}}}/>
          </Row>
          <Row>
            <Col span={6}>
              <FormItem label="身 份：" {...formItemLayout}>
                {getFieldDecorator('identity_type')(
                  <Select className="select-150 mr-5" placeholder="请选择身份" notFoundContent="没有数据">
                    <Option value="">全部</Option>
                    {identity_type.map((value, index) => {
                      return <Option key={index} value={value.key.toString()}>{value.value}</Option>
                    })}
                  </Select>
                )}
              </FormItem>
            </Col>
            {curTab !== 'AlreadySettleIn'
              ? null
              : <Col span={6}>
                <FormItem label="认证状态" {...formItemLayout}>
                  {getFieldDecorator('status')(
                    <Select className="select-100 mr-5"  placeholder="请选择认证状态">
                      <Option value="">全部</Option>
                      <Option value="1">未认证</Option>
                      <Option value="2">已认证</Option>
                      {/*<Option value="3">已失效</Option>*/}
                    </Select>
                  )}
                </FormItem>
              </Col> }
            {curTab !== 'CheckPending' && curTab !== 'Failed'
              ? <Col span={6}>
                <FormItem label="住户标签：" {...formItemLayout}>
                  {getFieldDecorator('user_label_id')(
                    <Select
                      optionFilterProp="children"
                      showSearch
                      mode="multiple"
                      placeholder="请选择住户标签"
                    >
                      {labelType ? labelType.map((item) => {
                        return <Option key={item.id} value={item.id}>{item.name}</Option>
                      }) : null}
                    </Select>
                  )}
                </FormItem>
              </Col>
              : null}
            <Col style={{float: 'right', paddingRight: '3%'}}>
              <Button type="primary" className="mr1" onClick={handleSubmit}>查询</Button>
              <Button type="ghost" onClick={handleReset}>重置</Button>
            </Col>
          </Row>
        </Form>
      </Card>
      <Card>
        <Tabs activeKey={curTab} onChange={(val) => tabChange(val)} size="large">
          <TabPane tab="已迁入" key="AlreadySettleIn" forceRender={false}>
            {/*<div style={{marginBottom: 6}}>共 {totals} 条数据</div>*/}
            {author('add') ? <Link to="/residentsAdd"><Button type="primary"><Icon type="plus" />新增住户</Button></Link> : null}
            {author('batchLeadingIn') ? <Button type="primary" style={{marginLeft:'10px'}} onClick={showModal.bind(this,1)}>批量导入</Button> : null}
            <ExImport id={'communitys'}
              visible={visible}
              callback={hideModalVisible.bind(this)}
              downUrl={downFiles.bind(this)}
              importUrl="/property/resident/import"/>
            {author('export') ? <Button type="primary" style={{marginLeft:'10px'}} onClick={handleExport.bind(this)}>导出</Button> : null}
            <ExImport
              id={'dataRepair'}
              resident
              visible={visible1}
              communityId={sessionStorage.getItem("communityId")}
              callback={hideModalVisible.bind(this)}
              export={handleExport.bind(this)}
              importUrl="/property/resident/import-repair"
            />
            {author('dataCorrection')?<Button type="primary" style={{ marginLeft: '10px' }} onClick={showModal.bind(this,2)}>数据订正</Button>:null}
            <AlreadySettleInList
              list={settleInList}
              loading={loading}
              totals={totals}
              params={params}
            />
          </TabPane>
          <TabPane tab="待审核" key="CheckPending" forceRender={false}>
            {/*<div>共 {totals} 条数据</div>*/}
            <CheckPending
              list={checkPendingList}
              loading={loading}
              params={params}
              totals={totals}
            />
          </TabPane>
          <TabPane tab="未通过" key="Failed" forceRender={false}>
            {/*<div>共 {totals} 条数据</div>*/}
            <Failed
              list={failedList}
              loading={loading}
              totals={totals}
              params={params}
            />
          </TabPane>
          <TabPane tab="已迁出" key="AlreadySettleOut" forceRender={false}>
            {/*<div>共 {totals} 条数据</div>*/}
            <AlreadySettleOutList
              list={settleOutList}
              loading={loading}
              totals={totals}
              params={params}
            />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    ...state.ResidentsManageModel,
  };
}
export default connect(mapStateToProps)(Form.create()(ResidentsManage));

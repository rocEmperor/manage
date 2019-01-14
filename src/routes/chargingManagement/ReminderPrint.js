import React from 'react';
import { connect } from 'dva';
import { Breadcrumb, Card, Select, Button, Form, DatePicker, Table, Col, Row, Modal, message} from 'antd';
import { getCommunityId } from '../../utils/util';
import Print from '../../components/Print/index';
import Community from '../../components/Community/Community.js';
const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const Option = Select.Option;
// let query = {
//   community_id: getCommunityId(),
//   group: '',
//   building: '',
//   unit: ''
// };

function ReminderPrint (props) {
  let { dispatch, ReminderPrintModel, form } = props;
  let { printShow, serviceData, data, is_reset, billdata,
    totals, params, selectedRowKeys, endTime, startTime, loading, visiableTemplate, templateList} = ReminderPrintModel;
    
  let { getFieldDecorator } = form;

  if (is_reset == true) {
    form.resetFields();
    dispatch({
      type: 'ReminderPrintModel/concat',
      payload: {
        is_reset: false,
      }
    });
  }
  const columns = [{
    title: '苑期区',
    dataIndex: 'group',
    key:'group',
  }, {
    title: '幢',
    dataIndex: 'building',
    key:'building',
  }, {
    title: '单元',
    dataIndex: 'unit',
    key:'unit',
  }, {
    title: '室',
    dataIndex: 'room',
    key:'room',
  }, {
    title: '缴费项目',
    dataIndex: 'cost_name',
    key:'cost_name',
  }, {
    title: '账期开始时间',
    dataIndex: 'acct_period_start',
    key:'acct_period_start',
  }, {
    title: '账期结束时间',
    dataIndex: 'acct_period_end',
    key:'acct_period_end',
  } ,{
    title: '账单金额(元)',
    dataIndex: 'bill_entry_amount',
    key:'bill_entry_amount',
  }]

  // 搜索按钮
  function handSearch (val) {
    form.validateFields(['cost_types','time','unit','building','group','room'],(err, values) => {
      let arr = [];
      serviceData.map((item) => {
        if (values.cost_types !== undefined) {
          values.cost_types.map((items) => {
            if (items === item.label) {
              arr.push(item.key);
            }
          })
        }
      });
      if (err) {
        return
      }
      dispatch({
        type: 'ReminderPrintModel/getList',
        payload: {
          community_id: getCommunityId(),
          group: values.group,
          unit: values.unit,
          building: values.building,
          room:values.room,
          cost_type: arr,
          acct_period_end: endTime,
          acct_period_start: startTime
        }
      })
    });
  }

  // 搜索重置
  function handleReset (e) {
    e.preventDefault();
    form.resetFields();
    dispatch({
      type: 'ReminderPrintModel/concat',
      payload: {
        entry_amounts: 0,
        billdata: [],
        totals: '',
        startTime: '',
        endTime: '',
        params: {
          community_id: sessionStorage.getItem("communityId"),
          group: '',
          unit: '',
          building: '',
          room:'',
          cost_type: '',
          acct_period_end: '',
          acct_period_start: '',
          page: 1,
          rows: 50
        }
      }
    })
  }
  // 各搜索项列表获取
  // function selectChange (mark, val) {
  //   query[mark] = val;
  //   query.community_id = getCommunityId();
  //   if (mark === 'group') {
  //     form.resetFields(['unit', 'building']);
  //     query.building = undefined;
  //     query.unit = undefined;
  //     dispatch({
  //       type: 'ReminderPrintModel/buildingList',
  //       payload: query
  //     })
  //   } else if (mark === 'building') {
  //     form.resetFields([ 'unit']);
  //     query.unit = undefined;
  //     dispatch({
  //       type: 'ReminderPrintModel/unitList',
  //       payload: query
  //     })
  //   }
  // }
  // 时间控件change
  function timeChange (date, dateString) {
    dispatch({
      type: 'ReminderPrintModel/concat',
      payload: {
        startTime: dateString[0],
        endTime: dateString[1]
      }
    })
  }
  // 打印modal 展示
  function printshow (value) {
    form.validateFields(['template_id'], (err, values) => {
      if(err){
        return
      }
      let arr = [];
      for (let j = 0; j < selectedRowKeys.length; j++) {
        for (let i = 0; i < billdata.length; i++) {
          if (selectedRowKeys[j]==i){
            arr.push(billdata[i].id)
          }
        }
      }
      
      dispatch({
        type: 'ReminderPrintModel/concat',
        payload: {
          visiableTemplate: false,
        }
      })
      dispatch({
        type: 'ReminderPrintModel/printInfo',
        payload: {
          template_id: values.template_id,
          ids: arr,
        },
        callback:()=>{
          form.resetFields(['template_id']);
        }
      });
    })
  }

  function changeTemplate(){
    form.resetFields(['template_id'])
    if(selectedRowKeys.length<=0){
      message.info("暂无打印数据");
      return
    }
    dispatch({
      type: 'ReminderPrintModel/concat',
      payload: {
        visiableTemplate: true,
      }
    })
  }

  function handleCancel(){
    dispatch({
      type: 'ReminderPrintModel/concat',
      payload: {
        visiableTemplate: false
      }
    })
  }

  function hide () {
    dispatch({
      type: 'ReminderPrintModel/concat',
      payload: {
        printShow: false
      }
    })
  }

  function pageChange(page){
    dispatch({
      type: 'ReminderPrintModel/getList',
      payload: {...params,page}
    })
  }

  // 布局
  const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 16 },
  };

  function number() {
    dispatch({
      type: 'ReminderPrintModel/numberPlus',
      payload: { community_id: getCommunityId() }
    })
  }

  // 打印预览参数
  function printTypeChoice () {
    let childPropsList = {
      visible: printShow,
      hide: hide,
      number: number,
      dataSource: data,
    };
    return childPropsList
  }

  const rowSelection = {
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      dispatch({
        type: 'ReminderPrintModel/concat',
        payload:{
          selectedRowKeys: selectedRowKeys
        }
      })
    }
  };

  const PaginationProps = {
    current: params.page,
    onChange: pageChange,
    total: parseInt(totals),
    showTotal: totals => `共${totals}条`,
    defaultCurrent:1,
    defaultPageSize: 50,
  }

  return (
    <div className="page-content">
      <Breadcrumb separator=">">
        <Breadcrumb.Item>计费管理</Breadcrumb.Item>
        <Breadcrumb.Item>催缴单打印</Breadcrumb.Item>
      </Breadcrumb>
      <Card className="section" style={{padding: 0}}>
        <Form>
          <Row> 
            <Community form={form} allDatas={{group:{label:'房 屋：',required:true},building:{},unit:{},room:{}}}/>
            {/* <Col span={16}>
              <Col span={10}>
                <Form.Item label="房 屋：" style={{marginBottom: 20}} labelCol={{span: 7}} wrapperCol={{ span: 17 }}>
                  {getFieldDecorator('group', {rules: [{required: true, message: "请选择"}]})(
                    <Select className="mr-5"
                      placeholder="苑\期\区"
                      showSearch={true}
                      notFoundContent="没有数据"
                      onChange={(val) => selectChange('group', val)}>
                      {groupData.map((value, index) => {
                        return <Option key={index} value={value.name}>{value.name}</Option>
                      })}
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
                      {buildingData.map((value, index) => {
                        return <Option key={index} value={value.name}>{value.name}</Option>
                      })}
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
                      {unitData.map((value, index) => {
                        return <Option key={index} value={value.name}>{value.name}</Option>
                      })}
                    </Select>)}
                </Form.Item>   
              </Col>
            </Col> */}
            <Col span={6}>
              <FormItem label="收费项目" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
                {getFieldDecorator('cost_types', { initialValue: undefined })(
                  <Select mode="multiple" placeholder="请选择收费项目">
                    {serviceData.map((value, index) => {
                      return <Option key={index} value={value.label}>{value.label}</Option>
                    })}
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label="账期：" labelCol={{span: 3}} wrapperCol={{ span: 21 }}>
                {getFieldDecorator('time')(
                  <RangePicker onChange={timeChange} style={{width:'96%'}}/>
                )}
              </Form.Item>
            </Col>
            <Col span={4} offset={2}>
              <Button type="primary" onClick={handSearch}>查询</Button>
              <Button type="ghost" onClick={handleReset} style={{ marginLeft: 15 }}>重置</Button>
            </Col>
          </Row>
        </Form>
      </Card>
      <Card className="section" style={{padding: 0}}>
        <Button type="primary" onClick={() => changeTemplate()} style={{marginBottom: 10}}>打印预览</Button> 
        <Table
          columns={columns}
          dataSource={billdata}
          pagination={PaginationProps}
          loading={loading}
          rowSelection={rowSelection}
        />
      </Card>
      <Modal title="选择模版" visible={visiableTemplate} onOk={printshow.bind(this)} onCancel={handleCancel.bind(this)}>
        <Form>
          <FormItem {...formItemLayout} label="模版" >
            {getFieldDecorator('template_id', {
              rules: [{ required: true, message: '请选择模版!' }],
            })(
              <Select placeholder="请选择模版">
                {templateList.map((item,index)=>{
                  return <Option key={index} value={item.id}>{item.name}</Option>
                })}
              </Select>
            )}
          </FormItem>
        </Form>
      </Modal>
      <Print {...printTypeChoice()} />
    </div>
  )
}

export default connect(state => {
  return {
    ReminderPrintModel: state.ReminderPrintModel,
    layout: state.MainLayout
  }
})(Form.create({})(ReminderPrint));

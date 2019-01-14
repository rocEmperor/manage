import React from 'react';
import { connect } from 'dva';
import { Form, Breadcrumb, Card, Col, Button, Input, DatePicker, Radio, Table, Modal, Select } from 'antd';
import Community from '../../components/Community/Community';
import InvoiceModal from './components/cashierDesk/invoiceModal';
import RevokeModal from './components/cashierDesk/revokeModal';
import RecordModal from './components/cashierDesk/recordModal';
import { getCommunityId } from '../../utils/util';
import Print from '../../components/Print/';
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const RadioGroup = Radio.Group;
const Option = Select.Option;

function GatheringRecord (props) {
  let { form, dispatch, GatheringRecordModel } = props;
  let { loading, data, currentPage, rows, revokeModalVisible, recordModalVisible, printModalVisible, invoiceModalVisible, invoiceModalInfo,
    revokeModalInfo, recordModalInfo, totals, revokeLoading, recordLoading, templateVisible, id, dataSource, templateList } = GatheringRecordModel;
  let { getFieldDecorator } = form;
  // 查询
  function handSearch (page) {
    let values = form.getFieldsValue();
    let startTime = undefined;
    let endTime = undefined;
    if (values.gatheringDate) {
      startTime = values.gatheringDate[0].format('YYYY-MM-DD');
      endTime = values.gatheringDate[1].format('YYYY-MM-DD');
    }
    let formData = {};
    formData.building = values.building;
    formData.group = values.group;
    formData.unit = values.unit;
    formData.room = values.room;
    formData.invoice_no = values.billNumber;
    formData.type = values.dateWay;
    formData.income_start = startTime;
    formData.income_end = endTime;
    formData.community_id = getCommunityId();
    formData.rows = rows;
    formData.page = page ? page : 1;
    dispatch({
      type: 'GatheringRecordModel/getList',
      payload: formData,
      page: page ? page : undefined
    })
  }
  // 重置
  function handleReset () {
    form.resetFields();
    let formData = {};
    formData.community_id = getCommunityId();
    formData.rows = rows;
    formData.page = 1;
    dispatch({
      type: 'GatheringRecordModel/concat',
      payload: {currentPage: 1}
    });
    dispatch({
      type: 'GatheringRecordModel/getList',
      payload: formData
    })
  }
  // 分页
  function pageChange(page){
    dispatch({
      type: 'GatheringRecordModel/concat',
      payload: {currentPage: page}
    });
    handSearch(page);
  }
  // 打开弹层
  function operateFn (type, record) {
    if (type === 'recordModalVisible') {
      let formData = {};
      formData.income_id = record.id;
      dispatch({
        type: 'GatheringRecordModel/invoiceRecord',
        payload: formData,
        modalType: type,
        recordId: record.id
      })
    } else if (type === 'invoiceModalVisible') { // 查看明细
      let formData = {};
      formData.id = record.id;
      dispatch({
        type: 'GatheringRecordModel/recordShow',
        payload: formData,
        modalType: type
      })
    } else if (type === 'printModalVisible') {
      form.resetFields(['template_id']);
      dispatch({
        type: 'GatheringRecordModel/concat',
        payload: {
          templateVisible:true,
          id:record.id
        }
      })
    } else {
      let payload = {};
      payload[type] = true;
      if (type === 'revokeModalVisible') { // 撤销收款
        payload.revokeModalInfo = {
          trade_no: record.trade_no,
          room_info: record.room_info,
          pay_money: record.pay_money,
          id: record.id
        }
      }
      dispatch({
        type: 'GatheringRecordModel/concat',
        payload: payload
      })
    }
  }
  // 关闭弹层
  function handleCancel (type) {
    let payload = {};
    payload[type] = false;
    // 发票记录重置表单
    if (type === 'recordModalVisible') {
      payload.recordModalInfo = {};
    }
    dispatch({
      type: 'GatheringRecordModel/concat',
      payload: {...payload}
    })
  }

  function number() {
    dispatch({
      type: 'GatheringRecordModel/numberPlus',
      payload: { community_id: getCommunityId() }
    })
  }

  function dateChange () {
    form.setFieldsValue({dateWay: undefined})
  }
  function dateWayChange () {
    form.setFieldsValue({gatheringDate: undefined})
  }

  // 打印modal 展示
  function printshow(value) {
    form.validateFields(['template_id'], (err, values) => {
      if (err) {
        return
      }
      dispatch({
        type: 'GatheringRecordModel/printReceiptInfo',
        payload: {
          id:id,
          template_id:values.template_id,
        },
        modalType: 'printModalVisible',
        callback:()=>{
          form.resetFields(['template_id']);
        }
      })
    })
  }

  const formItemLayout = {labelCol: {span: 6}, wrapperCol: {span: 16}};
  // Table表格列
  const columns = [
    {
      title: '交易流水号',
      dataIndex: 'trade_no',
      key: 'trade_no',
    },{
      title: '关联房屋',
      dataIndex: 'room_info',
      key: 'room_info',
    }, {
      title: '收款金额',
      dataIndex: 'pay_money',
      key: 'pay_money',
    }, {
      title: '交易类型',
      dataIndex: 'trade_type_str',
      key: 'trade_type_str'
    }, {
      title: '收款方式',
      dataIndex: 'pay_channel',
      key: 'pay_channel'
    }, {
      title: '交易状态',
      dataIndex: 'pay_status',
      key: 'pay_status'
    }, {
      title: '收款人',
      dataIndex: 'payee_name',
      key: 'payee_name'
    }, {
      title: '收款日期',
      dataIndex: 'income_time',
      key: 'income_time'
    }, {
      title: '票据单号',
      dataIndex: 'invoice_no',
      key: 'invoice_no'
    }, {
      title: '复核状态',
      dataIndex: 'check_status_str',
      key: 'check_status_str'
    }, {
      title: '复核人',
      dataIndex: 'check_name',
      key: 'check_name'
    }, {
      title: '操作',
      dataIndex: 'operate',
      key: 'operate',
      render: (text, record) => {
        let styleList = {marginRight: 5};
        return (
          <div>
            <a style={styleList} onClick={() => operateFn('invoiceModalVisible', record)}>
              查看明细
            </a>
            {record.check_status == '1' && record.trade_type == '1'
              ? <a style={styleList} onClick={() => operateFn('revokeModalVisible', record)}>
              撤销收款
              </a>
              : null}
            <a style={styleList} onClick={() => operateFn('printModalVisible', record)}>
              打印收据
            </a>
            <a onClick={() => operateFn('recordModalVisible', record)}>
              发票记录
            </a>
          </div>
        )
      }
    }];
  // 分页
  const PaginationProps = {
    current: currentPage,
    onChange: pageChange,
    total: parseInt(totals),
    showTotal: totals => `共${totals}条`,
    defaultCurrent:1,
    defaultPageSize: 10,
  };
  return (
    <div className="GatheringRecord">
      <Breadcrumb separator=">">
        <Breadcrumb.Item>收费管理</Breadcrumb.Item>
        <Breadcrumb.Item>收款记录</Breadcrumb.Item>
      </Breadcrumb>
      <Card className="section">
        <Form>
          <Community form={form} allDatas={{group:{}, building: {}, unit:{}, room:{}}}/>
          <Col span={6}>
            <FormItem {...formItemLayout} label="票据号" className="selectBox">
              {getFieldDecorator('billNumber')(
                <Input placeholder="请输入票据号"/>
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem {...formItemLayout} label="收款日期" className="selectBox">
              {getFieldDecorator('gatheringDate')(
                <RangePicker onChange={() => dateChange()}/>
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem>
              {getFieldDecorator('dateWay')(
                <RadioGroup onChange={() => dateWayChange()}>
                  <Radio value={1}>当天</Radio>
                  <Radio value={2}>本周</Radio>
                  <Radio value={3}>本月</Radio>
                </RadioGroup>
              )}
            </FormItem>
          </Col>
        </Form>
        <Col style={{textAlign: 'right', paddingRight: '2%'}} className="fr">
          <Button type="primary" onClick={() => handSearch()}>查询</Button>
          <Button className="ml1" type="ghost" onClick={() => handleReset()}>重置</Button>
        </Col>
      </Card>
      <Card>
        <Table
          className="mt1"
          loading={loading}
          columns={columns}
          dataSource={data}
          pagination={PaginationProps}
          rowKey={record => record.id} />
      </Card>
      <Modal title="选择模版" visible={templateVisible} onOk={printshow.bind(this)} onCancel={handleCancel.bind(this,'templateVisible')}>
        <Form>
          <FormItem {...formItemLayout} label="模版" >
            {getFieldDecorator('template_id', {
              rules: [{ required: true, message: '请选择模版!' }],
            })(
              <Select placeholder="请选择模版">
                {templateList.map((item, index) => {
                  return <Option key={index} value={item.id}>{item.name}</Option>
                })}
              </Select>
            )}
          </FormItem>
        </Form>
      </Modal>
      <InvoiceModal
        visible={invoiceModalVisible}
        prop={props}
        handleCancel={() => handleCancel('invoiceModalVisible')}
        infoList={invoiceModalInfo}/>
      <RevokeModal
        visible={revokeModalVisible}
        handleCancel={() => handleCancel('revokeModalVisible')}
        form={form}
        revokeLoading={revokeLoading}
        prop={props}
        modelType="GatheringRecordModel"
        getListFn={() => handSearch(currentPage)}
        infoList={revokeModalInfo}/>
      <RecordModal
        visible={recordModalVisible}
        handleCancel={() => handleCancel('recordModalVisible')}
        form={form}
        prop={props}
        recordLoading={recordLoading}
        getListFn={() => handSearch(currentPage)}
        modelType="GatheringRecordModel"
        infoList={recordModalInfo}/>
      <Print
        visible={printModalVisible}
        hide={() => handleCancel('printModalVisible')}
        number={number}
        dataSource={dataSource}
      />
    </div>
  )
}

export default connect((state) => {
  return {
    GatheringRecordModel: state.GatheringRecordModel
  }
})(Form.create()(GatheringRecord));

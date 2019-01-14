import React from 'react';
import { connect } from 'dva';
import { Form, Breadcrumb, Card, Col, Button, Input, DatePicker, Radio, Table, Select, Modal, Icon } from 'antd';
import Community from '../../components/Community/Community';
import InvoiceModal from './components/cashierDesk/invoiceModal';
import RevokeModal from './components/cashierDesk/revokeModal';
import RecordModal from './components/cashierDesk/recordModal';
import { getCommunityId, author } from '../../utils/util';
import Print from '../../components/Print/';
const FormItem = Form.Item;
const { RangePicker, MonthPicker } = DatePicker;
const RadioGroup = Radio.Group;
const Option = Select.Option;

function GatheringCheck (props) {
  let { form, dispatch, GatheringCheckModel } = props;
  let { loading, hasCondition, data, currentPage, rows, invoiceModalVisible, total_money, invoiceModalInfo, revokeModalInfo, revokeModalVisible, selectedRow,
    verificationVisible, totals, selectedRowKeys, revokeLoading, recordModalInfo, recordLoading, recordModalVisible, printModalVisible, templateVisible, id, dataSource, templateList } = GatheringCheckModel;
  let { getFieldDecorator } = form;
  /**
   * 搜索
   * @params {Number} page 分页页码
   * @params {String} 在点击搜索按钮时传入 
   */
  function handSearch (page, cearchBtn) {
    if (!hasCondition && !cearchBtn) {
      let formData = {};
      formData.community_id = getCommunityId();
      formData.rows = rows;
      formData.page = page ? page : 1;
      dispatch({
        type: 'GatheringCheckModel/concat',
        payload: { currentPage: page }
      });
      dispatch({
        type: 'GatheringCheckModel/getList',
        payload: formData
      })
      return false;
    }
    let values = form.getFieldsValue();
    let startTime = undefined;
    let endTime = undefined;
    if (values.gatheringDate && values.gatheringDate.length > 0) {
      startTime = values.gatheringDate[0].format('YYYY-MM-DD');
      endTime = values.gatheringDate[1].format('YYYY-MM-DD');
    }
    let formData = {};
    formData.community_id = getCommunityId();
    formData.building = values.building;
    formData.unit = values.unit;
    formData.group = values.group;
    formData.room = values.room;
    formData.invoice_no = values.billNumber;
    formData.type = values.dateWay;
    formData.check_status = values.checkStatus;
    formData.income_start = startTime;
    formData.income_end = endTime;
    formData.rows = rows;
    formData.page = page ? page : 1;
    dispatch({
      type: 'GatheringCheckModel/concat',
      payload: { hasCondition: true,currentPage:1 }
    })
    dispatch({
      type: 'GatheringCheckModel/getList',
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
      type: 'GatheringCheckModel/concat',
      payload: { currentPage: 1, hasCondition: false }
    });
    dispatch({
      type: 'GatheringCheckModel/getList',
      payload: formData
    })
  }
  // 分页
  function pageChange (page){
    handSearch(page);
  }
  function operateFn (type, record) {
    if (type === 'recordModalVisible') { //发票记录
      let formData = {};
      formData.income_id = record.id;
      dispatch({
        type: 'GatheringCheckModel/invoiceRecord',
        payload: formData,
        modalType: type,
        recordId: record.id
      })
    } else if (type === 'invoiceModalVisible') { // 查看明细
      let formData = {};
      formData.id = record.id;
      dispatch({
        type: 'GatheringCheckModel/recordShow',
        payload: formData,
        modalType: type
      })
    } else if (type === 'printModalVisible') { //打印收据
      form.resetFields(['template_id']);
      dispatch({
        type: 'GatheringCheckModel/concat',
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
        type: 'GatheringCheckModel/concat',
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
      type: 'GatheringCheckModel/concat',
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
  // 复核/撤销复核
  function checkBtnClick (type) {
    let title = '';
    if (type === 1) {
      title = '确认撤销复核选中数据吗'
    } else if (type === 2) {
      title = '确认复核选中数据吗'
    }
    Modal.confirm({
      title: title,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        let formData = {};
        let ids = [];
        selectedRow.forEach((val) => {
          ids.push(val.id)
        });
        formData.type = type;
        formData.income_list = [...ids];
        dispatch({
          type: 'GatheringCheckModel/checkReq',
          payload: formData,
          callback: () => {
            handSearch(currentPage)
          }
        })
      }
    });
  }
  // 打开提交核销弹层
  function submitCheck () {
    dispatch({
      type: 'GatheringCheckModel/concat',
      payload: {verificationVisible: true}
    })
  }
  // 提交核销
  function submitCheckBtn () {
    form.validateFields(['entry_at'], (err, values) => {
      if (err) return;
      let formData = {};
      let ids = [];
      selectedRow.forEach((val) => {
        ids.push(val.id)
      });
      formData.entry_at = values.entry_at.format('YYYY-MM');
      formData.income_list = ids;
      dispatch({
        type: 'GatheringCheckModel/submitCheck',
        payload: formData,
        callback: () => {
          handSearch(currentPage)
        }
      })
    })
  }
  // 打印modal 展示
  function printshow(value) {
    form.validateFields(['template_id'], (err, values) => {
      if (err) {
        return
      }
      dispatch({
        type: 'GatheringCheckModel/printReceiptInfo',
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
  const formItemLayout1 = {labelCol: {span: 8}, wrapperCol: {span: 16}};
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
            {author('details') ? <a style={styleList} onClick={() => operateFn('invoiceModalVisible', record)}>
              查看明细
            </a> : null}
            {author('revoke')
              ? record.check_status == '1' && record.trade_type == '1'
                ? <a style={styleList} onClick={() => operateFn('revokeModalVisible', record)}>
                  撤销收款
                </a>
                : null
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
  const PaginationProps = {
    current: currentPage,
    onChange: pageChange,
    total: parseInt(totals),
    showTotal: totals => `共${totals}条`,
    defaultCurrent:1,
    defaultPageSize: 10,
  };

  const rowSelection = {
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      dispatch({
        type: 'GatheringCheckModel/concat',
        payload:{
          selectedRow: [...selectedRows],
          selectedRowKeys: selectedRowKeys
        }
      })
    }
  };
  return (
    <div className="GatheringRecord">
      <Breadcrumb separator=">">
        <Breadcrumb.Item>收费管理</Breadcrumb.Item>
        <Breadcrumb.Item>收款复核</Breadcrumb.Item>
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
          <Col span={6}>
            <FormItem {...formItemLayout} label="复核状态">
              {getFieldDecorator('checkStatus')(
                <Select placeholder="请选择复核状态">
                  <Option value="1">待复核</Option>
                  <Option value="2">已复核</Option>
                  <Option value="3">待核销</Option>
                  <Option value="4">已核销</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Form>
        <Col style={{textAlign: 'right', paddingRight: '2%'}} className="fr">
          <Button type="primary" onClick={() => handSearch(undefined, 'cearchBtn')}>查询</Button>
          <Button className="ml1" type="ghost" onClick={() => handleReset()}>重置</Button>
        </Col>
      </Card>
      <Card>
        <div style={{marginBottom: 20}}>
          {`共 ${totals} 条数据，收款金额 ${total_money} 元`}
        </div>
        <div style={{marginBottom: 20}}>
          {author('check') ? <Button
            type="primary"
            style={{marginRight: 20}}
            onClick={() => checkBtnClick(2)}
            disabled={selectedRow.length === 0 ? true : false}>
            复核
          </Button> : null}
          {author('unCheck') ? <Button
            type="primary"
            style={{marginRight: 20}}
            onClick={() => checkBtnClick(1)}
            disabled={selectedRow.length === 0 ? true : false}>
            撤销复核
          </Button> : null}
          {author('submitCheck') ? <Button
            type="primary"
            onClick={submitCheck}
            disabled={selectedRow.length === 0 ? true : false}>
            提交核销
          </Button> : null}
        </div>
        <Table
          className="mt1"
          loading={loading}
          columns={columns}
          dataSource={data}
          rowSelection={rowSelection}
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
        handleCancel={() => handleCancel('invoiceModalVisible')}
        prop={props}
        infoList={invoiceModalInfo}/>
      <RevokeModal
        visible={revokeModalVisible}
        handleCancel={() => handleCancel('revokeModalVisible')}
        form={form}
        prop={props}
        revokeLoading={revokeLoading}
        modelType="GatheringCheckModel"
        getListFn={() => handSearch(currentPage)}
        infoList={revokeModalInfo}/>
      <RecordModal
        visible={recordModalVisible}
        handleCancel={() => handleCancel('recordModalVisible')}
        form={form}
        prop={props}
        recordLoading={recordLoading}
        getListFn={() => handSearch(currentPage)}
        modelType="GatheringCheckModel"
        infoList={recordModalInfo}/>
      <Print
        visible={printModalVisible}
        hide={() => handleCancel('printModalVisible')}
        number={number}
        dataSource={dataSource}
      />
      <Modal
        title="提交核销"
        visible={verificationVisible}
        onOk={submitCheckBtn}
        destroyOnClose={true}
        onCancel={() => handleCancel('verificationVisible')}
      >
        <div style={{marginBottom: 20}}>
          <Icon
            type="exclamation-circle"
            style={{color: '#FBC550', fontSize: 24, marginRight: 16, verticalAlign: 'middle'}}
          />
          提交核销后，请将对应收款凭据提交至财务进行核销入账；
        </div>
        <FormItem label="财务入账月" {...formItemLayout1}>
          {getFieldDecorator('entry_at', {
            rules: [{ required: true, message: '请选择财务入账月份' }]
          })(
            <MonthPicker placeholder="请选择财务入账月份" />
          )}
        </FormItem>
      </Modal>
    </div>
  )
}

export default connect((state) => {
  return {
    GatheringCheckModel: state.GatheringCheckModel
  }
})(Form.create()(GatheringCheck));
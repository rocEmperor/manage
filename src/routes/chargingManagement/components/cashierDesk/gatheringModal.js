import React from 'react';
import { Modal, Table, Button, Form, Select, Input, Icon } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
import './index.less';

function GatheringModal (props) {
  let { visible, handleCancel, roomsData, modalInfo, form, modalData, typeOption, handleOk, gatheringLoading1, gatheringLoading2, templateList } = props;
  let { getFieldDecorator } = form;
  const columnsModal = [
    {
      title: '缴费项目',
      dataIndex: 'cost_name',
      key: 'cost_name',
    },{
      title: '应缴金额',
      dataIndex: 'bill_entry_amount',
      key: 'bill_entry_amount',
    }, {
      title: '实收金额',
      dataIndex: 'prefer_entry_amount',
      key: 'prefer_entry_amount',
    }, {
      title: '优惠金额',
      dataIndex: 'favourable',
      key: 'favourable'
    }, {
      title: '未付金额',
      dataIndex: 'unpaid',
      key: 'unpaid'
    }, {
      title: '缴费方式',
      dataIndex: 'entry_way',
      key: 'entry_way'
    }];
  const footer = <div>
    <Button type="primary" className="mr1" onClick={() => handleOk(2)} loading={gatheringLoading2}>保存并打印</Button>
    <Button type="primary" className="mr1" onClick={() => handleOk(1)} loading={gatheringLoading1}>保存</Button>
    <Button onClick={handleCancel}>取消</Button>
  </div>
  const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 14 },
  };
  return (
    <Modal
      title="确认收款"
      visible={visible}
      className="cash_modal"
      onCancel={handleCancel}
      footer={footer}
    >
      <div className="hint">
        <Icon type="exclamation-circle" className="hint_icon"/>
        <span>请核对收款信息</span>
      </div>
      <div className="current_info">
        <div style={{marginBottom: 5}}>
          {
            Object.keys(roomsData).length === 0
              ? '房屋信息：'
              : `房屋信息：${roomsData.community_name}${roomsData.group}${roomsData.building}${roomsData.unit}${roomsData.room}`
          }
        </div>
        <div style={{color: 'red', fontSize: '14px'}}>
          {`应收总计：${modalInfo.payableTotal}元  实收总计：${modalInfo.collectTotal}元   优惠总计：${modalInfo.favourableTotal}元   未付总计：${modalInfo.unpaidTotal}元`}
        </div>
      </div>
      <div style={{marginBottom: 12}}>
        <Table columns={columnsModal} dataSource={modalData} rowKey={record => record.bill_id} pagination={false} size="small"/>
      </div>
      <FormItem {...formItemLayout} label="付款方式" className="selectBox">
        {getFieldDecorator('pay_channel',{rules: [{required: true, message: '请选择'}]})(
          <Select placeholder="请选择">
            {typeOption.map((value, index)=>{
              return <Option  key={index} value={value.key.toString()}>{value.value}</Option>
            })}
          </Select>
        )}
      </FormItem>
      <FormItem {...formItemLayout} label="打印模版" className="selectBox">
        {getFieldDecorator('template_id', { rules: [{ required: false, message: '请选择' }] })(
          <Select placeholder="请选择">
            {templateList.map((value, index) => {
              return <Option key={index} value={value.id}>{value.name}</Option>
            })}
          </Select>
        )}
      </FormItem>
      <FormItem {...formItemLayout} label="备注" className="selectBox">
        {getFieldDecorator('remark')(
          <TextArea placeholder="请输入备注" autosize={{minRows: 2, maxRows: 6}}/>
        )}
      </FormItem>
    </Modal>
  )
}

export default GatheringModal;

import React from 'react';
import { Modal, Table } from 'antd';
import './index.less';

function InvoiceModal (props) {
  let { visible, handleCancel, infoList } = props;
  let columns = [{
    title: '收款项目',
    dataIndex: 'cost_name',
    key: 'cost_name'
  }, {
    title: '账期',
    dataIndex: 'acct_period',
    key: 'acct_period'
  }, {
    title: '应缴金额',
    dataIndex: 'bill_entry_amount',
    key: 'bill_entry_amount'
  }, {
    title: '优惠金额',
    dataIndex: 'prefer_entry_amount',
    key: 'prefer_entry_amount'
  }, {
    title: '实收金额',
    dataIndex: 'paid_entry_amount',
    key: 'paid_entry_amount'
  }];
  return (
    <Modal
      title="收款明细"
      visible={visible}
      className="invoiceModal"
      destroyOnClose={true}
      width="620px"
      onCancel={() => handleCancel('invoiceModalVisible')}
      footer={null}
    >
      <div className="head">
        <span className="home">{`房间号：${infoList.room_info}`}</span>
        <span style={{float: 'right'}}>{`交易流水号：${infoList.trade_no}`}</span>
      </div>
      <Table
        columns={columns}
        dataSource={infoList.list}
        pagination={false}
        size="small"
        rowKey={record => record.id}/>
      <div className="payWay">
        <span>付款方式：</span>
        {`${infoList.pay_channel}`}
      </div>
      <div className="remark">
        <span>备注：</span>
        <p>{`${infoList.note}`}</p>
      </div>
    </Modal>
  )
}

export default InvoiceModal;

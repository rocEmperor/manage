import React from 'react';
import { Modal, Form, Input, Button, Icon } from 'antd';
const FormItem = Form.Item;
const { TextArea } = Input;
import './index.less';

function RevokeModal (props) {
  let { visible, handleCancel, infoList, form, prop, getListFn, modelType, revokeLoading } = props;
  let { dispatch } = prop;
  let { getFieldDecorator } = form;
  function onOk () {
    form.validateFields(['refund_result'], (err, value) => {
      if (err) return;
      let formData = {
        id: infoList.id,
        refund_note: value.refund_result
      };
      dispatch({
        type: `${modelType}/revoke`,
        payload: formData,
        callback: () => {
          handleCancel();
          getListFn()
        }
      });
    })
  }
  return (
    <Modal
      title="撤销收款"
      visible={visible}
      className="revokeModal"
      footer={null}
      destroyOnClose={true}
      onCancel={() => handleCancel('revokeModalVisible')}
    >
      <div className="hint">
        <Icon
          type="exclamation-circle"
          style={{color: '#FBC550', fontSize: 18, marginRight: 12, verticalAlign: 'bottom'}}
        />
        当前正在撤销收款，撤销后交易将会关闭，账单状态会变更为未缴。
      </div>
      <div className="trade_stream_mark">
        <span>交易流水号：</span>
        {`${infoList.trade_no}`}
      </div>
      <div className="contact_home">
        <span>关联房屋：</span>
        {`${infoList.room_info}`}
      </div>
      <div className="amount_collected">
        <span>收费金额：</span>
        {`${infoList.pay_money}`}
      </div>
      <FormItem className="refund_result">
        {getFieldDecorator('refund_result',{
          rules: [{
            required: true,
            message: '请输入退款原因'
          }]
        })(
          <div>
            <label className="lable_cls">退款原因：</label>
            <TextArea placeholder="最多输入100个字符" autosize={{minRows: 5, maxRows: 10}} maxLength={100}/>
          </div>
        )}
      </FormItem>
      <div className="btn">
        <Button type="primary" onClick={() => onOk()} style={{marginRight: 20}} loading={revokeLoading}>确定</Button>
        <Button onClick={() => handleCancel('revokeModalVisible')}>取消</Button>
      </div>
    </Modal>
  )
}

export default RevokeModal;

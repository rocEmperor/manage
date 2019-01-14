import React from 'react';
import { Table, Select, Button, Input, Form, Modal, message } from 'antd';
import { getCommunityId,toInteger } from '../../../../utils/util';
const FormItem = Form.Item;
const Option = Select.Option;

class Modes extends React.Component {
  constructor (props) {
    super(props);
    this.state = {};
  }
  hideModal(e) {
    let { props } = this.props;
    props.dispatch({
      type: 'CollectionsModel/visibleChange',
      payload: {
        name: 'hide',
        type: 1
      }
    });
  }
  submit (type) {
    let { form, selectedRows, props, roomId, roomDataList, sending, sendingChange } = this.props;
    form.validateFields((errors, values) => {
      if (errors) { return; }
      let bills = [];
      selectedRows.map((value,index) => {
        bills[index] = new Object();
        bills[index].pay_amount = value.paid_entry_amount;
        bills[index].bill_id = value.bill_id;
        bills[index].pay_type = value.paid_way;
      } );
      if (sending) {
        sendingChange(false);
        setTimeout(() => {
          sendingChange(true);
        }, 2000);
        props.dispatch({
          type: 'CollectionsModel/complete',
          payload: {
            bill_list: bills,
            room_id: roomId ? roomId : roomDataList.room_id,
            pay_channel: values.pay_channel,
            content: values.remark,
            community_id: getCommunityId()
          },
          types: type - 1,
          callback: () => {
            let id = roomId ? roomId : roomDataList.room_id;
            props.dispatch({                        // 重置页面，恢复初始状态
              type: 'CollectionsModel/concat',
              payload: {
                page: 1,
                loading: false,
                submitLoading: false,
                totals: 0,
                data: [],
                info: [],
                visible: false,
                visible2: false
              }
            });
            message.success('收款成功！');
            props.dispatch({
              type: 'CollectionsModel/visibleChange',
              payload: {
                name: 'hide',
                type: 1
              }
            });
            if (type === 1) {
              setTimeout(() => {
                window.location.hash = `/billsView?id=${id}`;
              }, 1000)
            } else {
              // let e1 = doc.getElementsByTagName("body")[0].children[3];
              // doc.getElementsByTagName("body")[0].removeChild(e1);
              props.dispatch({
                type: 'CollectionsModel/visibleChange',
                payload: {
                  name: 'hide',
                  type: 1
                }
              });
              setTimeout(() => {
                props.dispatch({
                  type: 'CollectionsModel/visibleChange',
                  payload: {
                    name: 'show',
                    type: 2
                  }
                });
              }, 1000)
            }
          },
          callback1: ()=>{
            setTimeout(() => {
              props.dispatch({
                type: 'CollectionsModel/visibleChange',
                payload: {
                  name: 'show',
                  type: 3
                }
              });
            }, 1000)
          }
        });
      }
    });
  }
  render(){
    let { payType, form, selectedRows, visible, selectedData, typeOption } = this.props;
    const columns = [{
      title: '缴费项目',
      dataIndex: 'cost_name',
      key: 'cost_name'
    }, {
      title: '应缴金额',
      dataIndex: 'bill_entry_amount',
      key: 'bill_entry_amount'
    }, {
      title: '实收金额',
      dataIndex: 'paid_entry_amount',
      key: 'paid_entry_amount'
    }, {
      title: '优惠金额',
      dataIndex: 'discount',
      key: 'discount',
      render: (text, record, index) => {
        let bill_entry_amount = parseFloat(record.bill_entry_amount);
        let paid_entry_amout = parseFloat(record.paid_entry_amount ? record.paid_entry_amount : 0);
        let num = bill_entry_amount - paid_entry_amout;
        num = num.toFixed(2);
        if (record.paid_way != 1) {
          return (
            <span>0.00</span>
          )
        }else{
          return (
            <span>{record.paid_entry_amount ? num : ''}</span>
          )
        }
      }
    }, {
      title: '未付金额',
      dataIndex: 'uncount',
      key: 'uncount',
      render: (text, record, index) => {
        let bill_entry_amount = parseFloat(record.bill_entry_amount);
        let paid_entry_amout = parseFloat(record.paid_entry_amount ? record.paid_entry_amount : 0);
        let num = bill_entry_amount - paid_entry_amout;
        num = num.toFixed(2);
        if (record.paid_way == 1) {
          return (
            <span>0.00</span>
          )
        }else{
          return (
            <span>{record.paid_entry_amount ? num : ''}</span>
          )
        }
      }
    }, {
      title: '缴费方式',
      dataIndex: 'way',
      key: 'way',
      render: (text, record, index) => {
        let paid_way = record.paid_way;
        return (
          <span>
            {payType.map((item, index) => {
              if(item.key == paid_way){
                return item.value
              }
            })}
          </span>
        )
      }
    }];
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    //勾选的账单金额转换为正整数
    let arr = []
    for (let i = 0;i < selectedRows.length; i++) {
      let { paid_entry_amount, paid_way, bill_entry_amount } = selectedRows[i];
      let obj = {
        obj_paid_entry_amount: toInteger(paid_entry_amount),
        paid_way: paid_way,
        obj_bill_entry_amount: toInteger(bill_entry_amount),
      }
      arr.push(obj);
    }
    // 获取转换后最大的放大倍数
    let times = 1;
    arr.map(item=>{
      if(item.obj_paid_entry_amount.times>item.obj_bill_entry_amount.times){
        if(item.obj_paid_entry_amount.times>times){
          times = item.obj_paid_entry_amount.times;
        }
      }else{
        if(item.obj_bill_entry_amount.times>times){
          times = item.obj_bill_entry_amount.times;
        }
      }
    });
    // 重新生成勾选账单的金额数组
    let res = [];
    arr.map(item=>{
      let obj ={
        paid_entry_amount: item.obj_paid_entry_amount.num*(times/item.obj_paid_entry_amount.times),
        paid_way: item.paid_way,
        bill_entry_amount: item.obj_bill_entry_amount.num*(times/item.obj_bill_entry_amount.times),
      }
      res.push(obj);
    })
    let bills = 0, paids = 0, count = 0, unpaids = 0;    
    for (let i = 0;i < selectedRows.length; i++) {
      let { paid_entry_amount, paid_way, bill_entry_amount } = res[i];
      bills = bills + bill_entry_amount;
      if (paid_entry_amount === undefined || paid_entry_amount === '0.00') {
        paids = paids + bill_entry_amount;
      } else {
        paids = paids + paid_entry_amount;
      }
      if (paid_way == 1) {
        if (paid_entry_amount === undefined || paid_entry_amount === '0.00') {
          count = count + bill_entry_amount - bill_entry_amount;
        } else {
          count = count + bill_entry_amount - paid_entry_amount;
        }
      } else {
        unpaids = unpaids + bill_entry_amount - paid_entry_amount;
      }
    }
    const footer = <div>
      <Button type="primary" className="mr1" onClick={() => this.submit(2)}>保存并打印</Button>
      <Button type="primary" className="mr1" onClick={() => this.submit(1)}>保存</Button>
      <Button onClick={this.hideModal.bind(this)}>取消</Button>
    </div>
    let styleList = {fontSize: 18, color: '#108ee9', paddingLeft: 5, paddingRight: 5};
    return(
      <Modal title="收款"
        visible={visible}
        maskClosable={true}
        onCancel={this.hideModal.bind(this)}
        footer={footer}
        wrapClassName="ink-model">
        <Table columns={columns}
          dataSource={selectedData}
          size="small"
          rowKey={record => record.bill_id}
          pagination={false}/>
        <p style={{marginTop: 10, marginBottom: 30}}>
          共计：应收总金额{bills/times}，
          实收总金额<span style={styleList}>{paids/times}</span>，
          优惠总金额<span style={styleList}>{count/times}</span>，
          未付总金额<span style={styleList}>{unpaids/times}</span>
        </p>
        <FormItem {...formItemLayout} label="付款方式" className="selectBox">
          {getFieldDecorator('pay_channel',{rules: [{required: true, message: '请选择'}]})(
            <Select placeholder="请选择">
              {typeOption.map((value, index)=>{
                return <Option  key={index} value={value.key.toString()}>{value.value}</Option>
              })}
            </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="备注" hasFeedback className="selectBox">
          {getFieldDecorator('remark')(
            <Input type="textarea" rows={4} maxLength={200}/>
          )}
        </FormItem>
      </Modal>
    )
  }
}

export default Form.create()(Modes);

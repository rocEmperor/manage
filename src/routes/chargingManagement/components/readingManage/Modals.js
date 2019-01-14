import React from 'react';
import { Modal,DatePicker,Form } from 'antd';
import { getCommunityId } from '../../../../utils/util';
const { MonthPicker } = DatePicker;
const FormItem = Form.Item;
function Modals(props) {
  const { form,visitShow,dispatch,curTabPaneKey } = props;
  const { getFieldDecorator } = form
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };
  function handleOnOk(){
    props.form.validateFields(['period','meter_time'],(err,val)=>{
      if(err){
        return;
      }
      let params = {
        community_id: getCommunityId(),
        period: val.period?val.period.format("YYYY-MM"):'',
        meter_time:val.meter_time?val.meter_time.format("YYYY-MM-DD"):'',
        type:curTabPaneKey,
      }
      dispatch({
        type: 'ReadingManagementModel/getMeterReadingAdd',
        payload: params,
        callBack(){
          dispatch({
            type: 'ReadingManagementModel/getMeterReadingList',
            payload: {community_id: getCommunityId(),type:curTabPaneKey},
          });
        }
      });
    })
  }
  function handleOnCancel(){
    dispatch({
      type: 'ReadingManagementModel/concat',
      payload: {visitShow:false},
    });
  }
  return (
    <Modal
      title="新建周期"
      visible={visitShow}
      maskClosable={true}
      onOk={handleOnOk.bind(this,2)}
      onCancel={handleOnCancel.bind(this,2)}
      closable={true}
      okText="确认"
      cancelText="取消"
    >
      <Form>
        <FormItem {...formItemLayout} label="抄表周期 : ">
          {getFieldDecorator('period',{rules: [{ required: true, message: "请选择费用期间" }]} )(
            <MonthPicker format="YYYY-MM" />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="本次抄表时间 : ">
          {getFieldDecorator('meter_time',{rules:[{required: true,message: '请选择本次抄表时间'}]})(
            <DatePicker
              format="YYYY-MM-DD"
              placeholder="请选择本次抄表时间"
            />
          )}
        </FormItem>
      </Form>
    </Modal>
  )
}

export default Modals;

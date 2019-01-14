import React from 'react';
import { connect } from 'dva';
import { 
  Breadcrumb,
  Card,
  Icon,
  Button,
  Select,
  Input,
  Form,
  DatePicker,
} from 'antd';
import './index.css';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;
const Option = Select.Option;
const dateFormat = 'YYYY-MM-DD';
const formItemLayout = {
  labelCol: {
    span: 3
  },
  wrapperCol: {
    span: 7
  },
}
function BillsAdd(props) {
  let { dispatch,form,address,id,property_type,charge_area,cardItem,serverList,index,community_id } = props;
  const {getFieldDecorator} = form;
  //缴费项目修改
  function handleChange(item,type,index,value){
    const arr = cardItem;
    arr[index][`${type}`] = value;
    arr[index][`time`] = '';
    // arr[index][`start`] = '';
    // arr[index][`water`] = '';
    // arr[index][`end`] = '';
    arr[index][`amount`] = '';
    dispatch({
      type:"BillsAddModel/concat",
      payload:{cardItem:arr}
    })
    item.costType = value;
    props.form.resetFields();
  }
  // 账期时间改变
  function changeTime(item,value,index,e){
    let start_time = "";
    let end_time = "";
    let arr1 = [];
    start_time = e.length!=0?e[0].format('YYYY-MM-DD'):'';
    end_time = e.length!=0?e[1].format('YYYY-MM-DD'):'';
    arr1.push(start_time,end_time);
    const arr = cardItem;
    arr[index][`${value}`]=arr1;
    dispatch({
      type:"BillsAddModel/concat",
      payload:{cardItem:arr}
    })
  }
  // function changeValue1(item,type,index,e){
  //   const arr = cardItem;
  //   arr[index][`${type}`]=e.target.value;
  //   if((props.form.getFieldsValue([`end_${index}_${item.index}`])[`end_${index}_${item.index}`]) != undefined){
  //     if(Number(props.form.getFieldsValue([`end_${index}_${item.index}`])[`end_${index}_${item.index}`]) < Number(e.target.value)){
  //       arr[index][`water`] = '';
  //       arr[index][`amount`] = '';
  //       return;
  //     }else{
  //       arr[index]['water'] = ((props.form.getFieldsValue([`end_${index}_${item.index}`])[`end_${index}_${item.index}`])*1000 - (e.target.value)*1000) / 1000;
  //       if(item.type == 2 || item.type == 3){
  //         dispatch({
  //           type:"BillsAddModel/getAmount",
  //           payload:{
  //             community_id:community_id,
  //             cost_id:item.type,
  //             ton:((props.form.getFieldsValue([`end_${index}_${item.index}`])[`end_${index}_${item.index}`])*1000 - (e.target.value)*1000) / 1000
  //           },
  //           callback(data){
  //             arr[index]['amount'] = data;
  //             dispatch({
  //               type:"BillsAddModel/concat",
  //               payload:{cardItem:arr}
  //             })
  //           }
  //         })
  //       }
  //       dispatch({
  //         type:"BillsAddModel/concat",
  //         payload:{cardItem:arr,end_value:e.target.value}
  //       })
  //     }
  //   }
  //   props.form.resetFields([`water_${index}_${item.index}`,`amount_${index}_${item.index}`]);
  // }
  // 本期读数
  // function changeValue(item,type,index,e){
  //   const arr = cardItem;
  //   arr[index][`${type}`]=e.target.value;
  //   if((props.form.getFieldsValue([`start_${index}_${item.index}`])[`start_${index}_${item.index}`]) != undefined){
  //     if(Number(e.target.value) < Number(props.form.getFieldsValue([`start_${index}_${item.index}`])[`start_${index}_${item.index}`])){
  //       return;
  //     }else{
  //       arr[index]['water'] = ((Number(e.target.value)*1000) - (Number(props.form.getFieldsValue([`start_${index}_${item.index}`])[`start_${index}_${item.index}`]))*1000) / 1000;
  //       if(item.type == 2 || item.type == 3){
  //         dispatch({
  //           type:"BillsAddModel/getAmount",
  //           payload:{
  //             community_id:community_id,
  //             cost_id:item.type,
  //             ton:((Number(e.target.value)*1000) - (Number(props.form.getFieldsValue([`start_${index}_${item.index}`])[`start_${index}_${item.index}`]))*1000) / 1000
  //           },
  //           callback(data){
  //             arr[index]['amount'] = data;
  //             dispatch({
  //               type:"BillsAddModel/concat",
  //               payload:{cardItem:arr}
  //             })
  //           }
  //         })
  //       }
  //       dispatch({
  //         type:"BillsAddModel/concat",
  //         payload:{cardItem:arr,end_value:e.target.value}
  //       })
  //     }
  //   }
  //   props.form.resetFields([`water_${index}_${item.index}`,`amount_${index}_${item.index}`]);
  // }
  // function unFocus(item,type,index,e){
  //   if(item.end != '') {
  //     if(Number(item.end) < Number(item.start)) {
  //       message.error('本期读数必须大于上期读数');
  //     }
  //   }
  // }
  // function unFocus1(item,type,index,e){
  //   if(item.start != '') {
  //     if(Number(item.end) < Number(item.start)) {
  //       message.error('本期读数必须大于上期读数');
  //     }
  //   }
  // }
  function changedInputValue(value,index,e){
    const arr1 = cardItem;
    arr1[index][`${value}`]=e.target.value;
    dispatch({
      type:"BillsAddModel/concat",
      payload:{cardItem:arr1}
    })
  }
  function handleAdd(){
    props.form.validateFields((err,values) => {
      if(err){
        return;
      }
      let arr=cardItem;
      arr.push({
        type:"",
        time:"",
        // start:"",
        // end:"",
        // water:"",
        amount:"",
        index:index+1
      });
      dispatch({
        type:"BillsAddModel/concat",
        payload:{cardItem:arr,index:index+1}
      })
    })
  }
  function remove(index){
    let arr = JSON.parse(JSON.stringify(cardItem));
    Array.prototype.del = function(index){
      if(isNaN(index)||index>=this.length){
        return false;
      }
      for(let i=0,n=0;i<this.length;i++){
        if(this[i]!=this[index]){
          this[n++]=this[i];
        }
      }
      this.length-=1;
    }
    arr.del(index);
    dispatch({
      type:"BillsAddModel/concat",
      payload:{cardItem:arr,index:index+1}
    })
  }
  function handleBack(e){
    history.back();
  }
  function handleSubmit(){
    props.form.validateFields((errors,values)=>{
      if(errors){
        return
      }
      let parameter = [];
      for (let i = 0; i < cardItem.length; i++) {
        parameter.push({
          acct_period_start: cardItem[i].time?cardItem[i].time[0]:"",
          acct_period_end: cardItem[i].time?cardItem[i].time[1]:"",
          bill_entry_amount: cardItem[i].amount,
          cost_id: cardItem[i].costType,
          //end_val:cardItem[i].end,
          //start_val:cardItem[i].start,
          //water_val:cardItem[i].water,
        })
      }
      dispatch({
        type:"BillsAddModel/billAdd",
        payload:{
          lists: parameter,
          community_id: community_id,
          room_id:id
        },
        callback(){
          setTimeout(()=>{
            dispatch({
              type:"BillsAddModel/concat",
              payload:{
                cardItem:[
                  {
                    type:"",
                    time:"",
                    // start:"",
                    // end:"",
                    // water:"",
                    amount:"",
                    index:0
                  }
                ]
              }
            })
          },2000)
        }
      })
    })
  }
  return (
    <div>
      <Breadcrumb separator=">">
        <Breadcrumb.Item>计费管理</Breadcrumb.Item>
        <Breadcrumb.Item><a href="#/billManage">账单管理</a></Breadcrumb.Item>
        <Breadcrumb.Item>新增账单</Breadcrumb.Item>
      </Breadcrumb>
      <Card>
        <h2>{address?address:''} <span className="ml1 smartFz">物业类型:{property_type?(property_type==1?'住宅':'商铺'):''}</span>
          <span className="ml1 smartFz">收费面积:{charge_area?(charge_area+'m²'):''}</span>
        </h2>
        {
          cardItem.map((item,index)=>{
            return <Card style={{textAlign:"center"}} title={`账单${index+1}`} className="mt1" key={index}>
              <Form>
                <FormItem label="缴费项目" {...formItemLayout} style={{marginTop:'20px'}}>
                  {getFieldDecorator(`type_${index}_${item.index}`, {
                    rules: [{
                      required: true,
                      message: '请选择缴费项目'
                    }],
                    initialValue: item.type?item.type:undefined
                  })(
                    <Select placeholder="请选择缴费项目" onChange={handleChange.bind(this,item,'type',index)}>
                      {serverList.map((value,index)=>{
                        return <Option value={value.key} key={value.key}>{value.label}</Option>
                      })}
                    </Select>
                  )}
                </FormItem>
                <FormItem label="账期时间" {...formItemLayout}>
                  {getFieldDecorator(`time_${index}_${item.index}`, {
                    rules: [{
                      required: true,
                      type:'array',
                      message: "请选择时间"
                    }],
                    initialValue: item.time?([moment(item.time[0],dateFormat), moment(item.time[1],dateFormat)]):undefined
                  })(
                      
                    <RangePicker showToday style={{width:'100%'}} onChange={changeTime.bind(this,item,'time',index)}/>
                  )}
                </FormItem>
                {/* {
                  (item.costType == 2 || item.costType == 3)?
                    <FormItem label="上期读数" {...formItemLayout}>
                      {getFieldDecorator(`start_${index}_${item.index}`, {
                        rules: [{
                          required: true,
                          message: '请输入上期读数(正整数或小数点后两位)',
                          whitespace:true,
                          pattern:/(^[1-9]([0-9]){1,4}\.\d{1,2}$)|(^[1-9]{1,5}\.\d{1,2}$)|(^0\.\d[1-9]$)|(^0\.[1-9]\d?$)|(^[1-9]{1,5}$)|(^[1-9]([0-9]){1,4}$)/
                        }],
                        initialValue:item.start?item.start:undefined
                      })(
                        <Input min={0.01} onChange={changeValue1.bind(this,item,'start',index)} onBlur={unFocus.bind(this,item,'start',index)} max={99999999999.99} placeholder="请输入上期读数"/>
                      )}
                    </FormItem>:""
                } */}
                {/* {
                  (item.costType == 2 || item.costType == 3)?
                    <FormItem label="本期读数" {...formItemLayout}>
                      {getFieldDecorator(`end_${index}_${item.index}`, {
                        rules: [{
                          required: true,
                          message: '请输入本期读数(正整数或小数点后两位)',
                          whitespace:true,
                          pattern:/(^[1-9]([0-9]){1,4}\.\d{1,2}$)|(^[1-9]{1,5}\.\d{1,2}$)|(^0\.\d[1-9]$)|(^0\.[1-9]\d?$)|(^[1-9]{1,5}$)|(^[1-9]([0-9]){1,4}$)/
                        }],
                        initialValue:item.end?item.end:undefined
                      })(
                        <Input min={0.01} max={99999999999.99} onBlur={unFocus1.bind(this,item,'end',index)} onChange={changeValue.bind(this,item,'end',index)} placeholder="请输入本期读数"/>
                      )}
                    </FormItem>:""
                } */}
                {/* {
                  (item.costType == 2 || item.costType == 3)?
                    <FormItem label={item.costType == 2?'用水量':'用电量'} {...formItemLayout}>
                      {getFieldDecorator(`water_${index}_${item.index}`, {
                        rules: [{
                          required: true,
                          message: item.costType==2?'请输入用水量':'请输入用电量',
                        }],
                        initialValue:item.water
                      })(
                        <Input min={0.01} onChange={changedInputValue.bind(this,'amount',index)} disabled={true} max={99999999999.99} placeholder={item.costType == 2?'请输入用水量':'请输入用电量'}/>
                      )}
                    </FormItem>:""
                } */}
                <FormItem label="应缴金额" {...formItemLayout}>
                  {getFieldDecorator(`amount_${index}_${item.index}`, {
                    rules: [{
                      required: true,
                      message: '请输入应缴金额(正整数或小数点后两位)',
                      pattern:/(^[1-9]([0-9]){1,4}\.\d{1,2}$)|(^[1-9]{1,5}\.\d{1,2}$)|(^0\.\d[1-9]$)|(^0\.[1-9]\d?$)|(^[1-9]{1,5}$)|(^[1-9]([0-9]){1,4}$)/
                    }],
                    initialValue:item.amount
                  })(
                    <Input onChange={changedInputValue.bind(this,'amount',index)} placeholder="请输入应缴金额"/>
                  )}
                </FormItem>
              </Form>
              {
                (cardItem.length==1?"":<div style={{textAlign:'right'}}>
                  <a className="mt1" onClick={remove.bind(this,index)}>删除</a>
                </div>)
              }
            </Card>
          })
        }
        {
          <div className="center">
            <Button className="ink-btn mt1" onClick={handleAdd.bind(this)} type="dashed"><Icon type="plus" />添加账单</Button>
          </div>
        }
        <FormItem wrapperCol={{offset: 4 }}>
          <Button type="ghost" onClick={handleBack}>返回</Button>
          <Button type="primary" className="ml1" onClick={handleSubmit.bind(this)}>提交</Button>
        </FormItem>
      </Card>
    </div>
  )
}

function mapStateToProps(state) {
  return {
    ...state.BillsAddModel,
    loading: state.loading.models.BillsAddModel,
  }
}
export default connect(mapStateToProps)(Form.create()(BillsAdd));
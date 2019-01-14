import React from 'react'
import { Breadcrumb, Steps, Card, Button, Form, notification } from 'antd';
import { connect } from 'dva';
import Step1 from './components/generateBill/Step1.js';
import Step2 from './components/generateBill/Step2.js';
import Step3 from './components/generateBill/Step3.js';
import { isBuildingsEmpty } from './../../utils/util.js'
const Step = Steps.Step;
import './index.css';
let query = {
  page:1,
  rows:10,
  source:5,
  task_id:"",
  community_id:"",
}
function GenerateBill(props) {
  const { form, dispatch, current, buildings, plainOptions, calcList, cycle_days, costList, year, cycleType, push_type, cycle_Type, pushType, buildings2, selectorsLoading,getMonthList,timeArrList,loading,taSkId,tableData,tableTotals,tableAmount } = props;
  const generateBill = { plainOptions, calcList, year, cycleType, push_type, costList, cycle_days, cycle_Type, pushType }
  const steps = [{
    title: '选择楼幢',
    content: <Step1 buildings={buildings} dispatch={dispatch} buildings2={buildings2} selectorsLoading={selectorsLoading} />,
  }, {
    title: '账单设置',
    content: <Step2 dispatch={dispatch} from={form} generateBill={generateBill} />,
  }, {
    title: '推送账单',
    content: <Step3 dispatch={dispatch} tableData={tableData} loading={loading} tableTotals={tableTotals} tableAmount={tableAmount} taSkId={taSkId} />,
  }];
  function onNext(mark,e) {
    if (mark == "step1") {
      if (isBuildingsEmpty(buildings2)) {
        notification['warning']({
          key: 'selectBuildings',
          message: '请选择楼幢',
          description: '',
          duration: 2,
        })
      } else {
        if (current < 2) {
          dispatch({
            type: "GenerateBillModel/concat",
            payload: {
              current: current + 1
            }
          })
        }
      }
    }else if(mark == "step2"){
      e.preventDefault();
      let arr = [];
      buildings2.map(items=>{
        if(items.children.length != 0){
          arr.push(items);
        }
      })
      for(let i = 0;i < arr.length;i++){
        arr[i].children.map((value, index) => {
          if(arr[i].children.length != 0){
            arr[i].children[index] = {name: value};
          }
        })
      }
      props.form.validateFields((err,values)=>{
        values.timeArrList = timeArrList;
        dispatch({
          type:"GenerateBillModel/concat",
          payload:{
            timeArrList:getMonthList
          }
        })
        values.timeArrList = getMonthList;
        values.community_id = sessionStorage.getItem('communityId');
        values.buildings = arr;
        if(!err){
          dispatch({
            type:"GenerateBillModel/createBatchBill",
            payload:values,
            callBack(val){
              query.community_id = sessionStorage.getItem('communityId')
              query.task_id = val.task_id
              dispatch({
                type:"GenerateBillModel/billdetailList",
                payload:query
              })
            }
          })
        }
      })
    }else if(mark == "step3"){
      dispatch({
        type:"GenerateBillModel/pushBill",
        payload:{
          community_id:sessionStorage.getItem('communityId'),
          task_id:taSkId,
        }
      })
    }

  }
  function onCancel(mark) {
    if (mark == "step1") {
      location.href = '#/billManage'
    }else if(mark == "step2"){
      const current = 0;
      dispatch({
        type: "GenerateBillModel/concat",
        payload: {
          current: current,
          buildings2:[],
        }
      })
    }else if(mark == "step3"){
      dispatch({
        type: "GenerateBillModel/recallBill",
        payload: {
          task_id: taSkId,
        },
        callBack(){
          dispatch({
            type: "GenerateBillModel/concat",
            payload: {
              buildings2:[],
            }
          })
        }
      })
    }
  }
  return (
    <div className="generateBill">
      <Breadcrumb separator=">">
        <Breadcrumb.Item>收费管理</Breadcrumb.Item>
        <Breadcrumb.Item><a href="#/billManage">账单管理</a></Breadcrumb.Item>
        <Breadcrumb.Item>生成账单</Breadcrumb.Item>
      </Breadcrumb>
      <Card className="y-m-b-20">
        <Steps current={current}>
          {steps.map(item => <Step key={item.title} title={item.title} />)}
        </Steps>
      </Card>
      <Card title="楼幢信息">
        <div>
          {steps[current].content}
        </div>
        <div className="text-center y-m-t-20">
          {
            current < 1
            &&
            <div>
              <Button type="primary" className="y-m-l-10" onClick={onNext.bind(this, "step1")}>下一步</Button>
              <Button className="y-m-l-10" onClick={onCancel.bind(this, "step1")}>取消</Button>
            </div>
          }
          {
            current === 1
            &&
            <div>
              <Button loading={loading} type="primary" className="y-m-l-10" onClick={onNext.bind(this,"step2")}>生成账单</Button>
              <Button className="y-m-l-10" onClick={onCancel.bind(this,"step2")}>取消</Button>
            </div>
          }
          {
            current > 1
            &&
            <div style={{marginTop:"20px"}}>
              <Button type="primary" className="y-m-l-10" onClick={onNext.bind(this,"step3")}>推送账单</Button>
              <Button loading={loading} className="y-m-l-10" onClick={onCancel.bind(this,"step3")}>取消</Button>
            </div>
          }
        </div>
      </Card>
    </div>
  )
}
function mapStateToProps(state) {
  return {
    ...state.GenerateBillModel,
    loading: state.loading.models.GenerateBillModel,
  }
}
export default connect(mapStateToProps)(Form.create()(GenerateBill));

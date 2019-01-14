import React from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Breadcrumb, Card } from 'antd';
import { Link } from 'react-router-dom';
import './BatchAddEditBuildingTwo.less';
import deleImg from '../../../static/images/delet.png'
const FormItem = Form.Item;
let building_rule = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
let rmId=[];
function BatchAddEditBuildingTwo(props) {
  let { dispatch, form, loading,id,type,flag,deleteId} = props;
  const { getFieldDecorator } = form;
  let buildingInfo = window.localStorage.getItem('buildingInfo_5.5')?JSON.parse(window.localStorage.getItem('buildingInfo_5.5')):{};
  let groupId = window.localStorage.getItem('groupId_5.5')?JSON.parse(window.localStorage.getItem('groupId_5.5')):'';
  //console.log(typeof JSON.parse(groupId),'k')
  /**
   * 新增/编辑 表单提交
   */
  function handleSubmit(){
    //console.log(groupArr,'groupArr')
    let leg = groupArr.length
    for (let i = leg - 1; i >= 0; i--) {
      for (let j = 0,len = deleteId.length; j < len; j++) {
        if (groupArr[i]) {
          if (groupArr[i].id === deleteId[j]) {
            groupArr.splice(i, 1)
            continue; //结束当前本轮循环，开始新的一轮循环
          }
        }
      }
    }
    let arr1=[];
    groupArr?groupArr.map((item,index)=>{
      arr1.push(item.id)
    }):''
    form.validateFields(arr1,(err,val)=>{
      if(err){
        return;
      }
      const param = val;
      let arr = [];
      for(let item in param){
        let str = param[item]
        arr.push(str.replace(/幢/g, '幢-'))
      }
      //console.log(arr,'arr')
      dispatch({
        type:'BatchAddEditBuildingTwoModel/batchAddBuilding',
        payload:{
          unit:arr,
          group_id:groupId?groupId:'',
        },
        callBack:()=>{
          window.localStorage.removeItem('buildingInfo_5.5')
          window.localStorage.removeItem('groupId_5.5')
          window.location.href = "#/buildingManagement";
        },
        err:(errorList)=>{
          if(errorList&&Array.isArray(errorList)){
            let valArr = [];
            for(let item in val){
              valArr.push({
                id:item,
                name:val[item]
              })
            }
            errorList.map((item,index)=>{
              valArr.length>0?valArr.map((item1,index1)=>{
                if(item === item1.name){
                  valArr.splice(index1,1)
                  let submitObj = document.getElementById(item1.id);
                  submitObj.style.color = 'red';
                }
              }):''
            })
            valArr.length>0?valArr.map((item,k)=>{
              let submitObj = document.getElementById(item.id);
              submitObj.style.color = '#000000';
            }):''
          }
        }
      })
    })
  }
  function editBuilding(){
    form.validateFields((err,val)=>{
      if(err){
        return;
      }
      dispatch({
        type:'BatchAddEditBuildingTwoModel/concat',
        payload:{
          type:!type,
        }
      })
    })
  }
  function removeBuilding(){
    dispatch({
      type:'BatchAddEditBuildingTwoModel/concat',
      payload:{
        flag:!flag,
      }
    })
  }
  /**
   * 删除
   * @param {*} e 
   */
  function deleteInfo(e){
    rmId.push(e)
    let self = document.getElementById(e+'_id')
    // 拿到父节点:
    let parent = self.parentElement;
    //console.log(parent,'parent')
    // 删除:
    let removed = parent.removeChild(self);
    removed === self; // true
    dispatch({
      type:'BatchAddEditBuildingTwoModel/concat',
      payload:{
        deleteId:rmId,
      }
    })
  }

  function onChangeVal(k,e){
    const { value } = e.target;
    let arrid=[];
    groupArr&&groupArr.length>0?groupArr.map((item,index)=>{
      let id = item.id;
      let kId = 'building'+id.split('_')[1]
      let aId = 'group'+id.split('_')[1]
      if(arrid.indexOf(aId)== -1){
        arrid.push(aId)
      }
      let key = item.id;
      if(kId === k){
        form.validateFields(arrid,(err,val)=>{
          let cId = key.split('_')[0]
          for(let a in val){
            if(cId == a){
              form.setFieldsValue({
                [key]: `${value}幢${val[a]}单元`,
              });
            }
          }
        })
      }
    }):''
  }
  function onChangeVal1(k,e){
    const { value } = e.target;
    let arrid=[];
    groupArr&&groupArr.length>0?groupArr.map((item,index)=>{
      let id = item.id;
      let cutStr = id.substr(5,1)
      let kId = 'group'+cutStr
      let aId = 'building'+id.split('_')[1]
      arrid.push(aId)
      let key = item.id;
      if(kId === k){
        form.validateFields(arrid,(err,val)=>{
          form.setFieldsValue({
            [key]: `${val[aId]}幢${value}单元`,
          });
        })
      }
    }):''
  }
  /**
   * 返回
   */
  function handleBack(){
    history.go(-1);
  }
  function getArray(){
    let items = [];
    let items1 = [];
    let groupArr = [];
    function getItems(){
      for(let i=0,len=Number(buildingInfo.building);i<len;i++){
        if(i<26){
          items.push(building_rule[i])
        }else if(i>=26&&i<52){
          items.push(building_rule[i-26]+'1')
        }else if(i>=52&&i<78){
          items.push(building_rule[i-2*26]+'2')
        }else if(i>=78&&i<100){
          items.push(building_rule[i-3*26]+'3')
        }
      }
      return items;
    }
    function getItems1(){
      for(let i=0,len=Number(buildingInfo.unit);i<len;i++){
        if(buildingInfo.unit_rule===1){
          items1.push(i)
        }else{
          items1.push(building_rule[i])
        }
      }
      return items1;
    }
    function getGroupArr(){
      for(let i=0,len=items1.length;i<len;i++){
        if(buildingInfo.unit_rule===2){
          for(let j=0,len1=items.length;j<len1;j++){
            groupArr.push({
              id:`group${i}_${j}`,
              name:`${buildingInfo.building_rule===2?items[j]:j+1}幢${building_rule[i]}单元`,
            })
          }
        }else if(buildingInfo.unit_rule===1){
          for(let j=0,len2=items.length;j<len2;j++){
            groupArr.push({
              id:`group${i}_${j}`,
              name:`${buildingInfo.building_rule===2?items[j]:j+1}幢${i+1}单元`,
            })
          }
        }
      }
      return groupArr;
    }
    return {
      getItems:getItems,
      getItems1:getItems1,
      getGroupArr:getGroupArr
    }
  }
  let itemArray=getArray();
  let items = Array.from(itemArray.getItems());
  let items1 = Array.from(itemArray.getItems1());
  let groupArr = Array.from(itemArray.getGroupArr());
  return (
    <div className="batchAddEditBuildingTwo">
      <Breadcrumb separator=">">
        <Breadcrumb.Item>小区管理</Breadcrumb.Item>
        <Breadcrumb.Item><Link to="/buildingManagement">楼宇管理</Link></Breadcrumb.Item>
        <Breadcrumb.Item>批量{id?'编辑':'新增'}楼宇</Breadcrumb.Item>
      </Breadcrumb>
      <Card className="section">
        <Form>
          <FormItem>
            <Button disabled={type} onClick={removeBuilding} type="primary">{flag?'完成':'删除'}</Button>
            <Button disabled={flag} onClick={editBuilding} type="primary" className="ml1" loading={loading}>{type?'完成':'编辑'}</Button>
          </FormItem>
        </Form>
        <div className="table_box_big">
          <table className="tableList">
            <thead>
              <tr>
                <th>单元\幢</th>
                {
                  items1&&items.length>0?items.map((item,index)=>{
                    if(buildingInfo.building_rule===2){
                      return <th className="building_bg" key={index}>
                        <Form>
                          <FormItem>
                            {getFieldDecorator(`building${index}`,{
                              rules: [{pattern:/^[A-Za-z0-9\u4e00-\u9fa5]+$/,message: '格式不正确'}],
                              initialValue: item
                            })(
                              <Input maxLength={17} onChange={onChangeVal.bind(this,`building${index}`)} disabled={type?false:true}/>
                              //<Input onBlur={(e) => onChangeVal(e,index+1,`building${index}`)} disabled={type?false:true}/>
                            )}
                          </FormItem>
                        </Form>
                      </th>
                    }else if(buildingInfo.building_rule===1){
                      return <th className="building_bg" key={index}>
                        <Form>
                          <FormItem>
                            {getFieldDecorator(`building${index}`,{
                              rules: [{pattern:/^[A-Za-z0-9\u4e00-\u9fa5]+$/,message: '格式不正确'}],
                              initialValue: index+1
                            })(
                              <Input maxLength={17} onChange={onChangeVal.bind(this,`building${index}`)} disabled={type?false:true}/>
                              //<Input onBlur={(e) => onChangeVal(e,index+1,`building${index}`)} disabled={type?false:true}/>
                            )}
                          </FormItem>
                        </Form>
                      </th>;
                    }
                  }):''
                }
              </tr>
            </thead>
            <tbody>
              {
                items1&&items1.length>0&&Array.isArray(items1)?items1.map((item,index)=>{
                  if(buildingInfo.unit_rule===2){
                    return <tr key={index}>
                      <td className="building_bg left_fixation">
                        <Form>
                          <FormItem>
                            {getFieldDecorator(`group${index}`,{
                              rules: [{pattern:/^[A-Za-z0-9\u4e00-\u9fa5]+$/,message: '格式不正确'}],
                              initialValue: building_rule[index]
                            })(
                              <Input maxLength={17} onChange={onChangeVal1.bind(this,`group${index}`)} disabled={type?false:true}/>
                              //<Input onBlur={(e) => onChangeVal(e,building_rule[index],`group${index}`)} disabled={type?false:true}/>
                            )}
                          </FormItem>
                        </Form>
                      </td>
                      {
                        items&&items.length>0&&Array.isArray(items)?items.map((item1,index1)=>{
                          return <td key={index1}>
                            <div className="unit_bg" id={`group${index}_${index1}_id`}>
                              {flag?<img className="icon" src={deleImg} onClick={deleteInfo.bind(this,`group${index}_${index1}`)} />:null}
                              <Form>
                                <FormItem>
                                  {getFieldDecorator(`group${index}_${index1}`,{
                                    //rules: [{required: true,pattern:/幢/g, message: '格式不正确'}],
                                    rules: [{pattern:/^[A-Za-z0-9\u4e00-\u9fa5]+$/,message: '格式不正确'}],
                                    initialValue: `${buildingInfo.building_rule===2?item1:index1+1}幢${building_rule[index]}单元`
                                  })(
                                    <Input maxLength={20} disabled={type?false:true}/>
                                  )}
                                </FormItem>
                              </Form>
                            </div>
                          </td>
                        }):''
                      }
                    </tr>
                  }else if(buildingInfo.unit_rule===1){
                    return <tr key={index}>
                      <td className="building_bg left_fixation">
                        <Form>
                          <FormItem>
                            {getFieldDecorator(`group${index}`,{
                              rules: [{pattern:/^[A-Za-z0-9\u4e00-\u9fa5]+$/,message: '格式不正确'}],
                              initialValue: index+1
                            })(
                              <Input maxLength={17} onChange={onChangeVal1.bind(this,`group${index}`)} disabled={type?false:true}/>
                              //<Input onBlur={(e) => onChangeVal(e,index+1,`group${index}`)} disabled={type?false:true}/>
                            )}
                          </FormItem>
                        </Form>
                      </td>
                      {
                        items&&items.length>0&&Array.isArray(items)?items.map((item1,index1)=>{
                          return <td key={index1}>
                            <div className="unit_bg" id={`group${index}_${index1}_id`}>
                              {flag?<img className="icon" src={deleImg} onClick={deleteInfo.bind(this,`group${index}_${index1}`)} />:null}
                              <Form>
                                <FormItem>
                                  {getFieldDecorator(`group${index}_${index1}`,{
                                    //rules: [{required: true,pattern:/幢/g, message: '格式不正确'}],
                                    rules: [{pattern:/^[A-Za-z0-9\u4e00-\u9fa5]+$/,message: '格式不正确'}],
                                    initialValue: `${buildingInfo.building_rule===2?item1:index1+1}幢${index+1}单元`
                                  })(
                                    <Input maxLength={20} disabled={type?false:true}/>
                                  )}
                                </FormItem>
                              </Form>
                            </div>
                          </td>
                        }):''
                      }
                    </tr>
                  }
                }):''
              }
            </tbody>
          </table>
        </div>
        <Form className="mt1">
          <FormItem>
            <Button type="ghost" onClick={handleBack.bind(this)}>上一步</Button>
            <Button disabled={type||flag} type="primary" className="ml1" onClick={handleSubmit.bind(this)} loading={loading}>完成</Button>
          </FormItem>
        </Form>
      </Card>
    </div>
  );
}

function mapStateToProps(state) {
  return {...state.BatchAddEditBuildingTwoModel, loading: state.loading.models.BatchAddEditBuildingTwoModel };
}
export default connect(mapStateToProps)(Form.create()(BatchAddEditBuildingTwo));

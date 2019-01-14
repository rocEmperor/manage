import React from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Breadcrumb, Card, Radio,Select,Cascader } from 'antd';
import { Link } from 'react-router-dom';
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
let hasSubmit = false;
function AddHouse(props) {
  let { dispatch, form, loading, floorList, liftList, type, id, info, labelType,groupData,buildingData,groupId,unitData,options } = props;
  const { getFieldDecorator } = form;
  //console.log(options,buildingData,'unitData')
  /**
   * 新增/编辑 表单提交
   */
  function handleSubmit(e){
    form.validateFields((err, values) => {
      //console.log(values,'values')
      if (err) {
        return;
      }
      floorList?floorList.map(item=>{
        if(item.name == values.floor_shared_id) {
          values.floor_shared_id = item.id;
        }
      }):''
      liftList?liftList.map(items=>{
        if(items.name == values.lift_shared_id) {
          values.lift_shared_id = items.id;
        }
      }):'';
      let a;
      let b;
      buildingData?buildingData.map(items=>{
        //console.log(items,'items')
        if(items.value == values.building[0]) {
          a = items.label;
        }
      }):'';
      unitData?unitData.map(items=>{
        if(items.value == values.building[1]) {
          b = items.label;
        }
      }):'';
      //console.log(values.building,a,b,'k')
      if(!hasSubmit){
        dispatch({
          type: 'AddHouseModel/houseCreate',
          payload: {
            group:values.group,
            building:info?info.building:a,
            unit:info?info.unit:b,
            room_code:values.room_code,
            floor:values.floor,
            room:values.room,
            charge_area:values.charge_area,
            status:values.status,
            property_type:values.property_type,
            intro:values.intro,
            community_id: sessionStorage.getItem("communityId"),
            floor_shared_id: values.floor_shared_id,
            lift_shared_id: values.lift_shared_id,
            is_elevator: values.is_elevator,
            floor_coe: values.floor_coe,
            room_label_id: values.room_label_id,
            id: info.id
          },
          callback: () => {
            hasSubmit = false;
            window.location.href = "#/houseManagement";
          },
          err: () => {
            hasSubmit = false;
          }
        });
      }

    })
  }
  /**
   * 返回
   */
  function handleBack(){
    history.go(-1);
  }
  /**
   * 选择是否需要电梯
   * @param  {String} value
   * value = 0 请选择
   * value = 1 是
   * value = 2 否
   */
  function handleChange(value){
    dispatch({
      type: 'AddHouseModel/concat',
      payload: {
        type: value
      }
    })
  }

  function selectChange(mark, val){
    //console.log(mark, val,'p')
    //query[mark] = val;
    if (mark === 'group') {
      // form.resetFields(['unit',]);
      // query.building = undefined;
      // query.unit = undefined;
      let groupId;
      groupData&&groupData.length>0?groupData.map((item,index)=>{
        if(item.group_name === val){
          groupId=item.group_id
        }
      }):''
      dispatch({
        type: 'AddHouseModel/concat',
        payload: {
          groupId:groupId,
        }
      })
      dispatch({
        type: 'AddHouseModel/getBuildingList',
        payload: {
          group_id:groupId,
        }
      })
    }
  }
  function loadData(selectedOptions){
    dispatch({
      type: 'AddHouseModel/getUnitList',
      payload: {
        building_id:selectedOptions[0].value,
        group_id:groupId,
      },
      callBack:(unitArr)=>{
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.children =unitArr;
        dispatch({
          type:'concat',
          payload:{
            buildingData: [...buildingData],
          }
        })
      }
    })
  }
  // 布局
  const formItemLayout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 7 },
  };

  return (
    <div>
      <Breadcrumb separator=">">
        <Breadcrumb.Item>小区管理</Breadcrumb.Item>
        <Breadcrumb.Item><Link to="/houseManagement">房屋管理</Link></Breadcrumb.Item>
        <Breadcrumb.Item>{id?'编辑':'新增'}房屋</Breadcrumb.Item>
      </Breadcrumb>
      <Card className="section">
        <Form>
          <FormItem label="苑/期/区：" {...formItemLayout}>
            {getFieldDecorator('group',{
              rules: [{required: true, message: '请选择苑/期/区'}],
              initialValue: info.group
            })(
              <Select disabled={id?true:false} showSearch={true} onChange={(val) => selectChange('group', val)} notFoundContent="没有数据" placeholder="请选择">
                {groupData&&Array.isArray(groupData)?groupData.map((value, index) => {
                  return <Option key={index} value={value.group_name}>{value.group_name}</Option>
                }):''}
              </Select>
            )}
          </FormItem>
          <FormItem label="楼宇：" {...formItemLayout} required >
            {getFieldDecorator('building', {
              rules: [{required: true, message: '请输入楼宇号'}],
              initialValue: options
            })(
              // <Select showSearch={true} onChange={(val) => selectChange('building', val)} notFoundContent="没有数据" placeholder="请选择">
              //   {buildingData.map((value, index) => {
              //     return <Option key={index} value={value.building_name}>{value.building_id}</Option>
              //   })}
              // </Select>
              <Cascader disabled={id?true:false} loadData={loadData} options={buildingData} notFoundContent="没有数据" placeholder="请选择" />,
            )}
          </FormItem>
          <FormItem label="室号：" {...formItemLayout} required >
            {getFieldDecorator('room', {
              rules: [{required: true, message: '请输入室号'}],
              initialValue: info.room
            })(
              <Input disabled={id?true:false} placeholder="请输入室号（最多20位）" maxLength={20}/>
            )}
          </FormItem>
          <FormItem label="室号编码：" {...formItemLayout} >
            {getFieldDecorator('room_code', {
              rules: [{pattern:/^[0-9]\d*$/, message: '请输入室号编码（4位以内正整数）'}],
              initialValue: info.room_code
            })(
              <Input maxLength={4} placeholder="请输入室号编码（4位以内正整数）"/>
            )}
          </FormItem>
          <FormItem label="楼层：" {...formItemLayout} >
            {getFieldDecorator('floor', {
              rules: [{pattern:/^[0-9]\d*$/, message: '请输入楼层（2位以内正整数）'}],
              initialValue: info.floor
            })(
              <Input maxLength={2} placeholder="请输入楼层（最多2位）"/>
            )}
          </FormItem>
          {/* <FormItem label="幢：" {...formItemLayout} required >
            {getFieldDecorator('building', {
              rules: [{required: true, message: '请输入幢号'}],
              initialValue: info.building
            })(
              <Input disabled={id?true:false} maxLength={20} placeholder="请输入幢号（最多20位）"/>
            )}
          </FormItem>
          <FormItem label="单元：" {...formItemLayout} required >
            {getFieldDecorator('unit',{
              rules: [{required: true, message: '请输入单元号'}],
              initialValue: info.unit
            })(
              <Input disabled={id?true:false} placeholder="请输入单元号（最多20位）" maxLength={20}/>
            )}
          </FormItem> */}
          <FormItem label="楼段系数：" {...formItemLayout} >
            {getFieldDecorator('floor_coe',{
              initialValue:info.floor_coe
            })(<Input placeholder="请输入楼段系数（最多20位）" maxLength="20"/>)}
          </FormItem>
          <FormItem {...formItemLayout} label="是否需要电梯:">
            {getFieldDecorator('is_elevator',{
              initialValue: info.is_elevator
            })(
              <Select onChange={handleChange.bind(this)} placeholder="请选择是否需要电梯">
                <Option key={1} value="1">是</Option>
                <Option key={2} value="2">否</Option>
              </Select>
            )}
          </FormItem>
          <FormItem label="楼道号：" {...formItemLayout} >
            {getFieldDecorator('floor_shared_id',{
              initialValue: info.floor_shared_id
            })(
              <Select
                optionFilterProp="children"
                showSearch
                placeholder="请选择楼道号"
              >
                {floorList?floorList.map((item)=>{
                  return <Option key={item.id} value={item.name}>{item.name}</Option>
                }):null}
              </Select>
            )}
          </FormItem>
          {info.is_elevator==1&&type!=2||type==1?
            <FormItem label="电梯编号：" {...formItemLayout} required >
              {getFieldDecorator('lift_shared_id',{
                rules: [{required: true, message: '请输入电梯编号'}],
                initialValue: info.lift_shared_id
              })(
                <Select
                  optionFilterProp="children"
                  showSearch
                  placeholder="请选择电梯编号"
                >
                  {liftList?liftList.map((item)=>{
                    return <Option key={item.id} value={item.name}>{item.name}</Option>
                  }):null}
                </Select>
              )}
            </FormItem>:null
          }
          <FormItem label="房屋标签：" {...formItemLayout}>
            {getFieldDecorator('room_label_id', {
              initialValue: info.room_label_id
            })(
              <Select
                optionFilterProp="children"
                showSearch
                mode="multiple"
                placeholder="请选择房屋标签"
              >
                {labelType ? labelType.map((item) => {
                  return <Option key={item.id} value={item.id}>{item.name}</Option>
                }) : null}
              </Select>
            )}
          </FormItem>
          <FormItem label="收费面积（m²）：" {...formItemLayout} required>
            {getFieldDecorator('charge_area', {
              rules: [{required: true, type: 'string',pattern:/(^[0-9]{1,5}$)|(^[0-9]{1,5}[\\.]{1}[0-9]{1,2}$)/, message: '收费面积输入错误（最多5位整数加2位小数）'}],
              initialValue: info.charge_area
            })(
              <Input disabled={id?true:false} min={0} max={99999.99} step={0.01} placeholder="请输入收费面积（最多5位整数加2位小数）"/>
            )}
          </FormItem>
          <FormItem label="房屋状态：" {...formItemLayout} >
            {getFieldDecorator('status', {
              initialValue: info.status?info.status:'1'
            })(
              <RadioGroup><Radio value="1" disabled={id?true:false}>已售</Radio><Radio value="2" disabled={id?true:false}>未售</Radio></RadioGroup>
            )}
          </FormItem>
          <FormItem label="物业类型：" {...formItemLayout} >
            {getFieldDecorator('property_type', {
              initialValue: info.property_type?info.property_type:'1'
            })(
              <RadioGroup>
                <Radio value="1" disabled={id?true:false}>住宅</Radio>
                <Radio value="2" disabled={id?true:false}>商用</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem label="备注：" {...formItemLayout}>
            {getFieldDecorator('intro',{
              initialValue: info.intro
            })(
              <TextArea disabled={id?true:false} row={4} type="textarea" maxLength={200} placeholder="最多200字"/>
            )}
          </FormItem>
          <FormItem wrapperCol={{span: 12, offset: 3}}>
            <Button type="primary" onClick={handleSubmit.bind(this)} loading={loading}>提交</Button>
            <Button type="ghost"  className="ml1" onClick={handleBack.bind(this)}>返回</Button>
          </FormItem>
        </Form>
      </Card>
    </div>
  );
}

function mapStateToProps(state) {
  return {...state.AddHouseModel, loading: state.loading.models.AddHouseModel };
}
export default connect(mapStateToProps)(Form.create()(AddHouse));

import React from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Breadcrumb, Card,Select,Row,Col } from 'antd';
import { Link } from 'react-router-dom';
const FormItem = Form.Item;
const Option = Select.Option;
function AddEditBuilding(props) {
  let { dispatch, form, loading,unit_id,groupData,info,groupInfo} = props;
  //console.log(groupInfo,'info')
  const { getFieldDecorator } = form;
  /**
   * 新增/编辑 表单提交
   */
  function handleSubmit(){
    form.validateFields((err,values)=>{
      if(err){
        return;
      }
      groupData.map((item,index)=>{
        if(values.group_id === item.group_name){
          values.group_id=item.group_id;
        }
      })
      if(unit_id){
        dispatch({
          type:'AddEditBuildingModel/buildingEdit',
          payload:{
            building_code:values.building_code,
            building_name:values.building_name,
            group_id:values.group_id,
            unit_code:values.unit_code,
            unit_id:unit_id,
            unit_name:values.unit_name,
          },
          callBack:()=>{
            window.location.href = "#/buildingManagement";
          }
        })
      }else {
        dispatch({
          type:'AddEditBuildingModel/buildingAdd',
          payload:{
            building_code:values.building_code,
            building_name:values.building_name,
            group_id:values.group_id,
            unit_code:values.unit_code,
            unit_name:values.unit_name,
          },
          callBack:()=>{
            window.location.href = "#/buildingManagement";
          }
        })
      }
    })
  }
  /**
   * 返回
   */
  function handleBack(){
    history.go(-1);
  }
  function handleArea(){
    window.location.hash = '/areaManagement'
  }
  // 布局
  const formItemLayout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 7 },
  };
  const formItemLayout1 = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };
  return (
    <div>
      <Breadcrumb separator=">">
        <Breadcrumb.Item>小区管理</Breadcrumb.Item>
        <Breadcrumb.Item><Link to="/buildingManagement">楼宇管理</Link></Breadcrumb.Item>
        <Breadcrumb.Item>{unit_id?'编辑':'新增'}楼宇</Breadcrumb.Item>
      </Breadcrumb>
      <Card className="section">
        <Form>
          <Row>
            <Col span={12}>
              <FormItem label="苑/期/区：" {...formItemLayout1}>
                {getFieldDecorator('group_id',{
                  initialValue: groupInfo?groupInfo:''
                })(
                  <Select disabled={unit_id?true:false} showSearch={true} notFoundContent="没有数据" placeholder="请选择">
                    {groupData&&Array.isArray(groupData)?groupData.map((value, index) => {
                      return <Option key={index} value={value.group_name}>{value.group_name}</Option>
                    }):''}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col>
              <Button onClick={handleArea} type="primary">区域管理</Button>
            </Col>
          </Row>
          <FormItem label="幢号：" {...formItemLayout} required >
            {getFieldDecorator('building_name', {
              rules: [{required: true,pattern:/^[A-Za-z0-9\u4e00-\u9fa5]+$/,message: '请输入幢号(18字以内的数字、字母、文字！)'}],
              initialValue: info.building_name
            })(
              <Input disabled={unit_id?true:false}  maxLength={18} placeholder="请输入幢号（18字以内的数字、字母、文字！）"/>
            )}
          </FormItem>
          <FormItem label="幢编号：" {...formItemLayout} >
            {getFieldDecorator('building_code', {
              rules: [{ pattern:/^[0-9]\d*$/,message: '请输入幢编号(3字以内的正整数)'}],
              initialValue: info.building_code
            })(
              <Input maxLength={3} placeholder="请输入幢编号(3字以内的正整数)"/>
            )}
          </FormItem>
          <FormItem label="单元：" {...formItemLayout} required >
            {getFieldDecorator('unit_name',{
              rules: [{required: true,pattern:/^[A-Za-z0-9\u4e00-\u9fa5]+$/, message: '请输入单元号（18字以内的数字、字母、文字！）'}],
              initialValue: info.unit_name
            })(
              <Input disabled={unit_id?true:false} placeholder="请输入单元号（18字以内的数字、字母、文字！）" maxLength={18}/>
            )}
          </FormItem>
          <FormItem label="单元编号：" {...formItemLayout} >
            {getFieldDecorator('unit_code',{
              rules: [{ pattern:/^[0-9]\d*$/,message: '请输入单元编号(2字以内的正整数)'}],
              initialValue: info.unit_code
            })(
              <Input placeholder="请输入单元编号(2字以内的正整数)" maxLength={2}/>
            )}
          </FormItem>
          <FormItem wrapperCol={{span: 12, offset: 3}}>
            <Button type="primary" onClick={handleSubmit.bind(this)} loading={loading}>提交</Button>
            <Button type="ghost" className="ml1" onClick={handleBack.bind(this)}>放弃修改</Button>
          </FormItem>
        </Form>
      </Card>
    </div>
  );
}

function mapStateToProps(state) {
  return {...state.AddEditBuildingModel, loading: state.loading.models.AddEditBuildingModel };
}
export default connect(mapStateToProps)(Form.create()(AddEditBuilding));

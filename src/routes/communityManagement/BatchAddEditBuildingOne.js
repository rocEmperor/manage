import React from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Breadcrumb, Card,Select,Row,Col } from 'antd';
import { Link } from 'react-router-dom';
const FormItem = Form.Item;
const Option = Select.Option;

function BatchAddEditBuildingOne(props) {
  let { form, loading,id,groupData} = props;
  const { getFieldDecorator } = form;
  let buildingInfo = window.localStorage.getItem('buildingInfo_5.5')?JSON.parse(window.localStorage.getItem('buildingInfo_5.5')):{};
  /**
   * 下一步
   */
  function handleSubmit(){
    form.validateFields((err,val)=>{
      if(err){
        return;
      }
      const params = val;
      let group_id;
      groupData.map((item,index)=>{
        if(item.group_name === val.group){
          group_id=item.group_id;
        }
      })
      window.localStorage.setItem("buildingInfo_5.5",JSON.stringify(params))
      window.localStorage.setItem("groupId_5.5",JSON.stringify(group_id?group_id:''))
      window.location.hash = `/batchAddBuildingTwo`;
    })
  }
  /**
   * 返回
   */
  function handleBack(){
    history.go(-1);
  }
  function handleArea(){
    window.location.hash = '/areaManagement';
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
        <Breadcrumb.Item>批量{id?'编辑':'新增'}楼宇</Breadcrumb.Item>
      </Breadcrumb>
      <Card className="section">
        <Form>
          <Row>
            <Col span={12}>
              <FormItem label="苑/期/区：" {...formItemLayout1}>
                {getFieldDecorator('group',{
                  //rules: [{required: true, message: '请选择苑/期/区！'}],
                  initialValue: buildingInfo?buildingInfo.group:''
                })(
                  <Select showSearch={true} notFoundContent="没有数据" placeholder="请选择">
                    {groupData&&groupData.length>0?groupData.map((value, index) => {
                      return <Option key={index} value={value.group_name}>{value.group_name}</Option>
                    }):null}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col>
              <Button onClick={handleArea} type="primary">区域管理</Button>
            </Col>
          </Row>
          <FormItem label="幢数量：" {...formItemLayout} required >
            {getFieldDecorator('building', {
              rules: [{required: true, message: '请输入幢数量(100以内的正整数!)',pattern:/^(?:1|[1-9][0-9]?|100)$/}],
              initialValue: buildingInfo?buildingInfo.building:''
            })(
              <Input maxLength={20} placeholder="请输入"/>
            )}
          </FormItem>
          <FormItem label="幢排序规则：" {...formItemLayout} >
            {getFieldDecorator('building_rule', {
              //rules: [{required: true, message: '请输入幢号'}],
              initialValue:buildingInfo&&buildingInfo.building_rule?Number(buildingInfo.building_rule):1
            })(
              <Select showSearch={true} notFoundContent="没有数据" placeholder="请选择">
                <Option value={1}>数字</Option>
                <Option value={2}>大写字母</Option>
              </Select>
              //<Input maxLength={20} placeholder="请输入幢排序规则"/>
            )}
          </FormItem>
          <FormItem label="每幢/单元数量：" {...formItemLayout} required >
            {getFieldDecorator('unit',{
              rules: [{required: true, message: '请输入每幢/单元数量(10以内的正整数!)',pattern:/^(?:1|[1-9]?|10)$/}],
              initialValue: buildingInfo?buildingInfo.unit:''
            })(
              <Input placeholder="请输入"/>
            )}
          </FormItem>
          <FormItem label="单元排序规则：" {...formItemLayout} >
            {getFieldDecorator('unit_rule',{
              initialValue:buildingInfo&&buildingInfo.unit_rule?Number(buildingInfo.unit_rule):1
            })(
              <Select showSearch={true} notFoundContent="没有数据" placeholder="请选择">
                <Option value={1}>数字</Option>
                <Option value={2}>大写字母</Option>
              </Select>
              //<Input placeholder="请输入"/>
            )}
          </FormItem>
          <FormItem wrapperCol={{span: 12, offset: 3}}>
            <Button type="ghost" onClick={handleBack.bind(this)}>取消</Button>
            <Button type="primary" className="ml1" onClick={handleSubmit.bind(this)} loading={loading}>下一步，调整</Button>
          </FormItem>
        </Form>
      </Card>
    </div>
  );
}

function mapStateToProps(state) {
  return {...state.BatchAddEditBuildingOneModel, loading: state.loading.models.BatchAddEditBuildingOneModel };
}
export default connect(mapStateToProps)(Form.create()(BatchAddEditBuildingOne));

import React from 'react';
import { connect } from 'react-redux';
import { Breadcrumb, Card, Button, Input, Form, DatePicker } from 'antd';
import { getCommunityId } from "../../utils/util";
import queryString from 'query-string';
const FormItem = Form.Item;
import moment from 'moment';
const dateFormat = 'YYYY-MM-DD';

function KarmaAdd (props) {

  let { KarmaAddModel, dispatch, form, location } = props;
  let { info, date1, date } = KarmaAddModel;
  let { getFieldDecorator } = form;
  let queryId = undefined;
  if (location.search.indexOf('id') !== -1) {
    queryId = queryString.parse(location.search);
  }
  /*
  * 新增/编辑业委会提交
  * */
  function handleSubmit () {
    form.validateFields((errors, values) => {
      if (errors) {
        return;
      }
      const communityId = getCommunityId();
      let formDate = {};
      formDate.community_id = communityId;
      formDate.change_at = date1;
      formDate.name = values.name;
      formDate.found_at = date;
      formDate.cycle = values.cycle;
      if(queryId === undefined){
        dispatch({
          type: 'KarmaAddModel/karmaAdd',
          payload: formDate
        })
      } else{
        formDate.id = queryId.id;
        dispatch({
          type: 'KarmaAddModel/karmaEdit',
          payload: formDate
        })
      }
    })
  }
  /*
  * 返回业委会管理页面
  * */
  function handleBack (e) {
    history.back();
  }
  /*
  * 成立日期
  * dateString String
  * */
  function changeData (date, dateString){
    dispatch({
      type: 'KarmaAddModel/concat',
      payload: { date: dateString }
    })
  }
  /*
  * 换届日期
  * dateString String
  * */
  function changeData1 (date, dateString){
    dispatch({
      type: 'KarmaAddModel/concat',
      payload: { date1: dateString }
    })
  }

  const formItemLayout = {
    labelCol: {
      span: 3
    },
    wrapperCol: {
      span: 7
    },
  };
  return (
    <div className="page-content">
      <Breadcrumb separator=">">
        <Breadcrumb.Item>业委会管理</Breadcrumb.Item>
        <Breadcrumb.Item><a href="#/karmaManagement">业委会管理</a></Breadcrumb.Item>
        <Breadcrumb.Item>{queryId === undefined ? "新增" : "编辑"}业委会</Breadcrumb.Item>
      </Breadcrumb>
      <Card className="section">
        <Form>
          {/* <FormItem label="小区名称：" {...formItemLayout}>
                {getFieldDecorator('community_id',{
                    rules:[{required:true,message:'请选择小区名称'}],
                    initialValue: info.community_name?info.community_name:(id==10?'西城时代家园':name)
                })(
                  <Input type="text" disabled maxLength="30" placeholder="请输入小区名称"/>
                )}
            </FormItem> */}
          <FormItem label="业委会名称" {...formItemLayout}>
            {getFieldDecorator('name',
              {rules: [{
                type: "string",
                pattern: /^([\u4e00-\u9fa5a-zA-Z0-9]){2,30}$/,
                required: true,
                message: '格式错误（2-30位数字、字母、文字）'
              }],
              initialValue: info.name ? info.name : undefined})(
              <Input type="text" maxLength="30" placeholder="请输入业委会名称"/>
            )}
          </FormItem>
          <FormItem label="成立日期：" {...formItemLayout}>
            {getFieldDecorator('found_at',{
              initialValue: info.found_at ? moment(info.found_at,dateFormat) : null
            })(
              <DatePicker style={{width:'100%'}} onChange={changeData}/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="任职周期">
            {getFieldDecorator('cycle',
              {rules: [{
                type:'string',
                pattern: /^[0-9]*[1-9][0-9]*$/,message:'请输入正整数'
              }],
              initialValue:info.cycle})(
              <Input placeholder="请输入任职周期" addonAfter="年"/>
            )}
          </FormItem>
          <FormItem label="换届日期" {...formItemLayout}>
            {getFieldDecorator('change_at',{
              initialValue: info.change_at ? moment(info.change_at,dateFormat) : null
            })(
              <DatePicker style={{width:'100%'}} onChange={changeData1}/>
            )}
          </FormItem>
          <FormItem wrapperCol={{span: 22, offset: 3}}>
            <Button type="primary" onClick={handleSubmit}>提交</Button>
            <Button type="ghost" className="ml1" onClick={handleBack}>返回</Button>
          </FormItem>
        </Form >
      </Card>
    </div>
  )
}
export default connect(state => {
  return {
    KarmaAddModel: state.KarmaAddModel,
    layout: state.MainLayout
  }
})(Form.create({})(KarmaAdd));

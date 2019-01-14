import React from 'react';
import { connect } from 'react-redux';
import { Breadcrumb, Card, Select, Button, Input, Form, DatePicker } from 'antd';
import { getCommunityId } from "../../utils/util"
import queryString from 'query-string';
const FormItem = Form.Item;
const Option = Select.Option;
import moment from 'moment';
const dateFormat = 'YYYY-MM-DD';
let query = {
  community_id: '',
  group: '',
  building: '',
  unit: '',
  room: ''
};

function KarmaUserAdd (props) {
  let { KarmaUserAddModel, dispatch, form, location } = props;
  let { info, buildingOption, unitOption, roomOption, karmaUserDropDow, birthdate, groupOption, karmaDropDow } = KarmaUserAddModel;
  let { getFieldDecorator } = form;
  let queryId = undefined;
  let hasSubmit = false;
  if (location.search.indexOf('id') !== -1) {
    queryId = queryString.parse(location.search);
  }
  /*
  * 监听苑/期/区 幢 单元 室 级联列表
  * mark String
  * val String
  * */
  function handleChange (mark, val) {
    query.community_id = getCommunityId();
    query[mark] = val;
    if (mark === 'group') {
      form.setFieldsValue({building: '', unit: '', room: '', room_user_id: ''});
      delete query.building;
      delete query.unit;
      delete query.room;
      dispatch({
        type: 'KarmaUserAddModel/concat',
        payload: {
          buildingOption: [],
          unitOption: [],
          roomOption: [],
          karmaUserDropDow: []
        }
      });
      dispatch({
        type: 'KarmaUserAddModel/buildingList',
        payload: query
      })
    } else if (mark === 'building') {
      form.setFieldsValue({unit: '', room: '', room_user_id: ''});
      delete query.unit;
      delete query.room;
      dispatch({
        type: 'KarmaUserAddModel/concat',
        payload: {
          unitOption: [],
          roomOption: [],
          karmaUserDropDow: []
        }
      });
      dispatch({
        type: 'KarmaUserAddModel/unitList',
        payload: query
      })
    } else if (mark === 'unit') {
      form.setFieldsValue({room: '', room_user_id: ''});
      delete query.room;
      dispatch({
        type: 'KarmaUserAddModel/concat',
        payload: {
          roomOption: [],
          karmaUserDropDow: []
        }
      });
      dispatch({
        type: 'KarmaUserAddModel/roomList',
        payload: query
      })
    } else if (mark === 'room') {
      form.setFieldsValue({room_user_id: ''});
      dispatch({
        type: 'KarmaUserAddModel/concat',
        payload: {
          karmaUserDropDow: []
        }
      });
      dispatch({
        type: 'KarmaUserAddModel/karmaUserDropDown',
        payload: query
      })
    }
  }
  /*
 * 新增/编辑业委会成员 提交表单
 * */
  function handleSubmit () {
    form.validateFields((errors, values) => {
      if (errors) {
        return;
      }
      if (!hasSubmit) {
        hasSubmit = true;
        if(!queryId || Object.hasOwnProperty.call(queryId, 'room_user_id')){
          dispatch({
            type: 'KarmaUserAddModel/karmaUserAdd',
            payload: {
              community_id: getCommunityId(),
              owners_committee_id: values.owners_committee_id,
              room_user_id: values.room_user_id,
              company: values.company,
              birthdate: birthdate,
              politics_status: values.politics_status,
              education: values.education
            },
            callback: () => {
              hasSubmit = false;
              window.location.href = "#/karmaUserManagement";
            },
            err: () => {
              hasSubmit = false;
            }
          })
        } else {
          dispatch({
            type: 'KarmaUserAddModel/karmaUserEdit',
            payload: {
              community_id: getCommunityId(),
              owners_committee_id: values.owners_committee_id,
              room_user_id: values.room_user_id,
              company: values.company,
              birthdate: birthdate,
              politics_status: values.politics_status,
              education: values.education,
              id: queryId.id
            },
            callback: () => {
              hasSubmit = false;
              window.location.href = "#/karmaUserManagement";
            },
            err: () => {
              hasSubmit = false;
            }
          })
        }
      }
    })
  }
  /*
  * 返回到业委会成员管理页面
  * */
  function handleBack (e) {
    history.back();
  }
  /*
  * 监听出生年月
  * dateString String
  * */
  function changeData (date, dateString){
    dispatch({
      type: 'KarmaUserAddModel/concat',
      payload: { birthdate: dateString }
    })
  }
  /*
  * 设置日期选择框不可选择的日期
  * dateString String
  * */
  function disabledDate (current) {
    return current && current > moment().endOf('day');
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
        <Breadcrumb.Item><a href="#/karmaUserManagement">业委会成员管理</a></Breadcrumb.Item>
        <Breadcrumb.Item>{!queryId || Object.hasOwnProperty.call(queryId, 'room_user_id') ? "新增" : "编辑"}业委会成员</Breadcrumb.Item>
      </Breadcrumb>
      <Card className="section">
        <Form>
          <FormItem label="业委会名称" {...formItemLayout}>
            {getFieldDecorator('owners_committee_id',
              {initialValue: !queryId ? undefined : (info.owners_committee_id ? info.owners_committee_id : queryId.room_user_id)})(
              <Select placeholder="业委会名称" notFoundContent="没有数据">
                {karmaDropDow.map((value, index) => {
                  return (
                    <Option key={index} value={value.id}>
                      {value.name}
                    </Option>
                  )
                })}
              </Select>
            )}
          </FormItem>
          <FormItem label="苑/期/区:" {...formItemLayout}>
            {getFieldDecorator('group',{
              rules: [{required: true, message: '请选择苑/期/区'}],
              initialValue: info.group ? info.group : undefined
            })(
              <Select placeholder="苑\期\区" notFoundContent="没有数据" onChange={(val) => handleChange('group', val)}>
                {groupOption.map((value, index) => {
                  return (
                    <Option key={index} value={value.name}>
                      {value.name}
                    </Option>
                  )
                })}
              </Select>)}
          </FormItem>
          <FormItem label="幢:" {...formItemLayout}>
            {getFieldDecorator('building',{
              rules: [{required: true, message: '请选择幢'}],
              initialValue: info.building
            })(
              <Select placeholder="幢" notFoundContent="没有数据" onChange={(val) => handleChange('building', val)}>
                {buildingOption.map((value, index) => {
                  return (
                    <Option key={index} value={value.name}>
                      {value.name}
                    </Option>
                  )
                })}
              </Select>)}
          </FormItem>
          <FormItem label="单元:" {...formItemLayout}>
            {getFieldDecorator('unit',{
              rules: [{required: true, message: '请选择单元'}],
              initialValue: info.unit
            })(
              <Select placeholder="单元" notFoundContent="没有数据" onChange={(val) => handleChange('unit', val)}>
                {unitOption.map((value, index) => {
                  return (
                    <Option key={index} value={value.name}>
                      {value.name}
                    </Option>
                  )
                })}
              </Select>)
            }
          </FormItem>
          <FormItem label="室:" {...formItemLayout}>
            {getFieldDecorator('room', {
              rules: [{required: true, message: '请选择室'}],
              initialValue: info.room
            })(
              <Select placeholder="室" notFoundContent="没有数据" onChange={(val) => handleChange('room', val)}>
                {roomOption.map((value, index) => {
                  return (
                    <Option key={index} value={value.name}>
                      {value.name}
                    </Option>
                  )
                })}
              </Select>)
            }
          </FormItem>
          <FormItem label="成员" {...formItemLayout}>
            {getFieldDecorator('room_user_id',
              {rules: [{
                type: "string",
                pattern: /^([\u4e00-\u9fa5a-zA-Z0-9]){2,30}$/,
                required: true,
                message: '格式错误（2-30位数字、字母、文字）'
              }],
              initialValue: info.room_user_id ? info.room_user_id : undefined})(
              <Select placeholder="成员" notFoundContent="没有数据">
                {karmaUserDropDow && karmaUserDropDow.length > 0
                  ? karmaUserDropDow.map((value, index) => {
                    return (
                      <Option key={index} value={value.room_user_id}>
                        {value.name}
                      </Option>
                    )
                  })
                  : []}
              </Select>
            )}
          </FormItem>
          <FormItem label="工作单位" {...formItemLayout}>
            {getFieldDecorator('company', {initialValue: info.company ? info.company : undefined})(
              <Input type="text" maxLength="30" placeholder="请输入工作单位"/>
            )}
          </FormItem>
          <FormItem label="出生年月:" {...formItemLayout}>
            {getFieldDecorator('birthdate',{
              initialValue: info.birthdate ? moment(info.birthdate, dateFormat) : null
            })(
              <DatePicker disabledDate={disabledDate} style={{width:'100%'}} onChange={changeData}/>
            )}
          </FormItem>
          <FormItem label="政治面貌" {...formItemLayout}>
            {getFieldDecorator('politics_status',{initialValue: info.politics_status ? info.politics_status : undefined})(
              <Input type="text" maxLength="30" placeholder="请输入政治面貌"/>
            )}
          </FormItem>
          <FormItem label="文化程度:" {...formItemLayout}>
            {getFieldDecorator('education',{
              initialValue: info.education
            })(
              <Select placeholder="文化程度" notFoundContent="没有数据">
                <Option key="1" value="1">小学</Option>
                <Option key="2" value="2">初中</Option>
                <Option key="3" value="3">高中</Option>
                <Option key="4" value="4">大专</Option>
                <Option key="5" value="5">本科</Option>
                <Option key="6" value="6">硕士研究生</Option>
                <Option key="7" value="7">博士研究生</Option>
                <Option key="9" value="9">其他</Option>
              </Select>)
            }
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
    KarmaUserAddModel: state.KarmaUserAddModel,
    layout: state.MainLayout
  }
})(Form.create({})(KarmaUserAdd));

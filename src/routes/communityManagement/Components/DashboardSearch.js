import React from 'react';
import { Form, Col, Select , Input } from 'antd';
import Community from '../../../components/Community/Community.js';
const FormItem = Form.Item;
const Option = Select.Option;
const formItemLayout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 16
  },
};
function DashboardSearch(props){
  let { form,curTabPaneKey } = props;
  const {getFieldDecorator} = form;
  return (
    <div>
      {curTabPaneKey==4||curTabPaneKey==5?
        <div>
          <Col span={6}>
            <FormItem label="表身号" {...formItemLayout}>
              {getFieldDecorator('meter_no')(<Input placeholder="请输入表身号" />
              )}
            </FormItem>
          </Col>
          <Community form={form} allDatas={{group:{},building:{},unit:{},room:{}}}/>
        
        
          <Col span={6}>
            <FormItem label={curTabPaneKey==4?'水表状态':'电表状态'} {...formItemLayout}>
              {getFieldDecorator('meter_status')(
                <Select placeholder="请选择">
                  <Option value="">全部</Option>
                  <Option key={1} value="1">启用</Option>
                  <Option key={1} value="2">禁用</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </div>
        :null}
      {curTabPaneKey==1||curTabPaneKey==2||curTabPaneKey==3?
        <div>
          <Col span={6}>
            <FormItem label="公摊项目名称" {...formItemLayout}>
              {getFieldDecorator('name')(<Input type="text" placeholder="请输入公摊项目"/>)}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="仪表类型：" {...formItemLayout}>
              {getFieldDecorator('panel_type')(
                <Select className="select-150"  placeholder="请选择仪表类型">
                  <Option value="">全部</Option>
                  <Option key={1} value="1">水表</Option>
                  <Option key={2} value="2">电表</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="表盘状态：" {...formItemLayout}>
              {getFieldDecorator('panel_status')(
                <Select className="select-150"  placeholder="请选择表盘状态">
                  <Option value="">全部</Option>
                  <Option key={1} value="1">正常</Option>
                  <Option key={2} value="2">异常</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </div>
        :null}
    </div>
  )
}
export default DashboardSearch;
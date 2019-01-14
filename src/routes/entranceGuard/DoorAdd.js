import React from 'react';
import { connect } from 'dva';
import { Form, Breadcrumb, Card, Input, Select, Button, Row, Col, Radio } from 'antd';
import Menus from '../../components/Menus1/index';
let hasSubmit = false;
const { TextArea } = Input;
const RadioGroup = Radio.Group;
const Option = Select.Option;

function DoorAdd(props) {
  const { dispatch, form, id, detail, userMenus, groupMenuList, menuChecked, typeOption, supplierOption, deviceType } = props;
  
  const { getFieldDecorator } = form;
  // 布局
  const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 14 },
    style: { maxWidth: '600px' }
  };
  function checkAddMenus(id, data) {
    dispatch({
      type: 'DoorAdd/concat',
      payload: { menuChecked: data }
    });
  }
  /**
   * 取消
   */
  function handleBack() {
    history.go(-1);
  }
  /**
   * 新增/编辑 表单提交
   */
  // 设备类型change
  function handleChange(val){
    dispatch({
      type: 'DoorAdd/concat',
      payload: {
        deviceType: val,
      }
    })
  }
  function handleSave() {
    if (hasSubmit) {
      return false;
    }
    form.validateFields((errors, values) => {
      
      if (errors) {
        window.scrollTo(0, 0);
        return;
      }
      let arr = [];
      userMenus.map(v=>{
        Object.keys(menuChecked).map(key=>{
          v.children.map(vv=>{
            vv.children.map(vvv=>{
              if(key == vvv.key && menuChecked[key]==true){
                arr.push(vvv.key)
              }
            })
          })
        });
      })
      
      
      if (!hasSubmit) {
        hasSubmit = true;
        if (!id) {
          dispatch({
            type: 'DoorAdd/doorAdd',
            payload: {
              name: values.name,
              permissions: arr,
              status: values.status,
              supplier_id: values.supplier_id,
              note: values.note,
              device_id: values.device_id,
              type: values.type
            },
            callback: () => {
              hasSubmit = false;
              window.location.href = "#/doorManagement";
              window.scrollTo(0, 0);
            },
            err: () => {
              hasSubmit = false;
            }
          });
        } else {
          dispatch({
            type: 'DoorAdd/doorEdit',
            payload: {
              id: id,
              name: values.name,
              permissions: arr,
              status: values.status,
              supplier_id: values.supplier_id,
              note: values.note,
              device_id: values.device_id,
              type: values.type
            },
            callback: () => {
              hasSubmit = false;
              window.location.href = "#/doorManagement";
              window.scrollTo(0, 0);
            },
            err: () => {
              hasSubmit = false;
            }
          });
        }
      }
    });
  }
  return (<div>
    <Breadcrumb separator=">">
      <Breadcrumb.Item>智能门禁</Breadcrumb.Item>
      <Breadcrumb.Item><a href="#/doorManagement">智能门禁管理</a></Breadcrumb.Item>
      <Breadcrumb.Item>{id ? '编辑' : '新增'}</Breadcrumb.Item>
    </Breadcrumb>
    <Form>
      <Card>
        <Form.Item label="门禁名称" {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: detail.name,
            rules: [{ required: true, message: '请输入门禁名称' }],
          })(
            <Input type="text" placeholder="请输入门禁名称" maxLength="20" />
          )}
        </Form.Item>
        <Form.Item label="设备类型" {...formItemLayout}>
          {getFieldDecorator('type', {
            initialValue: detail.type?detail.type:undefined,
            rules: [{ required: true, message: '请选择设备类型' }],
            onChange: handleChange.bind(this)
          })(
            <Select placeholder="请选择设备类型">
              {typeOption ? typeOption.map((item) => {
                return <Option key={item.id} value={item.id}>{item.name}</Option>
              }) : null}         
            </Select>
          )}
        </Form.Item>
        <Form.Item label="设备厂商" {...formItemLayout}>
          {getFieldDecorator('supplier_id', {
            initialValue: detail.supplier_id?String(detail.supplier_id):undefined,
            rules: [{ required: true, message: '请选择设备厂商' }],
          })(
            <Select placeholder="请选择设备厂商" disabled={id?true:false}>
              {supplierOption ? supplierOption.map((item) => {
                return <Option key={item.id} value={item.id}>{item.name}</Option>
              }) : null}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="设备序列号" {...formItemLayout}>
          {getFieldDecorator('device_id', {
            initialValue: detail.device_id,
            rules: [{ required: true, message: '请输入设备序列号' }],
          })(
            <Input type="text" placeholder="请输入设备序列号" maxLength="100"  disabled={id?true:false}/>
          )}
        </Form.Item>
        <Form.Item label="备注：" {...formItemLayout}>
          {getFieldDecorator('note', {
            initialValue: detail.note
          })(
            <TextArea row={6} type="textarea" maxLength={200} placeholder="最多200字" />
          )}
        </Form.Item>
        <Form.Item label="状态：" {...formItemLayout} >
          {getFieldDecorator('status', {
            rules: [{ required: true, message: '请选择状态' }],
            initialValue: detail.status ? String(detail.status) : '1'
          })(
            <RadioGroup><Radio value="1">启用</Radio><Radio value="2">禁用</Radio></RadioGroup>
          )}
        </Form.Item>
      </Card>
      <Row gutter={16} style={{ marginTop: "30px" }}>
        <Col span={24}>
          <Card title="门禁权限">
            <Menus allMenus={userMenus} id={'menu'} infoMenu={groupMenuList} deviceType={deviceType} callback={checkAddMenus.bind(this)} />
          </Card>
        </Col>
      </Row>
      <div style={{ marginTop: "40px" }}>
        <Button type="primary" onClick={handleSave}>保存</Button>
        <Button className="ml1" onClick={handleBack}>取消</Button>
      </div>
    </Form>
  </div >)
}
function mapStateToProps(state) {
  return {
    ...state.DoorAdd,
    loading: state.loading.models.DoorAdd
  };
}
export default connect(mapStateToProps)(Form.create()(DoorAdd));

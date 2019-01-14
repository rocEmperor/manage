import React from 'react';
import { Form, Input,Switch,Radio,TreeSelect} from 'antd';
import TreeSelects from '../../../../components/TreeSelect/index';
const RadioGroup = Radio.Group;
function SearchAdd(props){
  const { from,info,groupList,dispatch,section_checked,disabled,id,infoSendType,unfoldList } = props;
  //布局
  const formItemLayout1 = {
    labelCol: { span: 4 },
    wrapperCol: { span: 17 },
    style: { maxWidth: '600px' }
  };
  const formItemLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 16 },
    style: { maxWidth: '600px' }
  };
  const radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
  };
  function onChange(e,checked){
    if(e=="Switch"){
      if(checked==false){
        from.setFieldsValue({ department: undefined});
        dispatch({
          type: 'GroupManagementAddEdit/concat',
          payload: { section_checked: 0 }
        })
      }
      dispatch({
        type: 'GroupManagementAddEdit/concat',
        payload: { disabled: checked,department:'' }
      })
    }else if(e=="Radio"){
      dispatch({
        type: 'GroupManagementAddEdit/concat',
        payload: { section_checked: checked.target.value }
      })
    }
  }
  return(
    <div>
      <Form>
        <TreeSelects 
          label={'上级部门'} 
          multiple={false} 
          placeholder={'请选择上级部门'}
          id={'parent_name'}
          form={from}
          data={groupList}
          unfoldList={unfoldList}
          defaultValue={info?info.parent_id:""} 
          formItemLayout={formItemLayout1}
          disabled={id?true:false}
        />
        <Form.Item label="部门名称" {...formItemLayout1}>
          {from.getFieldDecorator('name', {
            initialValue: info.name,
            rules: [{
              pattern: /^.{1,20}$/,
              required: true,
              message: '请输入最多20位字符！',
            }]
          })(
            <Input type="text" placeholder="请输入部门名称" />
          )}
        </Form.Item>
        <h3 className="ml3">部门设置</h3>
        <Form.Item className="ml12" label="限制本部门成员查看通讯录" {...formItemLayout}>
          {from.getFieldDecorator('see_limit', {
            valuePropName: 'checked',
            initialValue:id?info.see_limit==1||info.see_limit==2?true:false:false,
          })(
            <Switch checkedChildren="开" unCheckedChildren="关" onChange={onChange.bind(this,"Switch")} />
          )}
        </Form.Item>
        {disabled==true?<Form.Item className="ml3" {...formItemLayout1}>
          {from.getFieldDecorator('department',{
            initialValue:info&&info.see_limit&&info.see_limit!=0?Number(info.see_limit):'',
            rules: [{
              required: true,
              message: '请选择！',
            }]})(
            <RadioGroup disabled={disabled==false?true:false} onChange={onChange.bind(this,'Radio')}>
              <Radio style={radioStyle} value={1}>只能看到所在部门及以下部门通讯录(部门和员工)</Radio>
              <Radio style={radioStyle} value={2}>只能看指定部门</Radio>
            </RadioGroup>
          )}
        </Form.Item>
          :
          <Form.Item className="ml3" {...formItemLayout1}>
            {from.getFieldDecorator('department',{initialValue:info&&info.see_limit&&info.see_limit!=0?Number(info.see_limit):''})(
              <RadioGroup disabled={disabled==false?true:false} onChange={onChange.bind(this,'Radio')}>
                <Radio style={radioStyle} value={1}>只能看到所在部门及以下部门通讯录(部门和员工)</Radio>
                <Radio style={radioStyle} value={2}>只能看指定部门</Radio>
              </RadioGroup>
            )}
          </Form.Item>
        }
        {info.see_limit==2&&section_checked==2||section_checked==2?
          <Form.Item className="ml3" {...formItemLayout}>
            {from.getFieldDecorator('see_group_id',{
              initialValue: infoSendType,
              rules: [{ required: true, message: '请选择部门!' }],
            })(
              <TreeSelect
                showSearch
                treeData={groupList}
                placeholder="请选择部门"
                allowClear
                multiple
                treeDefaultExpandAll
              />
            )}
          </Form.Item>  
          :null}
      </Form>
    </div>
  )
}
export default SearchAdd;
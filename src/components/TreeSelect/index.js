import React from 'react';
import { TreeSelect,Form } from 'antd';
const SHOW_ALL = TreeSelect.SHOW_ALL;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
function TreeSelects(props){
  const {id,data,form,defaultValue,placeholder,multiple,label,formItemLayout,callBack,disabled,unfoldList} = props;
  const { getFieldDecorator } = form;
  const tProps = {
    treeDefaultExpandedKeys:unfoldList?unfoldList:[],
    treeData: data,
    treeCheckable: multiple==true?true:false,
    showCheckedStrategy: multiple==true?SHOW_ALL:SHOW_PARENT,
    placeholder: placeholder,
    disabled:disabled?disabled:false
  };
  function callBack1 (value){
    callBack?props.callBack(value):"";
  }
  return (
    <Form.Item label={label} {...formItemLayout}>
      {getFieldDecorator(id,{
        initialValue: defaultValue,
        rules: [{ required: true, message: placeholder+"!" }],
      })(
        <TreeSelect onSelect={callBack1.bind(this)} {...tProps}/>
      )}
    </Form.Item>
  )
}
export default TreeSelects
import React from 'react';
import { Form, Row, Col, Input, Button,Card} from 'antd';
function SearchBox(props){
  const { form,list,dispatch } = props;
  const { getFieldDecorator,validateFields } = form;
  /**
   * 搜索
   * @param  {string} name
   * 
   */
  function handSearch(list){
    validateFields((err, values) => {
      dispatch({
        type:'GroupManagement/getGroupManages',
        payload:{
          name:values.name
        }
      })
    })
  }
  /**
   * 重置
   * @param  {string} name
   * 
   */
  function handleReset(){
    form.resetFields();
    dispatch({
      type:'GroupManagement/getGroupManages',
      payload:{
        name:""
      }
    })
  }
  // 布局
  const formItemLayout = {
    labelCol: {
      span: 6
    },
    wrapperCol: {
      span: 16
    },
    style: {
      marginBottom: "0"
    }
  };
  return (
    <Card>
      <Form>
        <Row>
          <Col span={6}>
            <Form.Item label="部门名称" {...formItemLayout}>
              {getFieldDecorator('name')(<Input type="text" placeholder="请输入部门名称" />
              )}
            </Form.Item>
          </Col>
          <Col style={{float: 'right'}}>
            <Button type="primary" onClick={handSearch.bind(this,list)} className="mr1" style={{ marginLeft: '10px' }} >搜索</Button>
            <Button type="ghost" onClick={handleReset}>重置</Button>
          </Col>
        </Row>
      </Form>
    </Card>
  )
}
export default SearchBox;
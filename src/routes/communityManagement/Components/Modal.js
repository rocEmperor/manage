import React from 'react';
import { Form, Modal, Radio} from 'antd';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
class Modals extends React.Component{
  constructor(props){
    super(props);
    this.state = {

    }
  }
  handleCancel(){
    //将父属性的visible设置为false
    this.props.callback();
  }
  
  render(){
    const formItemLayout = {
      labelCol: {
        span: 3
      },
      wrapperCol: {
        span: 8
      },
    }
    let val;
    if(this.props.sharedType.shared_type == 1){
      val = "电梯"
    }else if(this.props.sharedType.shared_type == 2){
      val = "楼道"
    }else if(this.props.sharedType.shared_type == 3){
      val = "整体用水用电"
    }
    return(
      <div>
        <Modal
          title="分摊规则设置"
          visible={this.props.visible}
          maskClosable={true}
          onOk={this.props.onOk}
          onCancel={this.handleCancel.bind(this)}
          closable={true}
        >
          <p>请选择{val}用电分摊规则</p>					
          <FormItem {...formItemLayout} >
            {this.props.form.getFieldDecorator('dial',{rules:[{required: true,message: '请选择！'}],initialValue:this.props.rule_type?this.props.rule_type:null} )(
              <RadioGroup onChange={this.props.onChange.bind(this)}>
                <Radio value="1">按楼层分摊金额</Radio>
                <Radio value="2">按面积分摊金额</Radio>
                <Radio value="3">按楼层＆面积相结合分摊金额</Radio>
              </RadioGroup>)}
          </FormItem>
        </Modal>
      </div>
    )
  }
}
Modals = Form.create()(Modals);
export default Modals;
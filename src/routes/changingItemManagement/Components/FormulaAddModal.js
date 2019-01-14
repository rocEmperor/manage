import React from 'react'
import { Button, Modal, Form, Input, Select } from 'antd'
import Calculator from './Calculator.js'
const Option = Select.Option;

class FormulaAddModal extends React.Component {
  constructor(props) {
    super(props);
    this.handleInput = this.handleInput.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.handleCalculating = this.handleCalculating.bind(this);
    this.handleOnCancel = this.handleOnCancel.bind(this);
    this.handleOnSubmit = this.handleOnSubmit.bind(this);
    this.state = {
      formula: '',
      formulaResult: '',
      validateStatus: ''
    };
  }
  // 公式验证并取值
  checkFormula() {
    let { formula } = this.state;
    if (formula === '') {
      return '公式不能为空'
    } else if (/[\+\-\*\/\.]{2}/g.test(formula)) {
      return '公式错误，不能连续输入运算符！'
    } else if (/[0-9][a-zA-Z]/g.test(formula)) {
      return '公式错误，字母前请加运算符！'
    } else if (/[a-zA-Z][a-zA-Z]/g.test(formula)) {
      return '公式错误，字母只能单独出现！'
    } else if (/[hH]/g.test(formula) && /[cC]/g.test(formula)) {
      return '公式错误，房屋面积和车位面积只能选一个！'
    } else if (/(\.[a-zA-Z])|([a-zA-Z]\.)/g.test(formula)) {
      return '公式错误，小数点位置不正确！'
    } else if (/^[+\-*\/]/g.test(formula)) {
      return '公式错误，不能以运算符开头！'
    } else {
      try {
        let formulaResult = eval(formula.replace(/C/g, 10).replace(/H/g, 100));
        formulaResult =+ formulaResult.toFixed(2);
        if (formulaResult < 0) {
          return '公式错误，值不能为负数！'
        } else if (typeof formulaResult !== 'number' || isNaN(formulaResult)) {
          return '公式错误，值不正常！'
        } else {
          return formulaResult
        }
      }
      catch (err) {
        return '公式错误，请检查！'
      }
    }
  }
  // 公式赋值---点击计算器
  handleInput(value) {
    let { form } = this.props;
    let newFormula = this.state.formula + value
    this.setState({
      formula: newFormula,
      validateStatus: '',
    });
    form.setFieldsValue({['formula']: newFormula})
  }
  // 清除公式
  handleClear() {
    let { form } = this.props;
    this.setState({
      formula: ''
    });
    form.setFieldsValue({['formula']: ''})
  }
  // 回退
  handleBack() {
    let newFormula = this.state.formula.slice(0, this.state.formula.length - 1)
    this.setState({
      formula: newFormula
    });
    this.props.form.setFieldsValue({
      ['formula']: newFormula
    })
  }

  handleCalculating() {
    this.setState({
      formulaResult: this.checkFormula(),
      validateStatus: (typeof this.checkFormula() === 'number') ? '' : 'error'
    })
  }
  // 取消
  handleOnCancel() {
    this.props.form.resetFields();
    this.setState({
      formula: '',
      formulaResult: ''
    });
    this.props.onCancel()
  }
  // 提交
  handleOnSubmit(e) {
    let { form } = this.props;
    e.preventDefault();
    form.validateFields();
    this.setState({
      formulaResult: this.checkFormula()
    });
    let valid = typeof form.getFieldValue('formulaName') !== 'undefined' && typeof this.checkFormula() === 'number'
    if (valid) {
      this.props.onSubmit(
        form.getFieldValue('formulaName'),
        form.getFieldValue('calc_rule'),
        form.getFieldValue('del_decimal_way'),
        this.state.formula,
        this.handleOnCancel
      )
    } else {
      this.setState({
        validateStatus: 'error',
      });
      this.handleCalculating()
    }
  }

  render() {
    let { visible, loading, form } = this.props;
    let { formulaResult, validateStatus } = this.state;
    return (
      <div>
        <Modal
          visible={visible}
          title="新增公式"
          onOk={this.props.onOk}
          onCancel={this.handleOnCancel}
          footer={[
            <Button key="back" size="large" onClick={this.handleOnCancel}>
              关闭
            </Button>,
            <Button key="submit" type="primary" size="large" loading={loading} onClick={this.handleOnSubmit}>
              保存
            </Button>
          ]}>
          <Form onSubmit={this.handleOnSubmit}>
            <Form.Item
              labelCol={{span: 6}}
              wrapperCol={ {span: 14}}
              label="名称"
              hasFeedback>
              {this.props.form.getFieldDecorator('formulaName', {
                rules: [{
                  required: true,
                  pattern: /\S/,
                  message: '公式名不能为空',
                }],
              })(
                <Input placeholder="请输入公式名称"/>
              )}
            </Form.Item>
            <Form.Item
              labelCol={{span: 6}}
              wrapperCol={{span: 14}}
              validateStatus={validateStatus}
              label="公式">
              {this.props.form.getFieldDecorator('formula', {})(
                <Input placeholder="请使用计算器输入公式" disabled/>
              )}
            </Form.Item>
            <Calculator
              formulaResult={formulaResult}
              calculatorInput={this.handleInput}
              calculatorBack={this.handleBack}
              calculatorClear={this.handleClear}
            />
            <Form.Item
              labelCol={{span: 6}}
              wrapperCol={ {span: 14}}
              label="计算规则"
              hasFeedback>
              {form.getFieldDecorator('calc_rule', {
                rules: [{
                  required: true,
                  message: '计算规则不能为空',
                }],
              })(
                <Select placeholder="请选择计算规则" notFoundContent="没有数据">
                  <Option value="1">整数</Option>
                  <Option value="2">小数点后一位</Option>
                  <Option value="3">小数点后两位</Option>
                </Select>
              )}
            </Form.Item>
            <Form.Item
              labelCol={{span: 6}}
              wrapperCol={{span: 14}}
              label="去尾方式"
              hasFeedback>
              {form.getFieldDecorator('del_decimal_way', {
                rules: [{
                  required: true,
                  message: '去尾方式不能为空',
                }],
              })(
                <Select placeholder="请选择去尾方式" notFoundContent="没有数据">
                  <Option value="1">四舍五入</Option>
                  <Option value="2">向上取整</Option>
                  <Option value="3">向下取整</Option>
                </Select>
              )}
            </Form.Item>
          </Form>
        </Modal>
      </div>
    )
  }
}

{/*<Button key="test" size="large" onClick={this.handleCalculating}>计算</Button>,*/
}

FormulaAddModal = Form.create({})(FormulaAddModal);

export default FormulaAddModal

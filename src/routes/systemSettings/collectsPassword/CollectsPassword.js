import React from 'react';
import { connect } from 'dva';
import { Form, Breadcrumb, Card, Button, Modal, Input } from 'antd';
const FormItem = Form.Item;

function CollectsPassword(props) {
  const { form, dispatch, is_set, set, mark, tel, reset, code, countdown } = props;
  const { getFieldDecorator } = form;
  // 布局
  const formItemLayout = {
    labelCol: {
      span: 5
    },
    wrapperCol: {
      span: 17
    },
  };
  /**
   * 点击设置密码，显示modal
   */
  function setPassword() {
    form.resetFields(["setPassword", "setAgainPassword"]);
    dispatch({
      type: 'CollectsPassword/concat',
      payload: { set: true }
    })
  }
  /**
   * 取消设置密码
   */
  function sethandleCancel() {
    dispatch({
      type: 'CollectsPassword/concat',
      payload: { set: false }
    })
    form.resetFields(["setPassword", "setAgainPassword"]);
  }
  /**
   * 设置密码验证
   */
  function setAgainPassword(rule, value, callback) {
    let password = form.getFieldValue('setPassword');
    if (value && value !== password) {
      callback('两次输入密码不一致！');
    } else {
      callback();
    }
  }
  /**
   * 确认设置密码
   */
  function sethandleOk() {
    form.validateFields(['setPassword', 'setAgainPassword'], (errors, values) => {
      if (errors) {
        return;
      }
      dispatch({
        type: 'CollectsPassword/getAddPwd',
        payload: {
          new_pwd: values.setPassword,
          confirm_pwd: values.setAgainPassword,
        }
      })
    })
  }
  /**
   * 点击修改密码，显示modal
   */
  function markPassword() {
    form.resetFields(["markOldPassword", "markPassword", "markAgainPassword"]);
    dispatch({
      type: 'CollectsPassword/concat',
      payload: { mark: true }
    })
  }
  /**
   * 取消修改密码
   */
  function markhandleCancel() {
    form.resetFields(["markOldPassword", "markPassword", "markAgainPassword"]);
    dispatch({
      type: 'CollectsPassword/concat',
      payload: { mark: false }
    })
  }
  /**
   * 修改密码验证
   */
  function markAgainPassword(rule, value, callback) {
    let markPassword = form.getFieldValue('markPassword');
    if (value && value !== markPassword) {
      callback('两次输入密码不一致！');
    } else {
      callback();
    }
    callback();
  }
  /**
   * 确认修改密码
   */
  function markhandleOk() {
    form.validateFields(['markOldPassword', 'markPassword', 'markAgainPassword'], (errors, values) => {
      if (errors) {
        return;
      }
      dispatch({
        type: 'CollectsPassword/getEditPwd',
        payload: {
          new_pwd: values.markPassword,
          confirm_pwd: values.markAgainPassword,
          old_pwd: values.markOldPassword,
        }
      })
    })
  }
  /**
   * 点击重置密码，显示modal
   */
  function resetPassword() {
    form.resetFields(["code", "resetPassword", "resetAgainPassword"]);
    dispatch({
      type: 'CollectsPassword/concat',
      payload: { reset: true }
    })
  }
  /**
   * 取消重置密码
   */
  function resethandleCancel() {
    dispatch({
      type: 'CollectsPassword/concat',
      payload: { reset: false }
    })
    form.resetFields(["code", "resetPassword", "resetAgainPassword"]);
  }
  /**
   * 重置密码验证
   */
  function resetAgainPassword(rule, value, callback) {
    if (value && value !== form.getFieldValue('resetPassword')) {
      callback('两次输入密码不一致！');
    } else {
      callback();
    }
  }
  /**
   * 重置密码获取验证码
   */
  function sendCode() {
    dispatch({
      type: 'CollectsPassword/getSendMsg',
      payload: {}
    })
    setInterval(function () {
      dispatch({
        type: 'CollectsPassword/changeCode',
        payload: {}
      })
    }, 1000)
  }
  /**
   * 确认重置密码
   */
  function resethandleOk() {
    let code = props.form.getFieldValue('code');
    let resetPassword = props.form.getFieldValue('resetPassword');
    let resetAgainPassword = props.form.getFieldValue('resetAgainPassword');
    props.form.validateFields(['code', 'resetPassword', 'resetAgainPassword'], (errors, values) => {
      if (errors) {
        return;
      }
    })
    dispatch({
      type: 'CollectsPassword/getResetPwd',
      payload: {
        code: code,
        new_pwd: resetPassword,
        confirm_pwd: resetAgainPassword,
      }
    })
  }

  return (<div>
    <Breadcrumb separator=">">
      <Breadcrumb.Item>系统设置</Breadcrumb.Item>
      <Breadcrumb.Item>收款密码设置</Breadcrumb.Item>
    </Breadcrumb>
    {is_set == 'no' ?
      <Card className="section">
        <p>为确保正常使用收银台收款功能，请您 <Button type="primary" onClick={setPassword.bind(this)}>设置密码</Button></p>
      </Card>
      :
      <Card className="section">
        <Button type="primary" className="mr2" onClick={markPassword.bind(this)}>修改密码</Button>
        <Button type="primary" onClick={resetPassword.bind(this)}>重置密码</Button>
      </Card>
    }
    <Modal title="设置密码" visible={set} onOk={sethandleOk.bind(this)} onCancel={sethandleCancel.bind(this)} okText="确认" cancelText="取消">
      <Form>
        <FormItem {...formItemLayout} label="输入密码">
          {getFieldDecorator('setPassword', { rules: [{ required: true, message: '密码输入错误（6~10位英文、数字）！', type: "string", pattern: /^[0-9A-Za-z]{6,10}$/ }] })(
            <Input type="password" />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="确认密码">
          {getFieldDecorator('setAgainPassword', { rules: [{ required: true, message: '两次密码不一致！' }, { validator: setAgainPassword.bind(this) },] })(
            <Input type="password" />
          )}
        </FormItem>
      </Form>
    </Modal>
    <Modal title="修改密码" visible={mark} onOk={markhandleOk.bind(this)} onCancel={markhandleCancel.bind(this)} okText="确认" cancelText="取消">
      <Form>
        <FormItem {...formItemLayout} label="原密码">
          {getFieldDecorator('markOldPassword', { rules: [{ required: true, message: '请输入原密码' }] })(
            <Input type="password" />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="新密码">
          {getFieldDecorator('markPassword', { rules: [{ required: true, message: '新密码输入错误（6~10位英文、数字）！', type: "string", pattern: /^[0-9A-Za-z]{6,10}$/ }] })(
            <Input type="password" autoComplete="off" onContextMenu={() => false} onPaste={() => false} onCopy={() => false} onCut={() => false} />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="确认密码">
          {getFieldDecorator('markAgainPassword', { rules: [{ required: true, message: '两次密码不一致！' }, { validator: markAgainPassword.bind(this) },] })(
            <Input type="password" autoComplete="off" onContextMenu={() => false} onPaste={() => false} onCopy={() => false} onCut={() => false} />
          )}
        </FormItem>
      </Form>
    </Modal>
    <Modal title="重置密码" visible={reset} onOk={resethandleOk.bind(this)} onCancel={resethandleCancel.bind(this)} okText="确认" cancelText="取消">
      <Form>
        <FormItem labelCol={{ span: 5 }} label="手机号码" >
          <p>{tel}</p>
        </FormItem>
        <FormItem {...formItemLayout} label="验证码">
          {getFieldDecorator('code', { rules: [{ required: true, message: '请输入验证码' }] })(
            <Input type="text" style={{ width: 200, verticalAlign: 'text-bottom' }} />
          )}
          {code == false ?
            <Button type="primary" className="fr" onClick={sendCode.bind(this)} style={{ width: 120, textAlign: 'center', padding: 0 }}>
              获取验证码
            </Button>
            : <Button type="primary" className="fr disable" disabled style={{ width: 120, textAlign: 'center', padding: 0 }}>
              {countdown}s后重新发送
            </Button>
          }
        </FormItem>
        <FormItem {...formItemLayout} label="新密码">
          {getFieldDecorator('resetPassword', { rules: [{ required: true, message: '密码输入错误（6~10位英文、数字）！', type: "string", pattern: /^[0-9A-Za-z]{6,10}$/ }] })(
            <Input type="password" />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="确认密码">
          {getFieldDecorator('resetAgainPassword', { rules: [{ required: true, message: '两次密码不一致！' }, { validator: resetAgainPassword.bind(this) },] })(
            <Input type="password" />
          )}
        </FormItem>
      </Form>
    </Modal>
  </div>)
}
function mapStateToProps(state) {
  return {
    ...state.CollectsPassword
  };
}
export default connect(mapStateToProps)(Form.create()(CollectsPassword));

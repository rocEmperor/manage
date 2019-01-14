import React from "react";
import { connect } from 'dva';
import { Form, Input, Button } from "antd";
import "./../Login/login.less";
import { checkPhone } from '../../utils/util';
import logoIndex1 from "../../../static/images/logoIndex1.png";
import logoIndex2 from "../../../static/images/logoIndex2.png";
import logoIndex3 from "../../../static/images/logoIndex3.png";
import logoIndex4 from "../../../static/images/logoIndex4.png";
import step1 from "../../../static/images/step1.png";
import step2 from "../../../static/images/step2.png";
const FormItem = Form.Item;
function Register(props) {
  let { dispatch, form, count, flagSend, showPassword, phone, acode } = props;

  const { getFieldDecorator } = form;

  function backLogin(e) {
    dispatch({
      type: 'register/backLogin',
      payload: {

      }
    });
  }
  function sendCode(e) {
    form.validateFields(['phone'], (err, values) => {
      if (err) {
        return;
      }
      dispatch({
        type: 'register/getSmsCode',
        payload: {
          mobile: values.phone,
        },
        callback: () => {
          let count = 180;
          let timer = setInterval(() => {
            count--;
            if (count == 0) {
              clearInterval(timer);
              dispatch({
                type: 'register/concat',
                payload: {
                  count: '发送验证码',
                  flagSend: true,
                }
              });
            } else {
              dispatch({
                type: 'register/concat',
                payload: {
                  count: count + 's后重试',
                  flagSend: false,
                }
              });
            }
          }, 1000);
        }
      })
    });
  }
  function handleCode() {
    form.validateFields(['phone', 'code'], (err, values) => {
      if (err) {
        return;
      }
      dispatch({
        type: 'register/validateSmsCode',
        payload: {
          mobile: values.phone,
          code: values.code,
        },
      })
    });
  }
  function checkPass(rule, value, callback) {
    const {getFieldValue} = form;
    if (value && value !== getFieldValue('password')) {
      callback('两次输入密码不一致！');
    } else {
      callback();
    }
  }
  function handlePassword() {
    form.validateFields(['password','newpassword'], (err, values) => {
      if (err) {
        return;
      }
      dispatch({
        type: 'register/resetPassword',
        payload: {
          password: values.password,
          mobile: phone,
          acode: acode,
        },
      })
    });
  }

  return (
    <div className="login">
      <header>
        <img src={logoIndex3} /><img src={logoIndex4} className="ml1 mr1" style={{ height: '9px' }} /><img src={logoIndex1} />
        <span>客服热线：0571-88725099</span>
      </header>
      <div className="login">
        <div className="layout">
          <img src={logoIndex2} title="logo" alt="logo" className="logoImg" />
          <span className="logoSpan">支付宝智慧社区管理系统</span>
          {showPassword==false?
            <div className="contents identifyCode">
              <h1 className="title">找回密码</h1>
              <img src={step1} />
              <Form>
                <FormItem>
                  {getFieldDecorator("phone", {
                    rules: [{ required: true, message: '请输入手机号码' }, { validator: checkPhone.bind(this), message: '请输入手机号码！' }],
                  })(<Input placeholder="手机号码" />)}
                </FormItem>
                <div className="clearfix">
                  <FormItem className="code">
                    {getFieldDecorator("code", {
                      rules: [{ required: true, message: "请输入验证码" }]
                    })(
                      <Input
                        type="type"
                        placeholder="验证码"
                      />
                    )}
                  </FormItem>
                  {flagSend == true ?
                    <div className="send" onClick={sendCode}>{count}</div>
                    :
                    <div className="send disabledSend">{count}</div>
                  }
                </div>
                <span className="forget" onClick={backLogin}>返回登录</span>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="button"
                  onClick={handleCode}
                >
                下一步
                </Button>
              </Form>
            </div>
            :
            <div className="contents identifyCode password">
              <h1 className="title">找回密码</h1>
              <img src={step2}/>
              <Form>
                <FormItem>
                  {getFieldDecorator("password", {
                    rules: [{ required: true, pattern: /^(?=.*\d)(?=.*[a-zA-Z]).{6,20}$/, whitespace: true, message: '密码格式为6~20位英文字母+数字' }]
                  })(<Input placeholder="新密码" type="password"/>)}
                </FormItem>
                <div>
                  <FormItem>
                    {getFieldDecorator("newpassword", {
                      rules: [{ required: true, message: '再次输入新密码' },
                        { validator: checkPass.bind(this), }]
                    })(
                      <Input
                        type="password"
                        placeholder="再次确认"
                      />
                    )}
                  </FormItem>
                </div>
                <span className="forget" onClick={backLogin}>返回登录</span>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="button"
                  onClick={handlePassword}
                >
                下一步
                </Button>
              </Form>
            </div>
          }
        </div>
      </div>
      <footer>
        <p><span>咨询电话：0571-88725099</span><span>联系QQ：2763539331</span></p>
        <p>技术运营支持：杭州筑家易网络科技股份有限公司</p>
      </footer>
    </div>
  );
}

function mapStateToProps(state) {
  return { ...state.register };
}
export default connect(mapStateToProps)(Form.create()(Register));

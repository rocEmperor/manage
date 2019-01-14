import React from "react";
import { connect } from 'dva';
import { Form, Icon, Input, Button } from "antd";
import "./login.less";
import logoIndex1 from "../../../static/images/logoIndex1.png";
import logoIndex2 from "../../../static/images/logoIndex2.png";
import logoIndex3 from "../../../static/images/logoIndex3.png";
import logoIndex4 from "../../../static/images/logoIndex4.png";
const FormItem = Form.Item;
function Login(props) {
  let { dispatch, form } = props;

  const { getFieldDecorator } = form;
  function handleSubmit(e){
    e.preventDefault();
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      window.sessionStorage.removeItem('password_time_stamp');
      dispatch({
        type: 'login/login',
        payload: {
          username:values.username,
          password:values.password,
          system_type:"2"
        }
      })
    });
  }
  function forgetPassword(e) {
    dispatch({
      type: 'login/register',
      payload: {
        forget: true,
      }
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
          <div className="contents">
            <h1 className="title">登录</h1>
            <Form>
              <FormItem>
                {getFieldDecorator("username", {
                  rules: [{ required: true, message: "请输入用户名" }]
                })(<Input prefix={<Icon type="user" />} placeholder="用户名" />)}
              </FormItem>
              <FormItem>
                {getFieldDecorator("password", {
                  rules: [{ required: true, message: "请输入密码" }]
                })(
                  <Input
                    prefix={<Icon type="lock" />}
                    type="password"
                    placeholder="密码"
                  />
                )}
              </FormItem>
              <span className="forget" onClick={forgetPassword}>忘记密码</span>
              <Button
                type="primary"
                htmlType="submit"
                className="button"
                onClick={handleSubmit}
              >
                登录
              </Button>
            </Form>
          </div>
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
  return { ...state.login };
}
export default connect(mapStateToProps)(Form.create()(Login));

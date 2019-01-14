import React from 'react';
import { Layout, Icon, Dropdown, Menu, Modal, Select, Form, Row, Input, Button } from 'antd';
import './MainLayout.css';
import { connect } from 'dva';
import { Link } from 'react-router-dom';
const Option = Select.Option;
const FormItem = Form.Item;
const { Header } = Layout;

function MainHeader(props) {
  let { dispatch, info, communityList, communityId, form, showFeedback, visible } = props;
  const { getFieldDecorator } = form;
  const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 18 },
  }

  function selectChange(val) {
    window.sessionStorage.removeItem('password_time_stamp');
    communityList.map((value, index) => {
      if (value.id == val) {
        dispatch({
          type: 'MainLayout/concat',
          payload: {
            communityId: value.id,
          }
        });
        sessionStorage.setItem('communityId', value.id);
        // let test = window.location.href;
        // let index = test.lastIndexOf("\/");
        // test = test.substring(index + 1, test.length);
        // let char = test.charAt(0);
        // test = test.replace(char, function (s) { return s.toUpperCase(); });
        dispatch({
          type: 'HomePageModel/init',
          payload: {
            communityId: value.id,
          }
        });
        dispatch({
          type: 'MainLayout/dashboardIndex',
          payload: {
            community_id: value.id,
          }
        });
        window.location = '#/homePage';
        props.communityIdChange();
      }
    })
  }

  function confirm() {
    Modal.confirm({
      title: '确认退出该账号？',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        window.sessionStorage.removeItem('password_time_stamp');
        dispatch({
          type: 'MainLayout/loginOut',
          payload: {

          }
        });
      }
    });
  }
  function showModal(){
    dispatch({
      type: 'MainLayout/concat',
      payload: {
        visible: true
      }
    });
  }
  function hideModal(){
    props.form.resetFields();
    dispatch({
      type: 'MainLayout/concat',
      payload: {
        visible: false,
      }
    });
  }
  function handleSubmit(e){
    e.preventDefault();
    props.form.validateFields(['password', 'rePasswd','old_password'], (err, values) => {
      if (err) {
        return;
      }
      let param = form.getFieldsValue(['password', 'old_password']);
      dispatch({
        type: 'MainLayout/changePassword',
        payload: param
      })
    })
  }
  function checkPass2(rule, value, callback) {
    const {
      getFieldValue
    } = form;
    if (value && value !== getFieldValue('password')) {
      callback('两次输入密码不一致！');
    } else {
      callback();
    }
  }
  const menu = (
    <Menu>
      <Menu.Item>
        <a onClick={confirm}>退出登录</a>
      </Menu.Item>
      <Menu.Item>
        <a onClick={showModal.bind(this)}>修改密码</a>
      </Menu.Item>
    </Menu>
  )
  function handleOk() {
    props.form.validateFields(['content'], (err, values) => {
      if (err) {
        return;
      }
      dispatch({
        type: 'MainLayout/feedbackAdd',
        payload: {
          content: values.content
        },
        callback() {
          props.form.resetFields();// 将表单里的数据清空
        }
      });
    });
  }
  function handleCancel() {
    dispatch({
      type: 'MainLayout/concat',
      payload: {
        showFeedback: false
      }
    });
    props.form.resetFields();
  }
  function addFeedbacks() {
    dispatch({
      type: 'MainLayout/concat',
      payload: {
        showFeedback: true
      }
    });
  }

  return (
    <Header className="header">
      <span className="fontLogo">{info.company_name}</span>
      <Dropdown overlay={menu}>
        <div className="userInfo">
          欢迎你，{info.username ? info.username : '默认用户'}
          <Icon type="down" className="ml1 fz12" />
        </div>
      </Dropdown>
      <span className="community">
        {getFieldDecorator('community_id', { initialValue: communityId+'', onChange: selectChange.bind(this) })(
          <Select notFoundContent="暂无数据" style={{ marginTop: 18, width: 120, float: 'right' }}>
            {communityList.map((value, index) => {
              return <Option title={value.name} key={index} value={value.id}>{value.name.length > 7 ? value.name.substring(0, 7) + '...' : value.name}</Option>
            })}
          </Select>)}
      </span>
      <div className="versionButton">
        <a href={info.version_file_url} target="_blank"><Icon type="question-circle-o" /> 查看操作手册</a>
        <a onClick={addFeedbacks.bind(this)} style={{ marginLeft: '10px' }}><Icon type="question-circle-o" />  问题反馈</a>
        <Link to="question" style={{ marginLeft: '10px' }}><Icon type="question-circle-o" />  常见问题</Link>
      </div>
      <Modal title="问题反馈" visible={showFeedback} onOk={handleOk.bind(this)} onCancel={handleCancel.bind(this)}>
        <Form>
          <Row>
            <FormItem {...formItemLayout} label="反馈内容">
              {getFieldDecorator('content', {
                rules: [{ pattern: /^[^ ]{1,100}$/, required: true, message: '请输入反馈内容(1-100),请勿输入空格', whitespace: true }],
              })(<Input type="textarea" maxLength={200} placeholder="请输入反馈内容" style={{ lineHeight: "20px" }} />)}
            </FormItem>
          </Row>
        </Form>
      </Modal>
      <Modal title="修改密码" visible={visible} onCancel={hideModal.bind(this)} footer={false}>
        <Form horizontal>
          <FormItem>
            {getFieldDecorator('old_password', { rules: [{ required: true, message: '请填写原密码' }] })(<Input type="password" placeholder="请填写原密码" />)}
          </FormItem>
          <FormItem>
            {getFieldDecorator('password', { rules: [{ required: true, pattern: /^(?=.*\d)(?=.*[a-zA-Z]).{6,20}$/, whitespace: true, message: '密码格式为6~20位英文字母+数字' }] })(
              <Input type="password" placeholder="请输入6-20位新密码" autoComplete="off" onContextMenu={false} onPaste={false} onCopy={false} onCut={false} />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('rePasswd', { rules: [{ required: true, message: '再次输入新密码' }, { validator: checkPass2.bind(this), }] })(
              <Input type="password" placeholder="请再次输入新密码" autoComplete="off" onContextMenu={false} onPaste={false} onCopy={false} onCut={false} />
            )}
          </FormItem>
          <Button type="primary" className="bigSubmitBtn w100" onClick={handleSubmit.bind(this)}>提交</Button>
        </Form>
      </Modal>
    </Header>
  );
}
function mapStateToProps(state) {
  return { ...state.MainLayout };
}
export default connect(mapStateToProps)(Form.create()(MainHeader));

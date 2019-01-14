import React from 'react';
import { connect } from 'dva';
import './MainLayout.css';
import MainHeader from "./MainHeader.js";
import { Link } from 'dva/router';
import { Layout, Menu, Icon, LocaleProvider,message, Modal, Form, Input} from 'antd';
const { Content, Sider } = Layout;
const SubMenu = Menu.SubMenu;
const FormItem = Form.Item;
import {getCommunityId} from '../../utils/util';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
class MainLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: sessionStorage.current?sessionStorage.current:'0001',
      openKeys: sessionStorage.openKeys?JSON.parse(sessionStorage.openKeys):['00'],
    };
  }

  UNSAFE_componentWillMount(){
    if(!sessionStorage.QXToken || sessionStorage.QXToken.length != 32){
      setTimeout(() => {
        location.href = '#/';
      }, 2000);
      message.destroy();
      message.info('登录信息已失效，3秒后将自动跳转到登录页...');
    }
  }

  handleClick=(e)=>{
    this.setState({
      current: e.key,
    });
    sessionStorage.current=e.key;
    let arr = [];
    arr.push(e.keyPath[1]);
    sessionStorage.openKeys=JSON.stringify(arr);
  }


  onOpenChange = (openKeys) => {
    const arr = [];
    {
      this.props.menuList ? this.props.menuList.map((value, index) => {
        arr.push(value.key)
      }) : ''
    }
    const rootSubmenuKeys = arr;
    const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      this.setState({ openKeys });
    } else {
      this.setState({
        openKeys: latestOpenKey ? [latestOpenKey] : [],
      });
    }
  }
  golink (key) {
    let {dispatch} = this.props;
    if(key == '0900'){
      // window.open("http://112.17.124.21:81");
      dispatch({
        type: 'MainLayout/lianZhangReq',
        payload:{
          community_id: getCommunityId()
        }
      })
    } else if (key == '1309') {
      let timeStamp = window.sessionStorage.getItem('password_time_stamp');
      let curHash = window.location.hash;
      let hasEffect = false;
      if (timeStamp) {
        timeStamp = parseFloat(timeStamp);
        let now = new Date().getTime();
        // 密码有效期一个小时
        if (timeStamp - now < 3600000) {
          hasEffect = true;
        }
      }
      if (curHash === '#/cashierDesk' || hasEffect) {
        window.location.href = "#/cashierDesk";
      } else {
        dispatch({
          type: 'MainLayout/confirmPwd',callback(val){
            if(val=='yes'){
              dispatch({
                type: 'MainLayout/concat',
                payload:{
                  passwordsMainLay:true
                }
              })
            }else{
              window.location.href = "#/collectsPassword";
            }
          }
        })
      }
    } else {
      window.open("http://112.17.124.21:81");
    }
  }
  communityIdChange () {
    this.setState({
      openKeys: ['00'],
      current: '0001'
    })
    sessionStorage.current = '0001';
    sessionStorage.openKeys = JSON.stringify(['00']);
  }
  handleCancel () {
    let { dispatch, form } = this.props;
    form.resetFields(['password_cashierDesk']);
    dispatch({
      type: 'MainLayout/concat', payload: {
        passwordsMainLay: false,
      }
    });
    form.resetFields(["password",""]);
  }
  handleOk(){
    let { form, dispatch } = this.props;
    form.validateFields((err,value)=>{
      if (err) { return }
      let password = form.getFieldValue('password_cashierDesk');
      dispatch({
        type: 'MainLayout/verifyPwd', payload: {
          password: password,
        }, callback (val) {
          form.resetFields(['password_cashierDesk']);
          if(val.is_verify=='yes'){
            dispatch({
              type: 'MainLayout/concat', payload: {
                passwordsMainLay: false,
              }
            });
            window.location.href = "#/cashierDesk";
          }else if(val.error_num>=3){
            message.info('收款密码已输入错误3次，2秒后自动将跳转到登录页...');
            setTimeout(() => {
              location.href = '/';
            }, 2000)
          }else{
            message.info('收款密码输入错误，请重新输入!');
            form.resetFields(["password",""]);
          }
        }
      });
    })
  }
  render(){
    let { menuList, passwordsMainLay, form } = this.props;
    let { getFieldDecorator } = form;
    const formItemLayout = { labelCol: { span: 5 }, wrapperCol: { span: 17 } };
    return (
      <LocaleProvider locale={zhCN}>
        <Layout>
          <MainHeader communityIdChange={this.communityIdChange.bind(this)}/>
          <Layout>
            <Sider style={{ minHeight: document.body.scrollHeight - 64 }} >
              <div className="logo"></div>
              <Menu
                theme="dark"
                mode="inline"
                defaultOpenKeys={this.state.openKeys}
                openKeys={this.state.openKeys}
                onClick={this.handleClick}
                onOpenChange={this.onOpenChange}
                selectedKeys={[this.state.current]}>
                <SubMenu key="00" title={<span><Icon type="appstore" /><span>首页</span></span>}>
                  <Menu.Item key="0001">
                    <Link to={'/homePage'}>工作台</Link>
                  </Menu.Item>
                </SubMenu>
                {menuList.map((item, index)=>{
                  return(
                    <SubMenu key={item.key} title={<span><Icon type={item.icon} /><span>{item.name}</span></span>}>
                      {item.children && item.children.map((items, indexs)=>{
                        let isSkip = items.key == "0900" || items.key == "1008" || items.key == "1309"
                        return (
                          <Menu.Item key={items.key}>
                            {/* <Link to={isSkip ? "homepage" : `${items.url}`}
                              onClick={isSkip ? this.golink.bind(this,items.key) : null}>
                              {items.name}
                            </Link> */}
                            {!isSkip
                              ? <Link to={`${items.url}`}>
                                {items.name}
                              </Link>
                              : <span style={{height: '100%', width: '100%', display: 'inline-block'}}
                                onClick={this.golink.bind(this, items.key)}>
                                {items.name}
                              </span>}
                          </Menu.Item>
                        )
                      })}
                    </SubMenu>
                  )
                })}
              </Menu>
            </Sider>
            <Layout>
              <Layout>
                <Content className="content page-content">
                  {this.props.children}
                  <footer>
                    <p><span>咨询电话：0571-88725099</span><span>联系QQ：2763539331</span></p>
                    <p>技术运营支持：杭州筑家易网络科技股份有限公司</p>
                  </footer>
                </Content>
              </Layout>
            </Layout>
          </Layout>
          <Modal title="输入密码" visible={passwordsMainLay} onOk={() => this.handleOk()} onCancel={() => this.handleCancel()} okText="确认" cancelText="取消">
            <Form>
              <FormItem {...formItemLayout} label="收款密码">
                {getFieldDecorator('password_cashierDesk',{rules:[{required: true, message: '请输入密码'}]})(
                  <Input type="password"/>
                )}
              </FormItem>
            </Form>
          </Modal>
        </Layout>
      </LocaleProvider>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.MainLayout
  };
}
export default connect(mapStateToProps)(Form.create()(MainLayout));

import React from 'react';
import { connect } from 'dva';
import './homePage.less';
import {
  Breadcrumb,
  message, Card, Col, Row, Form, Modal, Input } from 'antd';
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 5
  },
  wrapperCol: {
    span: 17
  },
}
function HomePage(props){
  const { dispatch,complaint,form,repair,version,news,house,packAge,permission,passwords, } = props;

  const { getFieldDecorator } = form;
  function downLoadNews(){
    dispatch({
      type:'HomePageModel/versionRead'
    })
  }
  //快速入口
  function quickLink(mark,listid, val){
    if(mark == 'collections'){
      let timeStamp = window.sessionStorage.getItem('password_time_stamp');
      let hasEffect = false;
      if (timeStamp) {
        timeStamp = parseFloat(timeStamp);
        let now = new Date().getTime();
        // 密码有效期一个小时
        if (timeStamp - now < 3600000) {
          hasEffect = true;
        }
      }
      if (hasEffect) {
        window.location.href = "#/cashierDesk";
      } else {
        dispatch({
          type: 'HomePageModel/confirmPwd',callback(val){
            if(val=='yes'){
              dispatch({
                type: 'HomePageModel/concat',
                payload:{
                  passwords:true
                }
              })
            }else{
              window.location.href = "#/collectsPassword";
            }
          }
        })
      }
    }else if(mark == 'repair' || mark == 'complaintManagement' || mark == 'orderRoomManagement' || mark == 'packageManagement'){
      let link = "#/" + mark +'?id=' + listid;
      window.location.href = link
    }else{
      let link = "#/" + mark;
      window.location.href = link
    }
  }
  function addRepair(){
    window.location.href = "#/repairAdd";
    localStorage.flag=true;
  }
  function handleCancel(){
    dispatch({
      type: 'HomePageModel/concat', payload: {
        passwords: false,
      }
    })
    props.form.resetFields(["password",""]);
  }
  function handleOk(){
    props.form.validateFields((err,value)=>{
      if(err){
        return
      }
      let password = props.form.getFieldValue('password');
      dispatch({
        type: 'HomePageModel/verifyPwd', payload: {
          password: password,
        },callback(val){
          if(val.is_verify=='yes'){
            dispatch({
              type: 'HomePageModel/concat', payload: {
                passwords: false,
              }
            })
            // window.location.href = "#/collections?type=index";
            window.location.href = "#/cashierDesk";
          }else if(val.error_num>=3){
            message.info('收款密码已输入错误3次，2秒后自动将跳转到登录页...');
            setTimeout(() => {
              location.href = '/';
            }, 2000)
          }else{
            message.info('收款密码输入错误，请重新输入!');
            props.form.resetFields(["password",""]);
          }
        }
      });
    })

  }
  return (
    <div className="homePage">
      <Breadcrumb separator=">">
        <Breadcrumb.Item>首页</Breadcrumb.Item>
        <Breadcrumb.Item>工作台</Breadcrumb.Item>
      </Breadcrumb>
      {version?
        <Row>
          <Col span="24">
            {news == true?
              <div className="news">
                <h3>系统升级提示</h3>
                <p>本次系统升级内容:{version?version.content:''}</p>
                <p><a target="_blank" href={version.file_name} onClick = {downLoadNews.bind(this)} style={{color:'#ff5e06'}}>查看详细说明</a></p>
              </div>
              :''}
          </Col>
        </Row>:''
      }
      <h2 className="Margin-top25 Margin-bottom14">待办事项</h2>
      <Row style={{marginRight:"-12px"}}>
        <Col span="6">
          <Card className={repair == -1 ? 'Margin-right12 color5':'Margin-right12 color1'} onClick={repair != -1 ?quickLink.bind(this, 'repair',1) : null}>
            <p className={repair == -1 ? 'c9ba2a7' : ''}><i className="iconfont icon-daichuligongdan f30 icon-fff"></i></p>
            <span className="Margin-left8 f15">待处理工单</span>
            <div>
              <span className="f36">{repair == -1 ? '0' : repair}</span>
            </div>
          </Card>
        </Col>
        <Col span="6">
          <Card className={complaint == -1 ? 'Margin-right12 color5' :'Margin-right12 color2'} onClick={complaint != -1 ?quickLink.bind(this, 'complaintManagement',2) : null}>
            <p className={complaint == -1 ? 'c9ba2a7' :'ef9f20'}><i className="iconfont icon-daichulitousu f30 icon-fff"></i></p>
            <span className="Margin-left8 f15">待处理投诉</span>
            <div>
              <span className="f36">{complaint == -1 ? '0' : complaint}</span>
            </div>
          </Card>
        </Col>
        <Col span="6">
          <Card className={house == -1 ? 'Margin-right12 color5':'Margin-right12 color3'} onClick={house != -1 ? quickLink.bind(this, 'orderRoomManagement',1) :null}>
            <p className={house == -1 ? 'c9ba2a7':'d76'}><i className="iconfont icon-daidaikanfangyuan f30 icon-fff"></i></p>
            <span className="Margin-left8 f15">待带看房源</span>
            <div>
              <span className="f36">{house == -1 ? '0' : house}</span>
            </div>
          </Card>
        </Col>
        <Col span="6">
          <Card className={packAge == -1 ? 'Margin-right12 color5': 'Margin-right12 color4'} onClick={packAge != -1 ? quickLink.bind(this, 'packageManagement',1) : null}>
            <p className={packAge == -1 ? 'c9ba2a7':'ee6932'}><i className="iconfont icon-daiqubaoguo f30 icon-fff"></i></p>
            <span className="Margin-left8 f15">待领取包裹</span>
            <div>
              <span className="f36">{packAge == -1 ? '0' : packAge}</span>
            </div>
          </Card>
        </Col>
      </Row>
      <h2 className="Margin-top25 Margin-bottom14">快速入口</h2>
      <div className="enter">
        <Card className="padding-bottom-54">
          {permission && permission['010101']== true?
            <div className="quest">
              <div className="Button-containter" onClick={quickLink.bind(this, 'collections',11)}>
                <span><i className="iconfont icon-xianxiashoukuan f42" style={{color:'#ff6060'}}></i></span>
                <p className="quick-text">线下收款</p>
              </div>
            </div>
            :
            <div className="quest" style={{ cursor: 'auto' }}>
              <div className="Button-containter">
                <span><i className="iconfont icon-xianxiashoukuan f42" style={{ color: '#c0c8ce'}}></i></span>
                <p className="quick-text">线下收款</p>
              </div>
            </div>
          }

          {permission && permission['060302']== true?
            <div className="quest">
              <div className="Button-containter" onClick={quickLink.bind(this, 'addNotice',61)}>
                <span><i className="iconfont icon-fabugonggao f42" style={{color:'#f9a828'}}></i></span>
                <p className="quick-text">发布公告</p>
              </div>
            </div>
            :
            <div className="quest" style={{ cursor: 'auto' }}>
              <div className="Button-containter">
                <span><i className="iconfont icon-fabugonggao f42" style={{ color: '#c0c8ce'}}></i></span>
                <p className="quick-text">发布公告</p>
              </div>
            </div>
          }

          {permission && permission['040102']== true?
            <div className="quest">
              <div className="Button-containter" onClick={addRepair.bind(this)}>
                <span><i className="iconfont icon-xinzengbaoxiu f42" style={{color:'#008be2'}}></i></span>
                <p className="quick-text">新增报修</p>
              </div>
            </div>
            :
            <div className="quest" style={{ cursor: 'auto' }}>
              <div className="Button-containter">
                <span><i className="iconfont icon-xinzengbaoxiu f42" style={{ color: '#c0c8ce'}}></i></span>
                <p className="quick-text">新增报修</p>
              </div>
            </div>
          }

          {permission && permission['130101']== true?
            <div className="quest">
              <div className="Button-containter" onClick={quickLink.bind(this, 'generateBill',31)}>
                <span><i className="iconfont icon-xinzengzhangdan1 f42" style={{color:'#ff6060'}}></i></span>
                <p className="quick-text">新增账单</p>
              </div>
            </div>
            :
            <div className="quest" style={{ cursor: 'auto' }}>
              <div className="Button-containter">
                <span><i className="iconfont icon-xinzengzhangdan1 f42" style={{ color: '#c0c8ce'}}></i></span>
                <p className="quick-text">新增账单</p>
              </div>
            </div>
          }

          {permission && permission['020202']== true?
            <div className="quest">
              <div className="Button-containter" onClick={quickLink.bind(this, 'residentsAdd',22)}>
                <span><i className="iconfont icon-xinzengzhuhu1 f42" style={{color:'#008be2'}}></i></span>
                <p className="quick-text">新增住户</p>
              </div>
            </div>
            :
            <div className="quest" style={{ cursor: 'auto' }}>
              <div className="Button-containter">
                <span><i className="iconfont icon-xinzengzhuhu1 f42" style={{ color: '#c0c8ce'}}></i></span>
                <p className="quick-text">新增住户</p>
              </div>
            </div>
          }

          {permission && permission['080103']== true?
            <div className="quest">
              <div className="Button-containter" onClick={quickLink.bind(this, 'addRentalHouse',81)}>
                <span><i className="iconfont icon-chuzufangyuan f42" style={{color:'#008be2'}}></i></span>
                <p className="quick-text">发布出租房源</p>
              </div>
            </div>
            :
            <div className="quest" style={{ cursor: 'auto' }}>
              <div className="Button-containter">
                <span><i className="iconfont icon-chuzufangyuan f42" style={{ color: '#c0c8ce'}}></i></span>
                <p className="quick-text">发布出租房源</p>
              </div>
            </div>
          }

          {permission && permission['120202']== true?
            <div className="quest">
              <div className="Button-containter" onClick={quickLink.bind(this, 'groupManagementAdd','c2')}>
                <span><i className="iconfont icon-xinzengbumen f42" style={{color:'#3ea897'}}></i></span>
                <p className="quick-text">新增部门</p>
              </div>
            </div>
            :
            <div className="quest" style={{ cursor: 'auto' }}>
              <div className="Button-containter">
                <span><i className="iconfont icon-xinzengbumen f42" style={{ color: '#c0c8ce'}}></i></span>
                <p className="quick-text">新增部门</p>
              </div>
            </div>
          }

          {permission && permission['120302']== true?
            <div className="quest">
              <div className="Button-containter" onClick={quickLink.bind(this, 'userManagementAdd','c3')}>
                <span><i className="iconfont icon-xinzengyuangong f42" style={{color:'#ff6060'}}></i></span>
                <p className="quick-text">新增员工</p>
              </div>
            </div>
            :
            <div className="quest" style={{ cursor: 'auto' }}>
              <div className="Button-containter">
                <span><i className="iconfont icon-xinzengyuangong f42" style={{ color: '#c0c8ce'}}></i></span>
                <p className="quick-text">新增员工</p>
              </div>
            </div>
          }

          {permission && permission['060202']== true?
            <div className="quest">
              <div className="Button-containter" onClick={quickLink.bind(this, 'packageAdd',63)}>
                <span><i className="iconfont icon-daiqubaoguo f42" style={{color:'#f9a828'}}></i></span>
                <p className="quick-text">新增包裹</p>
              </div>
            </div>
            :
            <div className="quest" style={{ cursor: 'auto' }}>
              <div className="Button-containter">
                <span><i className="iconfont icon-daiqubaoguo f42" style={{ color: '#c0c8ce'}}></i></span>
                <p className="quick-text">新增包裹</p>
              </div>
            </div>
          }

          {permission && permission['150402']== true?
            <div className="quest">
              <div className="Button-containter" onClick={quickLink.bind(this, 'printLetter',31)}>
                <span><i className="iconfont icon-dayincuijiaodan f42" style={{color:'#008d76'}}></i></span>
                <p className="quick-text">打印催缴单</p>
              </div>
            </div>
            :
            <div className="quest" style={{cursor:'auto'}}>
              <div className="Button-containter">
                <span><i className="iconfont icon-dayincuijiaodan f42" style={{color:'#c0c8ce'}}></i></span>
                <p className="quick-text">打印催缴单</p>
              </div>
            </div>
          }

        </Card>
      </div>
      <Modal title="输入密码" visible={passwords} onOk={handleOk.bind(this)} onCancel={handleCancel.bind(this)} okText="确认" cancelText="取消">
        <Form>
          <FormItem {...formItemLayout} label="收款密码">
            {getFieldDecorator('password',{rules:[{required: true, message: '请输入密码'}]})(
              <Input type="password"/>
            )}
          </FormItem>
        </Form>
      </Modal>
    </div>
  )
}
function mapStateToProps(state){
  return {
    ...state.HomePageModel,
    ...state.MainLayout
  };
}
export default connect(mapStateToProps)(Form.create()(HomePage));

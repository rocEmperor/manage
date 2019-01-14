import React from 'react';
import { connect } from 'dva';
import { Breadcrumb, Card, Form, Modal } from 'antd';

function ViewNews(props){
  let { dispatch, info, previewVisible, previewImage } = props;
  function imgVisible(src){
    dispatch({
      type: 'ViewNewsModel/concat',
      payload: {
        previewVisible:true,
        previewImage:src
      }
    });
  }

  function handleCancel(){
    dispatch({
      type: 'ViewNewsModel/concat',
      payload: {
        previewVisible:false,
        previewImage:''
      }
    });
  }
  return (
    <div>
      <Breadcrumb separator=">">
        <Breadcrumb.Item>物业服务</Breadcrumb.Item>
        <Breadcrumb.Item><a href="#/newsManager">消息管理</a></Breadcrumb.Item>
        <Breadcrumb.Item>查看详情</Breadcrumb.Item>
      </Breadcrumb>
      <Card>
        <p className="mt2"><span>消息标题：</span>{info.title}</p>
        <p className="mt2"><span>消息类型：</span>{info.notice_type_desc}</p>
        <p className="mt2"><span>发送对象：</span>{info.send_type_desc}</p>
        <p className="mt2"><span>创建人：</span>{info.operator_name}</p>
        <p className="mt2"><span>创建时间：</span>{info.create_at}</p>
        {
          info.describe?<p className="mt2"><span>消息描述：</span>{info.describe}</p>:''
        }
        {info.img_url?
          <div style={{clear:"both",overflow:"hidden",marginTop:"20px"}}><p style={{float:'left'}}>新闻首页：</p>
            <img src={info.img_url} onClick={imgVisible.bind(this,info.img_url)} style={{width:"100px",height:"100px",display:"inlineBlock",marginRight:"10px",marginBottom:"10px",float:"left"}}/>
          </div>
          :''
        }
        <div style={{marginTop:'10px',marginBottom:'10px'}}><span>消息内容：</span>
          <div dangerouslySetInnerHTML={{__html: info.content}} />
        </div>
        <Modal visible={previewVisible} footer={null} onCancel={handleCancel.bind(this)}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </Card>
    </div>
  )
}

function mapStateToProps(state){
  return {
    ...state.ViewNewsModel,
  }
}
export default connect(mapStateToProps)(Form.create()(ViewNews));

import React from 'react';
import { connect } from 'dva';
import { Form, Breadcrumb, Card, Modal } from 'antd';

function ShowNotice(props) {
  let { dispatch, info, previewVisible, previewImage  } = props;

  function imgVisible(src) {
    dispatch({
      type: 'ShowNoticeModel/concat',
      payload: {
        previewVisible: true,
        previewImage: src[0].url
      }
    });
  }

  function handleCancel() {
    dispatch({
      type: 'ShowNoticeModel/concat',
      payload: {
        previewVisible: false,
        previewImage: ''
      }
    });
  }

  return (
    <div>
      <Breadcrumb separator="/">
        <Breadcrumb.Item>物业服务</Breadcrumb.Item>
        <Breadcrumb.Item><a href="#/sunNotice">小区公告</a></Breadcrumb.Item>
        <Breadcrumb.Item>查看公告</Breadcrumb.Item>
      </Breadcrumb>
      <Card>
        <p className="mt2"><span>公告标题：</span>{info?info.title:''}</p>
        <p className="mt2"><span>公告分类：</span>{info ? info.proclaim_type == '1' ? '通知' : info.proclaim_type == '2'?'新闻':'公告': ''}</p>
        <p className="mt2"><span>公告类型：</span>{info ? info.proclaim_cate == '1' ? '文字' : info.proclaim_cate == '2'?'图片':'图文' : ''}</p>
        <p className="mt2"><span>是否置顶：</span>{info ? info.is_top=='2'?'是':'否' : ''}</p>
        {info && info.proclaim_cate == "1" ? <p className="mt2"><span>公告内容：</span>{info ? info.content : ''}</p>:null}
        {info && info.proclaim_cate != "1" ? <p className="mt2"><span>{info && info.proclaim_cate == "2"?'公告图片':'封面图片'}：</span><img src={info && info.img_url!=undefined && info.img_url.length>0 ? info.img_url[0].url:''} onClick={imgVisible.bind(this, info.img_url)} style={{ width: "100px", height: "100px", display: "inlineBlock", marginRight: "10px", marginBottom: "10px"}} /></p>:null}
        {info && info.proclaim_cate == "3" && info.content ? <div><span>公告内容：</span> <div dangerouslySetInnerHTML={{ __html: info.content }} /></div>:null}
      </Card>
      <Modal visible={previewVisible} footer={null} onCancel={handleCancel.bind(this)}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </div>
  )
}

function mapStateToProps(state) {
  return {
    ...state.ShowNoticeModel,
    loading: state.loading.models.ShowNoticeModel,
  }
}
export default connect(mapStateToProps)(Form.create()(ShowNotice));
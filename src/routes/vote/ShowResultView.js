import React from 'react';
import { connect } from 'dva';
import queryString from 'query-string';
import './index.less';
import { Form, Breadcrumb, Button, Card, Popconfirm } from 'antd';
import { Link } from 'react-router-dom';
const createForm = Form.create;
let curHashParam = location.hash.split('?')[1];
let curQuery = queryString.parse(curHashParam);

function ShowResultView (props) {
  let { dispatch, showResultView } = props;
  let { data } = showResultView;
  // 删除该公示结果
  function handleDel (e) {
    dispatch({
      type: 'ShowResultViewModel/voteDeleteResult',
      payload: {
        vote_id: curQuery.vote_id
      }
    })
  }
  function handleBack (e) {
    location.href = `#/ViewVote?id=${curQuery.vote_id}`;
  }

  return (
    <div className="page-content">
      <Breadcrumb separator="/">
        <Breadcrumb.Item>投票管理</Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to={`viewVote?id=${curQuery.vote_id}`}>投票详情</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>查看公示结果</Breadcrumb.Item>
      </Breadcrumb>
      <Card>
        <p className="margin-bttom-10">
          <span className="margin-bttom-10"> 标题:</span>
          <span style={{fontSize:'18px', fontWeight: 'bold'}}> {data.result_title}</span>
          <span></span>
        </p>
        内容:<div dangerouslySetInnerHTML={{__html: data.result_content}} className="imgContent_box"/>
        {
          curQuery.is_show_at != 1
            ? <Button type="primary" className="mt1">
              <Link to={`EditShowResult?vote_id=${curQuery.vote_id}`}>编辑</Link>
            </Button>
            : ''
        }
        {
          curQuery.is_show_at != 1
            ? <Popconfirm title="确定要删除这条公示结果吗？" onConfirm={handleDel}>
              <Button type="primary" className="ml1">删除</Button>
            </Popconfirm>
            : ''
        }
        <Button type="ghost" className="mt1 ml1" onClick={handleBack}>返回</Button>
      </Card>
    </div>
  )
}
export default connect(state => {
  return {
    showResultView: state.ShowResultViewModel,
    layout: state.MainLayout
  }
})(createForm()(ShowResultView));

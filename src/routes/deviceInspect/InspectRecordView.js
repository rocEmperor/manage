import React from 'react';
import { connect } from 'dva';
import { Breadcrumb, Card, Table, Row, Col, Modal, Popover } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
import './index.css';

function InspectRecordView(props) {
  const { detailInfo, list, paginationTotal, params, dispatch, loading, previewVisible, previewImage } = props;
  let styleList = { marginTop: '20px' };
  let styleLists = { margin: '100px 30px 0 0', textAlign: 'center' };
  let fontList = { fontSize: '22px' }
  //没有数据
  function renderColumns(text, record) {
    return (Object.prototype.toString.call(text) === '[object String]' && text !== '') ? text : '-'
  }
  /*
  * 图片预览
  * value Object
  * */
  function imgVisible(value) {
    dispatch({
      type: 'InspectRecordViewModel/concat',
      payload: {
        previewVisible: true,
        previewImage: value
      }
    })
  }
  /*
  * 取消图片预览
  * */
  function handleCancel() {
    dispatch({
      type: 'InspectRecordViewModel/concat',
      payload: {
        previewVisible: false,
        previewImage: ''
      }
    })
  }
  const tableProps = {
    columns: [{
      title: '巡检点名称',
      dataIndex: 'point_name',
      key: 'point_name',
      render: renderColumns
    }, {
      title: '对应设备',
      dataIndex: 'device_name',
      key: 'device_name',
      render: renderColumns
    }, {
      title: '设备编号',
      dataIndex: 'device_no',
      key: 'device_no',
      render: renderColumns
    }, {
      title: '设备状态',
      dataIndex: 'status',
      key: 'status',
      render: renderColumns
    }, {
      title: '完成时间',
      dataIndex: 'finish_at',
      key: 'finish_at',
      render: renderColumns
    }, {
      title: '地理位置',
      dataIndex: 'location_name',
      key: 'location_name',
      render: renderColumns
    }, {
      title: '巡检记录',
      dataIndex: 'record_note',
      key: 'record_note',
      render: (text, record) => {
        return text ? <Popover content={text} title="巡检记录">查看详情</Popover> : '-'
      }
    }, {
      title: '巡检图片',
      dataIndex: 'image_list',
      key: 'image_list',
      render: (text, record) => {
        const content = (
          <div>
            {text && text.map(function (item, index) {
              return <img src={item} key={index} className="mr1" onClick={() => imgVisible(item)} />
            })}
          </div>
        );
        return text ? content : '-'
      }
    }],
    dataSource: list,
    pagination: {
      total: paginationTotal ? Number(paginationTotal) : '',
      current: params.page,
      defaultCurrent: 1,
      defaultPageSize: 10,
      showTotal: (total, range) => `共有 ${paginationTotal} 条`,
      onChange: (page, pageSize) => {
        dispatch({
          type: 'InspectRecordViewModel/inspectRecordViewList',
          payload: { ...params, page }
        })
      },
    },
    rowKey: (record, index) => index,
    loading: loading
  }
  return (
    <div className="page-content">
      <Breadcrumb separator=">">
        <Breadcrumb.Item>设备巡检</Breadcrumb.Item>
        <Breadcrumb.Item>
          <a href="#/inspectRecord">巡检记录</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>查看</Breadcrumb.Item>
      </Breadcrumb>
      <Card className="section" style={{ padding: 0 }}>
        <Row>
          <Col span={8}>
            <div style={styleList}>
              <span>任务名称:</span>
              {detailInfo.plan_name}
            </div>
            <div style={styleList}>
              <span>对应线路:</span>
              {detailInfo.line_name}
            </div>
            <div style={styleList}>
              <span>执行员工:</span>
              {detailInfo.user_name}
            </div>
            <div style={styleList}>
              <span>规定时间:</span>
              {detailInfo.plan_at}
            </div>
            <div style={styleList}>
              <span>完成时间:</span>
              {detailInfo.check_at}
            </div>
            <div style={styleList}>
              <span>状态:</span>
              {detailInfo.status}
            </div>
          </Col>
          <Col span={16}>
            <dl className="fl" style={styleLists}>
              <dt style={fontList}>{detailInfo.point_count}</dt>
              <dd>巡检点数量(个)</dd>
            </dl>
            <dl className="fl" style={styleLists}>
              <dt style={fontList}>{detailInfo.finish_count}</dt>
              <dd>完成数量(个)</dd>
            </dl>
            <dl className="fl" style={styleLists}>
              <dt style={fontList}>{detailInfo.miss_count}</dt>
              <dd>漏检数量(个)</dd>
            </dl>
            <dl className="fl" style={styleLists}>
              <dt style={fontList}>{detailInfo.issue_count}</dt>
              <dd>异常数量(个)</dd>
            </dl>
            <dl className="fl" style={styleLists}>
              <dt style={fontList}>{detailInfo.finish_rate}%</dt>
              <dd>完成率</dd>
            </dl>
          </Col>
        </Row>
        <p style={{ marginTop: '20px', fontSize: '20px' }}>巡检点记录</p>
        <Table className="mt1" {...tableProps} />
        <Modal visible={previewVisible} footer={null} onCancel={handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </Card>
    </div>
  )
}
export default connect(state => {
  return {
    ...state.InspectRecordViewModel
  }
})(InspectRecordView);

import React from 'react';
import { connect } from 'dva';
import { Breadcrumb, Form, Card, Col, Row, Table, Modal } from 'antd';
import { noData } from '../../utils/util';
import './index.less';

function CheckDetail(props) {
  const { dispatch, list, totals, params, info, previewVisible, previewImage} = props;
  
  function imgVisible(value) {
    dispatch({
      type: 'CheckDetailModel/concat',
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
      type: 'CheckDetailModel/concat',
      payload: {
        previewVisible: false,
        previewImage: ''
      }
    })
  }

  const columns = [{
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  }, {
    title: '手机号码',
    dataIndex: 'mobile',
    key: 'mobile',
  }, {
    title: '对应房屋',
    dataIndex: 'group',
    key: 'group',
    render: (index, record) => {
      return record.group + record.building + record.unit + record.room
    }
  }, {
    title: '垃圾袋编号',
    dataIndex: 'numbering',
    key: 'numbering',
  }, {
    title: '发放类型',
    dataIndex: 'type.name',
    key: 'type.name',
  }, {
    title: '发放时间',
    dataIndex: 'create_at',
    key: 'create_at',
  }, {
    title: '检查时间',
    dataIndex: 'checked_at',
    key: 'checked_at',
  }, {
    title: '分值',
    dataIndex: 'score',
    key: 'score',
  }, {
    title: '检查记录',
    dataIndex: 'checked_record',
    key: 'checked_record',
    render: (text, record) => {
      if (text) {
        if (text.length > 10) {
          return <span title={text}>{text.substring(0, 10) + '...'}</span>
        } else {
          return text
        }
      } else {
        return noData()
      }
    }
  }, {
    title: '检查图片',
    dataIndex: 'checked_images',
    key: 'checked_images',
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
  }];

  const pagination = {
    showTotal(total, range) {
      return '共 ' + totals + ' 条'
    },
    defaultCurrent: 1,
    current: params.page,
    defaultPageSize: 10,
    total: totals,
    onChange: (page, size) => { dispatch({ type: 'CheckDetailModel/checkShowList', payload: { ...params, page } }) },
  };
  const tableProps = {
    rowKey: record => record.id,
    columns: columns,
    dataSource: list
  };

  return (
    <div className="page-content">
      <Breadcrumb separator=">">
        <Breadcrumb.Item>物业服务</Breadcrumb.Item>
        <Breadcrumb.Item><a href="#/checkRecord">垃圾袋检查记录详情</a></Breadcrumb.Item>
        <Breadcrumb.Item>详情</Breadcrumb.Item>
      </Breadcrumb>
      <Card>
        <Row>
          <Col span={8}>
            <p>住户姓名：{info.name}</p>
            <p>手机号码：{info.mobile}</p>
            <p>对应房屋：{info.group}{info.building}{info.unit}{info.room}</p>
          </Col>
          <Col span={16}>
            <div className="number">
              <div>
                <p>{info.check_total}</p>
                <span>检查次数(次)</span>
              </div>
              <div>
                <p>{info.good_total}</p>
                <span>超赞次数(次)</span>
              </div>
              <div>
                <p>{info.ordinary_total}</p>
                <span>一般次数(次)</span>
              </div>
              <div>
                <p>{info.fail_total}</p>
                <span>不合格次数(次)</span>
              </div>
              <div>
                <p>{info.score_count}</p>
                <span>总分值</span>
              </div>
            </div>
          </Col>
        </Row>
      </Card>
      <Card className="mt1">
        <Table className="mt1" {...tableProps} pagination={pagination} />
      </Card>
      <Modal visible={previewVisible} footer={null} onCancel={handleCancel}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </div>
  )
}

function mapStateToProps(state) {
  return {
    ...state.CheckDetailModel,
    loading: state.loading.models.CheckDetail
  };
}
export default connect(mapStateToProps)(Form.create()(CheckDetail));
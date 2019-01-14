import React from 'react';
import { connect } from 'dva';
import { Form, Breadcrumb, Card, Row, Col, Input, Select, Button, Table, Popconfirm } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import { Link } from 'react-router-dom';
import { download,author } from '../../../utils/util';
import { getCommunityId } from '../../../utils/util';

function PatrolPoints(props) {
  const { dispatch, form, loading, positionType, photoType,is_reset, list, paginationTotal, params } = props;
  const { getFieldDecorator } = form;
  if (is_reset == true) {
    form.resetFields();
    dispatch({
      type: 'PatrolPoints/concat',
      payload: {
        is_reset: false,
      }
    });
  }
  //布局
  const formItemLayout = {
    labelCol: {
      span: 8
    },
    wrapperCol: {
      span: 14
    },
  }
  //没有数据
  function renderColumns(text, record) {
    return (Object.prototype.toString.call(text) === '[object String]' && text !== '') ? text : '-'
  }
  //表格
  const tableProps = {
    columns: [{
      title: '序号',
      dataIndex: 'tid',
      key: 'tid'
    }, {
      title: '巡更点名称',
      dataIndex: 'name',
      key: 'name',
      render: renderColumns
    }, {
      title: '地理位置',
      dataIndex: 'location',
      key: 'location',
      render: renderColumns
    }, {
      title: '是否需要拍照',
      dataIndex: 'photo',
      key: 'photo',
      render: renderColumns
    }, {
      title: '巡更说明',
      dataIndex: 'note',
      key: 'note',
      render: renderColumns
    }, {
      title: '操作',
      dataIndex: 'desc',
      render: (text, record) => {
        let link2 = `/patrolPointsEdit?id=${record.id}`;
        return <div>
          {author('edit')?<Link to={link2} className="mr1">编辑</Link>:null}
          {author('delete')?<Popconfirm title="确定要删除吗？" onConfirm={removeInfo.bind(this, record)}>
            <a className="mr1">删除</a>
          </Popconfirm>:null}
          {author('downloadTwoDimension')?<a className="mr1" onClick={downloadCode.bind(this, record)} >下载二维码</a>:null}
        </div>
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
          type: 'PatrolPoints/getPointsList',
          payload: { ...params, page }
        })
      },
    },
    rowKey: record => record.id,
    loading: loading
  }
  //搜索
  function handSearch(val) {
    form.validateFields((err, values) => {
      dispatch({
        type: 'PatrolPoints/getPointsList', payload: { ...params, ...values, page: 1 }
      });
    })
  }
  //重置
  function handleReset(val) {
    form.resetFields();
    form.validateFields((err, values) => {
      const payload = {
        page: 1,
        rows: 10,
        name: '',
        need_location: '',
        need_photo: '',
      }
      dispatch({
        type: 'PatrolPoints/getPointsList', payload
      });
    })
  }
  //删除
  function removeInfo(record) {
    dispatch({
      type: 'PatrolPoints/getPointsDelete',
      payload: { id: record.id }
    });
  }
  //下载二维码
  function downloadCode(record) {
    dispatch({
      type: 'PatrolPoints/downFiles',
      payload: {
        "community_id": getCommunityId(),
        id:record.id,
      },callback(data){
        download(data);
      }
    });
    // const _cookie = sessionStorage.getItem("QXToken");
    // let href = getUrl() + '/property/patrol/points-download?data={"id":"' + record.id + '"}&token=' + _cookie;
    // download(href);
    // message.success('下载成功！');
  }

  return (<div>
    <Breadcrumb separator="/">
      <Breadcrumb.Item>巡更管理</Breadcrumb.Item>
      <Breadcrumb.Item>巡更点管理</Breadcrumb.Item>
    </Breadcrumb>
    <Card>
      <Form>
        <Row>
          <Col span={6}>
            <FormItem label="巡更点名称" {...formItemLayout}>
              {getFieldDecorator('name')(<Input type="text" placeholder="请输入巡更点名称" />
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="是否需要定位" {...formItemLayout}>
              {getFieldDecorator('need_location')(
                <Select placeholder="请选择" notFoundContent="没有数据">
                  {positionType ? positionType.map((value, index) => { return <Option key={index} value={value.key}>{value.value}</Option> }) : null}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="是否需要拍照" {...formItemLayout}>
              {getFieldDecorator('need_photo')(
                <Select placeholder="请选择" notFoundContent="没有数据">
                  {photoType ? photoType.map((value, index) => { return <Option key={index} value={value.key}>{value.value}</Option> }) : null}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col className="fr" span={4}>
            <Button type="primary" onClick={handSearch} className="mr1" style={{ marginLeft: '10px' }} >查询</Button>
            <Button type="ghost" onClick={handleReset}>重置</Button>
          </Col>
        </Row>
      </Form>
    </Card>
    <Card className="mt1">
      {author('add')?<Link to="/patrolPointsAdd">
        <Button type="primary">新增巡更点</Button>
      </Link>:null}
      <Table className="mt1" {...tableProps} />
    </Card>
  </div>)
}

function mapStateToProps(state) {
  return {
    ...state.PatrolPoints,
    loading: state.loading.models.PatrolPoints
  };
}
export default connect(mapStateToProps)(Form.create()(PatrolPoints));

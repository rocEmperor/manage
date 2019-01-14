import React from 'react';
import { connect } from 'dva';
import { Form, Breadcrumb, Card, Row, Col, Select, Button, Table, Popconfirm } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import { Link } from 'react-router-dom';
import { download, author, getCommunityId } from '../../utils/util';

function InspectPointManagement(props) {
  const { dispatch, form, loading, positionType, photoType, is_reset, list, paginationTotal, params, deviceIdType } = props;
  const { getFieldDecorator } = form;
  if (is_reset == true) {
    form.resetFields();
    dispatch({
      type: 'InspectPointManagement/concat',
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
      title: '巡检点名称',
      dataIndex: 'name',
      key: 'name',
      render: renderColumns
    }, {
      title: '对应设备',
      dataIndex: 'device_name',
      key: 'device_name',
      render: renderColumns
    }, {
      title: '地理位置',
      dataIndex: 'location_name',
      key: 'location_name',
      render: renderColumns
    }, {
      title: '是否需要拍照',
      dataIndex: 'need_photo',
      key: 'need_photo',
      render: renderColumns
    }, {
      title: '操作',
      dataIndex: 'desc',
      render: (text, record) => {
        let link2 = `/inspectPointAdd?id=${record.id}`;
        return <div>
          {author('edit') ? <Link to={link2} className="mr1">编辑</Link> : null}
          {author('delete') ? <Popconfirm title="确定要删除吗？" onConfirm={removeInfo.bind(this, record)}>
            <a className="mr1">删除</a>
          </Popconfirm> : null}
          {author('downloadTwoDimension') ? <a className="mr1" onClick={downloadCode.bind(this, record)} >下载二维码</a> : null}
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
          type: 'InspectPointManagement/getPointsList',
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
        type: 'InspectPointManagement/getPointsList', payload: { ...params, ...values, page: 1 }
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
        device_id: '',
        need_location: '',
        need_photo: '',
      }
      dispatch({
        type: 'InspectPointManagement/getPointsList', payload
      });
    })
  }
  //删除
  function removeInfo(record) {
    dispatch({
      type: 'InspectPointManagement/getPointsDelete',
      payload: { id: record.id, community_id:  getCommunityId()}
    });
  }
  //下载二维码
  function downloadCode(record) {
    dispatch({
      type: 'InspectPointManagement/downFiles',
      payload: {
        community_id: getCommunityId(),
        id: record.id,
      }, callback(data) {
        download(data);
      }
    });
  }

  return (<div>
    <Breadcrumb separator="/">
      <Breadcrumb.Item>设备巡检</Breadcrumb.Item>
      <Breadcrumb.Item>巡检点管理</Breadcrumb.Item>
    </Breadcrumb>
    <Card>
      <Form>
        <Row>
          <Col span={6}>
            <FormItem label="设备名称" {...formItemLayout}>
              {getFieldDecorator('device_id')(
                <Select placeholder="请选择设备名称" showSearch optionFilterProp="children">
                  {deviceIdType ? deviceIdType.map((value, index) => { return <Option key={index} value={value.id}>{value.name}</Option> }) : null}
                </Select>
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
      {author('add') ? <Link to="/inspectPointAdd">
        <Button type="primary">新增巡检点</Button>
      </Link> : null}
      <Table className="mt1" {...tableProps} />
    </Card>
  </div>)
}

function mapStateToProps(state) {
  return {
    ...state.InspectPointManagement,
    loading: state.loading.models.InspectPointManagement
  };
}
export default connect(mapStateToProps)(Form.create()(InspectPointManagement));

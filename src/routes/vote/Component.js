import React from 'react';
import { connect } from 'dva';
import { Table, Card, Select, Button, Input, Form, Spin, Pagination,Row,Col } from 'antd';
import './index.less';

const Option = Select.Option
let query = {
  community_id: '',
  group: '',
  building: '',
  unit: ''
};


class Residents extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      current: 1,
      searchLoading: false,
      visible: false,
      record: '',
      visible1: false,
      step1: 'block',
      step2: 'hide',
      stepNum: 0,
      progressNum: 0,
      fileListArr: [],
      fileListLen: 0,
      searchTerm: {  // 搜索条件暂存，用于在导出时取出搜索条件
        group: '',
        unit: '',
        room: '',
        building: '',
        status: '',
        name: '',
        identity_type: '',
      },
      taskId: '', // 上传文件的任务id（值由上传时通过接口返回）
      selectedRows: [],
      selectedRowKeys: [],
      type: true
    }
  }

  componentDidMount () {
    let {dispatch, layout} = this.props;
    query = {
      community_id: layout.communityId,
      group: '',
      building: '',
      unit: ''
    };
    if (layout.communityId) {
      dispatch({
        type: 'ComponentModel/concat',
        payload: {
          buildingData: [],
          unitData: [],
          roomData: []
        }
      });
      dispatch({ type: 'ComponentModel/getList2', payload: query }); // 获取住户列表
      dispatch({ type: 'ComponentModel/groupList', payload: query }); // 获取苑期区列表获取
      //dispatch({type: 'ComponentModel/residentList'}) // 获取业主身份列表
    }
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    let { layout, form, selectedRowKeys, dispatch } = this.props;
    if (layout.communityId != nextProps.layout.communityId) {
      query = {
        community_id: nextProps.layout.communityId,
        group: '',
        building: '',
        unit: ''
      };
      dispatch({ type: 'ComponentModel/getList2', payload: query })
      dispatch({ type: 'ComponentModel/groupList', payload: query })
      form.resetFields(['group', 'unit', 'room', 'building', 'property_type', 'status']);
      dispatch({type: 'ComponentModel/residentList'}) // 获取业主身份列表
    }
    if (selectedRowKeys != nextProps.selectedRowKeys) {
      this.setState({
        selectedRows: nextProps.selectedRows,
        selectedRowKeys: nextProps.selectedRowKeys,
      });
      if (nextProps.selectedRowKeys.length > 0) {
        this.setState({
          type: false
        })
      } else {
        this.setState({
          type: true
        })
      }
    }
  }

  // 各搜索项列表获取
  selectChange (mark, val) {
    let { dispatch, form } = this.props;
    query[mark] = val;
    if (mark === 'group') {
      form.resetFields(['unit', 'room', 'building', 'property_type', 'status']);
      dispatch({type: 'ComponentModel/buildingList', payload: query})
    } else if (mark === 'building') {
      form.resetFields(['unit', 'room']);
      dispatch({type: 'ComponentModel/unitList', payload: query})
    } else if (mark === 'unit') {
      form.resetFields([ 'room']);
      dispatch({type: 'ComponentModel/roomList', payload: query})
    }
  }

  //搜索按钮
  handSearch (val) {
    let { dispatch, layout, form } = this.props;
    this.setState({
      current: 1,
      searchLoading: true
    });
    form.validateFields(['group', 'unit', 'room', 'building', 'name', 'status', 'identity_type'], (err, values) => {
      let { group, unit, room, building, status, name, identity_type } = values;
      this.setState({
        searchTerm: values
      });  // 暂存搜索条件
      dispatch({
        type: 'ComponentModel/getList2',
        payload: {
          community_id: layout.communityId,
          group,
          unit,
          room,
          building,
          status,
          name,
          identity_type
        }
      })
    });
  }

  // 搜索重置
  handleReset (e) {
    e.preventDefault();
    let { dispatch, layout, form } = this.props;
    this.setState({
      current: 1,
      searchTerm: {
        group: '',
        unit: '',
        room: '',
        building: '',
        status: '',
        name: '',
        identity_type: ''
      },
    });
    dispatch({
      type: 'ComponentModel/concat',
      payload: {
        buildingData: [],
        unitData: [],
        roomData: []
      }
    });
    form.resetFields(['group', 'unit', 'room', 'building', 'name', 'status', 'identity_type']);
    dispatch({
      type: 'ComponentModel/getList2',
      payload: {
        community_id: layout.communityId
      }
    })
  }

  //分页
  pageChange(index) {
    let { dispatch, layout, form } = this.props;
    this.setState({
      current: index,
    });
    form.validateFields(['group', 'unit', 'room', 'building', 'name', 'status', 'identity_type'], (err, values) => {
      let { group, unit, room, building, property_type, identity_type, status } = values;
      dispatch({
        type: 'ComponentModel/getList2',
        payload: {
          community_id: layout.communityId,
          page: index,
          rows: 10,
          group,
          unit,
          room,
          building,
          property_type,
          identity_type,
          status
        }
      })
    })
  }

  // 分页更改大小
  showSizeChange (index, num) {
    let { dispatch, layout, form } = this.props;
    this.setState({
      current: index,
    });
    form.validateFields(['group', 'unit', 'room', 'building', 'name', 'status', 'identity_type'], (err, values) => {
      let { group, unit, room, building, property_type, identity_type, status } = values;
      dispatch({
        type: 'ComponentModel/getList2',
        payload: {
          community_id: layout.communityId,
          page: 1,
          rows: num,
          group,
          unit,
          room,
          building,
          property_type,
          identity_type,
          status
        }
      })
    })
  }
  handleCheck (e) {
    let { selectedRows, selectedRowKeys } = this.state;
    this.props.handleCheck(e, selectedRows,selectedRowKeys);
  }
  handleCancels () {
    this.props.handleCancels();
  }
  render() {
    let { ComponentModel } = this.props;
    let { totals, data, groupData, buildingData, unitData, roomData, identityType, loading } = ComponentModel;
    const noData = (text, record) => {
      return (
        <span>{text ? text : '-'}</span>
      )
    };
    const columns = [{
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      render: noData
    }, {
      title: '手机号码',
      dataIndex: 'mobile',
      key: 'mobile',
      render: noData
    }, {
      title: '性别',
      dataIndex: 'sex',
      key: 'sex',
      render: (text, record) => {
        if(text === '1'){
          return (
            <span>男</span>
          )
        }else if(text === '2'){
          return (
            <span>女</span>
          )
        }else{
          return (
            <span>未知</span>
          )
        }
      },
    }, {
      title: '对应房屋',
      dataIndex: 'address',
      key: 'address',
      render: noData
    }, {
      title: '身份',
      dataIndex: 'identity_type_desc',
      key: 'identity_type_desc',
      render: noData
    }, {
      title: '认证状态',
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => {
        if(text == 1){
          return (
            <span>未认证</span>
          )
        }else if(text == 2){
          return (
            <span>已认证</span>
          )
        }else{
          return (
            <span>已失效</span>
          )
        }
      }
    }];
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        let arr1 = this.state.selectedRows;
        let arr2 = selectedRows;
        let len1 = arr1.length;
        let arr3, arr4 = [];
        if (len1 == 0) {
          this.setState({
            selectedRows: selectedRows,
          });
        } else {
          arr1.map(item => {
            arr2.map((items, indexs) => {
              if (items.id == item.id) {
                arr2.splice(indexs, 1);
              }
            })
          });
          arr3 = arr1.concat(arr2);
          selectedRowKeys.map(item => {
            arr3.map(items => {
              if (items.id == item) {
                arr4.push(items);
              }
            })
          });
          this.setState({
            selectedRows:arr4
          })
        }
        this.setState({
          selectedRowKeys: selectedRowKeys
        });
      },
    };
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        span: 8
      },
      wrapperCol: {
        span: 16
      }
    };
    const PaginationProps = {
      total: totals,
      //showSizeChanger: true,
      showQuickJumper: false,
      defaultPageSize: 10,
      current: this.state.current,
      showTotal: (total) => `共有 ${totals} 条`,
      onChange: this.pageChange.bind(this),
      onShowSizeChange: this.showSizeChange.bind(this),
    };
    return (
      <div className="page-content">
        <Card className="section">
          <Form>
            <Row>
              <Col span={6}>
                <Form.Item label="房 屋：" {...formItemLayout}>
                  {getFieldDecorator('group')(
                    <Select className="select-150 mr-5"                  
                      placeholder="苑\期\区"
                      showSearch={true}
                      notFoundContent="没有数据"
                      onChange={this.selectChange.bind(this, 'group')}>
                      {groupData.map((value, index) => {
                        return <Option key={index} value={value.name}>{value.name}</Option>
                      })}
                    </Select>)}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item  {...formItemLayout}>
                  {getFieldDecorator('building')(
                    <Select style={{marginLeft:"50px"}} className="select-100 mr-5"                  
                      placeholder="幢"
                      notFoundContent="没有数据"
                      showSearch={true}
                      onChange={this.selectChange.bind(this, 'building')}>
                      {buildingData.map((value, index) => {
                        return <Option key={index} value={value.name}>{value.name}</Option>
                      })}
                    </Select>)}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item  {...formItemLayout}>
                  {getFieldDecorator('unit')(
                    <Select className="select-100 mr-5"                  
                      placeholder="单元"
                      notFoundContent="没有数据"
                      showSearch={true}
                      onChange={this.selectChange.bind(this, 'unit')}>
                      {unitData.map((value, index) => {
                        return <Option key={index} value={value.name}>{value.name}</Option>
                      })}
                    </Select>)}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item  {...formItemLayout}>
                  {getFieldDecorator('room')(
                    <Select className="select-100 mr-5"                  
                      placeholder="室"
                      showSearch={true}
                      notFoundContent="没有数据">
                      {roomData.map((value, index) => {
                        return <Option key={index} value={value.name}>{value.name}</Option>
                      })}
                    </Select>)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <Form.Item label="住 户" {...formItemLayout}>
                  {getFieldDecorator('name')(
                    <Input placeholder="请输入姓名/手机号码"/>
                  )}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="身 份：" {...formItemLayout}>
                  {getFieldDecorator('identity_type')(
                    <Select className="select-150 mr-5"                  
                      placeholder="请选择"
                      notFoundContent="没有数据">
                      <Option value="">全部</Option>
                      {identityType.map((value, index) => {
                        return <Option key={index} value={value.key.toString()}>{value.value}</Option>
                      })}
                    </Select>)}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="认证状态：" {...formItemLayout}>
                  {getFieldDecorator('status')(
                    <Select className="select-100 mr-5"  placeholder="请选择">
                      <Option value="">全部</Option>
                      <Option value="2">已认证</Option>
                      <Option value="1">未认证</Option>
                    </Select>)}
                </Form.Item>
              </Col>
              <Col span={6}>
                <div className="btn-group-right">
                  <Button type="ghost" onClick={this.handleReset.bind(this)}>
                    重置
                  </Button>
                  <Button type="primary" onClick={this.handSearch.bind(this)}>
                    搜索
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card>
          <Spin  spinning={loading}>
            <Table rowSelection={rowSelection}
              columns={columns}
              dataSource={data}
              rowKey={record => record.id}
              pagination={false}/>
            <Pagination {...PaginationProps} className="fr mtb1"/>
          </Spin>

        </Card>
        <div style={{marginTop: 20,textAlign:"center"}}>
          <Button style={{marginRight: 10}}
            type="primary"
            onClick={this.handleCheck.bind(this)}>
            确定选择
          </Button>
          <Button onClick={this.handleCancels.bind(this)}>
            返回
          </Button>
        </div>
      </div>
    )
  }
}
// Residents = Form.create({})(Residents);
// export default Residents;
export default connect(state => {
  return {
    ComponentModel: state.ComponentModel
  }
})(Form.create({})(Residents));

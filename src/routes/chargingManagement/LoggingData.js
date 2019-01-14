import React from 'react'
import {Breadcrumb,Card,Button,Table,Popconfirm,Form,Modal} from 'antd'
import { connect } from 'dva';
import { Link } from 'react-router-dom';
import ExImport from '../../components/ExImport/';
import { noData, download } from '../../utils/util';
import { getCommunityId } from '../../utils/util';
function LoggingData(props){
  const {dispatch,statusType,loading,list,totals,current,id,visible,visible1} = props;
  function showModal(mark){
    if(mark == "2"){
      dispatch({
        type:"LoggingDataModel/concat",
        payload:{
          visible1:true,
        }
      })
    }else if(mark == "1"){
      dispatch({
        type:"LoggingDataModel/concat",
        payload:{
          visible:true,
        }
      })
    }
  }
  //分页
  function pageChange(index){
    dispatch({
      type:"LoggingDataModel/concat",
      payload:{
        current: index,
      }
    })
    props.form.validateFields((err, values) => {
      dispatch({
        type:"LoggingDataModel/sharedPeriodRecordList",
        payload:{
          period_id: id,
          page: index,
          rows: 10,
        }
      })
    })
  }
  function handleOk(e){
    let param = {
      community_id:getCommunityId(),
      period_id:id,
    }
    dispatch({
      type:"LoggingDataModel/createBill",
      payload:param
    })
  }
  function handleCancel(e){
    dispatch({
      type:"LoggingDataModel/concat",
      payload:{
        visible1:false,
      }
    })
  }
  function removeInfo(record){
    dispatch({
      type:"LoggingDataModel/recordDelete",
      payload:{
        "id": record.id
      }
    })
  }
  /**
   * 隐藏弹框
   */
  function hideModalVisible() {
    dispatch({
      type: 'LoggingDataModel/concat',
      payload: {
        visible: false,
      }
    });
    dispatch({
      type: 'LoggingDataModel/importSuccess'
    })
  }
  /**
   * 批量导入中的下载模板
   */
  function downFiles() {
    dispatch({
      type: 'LoggingDataModel/downFiles',
      payload: {
        "community_id": getCommunityId()
      },callback(data){
        download(data);
      }
    });
  }
  const columns = [{
    title: '电梯编号/楼道号/项目名称',
    dataIndex: 'shared_name',
    key: 'shared_name',
    width:'205',
    render: noData,
  }, {
    title: '所属类型',
    dataIndex: 'shared_type_msg',
    key: 'shared_type_msg',
    width:'205',
    render: noData,
  }, {
    title: '上次度数',
    dataIndex: 'latest_num',
    key: 'latest_num',
    width:'152',
    render: noData,
  }, {
    title: '本次读数',
    dataIndex: 'current_num',
    key: 'current_num ',
    width:'152',
    render: noData,
  },{
    title: '对应金额（元）',
    dataIndex: 'amount',
    key: 'amount',
    width:'152',
    render: noData,
  },{
    title: '操作',
    key: 'action3',
    width:'170',
    render: (text, record) => {
      let iLink = `addMeterReading?period_id=${id}&id=${record.id}&type=edit`;
      return(
        <div>
          {statusType == 3||statusType == 2?null:''}
          {statusType == 1?<span>
            <Link to={iLink}>编辑</Link>
            <Popconfirm title="确定要删除这个房屋数据么？" onConfirm={removeInfo.bind(this, record)}>
              <a className="table-operating" style={{marginLeft:"10px"}}>删除</a>
            </Popconfirm>
          </span>:null}
        </div>
      )

    },
  }];
  const PaginationProps = {
    total: Number(totals),
    defaultPageSize: 10,
    current: current,
    onChange: pageChange.bind(this),
    showTotal: (total) => `共有 ${Number(totals)} 条`,
  }
  let link12 = `/addMeterReading?period_id=${id}`;
  let link13 = `/loggingView?period_id=${id}&status=${statusType}`
  return (
    <div>
      <Breadcrumb separator=">">
        <Breadcrumb.Item>收费管理</Breadcrumb.Item>
        <Breadcrumb.Item><a href="#/readingManagement">抄表管理</a></Breadcrumb.Item>
        <Breadcrumb.Item>{statusType==3||statusType==2?"查看数据":"录入数据"}</Breadcrumb.Item>
      </Breadcrumb>
      <ExImport
        id={'communitys'}
        visible={visible}
        callback={hideModalVisible.bind(this)}
        importType="publicAccount"
        period_id={id}
        importUrl="/property/shared-period/import"
        downUrl={downFiles.bind(this)}
      />
      <Card>
        <div className="btn-group-left" style={{marginBottom:"15px"}}>
          {statusType==3||statusType==2?null:<Button type="" className="ml1"  onClick={showModal.bind(this,"1")}>批量导入</Button>}
          {statusType==3||statusType==2?null:<Link to={link12}><Button style={{marginLeft:"20px"}} className="ml-20">新增抄表数据</Button></Link>}
        </div>
        <Table loading={loading} className="marginTop-20" dataSource={list} columns={columns} rowKey={record => record.id} pagination={PaginationProps} />
        {statusType==3||statusType==2?<Link className="ant-modal-footer" to={link13}><Button className="create-management" type="primary">查看账单</Button></Link>:
          <div className="btn_center"><Button className="create-management" onClick={showModal.bind(this,"2")} type="primary">生成账单</Button></div>
        }
      </Card>
      <Modal
        title="生成分摊账单"
        visible={visible1}
        onCancel={handleCancel.bind(this)}
        footer={[
          <Button key="submit" type="primary" onClick={handleOk.bind(this)}>
            确认生成账单
          </Button>,
        ]}
      >
        <div>
          <p>分摊账单将按照以下公式自动分摊到各户，生成账单后不可撤销，请谨慎操作！ </p>

          <p>每户应分摊总金额 = 楼层＆面积相结合应分摊金额  +  本楼道用电应分摊金额 +  小区整体用水用电各户应分摊金额 </p>


          <p>每户楼层＆面积相结合应分摊金额 (电梯户)  =  按楼层分摊金额 +  按面积分摊金额 ／  2 </p>


          <p>每户按楼层分摊金额 = 电梯用电金额  *  楼层分摊系数 （每户房屋楼段系数／ 单元或者栋总的楼段系数） </p>


          <p>每户按面积分摊金额 = 电梯用电金额  *  房屋面积分摊系数 （每户房屋面积／ 单元或者栋总的房屋面积） </p>


          <p>每户楼道用电应分摊金额  （楼梯户）= 楼道用电总金额 ／ 楼道总面积  * 每户房屋面积 </p>


          <p>每户整体用水用电金额= 小区整体用水用电总金额 ／ 小区房屋总面积 * 每户房屋面积 </p>
        </div>
      </Modal>
    </div>
  )
}
function mapStateToProps(state) {
  return {
    ...state.LoggingDataModel,
  }
}
export default connect(mapStateToProps)(Form.create()(LoggingData));

import React from 'react'
import { Pagination, Tabs, Card } from 'antd'
import { connect } from 'react-redux'
import Breadcrumb from './Components/Breadcrumb.js'
import FormulaAddModal from './Components/FormulaAddModal.js'
import FormulaEditWaterModal from './Components/FormulaEditWaterModal.js'
import FormulaEditElectricityModal from './Components/FormulaEditElectricityModal.js'
import FormulaDisplays from './Components/FormulaDisplays'
import FormulaAddWater from './Components/FormulaAddWater'
import FormulaElectricityModal from './Components/FormulaElectricityModal'
import FormulaAddElectricity from './Components/FormulaAddElectricity'
import FormulaWaterModal from './Components/FormulaWaterModal'
import FormulaEditWaterPrice from './Components/FormulaEditWaterPrice'
import FormulaEditElectricityPrice from './Components/FormulaEditElectricityPrice'
// import styles from './FormulaManagement.less'
import { getCommunityId } from  '../../utils/util'
const TabPane = Tabs.TabPane;

function FormulaManagement (props) {
  let { dispatch, FormulaManagementModel } = props;
  let {
    formulaSharedElectricList,
    formulaSharedWaterList,
    totals,
    visible2,
    current,
    list,
    visible,
    submitButtonLoading,
    formulaWaterList,
    formulaWaterShow,
    visible1,
    formulaElectricityList,
    formulaElectricShow,
    editVisible,
    electricityVisible
  } = FormulaManagementModel;
  let hasSubmit = false;
  //物业费公式
  const PaginationProps = {
    // showQuickJumper: true,
    showTotal(total, range){
      return `总计 ${totals} 条数据`
    },
    defaultCurrent: 1,
    current: current,
    defaultPageSize: 8,
    total: totals,
    onChange (page) {
      dispatch({
        type: 'FormulaManagementModel/concat',
        payload: {
          current: page
        }
      });
      dispatch({
        type: 'FormulaManagementModel/getFormulaList',
        payload: {
          page: page
        }
      })
    }
  };
  const FormulaDisplaysProps = {
    items: list,
    onAdd () {
      dispatch({
        type: 'FormulaManagementModel/concat',
        payload: {
          visible: true
        }
      })
    },
    onDelete (id, resolve, reject) {
      dispatch({
        type: 'FormulaManagementModel/deleteFormula',
        payload: {
          id: id,
          resolve: resolve,
          reject: reject
        }
      })
    }
  };

  const FormulaAddModalProps = {
    visible: visible,
    loading: submitButtonLoading,
    onOk () {},
    onCancel () {
      dispatch({
        type: 'FormulaManagementModel/concat',
        payload: {
          visible: false
        }
      })
    },
    onSubmit (formulaName, calc_rule, del_decimal_way, formula, callback) {
      dispatch({
        type: 'FormulaManagementModel/submitFormula',
        payload: {
          formulaName: formulaName,
          calc_rule: calc_rule,
          del_decimal_way: del_decimal_way,
          formula: formula,
          callback: callback
        }
      });
      setTimeout(() => {
        dispatch({
          type: 'FormulaManagementModel/getFormulaList'
        })
      }, 1000)
    },
  };
  //水费公式
  const FormulaPooledProps = {
    items: formulaWaterList,
    onEdit () {
      dispatch({
        type: 'FormulaManagementModel/concat',
        payload: {
          visible1: true
        }
      });
      dispatch({
        type: 'FormulaManagementModel/getFormulaWaterShow',
        payload: { community_id: getCommunityId() }
      })
    }
  };
  const FormulaWaterModalProps = {
    items: formulaWaterShow,
    loading: submitButtonLoading,
    visible: visible1,
    onSubmit (type, price, calc_rule, del_decimal_way, phase_list, community_id, callback) {
      if (!hasSubmit) {
        hasSubmit = true;
        let dataList = {
          type: type,
          price: price,
          calc_rule: phase_list,
          del_decimal_way: del_decimal_way,
          phase_list: calc_rule,
          community_id: community_id,
          callback: callback
        };
        dispatch({
          type: 'FormulaManagementModel/submitFormulaWater',
          payload: dataList,
          callback: () => {
            hasSubmit = false
          },
          err: () => {
            hasSubmit = false
          }
        });
      }
    },
    handleCancel1 () {
      dispatch({
        type: 'FormulaManagementModel/concat',
        payload: {
          visible1: false
        }
      })
    }
  };

  //电费公式
  const FormulaEditElectricityProps = {
    items: formulaElectricityList,
    onEdit() {
      dispatch({
        type: 'FormulaManagementModel/concat',
        payload: {
          visible2: true
        }
      });
      dispatch({
        type: 'FormulaManagementModel/getFormulaElectricShow',
        payload: { community_id: getCommunityId() }
      })
    }
  };
  const FormulaElectricModalProps = {
    items: formulaElectricShow,
    loading: submitButtonLoading,
    visible: visible2,
    onSubmit(type, price, calc_rule, del_decimal_way, phase_list){
      if (!hasSubmit) {
        hasSubmit = true;
        let dataList = {
          type: type,
          price: price,
          phase_list: calc_rule,
          calc_rule: phase_list,
          del_decimal_way: del_decimal_way,
          community_id: getCommunityId()
        };
        dispatch({
          type: 'FormulaManagementModel/submitFormulaElectric',
          payload: dataList,
          callback: () => {
            hasSubmit = false
          },
          err: () => {
            hasSubmit = false
          }
        });
      }
    },
    handleCancel1(){
      dispatch({
        type: 'FormulaManagementModel/concat',
        payload: { visible2: false }
      })
    },
  };

  //公摊水电费公式管理
  const FormulaAddWaterProps = {
    items: formulaSharedWaterList,
    onEdit(id, resolve, reject) {
      dispatch({
        type: 'FormulaManagementModel/concat',
        payload: { editVisible: true }
      })
    }
  };
  const FormulaAddElectricityProps = {
    items: formulaSharedElectricList,
    onEdit(id, resolve, reject) {
      dispatch({
        type: 'FormulaManagementModel/concat',
        payload: { electricityVisible: true }
      })
    }
  };

  const FormulaEditWaterModalProps = {
    visible: editVisible,
    loading: submitButtonLoading,
    price: formulaSharedWaterList,
    onOk(){},
    onCancels(){
      dispatch({
        type: 'FormulaManagementModel/concat',
        payload: { editVisible: false }
      })
    },
    onSubmits(waterPrice){
      if (!hasSubmit) {
        hasSubmit = true;
        let payload = {};
        payload.community_id = getCommunityId();
        payload.price = waterPrice;
        dispatch({
          type: 'FormulaManagementModel/submitFormulaSharedEditWater',
          payload: payload,
          callback: () => {
            hasSubmit = false
          },
          err: () => {
            hasSubmit = false
          }
        });
      }
    },
  };
  const FormulaEditElectricityModalProps = {
    visible: electricityVisible,
    loading: submitButtonLoading,
    price: formulaSharedElectricList,
    onOk(){},
    onCancels(){
      dispatch({
        type: 'FormulaManagementModel/concat',
        payload: { electricityVisible: false }
      })
    },
    onSubmits(price){
      if (!hasSubmit) {
        hasSubmit = true;
        let payload = {};
        payload.community_id = getCommunityId();
        payload.price = price;
        dispatch({
          type: 'FormulaManagementModel/submitFormulaSharedEditElectricity',
          payload: payload,
          callback: () => {
            hasSubmit = false
          },
          err: () => {
            hasSubmit = false
          }
        });
      }
    },
  };


  return (
    <div className="FormulaManagement">
      <Breadcrumb/>
      <Card>
        <Tabs defaultActiveKey="1">
          <TabPane tab={<span>物业费公式</span>} key="1">
            <FormulaDisplays {...FormulaDisplaysProps}/>
            {totals !== 1
              ? <div style={{width: '100%', textAlign: 'right', paddingTop: '10px'}}>
                <Pagination {...PaginationProps}/>
              </div>
              : null}
            <FormulaAddModal {...FormulaAddModalProps}/>
          </TabPane>
          <TabPane tab={<span>水费公式</span>} key="2">
            <FormulaEditWaterPrice {...FormulaPooledProps}/>
            <FormulaWaterModal {...FormulaWaterModalProps} />
            {/*<FormulaEditWaterModal {...FormulaEditWaterModalProps}/>*/}
          </TabPane>
          <TabPane tab={<span>电费公式</span>} key="3">
            <FormulaEditElectricityPrice {...FormulaEditElectricityProps}/>
            <FormulaElectricityModal {...FormulaElectricModalProps} />
            {/*<FormulaEditElectricityModal {...FormulaEditElectricityModalProps}/>*/}
          </TabPane>
          <TabPane tab={<span>公摊水电费公式</span>} key="4">
            <FormulaAddWater {...FormulaAddWaterProps}/>
            <FormulaAddElectricity {...FormulaAddElectricityProps}/>
            <FormulaEditWaterModal {...FormulaEditWaterModalProps}/>
            <FormulaEditElectricityModal {...FormulaEditElectricityModalProps}/>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  )
}

export default connect(state => {
  return {
    FormulaManagementModel: state.FormulaManagementModel,
  }
})(FormulaManagement);

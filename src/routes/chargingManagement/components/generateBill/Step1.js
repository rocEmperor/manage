import React from 'react';
import { Spin } from 'antd';
import Selector from './Selector.js';
import { isNumber } from '../../../../utils/util.js';
function Step1(props) {
  const { buildings2, dispatch, selectorsLoading } = props;
  function onMark(value) {
    let arr = buildings2;
    let newBuildings = [];
    let repeatIndex = 0;

    function contains() {
      let i = arr.length;
      while (i--) {
        if (arr[i].index === value.index) {
          return repeatIndex = i
        }
      }
      return false;
    }
    if (isNumber(contains())) {
      arr.splice(repeatIndex, 1)
      newBuildings = arr.concat(value)
    } else {
      newBuildings = arr.concat(value)
    }
    dispatch({
      type: 'GenerateBillModel/concat',
      payload: {
        buildings2: newBuildings
      }
    })
  }
  return (
    <div>
      <Spin tip="获取楼幢信息中..."
        spinning={selectorsLoading}
        size="large">
        <div style={{ minHeight: "100px" }}>
          {props.buildings.length
            ? props.buildings.map((value, index) => {
              return (
                <Selector
                  key={index}
                  value={value}
                  index={index}
                  onMark={onMark}
                />
              )
            })
            : '暂无数据'}
        </div>
      </Spin>
    </div>
  )
}

export default Step1;
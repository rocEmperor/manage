import React from 'react';
// import * as actions from '../../actions/app';
// import { Input, Button, Modal, Form, message } from 'antd';
import './index.less';
// import { getApiUrl } from '../../config'
let echarts = require('echarts');

let colors = ['#f27573', '#69757a', '#ffd553', '#51b8ae', '#ff8d69', '#a48b82', '#dde779', '#7d89cd', '#cacaca', '#51d1e1', '#f06695', '#fff179', '#8ca8f9', '#c9b185', '#9e5c81'];

class DashboardCharts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    let { id,data } = this.props;
    let myChart = echarts.init(document.getElementById(id));
    myChart.setOption({
      color: colors,
      tooltip: {
        trigger: 'axis',
        formatter: function (params) {
          params = params[0];
          let date = new Date(params.name);
          return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' : ' + params.value[1];
        },
        axisPointer: {
          animation: false
        }
      },
      xAxis: {
        type: 'time',
        splitLine: {
          show: false
        }
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        splitLine: {
          show: false
        }
      },
      series: [{
        name: '模拟数据',
        type: 'line',
        showSymbol: false,
        hoverAnimation: false,
        data: data
      }]
    })

  }
  UNSAFE_componentWillReceiveProps(nextProps) {

    // if (this.props.xAxis != nextProps.xAxis) {
    if (this.props.data != nextProps.data ) {
      let { id, data } = nextProps;
      // echarts.dispose(document.getElementById(id));
      let myChart = echarts.init(document.getElementById(id));
      // console.log(data,'charts');
      
      myChart.setOption({
        color: colors,
        tooltip: {
          trigger: 'axis',
          formatter: function (params) {
            params = params[0];
            const date = new Date(params.name);
            return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' : ' + params.value[1];
          },
          axisPointer: {
            animation: false
          }
        },
        legend: {
          textStyle: {
            color: '#fff',
            fontSize: 12
          }
        },
        xAxis: {
          type: 'time',
          splitLine: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#fff'
            }
          },
        },
        yAxis: {
          type: 'value',
          boundaryGap: [0, '100%'],
          splitLine: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#fff'
            }
          },
        },
        series: [{
          name: '模拟数据',
          type: 'line',
          showSymbol: false,
          hoverAnimation: false,
          data: data
        }]
      })
    }
  }

  render() {
    // let style = {
    //   width: '100%',
    //   height: '200px'
    // }
    
    return (
      <div id={this.props.id} className="dashboard-charts">

      </div>
    );
  }
}
export default DashboardCharts;

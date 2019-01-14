import React from 'react';
import './index.less';
let echarts = require('echarts');

/**
  * 组件参数配置
  * 
  * @param {string} id
  * id = 每个图标的标识
  * @param {string} type
  * type = 区分属于哪一类图标（饼图pie，折线图line，柱状图bar）
  * @param {array} color
  * color = 多组数据的颜色区分，第一组数据为第一种颜色
  * @param {string} legendShow
  * legendShow = 是否显示默认标注
  * @param {number} intervalNum
  * intervalNum = 折线图或者柱状图，x轴间隔显示，1:空一格显示，实际的坐标点还在只是x轴看着更不挤
  * @param {string} lineColor
  * lineColor = 折线图或者柱状图，x轴坐标的颜色
  * @param {string} legendTextStyle
  * legendTextStyle = 折线图标注的文字颜色
  * @param {number} maxSize
  * maxSize = 10 如果最大值小于10则设置最大值为10，防止最大值太小出现小数点
  * @param {  } roseType
  * roseType 如果有这个字段通过半径区分数据大小
  * @param { array } radius
  * radius 如果有这个字段通过半径区分数据大小
  * @param {  } noPercent
  * noPercent 折线图不是以百分比来显示
  * 
*/

let colors = ['#f27573', '#69757a', '#ffd553', '#51b8ae', '#ff8d69', '#a48b82', '#dde779', '#7d89cd', '#cacaca', '#51d1e1', '#f06695', '#fff179', '#8ca8f9', '#c9b185', '#9e5c81'];

class Charts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    let { id, type, xAxis, yAxis, pieData, legend } = this.props;
    let myChart = echarts.init(document.getElementById(id));
    // 绘制柱状图
    if (type == 'bar') {
      if (yAxis[0]) {
        myChart.setOption({
          color: this.props.color ? this.props.color : colors,
          title: { left: "center" },
          legend: {
            orient: 'vertical',
            left: 'right',
            data: legend,
            show: this.props.legendShow ? !this.props.legendShow : true,
            selectedMode: false,
            textStyle: {
              color: this.props.legendTextStyle ? this.props.legendTextStyle : '#000',
              fontSize: 12
            }
          },
          tooltip: {},
          xAxis: {
            data: xAxis,
            "axisLabel": {
              interval: this.props.intervalNum ? this.props.intervalNum : 0,
              rotate: 7
            },
            axisLine: {
              lineStyle: {
                color: this.props.lineColor ? this.props.lineColor : '#000',
              }
            },
          },
          yAxis: [{
            type: 'value',
          }],
          series: yAxis
        });
      } else {
        myChart.setOption({
          color: this.props.color ? this.props.color : colors,
          title: { left: "center" },
          legend: {
            orient: 'vertical',
            left: 'right',
            data: legend,
            show: this.props.legendShow ? !this.props.legendShow : true,
            selectedMode: false,
            textStyle: {
              color: this.props.legendTextStyle ? this.props.legendTextStyle : '#000',
              fontSize: 12
            }
          },
          tooltip: {},
          xAxis: {
            data: xAxis,
            "axisLabel": {
              interval: this.props.intervalNum ? this.props.intervalNum : 0,
              rotate: 7
            },
            axisLine: {
              lineStyle: {
                color: this.props.lineColor ? this.props.lineColor : '#000',
              }
            },
          },
          yAxis: [{
            type: 'value',
            // min: 0,
            // max: 10000
          }],
          series: yAxis
        });
      }
    } else if (type == 'pie') {
      myChart.setOption({
        animation: false,
        color: this.props.color ? this.props.color:colors,
        title: {
          left: "center"
        },
        legend: {
          orient: 'horizontal',
          left: 'center',
          bottom: 'bottom',
          data: legend,
          show: this.props.legendShow ? !this.props.legendShow : true,
          selectedMode: false,
          textStyle: {
            color: this.props.legendTextStyle ? this.props.legendTextStyle : '#000',
            fontSize: 12
          }
        },
        tooltip: {
          formatter: "{b}: {c} ({d}%)",
          //position: ['50%', '50%']
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            roseType: this.props.roseType ? 'radius' : null,
            radius: this.props.radius ? this.props.radius : '55%',
            label: {
              normal: {
                show: id == 'charts-3-dashboard'?true:false,
              }
            },
            data: pieData
          }
        ]
      })
    } else if (type == 'line') {
      myChart.setOption({
        color: this.props.color ? this.props.color : colors,
        title: {
          left: "center"
        },
        legend: {
          orient: 'vertical',
          left: 'right',
          data: legend,
          show: this.props.legendShow ? !this.props.legendShow : true,
          selectedMode: false,
          textStyle: {
            color: this.props.legendTextStyle ? this.props.legendTextStyle : '#000',
            fontSize: 12
          }
        },
        tooltip: {
          trigger: 'axis',
          formatter: this.props.noPercent ? '' :'{b0}<br />{a0}: {c0}%<br />{a1}: {c1}%'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: xAxis,
          "axisLabel": {
            interval: this.props.intervalNum ? this.props.intervalNum:0,
            rotate: 7
          },
          axisLine: {
            lineStyle: {
              color: this.props.lineColor ? this.props.lineColor : '#000',
            }
          },
        },
        yAxis: {
          type: 'value',
          minInterval: 1,
          boundaryGap: [0, 0.1],
          axisLabel: {
            formatter: this.props.noPercent ? '{value}' : '{value} %',
          },
          axisLine: {
            lineStyle: {
              color: this.props.lineColor ? this.props.lineColor : '#000',
            }
          },
          precision:0,
          // min: 1,
          max: this.props.maxSize && this.props.maxSize == 10 ? 10 :null,
        },
        series: yAxis
      })
    }

  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    // if (this.props.xAxis != nextProps.xAxis) {
    if (this.props.xAxis != nextProps.xAxis || this.props.yAxis != nextProps.yAxis || this.props.pieData != nextProps.pieData || this.props.maxSize != nextProps.maxSize) {
      let { id, type, xAxis, yAxis, pieData, legend } = nextProps;
      echarts.dispose(document.getElementById(id));
      let myChart = echarts.init(document.getElementById(id));
      // 绘制柱状图
      if (type == 'bar') {
        if (yAxis[0]) {
          myChart.setOption({
            color: nextProps.color ? nextProps.color : colors,
            title: { left: "center" },
            legend: {
              orient: 'vertical',
              left: 'right',
              data: legend,
              show: nextProps.legendShow ? !nextProps.legendShow : true,
              selectedMode: false,
              textStyle: {
                color: nextProps.legendTextStyle ? nextProps.legendTextStyle : '#000',
                fontSize: 12
              }
            },
            tooltip: {},
            xAxis: {
              data: xAxis,
              "axisLabel": {
                interval: nextProps.intervalNum ? nextProps.intervalNum : 0,
                rotate: 7
              },
              axisLine: {
                lineStyle: {
                  color: nextProps.lineColor ? nextProps.lineColor : '#000',
                }
              },
            },
            yAxis: [{
              type: 'value',
            }],
            series: yAxis
          });
        } else {
          myChart.setOption({
            color: nextProps.color ? nextProps.color : colors,
            title: { left: "center" },
            legend: {
              orient: 'vertical',
              left: 'right',
              data: legend,
              show: nextProps.legendShow ? !nextProps.legendShow : true,
              selectedMode: false,
              textStyle: {
                color: nextProps.legendTextStyle ? nextProps.legendTextStyle : '#000',
                fontSize: 12
              }
            },
            tooltip: {},
            xAxis: {
              data: xAxis,
              "axisLabel": {
                interval: nextProps.intervalNum ? nextProps.intervalNum : 0,
                rotate: 7
              },
              axisLine: {
                lineStyle: {
                  color: nextProps.lineColor ? nextProps.lineColor : '#000',
                }
              },
            },
            yAxis: [{
              type: 'value',
              // min: 1,
              // max: 10000
            }],
            series: yAxis
          });
        }
      } else if (type == 'pie') {
        myChart.setOption({
          animation: false,
          color: nextProps.color ? nextProps.color : colors,
          title: {
            left: "center"
          },
          legend: {
            orient: 'horizontal',
            left: 'center',
            bottom: 'bottom',
            data: legend,
            show: nextProps.legendShow ? !nextProps.legendShow : true,
            selectedMode: false,
            textStyle: {
              color: nextProps.legendTextStyle ? nextProps.legendTextStyle : '#000',
              fontSize: 12
            }
          },
          tooltip: {
            formatter: "{b}: {c} ({d}%)",
            //position: ['50%', '50%']
          },
          series: [
            {
              name: '访问来源',
              type: 'pie',
              roseType: nextProps.roseType ? 'radius' : null,
              radius: nextProps.radius ? nextProps.radius : '55%',
              label: {
                normal: {
                  show: id == 'charts-3-dashboard'? true : false,
                }
              },
              data: pieData
            }
          ]
        })
      } else if (type == 'line') {
        myChart.setOption({
          color: nextProps.color ? nextProps.color : colors,
          title: {
            left: "center"
          },
          legend: {
            orient: 'vertical',
            left: 'right',
            data: legend,
            show: nextProps.legendShow ? !nextProps.legendShow : true,
            selectedMode: false,
            textStyle: {
              color: nextProps.legendTextStyle ? nextProps.legendTextStyle : '#000',
              fontSize: 12
            }
          },
          tooltip: {
            trigger: 'axis',
            formatter: nextProps.noPercent ? '':'{b0}<br />{a0}: {c0}%<br />{a1}: {c1}%',
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: xAxis,
            "axisLabel": {
              interval: nextProps.intervalNum ? nextProps.intervalNum : 0,
              rotate: 7
            },
            axisLine: {
              lineStyle: {
                color: nextProps.lineColor ? nextProps.lineColor : '#000',
              }
            },
          },
          yAxis: {
            type: 'value',
            minInterval: 1,
            boundaryGap: [0, 0.1],
            axisLabel: {
              formatter: nextProps.noPercent ? '{value}':'{value} %'
            },
            axisLine: {
              lineStyle: {
                color: nextProps.lineColor ? nextProps.lineColor : '#000',
              }
            },
            // min: 1,
            precision:0,
            max: nextProps.maxSize && nextProps.maxSize == 10 ? 10 : null,
          },
          series: yAxis
        })
      }
    }
  }

  render() {
    // let style = {
    //   width: '100%',
    //   height: '200px'
    // }
    return (
      <div id={this.props.id} style={{ width: this.props.width ? this.props.width : null, float: this.props.width ? 'right' : null }} className={this.props.size && this.props.size =="short"  ? 'dashboard-charts' : 'charts'}>

      </div>
    );
  }
}
export default Charts;

import RepairManagementService from '../../../services/RepairManagementService';

export default {
  namespace: 'RepairCount',
  state: {
    community_id: '',
    order_id: 1,
    flag:'',
    order: {
      total_num: '',
      process: '',
      confirm: '',
      reject: '',
      pending: '',
      completed: '',
      end: '',
      review: '',
      nullify: '',
      recheck: '',
    },
    channel_id: 1,
    channel: {
      total_num: '',
      life: '',
      front: '',
      phone: '',
      dingding: '',
      property: '',
      reviews: '',
    },

    echart2: {
      'data': [],
      'title': '报修类型统计',
    },
    type: [],
    echart3: {
      'data': [],
      'title': '报修评分统计',
    },
    score: []

  },
  reducers: {
    concat(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *init({ payload }, { call, put, select }) {
      const community_id = yield select(state => state.MainLayout.communityId);
      let dateNow = new Date();
      let year = dateNow.getFullYear();
      let month = dateNow.getMonth() + 1;
      let day = dateNow.getDate();
      dateNow.setTime(dateNow.getTime() - 24 * 60 * 60 * 1000);

      yield put({
        type: 'concat',
        payload: {
          community_id
        }
      });
      yield put({
        type: 'getRepairStatistic',
        payload: {
          community_id
        }
      });
      yield put({
        type: 'getRepairTypeStatistic',
        payload: {
          community_id,
          start: year + '-' + month + '-' + 1,
          end: year + '-' + month + '-' + day
        }
      });
      yield put({
        type: 'getRepairScoreStatistic',
        payload: {
          community_id,
          start: year + '-' + month + '-' + 1,
          end: year + '-' + month + '-' + day
        }
      });


    },
    *getRepairStatistic({ payload }, { call, put, select }) {
      const { data, code } = yield call(RepairManagementService.repairStatistic, payload);
      if (code == 20000) {
        yield put({
          type: 'concat',
          payload: {
            order: {
              total_num: data.order.week.total_num,
              process: data.order.week.process,
              confirm: data.order.week.confirm,
              reject: data.order.week.reject,
              pending: data.order.week.pending,
              completed: data.order.week.completed,
              end: data.order.week.end,
              review: data.order.week.review,
              nullify: data.order.week.nullify,
              recheck: data.order.week.recheck,
            },
            order2: data.order,
            channel: {
              total_num: data.channel.week.total_num,
              life: data.channel.week.life,
              front: data.channel.week.front,
              phone: data.channel.week.phone,
              dingding: data.channel.week.dingding,
              property: data.channel.week.property,
              reviews: data.channel.week.reviews,
            },
            channel2: data.channel,
          }
        });
      }
    },
    *getRepairTypeStatistic({ payload }, { call, put, select }) {
      const { data, code } = yield call(RepairManagementService.repairTypeStatistic, payload);
      if (code == 20000) {
        let arr = [];
        data.list.map((value, index) => {
          let obj = {
            name: value.name,
            value: value.num,
          }
          arr.push(obj)
        })
        yield put({
          type: 'concat',
          payload: {
            type: data.list,
            type_total: data.total_num,
            echart2: {
              'data': arr,
              'title': '报修类型统计',
            }
          }
        });
      }
    },
    *getRepairScoreStatistic({ payload }, { call, put, select }) {
      const { data, code } = yield call(RepairManagementService.repairScoreStatistic, payload);
      if (code == 20000) {
        let flag = '';
        let scorearr = [];
        data.list.map((value, index) => {
          if (value.num > 0) {
            flag = true;
          }
          let obj = {
            name: value.name,
            value: value.num,
          }
          scorearr.push(obj)
        })
        if (flag == true) {
          yield put({
            type: 'concat',
            payload: {
              echart3: {
                'data': scorearr,
                'title': '报修评分统计',
              },
              flag:true,
            }
          });
        } else if (flag == false) {
          yield put({
            type: 'concat',
            payload: {
              echart3: {
                'data': [{ name: "一星", value: 0 }],
                'title': '报修评分统计',
              },
              flag: false,
            }
          });
        }
        yield put({
          type: 'concat',
          payload: {
            score: data.list,
            score_total: data.total_num,
          }
        });
      }
    }

  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/repairCount') {
          dispatch({ type: 'init' });
        }
      });
    }
  },
};

import { Subscription, Reducer, Effect } from 'umi';
import { NoticeIconData } from '@/components/NoticeIcon';
import { ConnectState } from './connect.d';
import request from '@/utils/request';
import { MenuDataItem } from '@ant-design/pro-layout';

// 通知
export interface ChameleonNotice {
  // 未读消息列表
  unReadMsgList: NoticeIconData[],
  // 已读消息列表
  readMsgList: NoticeIconData[],
  // 消息总数
  msgTotalCount: number,
  // 未读消息总数
  msgUnReadCount: number,
  // 未读待办列表
  unReadTodoList: NoticeIconData[],
  // 已读待办列表
  readTodoList: NoticeIconData[],
  // 待办总数
  todoTotalCount: number,
  // 未读待办总数
  todoUnReadCount: number,
}

// 菜单
export interface ViewMenu {
  id: string;
  name: string;
  route: string;
  children: ViewMenu;
}

//Chameleon全局信息
export interface ChameleonGlobal {
  avatarPicId: string;
  userEmail: string;
  userId: number;
  userProfileId: string;
  userRoleId: number;
  //功能
  viewFunction: string[];
  //菜单
  viewMenu: MenuDataItem[];
  //是否初始化过
  hasInit: boolean;
}

export interface GlobalModelState {
  collapsed: boolean;
  chameleonNotice?: ChameleonNotice;
  chameleonGlobal?: ChameleonGlobal;
}

export interface GlobalModelType {
  namespace: 'global';
  state: GlobalModelState;
  effects: {
    fetchNotices: Effect;
    clearNotices: Effect;
    changeNoticeReadState: Effect;
    fetchChameleonGlobal: Effect;
  };
  reducers: {
    changeLayoutCollapsed: Reducer<GlobalModelState>;
    saveNotices: Reducer<GlobalModelState>;
    saveClearedNotices: Reducer<GlobalModelState>;
    saveChameleonGlobal: Reducer<GlobalModelState>;
  };
  subscriptions: { setup: Subscription };
}

// 菜单格式化
const menuFormatter = (response: any) => {
  if (response === null) return [];

  var re = response.map((item: { name: string; route: string; children: any }) => {
    const result = {
      children: {},
      name: item.name,
      path: item.route === null ? '/' : item.route,
    };

    if (item.children) {
      result.children = menuFormatter(item.children);
    }

    return result;
  });

  return re;
};

// 未读消息列表格式化
const unreadListFormatter = (response: any) => {
  if (response === null) return [];

  return response.map((item: NoticeIconData) => {
    const result = {
      id: item['_id'].value,
      avatar: '',
      title: item['MessageTitle'].text,
      content: item['MessageContent'].text,
      description: item['MessageContent'].text,
      datetime: item['SendTime'].value,
      // extra: item['MessageContent'].value,
      key: '',
      read: false,
    };

    return result;
  });
};

const GlobalModel: GlobalModelType = {
  namespace: 'global',

  state: {
    collapsed: false,
    chameleonNotice: {
      // 未读消息列表
      unReadMsgList: [],
      // 已读消息列表
      readMsgList: [],
      // 消息总数
      msgTotalCount: 0,
      // 未读消息总数
      msgUnReadCount: 0,
      // 未读待办列表
      unReadTodoList: [],
      // 已读待办列表
      readTodoList: [],
      // 待办总数
      todoTotalCount: 0,
      // 未读待办总数
      todoUnReadCount: 0,
    },
    chameleonGlobal: {
      avatarPicId: '',
      userEmail: '',
      userId: 0,
      userProfileId: '',
      userRoleId: 0,
      viewFunction: [],
      viewMenu: [],
      hasInit: false,
    },
  },

  effects: {
    *fetchNotices(_, { call, put, select }) {
      //未删除&未读消息总数
      const unreadMsgCount = yield request(
        '/api/CloudData?_interface=ChameleonSystem.MessageAlert.CurrentUserUnReadMessageCount',
      );
      //未删除消息总数
      const undeletedMsgCount = yield request(
        '/api/CloudData?_interface=ChameleonSystem.MessageAlert.UnDeletedCount',
      );
      //未读消息列表
      const unreadListData = yield request(
        '/api/CloudData?_interface=ChameleonSystem.MessageAlert.CurrentUserUnReadMessageList',
      );

      yield put({
        type: 'saveNotices',
        payload: {
          unReadMsgList: unreadListFormatter(unreadListData.data),
          msgTotalCount: undeletedMsgCount.data,
          msgUnReadCount: unreadMsgCount.data,
        }
      });
    },

    *clearNotices({ payload }, { put, select }) {
      yield put({
        type: 'saveClearedNotices',
        payload,
      });
      // const count: number = yield select((state: ConnectState) => state.global.notices?.length);
      // const unreadCount: number = yield select(
      //   (state: ConnectState) => state.global.notices?.filter((item) => !item.read).length,
      // );
      // yield put({
      //   type: 'user/changeNotifyCount',
      //   payload: {
      //     totalCount: count,
      //     unreadCount,
      //   },
      // });
    },

    *changeNoticeReadState({ payload }, { put, select }) {
      // const notices: NoticeItem[] = yield select((state: ConnectState) =>
      //   state.global.notices?.map((item) => {
      //     const notice = { ...item };
      //     if (notice.id === payload) {
      //       notice.read = true;
      //     }
      //     return notice;
      //   }),
      // );

      // yield put({
      //   type: 'saveNotices',
      //   payload: notices,
      // });

      // yield put({
      //   type: 'user/changeNotifyCount',
      //   payload: {
      //     totalCount: notices.length,
      //     unreadCount: notices.filter((item) => !item.read).length,
      //   },
      // });
    },

    *fetchChameleonGlobal(_, { select, put }) {
      const global = yield select((state: GlobalModelType) => state);
      if (global && global.chameleonGlobal && global.chameleonGlobal.hasInit) {
        yield put({
          type: 'saveChameleonGlobal',
          payload: {
            chameleonGlobal: global.chameleonGlobal,
          },
        });
      } else {
        const response = yield request('/System/ChameleonSystemInfo');
        const data = response.data;
        yield put({
          type: 'saveChameleonGlobal',
          payload: {
            chameleonGlobal: {
              viewMenu: menuFormatter(data.viewMenu),
              avatarPicId: data.avatarPicId,
              userEmail: data.userEmail,
              userId: data.userId,
              userProfileId: data.userProfileId,
              userRoleId: data.userRoleId,
              viewFunction: data.viewFunction || [],
            },
          },
        });
      }
    },
  },

  reducers: {
    changeLayoutCollapsed(state = { collapsed: true }, { payload }): GlobalModelState {
      return {
        ...state,
        collapsed: payload,
      };
    },
    saveNotices(state, { payload }): GlobalModelState {
      return {
        collapsed: false,
        ...state,
        chameleonNotice: payload,
      };
    },
    saveClearedNotices(state, { payload }): GlobalModelState {
      return {
        ...state,
        collapsed: false,
      };
    },

    saveChameleonGlobal(state, { payload }): GlobalModelState {
      const cg = payload.chameleonGlobal;
      return {
        collapsed: false,
        chameleonGlobal: {
          avatarPicId: cg.avatarPicId,
          userEmail: cg.userEmail,
          userId: cg.userId,
          userProfileId: cg.userProfileId,
          userRoleId: cg.userRoleId,
          viewFunction: cg.viewFunction,
          viewMenu: cg.viewMenu,
          hasInit: cg === undefined ? false : true,
        },
      };
    },
  },

  subscriptions: {
    setup({ history }): void {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      history.listen(({ pathname, search }): void => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};

export default GlobalModel;

import { stringify } from 'querystring';
import { history, Reducer, Effect } from 'umi';
import { getPageQuery } from '@/utils/utils';
import { message } from 'antd';
import { dataApiRequest, accountRequest } from '@/utils/request';
import cookie from 'react-cookies'

export interface LoginParamsType {
  userName: string;
  password: string;
  mobile: string;
  captcha: string;
}

export interface StateType {
  status?: 'ok' | 'error';
  type?: string;
}

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    login: Effect;
    logout: Effect;
  };
  reducers: {
    changeLoginStatus: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'account',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield accountRequest('/UserAccount/SignInThirdParty',
        {
          method: 'POST',
          data: {
            'email': payload.email,
            'password': payload.password,
          }
        });

      if (response && response.isSuccess) {
        message.success('登录成功！');
        cookie.save('_AccessToken', response.data.accessToken, {});

        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: 'ok',
            type: ''
          },
        });

        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params as { redirect: string };
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = '/';
            return;
          }
        }
        history.replace(redirect || '/');
      }
    },

    logout() {
      cookie.remove('_AccessToken');

      const { redirect } = getPageQuery();
      // Note: There may be security issues, please note
      if (window.location.pathname !== '/account/login' && !redirect) {
        history.replace({
          pathname: '/account/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};

export default Model;

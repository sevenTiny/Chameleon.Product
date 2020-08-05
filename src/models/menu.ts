import { Effect, Reducer } from 'umi';
import { MenuDataItem } from '@ant-design/pro-layout';
import request from '@/utils/request';

export interface MenuModelState {
    menuData: MenuDataItem[];
}

export interface MenuModelType {
    namespace: 'menu';
    state: MenuModelState;
    effects: {
        getMenuData: Effect;
    };
    reducers: {
        saveMenuData: Reducer<MenuModelState>;
    };
}

const menuFormatter = (response: any) => {
    if (response === null)
        return [];

    var re = response.map((item: { name: string; route: string; children: any; }) => {
        const result = {
            children: {},
            name: item.name,
            path: item.route === null ? '/' : item.route,
        };

        if (item.children) {
            result.children = menuFormatter(item.children);
        }

        return result;
    })

    return re;
}

const MenuModel: MenuModelType = {
    namespace: 'menu',
    state: {
        menuData: [],
    },

    effects: {
        *getMenuData(_, { put }) {
            const response = yield request('http://prod.7tiny.com:39011/System/ChameleonSystemInfo');
            yield put({
                type: 'saveMenuData',
                payload: menuFormatter(response.data.viewMenu),
            });
        },
    },

    reducers: {
        saveMenuData(state, action) {
            return {
                ...state,
                menuData: action.payload || [],
            };
        },
    },
};
export default MenuModel;
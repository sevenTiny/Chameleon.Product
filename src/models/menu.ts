import { chameleonSystemInfo } from '@/services/account'
import { Effect, Reducer } from 'umi';
import { MenuDataItem } from '@ant-design/pro-layout';

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
        save: Reducer<MenuModelState>;
    };
}

const MenuModel: MenuModelType = {
    namespace: 'menu',
    state: {
        menuData: [],
    },
    
    effects: {
        *getMenuData({ }, { call, put }) {
            const response = yield call(chameleonSystemInfo);
            yield put({
                type: 'save',
                payload: response.data.menuData,
            });
        },
    },

    reducers: {
        save(state, action) {
            return {
                ...state,
                menuData: action.payload || [],
            };
        },
    },
};
export default MenuModel;
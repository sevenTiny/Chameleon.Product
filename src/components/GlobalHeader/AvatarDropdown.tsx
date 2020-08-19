import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin } from 'antd';
import React from 'react';
import { history, ConnectProps, connect } from 'umi';
import { ConnectState } from '@/models/connect';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import { ChameleonGlobal } from '@/models/global';
import defaultSettings from '../../../config/defaultSettings';
import { getAccessTokenParam } from '../../utils/utils';

export interface GlobalHeaderRightProps extends Partial<ConnectProps> {
  menu?: boolean;
  chameleonGlobal: ChameleonGlobal;
}

class AvatarDropdown extends React.Component<GlobalHeaderRightProps> {
  onMenuClick = (event: {
    key: React.Key;
    keyPath: React.Key[];
    item: React.ReactInstance;
    domEvent: React.MouseEvent<HTMLElement>;
  }) => {
    const { key } = event;

    if (key === 'logout') {
      const { dispatch } = this.props;

      if (dispatch) {
        dispatch({
          type: 'account/logout',
        });
      }

      return;
    }

    history.push(`/account/${key}`);
  };

  render(): React.ReactNode {
    const { menu } = this.props;
    //头像
    const avator = defaultSettings.dataApiHost +
      '/api/File?_interface=ChameleonSystem.FDS.AccountAvatarDownload&_fileId=' +
      this.props.chameleonGlobal.avatarPicId + '&' + getAccessTokenParam();

    const userName = this.props.chameleonGlobal.userEmail;

    const menuHeaderDropdown = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        {menu && (
          <Menu.Item key="center">
            <UserOutlined />
            个人中心
          </Menu.Item>
        )}
        {menu && (
          <Menu.Item key="settings">
            <SettingOutlined />
            个人设置
          </Menu.Item>
        )}
        {menu && <Menu.Divider />}

        <Menu.Item key="logout">
          <LogoutOutlined />
          退出登录
        </Menu.Item>
      </Menu>
    );
    return userName ? (
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className={`${styles.action} ${styles.account}`}>
          <Avatar size="small" className={styles.avatar} src={avator} alt="avatar" />
          <span className={`${styles.name} anticon`}>{userName}</span>
        </span>
      </HeaderDropdown>
    ) : (
        <span className={`${styles.action} ${styles.account}`}>
          <Spin
            size="small"
            style={{
              marginLeft: 8,
              marginRight: 8,
            }}
          />
        </span>
      );
  }
}

export default connect(({ global }: ConnectState) => ({
  chameleonGlobal: global !== undefined ? global.chameleonGlobal : undefined,
}))(AvatarDropdown);

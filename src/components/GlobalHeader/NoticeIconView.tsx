import React, { Component } from 'react';
import { connect, ConnectProps } from 'umi';
import { Tag, message } from 'antd';
import groupBy from 'lodash/groupBy';
import moment from 'moment';
import { ChameleonNotice } from '@/models/global';
import { CurrentUser } from '@/models/user';
import { ConnectState } from '@/models/connect';
import NoticeIcon, { NoticeIconData } from '../NoticeIcon';
import styles from './index.less';

export interface GlobalHeaderRightProps extends Partial<ConnectProps> {
  chameleonNotice?: ChameleonNotice;
  currentUser?: CurrentUser;
  fetchingNotices?: boolean;
  onNoticeVisibleChange?: (visible: boolean) => void;
  onNoticeClear?: (tabName?: string) => void;
}

class GlobalHeaderRight extends Component<GlobalHeaderRightProps> {
  componentDidMount() {
    const { dispatch } = this.props;

    if (dispatch) {
      dispatch({
        type: 'global/fetchNotices',
      });
    }
  }

  changeReadState = (clickedItem: NoticeIconData): void => {
    const { id } = clickedItem;
    const { dispatch } = this.props;

    if (dispatch) {
      dispatch({
        type: 'global/changeNoticeReadState',
        payload: id,
      });
    }
  };

  handleNoticeClear = (title: string, key: string) => {
    const { dispatch } = this.props;
    message.success(`${'清空了'} ${title}`);

    if (dispatch) {
      dispatch({
        type: 'global/clearNotices',
        payload: key,
      });
    }
  };

  render() {
    const { fetchingNotices, onNoticeVisibleChange } = this.props;
    const chameleonNotice = this.props.chameleonNotice !== undefined ? this.props.chameleonNotice : {
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
    };
    return (
      <NoticeIcon
        className={styles.action}
        count={chameleonNotice && chameleonNotice.msgUnReadCount}
        onItemClick={(item) => {
          this.changeReadState(item as NoticeIconData);
        }}
        loading={fetchingNotices}
        clearText="清空"
        viewMoreText="查看更多"
        onClear={this.handleNoticeClear}
        onPopupVisibleChange={onNoticeVisibleChange}
        onViewMore={() => message.info('Click on view more')}
        clearClose
      >
        <NoticeIcon.Tab
          tabKey="notification"
          // count={unreadMsg}
          list={chameleonNotice.unReadMsgList}
          title="通知"
          emptyText="你已查看所有通知"
          showViewMore
        />
        <NoticeIcon.Tab
          tabKey="event"
          title="待办"
          emptyText="你已完成所有待办"
          // count={unreadMsg}
          list={[]}
          showViewMore
        />
      </NoticeIcon>
    );
  }
}

export default connect(({ user, global, loading }: ConnectState) => ({
  currentUser: user.currentUser,
  collapsed: global.collapsed,
  fetchingMoreNotices: loading.effects['global/fetchMoreNotices'],
  fetchingNotices: loading.effects['global/fetchNotices'],
  chameleonNotice: global.chameleonNotice,
}))(GlobalHeaderRight);

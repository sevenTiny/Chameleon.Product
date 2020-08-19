import { Settings as ProSettings } from '@ant-design/pro-layout';

type DefaultSettings = ProSettings & {
  pwa: boolean;
  dataApiHost: string;
};

const proSettings: DefaultSettings = {
  //dataapi host
  dataApiHost: 'http://prod.7tiny.com:39011',
  // dataApiHost: 'http://localhost:39011',
  navTheme: 'dark',
  // 拂晓蓝
  primaryColor: '#1890ff',
  layout: 'side',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  menu: {
    locale: false,//国际化：true=开启，false=关闭
  },
  title: 'Chameleon',
  pwa: false,
  iconfontUrl: '',
};

export type { DefaultSettings };

export default proSettings;

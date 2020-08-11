import { dataApiRequest } from '@/utils/request';

export interface LoginParamsType {
  userName: string;
  password: string;
  mobile: string;
  captcha: string;
}

export function fakeAccountLogin(params: LoginParamsType) {
  return dataApiRequest('/api/login/account', {
    method: 'POST',
    data: params,
  });
}

export async function getFakeCaptcha(mobile: string) {
  return dataApiRequest(`/api/login/captcha?mobile=${mobile}`);
}

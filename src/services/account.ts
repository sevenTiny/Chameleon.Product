import request from '@/utils/request';

export async function chameleonSystemInfo(): Promise<any> {
  return request('http://prod.7tiny.com:39011/System/ChameleonSystemInfo');
}

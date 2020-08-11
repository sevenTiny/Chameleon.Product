import { dataApiRequest } from '@/utils/request';

export async function query(): Promise<any> {
  return dataApiRequest('/api/users');
}

export async function queryCurrent(): Promise<any> {
  return dataApiRequest('/api/currentUser');
}

export async function queryNotices(): Promise<any> {
  return dataApiRequest('/api/notices');
}

import { dataApiRequest } from '@/utils/request';
import { TableListParams, TableListItem } from './data.d';

export async function queryRule(params?: TableListParams) {
  return dataApiRequest('/api/rule', {
    params,
  });
}

export async function removeRule(params: { key: number[] }) {
  return dataApiRequest('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params: TableListItem) {
  return dataApiRequest('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params: TableListParams) {
  return dataApiRequest('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'update',
    },
  });
}

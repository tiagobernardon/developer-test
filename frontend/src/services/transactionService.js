import axios from 'axios';
import queryStringBuilder from '@/utils/queryStringBuilder';

const API_URL = import.meta.env.VITE_BACKEND_URL + '/api';

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

const create = async ({ description, amount, type, check }) => {
  // format currency
  let formattedAmount 
  formattedAmount = amount.replace(/\$|,/g, '');
  formattedAmount = parseFloat(formattedAmount);
  formattedAmount = formattedAmount.toFixed(2);

  const data = new FormData();
  data.append('description', description);
  data.append('amount', formattedAmount);
  data.append('type', type);

  if (check) {
    data.append('check', check);
  }

  let response = await axios.post(`${API_URL}/transactions`, data);

  return response?.data || [];
};

const get = async (page, filters = null) => {
  let queryString = ''

  if (filters) {
    queryString += await queryStringBuilder.buildQueryString(filters)
  }

  let { data } = await axios.get(`${API_URL}/transactions?page=${page}${queryString}`);

  let returnData = {
    data: data?.data || [],
    currentPage: data?.current_page || 1,
    nextPage: data?.next_page_url || null,
    prevPage: data?.prev_page_url || null,
  }

  return returnData;
};

const update = async (id, status ) => {
  let response = await axios.patch(`${API_URL}/transactions/${id}`, {status: status});

  return response?.data || [];
};

const getCheck = async (id) => {
  let res = await axios.get(`${API_URL}/transactions/check?transactionId=${id}`, {responseType: 'blob'});

  return res;
};

export default {
  create,
  get,
  update,
  getCheck
};
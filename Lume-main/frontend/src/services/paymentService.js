import api from './api';

export const placeCashOnDeliveryOrder = async (orderData) => {
  const response = await api.post('/payments/cash-on-delivery', orderData);
  return response.data;
};

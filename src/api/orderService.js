import axiosClient from './axiosClient';

const orderApi = {
    async getUserOrder(params) {
        const newParams = { ...params };
        const OrderList = await axiosClient.get('/api/bookings/my', { params: newParams });
        return OrderList;
    },

    async getInfoById(id) {
        const url = `/api/bookings/${id}`;
        return axiosClient.get(url);
    },
};

export default orderApi;

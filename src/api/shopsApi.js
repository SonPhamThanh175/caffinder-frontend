import axiosClient from './axiosClient';

const shopsApi = {
    async getAll(params) {
        const newParams = { ...params };
        const ShopsList = await axiosClient.get('/api/shops', { params: newParams });
        return ShopsList;
    },

    async getInfoById(id) {
        const url = `/api/shops/${id}`;
        return axiosClient.get(url);
    },

    async add(data) {
        const url = '/api/shops';
        return axiosClient.post(url, data);
    },

    async update(data) {
        const url = `/api/shops/${data.id}`;
        return axiosClient.patch(url, data);
    },

    async remove(id) {
        const url = `/api/shops/${id}`;
        return axiosClient.delete(url);
    },
};

export default shopsApi;

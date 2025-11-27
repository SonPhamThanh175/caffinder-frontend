import axiosClient from './axiosClient';

const shopsApi = {
    async getAll(params) {
        const newParams = { ...params };
        const ShopsList = await axiosClient.get('/api/shops', { params: newParams });
        return ShopsList;
    },

    getInfoById(id) {
        const url = `/api/shops/${id}`;
        return axiosClient.get(url);
    },

    add(data) {
        const url = '/api/shops';
        return axiosClient.post(url, data);
    },

    update(data) {
        const url = `/api/shops/${data.id}`;
        return axiosClient.patch(url, data);
    },

    remove(id) {
        const url = `/api/shops/${id}`;
        return axiosClient.delete(url);
    },
};

export default shopsApi;

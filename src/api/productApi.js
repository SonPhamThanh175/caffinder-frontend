import axiosClient from './axiosClient';

const productsApi = {
    async getAll(params) {
        const newParams = { ...params };
        const productList = await axiosClient.get('/api/products', { params: newParams });
        return productList;
    },

    get(id) {
        const url = `/api/products/${id}`;
        return axiosClient.get(url);
    },

    add(data) {
        const url = '/api/product';
        return axiosClient.post(url, data);
    },

    update(data) {
        const url = `/api/product/${data.id}`;
        return axiosClient.patch(url, data);
    },

    remove(id) {
        const url = `/api/product/${id}`;
        return axiosClient.delete(url);
    },
};

export default productsApi;

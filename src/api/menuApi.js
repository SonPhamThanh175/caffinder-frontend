import axiosClient from './axiosClient';

const menuApi = {
    getMenusByShopId: (shopId) => {
        const url = `api/menu/shop/${shopId}`;
        return axiosClient.get(url);
    },

    getMenuById: (menuId) => {
        const url = `api/menu/${menuId}`;
        return axiosClient.get(url);
    },

    createMenu: (data) => {
        const url = 'api/menu';
        return axiosClient.post(url, data);
    },

    updateMenu: (menuId, data) => {
        const url = `api/menu/${menuId}`;
        return axiosClient.put(url, data);
    },

    deleteMenu: (menuId) => {
        const url = `api/menu/${menuId}`;
        return axiosClient.delete(url);
    }
};

export default menuApi;
import axiosClient from './axiosClient';

const favoriteApi = {
    async getMyFavorite(){
        const url = `/api/favorite/my`;
        return axiosClient.get(url);
    },

    async add(idShops) {
        const url = `/api/favorite/${idShops}`;
        return axiosClient.post(url);
    },

    async delete(idShops) {
        const url = `/api/favorite/${idShops}`;
        return axiosClient.delete(url);
    },
};

export default favoriteApi;

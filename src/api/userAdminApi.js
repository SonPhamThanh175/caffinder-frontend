import axiosClient from './axiosClient';

const userAdminApi = {
    async getAll(params) {
        const url = `/api/auth/users`;
        return axiosClient.get(url)
    },

    async activeUser(id) {
        const url = `/api/auth/user/${id}/active`;
        return axiosClient.patch(url, {});
    },

    async blockUser(id) {
        const url = `/api/auth/user/${id}/block`;
        return axiosClient.patch(url, {});
    },

};

export default userAdminApi;

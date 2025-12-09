import axiosClient from './axiosClient';

const ownerServiceApi = {
    async createShop(payload) {
        const url = `/api/shops`;
        return axiosClient.post(url, payload);
    },

    async updateShop(id, payload) {
        const url = `/api/shops/${id}`;
        return axiosClient.patch(url, payload);
    },

    async getShopBooking(id, params) {
        const newParams = { ...params };
        const response = await axiosClient.get(`/api/bookings/by-shop/${id}`, {
            params: newParams,
        });
        return response;
    },
    async getShopById(id) {
        const url = `/api/shops/${id}`;
        return axiosClient.get(url);
    },

    async getShopByOwnerId() {
        const url = `/api/shops/owner`;
        return axiosClient.get(url);
    },

    async confirmBooking(id) {
        const url = `/api/bookings/${id}/confirm`;
        return axiosClient.patch(url);
    },

    async rejectBooking(id) {
        const url = `/api/bookings/${id}/reject`;
        return axiosClient.patch(url);
    },

    async replyReview(id, reply) {
        const url = `/api/reviews/${id}/reply`;
        return axiosClient.patch(url,{ownerReply: reply});
    },
};

export default ownerServiceApi;

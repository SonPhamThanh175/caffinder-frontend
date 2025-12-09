import axiosClient from './axiosClient';

const reviewApi = {
    async addReview(id, payload) {
        const url = `/api/reviews/${id}`;
        return axiosClient.post(url, payload);
    },

    async getShopReviewById(id) {
        const url = `/api/reviews/${id}`;
        return axiosClient.get(url);
    },

    async getMyReviewList() {
        const url = `/api/reviews/my/list`;
        return axiosClient.get(url);
    }
};

export default reviewApi;

import axiosClient from './axiosClient';

const shopAdminApi = {
    async getAll(params) {
        const url = `/api/shops`;
        return axiosClient.get(url);
    },

    async deleteReview(reviewId) {
        const url = `api/reviews/${reviewId}`;
        return axiosClient.delete(url);
    },

    async getReviewsByShopId(shopId) {
        const url = `/api/reviews/${shopId}`;
        return axiosClient.get(url);
    },

    async updateShopStatus(id, status) {
        const url = `/api/shops/${id}/status`;
        return axiosClient.patch(url, { status });
    },

    async approveShop(id) {
        return this.updateShopStatus(id, 'approved');
    },

    async rejectShop(id) {
        return this.updateShopStatus(id, 'rejected');
    },

    async blockShop(id) {
        return this.updateShopStatus(id, 'block');
    },

    async setPendingShop(id) {
        return this.updateShopStatus(id, 'pending');
    },

    async getById(id) {
        const url = `/api/shops/${id}`;
        return axiosClient.get(url);
    },
};

export default shopAdminApi;

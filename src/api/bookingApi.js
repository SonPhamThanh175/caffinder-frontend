import axiosClient from './axiosClient';

const bookingApi = {
    async checkAvailability(formData) {
        const url = 'api/bookings/check-availability';
        return axiosClient.post(url, formData);
    },

    async createBooking(formData) {
        const url = 'api/bookings';
        return axiosClient.post(url, formData);
    },

    async getBookingById(id) {
        const url = `api/bookings/${id}`;
        return axiosClient.get(url);
    },

    async getUserBookings(params) {
        const url = 'api/bookings/user';
        return axiosClient.get(url, { params });
    },

    async cancelBooking(id) {
        const url = `api/bookings/${id}/cancel`;
        return axiosClient.patch(url);
    },

    async updateBooking(id, formData) {
        const url = `api/bookings/${id}`;
        return axiosClient.patch(url, formData);
    },
};

export default bookingApi;
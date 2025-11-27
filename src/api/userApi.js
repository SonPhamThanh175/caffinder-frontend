import axiosClient from "./axiosClient"

const userApi = {
    async register(data){
        const url = 'api/auth/register';
        return axiosClient.post(url,data)
    },

    async login(data){
        const url = 'api/auth/login';
        return axiosClient.post(url,data)
    },
    async getInfo(userId){
        const url = `api/auth/${userId}`;
        return axiosClient.get(url)
    },
    async update(userId, data) {
        const url = `api/users/${userId}`;
        return axiosClient.put(url, data);
    }
}

export default userApi
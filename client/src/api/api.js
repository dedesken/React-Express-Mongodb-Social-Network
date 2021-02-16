import axios from "axios";

const instance = axios.create({
    baseURL: 'http://localhost:5000/api/v1/',
    withCredentials: true,
    headers: {
        'Access-Control-Allow-Origin' : '*',
        'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    }
});

export const ApiUsers = {
    getUsers(currentPage = 1, pageSize = 5) {
        return instance.get(`users?limit=${pageSize}&page=${currentPage}`).then(res => (res.data))
    },
    authUser() {
        return instance.get(`users/isLoggedIn`)
            .then(res => {
                return res.data
            }).catch((err)=>{
                console.log(err.message)
                return err
            })
    },
    loginUser(email, password) {
        return instance.post(`users/login`, { email, password })
            .then(res => {
                return res.data
            });
    },
    logoutUser() {
        return instance.get(`users/logout`)
            .then(res => (res.data));
    },
    createUser(name, email, password, passwordConfirm) {
        return instance.post(`users/singup`, {name, email, password, passwordConfirm}).then(res => res.data)
    },
    followUser(id) {
        return instance.patch(`users/follow/${id}`).then(res => res.data)
    },
    unfollowUser(id) {
        return instance.delete(`users/follow/${id}`).then(res => res.data)
    }
};

export const ApiProfile = {
    getProfile(id) {
        return instance.get(`users/${id}`).then(res => res.data)
    }
};

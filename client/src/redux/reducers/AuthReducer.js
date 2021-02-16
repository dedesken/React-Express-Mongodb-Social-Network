import { ApiUsers } from "../../api/api";

const SET_USER_DATA = "AuthReducer/SET_USER_DATA";
const SET_AUTH_IS_FETCHING = "AuthReducer/SET_AUTH_IS_FETCHING"

let initialState = {
    id: null,
    email: null,
    name: null,
    isFetching: true,
    isAuth: false
};

const AuthReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER_DATA: {
            return {
                ...state,
                ...action.data
            }
        }
        case SET_AUTH_IS_FETCHING: {
            return {
                ...state,
                isFetching : action.isFetching
            }
        }
        default: return state;
    }
};

export const setAuthUserData = (id, email, name, isAuth) => {
    return {
        type: SET_USER_DATA,
        data: {
            id,
            email,
            name,
            isAuth
        }
    }
};

export const setAuthIsFetching = (isFetching) => {
    return {
        type: SET_AUTH_IS_FETCHING,
        isFetching
    }
}

export const getAuthUser = () => {
    return async (dispatch) => {
        dispatch(setAuthIsFetching(true))
        let response = await ApiUsers.authUser()
        if (response.status === "success") {
            let { id, name, email } = response.data.user;
            dispatch(setAuthUserData(id, email, name, true));
        }
        dispatch(setAuthIsFetching(false))
    }
};

export const loginProfile = (email, password) => async (dispatch) => {
    dispatch(setAuthIsFetching(true))
    let response = await ApiUsers.loginUser(email, password)
    if (response.status === "success") {
        dispatch(getAuthUser());
    }
    dispatch(setAuthIsFetching(false))
}

export const logoutUser = () => {
    return async (dispatch) => {
        dispatch(setAuthIsFetching(true))
        let response = await ApiUsers.logoutUser();
        if (response.status === "success") {
            dispatch(setAuthUserData(null, null, null, false));
        };
        dispatch(setAuthIsFetching(false))
    }
}

export const createUser = (name, email, password, passwordConfirm) => {
    return async (dispatch) => {
        dispatch(setAuthIsFetching(true))
        let response = await ApiUsers.createUser(name, email, password, passwordConfirm);
        if (response.status === "success") {
            let { id, name, email } = response.data.user;
            dispatch(setAuthUserData(id, name, email, true));
        };
        dispatch(setAuthIsFetching(false))
    }
}

export default AuthReducer;

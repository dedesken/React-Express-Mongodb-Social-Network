import { ApiUsers } from "../../api/api";

const SET_USERS = "UsersReducer/SET_USERS";
const SET_CURRENT_PAGE = "UsersReducer/SET_CURRENT_PAGE";
const TOGGLE_IS_FETCHIG = "UsersReducer/TOGGLE_IS_FETCHIG";
const FOLLOW_UNFOLLOW_FLOW_FETCHING = "UsersReducer/FOLLOW_UNFOLLOW_FLOW_FETCHING"

let initialState = {
    UsersData: [],
    pageSize: 5,
    currentPage: 1,
    isFetching: false,
    followUnfollowFlowFetching: false
};

const UsersReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USERS:
            return {
                ...state, UsersData: action.users
            }

        case SET_CURRENT_PAGE:
            return {
                ...state, currentPage: action.currentPage
            }

        case TOGGLE_IS_FETCHIG:
            return {
                ...state, isFetching: action.isFetching
            }

        case FOLLOW_UNFOLLOW_FLOW_FETCHING:
            return {
                ...state, followUnfollowFlowFetching: action.isFetching
            }

        default:
            return state;
    }
};

export const setUsers = (users) => {
    return {
        type: SET_USERS,
        users
    }
};

export const setCurrentPage = (page) => {
    return {
        type: SET_CURRENT_PAGE,
        currentPage: page
    }
};

export const toggleIsFetching = (isFetching) => {
    return {
        type: TOGGLE_IS_FETCHIG,
        isFetching
    }
}

export const followUnfollowFlowFetching = (isFetching) => {
    return {
        type: FOLLOW_UNFOLLOW_FLOW_FETCHING,
        isFetching
    }
}

export const getUsers = (currentPage, pageSize) => {
    return async (dispatch) => {
        dispatch(setCurrentPage(currentPage));
        dispatch(toggleIsFetching(true));
        let response = await ApiUsers.getUsers(currentPage, pageSize)
        dispatch(toggleIsFetching(false));
        dispatch(setUsers(response.data));
    }
}

export const followUser = (id, currentPage, pageSize) => {
    return async (dispatch) => {
        dispatch(followUnfollowFlowFetching(true))
        await ApiUsers.followUser(id)
        let response = await ApiUsers.getUsers(currentPage, pageSize)
        dispatch(setUsers(response.data));
        dispatch(followUnfollowFlowFetching(false))
    }
}

export const unfollowUser = (id, currentPage, pageSize) => {
    return async (dispatch) => {
        dispatch(followUnfollowFlowFetching(true))
        await ApiUsers.unfollowUser(id)
        let response = await ApiUsers.getUsers(currentPage, pageSize)
        dispatch(setUsers(response.data));
        dispatch(followUnfollowFlowFetching(false))
    }
}

export default UsersReducer;
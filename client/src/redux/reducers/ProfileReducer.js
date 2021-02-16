import { ApiProfile } from "../../api/api";

const ADD_POST = "ProfileReducer/ADD-POST";

const DELETE_POST = "ProfileReducer/DELETE_POST";

const SET_USER_PROFILE = "ProfileReducer/SET_USER_PROFILE";

const SET_PROFILE_IS_FETCHING = "ProfileReducer/SET_PROFILE_IS_FETCHING"

let initialState = {
    PostData: [
        { id: 1, message: 'learning React', LikeCounter: 15 },
        { id: 2, message: "It's my first React project!", LikeCounter: 10 }
    ],
    newPostText: 'react-project',
    profile: null,
    profileIsFetching: true
};

const ProfileReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_POST: {
            let NewState = { ...state };
            NewState.PostData = [...state.PostData];
            let newPost = {
                id: NewState.PostData[NewState.PostData.length - 1].id + 1,
                message: action.newPostText,
                LikeCounter: 0
            };

            NewState.PostData.push(newPost);
            NewState.newPostText = '';
            return NewState;
        }
        case DELETE_POST: {
            let NewState = { ...state };
            NewState.PostData = [...state.PostData].filter(post => post.id !== action.postId);
            return NewState;
        }
        case SET_USER_PROFILE: {
            return { ...state, profile: { ...action.profile } }
        }
        case SET_PROFILE_IS_FETCHING: {
            return {...state, profileIsFetching: action.profileIsFetching}
        }
        default: return state;
    }
};

export const addNewPost = (newPostText) => {
    return {
        type: ADD_POST, newPostText
    }
};

export const deletePost = (postId) => {
    return {
        type: DELETE_POST, postId
    }
};

export const setUserProfile = (profile) => {
    return {
        type: SET_USER_PROFILE,
        profile
    }
};

export const setProfileIsFetching = (profileIsFetching) => {
    return {
        type: SET_PROFILE_IS_FETCHING,
        profileIsFetching: profileIsFetching
    }
}

export const getUserProfile = (userId) => {
    return async (dispatch) => {
        dispatch(setProfileIsFetching(true));
        let response = await ApiProfile.getProfile(userId);
        dispatch(setUserProfile(response.data));
        dispatch(setProfileIsFetching(false));
    }
};



export default ProfileReducer;
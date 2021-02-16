import { getAuthUser } from "./AuthReducer";

const INITIALIZED_SUCCESS = "INITIALIZED_SUCCESS";

let initialState = {
    initialized: false
};

const AppReducer = (state = initialState, action) => {
    switch (action.type) {
        case INITIALIZED_SUCCESS: {
            return {
                ...state,
                initialized: true
            }
        }
        default: return state;
    }
};

export const initializedSuccess = () => {
    return {
        type: INITIALIZED_SUCCESS,
    }
};

export const initializeApp = () => {
    return (dispatch) => {
        dispatch(getAuthUser()).then(() => {
            dispatch(initializedSuccess());
        });
    }
};


export default AppReducer;
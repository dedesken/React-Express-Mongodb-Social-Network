import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import AppReducer from "./reducers/AppReducer";
import AuthReducer from "./reducers/AuthReducer";
import ProfileReducer from "./reducers/ProfileReducer";
import UsersReducer from "./reducers/UsersReducer";

let reducers = combineReducers({
    Auth: AuthReducer,
    App: AppReducer,
    Users: UsersReducer,
    Profile: ProfileReducer
})

let store = createStore(reducers, applyMiddleware(thunk));

window.store = store;

export default store;
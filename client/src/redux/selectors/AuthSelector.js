export const getAuthUserId = (state) => {
    return state.Auth.id
}
export const getIsAuth = (state) => {
    return state.Auth.isAuth
}
export const getName = (state) => {
    return state.Auth.name
}
export const getAuthIsFetching = (state) => {
    return state.Auth.isFetching
}
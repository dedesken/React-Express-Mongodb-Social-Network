export const getUsersData = (state) => {
    return state.Users.UsersData
}
export const getPageSize = (state) => {
    return state.Users.pageSize
}
export const getCurrentPage = (state) => {
    return state.Users.currentPage
}
export const getIsFetching = (state) => {
    return state.Users.isFetching
}
export const getFollowFlowFetching = (state) => {
    return state.Users.followUnfollowFlowFetching
}
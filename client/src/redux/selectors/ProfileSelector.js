export const getProfileData = (state) => {
    return state.Profile.profile
}

export const getProfilePosts = (state) => {
    return state.Profile.PostData
}

export const getProfileIsFetching = (state) => {
    return state.Profile.profileIsFetching
}
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { getAuthUserId, getIsAuth } from '../../redux/selectors/AuthSelector';
import { getProfileData, getProfileIsFetching, getProfilePosts } from '../../redux/selectors/ProfileSelector';
import { getFollowFlowFetching} from '../../redux/selectors/UsersSelector';
import {getUserProfile} from '../../redux/reducers/ProfileReducer'
import { useParams } from "react-router-dom";
import { UserProfile } from './UserProfile/UserProfile';
import { WithPreloader } from '../utils/preloder/preloder';

const ProfileContainer = (props) => {
    const { id } = useParams()
    
    useEffect(()=>{
        props.getUserProfile(id)
    }, [])

    return WithPreloader(UserProfile, props.isFetching)({profile: props.profile})
}

let mapStateToProps = (state) => {
    return {
        isFetching: getProfileIsFetching(state),
        followFlowFetching: getFollowFlowFetching(state),
        authUserId: getAuthUserId(state),
        isAuth: getIsAuth(state),
        profile: getProfileData(state),
        postsData: getProfilePosts(state)
    }
};

export default connect(mapStateToProps, { getUserProfile })(ProfileContainer)
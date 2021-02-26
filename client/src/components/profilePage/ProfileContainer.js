import { useEffect } from 'react'
import { connect } from 'react-redux'
import { getAuthUserId, getIsAuth } from '../../redux/selectors/AuthSelector';
import { getProfileData, getProfileIsFetching } from '../../redux/selectors/ProfileSelector';
import { getFollowFlowFetching} from '../../redux/selectors/UsersSelector';
import {getUserProfile} from '../../redux/reducers/ProfileReducer'
import { useParams } from "react-router-dom";
import { UserProfile } from './UserProfile/UserProfile';
import { WithPreloader } from '../utils/preloder/preloder';
import './ProfilePage.scss'

const ProfileContainer = ({getUserProfile, ...props}) => {
    const { id } = useParams()
    
    useEffect(()=>{
        getUserProfile(id)
    }, [id, getUserProfile])

    return WithPreloader(UserProfile, props.isFetching)({profile: props.profile, authUserId: props.authUserId})
}

let mapStateToProps = (state) => {
    return {
        isFetching: getProfileIsFetching(state),
        followFlowFetching: getFollowFlowFetching(state),
        authUserId: getAuthUserId(state),
        isAuth: getIsAuth(state),
        profile: getProfileData(state)
    }
};

export default connect(mapStateToProps, { getUserProfile })(ProfileContainer)
import { useEffect } from 'react'
import { connect } from 'react-redux'
import { getCurrentPage, getFollowFlowFetching, getIsFetching, getPageSize, getUsersData } from '../../redux/selectors/UsersSelector'
import { UsersComponent } from './users'
import { getUsers, followUser, unfollowUser } from '../../redux/reducers/UsersReducer';
import { getAuthUserId, getIsAuth } from '../../redux/selectors/AuthSelector';
import { WithPreloader } from '../utils/preloder/preloder';
import './usersPage.scss'

const UsersContainer = ({getUsers, currentPage, pageSize, ...props}) => {
    useEffect(()=>{
        //Получение пользователей по api
        getUsers(currentPage, pageSize)
    }, [getUsers, currentPage, pageSize])
    
    return WithPreloader(UsersComponent, props.isFetching)({...props})
}

let mapStateToProps = (state) => {
    return {
        UsersData: getUsersData(state),
        pageSize: getPageSize(state),
        currentPage: getCurrentPage(state),
        isFetching: getIsFetching(state),
        followFlowFetching: getFollowFlowFetching(state),
        authUserId: getAuthUserId(state),
        isAuth: getIsAuth(state)
    }
};

export default connect(mapStateToProps, {
    getUsers,
    followUser,
    unfollowUser
})(UsersContainer);
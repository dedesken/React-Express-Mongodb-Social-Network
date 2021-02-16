import React from 'react'
import { User } from './usersPageUser'

export const UsersComponent = (props) => {
    const follow = (id) => {
        props.followUser(id, props.currentPage, props.pageSize)
    }

    const unfollow = (id) => {
        props.unfollowUser(id, props.currentPage, props.pageSize)
    }

    return <div>
        <ul>
            <h1>Пользователи</h1>
            {props.UsersData.map((user)=>{
                return <User key={user.id} 
                            user={user} 
                            isAuth={props.isAuth} 
                            authUserId={props.authUserId}
                            followUser={()=>{follow(user.id)}}
                            unfollowUser={()=>{unfollow(user.id)}}
                            followFlowFetching={props.followFlowFetching}
                        />
            })}
        </ul>
    </div>
}
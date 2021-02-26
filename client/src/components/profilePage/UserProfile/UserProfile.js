import React from 'react'
import { Link } from 'react-router-dom';
import defaultImg from '../../../assets/users/defaultUser.png'
import { FollowFlowButton } from '../../utils/preloder/followButton/followFlowButtom'
import UserPosts from '../Posts/postsContainer'

export const UserProfile = (props) => {
    return (
      <div className="profile__page">
        <div className="profile__page-head">
            <img
                className='profile__page-head--photo'
                src={props.profile.photo ? 
                        `http://localhost:5000/img/users/${props.profile.photo}`
                        : defaultImg
                    }
                alt={props.profile.name}
            ></img>
            {(props.profile.id !== props.authUserId) && <FollowFlowButton
                fetching={props.followFlowFetching} 
                followed={props.followed} 
                follow={props.followUser}
                unfollow={props.unfollowUser}
            />
            }
        </div>
        <div className='profile__page-info'>
            <h2 className='profile__page-info--name'>{props.profile.name}</h2>
            <p className='profile__page-info--status'>{props.profile.status}</p>
            <div className='profile__page-info--followers'>
                <Link to={`/users/${props.profile.id}/followers`}>
                    <span>{props.profile.followersCount}</span> подписчиков
                </Link>
                <Link to={`/users/${props.profile.id}/follows`}>
                    <span>{props.profile.followingCount}</span> подписок
                </Link>
            </div>
        </div>
        <UserPosts />
      </div>
    );
}
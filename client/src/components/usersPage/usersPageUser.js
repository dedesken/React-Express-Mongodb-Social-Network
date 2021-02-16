import React from 'react'
import { Link } from 'react-router-dom'
import defaultImg from '../../assets/users/defaultUser.png'

//Компонент кнопки подписки
const FollowFlowButton = ({followed, follow, unfollow, fetching}) => {
    if(!followed) {
        return <button disabled={fetching} onClick={follow}>Подписаться</button>
    } else {
        return <button disabled={fetching} onClick={unfollow}>Отписаться</button>
    }
}

export const User = ({user, isAuth, authUserId, followFlowFetching, followUser, unfollowUser}) => {
    //Проверка на наличие подписки на пользователя
    const followed = user.followers.includes(authUserId)

    return <li key={user.id} className='users-page--user'>
        <img src={user.photo ? `http://localhost:5000/img/users/${user.photo}` : defaultImg} alt={user.name}></img>
        <div>
            <Link to={`/users/${user.id}`}>{user.name}</Link>
            <p>{user.email}</p>
            <p>Подписчиков: {user.followersCount}</p>
        </div>
        { //Если пользователь авторизован и id пользователя не совпадает с id пользователя из списка отображается кнопка
                (isAuth && user.id !== authUserId) && 
                <FollowFlowButton  
                    fetching={followFlowFetching} 
                    followed={followed} 
                    follow={followUser}
                    unfollow={unfollowUser}
                />
        }
    </li>
}
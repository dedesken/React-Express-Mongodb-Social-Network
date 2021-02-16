import React from 'react'
import defaultImg from '../../../assets/users/defaultUser.png'

export const UserProfile = (props) => {
    return (
        <div>
            <img src={props.profile.photo ? `http://localhost:5000/img/users/${props.profile.photo}` : defaultImg} alt={props.profile.name}></img>
            <div>
                <p>Name: { props.profile.name }</p>
                <p>Email: { props.profile.email }</p>
                <p>Followers: { props.profile.followers.length }</p>
            </div>
        </div>
    )
}
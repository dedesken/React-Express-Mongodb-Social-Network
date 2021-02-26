import React from 'react'
import { NavLink } from 'react-router-dom';
import { MailIcon, ProfileIcon, UsersIcon } from '../icons/icons';

export const NavbarComponent = (props) => {
    return <nav className='header__content--nav'>
        <div className='header__content--nav-links'>   
            <NavLink to={`/users/${props.id}`}>
                <div>
                    <ProfileIcon/>
                    <span>Моя страница</span>
                </div>
            </NavLink>
            <NavLink to={'/users'}>
                <div>
                    <UsersIcon />
                    <span>Пользователи</span>
                </div>
            </NavLink>
            <NavLink to={'/dialogs'}>
                <div>
                    <MailIcon />
                    <span>Сообщения</span>
                </div>
            </NavLink>
        </div>
        <button className='header__content--nav-logout' onClick={props.logoutUser}>Выйти</button>
    </nav>
}
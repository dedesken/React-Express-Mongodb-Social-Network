import React from 'react'
import { NavbarComponent } from './navigation/navbarComponent';
import './styles/header.scss'
import logo from '../../assets/logo.png'

export const Header = (props) => {
    return <header>
        <div className='header__content'>
            <img src={logo} className="header__content--logo" alt='logo'></img>
            <NavbarComponent {...props}/>
        </div>
    </header>;
}
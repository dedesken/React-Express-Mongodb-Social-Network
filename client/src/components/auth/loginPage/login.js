import React, { useState } from 'react'
import { connect } from 'react-redux';
import { loginProfile } from '../../../redux/reducers/AuthReducer'
import '../auth.scss'
import { Link, Redirect } from 'react-router-dom';

const Login = ({loginProfile, isAuth}) => {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
  
    const handleSubmit = async e => {
      e.preventDefault()
      loginProfile(email, password)
    }
    
    if(isAuth) {
      return <Redirect to='/' />
    }

    return(
      <div className="auth-page">
        <form onSubmit={handleSubmit}>
          <h1>Войти в аккаунт</h1>
          <div>
            <input required={true} placeholder='Адрес электронной почты' type="email" onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <input required={true} type="password" placeholder='Пароль' onChange={e => setPassword(e.target.value)} />
          </div>
          <div>
            <button disabled={!email || !password} type="submit">Войти</button>
          </div>
          <Link to='/singup'>Зарегистрировать аккаунт</Link>
        </form>
      </div>
    )
}

export default connect(null, { loginProfile })(Login);

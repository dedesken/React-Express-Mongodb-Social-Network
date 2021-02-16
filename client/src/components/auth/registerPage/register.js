import React, { useState } from 'react'
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { createUser } from '../../../redux/reducers/AuthReducer'

const Register = ({createUser, isAuth}) => {
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [passwordConfirm, setPasswordConfirm] = useState();

    const buttonIsDisabled = () => {
      return !name || !email || !password || !passwordConfirm
    }
  
    const handleSubmit = async e => {
      e.preventDefault()
      
      createUser(name, email, password, passwordConfirm)
    }

    if(isAuth) {
      return <Redirect to='/'/>
    }
  
    return(
      <div className="auth-page">
        <form onSubmit={handleSubmit}>
          <h1>Создать аккаунт</h1>
          <div>
            <input required={true} placeholder='Никнейм' type="text" onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <input required={true} placeholder='Адрес электронной почты' type="email" onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <input required={true} placeholder='Пароль' type="password" onChange={e => setPassword(e.target.value)} />
          </div>
          <div>
            <input required={true} placeholder='Подтвердите пароль' type="password" onChange={e => setPasswordConfirm(e.target.value)} />
          </div>
          <div>
            <button disabled={buttonIsDisabled()} type="submit">Отправить</button>
          </div>
          <Link to='/login'>Уже есть аккаунт?</Link>
        </form>
      </div>
    )
}

export default connect(null, { createUser })(Register);

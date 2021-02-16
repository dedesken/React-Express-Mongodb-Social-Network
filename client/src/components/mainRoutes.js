import { Fragment, Suspense } from "react"
import { Redirect, Route, Switch } from "react-router-dom"
import Header from './header/headerContainer'
import Users from './usersPage/usersContainer'
import Profile from './profilePage/ProfileContainer'
import { Preloder } from "./utils/preloder/preloder"

export const Main = ({isAuth}) => {
    if (!isAuth) {
      return <Redirect to='/login'/>
    }
    
    return <Fragment>
                <Header />
                <main className='app-wrapper'>
                  <Suspense fallback={<Preloder />}>
                    <Switch>
                      <Route exact path='/' render={() => (<div>Hello world</div>)} />
                      <Route exact path='/users' render={() => (<Users />)} />
                      <Route path='/users/:id' render={() => (<Profile />)} />
                      <Route path='*' render={() => <div>404 NOT FOUND</div>} />
                    </Switch>
                  </Suspense>
                </main>
            </Fragment>
}
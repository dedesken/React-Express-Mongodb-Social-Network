import { connect, Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.scss';
import store from './redux/store'
import {initializeApp} from './redux/reducers/AppReducer'
import { Suspense, useEffect } from 'react';
import Login from './components/auth/loginPage/login';
import Singup from './components/auth/registerPage/register';
import { Main } from './components/mainRoutes';
import { getAuthIsFetching, getIsAuth } from './redux/selectors/AuthSelector';
import { Preloder, WithPreloader } from './components/utils/preloder/preloder';

function App({initializeApp, initialized, isAuth, authIsFetching}) {
  useEffect(()=>{
    initializeApp()
  }, [initializeApp])

  const AppComponent = () => {
    return (
    <div className="App">
      <Suspense fallback={<Preloder />}>
          <Switch>
            <Route path='/login' render={() => (WithPreloader(Login, authIsFetching)({isAuth}))} />
            <Route path='/singup' render={() => (WithPreloader(Singup, authIsFetching)({isAuth}))} />
            <Route path='/' render={()=> (<Main isAuth={isAuth}/>)} />
          </Switch>
      </Suspense>
    </div>
  )}
  
  return WithPreloader(AppComponent, !initialized)()
}

const mapStateToProps = (state) => {
  return {
    initialized: state.App.initialized,
    isAuth: getIsAuth(state),
    authIsFetching: getAuthIsFetching(state)
  }
}

const AppContainer = connect(mapStateToProps, { initializeApp })(App);

const AppWithRouter = (props) => {
  return <BrowserRouter>
    <Provider store={store}>
      <AppContainer />
    </Provider>
  </BrowserRouter> 
}

export default AppWithRouter;

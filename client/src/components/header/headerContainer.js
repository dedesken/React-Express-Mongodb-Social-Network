import React from 'react';
import { Header } from './headerComponent';
import { connect } from 'react-redux';
import { getAuthUserId, getIsAuth, getName } from '../../redux/selectors/AuthSelector';
import { logoutUser } from '../../redux/reducers/AuthReducer'

class HeaderContainer extends React.Component {
    render() {
        return <Header {...this.props} />
    }
};

const mapStateToProps = (state) => ({
    isAuth: getIsAuth(state),
    name: getName(state),
    id: getAuthUserId(state)
});

export default connect(mapStateToProps, { logoutUser })(HeaderContainer);
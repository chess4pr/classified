import React, {Component} from 'react';
import withBreadcrumbs from 'react-router-breadcrumbs-hoc';
import {NavLink} from 'react-router-dom';
import {connect} from 'react-redux';
import cookie from 'browser-cookies';

class Crumbs extends Component {
    constructor(props) {
        super(props);
        // const {cookies} = props;
        this.state = {
            local: cookie.get('local') || 'en',
            langs: props.langs
        };
    }

    render() {
        const routes = [
            {path: '/aboutus', breadcrumb: '  /  ' + this.state.langs.strings.about},
            {path: '/privacy', breadcrumb: '  /  ' + this.state.langs.strings.policy},
            {path: '/tos', breadcrumb: '  /  ' + this.state.langs.strings.tos},
            {path: '/settings', breadcrumb: '  /  ' + this.state.langs.strings.settings},
            {path: '/settings/account', breadcrumb: '  /  ' + this.state.langs.strings.account},
            {path: '/settings/change-password', breadcrumb: '  /  ' + this.state.langs.strings.changePassword},
            {path: '/settings/images', breadcrumb: '  /  ' + this.state.langs.strings.images},
            {path: '/myads', breadcrumb: '  /  ' + this.state.langs.strings.myads + '  /  ' + this.state.langs.strings.list},
            {path: '/newad', breadcrumb: '  /  ' + this.state.langs.strings.myads + '  /  ' + this.state.langs.strings.newad},
            {path: '/messages', breadcrumb: '  /  ' + this.state.langs.strings.myads + '  /  ' + this.state.langs.strings.messages},
            {path: '/profile', breadcrumb:  '  /  ' + this.state.langs.strings.profile},
            {path: '/', breadcrumb: this.state.langs.strings.home}
        ];

        const Breadcrumbs = ({breadcrumbs}) => (
            <div>
                {breadcrumbs.map(({
                                      match,
                                      breadcrumb
                                      // other props are available during render, such as `location`
                                      // and any props found in your route objects will be passed through too
                                  }) => (
                    <span key={match.url}>
        <NavLink to={match.url}>{breadcrumb}</NavLink>
      </span>
                ))}
            </div>
        );
        withBreadcrumbs(routes, { disableDefaults: true })
        const ReturnBreadcrumbs = withBreadcrumbs(routes)(Breadcrumbs);

        return <ReturnBreadcrumbs/>;
    }
}

const mapStateToProps = (state) => {
    return {langs: state.langs, local: state.local};
};

export default connect(mapStateToProps)(Crumbs);

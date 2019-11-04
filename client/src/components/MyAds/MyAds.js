import React, {PureComponent} from 'react';
import {Link, Route} from 'react-router-dom';
import List from './List';
import NewAd from './NewAd';
import Messages from './Messages';
import cookie from 'browser-cookies';
import {connect} from "react-redux";


class Settings extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            local: cookie.get('local') || 'en',
            me: {},
            langs: props.langs
        };

        this.routes = [
            {
                path: '/myads',
                link: '/myads',
                icon: 'fa fa-list-ul',
                exact: true,
                title: () => <h1 className="h5">{props.langs.strings.list}</h1>,
                name: props.langs.strings.list,
                main: List
            }, {
                path: '/newad',
                link: '/newad',
                icon: 'fa fa-pencil-square-o',
                exact: true,
                title: () => <h1 className="h5">{props.langs.strings.newad}</h1>,
                name: props.langs.strings.newad,
                main: NewAd
            }, {
                path: '/messages',
                link: '/messages',
                icon: 'fa fa-pencil-square-o',
                exact: true,
                title: () => <h1 className="h5">{props.langs.strings.messages}</h1>,
                name: props.langs.strings.messages,
                main: Messages
            }
        ];
    }

    render() {
        if (cookie.get('local') !== this.state.local) {
            this.setState({local: cookie.get('local')});
        }
        return <section className="container">
            <div className="row">
                <nav className="col-md-2 d-none d-md-block border-right sidebar">
                    <div className="sidebar-sticky">
                        <h5 className="sidebar-heading text-muted"><i
                            className="fa fa-cogs"/>&nbsp;{this.state.langs.strings.myads}</h5>
                        <ul className="nav flex-column small">
                            {this.routes.map((route, index) => (
                                <li key={index} className="nav-item">
                                    <Link className="nav-link active" to={route.link}>
                                        <i className={route.icon}/> {route.name}
                                    </Link>
                                </li>))}
                        </ul>
                    </div>
                </nav>
                <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4">
                    <div
                        className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                        {this.state.local}
                        {this.routes.map((route, index) => (
                            <Route
                                key={index}
                                path={route.path}
                                exact={route.exact}
                                component={route.title}
                            />
                        ))}
                    </div>
                    {this.routes.map((route, index) => (
                        <Route
                            key={index}
                            path={route.path}
                            exact={route.exact}
                            component={route.main}
                        />
                    ))}
                </main>
            </div>
        </section>;
    }
}

const mapStateToProps = (state) => {
    return {me: state.auth.me, user: state.system.data, langs: state.langs};
};

export default connect(mapStateToProps)(Settings);

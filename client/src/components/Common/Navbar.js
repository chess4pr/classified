import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import SystemMessages from './SystemMessages';
import logo from '../../styles/img/logo.png';
import cookie from 'browser-cookies';
import {getMessages, signIn, signInSocial, signUp, socialLogin} from "../../actions";
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BrowserDetection from 'react-browser-detection';
import Modal from 'react-modal';
import SignIn from '../../components/Auth/SignIn/';
import SignUp from '../../components/Auth/SignUp/';
import $ from 'jquery';
import {GoogleLogin} from 'react-google-login';
import requestIp from 'request-ip';

/*import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';*/
// import {getIPs} from 'real-ip'
// /private/var/www/__classifield/client/src/components/Auth/SignIn/SignIn.js

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        ip: null,
        signUpIn: 0,
        bottom: 'auto',
        redirect: false,
        border: 0,
        marginRight: '-50%',
        backgroundColor: 'transparent',
        transform: 'translate(-50%, -50%)'
    }
};

class Navbar extends PureComponent {
    constructor(props) {
        super(props);
        // let langs = props.langs.strings.setLanguage('it')
        // console.log(props)
        this.state = {
            me: props.me,
            modalOpened: false,
            browser: 0,
            local: cookie.get('local') || 'en',
            langs: props.langs,
            shrink: !!props.me,
            cookMsgCountDif: 0
        };

        this.openModalIn = this.openModalIn.bind(this);
        this.openModalUp = this.openModalUp.bind(this);
        this.afterOpenModal = this.afterOpenModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    openModalIn() {
        this.setState({modalIsOpen: true});
        this.setState({signUpIn: 0});
    }

    openModalUp() {
        this.setState({modalIsOpen: true});
        this.setState({signUpIn: 1});
    }

    afterOpenModal() {
        // references are now sync'd and can be accessed.
        //this.subtitle.style.color = '#f00';
    }

    closeModal() {
        this.setState({modalIsOpen: false});
    }

    static dropDownToggle(e) {
        const dd = e.currentTarget;
        dd.classList.toggle('show');
        dd.querySelector('.dropdown-menu').classList.toggle('show');
    }

    static Shrink(e, shrink) {
        const navbar = document.getElementById('navbar');
        if (shrink || window.pageYOffset > 1) {
            navbar.classList.add("navbar-shrink");
        } else {
            navbar.classList.remove("navbar-shrink");
        }
    }

    notify = (messages) => {
        if (this.state.browser !== 'safari') {
            var audio = new Audio('for-sure.mp3');
            audio.play();
        }
        setTimeout(() => {
            cookie.set('messages', messages, {path: '/'});
        }, 2000);
        toast("New Message");
        console.log('document.location');
        console.log(document.location.pathname);

    };

    checkSignUp() {
        let that = this;
        if (typeof this.myIntervalSignin !== 'undefined') {
            clearInterval(this.myIntervalSignin);
        }
        this.myIntervalSignin = setInterval(function() {
            if (typeof window.signUp !== 'undefined') {
                if (window.signUp === 1) {
                    window.signUp = 0;
                    that.openModalIn();
                    toast("Your account has been created successfully! Check Your Email.");
                }
            }
        });
    }

    checkMsgs() {
        let that = this;
        if (typeof this.myInterval !== 'undefined') {
            clearInterval(this.myInterval);
        }
        this.myInterval = setInterval(function() {
            getMessages(that.state.me.id)
                .then(messages => {
                    var msgsToMe = [];
                    messages.forEach((item) => {
                        if (item.recepientid === that.state.me.id) {
                            msgsToMe.push(item);
                        }
                    });

                    const cookMsg = cookie.get('messages');
                    const cookMsgCountDif = msgsToMe.length - cookMsg / 1;

                    console.log('cookMsg', cookMsg);
                    console.log('messages.length', messages.length);

                    if (cookMsgCountDif > 0) {
                        window.message = 1;
                        console.log('cookMsgCount');
                        console.log(cookMsgCountDif);
                        that.notify(msgsToMe.length + '');
                        that.setState({cookMsgCountDif});
                    }

                })
                .catch(error => {
                    that.setState({'error': error});
                });
        }, 20000);
    }

    componentDidMount() {
        let that = this;

        function ipLookUp() {
            $.ajax('http://ip-api.com/json')
                .then(
                    function success(response) {
                        window.ip = response.query + ' ' + response.country + ' ' + response.city;
                    },

                    function fail(data, status) {
                        console.log('Request failed.  Returned status of',
                            status
                        );
                    }
                );
        }

        ipLookUp();

        if (this.state.me) {
            this.checkMsgs();
        } else {
            this.checkSignUp();
        }
        console.log('props.langs');
        console.log(this.state.langs);
        Navbar.Shrink(null, this.state.shrink);
        if (!this.state.shrink) {
            window.addEventListener('scroll', Navbar.Shrink);
        }
    }

    componentWillReceiveProps(props) {
        this.setState({
            me: props.me,
            shrink: !!props.me
        });
        Navbar.Shrink(null, props.me);
        if (props.me) {
            window.removeEventListener('scroll', Navbar.Shrink);
        } else {
            window.addEventListener('scroll', Navbar.Shrink);
        }
    }

    renderLogo() {
        return <Link to={this.state.me ? "/home" : "/"} className="navbar-brand" key="logo">
            <img src={logo} className="img-fluid" alt="logo"/>
        </Link>;
    }

    renderMyAdsLinks() {
        if (this.state.me) {
            return [
                <li className="nav-item" key="users">
                    <Link className="nav-link" to="/myads">{this.state.langs.strings.myads}</Link>
                </li>
            ];
        } else {
            return <li key="item"></li>;
        }
    }

    renderLinks() {
        if (this.state.me && this.state.me.username === 'admin') {
            return [
                <li className="nav-item" key="users">
                    <Link className="nav-link" to="/users">{this.state.langs.strings.users}(Users)</Link>
                </li>
            ];
        } else {
            return <li key="users"></li>;
        }
    }

    renderModal() {
        if (this.state.signUpIn) {
            return <Modal
                isOpen={this.state.modalIsOpen}
                onAfterOpen={this.afterOpenModal}
                onRequestClose={this.closeModal}
                style={customStyles}
                contentLabel="Example Modal"
            >
                <SignUp/>
            </Modal>;
        } else {
            return <Modal
                isOpen={this.state.modalIsOpen}
                onAfterOpen={this.afterOpenModal}
                onRequestClose={this.closeModal}
                style={customStyles}
                contentLabel="Example Modal"
            >
                <SignIn/>
            </Modal>;
        }
    }

    renderGoogleLogin() {
        if (this.state.me) {
            return <span/>;
        } else {
            const responseGoogle = (response) => {
                socialLogin(response.profileObj)
                    .then(re => {
                        console.log('re');
                        console.log(re);
                        const values = {email: re.data.data.email, password: 'user'};

                        setTimeout(() => {
                            signInSocial(values);
                            setTimeout(() => { window.location.reload(); }, 2000);
                        }, 1000);
                    })
                    .catch(error => console.log(error));
            };
            return <GoogleLogin
                clientId="508848238999-rtjfbeefudv42q64kb34bnmqr39ceksn.apps.googleusercontent.com"
                buttonText="Login"
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                cookiePolicy={'single_host_origin'}
            />;
        }
    }

    renderAvatar() {//this.state.me && this.state.me.image
        if (!(this.state.me.image.thumb.indexOf('holder') + 1)) {
            return <img className="navbar-avatar"
                        src={this.state.me.image.thumb} alt={this.state.me.name}/>;
        } else if (typeof this.state.me.imageSocial != 'undefined') {
            return <img className="navbar-avatar"
                        src={this.state.me.imageSocial} alt={this.state.me.name}/>;
        } else {
            return <img className="navbar-avatar"
                        src={this.state.me.image.thumb} alt={this.state.me.name}/>;
        }
    }

    renderUserMenu() {
        if (this.state.me && this.state.me.image) {
            this.setState({modalIsOpen: false});
            return [
                <li className="nav-item dropdown" key="userMenu" onClick={Navbar.dropDownToggle}>
          <span className="nav-link dropdown-toggle" data-toggle="dropdown">
              {this.renderAvatar()}
              <i className={this.state.me.icon}/> <strong>{this.state.me.name}</strong>
          </span>
                    <div className="dropdown-menu">
                        <Link className="dropdown-item" to="/profile">Profile</Link>
                        <Link className="dropdown-item" to="/settings">Settings</Link>
                        <div className="dropdown-divider"/>
                        <Link className="dropdown-item" to="/signout">Log out</Link>
                    </div>
                </li>
            ];
        } else {
            return [
                <li className="nav-item" key="signin">
                    <span className="nav-link" style={{cursor: 'pointer', color: 'blue'}}
                          onClick={this.openModalIn}>{this.state.langs.strings.signIn}</span>
                </li>,
                <li className="nav-item" key="signup">
                    <span className="nav-link" style={{cursor: 'pointer', color: 'blue'}}
                          onClick={this.openModalUp}>{this.state.langs.strings.signUp}</span>
                </li>
            ];
        }
    }

    setLocal(local) {
        this.setState({
            local: local
        });
        console.log(this.state.langs.strings);
        cookie.set('local', local, {path: '/'});
        document.location.href = '/';
    }

    render() {
        this.state.langs.strings.setLanguage(this.state.local);
        const browserHandler = {
            chrome: () => <div/>,
            googlebot: () => <div/>,
            default: (browser) => <div>{this.setState({browser})}</div>
        };

        /*        const RedirectAfterSocialLogin = (props) => {
                    if (props.redirect) {
                        return <Redirect to='/'/>;
                    }
                    else {return <span/>;}
                };*/

        const MsgIcon = (props) => {
            if (props.dif) {
                return <Link className="nav-link active" to='/messages'><i className="fa fa-commenting-o"/></Link>;
            } else {
                return <span/>;
            }
        };

        return (
            <nav id="navbar" className="navbar navbar-expand-lg navbar-light fixed-top">
                {/*<RedirectAfterSocialLogin redirect={this.state.redirect}/>*/}
                <div className="container">
                    {this.renderLogo()}
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarMain"
                            aria-controls="navbarMain" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"/>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarMain">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item" key="cz">
                                <button type="button" className="btn btn-default" onClick={() => this.setLocal('cz')}
                                >Cz
                                </button>
                            </li>
                            <li className="nav-item" key="it">
                                <button type="button" className="btn btn-default" onClick={() => this.setLocal('it')}
                                >It
                                </button>
                            </li>
                        </ul>
                        {this.renderModal()}
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item" key="welcome">
                                <Link className="nav-link" to="/#welcome">{this.state.langs.strings.allAds}</Link>
                            </li>
                            {this.renderMyAdsLinks()}
                            {this.renderLinks()}
                        </ul>
                        <MsgIcon dif={this.state.cookMsgCountDif}/>
                        <BrowserDetection>
                            {browserHandler}
                        </BrowserDetection>
                        <div>
                            <ToastContainer/>
                        </div>
                        {this.renderGoogleLogin()} &nbsp;&nbsp;
                        <ul className="nav navbar-nav navbar-right">
                            {this.renderUserMenu()}
                        </ul>
                    </div>
                </div>
                <SystemMessages/>
            </nav>
        );
    }
}

const mapStateToProps = (state) => {
    return {me: state.auth.me, langs: state.langs};
};

export default connect(mapStateToProps)(Navbar);

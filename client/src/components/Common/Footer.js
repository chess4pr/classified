import React, {PureComponent} from 'react';
import {Link} from 'react-router-dom';
import {connect} from "react-redux";

class Footer extends PureComponent {
    constructor(props) {
        super(props)
        this.state = { langs: props.langs}
    }

    render() {
        return (
            <footer id="footer" className="small">
                <div className="container py-3 border-top">
                    <div className="row">
                        <div className="col-sm-4  text-center text-sm-left text-uppercase">
                            React Loopback Playground.
                        </div>
                        <div className="col-sm-4 text-center">
                            {this.state.langs.strings.mit} <a href="https://opensource.org/licenses/MIT"
                                                     rel="noopener noreferrer"
                                                     target="_blank">MIT license</a>.
                        </div>
                        <div className="col-sm-4 text-center text-sm-right">
                            <ul className="nav justify-content-center justify-content-sm-end">
                                <li className="nav-item" key="about">
                                    <Link className="nav-link py-0" to="/aboutus">{this.state.langs.strings.about}</Link>
                                </li>
                                <li className="nav-item" key="tos">
                                    <Link className="nav-link py-0" to="/tos">{this.state.langs.strings.tos}</Link>
                                </li>
                                <li className="nav-item" key="privacy">
                                    <Link className="nav-link py-0" to="/privacy">{this.state.langs.strings.policy}</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </footer>
        );
    }
}

const mapStateToProps = (state) => {
    return {langs: state.langs}
}

export default connect(mapStateToProps)(Footer);


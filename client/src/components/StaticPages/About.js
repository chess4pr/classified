import React, {Component} from 'react';
import {connect} from "react-redux";
import {getAboutText, getAboutTitle} from "../../actions";
import MDReactComponent from 'markdown-react-js';
import Breadcrumbs from '../Breadcrumbs';

class About extends Component {

    constructor(props) {
        super(props);

        this.state = {
            me: props.me,
            articleText: '',
            articleTitle: ''
        };
    }

    componentDidMount() {
        getAboutText()
            .then(text => {
                this.setState({
                    articleText: text
                });
            })
            .catch(error => {
                this.setState({'error': error})
            })
        getAboutTitle()
            .then(title => {
                this.setState({
                    articleTitle: title
                });
            })
            .catch(error => {
                this.setState({'error': error})
            })

    }

    render() {

        return <section id="privacyPolicy">
            <div className="container">
                <div className="breadcrumbs">
                    <Breadcrumbs/>
                </div>
                <h1 className="h3">{this.state.articleTitle}</h1>
                <hr className="border-primary"/>
                <p><MDReactComponent text={this.state.articleText}/></p>
            </div>
        </section>;

    }
}

const mapStateToProps = (state) => {
    return {me: state.auth.me, user: state.system.data}
};

export default connect(mapStateToProps)(About);


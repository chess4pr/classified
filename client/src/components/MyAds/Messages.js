import React from 'react'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import {getMessages} from "../../actions";
import {connect} from "react-redux";
import cookie from 'browser-cookies';
import $ from 'jquery';
import axios from 'axios';
import Moment from 'react-moment';
import Breadcrumbs from '../Breadcrumbs';

const API_URL = process.env.REACT_APP_API_URL;

class Messages extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            me: props.me,
            messages: [],
            author: false,
            langs: props.langs
        };
    }

    componentDidMount() {
        if(typeof this.myInterval !== 'undefined'){
            clearInterval(this.myInterval);
        }
        this.myInterval = setInterval(()=>{
            console.log(window.message)
            if(typeof window.message !== 'undefined' && window.message){
                getMessages(this.state.me.id)
                    .then(messages => {
                        var msgsToMe = []
                        messages.forEach((item) => {
                            if (item.recepientid === this.state.me.id) {
                                msgsToMe.push(item)
                            }
                        })

                        this.setState({messages})
                        console.log('check messages msgsToMe.length')
                        console.log(msgsToMe.length)
                        cookie.set('messages', msgsToMe.length + '', {path: '/'});
                        window.message = 0
                    })
                    .catch(error => {
                        window.message = 0
                        this.setState({'error': error})
                    })
            }
        },10000)
        console.log(this.state.me)
        const author = cookie.get('author');
        console.log('author', author)
        if (author) {
            this.setState({author})
            cookie.erase('author');
        }

        getMessages(this.state.me.id)
            .then(messages => {
                var msgsToMe = []
                messages.forEach((item) => {
                    if (item.recepientid === this.state.me.id) {
                        msgsToMe.push(item)
                    }
                })
                this.setState({messages})
                cookie.set('messages', msgsToMe.length + '', {path: '/'});

            })
            .catch(error => {
                this.setState({'error': error})
            })
    }

    renderShowsTotal(start, to, total) {
        return (
            <p style={{color: 'blue'}}>
            </p>
        );
    }

    onClickSendMsg(cell, row, rowIndex, author) {
        console.log('Message #', rowIndex);
        console.log(row);
        this.setState({author})
    }

    cellButton(cell, row, enumObject, rowIndex) {
        if (row.recepientid === this.state.me.id) {
            return (
                <div>
                    <div> {this.state.langs.strings.receivedFrom} <span style={{cursor:'pointer', color:'blue'}} onClick={() =>
                        this.onClickSendMsg(cell, row, rowIndex, row.userid + ',' + row.username)
                    }>{row.username}</span>
                    </div>
                </div>
            )
        } else {
            return (
                <div>
                    {this.state.langs.strings.sentTo} <span style={{cursor:'pointer', color:'blue'}}  onClick={() =>
                    this.onClickSendMsg(cell, row, rowIndex, row.recepientid + ',' + row.recepientname)
                }>{row.recepientname}</span>
                </div>
            )
        }
    }

    sendMsg = () => {
        console.log(this.state.me);
        const msg = $('textarea[name="msg"]', '#addMsg').val()
        if (msg === '') {
            $('.msgError').css("display", "block")
            // $('.sumError').css("display", "block")
            return false
        } else {
            $('.msgError').css("display", "none")
            // $('.sumError').css("display", "none")
            const author = this.state.author.split(',')
            var sendData = {
                "userid": this.state.me.id,
                "username": this.state.me.username,
                "recepientid": author[0],
                "recepientname": author[1],
                "message": msg,
                "read": false,
            }

            let that = this

            axios.post(`${API_URL}/messages`, sendData)
                .then(function (response) {
                    console.log(response);
                    const author = false
                    that.setState({author})
                    getMessages(that.state.me.id)
                        .then(messages => {
                            that.setState({messages})
                        })
                        .catch(error => {
                            that.setState({'error': error})
                        })
                })
                .catch(function (error) {
                    console.log(error);
                });
            return true
        }
    }

    handleClick = () => {
        console.log(this.sendMsg())
    }


    dateFormatter(cell, row) {
        return <Moment format="YYYY/MM/DD HH:mm">
            {cell}
        </Moment>;
    }

    render() {

        const SendMessageForm = () => {

            if (this.state.author) {
                const author = this.state.author.split(',')
                return (<div><h2>{this.state.langs.strings.sendMessage} {author[1]}*</h2><br/>
                        <form id='addMsg'>
                            <textarea style={{width: '400px'}} name='msg'/>
                            <br/>
                            <div
                                className="formError msgError">required
                            </div>
                            <br/>
                            <br/>
                            <button onClick={this.handleClick} className="btn btn-primary"
                                    type="button">{this.state.langs.strings.send}</button>
                        </form>
                    </div>
                );
            } else {
                return (
                    <div/>
                );
            }
        }

        const options = {
            page: 1,  // which page you want to show as default
            sizePerPageList: [], // you can change the dropdown list for size per page
            sizePerPage: 5,  // which size per page you want to locate as default
            pageStartIndex: 0, // where to start counting the pages
            paginationSize: 1,  // the pagination bar size.
            prePage: 'Prev', // Previous page button text
            nextPage: 'Next', // Next page button text
            firstPage: 'First', // First page button text
            lastPage: 'Last', // Last page button text
            paginationShowsTotal: this.renderShowsTotal,  // Accept bool or function
            paginationPosition: 'top', // default is bottom, top and both is all available
            hideSizePerPage: true//> You can hide the dropdown for sizePerPage
            // alwaysShowAllBtns: true, // Always show next and previous button
            // withFirstAndLast: false //> Hide the going to First and Last page button
        };

        return (
            <div>
                <div className="breadcrumbs">
                    <Breadcrumbs/>
                </div>
                <SendMessageForm/>

                <BootstrapTable
                    data={this.state.messages}
                    pagination
                    search
                >
                    <TableHeaderColumn dataField="message" isKey={true}
                                       editable={{type: 'textarea'}}></TableHeaderColumn>
                    <TableHeaderColumn dataField='created' dataFormat={this.dateFormatter}
                                       width='100px'></TableHeaderColumn>
                    <TableHeaderColumn width='100px'
                                       editable={{type: 'hidden'}}
                                       dataField='button'
                                       dataFormat={this.cellButton.bind(this)}
                    />
                </BootstrapTable>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {authenticated: state.auth.authenticated, me: state.auth.me, langs: state.langs}
};

export default connect(mapStateToProps)(Messages);
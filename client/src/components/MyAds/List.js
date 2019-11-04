import React, {Component} from 'react';
import {BootstrapTable, TableHeaderColumn, InsertModalFooter} from 'react-bootstrap-table';
import {connect} from "react-redux";
import axios from 'axios';
import cookie from 'browser-cookies';
import Breadcrumbs from '../Breadcrumbs';

const API_URL = process.env.REACT_APP_API_URL;
const STRAPI_URL = process.env.STRAPI_URL;

class DataGrid extends Component {
    constructor(props) {
        super(props);

        this.state = {
            me: props.me,
            items: [],
            categories: []
        };
    }

    getState = () => {
        return this.state;
    };

    createCustomModalFooter = (closeModal, save) => {
        return (
            <InsertModalFooter
                className='my-custom-class'
                saveBtnText='Create Your Add!'
                closeBtnText='Close'
                closeBtnContextual='btn-warning'
                saveBtnContextual='btn-success'
                closeBtnClass='my-close-btn-class'
                saveBtnClass='my-save-btn-class'
                beforeClose={this.beforeClose}
                beforeSave={this.beforeSave}
                onModalClose={() => this.handleModalClose(closeModal)}
                onSave={() => this.handleSave(save)}/>
        );

        // If you want have more power to custom the child of InsertModalFooter,
        // you can do it like following
        // return (
        //   <InsertModalFooter
        //     onModalClose={ () => this.handleModalClose(closeModal) }
        //     onSave={ () => this.handleSave(save) }>
        //     { ... }
        //   </InsertModalFooter>
        // );
    };

    onClickDel(cell, row, rowIndex) {
        console.log('Product #', rowIndex);
        console.log(row.id);
        var that = this;
        axios.delete(`${API_URL}/pages/${row.id}`, {data: {id: row.id}})
            .then(function(response) {
                console.log(response.data);
                if (response.data.count) {

                    that.requestData();
                }
            });
    }

    cellButton(cell, row, enumObject, rowIndex) {
        return (
            <div>
                <button className="btn btn-sm btn-danger"
                        type="button"
                        onClick={() =>
                            this.onClickDel(cell, row, rowIndex)
                        }
                ><span className="fas fa-times"></span>&nbsp;
                </button>
                <a
                    href={'ads/' + row.id}>
                    <button className="btn btn-sm btn-info"
                            type="button">
                        <span className="fas fa-eye"></span>&nbsp;
                    </button>
                </a>
                {/*  <Uploader />*/}
            </div>
            /*   '<button type="button" class="btn btn-xs btn-info">\n' +
               '  <span class="fas fa-pencil-square-o"></span>&nbsp;\n' +
               '</button>';*/
        );
    }

    requestData() {
        console.log('this.state.me');
        console.log(this.state.me.id);
        axios.all([
            axios.get(`${API_URL}/pages?filter=%7B%22where%22%3A%7B%22author%22%3A%22${this.state.me.id}%22%7D%7D`),
            axios.get(`${API_URL}/upload_files`),
            axios.get(`${API_URL}/categories?filter[where][local]=${cookie.get('local')}`)

        ]).then(axios.spread((pages, files, cats) => {
            console.log(pages);
            let categories = [];
            for (let i = 0; i < cats.data.length; i++) {
                categories.push(cats.data[i].name);
            }

            let newProducts = [];
            for (let i = 0; i < pages.data.length; i++) {
                let imgSrc = 'https://dummyimage.com/160x160/000/fff.png&text=not+found';
                if (typeof pages.data[i].donor_images != 'undefined' && pages.data[i].donor_images.length) {
                    imgSrc = pages.data[i].donor_images[0];
                }

                for (let c = 0; c < files.data.length; c++) {
                    if (files.data[c].related.length) {
                        if (pages.data[i].id === files.data[c].related[0].ref) {
                            imgSrc = `${STRAPI_URL}/${files.data[c].url}`;
                        }
                    }
                }
                console.log(this.state.me.username);
                console.log(this.state.me.id);
                newProducts.push({
                    id: pages.data[i].id,
                    category: pages.data[i].category_title,
                    title: pages.data[i].title,
                    text: pages.data[i].text,
                    locality: pages.data[i].locality,
                    price: pages.data[i].price,
                    currency: pages.data[i].currency,
                    local: pages.data[i].local,
                    phone: pages.data[i].phone,
                    image: imgSrc
                });

                setTimeout(() => {
                    var formsCollection = document.getElementsByClassName("imgUpload");
                    for (var i = 0; i < formsCollection.length; i++) {
                        console.log('formsCollection[i].id');
                        console.log(formsCollection[i].id);

                        const formElement = document.getElementById(formsCollection[i].id);
                        let img = document.getElementById('img_' + formsCollection[i].id);
                        formElement.addEventListener('submit', (e) => {
                            e.preventDefault();

                            const request = new XMLHttpRequest();

                            request.onreadystatechange = function() {
                                console.log(request.responseText);
                                try {
                                    console.log(request.responseText);
                                    var imgObj = JSON.parse(request.responseText);
                                    // eslint-disable-next-line
                                    if (request.readyState == 4 && request.status == 200) {
                                        if (typeof imgObj[0].url === 'string') {
                                            /*  if (imgObj[0].url.indexOf('localhost')) {
                                                  imgObj[0].url = imgObj[0].url.replace('localhost', 'localhost')
                                              }*/
                                            console.log(imgObj[0].url);
                                            console.log(imgObj[0].url);
                                            img.src = imgObj[0].url;

                                            img.alt = imgObj[0].name;
                                        }
                                    } else {
                                        //alert('something went wrong, request state ' + request.readyState)
                                    }
                                }
                                catch (err) {
                                    console.log(err.message);
                                }
                            };

                            request.open('POST', `${STRAPI_URL}/upload`);

                            request.send(new FormData(formElement));
                        });

                    }
                }, 500);
            }
            this.setState({
                items: newProducts,
                categories: categories.sort()
            });
            console.log(this.state);
        }));
    }

    componentDidMount() {
        this.requestData();
    }

    customLocalField = (column, attr, editorClass, ignoreEditable) => {
        return (<div>&nbsp;
                <select name="local" {...attr}>
                    <option key='cz' value='cz'>cz</option>
                    <option key='it' value='it'>it</option>
                </select>&nbsp;
                {/*<input type="text" value="title" name="title" placeholder="Title" style={{width:'250px'}} { ...attr }/>&nbsp;*/}
            </div>
        );
    };

    customAuthorHiddenField = (column, attr, editorClass, ignoreEditable) => {
        return (<input style={{height: 0}} name="author" type="hidden" value={this.state.me.id} {...attr} />);
    };

    customAuthorNameHiddenField = (column, attr, editorClass, ignoreEditable) => {
        return (<input name="author_name" type="hidden" value={this.state.me.username} {...attr} />);
    };

    customCurrencyField = (column, attr, editorClass, ignoreEditable) => {
        return (<div>&nbsp;
                {/*<input type="text" name="price" style={{width: '70px'}}/>&nbsp;*/}
                <select name="currency"  {...attr}>
                    <option key='noval' value='noval'>currency</option>
                    <option key='kč' value='kč'>kč</option>
                    <option key='eur' value='eur'>eur</option>
                </select>
            </div>
        );
    };

    createCustomModalHeader(onClose, onSave) {

        /* const headerStyle = {
             fontWeight: 'bold',
             textAlign: 'center',
             lineHeight: 0.3,
             margin: 0,
             padding: 0
         };*/
        return (
            <span/>
        );
    }

    beforeClose(e) {
        console.log(`
    [Custom
    Event
]:
    Modal
    close
    event
    triggered
!`);
    }

    beforeSave(e) {
        console.log(`
    [Custom
    Event
]:
    Modal
    save
    event
    triggered
!`);
    }

    handleModalClose(closeModal) {
        // Custom your onCloseModal event here,
        // it's not necessary to implement this function if you have no any process before modal close
        console.log('This is my custom function for modal close event');
        closeModal();
    }

    handleSave(save) {
        // Custom your onSave event here,
        // it's not necessary to implement this function if you have no any process before save
        console.log('This is my custom function for save event');
        //console.log(save);

        save();
    }

    onAfterInsertRow(row) {
        axios.all([
            axios.get(`${API_URL}/categories`)
        ]).then(axios.spread((cats) => {
            cats.data.forEach(myFunction);
            let catName = '';
            let catId = '';
            let catUrl = '';

            function myFunction(item, index) {
                if (item.name === row.category) {
                    catName = item.name;
                    catId = item.id;
                    catUrl = item.url;

                    var sendData = {
                        "local": row.local,
                        "title": row.title,
                        "category": catId,
                        "category_title": catName,
                        "urlcategory": catUrl,
                        "url": catUrl,
                        "text": row.text,
                        "images": "string",
                        "donor_images": [
                            {}
                        ],
                        "donor": false,
                        "edited": false,
                        "author_name": row.author_name,
                        "author": row.author,
                        "phone": "string",
                        "locality": row.locality,
                        "localityurl": "",
                        "price": row.price,
                        "currency": row.currency,
                        "views": "string",
                        "comment": "string",
                        "commenttype": "string",
                        "parsed": true,
                        "active": true
                    };

                    axios.post(`${API_URL}/pages`, sendData)
                        .then(function(response) {

                            window.location.reload();
                            console.log('response');
                            console.log(response);
                        })
                        .catch(function(error) {
                            console.log(error);
                        });
                }
            }
        }));
    }

    render() {
        const options = {
            headerTitle: true,
            insertModalHeader: this.createCustomModalHeader,
            insertModalFooter: this.createCustomModalFooter,
            // insertModalBody: this.createCustomModalBody,
            afterInsertRow: this.onAfterInsertRow
        };

        return (
            <div>
                <div className="breadcrumbs">
                    <Breadcrumbs/>
                </div>
                <BootstrapTable
                    data={this.state.items}
                    options={options}
                    insertRow={false}
                    remote
                    striped
                    hover
                    condensed
                >

                    <TableHeaderColumn dataField="title" editable={{type: 'text'}}>Title (required)</TableHeaderColumn>

                    <TableHeaderColumn dataField="category"
                                       editable={{
                                           type: 'select',
                                           options: {values: this.state.categories, defaultValue: 1}
                                       }} isKey
                                       dataAlign="center" dataSort>Category</TableHeaderColumn>

                    <TableHeaderColumn dataField="text" hidden={true}
                                       editable={{type: 'textarea'}}>Description (required)</TableHeaderColumn>

                    <TableHeaderColumn dataField="price" hidden={true}
                                       editable={{type: 'text'}}>Price</TableHeaderColumn>

                    <TableHeaderColumn dataField="currency" hidden={true}
                                       customInsertEditor={{getElement: this.customCurrencyField}}>Currency</TableHeaderColumn>

                    <TableHeaderColumn dataField="locality" hidden={true} editable={{type: 'text'}}
                                       dataAlign="center" dataSort>Address</TableHeaderColumn>

                    <TableHeaderColumn dataField="phone" hidden={true} editable={{type: 'text'}}
                                       dataAlign="center" dataSort>Phone</TableHeaderColumn>
                    <TableHeaderColumn width='100px'
                                       editable={{type: 'hidden'}}
                                       dataField='button'
                                       dataFormat={this.cellButton.bind(this)}
                    />

                </BootstrapTable>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {me: state.auth.me, user: state.system.data};
};

export default connect(mapStateToProps)(DataGrid);

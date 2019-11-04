import {connect} from "react-redux";
import 'react-dropzone-uploader/dist/styles.css';
import Dropzone from 'react-dropzone-uploader';
import React, {Component} from 'react';
import {getCategories, getCategoriesSelect} from "../../actions";
import cookie from 'browser-cookies';
import {EditorState, convertToRaw} from 'draft-js';
import {Editor} from 'react-draft-wysiwyg';
import axios from 'axios';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import $ from 'jquery';
import {Redirect} from 'react-router';
import Breadcrumbs from '../Breadcrumbs';

const API_URL = process.env.REACT_APP_API_URL;

//const STRAPI_URL = process.env.STRAPI_URL;

class NewAdd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editorState: EditorState.createEmpty(),
            me: props.me,
            local: cookie.get('local') || 'en',
            files: [],
            addressregion: cookie.get('local') || 'en',
            addressdetails: '',
            pageid: null,
            langs: props.langs,
            textArea: '',
            redirect: false,
            categoriesSelect: [],
            categories: [],
            subcategory: ''
        };
    }

    componentDidMount() {
        getCategories(cookie.get('local'))
            .then(cat => {
                console.log(cat);
                this.setState({categories: cat});
            })
            .catch(error => {
                this.setState({'error': error});
            });

        getCategoriesSelect(cookie.get('local'))
            .then(cat => {
                console.log('getCategoriesSelect');
                console.log(cat);
                this.setState({categoriesSelect: cat, local: cookie.get('local')});
            })
            .catch(error => {
                this.setState({'error': error});
            });

        $(".chb").change(function() {
            $(".chb").prop('checked', false);
            $(this).prop('checked', true);
        });
    }

    onEditorStateChange = (editorState) => {
        const blocks = convertToRaw(editorState.getCurrentContent()).blocks;
        const value = blocks.map(block => (!block.text.trim() && '\n') || block.text).join('\n');
        this.setState({
            editorState: editorState,
            textArea: value
        });
        this.validateText(value);
    };

    validateCategory = (name, buysell, subcat) => {
        let that = this;
        if (typeof $('input[name="category"]:checked', '#addAd').val() === 'undefined') {
            $('.categoryError').css("display", "block");
            $('.sumError').css("display", "block");

            return false;
        } else {
            if (name) {
                $('#catName').text(name);
            }
            $('.categoryError').css("display", "none");
            $('#catName').css("color", "#17a2b8");
            $('.sumError').css("display", "none");
            if (buysell) {
                $('#chbgroup').css("display", "block");
            } else {
                $('#chbgroup').css("display", "none");
            }
            if (subcat) {
                const subcatArr = subcat.split(',');
                let strHTML = `<div style="margin-left:40px"><h4>${this.state.langs.strings.subcategory}</h4>`;
                subcatArr.forEach((item, index) => {
                    strHTML +=
                        `<label class="nav-item"><input type="checkbox" name="subcat"  value="${item}" class="chbsub"/>&nbsp;&nbsp;${item}&nbsp;&nbsp;</label>`;
                });
                strHTML += '<br /><br /></div>';
                $('#subcat').html(strHTML);
                $(".chbsub").change(function() {
                    $(".chbsub").prop('checked', false);
                    $(this).prop('checked', true);
                    const subCategoryName = $('input[name="subcat"]:checked', '#addAd').val();
                    console.log(subCategoryName);
                    that.setState({subcategory: subCategoryName});
                });
            } else {
                $('#subcat').text('');
            }

            return true;
        }
    };

    validateTitle = () => {
        if ($('input[name="title"]', '#addAd').val() === '') {
            $('.titleError').css("display", "block");
            $('.sumError').css("display", "block");
            return false;
        } else {
            $('.titleError').css("display", "none");
            $('.sumError').css("display", "none");
            return true;
        }
    };

    validateText = (value) => {
        console.log('val ' + value);
        if (value.length < 5) {
            $('.textError').css("display", "block");
            $('.sumError').css("display", "block");
            return false;
        } else {
            $('.textError').css("display", "none");
            $('.sumError').css("display", "none");
            return true;
        }
    };

    handleClick = () => {
        console.log(this.validateCategory(null));
        console.log(this.validateTitle());
        console.log(this.validateText(this.state.textArea));
        if (this.validateCategory(null) && this.validateTitle() && this.validateText(this.state.textArea)) {
            const categoryName = $('input[name="category"]:checked', '#addAd').val();
            const subCategoryName = this.state.subcategory;
            const adType = $('input[name="type"]:checked', '#addAd').val();
            const adTitle = $('input[name="title"]', '#addAd').val();
            const region = $("#google-places-autocomplete-input").val();
            const address = $("#address").val();
            let that = this;
            axios.all([
                axios.get(`${API_URL}/categories`)
            ]).then(axios.spread((cats) => {
                cats.data.forEach(myFunction);
                let catId = '';
                let catUrl = '';

                function myFunction(item, index) {
                    if (item.name === categoryName) {
                        catId = item.id;
                        catUrl = item.url;
                        let ip = null;
                        if (typeof window.ip !== 'undefined') {
                            ip = window.ip;
                        }
                        var sendData = {
                            "local": that.state.local,
                            "ip": window.ip,
                            "title": adTitle,
                            "category": catId,
                            "category_title": categoryName,
                            "urlcategory": catUrl,
                            "subcategory": subCategoryName,
                            "type": adType,
                            "url": catUrl,
                            "text": that.state.textArea,
                            "images": "",
                            "donor_images": [
                                {}
                            ],
                            "donor": false,
                            "edited": false,
                            "author_name": that.state.me.username,
                            "author": that.state.me.id,
                            "phone": "string",
                            "addressregion": region,
                            "addressdetails": address,
                            "locality": '',
                            "localityurl": '',
                            "price": '',
                            "currency": '',
                            "views": "string",
                            "comment": "string",
                            "commenttype": "string",
                            "parsed": true,
                            "views": 0,
                            "likes": [],
                            "active": true
                        };
                        // var those = this
                        axios.post(`${API_URL}/pages`, sendData)
                            .then(function(response) {
                                console.log('----- > response');
                                console.log(response);
                                console.log('document.forms.length');
                                console.log(document.forms.length);
                                that.setState({pageid: response.data.id});
                                $(".dzu-submitButton").click();
                                setTimeout(() => {
                                    that.setState({redirect: true});
                                }, 500);
                            })
                            .then(function() {
                                setTimeout(() => {
                                    //  that.setState({redirect: true})
                                }, 1000);
                            })
                            .catch(function(error) {
                                console.log(error);
                            });
                    }
                }
            }));
        } else {
            console.log('not valid');
        }
        console.log(this.state);
    };

    render() {
        if (this.state.redirect) {
            console.log('redirect');
            return <Redirect to='/myads'/>;
        } else {
            console.log('no redirect');
        }
        if (cookie.get('local') !== this.state.local) {
            this.setState({local: cookie.get('local')});
            getCategoriesSelect(cookie.get('local'))
                .then(cat => {
                    console.log('getCategoriesSelect');
                    console.log(cat);
                    this.setState({categoriesSelect: cat});
                })
                .catch(error => {
                    this.setState({'error': error});
                });
        }
        return (
            <div>
                <div className="breadcrumbs">
                    <Breadcrumbs/>
                </div>
                <form id='imgForm' style={{display: "none"}}>
                    <input type="file" name="files"/>
                    <input type="text" name="ref" value="page"/>
                    <input type="text" name="refId" value={this.state.pageid}/>
                    <input type="text" name="field" value="images"/>
                    <input type="submit" id="imgUpload" value="Submit"/>
                </form>
                <form id='addAd'>
                    <div style={{height: '246px', overflow: 'scroll'}}><br/>
                        <h2><span className="badge badge-default">{this.state.langs.strings.categories}*</span>
                            <span
                                className="formError categoryError">required</span><span
                                id="catName"></span>
                        </h2>
                        <div>
                            <ul>
                                {this.state.categoriesSelect.map((route, index) => (
                                    <div key={index} style={{width: '150px', float: 'left'}} className="nav-item">
                                        <input type="radio" name="category" value={route.name}
                                               onClick={this.validateCategory.bind(this, route.name, route.buysell,
                                                   route.subcat
                                               )}/>&nbsp;
                                        <i className={route.icon}/>&nbsp;&nbsp;
                                        {route.name}
                                    </div>))}
                            </ul>
                        </div>
                    </div>
                    <div id='subcat'/>
                    <div id='chbgroup'>
                        <h4>&nbsp;&nbsp;{this.state.langs.strings.type}</h4>
                        <label><input type="checkbox" name="type" value="buy"
                                      className="chb"/>&nbsp;&nbsp;{this.state.langs.strings.buy}&nbsp;&nbsp;&nbsp;&nbsp;
                        </label>&nbsp;&nbsp;
                        <label><input type="checkbox" name="type" value="sell"
                                      className="chb"/>&nbsp;&nbsp;{this.state.langs.strings.sell}&nbsp;&nbsp;&nbsp;&nbsp;
                        </label>&nbsp;&nbsp;
                        <label><input type="checkbox" name="type" value="other"
                                      className="chb"/>&nbsp;&nbsp;{this.state.langs.strings.other}&nbsp;&nbsp;&nbsp;&nbsp;
                        </label>&nbsp;&nbsp;
                    </div>
                    <div>
                        <div><br/><br/>
                            <h2><span className="badge badge-default">{this.state.langs.strings.title}*</span>
                                <span
                                    className="formError titleError">required</span>
                            </h2>
                        </div>
                        <input type={'text'} onChange={this.validateTitle.bind(this)} name='title'
                               style={{width: '400px'}}/>
                    </div>
                    <div>
                        <div><br/><br/>
                            <h2><span className="badge badge-default">{this.state.langs.strings.text}*</span>
                                <span
                                    className="formError textError">required, min 50 chars</span>
                            </h2>
                        </div>
                        <Editor
                            //  editorState={EditorState}
                            toolbarClassName="toolbarClassName"
                            wrapperClassName="wrapperClassName"
                            editorClassName="editorClassName"
                            onEditorStateChange={this.onEditorStateChange}
                            toolbar={{
                                inline: {inDropdown: true},
                                list: {inDropdown: true},
                                textAlign: {inDropdown: true},
                                link: {inDropdown: true},
                                history: {inDropdown: true}
                            }}
                        />
                    </div>

                    <div><br/><br/>
                        <h2><span className="badge badge-default">{this.state.langs.strings.images}</span></h2>
                    </div>
                    <div style={{width: '100%', border: '5px dotted #d9d9d9', padding: '20px'}}>

                        <Dropzone
                            getUploadParams={() => ({url: 'https://httpbin.org/post'})} // specify upload params and url for your files
                            onChangeStatus={({meta, file}, status) => {
                                //console.log(status, meta, file)
                                /* console.log(status)
                                 console.log('--------------<<<! file !!>>>---------')
                                 console.log(file)*/
                            }}
                            onSubmit={(files, allFiles) => {
                                console.log(files);
                                // eslint-disable-next-line
                                this.state.files = files;
                                console.log('Dropzone');
                                console.log(files.map(f => f.meta));

                                const formElement = document.getElementById("imgForm");
                                var formData = new FormData(formElement);

                                this.state.files.map(f => {
                                    formData.append('files[]', f);
                                    return f.meta;
                                });

                                console.log('formData 0 files', this.state.files);

                                formElement.addEventListener('submit', (e) => {
                                    e.preventDefault();
                                    const request = new XMLHttpRequest();

                                    request.onreadystatechange = function() {
                                        console.log(request.responseText);
                                        if (request.readyState === 4 && request.status === 200) {
                                            console.log('success');
                                        }
                                    };
                                    console.log('formElement');
                                    console.log(formElement);

                                    var formData = new FormData(formElement);
                                    console.log('formData files', this.state.files);
                                    console.log('formData', formData);
                                    /*formData.append('files', this.state.files);*/
                                    this.state.files.map(f => {
                                        //formData.files.push(f)
                                        // let file =  new File([blob], "filename")
                                        formData.append('files', f.file);
                                        console.log('f.file');
                                        console.log(f.meta.previewUrl);
                                        console.log(f);
                                        return f.meta;
                                    });
                                    console.log('state', this.state);
                                    request.open('POST', 'https://vazoga.com:1337/upload');
                                    request.send(formData);
                                });

                                $("#imgUpload").click();
                                allFiles.forEach(f => f.remove());

                                return false;
                            }}
                            accept="image/*,audio/*,video/*"
                        />
                    </div>
                    <div>
                        <div>
                            <br/><br/>
                            <h2><span
                                className="badge badge-default">{this.state.address}{this.state.langs.strings.region}</span>
                            </h2>

                        </div>
                        <div>
                            <GooglePlacesAutocomplete initialValue={this.state.langs.strings.capital}
                                                      onSelect={console.log}/>
                        </div>
                    </div>
                    <div>
                        <div>
                            <br/><br/>
                            <h2><span
                                className="badge badge-default">{this.state.address}{this.state.langs.strings.address}</span>
                            </h2>

                        </div>
                        <div>
                            <textarea id='address' className="google-places-autocomplete__input"/>
                        </div>
                    </div>
                    <div>
                        <br/><br/>
                        <button onClick={this.handleClick} className="btn btn-primary" type="button">Save Ad</button>
                        <span
                            className="formError sumError">&nbsp;&nbsp;Check required fields&nbsp;&nbsp;&nbsp;&nbsp;</span><span
                        id="catName"></span>
                    </div>
                </form>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {authenticated: state.auth.authenticated, me: state.auth.me, langs: state.langs};
};

export default connect(mapStateToProps)(NewAdd);
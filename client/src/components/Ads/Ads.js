import React, {Component} from 'react';
import {connect} from 'react-redux';
import axios from 'axios';
import {getAd, getRelatedImgs, getComments, setLike, getLikes} from "../../actions";
import Gallery from 'react-photo-gallery';
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";
import CommentsBlock from 'simple-react-comments';

const STRAPI_URL = 'https://vazoga.com:1337';
const API_URL = process.env.REACT_APP_API_URL;

class Ads extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ad: null,
            adid: null,
            me: props.me,
            imgs: [],
            likes: [],
            categories: [],
            comments: [],
            langs: props.langs
        };
    }

    getAdData(props) {
        let id = props.match.params.id;
        this.setState({adid: id});
        getAd(id)
            .then(ad => {
                this.setState({ad});
            })
            .catch(error => {
                this.setState({'error': error});
            });
        getRelatedImgs(id)
            .then(imgs => {
                this.setState({imgs: imgs});
            })
            .catch(error => {
                this.setState({'error': error});
            });
        getComments(id)
            .then(comments => {
                this.setState({'comments': comments});
            })
            .catch(error => {
                this.setState({'error': error});
            });
        getLikes(id)
            .then(likes => {
                this.setState({likes});
            })
            .catch(error => {
                this.setState({'error': error});
            });
    }

    componentDidMount() {
        this.getAdData(this.props);
        axios.post(`${API_URL}/pages/incrementView`, {
            pageId: this.props.match.params.id
        }).then(function(response) {
            console.log('incrementView');
            console.log(response);
        });
    }

    changeLike = (adid, author) => {
        setLike(adid, author)
            .then(likes => {
                this.setState({likes});
            })
            .catch(error => {
                this.setState({'error': error});
            });
        return true;
    };

    GetAvatar = (thumb) => {
        if (!(thumb.indexOf('holder') + 1)) {
            return thumb;
        } else if (typeof this.state.me.imageSocial != 'undefined') {
            return this.state.me.imageSocial;
        } else {
            return thumb;
        }
    };

    getCategory = (category) => {
        category = category.substring(0, category.length - 1);
        let url = 'https://vazoga.com:3003/api/pages?filter=%7B%22where%22%3A%20%7B%22and%22%3A%20%5B%7B%22urlcategory%22%3A%20%22' +
                  category + '%22%7D%2C%20%7B%22tags%22%3A%20%22last%22%7D%5D%7D%7D';
        console.log(url);
        axios.all([
            axios.get(url)
        ]).then(axios.spread((resPages) => {
            console.log(resPages);
            let tblData = [];
            resPages.data.forEach((item) => {
                if (item.text !== 'pending') {
                    if (typeof item.donor_images[0] == 'string') {
                        item.imageUrl = item.donor_images[0];
                    } else {
                        item.imageUrl = 'https://dummyimage.com/160x160/000/fff.png&text=not+found';
                    }
                    item.text = item.text = item.text.replace(/(<([^>]+)>)/ig, "");
                    tblData.push(item);
                }
            });
            console.log(tblData);
            this.setState({tblData});
        }));
        this.setState({showMe: category});
    };

    render() {

        const GetImages = (props) => {
            console.log('this.state.imgs.length');
            console.log(this.state.imgs.length);
            if (this.state.imgs.length) {
                const images = [];
                this.state.imgs.forEach(function(element, index) {
                    let item = {};
                    item.original = `${STRAPI_URL}` + element.url;
                    item.thumbnail = `${STRAPI_URL}` + element.url;
                    images.push(item);
                });
                console.log('this.state.imgs.length 1');
                return <ImageGallery items={images}/>;

            } else if (props.ad && props.ad.donor_images.length > 1) {
                /*   props.ad.donor_images.forEach((src) => {
                       let item = {}
                       item.src = src
                       /!* item.width = 1
                        item.height = 1*!/
                       PHOTO_SET.push(item)
                   })*/
                let PHOTO_SET = [];

                props.ad.donor_images.forEach((src) => {
                    let item = {};
                    item.src = src;
                    /* item.width = 1
                     item.height = 1*/
                    PHOTO_SET.push(item);
                });

                //todo : get from
                console.log('this.state.imgs.length 2');
                console.log(props.ad);
                console.log(props.ad.donor_images);
                return <Gallery photos={PHOTO_SET}/>;
                //  return  <ImageGallery items={images} />
            } else {
                console.log('this.state.imgs.length 3');
                return <div/>;
            }
        };

        const GetLike = (props) => {
            if (props.ad) {
                let icon = "fa fa-heart-o";
                if (typeof this.state.me !== 'undefined') {
                    if (this.state.likes.includes(this.state.me.id)) {
                        icon = "fa fa-heart";
                    }
                    return <div>
                        <i className={icon} style={{cursor: 'pointer'}}
                           onClick={this.changeLike.bind(props.that, props.ad.id, this.state.me.id)}/>
                        {this.state.likes.length === 0 ? '' : ' ' + this.state.likes.length}
                    </div>;
                } else {
                    return <div>
                        <i className="fa fa-heart"/>
                        {this.state.likes.length === 0 ? '' : ' ' + this.state.likes.length}
                    </div>;
                }

            } else {
                return <div/>;
            }
        };

        const GetTitle = (props) => {
            if (props.ad) {
                return <h1>{props.ad.title}</h1>;
            } else {
                return <div/>;
            }
        };

        const GetText = (props) => {
            if (props.ad) {
                return <h5>{props.ad.text}</h5>;
            } else {
                return <div/>;
            }
        };

        const RegionLink = (props) => {
            console.log(props);
            if (typeof props.addressregion != 'undefined' && props.addressregion !== '') {
                return <span><br/><span className="label-ad">region:</span> {props.addressregion}</span>;
            } else {
                return <span/>;
            }
        };

        const AdType = (props) => {
            console.log(props);
            if (typeof props.type != 'undefined' && props.type !== '') {
                return <span><br/><span
                    className="label-ad">{this.state.langs.strings.type}:</span> {props.type}</span>;
            } else {
                return <span/>;
            }
        };

        const SubCategory = (props) => {
            console.log(props);
            if (typeof props.subcategory != 'undefined' && props.subcategory !== '') {
                return <span><br/><span
                    className="label-ad">{this.state.langs.strings.subcategory}:</span> {props.subcategory}</span>;
            } else {
                return <span/>;
            }
        };

        const AddressDetails = (props) => {
            console.log(props);
            if (typeof props.addressdetails != 'undefined' && props.addressdetails !== '') {
                return <span><br/><span
                    className="label-ad">{this.state.langs.strings.address}:</span> {props.addressdetails}</span>;
            } else {
                return <span/>;
            }
        };

        const Author = (props) => {
            console.log(props);
            if (typeof props.author != 'undefined' && props.author !== '') {
                return <span><br/><span
                    className="label-ad">{this.state.langs.strings.author}:</span> {props.author}</span>;
            } else {
                return <span/>;
            }
        };

        /*const GetPrice = (props) => {
            if (props.price !== '') {
                return <span><br/><span className="label-ad">price:</span> {props.price}{props.currency}</span>;
            } else {
                return <span/>
            }
        }*/

        const GetDesc = (props) => {
            //return(<Gallery images={IMAGES}/>,)
            /*     console.log('props.rowData')
            console.log(props.rowData)*/

            if (props.ad) {
                return (
                    <div>
                        {/*<br/><span className="label-ad">author:</span> {props.ad.author}*/}
                        {/*<br/><span className="label-ad">phone:</span> {props.ad.phone}*/}

                        <AdType
                            type={props.ad.type}/>
                        <SubCategory
                            subcategory={props.ad.subcategory}/>
                        <RegionLink
                            addressregion={props.ad.addressregion}/>
                        <AddressDetails
                            addressdetails={props.ad.addressdetails}/>
                        <Author
                            author={props.ad.author_name}/>
                        {/*   <GetPrice
                            price={props.ad.price}
                            currency={props.ad.currency}/>*/}

                        {/* <BaseProductTblPriceComponent rowData={props.rowData}/>
                        <br/><span className="label-ad">source:</span> <SourceLink rowData={props.rowData}/>*/}
                    </div>

                );
            } else {
                return <div/>;
            }
        };

        return <section className="container">
            <div className="row justify-content-center">

                <main role="main" className="col-md-12 ml-sm-auto col-lg-12 px-4">
                    <div className="col-md-12">
                        <br/>
                        <div><GetTitle ad={this.state.ad}/></div>
                        <div><GetImages ad={this.state.ad}/></div>
                        <div><GetText ad={this.state.ad}/></div>
                        <div><GetDesc ad={this.state.ad}/></div>
                    </div>
                </main>
                <GetLike ad={this.state.ad} that={this}/>&nbsp;&nbsp;&nbsp;&nbsp;
                {/*    renderAvatar() {//this.state.me && this.state.me.image
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
            }*/}
                <CommentsBlock
                    comments={this.state.comments}
                    signinUrl={'/signin'}
                    isLoggedIn={this.state.me}
                    reactRouter // set to true if you are using react-router
                    onSubmit={text => {
                        if (text.length > 0) {
                            const sendData = {
                                ad: 'comment_' + this.state.adid,
                                authorUrl: '/' + this.state.me.username,
                                avatarUrl: this.GetAvatar(this.state.me.image.thumb),
                                createdAt: new Date(),
                                fullName: this.state.me.username,
                                text
                            };
                            this.setState({
                                comments: [
                                    ...this.state.comments,
                                    sendData
                                ]
                            });
                            console.log('submit:', text);
                            axios.post(`${API_URL}/comments`, sendData)
                                .then(function(response) {
                                    console.log('response');
                                    console.log(response);
                                })
                                .catch(function(error) {
                                    console.log(error);
                                });
                        }
                    }}
                />
            </div>
        </section>;
    }
}

const mapStateToProps = (state) => {
    return {me: state.auth.me, langs: state.langs};
};

export default connect(mapStateToProps)(Ads);


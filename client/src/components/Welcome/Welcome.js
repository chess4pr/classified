import React, {Component} from 'react';
import axios from 'axios';
import ProductsTblPage from 'react-sort-search-table';
import {PropTypes} from 'prop-types';
import ReactDOM from 'react-dom';
import {getCategories, getPopularCategories, getLastAds} from "../../actions";
import {Link} from 'react-router-dom';
import ImageLoader from 'react-imageloader';
import cookie from 'browser-cookies';
import './Welcome.css';
import {connect} from 'react-redux';
import $ from 'jquery';

const API_URL = process.env.REACT_APP_API_URL;
//const FILE_URL = process.env.REACT_APP_FILE_URL;
//const STRAPI_URL = process.env.STRAPI_URL;
const STRAPI_URL = 'https://vazoga.com:1337';

React.PropTypes = PropTypes;

class Welcome extends Component {
    constructor(props) {
        super(props);
        // const {cookies} = props;
        this.state = {
            me: props.me,
            messageList: [],
            local: cookie.get('local') || 'en',
            count: 0,
            currentCat: 'zvirata',
            subCategories: [],
            screen: 0,
            categories: [],
            popularCategories: [],
            pages: [],
            showMe: 'Tell Me More',
            tblData: [],
            tblDataFull: [],
            pagesPendinCount: 0,
            tHead: [
                null,
                null,
                "Views",
                "Likes"
            ],
            warning: cookie.get('warning') || '1',
            lastAds: [],
            langs: props.langs,
            col: [
                "imageUrl",
                "desc",
                "views",
                "likes"

            ]
        };
    }

    componentDidMount() {
        getLastAds(this.state.local)
            .then(lastAds => {
                this.setState({lastAds: lastAds});
            })
            .catch(error => {
                this.setState({'error': error});
            });

        getPopularCategories(cookie.get('local'))
            .then(cat => {
                this.setState({popularCategories: cat.slice(0, 3)});
            })
            .catch(error => {
                this.setState({'error': error});
            });

        getCategories(cookie.get('local'))
            .then(cat => {
                console.log('----------------------->>>');
                console.log(cat);
                this.setState({categories: cat});
                setTimeout(() => {
                    /*$('a').click(function (e) {
                        e.preventDefault();
                    });*/
                }, 500);
            })
            .catch(error => {
                this.setState({'error': error});
            });

        const category = '';
        axios.all([
            /**
             * ${API_URL}/pages?filter[order]=createdAt%20ASC
             * --------------------Count----------------------*/

            axios.get(`${API_URL}/pages/count`),

            /**
             * --------------------Pages----------------------*/

            //${API_URL}/pages?filter[where][tags]=author&filter[limit]=1&filter[order]=id%20DESC
            axios.get(`${API_URL}/pages?filter[where][parsed]=true&filter[limit]=4&filter[order]=id%20DESC`),

            /**
             * --------------------Pending----------------------*/

            axios.get(`${API_URL}/pages/pendingList`),

            /**
             * --------------------Images----------------------*/

            axios.get(`${API_URL}/upload_files`)
        ]).then(axios.spread((resCount, resPages, resPagesPending, images) => {
            console.log('resCount');
            console.log(resCount);
            console.log('resPages');
            console.log(resPages);

            const count = resCount.data.count;
            this.setState({count});
            const pagesPendinCount = resPagesPending.data.urls.length;
            this.setState({pagesPendinCount});
            let tblData = [];

            /**
             * -------------------- resPages ----------------------*/

            resPages.data.forEach((item) => {
                if (item.text !== 'pending') {
                    if (typeof item.likes !== 'undefined' && item.likes.length) {
                        item.likes = item.likes.length;
                    } else {
                        item.likes = '';
                    }
                    if (typeof item.donor_images[0] == 'string') {
                        item.imageUrl = item.donor_images[0];
                    } else if (images.data.length) {
                        let returnSome = '';
                        /*eslint-disable-next-line*/
                        images.data.map((itemImg) => {
                            // console.log('item.id')
                            // console.log(item.id)
                            if (typeof itemImg.related[0] !== 'undefined' && item.id === itemImg.related[0].ref) {
                                console.log(`${STRAPI_URL}${itemImg.url}`);
                                item.imageUrl = `${STRAPI_URL}${itemImg.url}`;
                            } else {
                                // console.log('-----')
                            }
                        });
                        console.log(returnSome);
                    } else {
                        item.imageUrl = 'https://dummyimage.com/160x160/000/fff.png&text=not+found';
                    }
                    item.text = item.text.replace(/(<([^>]+)>)/ig, "");
                    tblData.push(item);
                }
            });

            this.setState({tblData});
        }));
        this.setState({showMe: category});
        //  }
    }

    getCategoryFilter = (cursubcat) => {
        let tblData = [];
        this.state.tblDataFull.forEach((item) => {
            if (item.subcategory === cursubcat) {
                tblData.push(item);
            }
        });
        this.setState({tblData});
    };

    getScreenHome = () => {
        this.setState({screen: 0});
    };

    handleClick = (row) => {
        axios.post(`${API_URL}/pages/incrementView`, {
            pageId: row.id
        }).then(function(response) {
            console.log('incrementView');
            console.log(response);
        });
        console.log(row);
    };

    sendMessageClick = (authorid, authorname) => {
        console.log(authorid, authorname);
        cookie.set('author', authorid + ',' + authorname, {path: '/'});
    };

    getCategory = (category, subcategories) => {
        console.log('>>' + category + '<<');
        this.setState({currentCat: category});
        if (subcategories) {
            const subcat = subcategories.split(',');
            this.setState({subCategories: subcat});
        }
        let url = `${API_URL}/pages?filter[where][active]=true&filter[where][category_title]=${category}&filter[where][local]=${cookie.get(
            'local')}&filter[limit]=1000&filter[order]=id%20DESC`;
        axios.all([
            axios.get(url),
            axios.get(`${API_URL}/upload_files`)
        ]).then(axios.spread((resPages, images) => {
            console.log(resPages);
            let tblData = [];
            resPages.data.forEach((item) => {
                if (typeof item.likes !== 'undefined' && item.likes.length) {
                    item.likes = item.likes.length;
                } else {
                    item.likes = '';
                }
                if (item.text !== 'pending') {
                    if (typeof item.donor_images[0] == 'string') {
                        item.imageUrl = item.donor_images[0];
                    } else {
                        if (images.data.length) {
                            console.log('imgs length');
                            let returnSome = images.data.map((itemImg) => {
                                if (typeof itemImg.related[0] !== 'undefined') {
                                    if (item.id === itemImg.related[0].ref) {
                                        item.imageUrl = `${STRAPI_URL}${itemImg.url}`;
                                        console.log('img');
                                        console.log(`${STRAPI_URL}${itemImg.url}`);
                                    }
                                }
                                return itemImg;

                            });
                            console.log(returnSome);
                        }
                    }
                    item.text = item.text = item.text.replace(/(<([^>]+)>)/ig, "");
                    tblData.push(item);
                }
            });
            console.log(tblData);
            this.setState({screen: 1});
            this.setState({tblData});
            const tblDataFull = tblData;
            this.setState({tblDataFull});

            setTimeout(() => {
                $('.fa-sort').css("display", "none");
                ;
            }, 200);
        }));
        this.setState({showMe: category});
    };

    hideAlert() {
        this.setState({
            warning: '0'
        });
        // const { cookies } = this.props;
        cookie.set('warning', '0', {path: '/'});
    }

    render() {
        const BaseProductAddComponent = () => {
            function AddButton(props) {
                if (typeof props.me != 'undefined' && props.me !== false) {
                    return <Link className="nav-link active" to='/newad'><input type="button" className="btn btn-info"
                                                                                value="Add ad"/></Link>;
                }
                return <div/>;
            }

            return (
                <AddButton me={this.props.me}/>
            );
        };

        function ProductTblImgpreloader() {
            return <div className="loading-div" style={{minHeight: "100px"}}/>;
        }

        const TblImageLoader = (props) => (
            <ImageLoader
                src={props.data}
                wrapper={ReactDOM.div}
                preloader={ProductTblImgpreloader}>NOT FOUND
            </ImageLoader>);

        TblImageLoader.propTypes = {
            data: React.PropTypes.string
        };

        const BaseProductTblImageComponent = (props) => {
            return (
                <td style={{width: '120px', minWidth: '120px', backgroundColor: '#fff'}}>
                    <TblImageLoader data={props.rowData.imageUrl}/>
                </td>
            );
        };

        BaseProductTblImageComponent.propTypes = {
            rowData: React.PropTypes.object,
            tdData: React.PropTypes.string
        };

        function CategoryCount(props) {
            if (props.found !== 'undefined') {
                return <span className="badge badge-light">{props.found}</span>;
            } else {
                return <span></span>;
            }
        }

        function SubCategoryLink(props) {
            // eslint-disable-next-line
            return <a onClick={props.that.getCategoryFilter.bind(props.that, props.name)}>
                <div value={props.name} className='nopadding' style={{padding: '0 8px 0 8px'}}>
                    {props.name}
                </div>
            </a>;
        }

        function BreadCrumbsLink(props) {
            // eslint-disable-next-line
            return <div className="breadcrumbs" style={{fontSize: '1rem'}}>
                <span style={{color: '#00bdc8', cursor: 'pointer'}} onClick={props.that.getScreenHome.bind()}>{props.that.state.langs.strings.home}</span> <span
                style={{color: '#00bdc8', cursor: 'pointer'}}>/ {props.that.state.currentCat}</span>
            </div>;
        }

        function CategoryLink(props) {
            if (props.route.desc.length === 2) {
                return <div>
                    <div value={props.route.name} className='nopadding'
                         onClick={props.that.getCategory.bind(props.that, props.route.realname[0],
                             props.route.subcategory
                         )}>
                        <i className={props.route.icon}/> {props.route.realname[0]}
                        <CategoryCount found={props.route.found[0]}/>
                    </div>

                    <div value={props.route.name} className='nopadding'
                         onClick={props.that.getCategory.bind(props.that, props.route.realname[1],
                             props.route.subcategory
                         )}>
                        &nbsp;&nbsp;&nbsp;&nbsp;{props.route.realname[1]} &nbsp;
                        <CategoryCount found={props.route.found[1]}/>
                    </div>
                </div>;
            } else {
                return <div>

                    <div value={props.route.name} className='nopadding'
                         onClick={props.that.getCategory.bind(props.that, props.route.realname[0],
                             props.route.subcategory
                         )}>
                        <i className={props.route.icon}/> {props.route.realname[0]}
                        <CategoryCount found={props.route.found[0]}/>
                    </div>
                </div>;
            }
        }

        function CategoryTopAdsLink(props) {
            return <div><b>
                <a value={props.realname} href="#welcome"
                   onClick={props.that.getCategory.bind(props.that, props.realname, null)}>{props.realname}</a>
            </b>
            </div>;
        }

        function CategoryTopLink(props) {
            return <div>
                <a value={props.realname} className='btn btn-primary' href="#welcome"
                   onClick={props.that.getCategory.bind(props.that, props.realname, null)}>
                    &nbsp; Go to {props.realname} &nbsp;
                </a>
            </div>;
        }

        function MessageLink(props) {
            if (props.that.state.me && props.that.state.me !== 'undefined' &&
                props.rowData.author !== props.that.state.me.id) {

                return <div
                    onClick={props.that.sendMessageClick.bind(props.that, props.rowData.author,
                        props.rowData.author_name
                    )}>
                    <Link className="nav-link active"
                          to='/messages'>{props.that.state.langs.strings.sendMessage} {props.rowData.author_name}</Link>
                </div>;
            } else {
                return <div/>;
            }
        }

        const BaseProductTblTextComponent = (props) => {
            if (props.rowData.donor) {
                let url = '';
                if (props.rowData.local === 'cz') {
                    url = props.rowData.urlcategory + props.rowData.url;
                } else if (props.rowData.local === 'it') {
                    if (typeof props.ad !== 'undefined') {
                        url = props.ad.url;
                    } else {
                        url = props.rowData.url;
                    }
                }
                return (
                    <td>
                        <h5><a href='/#welcome'
                               onClick={this.getCategoryFilter.bind(props.that,
                                   props.rowData.subcategory
                               )}>{props.rowData.subcategory}</a>&nbsp;|&nbsp;
                            {/*eslint-disable-next-line*/}
                            <a href={props.rowData.url} onClick={this.handleClick.bind(props.that, props.rowData)}
                               target="_blank">{props.rowData.title}</a>
                        </h5>
                        {props.rowData.text.substring(0, 150)}...&nbsp;
                        {/*eslint-disable-next-line*/}
                        <a href={props.rowData.url} onClick={this.handleClick.bind(props.that, props.rowData)}
                           target="_blank">more</a>
                    </td>
                );
            } else {
                return (
                    <td>{/*eslint-disable-next-line*/}
                        <h5><a href='#'
                               onClick={this.getCategoryFilter.bind(props.that,
                                   props.rowData.subcategory
                               )}>{props.rowData.subcategory}</a>&nbsp;|&nbsp;
                            <a
                                href={'ads/' + props.rowData.id}>{props.rowData.title}</a></h5>
                        {props.rowData.text.substring(0, 150)}...&nbsp;<a
                            href={'ads/' + props.rowData.id}>{this.state.langs.strings.more}</a>
                        <br/>
                        <MessageLink rowData={props.rowData} that={this}/>
                    </td>
                );
            }
        };

        BaseProductTblTextComponent.propTypes = {
            rowData: React.PropTypes.object,
            tdData: React.PropTypes.string
        };
        if (this.state.screen) {
            return <React.Fragment>
                <section id="about" className="container">
                    <div className="row justify-content-center">
                        <nav className="col-md-2 d-none d-md-block border-right sidebar">
                            <div className="sidebar-sticky">
                                <BaseProductAddComponent/>
                                {/*<h5 className="text-muted"> Records : {this.state.count} <br/>
                                    Parsed
                                    : {this.state.count - this.state.pagesPendinCount}</h5>*/}
                                <ul className="nav flex-column">
                                    {this.state.categories.map((route, index) => (
                                        <li key={index} className="nav-item">
                                            <CategoryLink that={this} route={route}/>
                                        </li>))}
                                </ul>
                            </div>
                        </nav>
                        <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4">
                            <div className="col-md-12">
                                <div style={{width: '500px'}}>
                                    <br/>
                                    {/*Failed prop type: You provided a `checked` prop to a form field without an `onChange` handler. This will render a read-only field.*/}
                                    {/*<div id='chbgroupWelcome'>
                                        <span><input type="checkbox" name="buy" value="buy" checked
                                                     className="chbgroup"/>&nbsp;&nbsp;{this.state.langs.strings.buy}&nbsp;&nbsp;&nbsp;&nbsp;
                                        </span>
                                        &nbsp;&nbsp;
                                        <span><input type="checkbox" name="sell" value="sell" checked
                                                     className="chbgroup"/>&nbsp;&nbsp;{this.state.langs.strings.sell}&nbsp;&nbsp;&nbsp;&nbsp;
                                        </span>
                                        &nbsp;&nbsp;
                                        <span><input type="checkbox" name="other" value="other" checked
                                                     className="chbgroup"/>&nbsp;&nbsp;{this.state.langs.strings.other}&nbsp;&nbsp;&nbsp;&nbsp;
                                        </span>
                                        &nbsp;&nbsp;
                                    </div>
                                    */}
                                    <hr/>
                                </div>
                                <BreadCrumbsLink that={this}/>
                                {this.state.subCategories.map((name, index) => (
                                    <div key={index} className="nav-item" style={{float: 'left'}}>
                                        {/*onClick={props.that.getCategory.bind(props.that, props.realname, null, null)}*/}
                                        <SubCategoryLink that={this} name={name}/>
                                    </div>))}
                                {/*{<pre style={{height:'100px'}}>{JSON.stringify(this.state.tblData)}</pre>}*/}
                                <ProductsTblPage tblData={this.state.tblData}
                                                 tHead={this.state.tHead}
                                                 customTd={[
                                                     {custd: BaseProductTblImageComponent, keyItem: "imageUrl"},
                                                     {custd: BaseProductTblTextComponent, keyItem: "desc"}

                                                 ]}
                                                 defaultCSS={false}
                                                 defaultRowsPerPage={20}
                                                 dKey={this.state.col}
                                                 search={true}/>

                            </div>
                        </main>
                    </div>
                </section>
            </React.Fragment>;
        } else {
            return <React.Fragment>
                <section id="about" className="container">
                    <div className="row justify-content-center">
                        <nav className="col-md-2 d-none d-md-block border-right sidebar">
                            <div className="sidebar-sticky">
                                <BaseProductAddComponent/>
                                <ul className="nav flex-column">
                                    {this.state.categories.map((route, index) => (
                                        < li key={index} className="nav-item">
                                            <CategoryLink that={this} route={route}/>
                                        </li>))}
                                </ul>
                            </div>
                        </nav>
                        <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">{this.state.langs.strings.topCategories}</h5>
                                        {this.state.popularCategories.map((cat, index) => (
                                            <div key={index} className="card"
                                                 style={{float: 'left', width: '200px', margin: '4px'}}>
                                                {/* <img class="card-img-top" src="..." alt="Card image cap" />*/}
                                                <div className="card-body">
                                                    <h1 className="card-title">{cat[1]}</h1>
                                                    <p className="card-text">{(index + 1) + ' place (' + cat[0] +
                                                                              ' topics)'}</p>
                                                    <CategoryTopLink that={this} realname={cat[1]}/>
                                                </div>
                                            </div>))
                                        }
                                    </div>
                                </div>
                                <br/>
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">{this.state.langs.strings.lastAds}</h5>

                                        <div className="span11" style={{overflow: 'auto'}}>
                                            <div className="row-fluid">

                                                {this.state.lastAds.map((item, index) => (
                                                    <div key={index} className="col-lg-3 card"
                                                         style={{width: '200px', margin: '4px 2px 14px 2px'}}>

                                                        <div className="card-body">
                                                            <CategoryTopAdsLink that={this}
                                                                                realname={item.category_title}/>
                                                            <a href={'ads/' + item.id}>{item.title.substr(0, 10)}</a>

                                                            <p className="card-text">{item.text.substr(0, 10) +
                                                                                      '...'}</p>
                                                            <a href={'/' + item.author_name}>{item.author_name}</a>
                                                        </div>
                                                    </div>))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </main>
                    </div>
                </section>

            </React.Fragment>;
        }
    }
}

const mapStateToProps = (state) => {
    return {authenticated: state.auth.authenticated, me: state.auth.me, langs: state.langs, local: state.local};
};

export default connect(mapStateToProps)(Welcome);



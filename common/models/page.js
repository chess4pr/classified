'use strict';

try {
    var Spooky = require('spooky');
} catch (e) {
    var Spooky = require('../lib/spooky');
}

module.exports = function (Page) {
    Page.incrementLike = function (pageId, author, cb) {
        Page
            .findOne({where: {id: pageId}}, function (err, res) {
                if (err) {
                    console.log(err);
                }
                if (res !== null) {
                    if (typeof res.likes === 'undefined') {
                        res.likes = [author]
                    } else {
                        res.likes.push(author)
                    }
                    res.updateAttributes({"likes": res.likes}, function (err, res) {
                        if (err) {
                            console.log(err);
                        }
                        cb(null, res.likes);
                    })
                }
            });
    }

    Page.remoteMethod('incrementLike', {
        accepts: [{arg: 'pageId', type: 'string'}, {arg: 'author', type: 'string'}],
        returns: {arg: 'done', type: 'array'}
    });

    Page.decrementLike = function (pageId, author, cb) {
        Page
            .findOne({where: {id: pageId}}, function (err, res) {
                if (err) {
                    console.log(err);
                }
                if (res !== null) {
                    let filtered = res.likes.filter(function (value, index, arr) {
                        return value !== author;
                    });
                    res.updateAttributes({"likes": filtered}, function (err, res) {
                        if (err) {
                            console.log(err);
                        }
                        cb(null, res.likes);
                    })
                }
            });
    }

    Page.remoteMethod('decrementLike', {
        accepts: [{arg: 'pageId', type: 'string'}, {arg: 'author', type: 'string'}],
        returns: {arg: 'done', type: 'array'}
    });

    Page.incrementView = function (pageId, cb) {
        Page
            .findOne({where: {id: pageId}}, function (err, res) {
                if (err) {
                    console.log(err);
                }
                if (res !== null) {
                    if (res.views === '' || isNaN(res.views)) {
                        res.views = 0
                    }
                    console.log('res.views', res.views)
                    res.views = res.views / 1 + 1
                    res.updateAttributes({"views": res.views}, function (err, res) {
                        if (err) {
                            console.log(err);
                        }
                        cb(null, true);
                    })
                }
            });
    }

    Page.remoteMethod('incrementView', {
        accepts: {arg: 'pageId', type: 'string'},
        returns: {arg: 'done', type: 'boolean'}
    });

    Page.getAdvertDetails = function (url, cb) {
        console.log('__________getAdvertDetails___________');

        console.log(url)

        let res = url.split("|||")
        let pageId = res[0]
        url = res[1]

        var spooky = new Spooky({
            child: {
                //transport: 'http'
            },
            casper: {
                logLevel: 'debug',
                clientScripts: ["/var/www/parser/server/jquery.min.js"],
                verbose: true
            },
            cb: cb
        }, function (err) {
            if (err) {
                console.log(err)
                let e = new Error('Failed to initialize SpookyJS');
                e.details = err;
                throw e;
            }
            let imgPath = '/var/www/parser/client/public/images/';
            console.log('url')
            console.log(url)
            // url = 'https://sport.bazos.cz/inzerat/105820564/MaO.php'
            spooky.start(url);


            let cz = url.search(".cz") + 1;
            let fr = url.search(".fr") + 1;
            let it = url.search(".it") + 1;
            let local = 'undefined'
            if (cz) {
                spooky.then([{imgPath: imgPath, url: url, x: 100, y: 100}, function () {
                    this.wait(5000, function () {
                        this.then(function () {
                            //this.captureSelector(this.imgPath + "page.png", "html");

                            var result = this.evaluate(function () {
                                return $("div.popis").html();
                            });

                            var subcat = this.evaluate(function () {
                                return $("#zvyraznenikat").html();
                            });

                            this.emit('getAdvertDescCz', result + '|||' + subcat);
                        })
                        this.then(function () {
                            var result = this.evaluate(function () {
                                return $("td.listadvlevo").html();
                            });

                            this.emit('getAdvertMoreDescCz', result);
                        })
                        this.then(function () {
                            var result = this.evaluate(function () {
                                var images = $(".flinavigace").find('img');

                                return Array.prototype.map.call(images, function (e) {
                                    return e.getAttribute('src');
                                });
                            });

                            this.emit('getAdvertImgsCz', result);
                        });
                    });
                }]);

                spooky.on('getAdvertDescCz', function (textandsubcat) {
                    console.log('__________getAdvertDesc___________');
                    console.log(textandsubcat);
                    const arr = textandsubcat.split('|||')

                    const text = arr[0]
                    const subcat = arr[1]

                    if (text !== null) {
                        Page
                            .findOne({where: {id: pageId}}, function (err, res) {
                                if (err) {
                                    console.log(err);
                                }
                                if (res !== null) {
                                    res.updateAttributes({"text": text, "subcategory": subcat}, function (err, res) {
                                        if (err) {
                                            console.log(err);
                                        }
                                        console.log(res);
                                    })
                                }
                            });
                    } else {
                        console.log('pageId ' + pageId + ' disable');
                        Page
                            .findOne({where: {id: pageId}}, function (err, res) {
                                if (err) {
                                    console.log(err);
                                }
                                if (res !== null) {
                                    res.updateAttributes({"active": false}, function (err, res) {
                                        if (err) {
                                            console.log(err);
                                        }
                                        console.log(res);
                                    })
                                }
                            });
                    }
                });

                spooky.on('getAdvertMoreDescCz', function (text) {
                    console.log('__________getAdvertMoreDesc___________');
                    let name = /jmeno=(.*?)\"/.exec(text)
                    console.log('name')
                    const nameDb = name[1]

                    console.log(nameDb)
                    console.log(typeof nameDb)

                    let phone = /telefon=(.*?)&amp/.exec(text)
                    console.log('phone')
                    const phoneDb = phone[1]

                    console.log(phoneDb)
                    console.log(typeof phoneDb)

                    let price = /b>(.*?)Kč</.exec(text)
                    console.log('price')
                    let priceDb = price[1]
                    if (!priceDb) {
                        priceDb = 'NaN'
                    }

                    console.log(priceDb)
                    console.log(typeof priceDb)

                    let location = /lokalita" rel="nofollow">(.*?)</.exec(text)
                    console.log('location')
                    const locationDb = location[1]

                    console.log(locationDb)
                    console.log(typeof locationDb)

                    let locationurl = /place\/(.*?)\"/.exec(text)
                    console.log('location')
                    const locationurlDb = 'https://www.google.com/maps/place/' + locationurl[1]

                    console.log(locationurlDb)
                    console.log(typeof locationurlDb)

                    Page
                        .findOne({where: {id: pageId}}, function (err, res) {
                            if (err) {
                                console.log(err);
                            }
                            if (res !== null) {
                                res.updateAttributes({
                                    "author_name": nameDb,
                                    "phone": phoneDb,
                                    "price": priceDb,
                                    "currency": 'kč',
                                    "locality": locationDb,
                                    "localityurl": locationurlDb,
                                    "parsed": true
                                }, function (err, res) {
                                    if (err) {
                                        console.log(err);
                                    }
                                })
                            }
                        });
                });

                spooky.on('getAdvertImgsCz', function (images) {
                    console.log('__________getAdvertImgs___________');

                    Page
                        .findOne({where: {id: pageId}}, function (err, res) {
                            if (err) {
                                console.log(err);
                            }
                            if (res !== null) {
                                res.updateAttributes({"donor_images": images, "active": true}, function (err, res) {
                                    if (err) {
                                        console.log(err);
                                    }
                                    console.log(images);
                                    spooky.options.cb(null, true);
                                })
                            }
                        });
                });
            }

            if (it) {
                console.log('it')
                spooky.then([{imgPath: imgPath, url: url, x: 100, y: 100}, function () {
                    this.wait(5000, function () {
                        this.then(function () {
                            var result = this.evaluate(function () {
                                return $(".description").html();
                            });
                            this.emit('getAdvertDescIt', result);
                        })
                        this.then(function () {
                            var result = this.evaluate(function () {
                                var subcat = $(".feature").find('.value').html();
                                var breadcrumbs = $(".breadcrumbs-container").html();

                                if (breadcrumbs.indexOf('vendita') + 1) {
                                    var adType = 'sell'
                                } else if (breadcrumbs.indexOf('compra') + 1) {
                                    var adType = 'buy'
                                } else {
                                    var adType = 'other'
                                }

                                return subcat + ':::' + adType
                            });

                            this.emit('getAdvertMoreDescIt', result);
                        })
                        this.then(function () {
                            var result = this.evaluate(function () {
                                var images = $(".carousel").find('img');
                                return Array.prototype.map.call(images, function (e) {
                                    return e.getAttribute('src')
                                });
                            });

                            this.emit('getAdvertImgsIt', result);
                        });
                    });
                }]);

                spooky.on('getAdvertDescIt', function (text) {
                    console.log('__________getAdvertDescIt___________');

                    if (text !== null) {
                        Page
                            .findOne({where: {id: pageId}}, function (err, res) {
                                if (err) {
                                    console.log(err);
                                }
                                if (res !== null) {
                                    res.updateAttributes({"text": text}, function (err, res) {
                                        if (err) {
                                            console.log(err);
                                        }
                                        console.log(res);
                                    })
                                }
                            });
                    } else {
                        console.log('pageId ' + pageId + ' disable');
                        Page
                            .findOne({where: {id: pageId}}, function (err, res) {
                                if (err) {
                                    console.log(err);
                                }
                                if (res !== null) {
                                    res.updateAttributes({"active": false}, function (err, res) {
                                        if (err) {
                                            console.log(err);
                                        }
                                        console.log(res);
                                    })
                                }
                            });
                    }
                });

                spooky.on('getAdvertMoreDescIt', function (detailsArr) {
                    //feature
                    console.log('detailsArr')
                    console.log(detailsArr)
                    let authorAndPnone = detailsArr.split(':::');
                    let author = ''
                    let phone = ''
                    let subcat = authorAndPnone[0];
                    let type = authorAndPnone[1];
                    let price = 0
                    let currency = ''
                    let placeit = 0

                    if (subcat === 'undefined') {
                        subcat = 'Altro'
                    }

                    Page
                        .findOne({where: {id: pageId}}, function (err, res) {
                            if (err) {
                                console.log(err);
                            }
                            if (res !== null) {
                                res.updateAttributes({
                                    "author_name": author,
                                    "price": price,
                                    "currency": currency,
                                    "phone": phone,
                                    "locality": placeit,
                                    "subcategory": subcat,
                                    "type": type,
                                    "parsed": true
                                }, function (err, res) {
                                    if (err) {
                                        console.log(err);
                                    }
                                    console.log(res);
                                })
                            }
                        });
                });

                spooky.on('getAdvertImgsIt', function (images) {
                    console.log('__________getAdvertImgsIt___________');
                    console.log(images);

                    Page
                        .findOne({where: {id: pageId}}, function (err, res) {
                            if (err) {
                                console.log(err);
                            }
                            if (res !== null) {
                                res.updateAttributes({"donor_images": images, "active": true}, function (err, res) {
                                    if (err) {
                                        console.log(err);
                                    }
                                    console.log(res);
                                    // console.log(images);
                                    spooky.options.cb(null, true);
                                })
                            }
                        });
                });
            }

            if (fr) {
                local = 'fr'
            }

            spooky.run();
        });
    }

    Page.remoteMethod('getAdvertDetails', {
        accepts: {arg: 'url', type: 'string'},
        returns: {arg: 'done', type: 'boolean'}
    });

    Page.pendingList = function (local, cb) {
        console.log('__________pendingList___________');

        let urls = []

        if (typeof local == 'undefined') {
            Page.find({where: {text: 'pending'}}, function (err, data) {
                if (err) {
                    console.log(err)
                }
                if (data) {
                    if (data.length) {
                        data.map(x => {
                            console.log(x.id)
                            if (x.id) {
                                let url = ''
                                if (x.local == 'it') {
                                    url = x.url
                                }
                                if (x.local == 'cz') {
                                    url = x.urlcategory + x.url
                                }
                                urls.push(x.id + '|||' + url)
                            }
                        })
                    }
                    console.log(urls)
                    cb(null, urls)
                }
            });
        } else {
            Page.find({where: {and: [{text: 'pending'}, {local: local}]}}, function (err, data) {
                if (err) {
                    console.log(err)
                }
                if (data) {
                    if (data.length) {
                        data.map(x => {
                            console.log(x.id)
                            if (x.id) {
                                let url = ''
                                if (x.local == 'it') {
                                    url = x.url
                                }
                                if (x.local == 'cz') {
                                    url = x.urlcategory + x.url
                                }
                                urls.push(x.id + '|||' + url)
                            }
                        })
                    }
                    console.log(urls)
                    cb(null, urls)
                }
            });
        }
    }

    Page.remoteMethod('pendingList', {
        accepts: {arg: 'local', type: 'string'},
        http: {path: '/pendingList', verb: 'get'},
        returns: {arg: 'urls', type: 'any'}
    });

    Page.saveTitles = function (pagesArr, category, catid, catname, cb) {
        console.log('__________saveTitles___________');
        console.log(catid, catname);
        let cz = category.search(".cz") + 1;
        let fr = category.search(".fr") + 1;
        let it = category.search(".it") + 1;
        let local = 'undefined'
        if (cz) {
            local = 'cz'
        }
        if (fr) {
            local = 'fr'
        }
        if (it) {
            local = 'it'
        }
        let ids = []
        console.log(pagesArr.pages)
        pagesArr.pages.map(x => {
            Page.findOrCreate({
                "local": local,
                "title": x[0],
                "url": x[1],
                "urlcategory": category,
                "category": catid,
                "category_title": catname,
                "subcategory": '',
                "type": '',
                "text": 'pending',
                "donor": true,
                "images": '',
                "donor_images": [],
                "edited": false,
                "author": '5d22af0d90b01d2b58ec17dd',
                "phone": '',
                "locality": '',
                "localityurl": '',
                "price": '',
                "currency": '',
                "tags": '',
                "views": 0,
                "likes": [],
                "comment": '',
                "commenttype": 'hidden',
                "parsed": false,
                "active": false
            }, function (err, data) {
                if (err) {
                    console.log(err)
                    ids.push('error')
                }
                if (data) {
                    const timestamp = data.id.toString().substring(0, 8)
                    const date = new Date(parseInt(timestamp, 16) * 1000)
                    ids.push(data.id + ' ' + category + ' ' + date)
                    console.log(data)

                    if (pagesArr.pages.length == ids.length) {
                        cb(null, ids)
                    }
                }
            });
        })
    }

    Page.remoteMethod('saveTitles', {
        accepts: [{arg: 'pages', type: 'any'}, {arg: 'category', type: 'any'}, {
            arg: 'catid',
            type: 'any'
        }, {arg: 'catname', type: 'any'}],
        returns: {arg: 'ids', type: 'any'}
    });

    Page.pages = function (url, cb) {
        var spooky = new Spooky({
            child: {
                //transport: 'http'
            },
            casper: {
                logLevel: 'debug',
                clientScripts: ["/var/www/parser/server/jquery.min.js"],
                verbose: true
            },
            cb: cb
        }, function (err) {
            if (err) {
                console.log(err)
                let e = new Error('Failed to initialize SpookyJS');
                e.details = err;
                throw e;
            }

            let imgPath = '/var/www/parser/client/public/images/';
            console.log(url)
            spooky.start(url);

            spooky.then([{imgPath: imgPath, url: url, x: 100, y: 100}, function () {
                this.wait(5000, function () {

                    this.then(function () {
                        //  this.captureSelector(this.imgPath + "page.png", "html");

                        var result = this.evaluate(function () {

                            // let desc = $( "div.popis" ).html();

                            var images = $(".flinavigace").find('img');

                            return Array.prototype.map.call(images, function (e) {

                                return [1, e.getAttribute('src').replace("t/", "/")];
                            });

                        });

                        this.emit('getCategoryPage', result);
                    });
                });
            }]);

            spooky.on('getCategoryPage', function (pages) {
                console.log('__________getCategoryPage___________');
                console.log(pages);

                spooky.options.cb(null, pages);
            });

            spooky.run();
        });
    }

    Page.remoteMethod('page', {
        accepts: {arg: 'url', type: 'string'},
        returns: {arg: 'page', type: 'string'}
    });

    /*    Page.remoteMethod('destroyAll', {
            description: 'Delete all matching records.',
            accessType: 'WRITE',
            accepts: [
                {arg: 'where', type: 'object', description: 'filter.where object'},
                {arg: 'options', type: 'object', http: 'optionsFromRequest'},
            ],
            returns: {
                arg: 'count',
                type: 'object',
                description: 'The number of instances deleted',
                root: true,
            },
            http: {verb: 'del', path: '/'},
            // shared: false,
        });*/

    Page.countCat = function (local, cb) {
        if (typeof local === 'undefined') {
            let local = 'en'
        }
//parsed: true
        Page.find({where: {and: [{active: true}, {local: local}]}}, function (err, data) {
            if (err) {
                console.log(err)
            }
            if (data) {
                if (data.length) {
                    console.log('data ------------------------------------ data ------------------------------------')
                    console.log(data.length)

                    let countCatArr = []
                    let resp = []

                    data.forEach((item) => {
                        countCatArr.push(item.category_title)
                    })

                    let countCats = () => {
                        let array_elements = countCatArr;

                        array_elements.sort();

                        var current = null;
                        var cnt = 0;
                        for (var i = 0; i < array_elements.length; i++) {
                            if (array_elements[i] != current) {
                                if (cnt > 0) {
                                    let count = {}
                                    count.category = current
                                    count.times = cnt
                                    resp.push(count);
                                }
                                current = array_elements[i];
                                cnt = 1;
                            } else {
                                cnt++;
                            }
                        }
                        if (cnt > 0) {
                            let count = {}
                            count.category = current
                            count.times = cnt
                            resp.push(count);
                        }
                    }
                    countCats()
                    cb(null, resp)
                }
            }
        });
    }

    Page.remoteMethod('countCat', {
        accepts: {arg: 'local', type: 'string'},
        http: {path: '/countCat', verb: 'get'},
        returns: {arg: 'resp', type: 'any'}
    });

}

process.on('unhandledRejection', function (err) {
    throw err;
});

process.on('uncaughtException', function (err) {
    console.log(err)
})
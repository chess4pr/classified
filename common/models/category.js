'use strict';

try {
    var Spooky = require('spooky');
} catch (e) {
    var Spooky = require('../lib/spooky');
}

module.exports = function (Category) {
    Category.category = function (url, cb) {
        var spooky = new Spooky({
            child: {
                //transport: 'http'
            },
            casper: {
                logLevel: 'debug',
                pageSettings: {
                    javascriptEnabled: true,
                    loadImages: false,
                    loadPlugins: false,
                    localToRemoteUrlAccessEnabled: false,
                    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5)",
                    userName: null,
                    password: null,
                    XSSAuditingEnabled: false,
                },
                clientScripts: ["/var/www/parser/server/jquery.min.js"],
                verbose: true
            },
            cb: cb
        }, function (err) {
            if (err) {
                console.log(err)
                e = new Error('Failed to initialize SpookyJS');
                e.details = err;
                throw e;
            }

            let imgPath = '/var/www/__classifield/client/public/images/';
            console.log(url)
            spooky.start(url);
            console.log('__________url getCategoryTopics___________');
            console.log(url);
            let it = url.search(".it") + 1;
            let cz = url.search(".cz") + 1;
            let fr = url.search(".fr") + 1;

            if (it) {
                console.log('it imgPath ' + imgPath)
                spooky.then([{imgPath: imgPath, url: url, x: 100, y: 100}, function () {
                    this.imgPath = imgPath;
                    this.url = url;
                    this.x = x;
                    this.y = y;
                    this.width = 1280;

                    var proportion = this.width / this.x;
                    this.height = Math.floor(proportion * this.y);
                    this.wait(5000, function () {
                            this.then(function () {
                                this.captureSelector(this.imgPath + "category.png", "html");

                                var result = this.evaluate(function () {

                                    // #apn_top_tag
                                    var links = $(".top-bar").next().find('a').find('h2').find('span');
                                    //var links = $(".top-bar").next().find('a');

                                    // var className = $('#sidebar div:eq(14)').attr('class');
                                    /* var links = $(".nadpis").find('a');

                                    Cucciolo taglia piccola
 */
                                    return Array.prototype.map.call(links, function (e) {
                                        if (e.parentNode.parentNode.parentNode.parentNode.getAttribute('href') != 2) {
                                            return [e.innerHTML, e.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute('href')];
                                        }
                                    });
                                });
                                this.emit('getCategoryTopicsIt', result);
                            });
                        }
                    );
                }]);

                spooky.on('getCategoryTopicsIt', function (pages) {

                    console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                    console.log(pages);
                    spooky.options.cb(null, pages);
                });
            }

            if (cz) {
                console.log('cz')
                spooky.then([{imgPath: imgPath, url: url, x: 100, y: 100}, function () {
                    this.imgPath = imgPath;
                    this.url = url;
                    this.x = x;
                    this.y = y;
                    this.width = 1280;

                    var proportion = this.width / this.x;
                    this.height = Math.floor(proportion * this.y);
                    this.wait(5000, function () {
                            this.then(function () {
                                this.captureSelector(this.imgPath + "category.png", "html");

                                var result = this.evaluate(function () {
                                    var links = $(".nadpis").find('a');

                                    return Array.prototype.map.call(links, function (e) {
                                        return [e.innerHTML, e.getAttribute('href')];
                                    });
                                });
                                this.emit('getCategoryTopicsCz', result);
                            });
                        }
                    );
                }]);

                spooky.on('getCategoryTopicsCz', function (pages) {
                    console.log('__________getCategoryTopics___________');
                    console.log(pages);
                    spooky.options.cb(null, pages);
                });
            }

            if (fr) {
                spooky.then([{imgPath: imgPath, url: url, x: 100, y: 100}, function () {
                    this.imgPath = imgPath;
                    this.url = url;
                    this.x = x;
                    this.y = y;
                    this.width = 1280;
                    var proportion = this.width / this.x;
                    this.height = Math.floor(proportion * this.y);
                    this.wait(5000, function () {
                            /*                     title:
       `<div class="_3dPxM" data-reactid="1578"><span class="_a3cT Ywd7f _2eBcG" data-reactid="1579"><div class="LazyLoad is-visible" data-reactid="1580"><img class="hidden" src="https://img3.leboncoin.fr/ad-image/89dd52563c86dc99520e248f2e205242e1df505a.jpg" itemprop="image" content="https://img3.leboncoin.fr/ad-image/89dd52563c86dc99520e248f2e205242e1df505a.jpg" alt="Carpe Koi"></div></span><span class="_2lY3w" data-reactid="1581"><span class="_1vK7W _1eOK1" name="camera"><svg height="22" width="24" viewBox="0 0 24 22" focusable="false"><path d="M12 8.556c1.988 0 3.6 1.642 3.6 3.667 0 2.024-1.612 3.666-3.6 3.666s-3.6-1.642-3.6-3.666c0-2.025 1.612-3.667 3.6-3.667zm0 9.778c3.313 0 6-2.738 6-6.111 0-3.375-2.687-6.112-6-6.112-3.312 0-6 2.737-6 6.112 0 3.373 2.688 6.11 6 6.11zm9.6-15.89c1.32 0 2.4 1.1 2.4 2.444v14.667C24 20.9 22.92 22 21.6 22H2.4C1.08 22 0 20.9 0 19.555V4.89c0-1.345 1.08-2.445 2.4-2.445h3.804L7.68.795A2.415 2.415 0 0 1 9.456 0h5.088c.672 0 1.32.294 1.764.794l1.488 1.65H21.6z" fill="#000"></path></svg></span><span data-reactid="1583">3</span></span></div><section class="_2EDA9" data-reactid="1584"><div data-reactid="1585"><p class="_2tubl" data-reactid="1586"><span itemprop="name" data-qa-id="aditem_title" data-reactid="1587">Carpe Koi</span></p><div class="_2OJ8g" itemprop="priceSpecification" itemscope="" itemtype="http://schema.org/PriceSpecification" data-qa-id="aditem_price" data-reactid="1588"><meta itemprop="priceCurrency" content="EUR" data-reactid="1589"><span class="_1JRvz" data-reactid="1590"><span itemprop="priceCurrency" content="EUR" class="_1NfL7" data-reactid="1591"><!-- react-text: 1592 -->150<!-- /react-text --><!-- react-text: 1593 -->&nbsp;€<!-- /react-text --></span></span></div></div><div data-reactid="1594"><p class="CZbT3" itemprop="alternateName" data-qa-id="aditem_category" content="Animaux" data-reactid="1595"><!-- react-text: 1596 -->Animaux<!-- /react-text --></p><p class="_2qeuk" itemprop="availableAtOrFrom" data-qa-id="aditem_location" data-reactid="1597">La Possession 97419</p><p class="mAnae" itemprop="availabilityStarts" data-qa-id="listitem_date" content="Aujourd'hui, 10:20" data-reactid="1598">Aujourd'hui, 10:20</p></div></section>`,
      url: '/animaux/1627483819.htm/',
      urlcategory: 'https://www.leboncoin.fr/animaux/offres',
                             */
                            this.then(function () {
                                this.captureSelector(this.imgPath + "category.png", "html");

                                var result = this.evaluate(function () {

                                    var links = $('[data-qa-id="aditem_container"]').find('a')

                                    return Array.prototype.map.call(links, function (e) {
                                        return [e.innerHTML, e.getAttribute('href')];
                                    });
                                });

                                this.emit('getCategoryTopicsFr', result);
                            });
                        }
                    );
                }]);

                spooky.on('getCategoryTopicsFr', function (pages) {
                    console.log('__________getCategoryTopics___________');
                    console.log(pages);
                    spooky.options.cb(null, pages);
                });
            }


            spooky.run();
        });
    }

    Category.remoteMethod('category', {
        accepts: {arg: 'url', type: 'string'},
        returns: {arg: 'pages', type: 'string'}
    });


};

process.on('unhandledRejection', function (err) {
    throw err;
});

process.on('uncaughtException', function (err) {
    console.log(err)
})
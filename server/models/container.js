'use strict';

try {
    var Spooky = require('spooky');
} catch (e) {
    var Spooky = require('../lib/spooky');
}

module.exports = function (Container) {
    Container.page = function (url, cb) {
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
                e = new Error('Failed to initialize SpookyJS');
                e.details = err;
                throw e;
            }
            let imgPath = '/var/www/parser/client/public/images/';
            console.log(url)
            spooky.start(url);

            spooky.then([{imgPath: imgPath, url: url, x: 100, y: 100}, function () {
                this.imgPath = imgPath;
                this.url = url;
                this.x = x;
                this.y = y;
                this.width = 450;

                var proportion = this.width / this.x;
                this.height = Math.floor(proportion * this.y);
                this.wait(5000, function () {
                    // this.callb(null, 'Greetings... ');
                    this.then(function () {
//todo: param cat name
                        this.captureSelector(this.imgPath + "page.png", "html");

                        var result = this.evaluate(function () {

                           // let desc = $( "div.popis" ).html();

                            var images = $(".flinavigace").find('img');

                            return Array.prototype.map.call(images, function (e) {

                                return [1, e.getAttribute('src').replace("t/", "/")];
                            });

                            /*  return Array.prototype.map.call(links, function (e) {
                                  return [e.innerHTML, e.getAttribute('href')];
                              });*/

                            //   return linksArrStr;

                        });

                        this.emit('getCategoryPage', result);
                    });
                });
            }]);

            // spooky.then(function () {
            //     this.emit('hello', 'Hello, from ' + this.evaluate(function () {
            //         return document.title;
            //     }));
            // });


            spooky.on('getCategoryPage', function (greeting) {
                console.log('__________getCategoryPage___________');
                console.log(greeting);
                spooky.options.cb(null, greeting);
            });
            spooky.run();
        });
    }

    Container.remoteMethod('page', {
        accepts: {arg: 'url', type: 'string'},
        returns: {arg: 'greeting', type: 'string'}
    });

    Container.category = function (url, cb) {
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
                e = new Error('Failed to initialize SpookyJS');
                e.details = err;
                throw e;
            }
            let imgPath = '/var/www/parser/client/public/images/';
            console.log(url)
            spooky.start(url);

            spooky.then([{imgPath: imgPath, url: url, x: 100, y: 100}, function () {
                this.imgPath = imgPath;
                this.url = url;
                this.x = x;
                this.y = y;
                this.width = 450;

                var proportion = this.width / this.x;
                this.height = Math.floor(proportion * this.y);
                this.wait(5000, function () {
                    // this.callb(null, 'Greetings... ');
                    this.then(function () {
//todo: param cat name
                        this.captureSelector(this.imgPath + "category.png", "html");

                        var result = this.evaluate(function () {

                            var links = $(".nadpis").find('a');
                            return Array.prototype.map.call(links, function (e) {
                                return [e.innerHTML, e.getAttribute('href')];
                            });

                            //   return linksArrStr;

                        });

                        this.emit('getCategoryTopics', result);
                    });
                });
            }]);

            // spooky.then(function () {
            //     this.emit('hello', 'Hello, from ' + this.evaluate(function () {
            //         return document.title;
            //     }));
            // });


            spooky.on('getCategoryTopics', function (greeting) {
                console.log('__________getCategoryTopics___________');
                console.log(greeting);
                spooky.options.cb(null, greeting);
            });
            spooky.run();
        });
    }

    Container.remoteMethod('category', {
        accepts: {arg: 'url', type: 'string'},
        returns: {arg: 'greeting', type: 'string'}
    });

    Container.greet = function (msg, cb) {

//clientScripts: ['../public/javascripts/jquery.min.js']
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
                e = new Error('Failed to initialize SpookyJS');
                e.details = err;
                throw e;
            }

            let imgPath = '/var/www/parser/client/public/images/';

            let url = 'https://www.bazos.cz';

            spooky.start(url);

            spooky.then([{imgPath: imgPath, url: url, x: 100, y: 100}, function () {
                this.imgPath = imgPath;
                this.url = url;
                this.x = x;
                this.y = y;
                this.width = 450;

                var proportion = this.width / this.x;
                this.height = Math.floor(proportion * this.y);
                this.wait(5000, function () {
                    // this.callb(null, 'Greetings... ');
                    this.then(function () {

                        this.captureSelector(this.imgPath + "firstScreen.png", "html");


                        var result = this.evaluate(function () {
                            /* let linksArrStr = ''
                             $(".nadpisnahlavni").each(function (index, value) {
                                 linksArr += value + ','
                             })*/

                            var links = $(".nadpisnahlavni").find('a');
                            return Array.prototype.map.call(links, function (e) {
                                return [e.innerHTML, e.getAttribute('href')];
                            });

                            //   return linksArrStr;

                        });

                        this.emit('getCategory', result);


                        /* this.emit('getCategory', this.evaluate(function () {
                           /!*  let linksArrStr = ''
                             $(".nadpisnahlavni").find('a').attr('href').each(function (index, value) {
                                 linksArr += value + ','
                             });*!/
                             return $(".nadpisnahlavni").find('a').attr('href').length;
                         }));*/

                        /* this.capture(this.imgPath, {
                             top: 60,
                             left: 0,
                             width: this.width,
                             height: this.height
                         });*/
                    });
                });
            }]);

            spooky.then(function () {
                this.emit('hello', 'Hello, from ' + this.evaluate(function () {
                    return document.title;
                }));
            });

            /*    spooky.then(function () {

                });*/
            spooky.run();
        });

        spooky.on('error', function (e, stack) {
            console.error(e);

            if (stack) {
                console.log(stack);
            }
        });

        /*
        // Uncomment this block to see all of the things Casper has to say.
        // There are a lot.
        // He has opinions.
          */
        spooky.on('console', function (line) {
            console.log(line);
        });

        spooky.on('hello', function (greeting) {
            console.log(greeting);
            spooky.options.greeting = greeting;
        });

        spooky.on('getCategory', function (greeting) {
            console.log('__________getCategory___________');

            console.log(greeting);
            //spooky.options.cb(null, spooky.options.greeting);
            spooky.options.cb(null, greeting);
        });

        //nadpisnahlavni
        /*    this.emit('hello', this.evaluate(function () {
                return $('#list_parent').html();
            }));*/

        spooky.on('log', function (log) {
            if (log.space === 'remote') {
                console.log(log.message.replace(/ \- .*/, ''));
            }
        });
    }

    Container.remoteMethod('greet', {
        accepts: {arg: 's', type: 'string'},
        returns: {arg: 'greeting', type: 'string'}
    });

    Container.putContainer = function (container, cb) {

        Container.getContainer(container, function (err, c) {
            // if (err)
            //   return cb(err)
            if (c && c.name) {
                console.log('CONTAINER ALREADY EXIST', container);
                cb(null, c.name)
            }
            else {
                Container.createContainer({name: container}, function (err, c) {
                    if (err)
                        return cb(err);
                    console.log('CONTAINER CREATED', container);
                    cb(null, c.name)
                });
            }
        });

    };

};

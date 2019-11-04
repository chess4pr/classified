const axios = require('axios')
const osu = require('node-os-utils')
const cpu = osu.cpu
const mem = osu.mem
const bucket = require('../node_modules/node-os-utils/lib/bucket.js')
const API_URL = 'https://vazoga.com:3003/api'

bucket.osCmd = {
    topCpu: bucket.exec('ps -eo pcpu,user,args --no-headers | sort -k 1 -n | tail -n 10 | sort -k 1 -nr | cut -c 1-70'),
    topMem: bucket.exec('ps -eo pmem,pid,cmd | sort -k 1 -n | tail -n 10 | sort -k 1 -nr | cut -c 1-70'),
    vmstats: bucket.exec('vmstat -S m'),
    processesUsers: bucket.exec('ps hax -o user | sort | uniq -c'),
    diskUsage: bucket.exec('df -h'),
    who: bucket.exec('who'),
    whoami: bucket.exec('whoami'),
    openPorts: bucket.exec('lsof -Pni4 | grep ESTABLISHED'),
    ifconfig: bucket.exec('ifconfig'),
    phantomjsKill: bucket.exec('ps -ef | grep phantomjs | awk \'{print $2}\' | xargs kill -9')
}

setInterval(function () {

axios.all([
    axios.get(`${API_URL}/categories?filter[where][local]=it&filter[where][active]=true`)
]).then(axios.spread((response) => {
    console.log(response)

    console.log(typeof response.data)
    let i = []
    let urls = []
    let catId = []
    let catName = []
    let c = 0
    response.data.map(x => {
        i.push(c)
        if (x.url.substr(x.url.length - 1) == '/') { // last symbol  /
            x.url = x.url.slice(0, -1)
        }
        urls.push(x.url)
        catId.push(x.id)
        catName.push(x.name)
        c++
    })

    console.log(urls)


    // let i = urls;
    let promiseFactoriesOrWhatever = [];
    let results = [];

    function work(t) {
        return new Promise((resolve, reject) => {

            console.log('running ' + t);


            axios.post('https://vazoga.com:3003/api/categories/category', {
                url: urls[t]
            })
                .then(function (response) {
                    console.log("response.data");
                    console.log(response.data);

                    if (t === urls.length) {
                        console.log(t + ' rejecting ' + urls[t])
                        return reject(urls.length)
                    }


                    cpu.free()
                        .then(freeInfo => {
                            console.log('cpu free _________________________________________' + freeInfo + '%')
                            cpu.usage()
                                .then(usageInfo => {
                                    console.log('cpu usage ________________________________________' + usageInfo + '%')
                                    mem.info()
                                        .then(info => {
                                            console.log(info)
                                            console.log('freeMemMb ________________________________________' + info.freeMemMb)

                                            //if (freeInfo > 20) {
                                            if (freeInfo > 10 && info.freeMemMb > 100) {
                                                if (typeof timeOut !== 'undefined') {
                                                    clearTimeout(timeOut)
                                                }
                                                axios.post('https://vazoga.com:3003/api/pages/saveTitles', {
                                                    pages: response.data,
                                                    category: urls[t],
                                                    catid: catId[t],
                                                    catname: catName[t]
                                                })
                                                    .then(function (resp) {
                                                        console.log(resp.data.ids)
                                                    })
                                                    .catch(function (error) {
                                                        console.log(error);
                                                    });

                                                console.log(t + ' resolving ' + urls[t])
                                                resolve(t)

                                            } else {
                                                console.log(t + ' freeInfo ' + freeInfo + ' timeout ' + urls[t])
                                                bucket.osCmd.phantomjsKill().then((response) => {
                                                    var timeOut = setTimeout(function () {
                                                        console.log('--------------------------------------------')
                                                        console.log('timeout phantomjs kill response: ' + response)
                                                        console.log('--------------------------------------------')
                                                        resolve('timeout')
                                                    }, 10000);
                                                })
                                            }

                                        })
                                        .catch(function (error) {
                                            console.log(error);
                                        });


                                })
                        })
                })
        })
    }


    for (let a of i) {
        promiseFactoriesOrWhatever.push(
            () => {
                console.log('current results', results)
                return work(a).then((r) => {
                    results.push(r)
                })
            }
        )
    }

    function queue(promiseFactories, finalResolve, finalReject) {
        let chain = new Promise(resolve => resolve());

        let loop = async () => {
            let current = promiseFactories.shift()
            if (current) {
                await current();
                return loop();
            } else {
                finalResolve()
            }
        }

        chain.then(loop).catch(finalReject)

        return chain;
    }

    queue(
        promiseFactoriesOrWhatever,
        r => {
            console.log('final resolve', r)
        },
        e => {
            console.log('final reject', e)
        },
        results
    )


})).catch(error => {
    console.log(error);
});

}, 600000)

process.on('unhandledRejection', function (err) {
    throw err;
});

process.on('uncaughtException', function (err) {
    console.log(err)
})
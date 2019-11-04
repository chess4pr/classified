import axios from 'axios';
import History from '../history.js';
import * as type from './types';
import cookie from 'browser-cookies';

const API_URL = process.env.REACT_APP_API_URL;
const FILE_URL = process.env.REACT_APP_FILE_URL;

let TOKEN = localStorage.getItem('token');
let UID = localStorage.getItem('uid');

const errorBeautifier = error => {
    return error.hasOwnProperty('payload')
        ? error
        : {type: type.ERROR, payload: {data: {error: {name: 'Error', message: error.message}}}};
};

axios.interceptors.response.use(
    response => response,
    error => Promise.reject(error && error.response
        ? {type: type.ERROR, payload: error.response}
        : errorBeautifier(error))
);

export const getLikes = (id) => {
    return new Promise((resolve, reject) => {
        axios.get(`${API_URL}/pages/${id}`)
            .then(response => {
                resolve(response.data.likes);
            })
            .catch(error => {
                reject(error);
            });
    });
};

export const setLike = (id, author) => {
    return new Promise((resolve, reject) => {
        axios.get(`${API_URL}/pages/${id}`)
            .then(response => {
                function increment() {
                    axios.post(`${API_URL}/pages/incrementLike`, {
                        pageId: id, author: author
                    }).then(function(response) {
                        console.log('incrementLike - axios');
                        console.log(response);
                        var a = response.data.done;
                        var unique = a.filter(function(item, i, ar) {
                            return ar.indexOf(item) === i;
                        });
                        resolve(unique);
                    });
                }

                function decrement() {
                    axios.post(`${API_URL}/pages/decrementLike`, {
                        pageId: id, author: author
                    }).then(function(response) {
                        console.log('incrementLike - axios');
                        console.log(response);
                        var a = response.data.done;
                        var unique = a.filter(function(item, i, ar) {
                            return ar.indexOf(item) === i;
                        });
                        resolve(unique);
                    });
                }

                if (typeof response.data.likes === 'undefined') {
                    response.data.likes = [];
                }

                if (response.data.likes.length) {
                    if (response.data.likes.includes(author)) {
                        decrement();
                    } else {
                        increment();
                    }
                } else {
                    increment();
                }
            })
            .catch(error => {
                reject(error);
            });
    });
};

export const getComments = (ad) => {
    return new Promise((resolve, reject) => {
        axios.all([
            axios.get(`${API_URL}/comments?filter[where][ad]=comment_` + ad)
        ]).then(axios.spread((ads) => {
            for (var key in ads.data) {
                for (var k in ads.data[key]) {
                    if (k === 'created') {
                        ads.data[key].createdAt = new Date(ads.data[key][k]);
                    }
                    if (k === 'authorurl') {
                        ads.data[key].authorUrl = ads.data[key][k];
                    }
                    if (k === 'avatarurl') {
                        ads.data[key].avatarUrl = ads.data[key][k];
                    }
                    if (k === 'name') {
                        ads.data[key].fullName = ads.data[key][k];
                    }
                }
            }
            resolve(ads.data);
        }));
    });
};

export const getPopularCategories = (local) => {
    return new Promise((resolve, reject) => {
        axios.all([

            axios.get(`${API_URL}/pages/countCat?local=` + local)//?local=it

        ]).then(axios.spread((categories) => {
            function sortFunction(a, b) {
                if (a[0] === b[0]) {
                    return 0;
                }
                else {
                    return (a[0] < b[0]) ? -1 : 1;
                }
            }

            let cat = [];
            let popularCats = [];
            for (let i = 0; i < categories.data.resp.length; i++) {
                cat = [categories.data.resp[i].times, categories.data.resp[i].category];
                popularCats.push(cat);
            }
            popularCats.sort(sortFunction).reverse();
            resolve(popularCats);
        }));
    });
};

export const getLastAds = (local) => {
    return new Promise((resolve, reject) => {
        axios.all([

            /**
             * --------------------Categories active----------------------*/

            axios.get(
                `${API_URL}/pages?filter[where][donor]=false&filter[where][local]=${local}&filter[order]=id%20DESC`)
        ]).then(axios.spread((lastPages) => {
            resolve(lastPages.data);
        }));
    });
};

export const getLocalizedStrings = () => {
    return {
        en: {
            home: "Home",
            profile: "Profile",
            settings: "Settings",
            account: "Account",
            changePassword: "Change password",
            capital: "London, England",
            categories: "Categories",
            subcategory: "Subcategory",
            type: "Type",
            myads: "My Ads",
            list: "List",
            newad: "New",
            about: "About",
            tos: "Terms of Service",
            policy: "Privacy Policy",
            mit: "The project under the",
            images: "Images",
            title: "Title",
            text: "Text",
            region: "Address Region",
            address: "Address",
            allAds: "All ads",
            myAds: "My ads",
            signIn: "Sign In",
            signUp: "Sign Up",
            users: "Users",
            lastAds: "Last ads",
            warnCookies: 'Warning! We use cookies. The cookie allows the website to "remember" your actions or preferences over time. Thank You for reading.',
            topCategories: "TOP 3 Categories",
            buy: "buy",
            sell: "sell",
            messages: "Messages",
            sendMessage: "Send message to",
            send: "Send",
            sentTo: "Sent to",
            receivedFrom: "Received from",
            more: "more",
            other: "other",
            type: "type",
            subcategory: "subcategory",
            region: "region",
            author: "author"
        },
        it: {
            home: "Casa",
            profile: "Profilo",
            settings: "Impostazioni",
            account: "Conto",
            changePassword: "Cambia la password",
            capital: "Roma, Italia",
            categories: "Categorie",
            subcategory: "Sottocategoria",
            type: "Tipo",
            myads: "I miei annunci",
            list: "Elenco",
            newad: "Nuovo",
            about: "Attorno",
            tos: "Termini di servizio",
            policy: "Politica sulla privacy",
            mit: "Il progetto nell'ambito del",
            images: "Immagini",
            title: "Titolo",
            text: "Testo",
            region: "Indirizzo regione",
            address: "Indirizzo",
            allAds: "Tutti gli annunci",
            myAds: "I miei annunci",
            signIn: "Accedi",
            signUp: "Iscriviti",
            users: "Utenti",
            lastAds: "Ultimi annunci",
            warnCookies: 'Avvertimento! Utilizziamo i cookie. Il cookie consente al sito Web di "ricordare" le tue azioni o preferenze nel tempo. Grazie per aver letto.',
            topCategories: "TOP 3 Categorie",
            buy: "compra",
            sell: "vendi",
            messages: "Messaggi",
            sendMessage: "Invia messaggio a",
            send: "Spedire",
            sentTo: "Inviato a",
            receivedFrom: "Ricevuto da",
            more: "più",
            other: "altro",
            type: "tipo",
            subcategory: "sottocategoria",
            region: "regione",
            author: "autore"
        },
        cz: {
            home: "Domov",
            profile: "Profil",
            settings: "Nastavení",
            account: "Konto",
            changePassword: "Změnit heslo",
            capital: "Prague, Česko",
            categories: "Kategorie",
            subcategory: "Podkategorie",
            type: "Typ",
            myads: "Moje reklamy",
            list: "Seznam",
            newad: "Nový",
            about: "O nás",
            tos: "Podmínky služby",
            policy: "Zásady ochrany osobních údajů",
            mit: "Projekt v rámci",
            images: "Snímky",
            title: "Titul",
            text: "Text",
            region: "Adresa Region",
            address: "Adresa",
            allAds: "Všechny reklamy",
            myAds: "Moje reklamy",
            signIn: "Přihlásit se",
            signUp: "Registrace",
            users: "Uživatelé",
            lastAds: "Poslední reklamy",
            warnCookies: 'Varování! Používáme cookies. Soubor cookie umožňuje webovému serveru "si pamatovat" vaše akce nebo preference v průběhu času. Děkuji za přečtení.',
            topCategories: "TOP 3 Kategorie",
            buy: "koupit",
            sell: "prodat",
            messages: "Zprávy",
            sendMessage: "Odeslat zprávu",
            send: "Poslat",
            sentTo: "Odeslána",
            receivedFrom: "Přijato od",
            more: "více",
            other: "jiné",
            type: "typ",
            subcategory: "podkategorie",
            region: "region",
            autor: "author"
        }
    };
};

export const getCategoriesSelect = (local) => {
    return new Promise((resolve, reject) => {
        axios.all([
            axios.get(`${API_URL}/categories?filter[where][active]=true&filter[where][local]=${local}`)
        ]).then(axios.spread((categories) => {
                resolve(categories.data);
            }))
            .catch(error => {
                reject(error.response.data.error);
            });
    });
};

function loginRequest() {
    console.log('loginRequest');

    //return new Promise((resolve, reject) => {
    const values = {email: 'alexeybokarev@gmail.com', password: 'user'};
    axios.post(`${API_URL}/users/login`, values)
        .then(response => {
            return (dispatch) => {
                localStorage.setItem('token', response.data.id);
                localStorage.setItem('uid', response.data.userId);
                localStorage.setItem('ttl', response.data.ttl);
                TOKEN = localStorage.getItem('token');
                UID = localStorage.getItem('uid');
                console.log('TOKEN loginRequest');
                console.log(TOKEN);
                console.log('UID loginRequest');
                console.log(UID);

                console.log('dispatch loginRequest');
                console.log(UID);
                axios.get(`${API_URL}/users/${UID}`, {
                        headers: {authorization: localStorage.getItem('token')}
                    })
                    .then(response => {
                        console.log(' response TOKEN');
                        dispatch({type: type.AUTH_USER, payload: setSession(computeUser(response.data))});
                        History.push('/home');
                    })
                    .catch(error => {
                        console.log(error.response.data.error);
                    });
                /*    getUser(UID)
                        .then(re => {
                            console.log('re----1')
                            console.log(re)
                            dispatch({type: type.AUTH_USER, payload: setSession(re)});
                            //  resolve(response);
                            History.push('/home');
                        })
                        .catch(error => dispatch(error));*/
            };
        })
        .catch(error => {
            //  reject(error.response.data.error);
        });
}

export const socialLogin = (profileObj) => {
    const user = {
        username: profileObj.givenName + " " + profileObj.familyName,
        name: profileObj.givenName,
        surname: profileObj.familyName,
        ip: "123.333.333.0",
        status: true,
        password: 'user',
        imageSocial: profileObj.imageUrl,
        email: profileObj.email,
        emailVerified: true
    };

    return new Promise((resolve, reject) => {
        axios.post(`${API_URL}/users/socialLogin`, {
                "data": user
            })
            /*   .then(createdUser => {
                   dispatch({type: type.AUTH_USER, payload: setSession(computeUser(createdUser))});
               })*/
            .then((createdUser) => {
                const values = {email: 'alexeybokarev@gmail.com', password: 'user'};
                console.log('values');
                console.log(values);

                loginRequest(values);
                resolve(createdUser);

            })
            .catch(error => {
                reject(error.response.data.error);
            });
    });
};

export const getMessages = (user) => {
    return new Promise((resolve, reject) => {
        axios.all([
            axios.get(`${API_URL}/messages`)
        ]).then(axios.spread((messages) => {
                let msg = [];
                for (var i = 0; i < messages.data.length; i++) {
                    if (messages.data[i].userid === user || messages.data[i].recepientid === user) {
                        msg.push(messages.data[i]);
                    }
                }
                resolve(msg.reverse());
            }))
            .catch(error => {
                reject(error.response.data.error);
            });
    });
};

export const getCategories = (local) => {
    if (!local) {
        local = cookie.get('local') || 'cz';
    }
    return new Promise((resolve, reject) => {
        axios.all([
            /**
             * --------------------Categories active----------------------*/

            axios.get(`${API_URL}/categories?filter[where][active]=true&filter[where][local]=${local}`),

            /**
             * --------------------Categories active----------------------*/

            axios.get(`${API_URL}/pages/countCat`)

        ]).then(axios.spread((categories, countInCategories) => {

                console.log('countInCategories');
                console.log(countInCategories);

                let publicNamesArr = [];
                let catArr = [];

                function searchInCat(nameKey, myArray) {
                    for (var i = 0; i < myArray.length; i++) {
                        /* console.log(myArray[i].category + ' ---> ' + nameKey)
                         console.log(myArray[i])*/
                        if (myArray[i].category === nameKey) {
                            return myArray[i].times;
                        }
                    }
                }

                const rmvDupl = (originalArray, prop) => {
                    var newArray = [];
                    var lookObj = {};
                    for (var i in originalArray) {
                        lookObj[originalArray[i][prop]] = originalArray[i];
                    }
                    for (i in lookObj) {
                        newArray.push(lookObj[i]);
                    }
                    return newArray;
                };

                function compare(a, b) {
                    if (a.name < b.name) {
                        return -1;
                    }
                    if (a.name > b.name) {
                        return 1;
                    }
                    return 0;
                }

                categories = categories.data.map(x => {
                    if (!publicNamesArr.includes(x.publicname)) {
                        publicNamesArr.push(x.publicname);
                        catArr[x.publicname] = {};
                        catArr[x.publicname].desc = [];
                        catArr[x.publicname].category = [];
                        catArr[x.publicname].subcategory = x.subcat;
                        catArr[x.publicname].realname = [];
                        catArr[x.publicname].found = [];
                        catArr[x.publicname].realname.push(x.name);
                        catArr[x.publicname].name = x.publicname;
                        catArr[x.publicname].icon = x.icon;
                        catArr[x.publicname].found.push(searchInCat(x.name, countInCategories.data.resp));
                        catArr[x.publicname].desc.push(x.local);
                        catArr[x.publicname].category.push(x.url);
                    } else {
                        catArr[x.publicname].desc.push(x.local);
                        catArr[x.publicname].category.push(x.url);
                        catArr[x.publicname].realname.push(x.name);
                        catArr[x.publicname].found.push(searchInCat(x.name, countInCategories.data.resp));
                    }
                    return catArr[x.publicname];
                });

                categories = rmvDupl(categories, "name");

                try {
                    let catSort = categories.sort(compare);
                    resolve(catSort);
                }
                catch (e) {
                    resolve({error: 'Found error near categories.sort(compare) ' + e});
                    console.log(e);
                }

            }))
            .catch(error => {
                reject(error.response.data.error);
            });
    });
};

export const getRelatedImgs = (id) => {
    return new Promise((resolve, reject) => {
        axios.get(`${API_URL}/upload_files?filter=%7B%22where%22%3A%7B%22related.ref%22%3A%22${id}%22%7D%7D`)
            .then(response => {
                console.log('getRelatedImgs data');
                console.log(response.data);
                resolve(response.data);
            })
            .catch(error => {
                reject(error.response.data.error);
            });
    });
};

export const getAd = (id) => {
    return new Promise((resolve, reject) => {
        axios.get(`${API_URL}/pages/${id}`)
            .then(response => {
                console.log('response.data');
                console.log(response.data);
                resolve(response.data);
            })
            .catch(error => {
                reject(error.response.data.error);
            });
    });
};

export const signUp = (data) => {

    console.log(data);

    return (dispatch) => {
        axios.post(`${API_URL}/users`, data)
            .then(() => {
                dispatch({
                    type: type.SUCCESS,
                    payload: {name: 'SUCCESS', message: 'Check your email for confirmation link.'}
                });
                setTimeout(() => {
                    // History.push('/signin')
                }, 1500);
            })
            .catch(error => dispatch(error));
    };
};

export const setSession = (response) => {
    //response.isAdmin = response.roles.find(x => x.name === 'admin');
    //response.isEditor = response.roles.find(x => x.name === 'editor');
    sessionStorage.setItem('me', JSON.stringify(response));
    return response;
};

export const signInSocial = (data) => {
    console.log('signInSocial');
    //data = {email: 'alexeybokarev@gmail.com', password: 'user'};
    console.log(data);

    axios.post(`${API_URL}/users/login`, data)
        .then(response => {
            console.log(response);
            localStorage.setItem('token', response.data.id);
            localStorage.setItem('uid', response.data.userId);
            localStorage.setItem('ttl', response.data.ttl);
            TOKEN = localStorage.getItem('token');
            UID = localStorage.getItem('uid');
            console.log('signInSocial TOKEN');
            console.log(TOKEN);
            console.log('signInSocial UID');
            console.log(UID);

            axios.get(`${API_URL}/users/${UID}`, {
                    headers: {authorization: localStorage.getItem('token')}
                })
                .then(response => {
                    console.log('signInSocial dispatch');
                    return (dispatch) => {
                        dispatch({type: type.AUTH_USER, payload: setSession(computeUser(response.data))});
                        History.push('/home');
                    };
                    // resolve();
                })
                .catch(error => {
                    console.log(error.response.data.error);
                });
        });

    /* return async (dispatch, data) => {
         console.log('---->');
         await axios.post(`${API_URL}/users/login`, data)
             .then(response => {
                 console.log(response);
                 localStorage.setItem('token', response.data.id);
                 localStorage.setItem('uid', response.data.userId);
                 localStorage.setItem('ttl', response.data.ttl);
                 TOKEN = localStorage.getItem('token');
                 UID = localStorage.getItem('uid');
                 console.log('signInSocial TOKEN');
                 console.log(TOKEN);
                 console.log('signInSocial UID');
                 console.log(UID);

                 axios.get(`${API_URL}/users/${UID}`, {
                         headers: {authorization: localStorage.getItem('token')}
                     })
                     .then(response => {
                         dispatch({type: type.AUTH_USER, payload: setSession(computeUser(response.data))});
                         History.push('/home');
                         // resolve();
                     })
                     .catch(error => {
                         console.log(error.response.data.error);
                     });

                 /!*
                  getUser(UID)
                      .then(resp => {
                          console.log('resp');
                          console.log(resp);
                          dispatch({type: type.AUTH_USER, payload: setSession(resp)});
                          History.push('/home');
                      })
                      .catch(error => dispatch(error));*!/
             })
             .catch(error => dispatch(error));
     };*/
};

/*const socialUser = () => {
    return (dispatch) => {
        localStorage.removeItem('token');
        sessionStorage.removeItem('me');
        TOKEN = null;
        dispatch({
            type: type.UNAUTH_USER,
            payload: null
        });
        History.push('/');
    };
};*/

export const signIn = (data) => {
    console.log('signIn');
    console.log(data);
    return async (dispatch) => {
        await axios.post(`${API_URL}/users/login`, data)
            .then(response => {
                localStorage.setItem('token', response.data.id);
                localStorage.setItem('uid', response.data.userId);
                localStorage.setItem('ttl', response.data.ttl);
                TOKEN = localStorage.getItem('token');
                UID = localStorage.getItem('uid');
                console.log('TOKEN');
                console.log(TOKEN);
                getUser(response.data.userId)
                    .then(response => {
                        dispatch({type: type.AUTH_USER, payload: setSession(response)});
                        History.push('/home');
                    })
                    .catch(error => dispatch(error));
            })
            .catch(error => dispatch(error));
    };
};

export const signOut = () => {
    return (dispatch) => {
        localStorage.removeItem('token');
        sessionStorage.removeItem('me');
        TOKEN = null;
        dispatch({
            type: type.UNAUTH_USER,
            payload: null
        });
        History.push('/');
    };
};

export const resetPasswordRequest = (email) => {
    return (dispatch) => {
        axios.post(`${API_URL}/users/reset`, {email})
            .then(() => {
                dispatch({
                    type: type.SUCCESS,
                    payload: {name: 'SUCCESS', message: 'We sent an email to you. Please check your email.'}
                });
            })
            .catch(error => dispatch(error));
    };
};

export const resetPassword = ({token, password}) => {
    return (dispatch) => {
        axios.post(`${API_URL}/users/reset-password`, {newPassword: password}, {
                headers: {authorization: token}
            })
            .then(() => {
                dispatch({
                    type: type.SUCCESS,
                    payload: {name: 'SUCCESS', message: 'You has been changed your password successfully.'}
                });
                setTimeout(() => {
                    History.push('/signin');
                }, 1500);
            })
            .catch(error => dispatch(error));
    };
};

function computeUser(user) {
    user = user || {roles: []};
    user.isAdmin = user.roles.find(x => x.name === 'admin');
    user.isEditor = user.roles.find(x => x.name === 'editor');
    user.isManager = user.roles.find(x => x.name === 'manager');
    user.isWorker = user.roles.find(x => x.name === 'worker');
    user.icon = user.isAdmin ? 'fas fa-user-astronaut'
        : user.isEditor ? 'fa fa-user-secret'
            : user.isManager || user.isWorker ? 'fa fa-user-tie' : 'fa fa-user';
    if (typeof user.image === 'object') {
        user.image.thumb = FILE_URL + user.image.normal;
        user.image.normal = FILE_URL + user.image.normal;
        user.image.url = FILE_URL + user.image.url;
    } else {
        user.image = {
            thumb: 'http://holder.ninja/50x50,P.svg',
            normal: 'http://holder.ninja/250x250,PROFILE.svg',
            url: 'http://holder.ninja/500x500,PROFILE.svg'
        };
    }
    if (typeof user.cover === 'object') {
        user.cover.thumb = FILE_URL + user.cover.normal;
        user.cover.normal = FILE_URL + user.cover.normal;
        user.cover.url = FILE_URL + user.cover.url;
    } else {
        user.cover = {
            thumb: 'http://holder.ninja/400x120,COVER-1200x360.svg',
            normal: 'http://holder.ninja/1200x360,COVER-1200x360.svg',
            url: 'http://holder.ninja/1200x360,COVER-1200x360.svg'
        };
    }
    return user;
}

export const getUser = (uid) => {
    console.log('getUser uid');
    console.log(uid);
    return new Promise((resolve, reject) => {
        axios.get(`${API_URL}/users/${uid}`, {
                headers: {authorization: localStorage.getItem('token')}
            })
            .then(response => {
                resolve(computeUser(response.data));
            })
            .catch(error => {
                reject(error.response.data.error);
            });
    });
};

export const getTosText = () => {
    return new Promise((resolve, reject) => {
        axios.get(`${API_URL}/statics?filter[where][title]=Terms%20of%20Service`)
            .then(function(response) {
                if (cookie.get('local') === 'it') {
                    resolve(response.data[0].textIT);
                } else if (cookie.get('local') === 'cz') {
                    resolve(response.data[0].textCZ);
                } else {
                    resolve(response.data[0].text);
                }
            })
            .catch(function(error) {
                // handle error
                console.log(error);
            })
            .finally(function() {
                // always executed
            });
    });
};

export const getTosTitle = () => {
    return new Promise((resolve, reject) => {
        axios.get(`${API_URL}/statics?filter[where][title]=Terms%20of%20Service`)
            .then(function(response) {
                if (cookie.get('local') === 'it') {
                    resolve(response.data[0].titleIT);
                } else if (cookie.get('local') === 'cz') {
                    resolve(response.data[0].titleCZ);
                } else {
                    resolve(response.data[0].title);
                }
            })
            .catch(function(error) {
                // handle error
                console.log(error);
            })
            .finally(function() {
                // always executed
            });
    });
};

export const getPrivacyTitle = () => {
    return new Promise((resolve, reject) => {
        axios.get(`${API_URL}/statics?filter[where][title]=Privacy%20Policy`)
            .then(function(response) {
                if (cookie.get('local') === 'it') {
                    resolve(response.data[0].titleIT);
                } else if (cookie.get('local') === 'cz') {
                    resolve(response.data[0].titleCZ);
                } else {
                    resolve(response.data[0].title);
                }
            })
            .catch(function(error) {
                // handle error
                console.log(error);
            })
            .finally(function() {
                // always executed
            });
    });
};

export const getPrivacyText = () => {
    return new Promise((resolve, reject) => {
        axios.get(`${API_URL}/statics?filter[where][title]=Privacy%20Policy`)
            .then(function(response) {
                if (cookie.get('local') === 'it') {
                    resolve(response.data[0].textIT);
                } else if (cookie.get('local') === 'cz') {
                    resolve(response.data[0].textCZ);
                } else {
                    resolve(response.data[0].text);
                }
            })
            .catch(function(error) {
                // handle error
                console.log(error);
            })
            .finally(function() {
                // always executed
            });
    });
};

export const getAboutText = () => {
    return new Promise((resolve, reject) => {
        axios.get(`${API_URL}/statics?filter[where][title]=About`)
            .then(function(response) {
                if (cookie.get('local') === 'it') {
                    resolve(response.data[0].textIT);
                } else if (cookie.get('local') === 'cz') {
                    resolve(response.data[0].textCZ);
                } else {
                    resolve(response.data[0].text);
                }
            })
            .catch(function(error) {
                // handle error
                console.log(error);
            })
            .finally(function() {
                // always executed
            });
    });
};

export const getAboutTitle = () => {
    return new Promise((resolve, reject) => {
        axios.get(`${API_URL}/statics?filter[where][title]=About`)
            .then(function(response) {
                if (cookie.get('local') === 'it') {
                    resolve(response.data[0].titleIT);
                } else if (cookie.get('local') === 'cz') {
                    resolve(response.data[0].titleCZ);
                } else {
                    resolve(response.data[0].title);
                }
            })
            .catch(function(error) {
                // handle error
                console.log(error);
            })
            .finally(function() {
                // always executed
            });
    });
};

export const fetchUser = (id) => {
    return (dispatch) => {
        axios.get(`${API_URL}/users/${id}`, {
                headers: {authorization: localStorage.getItem('token')}
            })
            .then(response => {
                dispatch({type: type.DATA, payload: computeUser(response.data)});
            })
            .catch(error => dispatch(error));
    };
};

export const searchUserByName = async (name) => {
    const query = JSON.stringify({where: {name: {like: name, options: 'i'}}});
    try {
        const response = await axios.get(`${API_URL}/users?filter=${query}`, {
            headers: {authorization: localStorage.getItem('token')}
        });
        console.log('searchUserByName', response);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getProfile = (username) => {
    return (dispatch) => {
        axios.get(`${API_URL}/users/profile/${username}`, {
                headers: {authorization: localStorage.getItem('token')}
            })
            .then(response => {
                dispatch({type: type.DATA, payload: computeUser(response.data.user)});
            })
            .catch(error => {
                dispatch(errorBeautifier(error));
            });
    };

    // return new Promise((resolve, reject) => {
    //     axios.get(`${API_URL}/users/profile/${username}`, {
    //         headers: {authorization: localStorage.getItem('token')}
    //     })
    //         .then(response => {
    //             resolve(computeUser(response.data.user))
    //         })
    //         .catch(error => {
    //             reject(error.response.data.error)
    //         });
    // });
};

export const getSession = (callback) => {
    const token = localStorage.getItem('token');
    const me = sessionStorage.getItem('me');
    if (token) {
        if (me) {
            callback(JSON.parse(me));
        } else {
            getUser(localStorage.getItem('uid'))
                .then((response) => {
                    callback(setSession(response));
                })
                .catch((error) => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('uid');
                    localStorage.removeItem('ttl');
                    window.location.reload(true);
                    throw error;
                });
        }
    } else {
        callback(null);
    }
};

export const addUser = (data) => {
    /*{
        "username": "string",
        "name": "string",
        "surname": "string",
        "ip": "string",
        "adminVerified": false,
        "status": true,
        "realm": "string",
        "email": "string",
        "emailVerified": true,
        "id": "string",
        "created": "$now",
        "modified": "$now"
    }*/
    return (dispatch) => {
        axios.post(`${API_URL}/users`, data)
            .then(() => {
                History.push('/users');
            })
            .catch(error => dispatch(error));
    };
};

export const settingsAccount = (data) => {
    return (dispatch) => {
        axios.patch(`${API_URL}/users/${UID}`, data,
            {headers: {authorization: TOKEN}}
            )
            .then(response => {
                dispatch({type: type.AUTH_USER, payload: setSession(computeUser(response.data))});
                dispatch({
                    type: type.SUCCESS,
                    payload: {name: 'SUCCESS', message: 'Your account has been updated successfully!'}
                });
            })
            .catch(error => dispatch(error));
    };
};

export const settingsChangePassword = ({oldPassword, newPassword}) => {
    return (dispatch) => {
        axios.post(`${API_URL}/users/change-password`, {oldPassword, newPassword},
            {headers: {authorization: localStorage.getItem('token')}}
            )
            .then(() => {
                dispatch({
                    type: type.SUCCESS,
                    payload: {name: 'SUCCESS', message: 'Your password has been changed successfully!'}
                });
            })
            .catch(error => dispatch(error));
    };
};

export const getUsers = () => {
    return (dispatch) => {
        axios.get(`${API_URL}/users/`, {
                headers: {authorization: localStorage.getItem('token')}
            })
            .then(response => {
                dispatch({type: type.DATA, payload: response.data.map(user => computeUser(user))});
            })
            .catch(error => dispatch(error));
    };
};

export const updateUser = async (data) => {
    await axios.patch(`${API_URL}/users/${data.id}`, data,
        {headers: {authorization: TOKEN}}
        )
        .then(response => {
            return response.data;
        })
        .catch(error => {
            throw error.response.data.error.message;
        });
};

export const toggleAdmin = (id, toggleType = 'Admin') => {
    return (dispatch) => {
        axios.post(`${API_URL}/users/${id}/toggle${toggleType}`, {id},
            {headers: {authorization: TOKEN}}
            )
            .then(response => {
                dispatch({type: type.DATA, payload: computeUser(response.data.data)});
            })
            .catch(error => {
                dispatch({
                    type: type.ERROR,
                    payload: error.response
                });
            });
    };
};

export const toggleEditor = (id) => {
    return toggleAdmin(id, 'Editor');
};

export const toggleManager = (id) => {
    return toggleAdmin(id, 'Manager');
};

export const toggleWorker = (id) => {
    return toggleAdmin(id, 'Worker');
};

export const toggleStatus = (id) => {
    return toggleAdmin(id, 'Status');
};

export const uploadCoverImage = (file) => {
    return async (dispatch) => {
        await axios.post(`${API_URL}/users/${UID}/cover`, file, {
                headers: {authorization: TOKEN},
                onUploadProgress: progressEvent => {
                    console.log(progressEvent.loaded, progressEvent.total);
                }
            })
            .then(response => {
                dispatch({type: type.AUTH_USER, payload: setSession(computeUser(response.data.user))});
            })
            .catch(error => dispatch(error));
    };
};

export const uploadProfileImage = (file) => {
    return async (dispatch) => {
        await axios.post(`${API_URL}/users/${UID}/image`, file, {
                headers: {authorization: TOKEN},
                onUploadProgress: progressEvent => {
                    console.log(progressEvent.loaded, progressEvent.total);
                }
            })
            .then(response => {
                dispatch({type: type.AUTH_USER, payload: setSession(computeUser(response.data.user))});
            })
            .catch(error => dispatch(error));
    };
};

process.on('unhandledRejection', function(err) {
    throw err;
});

process.on('uncaughtException', function(err) {
});

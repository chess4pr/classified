'use strict';


{/*


<VirtualHost *:3003>
ServerName vazoga.com
ServerAlias www.vazoga.com
ServerAdmin ar10n1na1r@gmail.com
ProxyPreserveHost On
ProxyRequests Off

ProxyPass / http://127.0.0.1:3003/
ProxyPassReverse / http://127.0.0.1:3003
</VirtualHost>

<VirtualHost *:80>

ServerName blog.vazoga.com
ServerAlias www.blog.vazoga.com
ServerAdmin me@example.com
#referring the user to the recipes application
DocumentRoot /var/www/html

<Directory /var/www/html>
Options Indexes FollowSymLinks MultiViews
AllowOverride All
Order allow,deny
allow from all
# Uncomment this directive is you want to see apache2's
# default start page (in /apache2-default) when you go to /
#RedirectMatch ^/$ /apache2-default/
</Directory>

ErrorLog ${APACHE_LOG_DIR}/error.log
CustomLog ${APACHE_LOG_DIR}/access.log combined

</VirtualHost>

*/}


const fs = require('fs');

module.exports = (app) => {
    if (!app.get('initialData')) return;

    const User = app.models.user;
    const Role = app.models.Role;
    const RoleMapping = app.models.RoleMapping;
    const Category = app.models.category;


// destination.txt will be created or overwritten by default.
    fs.copyFile('client/src/components/MyAds/style.css', 'client/node_modules/react-dropzone-uploader/dist/styles.css', (err) => {
        if (err) throw err;
        console.log('source src/components/MyAds/style.css was copied to destination node_modules/react-dropzone-uploader/dist/styles.css');
    });

    // create a user
    User.findOrCreate({where: {email: 'alexeybokarev@gmail.com'}},
        {
            name: 'Admin',
            surname: '-',
            username: 'admin',
            email: 'admin@4pr.ru',
            password: 'admin',
            emailVerified: true
        }
        , function (err, user) {
            if (err) console.log('ERROR', err);
            console.log('Created user:', user);

            //create the admin role
            Role.findOrCreate({where: {name: 'admin'}}, {
                name: 'admin'
            }, function (err, role) {
                if (err) console.log('ERROR', err);

                // make an admin user
                RoleMapping.findOrCreate({
                    where: {
                        principalId: user.id,
                        roleId: role.id
                    }
                }, {
                    principalType: RoleMapping.USER,
                    principalId: user.id,
                    roleId: role.id
                }, function (err, principal) {
                    if (err) console.log('ERROR', err);
                    console.log('Created principal:', principal);
                });
            });
        });

    User.findOrCreate({where: {email: 'editor@4pr.ru'}},
        {
            name: 'Editor',
            surname: '-',
            username: 'editor',
            email: 'editor@4pr.ru',
            password: 'editor',
            emailVerified: true
        }
        , function (err, user) {
            if (err) console.log('ERROR', err);
            console.log('Created user:', user);

            //create the editor role
            Role.findOrCreate({where: {name: 'editor'}}, {
                name: 'editor'
            }, function (err, role) {
                if (err) console.log('ERROR', err);

                // make an editor user
                RoleMapping.findOrCreate({
                    where: {
                        principalId: user.id,
                        roleId: role.id
                    }
                }, {
                    principalType: RoleMapping.USER,
                    principalId: user.id,
                    roleId: role.id
                }, function (err, principal) {
                    if (err) console.log('ERROR', err);
                    console.log('Created principal:', principal);
                });
            });
        });

    User.findOrCreate({where: {email: 'www.4pr.ru@gmail.com'}},
        {
            name: 'Manager',
            surname: '-',
            username: 'manager',
            email: 'manager@4pr.ru',
            password: 'manager',
            emailVerified: true
        }
        , function (err, user) {
            if (err) console.log('ERROR', err);
            console.log('Created user:', user);

            //create the editor role
            Role.findOrCreate({where: {name: 'manager'}}, {
                name: 'manager'
            }, function (err, role) {
                if (err) console.log('ERROR', err);

                // make an editor user
                RoleMapping.findOrCreate({
                    where: {
                        principalId: user.id,
                        roleId: role.id
                    }
                }, {
                    principalType: RoleMapping.USER,
                    principalId: user.id,
                    roleId: role.id
                }, function (err, principal) {
                    if (err) console.log('ERROR', err);
                    console.log('Created principal:', principal);
                });
            });
        });

    User.findOrCreate({where: {email: 'alexeybokarev@gmail.com'}},
        {
            name: 'Worker',
            surname: '-',
            username: 'worker',
            email: 'worker@4pr.ru',
            password: 'worker',
            emailVerified: true
        }
        , function (err, user) {
            if (err) console.log('ERROR', err);
            console.log('Created user:', user);

            //create the editor role
            Role.findOrCreate({where: {name: 'worker'}}, {
                name: 'worker'
            }, function (err, role) {
                if (err) console.log('ERROR', err);

                // make an editor user
                RoleMapping.findOrCreate({
                    where: {
                        principalId: user.id,
                        roleId: role.id
                    }
                }, {
                    principalType: RoleMapping.USER,
                    principalId: user.id,
                    roleId: role.id
                }, function (err, principal) {
                    if (err) console.log('ERROR', err);
                    console.log('Created principal:', principal);
                });
            });
        });


    User.findOrCreate({where: {email: 'user@4pr.ru'}},
        {
            name: 'User',
            surname: '-',
            username: 'user',
            email: 'user@4pr.ru',
            password: 'user',
            emailVerified: true
        }
        , function (err, user) {
            if (err) console.log('ERROR', err);
            console.log('Created user:', user);
        });
    /**
     * --------------------Category animals----------------------*/

    /*



    * */

    Category.findOrCreate({where: {publicname: 'animals'}},
        {
            local: 'cz',
            buysell: true,
            publicname: 'animals',
            icon: 'fa fa-firefox',
            name: 'zvirata',
            url: 'https://zvirata.bazos.cz/',
            active: true,
            parent: 'none',
            subcat: 'Akvarijní ryby,Drobní savci,Kočky,Koně,Koně - potřeby,Koně - služby,Psi,Ptactvo,Terarijní zvířata,Ostatní domácí,Krytí,Ztraceni a nalezeni,Chovatelské potřeby,Služby pro zvířata,Drůbež,Králíci,Ovce a kozy,Prasata,Skot,Ostatní hospodářská'
        }
        , function (err, category) {
            if (err) console.log('ERROR', err);
            console.log('Created category:', category);
        });

    Category.findOrCreate({where: {publicname: 'animals'}},
        {
            local: 'it',
            buysell: true,
            publicname: 'animals',
            icon: 'fa fa-firefox',
            name: 'animali',
            url: 'https://www.subito.it/annunci-italia/vendita/animali/',
            active: true,
            parent: 'none',
            subcat: 'Cane,Gatto,Pesce,Cavallo,Uccelli,Altro'
        }
        , function (err, category) {
            if (err) console.log('ERROR', err);
            console.log('Created category:', category);
        });

    Category.findOrCreate({where: {publicname: 'animals'}},
        {
            local: 'fr',
            buysell: true,
            publicname: 'animals',
            icon: 'fa fa-firefox',
            name: 'animaux',
            url: 'https://www.leboncoin.fr/animaux/offres/',
            active: true,
            parent: 'none',
            subcat: null
        }
        , function (err, category) {
            if (err) console.log('ERROR', err);
            console.log('Created category:', category);
        });

    /**
     * --------------------Category realty----------------------*/

    Category.findOrCreate({where: {publicname: 'realty'}},
        {
            local: 'cz',
            buysell: true,
            publicname: 'realty',
            icon: 'fa fa-building',
            name: 'realty',
            url: 'https://realty.bazos.cz/',
            active: true,
            parent: 'none',
            subcat: null
        }
        , function (err, category) {
            if (err) console.log('ERROR', err);
            console.log('Created category:', category);
        });

    Category.findOrCreate({where: {publicname: 'realty'}},
        {
            local: 'it',
            buysell: true,
            publicname: 'realty',
            icon: 'fa fa-building',
            name: 'immobili',
            url: 'https://www.subito.it/annunci-italia/vendita/immobili/',
            active: true,
            parent: 'none',
            subcat: null
        }
        , function (err, category) {
            if (err) console.log('ERROR', err);
            console.log('Created category:', category);
        });

    Category.findOrCreate({where: {publicname: 'realty'}},
        {
            local: 'fr',
            buysell: true,
            publicname: 'realty',
            icon: 'fa fa-building',
            name: 'immobilier',
            url: 'https://www.leboncoin.fr/_immobilier_/offres/',
            active: false,
            parent: 'none',
            subcat: null
        }
        , function (err, category) {
            if (err) console.log('ERROR', err);
            console.log('Created category:', category);
        });

    /**
     * --------------------Category kids----------------------*/

    Category.findOrCreate({where: {publicname: 'kids'}},
        {
            local: 'cz',
            buysell: true,
            publicname: 'kids',
            icon: 'fa fa-child',
            name: 'děti',
            url: 'https://deti.bazos.cz/',
            active: true,
            parent: 'none',
            subcat: null
        }
        , function (err, category) {
            if (err) console.log('ERROR', err);
            console.log('Created category:', category);
        });

    Category.findOrCreate({where: {publicname: 'kids'}},
        {
            local: 'it',
            buysell: true,
            publicname: 'kids',
            icon: 'fa fa-child',
            name: 'bambini',
            url: 'https://www.subito.it/annunci-italia/vendita/bambini-giocattoli/',
            active: true,
            parent: 'none',
            subcat: null
        }
        , function (err, category) {
            if (err) console.log('ERROR', err);
            console.log('Created category:', category);
        });

    /**
     * --------------------Category jobs----------------------*/

    Category.findOrCreate({where: {publicname: 'jobs'}},
        {
            local: 'cz',
            buysell: false,
            publicname: 'jobs',
            icon: 'fa fa-pencil',
            name: 'prace',
            url: 'https://prace.bazos.cz/',
            active: true,
            parent: 'none',
            subcat: null
        }
        , function (err, category) {
            if (err) console.log('ERROR', err);
            console.log('Created category:', category);
        });

    Category.findOrCreate({where: {publicname: 'jobs'}},
        {
            local: 'it',
            buysell: false,
            publicname: 'jobs',
            icon: 'fa fa-pencil',
            name: 'lavoro',
            url: 'https://www.subito.it/annunci-italia/vendita/lavoro/',
            active: true,
            parent: 'none',
            subcat: null
        }
        , function (err, category) {
            if (err) console.log('ERROR', err);
            console.log('Created category:', category);
        });

    Category.findOrCreate({where: {publicname: 'jobs'}},
        {
            local: 'fr',
            buysell: false,
            publicname: 'jobs',
            icon: 'fa fa-pencil',
            name: 'jobs',
            url: 'https://www.leboncoin.fr/offres_d_emploi/offres/',
            active: false,
            parent: 'none',
            subcat: null
        }
        , function (err, category) {
            if (err) console.log('ERROR', err);
            console.log('Created category:', category);
        });

    /**
     * --------------------Category auto----------------------*/

    Category.findOrCreate({where: {publicname: 'auto'}},
        {
            local: 'cz',
            buysell: true,
            publicname: 'auto',
            icon: 'fa fa-car',
            name: 'car',
            url: 'https://auto.bazos.cz/',
            active: true,
            parent: 'none',
            subcat: 'Alfa Romeo,Audi,BMW,Citroën,Dacia,Fiat,Ford,Honda,Hyundai,Chevrolet,Kia,Mazda,Mercedes-Benz,Mitsubishi,Nissan,Opel,Peugeot,Renault,Seat,Suzuki,Škoda,Toyota,Volkswagen,Volvo,Ostatní značky,Autorádia,GPS navigace,Havarovaná auta,Náhradní díly,Pneumatiky kola,Příslušenství,Tuning,Veteráni,Autobusy,Dodávky,Mikrobusy,Karavany vozíky,Nákladní auta,Pick-up,Stroje,Ostatní,Havarovaná,Náhradní díly'
        }
        , function (err, category) {
            if (err) console.log('ERROR', err);
            console.log('Created category:', category);
        });

    Category.findOrCreate({where: {publicname: 'auto'}},
        {
            local: 'it',
            buysell: true,
            publicname: 'auto',
            icon: 'fa fa-car',
            name: 'motor',
            url: 'https://www.subito.it/annunci-italia/vendita/auto/',
            active: true,
            parent: 'none',
            subcat: 'Utilitaria,Station Wagon,Monovolume,SUV/Fuoristrada,Cabrio,Coupé,City Car,Altro'
        }
        , function (err, category) {
            if (err) console.log('ERROR', err);
            console.log('Created category:', category);
        });

    Category.findOrCreate({where: {publicname: 'auto'}},
        {
            local: 'fr',
            buysell: true,
            publicname: 'autofr',
            icon: 'fa fa-car',
            name: 'voitures',
            url: 'https://www.leboncoin.fr/voitures/offres/',
            active: false,
            parent: 'none',
            subcat: null
        }
        , function (err, category) {
            if (err) console.log('ERROR', err);
            console.log('Created category:', category);
        });

    /**
     * --------------------Category motorcycles----------------------*/

    Category.findOrCreate({where: {publicname: 'motorcycles'}},
        {
            local: 'cz',
            buysell: true,
            publicname: 'motorcycles',
            icon: 'fa fa-motorcycle',
            name: 'motorky',
            url: 'https://motorky.bazos.cz/',
            active: true,
            parent: 'none',
            subcat: null
        }
        , function (err, category) {
            if (err) console.log('ERROR', err);
            console.log('Created category:', category);
        });

    Category.findOrCreate({where: {publicname: 'motorcycles'}},
        {
            local: 'it',
            buysell: true,
            publicname: 'motorcycles',
            icon: 'fa fa-motorcycle',
            name: 'moto',
            url: 'https://www.subito.it/annunci-italia/vendita/moto-e-scooter/',
            active: true,
            parent: 'none',
            subcat: null
        }
        , function (err, category) {
            if (err) console.log('ERROR', err);
            console.log('Created category:', category);
        });

    Category.findOrCreate({where: {publicname: 'motorcycles'}},
        {
            local: 'fr',
            buysell: true,
            publicname: 'motorcycles',
            icon: 'fa fa-motorcycle',
            name: 'motos',
            url: 'https://www.leboncoin.fr/motos/offres/',
            active: false,
            parent: 'none',
            subcat: null
        }
        , function (err, category) {
            if (err) console.log('ERROR', err);
            console.log('Created category:', category);
        });

    /**
     * --------------------Category machines----------------------*/

    Category.findOrCreate({where: {publicname: 'machines'}},
        {
            local: 'cz',
            buysell: true,
            publicname: 'machines',
            icon: 'fa fa-truck',
            name: 'stroje',
            url: 'https://stroje.bazos.cz/',
            active: true,
            parent: 'none',
            subcat: null
        }
        , function (err, category) {
            if (err) console.log('ERROR', err);
            console.log('Created category:', category);
        });

    Category.findOrCreate({where: {publicname: 'machines'}},
        {
            local: 'it',
            buysell: true,
            publicname: 'machines',
            icon: 'fa fa-truck',
            name: 'veicoli',
            url: 'https://www.subito.it/annunci-italia/vendita/veicoli-commerciali/',
            active: true,
            parent: 'none',
            subcat: null
        }
        , function (err, category) {
            if (err) console.log('ERROR', err);
            console.log('Created category:', category);
        });

    /**
     * --------------------Category machines----------------------*/

    Category.findOrCreate({where: {publicname: 'house'}},
        {
            local: 'cz',
            buysell: true,
            publicname: 'house',
            icon: 'fa fa-home',
            name: 'dum',
            url: 'https://dum.bazos.cz/',
            active: true,
            parent: 'none',
            subcat: null
        }
        , function (err, category) {
            if (err) console.log('ERROR', err);
            console.log('Created category:', category);
        });

    Category.findOrCreate({where: {publicname: 'house'}},
        {
            local: 'it',
            buysell: true,
            publicname: 'house',
            icon: 'fa fa-home',
            name: 'fai-da-te',
            url: 'https://www.subito.it/annunci-italia/vendita/giardino-fai-da-te/',
            active: true,
            parent: 'none',
            subcat: null
        }
        , function (err, category) {
            if (err) console.log('ERROR', err);
            console.log('Created category:', category);
        });

    /**
     * --------------------Category informatica----------------------*/

    Category.findOrCreate({where: {publicname: 'pc'}},
        {
            local: 'cz',
            buysell: true,
            publicname: 'pc',
            icon: 'fa fa-windows',
            name: 'pc',
            url: 'https://pc.bazos.cz/',
            active: true,
            parent: 'none',
            subcat: null
        }
        , function (err, category) {
            if (err) console.log('ERROR', err);
            console.log('Created category:', category);
        });

    Category.findOrCreate({where: {publicname: 'pc'}},
        {
            local: 'it',
            buysell: true,
            publicname: 'pc',
            icon: 'fa fa-windows',
            name: 'informatica',
            url: 'https://www.subito.it/annunci-italia/vendita/informatica/',
            active: true,
            parent: 'none',
            subcat: null
        }
        , function (err, category) {
            if (err) console.log('ERROR', err);
            console.log('Created category:', category);
        });

    /**
     * --------------------Category mobile----------------------*/

    Category.findOrCreate({where: {publicname: 'mobile'}}, //https://www.subito.it/annunci-italia/vendita/telefonia/
        {
            local: 'cz',
            buysell: true,
            publicname: 'mobile',
            icon: 'fa fa-mobile',
            name: 'mobil',
            url: 'https://mobil.bazos.cz/',
            active: true,
            parent: 'none',
            subcat: null
        }
        , function (err, category) {
            if (err) console.log('ERROR', err);
            console.log('Created category:', category);
        });

    Category.findOrCreate({where: {publicname: 'mobile'}},
        {
            local: 'it',
            buysell: true,
            publicname: 'mobile',
            icon: 'fa fa-mobile',
            name: 'telefonia',
            url: 'https://www.subito.it/annunci-italia/vendita/telefonia/',
            active: true,
            parent: 'none',
            subcat: null
        }
        , function (err, category) {
            if (err) console.log('ERROR', err);
            console.log('Created category:', category);
        });

    /**
     * --------------------Category photo----------------------*/

    Category.findOrCreate({where: {publicname: 'photo'}},
        {
            local: 'cz',
            buysell: true,
            publicname: 'photo',
            icon: 'fa fa-camera',
            name: 'foto',
            url: 'https://foto.bazos.cz/',
            active: true,
            parent: 'none',
            subcat: null
        }
        , function (err, category) {
            if (err) console.log('ERROR', err);
            console.log('Created category:', category);
        });

    Category.findOrCreate({where: {publicname: 'photo'}},
        {
            local: 'it',
            buysell: true,
            publicname: 'photo',
            icon: 'fa fa-camera',
            name: 'fotografia',
            url: 'https://www.subito.it/annunci-italia/vendita/fotografia/',
            active: true,
            parent: 'none',
            subcat: null
        }
        , function (err, category) {
            if (err) console.log('ERROR', err);
            console.log('Created category:', category);
        });

    /**
     * --------------------Category photo----------------------*/

    Category.findOrCreate({where: {publicname: 'electro'}},
        {
            local: 'cz',
            buysell: true,
            publicname: 'electro',
            icon: 'fa fa-tv',
            name: 'elektro',
            url: 'https://elektro.bazos.cz/',
            active: true,
            parent: 'none',
            subcat: null
        }
        , function (err, category) {
            if (err) console.log('ERROR', err);
            console.log('Created category:', category);
        });

    Category.findOrCreate({where: {publicname: 'electro'}},
        {
            local: 'it',
            buysell: true,
            publicname: 'electro',
            icon: 'fa fa-tv',
            name: 'audio-video',
            url: 'https://www.subito.it/annunci-italia/vendita/audio-video/',
            active: true,
            parent: 'none',
            subcat: null
        }
        , function (err, category) {
            if (err) console.log('ERROR', err);
            console.log('Created category:', category);
        });


    /**
     * --------------------Category photo----------------------*/

    Category.findOrCreate({where: {publicname: 'sport'}},
        {
            local: 'cz',
            buysell: true,
            publicname: 'sport',
            icon: 'fa fa-futbol-o',
            name: 'sportcz',
            url: 'https://sport.bazos.cz/',
            active: true,
            parent: 'none',
            subcat: null
        }
        , function (err, category) {
            if (err) console.log('ERROR', err);
            console.log('Created category:', category);
        });

    Category.findOrCreate({where: {publicname: 'sport'}},
        {
            local: 'it',
            buysell: true,
            publicname: 'sport',
            icon: 'fa fa-futbol-o',
            name: 'sportit',
            url: 'https://www.subito.it/annunci-italia/vendita/sport/',
            active: true,
            parent: 'none',
            subcat: null
        }
        , function (err, category) {
            if (err) console.log('ERROR', err);
            console.log('Created category:', category);
        });

    Category.findOrCreate({where: {publicname: 'music'}},
        {
            local: 'cz',
            buysell: true,
            publicname: 'music',
            icon: 'fa fa-music',
            name: 'hudba',
            url: 'https://hudba.bazos.cz/',
            active: true,
            parent: 'none',
            subcat: null
        }
        , function (err, category) {
            if (err) console.log('ERROR', err);
            console.log('Created category:', category);
        });

    Category.findOrCreate({where: {publicname: 'music'}},
        {
            local: 'it',
            buysell: true,
            publicname: 'music',
            icon: 'fa fa-music',
            name: 'strumenti',
            url: 'https://www.subito.it/annunci-italia/vendita/strumenti-musicali/',
            active: true,
            parent: 'none',
            subcat: null
        }
        , function (err, category) {
            if (err) console.log('ERROR', err);
            console.log('Created category:', category);
        });

    Category.findOrCreate({where: {publicname: 'tickets'}},
        {
            local: 'cz',
            buysell: true,
            publicname: 'tickets',
            icon: 'fa fa-plane',
            name: 'vstupenky',
            url: 'https://vstupenky.bazos.cz/',
            active: true,
            parent: 'none',
            subcat: null
        }
        , function (err, category) {
            if (err) console.log('ERROR', err);
            console.log('Created category:', category);
        });

    /**
     * --------------------Category books----------------------*/

    Category.findOrCreate({where: {publicname: 'books'}},
        {
            local: 'cz',
            buysell: true,
            publicname: 'books',
            icon: 'fa fa-book',
            name: 'knihy',
            url: 'https://knihy.bazos.cz/',
            active: true,
            parent: 'none',
            subcat: null
        }
        , function (err, category) {
            if (err) console.log('ERROR', err);
            console.log('Created category:', category);
        });

    Category.findOrCreate({where: {publicname: 'books'}},
        {
            local: 'it',
            buysell: true,
            publicname: 'books',
            icon: 'fa fa-book',
            name: 'libri',
            url: 'https://www.subito.it/annunci-italia/vendita/libri-riviste/',
            active: true,
            parent: 'none',
            subcat: null
        }
        , function (err, category) {
            if (err) console.log('ERROR', err);
            console.log('Created category:', category);
        });

    /**
     * --------------------Category furniture----------------------*/

    Category.findOrCreate({where: {publicname: 'furniture'}},
        {
            local: 'cz',
            buysell: true,
            publicname: 'furniture',
            icon: 'fa fa-cube',
            name: 'nabytek',
            url: 'https://nabytek.bazos.cz/',
            active: true,
            parent: 'none',
            subcat: null
        }
        , function (err, category) {
            if (err) console.log('ERROR', err);
            console.log('Created category:', category);
        });

    Category.findOrCreate({where: {publicname: 'furniture'}},
        {
            local: 'it',
            buysell: true,
            publicname: 'furniture',
            icon: 'fa fa-cube',
            name: 'arredamento',
            url: 'https://www.subito.it/annunci-italia/vendita/arredamento-casalinghi/',
            active: true,
            parent: 'none',
            subcat: null
        }
        , function (err, category) {
            if (err) console.log('ERROR', err);
            console.log('Created category:', category);
        });

    /**
     * --------------------Category clothing----------------------*/

    Category.findOrCreate({where: {publicname: 'clothing'}},
        {
            local: 'cz',
            buysell: true,
            publicname: 'clothing',
            icon: 'fa fa-user',
            name: 'obleceni',
            url: 'https://obleceni.bazos.cz/',
            active: true,
            parent: 'none',
            subcat: null
        }
        , function (err, category) {
            if (err) console.log('ERROR', err);
            console.log('Created category:', category);
        });

    Category.findOrCreate({where: {publicname: 'clothing'}},
        {
            local: 'it',
            buysell: true,
            publicname: 'clothing',
            icon: 'fa fa-user',
            name: 'abbigliamento',
            url: 'https://www.subito.it/annunci-italia/vendita/abbigliamento-accessori/',
            active: true,
            parent: 'none',
            subcat: null
        }
        , function (err, category) {
            if (err) console.log('ERROR', err);
            console.log('Created category:', category);
        });

    /**
     * --------------------Category services----------------------*/

    Category.findOrCreate({where: {publicname: 'services'}},
        {
            local: 'cz',
            buysell: false,
            publicname: 'services',
            icon: 'fa fa-cogs',
            name: 'sluzby',
            url: 'https://sluzby.bazos.cz/',
            active: true,
            parent: 'none',
            subcat: null
        }
        , function (err, category) {
            if (err) console.log('ERROR', err);
            console.log('Created category:', category);
        });

    Category.findOrCreate({where: {publicname: 'services'}},
        {
            local: 'it',
            buysell: false,
            publicname: 'services',
            icon: 'fa fa-cogs',
            name: 'servizi',
            url: 'https://www.subito.it/annunci-italia/vendita/servizi/',
            active: true,
            parent: 'none',
            subcat: null
        }
        , function (err, category) {
            if (err) console.log('ERROR', err);
            console.log('Created category:', category);
        });

    /**
     * --------------------Category other----------------------*/

    Category.findOrCreate({where: {publicname: 'other'}},
        {
            local: 'cz',
            buysell: false,
            publicname: 'other',
            icon: 'fa fa-magic',
            name: 'ostatni',
            url: 'https://ostatni.bazos.cz/',
            active: true,
            parent: 'none',
            subcat: null
        }
        , function (err, category) {
            if (err) console.log('ERROR', err);
            console.log('Created category:', category);
        });

    Category.findOrCreate({where: {publicname: 'other'}},
        {
            local: 'it',
            buysell: false,
            publicname: 'other',
            icon: 'fa fa-magic',
            name: 'hobby',
            url: 'https://www.subito.it/annunci-italia/vendita/hobby-collezionismo/',
            active: true,
            parent: 'none',
            subcat: ''
        }
        , function (err, category) {
            if (err) console.log('ERROR', err);
            console.log('Created category:', category);
        });
};

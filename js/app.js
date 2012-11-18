
// The code below uses require.js, a module system for javscript:
// http://requirejs.org/docs/api.html#define

require.config({
    baseUrl: 'js/lib',
    paths: {'jquery':
            ['//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min',
             'jquery']},

});

// Include the in-app payments API, and if it fails to load handle it
// gracefully.
// https://developer.mozilla.org/en/Apps/In-app_payments
require(['https://marketplace.cdn.mozilla.net/mozmarket.js'],
        function() {},
        function(err) {
            window.mozmarket = window.mozmarket || {};
            window.mozmarket.buy = function() {
                alert('The in-app purchasing is currently unavailable.');
            };
        });



// When you write javascript in separate files, list them as
// dependencies along with jquery
define("app", function(require) {

    var $ = require('jquery');

    // If using Twitter Bootstrap, you need to require all the
    // components that you use, like so:
    // require('bootstrap/dropdown');
    // require('bootstrap/alert');


    // Get the country data from localstorage or endpoint
    var countries_string = localStorage.getItem('country');
    var countries = null;
    if (countries_string) {
        countries = JSON.parse(countries_string);
    }
    else {
        $.getJSON('/country.json', function(data) {
            localStorage.setItem('country', JSON.stringify(data));
            countries = data;
        });
    }
    var fromcountry = $('#from_country');
    var tocountry = $('#to_country');

    $.each(countries['countries'], function(key, country) {
        fromcountry.append('<option value="' + country['id'] + '">' + country['name'] + '</option>');
        tocountry.append('<option value="' + country['id'] + '">' + country['name'] + '</option>');
    });



    // Hook up the installation button, feel free to customize how
    // this works

    var install = require('install');

    function updateInstallButton() {
        $(function() {
            var btn = $('.install-btn');
            if(install.state == 'uninstalled') {
                btn.show();
            }
            else if(install.state == 'installed' || install.state == 'unsupported') {
                btn.hide();
            }
        });
    }

    $(function() {
        $('.install-btn').click(install);
    });

    install.on('change', updateInstallButton);

    install.on('error', function(e, err) {
        // Feel free to customize this
        $('.install-error').text(err.toString()).show();
    });

    install.on('showiOSInstall', function() {
        // Feel free to customize this
        var msg = $('.install-ios-msg');
        msg.show();

        setTimeout(function() {
            msg.hide();
        }, 8000);
    });

});

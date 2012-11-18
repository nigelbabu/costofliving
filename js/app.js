
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

    var fromcountry = $('#from_country');
    var tocountry = $('#to_country');
    var salary = $('#salary');


    // Get the country data from localstorage or endpoint
    var countries_string = localStorage.getItem('country');
    var countries = null;
    if (countries_string) {
        countries = JSON.parse(countries_string);
    }
    else {
        $.getJSON('country.json', function(data) {
            localStorage.setItem('country', JSON.stringify(data));
            countries = data;
        });
    }

    $.each(countries['countries'], function(key, country) {
        fromcountry.append('<option value="' + country['id'] + '">' + country['name'] + '</option>');
        tocountry.append('<option value="' + country['id'] + '">' + country['name'] + '</option>');
    });

    $('form').submit(function (event) {
        event.preventDefault();
        if (salary.attr('value') === '') {
            salary.addClass('error');
            $('#error_salary').removeClass('hidden');
            $('#error_salary').addClass('error');
        } else {
            $('#error_salary').removeClass('error');
            $('#error_salary').addClass('hidden');
            salary.removeClass('error');
            var salary_num = salary.attr('value');
            var from_country_data = [];
            var to_country_data = [];
            $.each(countries['countries'], function(key, country) {
                if(country['id'] === Number(fromcountry.attr('value'))) {
                    from_country_data = country;
                }
                if(country['id'] === Number(tocountry.attr('value'))) {
                    to_country_data = country;
                }
            });
            var equivalent_salary = (Number(salary_num) / from_country_data['ppp']) * to_country_data['ppp'];
            console.log("In " + to_country_data['name'] + ", you should get " + equivalent_salary + " in local currency.");
            $('.result').html("In " + to_country_data['name'] + ", you should get " + Math.round(equivalent_salary * 100)/100 + " in local currency.");
        }
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

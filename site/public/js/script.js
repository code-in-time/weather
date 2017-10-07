'use strict';

/**
 * The object for the application.
 **/
var w = {

    /**
     * This will contain a reference to the html in the DOM as
     * a jQuery object.
     **/
    elem: null,

    /**
     * The data from the geo location.
     **/
    geoData: null,

    /**
     * Build insert the HTML and insert them into the DOM.
     **/
    buildElements: function () {
        // The template as a jQuery object.
        var tmpl = $(
            '<div class="box">' +
                '<div class="itemWeather">' +
                    // The class loader will be added here
                    // as '<div class="loader"></div>'

                    // The data will be added here.
                '</div>' +
                '<div class="itemBtn">' +
                    '<button class="btnRefresh" disabled>refresh</button>' +
                '</div>' +
            '</div>'
        );

        // Bind the click event.
        $('button.btnRefresh', tmpl).click(this, function(e){
            // The weather data.
            e.data.getWeatherData();
        });

        // Insert the template into the DOM and save a reference to it
        // in the object.
        this.elem = $('div#app').append(tmpl);
    },

    /**
     * Get the location.
     **/
    getLocation: function () {
        var success, error;

        /**
         * The succcess callback.
         * @param pos - the geo location data.
         **/
        success = function (pos) {

            // Save the geo location data.
            this.geoData = pos; 
            // Fetch and insert the weather data into the DOM.
            this.getWeatherData();
        };

        /**
         * The error callback.
         * @param - err the error object
         **/
        error = function (err) {
            // Show error.
            $('div.itemWeather', this.elem)
                .html('<div class="error">'+err.message+'</div>');
            // Remove the  refresh button.
            $('div.itemBtn', this.elem).remove();
        };

        // Check if geolocation is supported.
        if (navigator.geolocation) {
            // Get the geolocation.
            navigator.geolocation.getCurrentPosition(
                success.bind(this),
                error.bind(this),
                {
                    enableHighAccuracy: true,
                    timeout: 1000000,
                    maximumAge: 0 
                }
            );

        } else {
            // Show error.
            $('div.itemWeather', this.elem)
                .html('<div class="error">Location is not supported</div>');
                // Remove the  refresh button.
                $('div.itemBtn', this.elem).remove();
        }
    },

    /**
     * Fetch and insert the weather data into the DOM.
     **/
    getWeatherData: function () {
        var lon = this.geoData.coords.longitude,
            lat = this.geoData.coords.latitude,
            appid = '6b05c34ea14c2bd9c46598687baee510',
            // The div in the DOM that will hold the rros and the weather data.
            itemWeather = $('div.itemWeather', this.elem),
            // The div in the DOM that holds the button.
            itemBtn = $('div.itemBtn', this.elem),
            // The refresh button.
            btnRefresh = $('button.btnRefresh', itemBtn);

        // Call the API.
        $.ajax({
            url: 'http://api.openweathermap.org/data/2.5/weather' +
                               '?units=metric&lat='+lat+'&lon='+lon+'&appid='+appid,
            method: "GET",
            cache: false,
            context: this,
            beforeSend: function() {
                // Show loader.
                itemWeather.html('<div class="loader"></div>');
                // Disable the refresh button.
                btnRefresh.attr('disabled', true);
            },
            success: function(data) {
                // Add the data to the DOM.
                itemWeather.html(
                    '<div class="row">'+data.name+'</div>' +
                    '<div class="row">temp: '+data.main.temp+'</div>' +
                    '<div class="row">min: '+data.main.temp+'</div>' +
                    '<div class="row">'+data.weather[0].description+'</div>'
                );
            },
            error:function (jqXHR, textStatus, errorThrown ) {
                // Show error.
                itemWeather.html(
                    '<div class="error">There was an error fetching the weather</div>');
            },
            complete: function() {
                // Remove the loader;
                $('div.loader', itemWeather).remove();
                // Enable the refresh button.
                btnRefresh.attr('disabled', false);
            },
        });
    },

    /**
     * Start the application.
     **/
    start: function () {
        // Build the DOM elements.
        this.buildElements();
        // Get location.
        this.getLocation();
    }
};

/**
 * Wait for the document to finsh loading.
 **/
$(document).ready(function() {
    // Begin.
    w.start();
});


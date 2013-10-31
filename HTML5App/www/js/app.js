var app = {
    homeViewModel: null,
    takeAPictureViewModel: null,
    moviesViewModel: null,
    localTheatersViewModel: null,
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // `load`, `deviceready`, `offline`, and `online`.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);

        $('#theater').on("pageshow", function () {
            app.showTheaters();
        });
    },
    onDeviceReady: function () {
        app.homeViewModel = new HomeViewModel(window.device);

        ko.applyBindings(app.homeViewModel, $("#index")[0]);
        ko.applyBindings(TakeAPictureViewModel, $("#camera")[0]);
        ko.applyBindings(SettingsViewModel, $("#theaterSettings")[0]);
        ko.applyBindings(LocalTheatersViewModel, $('#theater')[0]);

        app.showMovies();
        ko.applyBindings(MoviesViewModel, $('#movie')[0]);
    },
    showMovies: function () {
        $.ajax({
            url: "http://imdbapi.org/?title=Ghostbusters&type=json&plot=full&episode=0&limit=10&yg=0&mt=none&lang=en-US&offset=&aka=simple&release=simple&business=0&tech=0",
            dataType: "json",
            cache: false,
            success: function (data) {
                var movieModels = [];

                data.forEach(function (element) {
                    movieModels.push({
                        Id: element.imdb_id,
                        Name: element.title,
                        Description: element.plot_simple,
                        Rating: element.rating,
                        Poster: element.poster ? element.poster.cover : ""
                    });
                });

                MoviesViewModel.movies(movieModels);
            }
        });
    },
    showTheaters: function () {
        navigator.geolocation.getCurrentPosition(mapService.onSuccess, mapService.onError, {
            maximumAge: Infinity,
            // higher timeout is necessary
            timeout: 50000,
            // Needs to be set to true to work on older android devices
            enableHighAccuracy: true
        });
    }
};

var HomeViewModel = function (device) {
    this.name = ko.observable(device.name);
    this.cordova = ko.observable(device.cordova);
    this.platform = ko.observable(device.platform);
    this.uuid = ko.observable(device.uuid);
    this.version = ko.observable(device.version);
    this.sendMessage = function () {
        navigator.notification.alert("I'm bacon.", self.AlertDismissed, "Bacon", "Crispy");
    };
};

var TakeAPictureViewModel = {
    takePicture: function () {
        navigator.camera.getPicture(function (imageUrl) {
            $("#putPictureHere").attr("src", imageUrl);
        }, function (error) {
            alert("Error: " + error.code + " - " + error.message);
        }, { destinationType: navigator.camera.DestinationType.FILE_URI });
    }
};

var LocalTheatersViewModel = {
    theaters: ko.observableArray([])
};

var MoviesViewModel = {
    movies: ko.observableArray([])
};

var SettingsViewModel = {
    radius:
        [
            { text: "5 Miles", meters: "8045" },
            { text: "10 Miles", meters: "16090" },
            { text: "15 Miles", meters: "24135" },
            { text: "20 Miles", meters: "32180" },
            { text: "25 Miles", meters: "40225" },
            { text: "30 Miles", meters: "48270" }
        ],
    chosenRadius: ko.observable()
};

var mapService = {
    onSuccess: function (position) {
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;

        mapService.initialize(lat, lng);
    },
    onError: function () {
        mapService.initialize(-33.8665433, 151.1956316);
    },
    initialize: function (lat, lng) {
        var map,
            service,
            location = new google.maps.LatLng(lat, lng);

        map = new google.maps.Map($('#map')[0], {
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            center: location,
            zoom: 15
        });

        var request = {
            location: location,
            radius: SettingsViewModel.chosenRadius().meters,
            types: ['movie_theater']
        };

        service = new google.maps.places.PlacesService(map);
        service.search(request, function (results, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                LocalTheatersViewModel.theaters(results);
                $('#listoftheaters').listview('refresh');
            }
        });
    }
};
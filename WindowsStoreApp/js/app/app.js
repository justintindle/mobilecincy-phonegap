var HomeViewModel = function (data) {
    var self = this;
    
    if (data) {
        self.name = ko.observable(data.model);
        self.phonegap = ko.observable(data.cordova);
        self.platform = ko.observable(data.platform);
        self.uuid = ko.observable(data.uuid);
        self.version = ko.observable(data.version);
    } else {
        self.name = ko.observable();
        self.phonegap = ko.observable();
        self.platform = ko.observable();
        self.uuid = ko.observable();
        self.version = ko.observable();
    }
    
    self.sendMessage = function() {
        if (navigator.notification)
            navigator.notification.alert("I'm bacon.", self.AlertDismissed, "Bacon", "Crispy");
        else
            alert("Unable to load phonegap.");
    };
};

var TakeAPictureViewModel = {
    takePicture: function () {
        if (navigator.camera)
            navigator.camera.getPicture(function(imageUrl) {
                $("#putPictureHere").attr("src", imageUrl);
            }, function(message) {
                alert("Error: " + message);
            }, { destinationType: navigator.camera.DestinationType.FILE_URI });
        else
            alert("Unable to load phonegap.");
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

var app = {
    homeViewModel: null,
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // `load`, `deviceready`, `offline`, and `online`.
    bindEvents: function () {
        if(navigator.camera)
            document.addEventListener('deviceready', this.onDeviceReady, false);
        else
            document.addEventListener('DOMContentLoaded', this.onDeviceReady, false);
    },
    onDeviceReady: function () {
        setTimeout(function () {
            if (window.device) {
                ko.applyBindings(new HomeViewModel(window.device), $("#index")[0]);
            } else {
                alert("No device found!");
                ko.applyBindings(new HomeViewModel(), $("#index")[0]);
            }
        }, 1000);
    },
    showMovies: function() {
        $.ajax({
            url: "http://imdbapi.org/?title=Ghostbusters&type=json&plot=full&episode=0&limit=10&yg=0&mt=none&lang=en-US&offset=&aka=simple&release=simple&business=0&tech=0",
            dataType: "json",
            cache: false,
            success: function(data) {
                var movieModels = [];

                data.forEach(function(element) {
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
        


        navigator.geolocation.getCurrentPosition(mapMessageService.onSuccess, function() {
            return;
        }, {
            maximumAge: Infinity,
            // higher timeout is necessary
            timeout: 50000,
            // Needs to be set to true to work on older android devices
            enableHighAccuracy: true
        });
    }
};

var mapMessageService = {
    onSuccess: function(position) {
        var frame = document.getElementById("mapFrame");

        var coordinates = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            radius: SettingsViewModel.chosenRadius().meters
        };

        frame.contentWindow.postMessage(JSON.stringify(coordinates), "*");

        window.addEventListener("message", function(message) {
            var results = JSON.parse(message.data);
            
            LocalTheatersViewModel.theaters(results);
            $('#listoftheaters').listview('refresh');
        });
    }
}
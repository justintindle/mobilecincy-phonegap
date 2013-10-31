var mapService = {
    onSuccess: function (position) {
        mapService.initialize(position);
    },
    onError: function () {
        var position = {
            lat: -33.8665433,
            lng: 151.1956316,
            radius: "8045"
        };
        
        mapService.initialize(position);
    },
    initialize: function (position) {
        var map,
            service,
            location = new google.maps.LatLng(position.lat, position.lng);

        map = new google.maps.Map(document.getElementById('map'), {
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            center: location,
            zoom: 15
        });

        var request = {
            location: location,
            radius: position.radius,
            types: ['movie_theater']
        };

        service = new google.maps.places.PlacesService(map);
        service.search(request, function (results, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                window.parent.postMessage(JSON.stringify(results), "*");
            }
        });
    }
};

window.addEventListener("message", function (message) {
    mapService.onSuccess(JSON.parse(message.data));
});
(function ($, p) {
    var pageBindings = [
       { name: "camera", viewModel: TakeAPictureViewModel },
        {
            name: "theater",
            viewModel: LocalTheatersViewModel,
            action: function () {
                ko.applyBindings(SettingsViewModel, $("#theaterSettings")[0]);
            }
        },
        {
            name: "movie",
            viewModel: MoviesViewModel,
            action: function() {
                app.showMovies();
            }
        }
    ];

    function loaderShow() {
        $.mobile.loading('show', {
            text: 'Loading...',
            textVisible: true,
            theme: 'e'
        });
    }

    function loaderCallback() {
        $.mobile.loading('hide');
    };

    function getBinding(pageId) {
        var binding;

        pageBindings.forEach(function (pageBinding) {
            if (pageBinding.name == pageId)
                binding = pageBinding;
        });

        return binding;
    };

    $("#theater").on("pageshow", function() {
        app.showTheaters();
    });

    $(document).on("pageshow", function (event, data) {
        var pageId = $.mobile.activePage.attr('id');
        var binding = getBinding(pageId);

        if(binding)
            if (!knockoutHelper.isBound(pageId)) {
                ko.applyBindings(binding.viewModel, $("#" + pageId)[0]);
                
                if(binding.action)
                    binding.action();
            }
    });
})(jQuery, navigator);
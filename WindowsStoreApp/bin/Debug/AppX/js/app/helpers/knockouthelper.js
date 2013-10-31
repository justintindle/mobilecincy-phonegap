var knockoutHelper = (function (knockout) {
    this.isBound = function (id) {
        return !!knockout.dataFor(document.getElementById(id));
    };

    return this;
})(ko);
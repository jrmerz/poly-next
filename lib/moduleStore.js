var store = {};

var api = {
    set : function(path, data) {
        store[path] = data;
    },
    get : function(path) {
        return store[path];
    }
}

module.exports = api;
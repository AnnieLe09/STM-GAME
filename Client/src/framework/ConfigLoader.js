var ConfigLoader = cc.Class.extend({});
ConfigLoader.load = function(context, config){
    Object.keys(config).forEach(function(key) {
        context[key] = config[key];
    });
};
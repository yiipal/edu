/**
 * Created by Renk on 2018/12/18.
 */
window.renk = (function ($) {
  var pub = {
    initModule: function (module) {
      if (module.isActive !== undefined && !module.isActive) {
        return;
      }
      if ($.isFunction(module.init)) {
        module.init();
      }
      $.each(module, function () {
        if ($.isPlainObject(this)) {
          pub.initModule(this);
        }
      });
    },

    init: function () {
    },

    getPrototype: function(child, parent) {
      var prototype = object(parent.prototype);
      prototype.constructor = child;
      child.prototype = prototype;
      return child;
    },

    /**
     * Returns the URL of the current page without params and trailing slash. Separated and made public for testing.
     * @returns {string}
     */
    getBaseCurrentUrl: function () {
      return window.location.protocol + '//' + window.location.host;
    },

    /**
     * Returns the URL of the current page. Used for testing, you can always call `window.location.href` manually
     * instead.
     * @returns {string}
     */
    getCurrentUrl: function () {
      return window.location.href;
    }
  };
  function object(o) {
    function F() {}
    F.prototype = o;
    return new F();
  };
  return pub;
})(window.jQuery);

window.jQuery(function () {
  window.renk.initModule(window.renk);
});
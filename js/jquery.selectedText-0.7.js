/**
* selectedText v0.7
* https://github.com/Lugat/selectedText
*
* Copyright 2010, Lukas Rydygel
* Attribution-ShareAlike 3.0 Unported (CC BY-SA 3.0)
* http://creativecommons.org/licenses/by-sa/3.0/
*/
;(function($, window, document, undefined) {

  var PLUGIN_NAME = 'selectedText',
      PLUGIN_VERSION = '0.7',

  DEFAULT_OPTIONS = {
    min: 0,
    max: 0,
    start: function() {},
    selecting: function() {},
    stop: function() {}
  };

  function Plugin(element, options) {

    this.name = PLUGIN_NAME;
    this.version = PLUGIN_VERSION;
    this.defaultOptions = DEFAULT_OPTIONS;
    this.element = element;
    this.$element = $(element);
    this.pressed = false;
    this._setOptions(options);
    this.init();

  }

  Plugin.prototype._setOptions = function(options) {
    this.options = $.extend({}, DEFAULT_OPTIONS, options);
  };

  Plugin.prototype._getOptions = function() {
    return this.options;
  };

  Plugin.prototype.options = function(options) {
    return (typeof options === 'object') ? this._setOptions([options]) : this._getOptions();
  };

  Plugin.prototype.init = function () {

    var that = this;

    this.$element.bind('mousedown', function(e) {
      that._start(e);
    }).bind('mousemove', function(e) {
      that._selecting(e);
    }).bind('mouseup', function(e) {
      that._stop(e);
    });

  };

  Plugin.prototype._start = function(e) {

    this.pressed = true;
    this.options.start(e);

  };

  Plugin.prototype._selecting = function(e) {

    var text = this._getSelectedText();

    if (this._checkLength(text.length) && this.pressed) {
      this.options.selecting(text, e)
    };

  };

  Plugin.prototype._stop = function(e) {

    var text = this._getSelectedText();

    if (this._checkLength(text.length) && this.pressed) {
      this.options.stop(text, e);
    }

    this.pressed = false;

  };

  Plugin.prototype._checkLength = function(length) {

    if (this.options.min <= 0 && this.options.max <= 0) {
      return true;
    } else if (this.options.min > 0 && this.options.max == 0) {
      return (length >= this.options.min) ? true : false;
    } else if (this.options.min == 0 && this.options.max > 0) {
      return (length <= this.options.max) ? true : false;
    } else if (this.options.min > 0 && this.options.max >= this.options.min) {
      return (length >= this.options.min && length <= this.options.max) ? true : false;
    }

  };

  Plugin.prototype._getSelectedText = function() {

    if (window.getSelection) {
      return window.getSelection().toString();
    } else if (document.getSelection) {
      return document.getSelection();
    } else if (document.selection) {
      return document.selection.createRange().text;
    }

    return null;

  },

  Plugin.prototype.destroy = function() {
    this.$element.unbind('mousedown mousemove mouseup');
  };

  $.fn[PLUGIN_NAME] = function() {

    var args = arguments;

    return this.each(function() {

      var pluginObject = $(this).data('plugin_'+PLUGIN_NAME);

      if (!pluginObject && (typeof args[0] === 'object' || !args)) {
        $(this).data('plugin_'+PLUGIN_NAME, new Plugin(this, args[0]));
      } else if (typeof args[0] === 'string') {

        var method = args[0].replace('_', '');

        if (pluginObject[method]) {
          pluginObject[method].apply(pluginObject, Array.prototype.slice.call(args, 1));
        } else {
          alert('An error occured.');
        }

      } else {
        alert('An error occured.');
      }

    });

  }

}(jQuery, window, document));
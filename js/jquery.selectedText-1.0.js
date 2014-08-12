/**
* selectedText v1.0
* https://github.com/Lugat/selectedText
*
* Copyright (c) 2014 Squareflower Websolutions - Lukas Rydygel
* Licensed under the MIT license
*/
;(function($, window, document, undefined) {

  var PLUGIN_NAME = 'selectedText',
      PLUGIN_VERSION = '1.0',
      PLUGIN_OPTIONS = {
        min: 0,
        max: 0,
        start: function() {},
        selecting: function() {},
        stop: function() {}
      };
      
  function Plugin(options, element) {
    
    this.name = PLUGIN_NAME;
    this.version = PLUGIN_VERSION;        
    this.opt = PLUGIN_OPTIONS;

    this.element = element;
    this.$element = $(element);
    
    this.pressed = false;
      
    this.setOptions(options);
    
    this._init();
    
  };
  
  Plugin.prototype = {
    
    _init: function() {
      
      this.$element.bind('mousedown', (function(e) {
        this._start(e);
      }).bind(this)).bind('mousemove', (function(e) {
        this._selecting(e);
      }).bind(this)).bind('mouseup', (function(e) {
        this._stop(e);
      }).bind(this));
      
    },
    
    setOptions: function(options) {
        this.opt = $.extend(true, {}, this.opt, options);
    },

    getOptions: function() {
        return this.opt;
    },

    options: function(options) {
        return typeof options === 'object' ? this.setOptions(options) : this.getOptions();
    },

    option: function(option, value) {
      if (typeof option === 'string' && this.opt[option]) {
        if (value === undefined) {
          return this.opt[option];
        } else {
          this.opt[option] = value;
        }
      }
    },
    
    _start: function(e) {

      this.pressed = true;
      this.opt.start(e);

    },

    _selecting: function(e) {

      var text = this._getSelectedText();

      if (this._checkLength(text.length) && this.pressed) {
        this.opt.selecting(text, e)
      };

    },

    _stop: function(e) {

      var text = this._getSelectedText();

      if (this._checkLength(text.length) && this.pressed) {
        this.opt.stop(text, e);
      }

      this.pressed = false;

    },

    _checkLength: function(length) {

      if (this.opt.min <= 0 && this.opt.max <= 0) {
        return true;
      } else if (this.opt.min > 0 && this.opt.max === 0) {
        return length >= this.opt.min;
      } else if (this.opt.min === 0 && this.opt.max > 0) {
        return length <= this.opt.max;
      } else if (this.opt.min > 0 && this.opt.max >= this.opt.min) {
        return length >= this.opt.min && length <= this.opt.max;
      }

    },

    _getSelectedText: function() {

      if (window.getSelection) {
        return window.getSelection().toString();
      } else if (document.getSelection) {
        return document.getSelection();
      } else if (document.selection) {
        return document.selection.createRange().text;
      }

      return null;

    },

    destroy: function() {
      this.$element.unbind('mousedown mousemove mouseup');
    }
    
  };
  
  $.widget.bridge(PLUGIN_NAME, Plugin);

}(jQuery, window, document));
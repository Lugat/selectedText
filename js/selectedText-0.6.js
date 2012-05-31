/**
 * selectedText v0.6
 * http://squareflower.de/downloads/jquery/selectedText/
 *
 * Copyright 2010, Lukas Rydygel
 * Attribution-ShareAlike 3.0 Unported
 * http://creativecommons.org/licenses/by-sa/3.0/
 */
(function($){
    
    $.selectedText = function(method) {
	$(document).selectedText(method);
    };
    
    $.fn.selectedText = function(method) {

        var FN = function() {},
            SETTINGS = 'selectedText-settings',
            MOUSEDOWN = 'mousedown',
            MOUSEMOVE = 'mousemove',
            MOUSEUP = 'mouseup',
            OBJECT = 'object',

        settings = {
            min: 0,
            max: 0,
            start: FN,
            selecting: FN,
            stop: FN
        },

	pressed = false,
        
        methods = {

            _setOptions: function(options) {

                $.extend(true, settings, options);

                $(this).data(SETTINGS, settings);

            },

            _getOptions: function() {
                return $(this).data(SETTINGS);
            },

            options: function(options) {
                return (typeof options === OBJECT) ? methods._setOptions.apply(this, [options]) : methods._getOptions.apply(this);
            },

            init: function(options) {

                methods._setOptions.apply(this, [options]);

                this.bind(MOUSEDOWN, function(e) {
                    methods._start(e);
                }).bind(MOUSEMOVE, function(e) {
                    methods._selecting(e);
                }).bind(MOUSEUP, function(e) {
                    methods._stop(e);
                });

            },

            _start: function(e) {

                pressed = true;

                settings.start(e);

            },

            _selecting: function(e) {

                var text = methods._getSelectedText();
                
                (methods._checkLength(text.length) && pressed) ? settings.selecting(text, e) : null;

            },

            _stop: function(e) {

                var text = methods._getSelectedText();

                (methods._checkLength(text.length) && pressed) ? settings.stop(text, e) : null;

                pressed = false;

            },

            _checkLength: function(length) {

                if (settings.min <= 0 && settings.max <= 0) {
                    return true;
                } else if (settings.min > 0 && settings.max == 0) {
                    return (length >= settings.min) ? true : false;
                } else if (settings.min == 0 && settings.max > 0) {
                    return (length <= settings.max) ? true : false;
                } else if (settings.min > 0 && settings.max >= settings.min) {
                    return (length >= settings.min && length <= settings.max) ? true : false;
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
                this.unbind(MOUSEDOWN+' '+MOUSEMOVE+' '+MOUSEUP);
            }
            
        };
        
        if (methods[method]) {

            settings = methods._getOptions.apply(this);

            methods[method].apply(this, Array.prototype.slice.call(arguments, 1));

        } else if (typeof method === OBJECT || !method) {
            methods.init.apply(this, arguments);
        }
	
    };

})(jQuery);
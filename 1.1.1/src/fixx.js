"use strict";

/* start ƒ utilities */
var ƒ = ƒ || {}, fixx = ƒ;

ƒ.debug = {
    isOn: false,
    logLevel: 0, // 0 -> all  // 1 -> errors  // 2 -> warning  // 3 -> info only
    log: function (logObj) {
        if (!this.isOn) { return; }
        if (typeof logObj === 'object') {
            var type = typeof logObj.type !== 'undefined' ? logObj.type : 'log',
                logLevel = typeof logObj.logLevel !== 'undefined' ? logObj.logLevel : 0,
                log = typeof logObj.log !== 'undefined' ? logObj.log : null;

            if (log === null) { return; }
            else {
                if (this.logLevel === 0 || this.logLevel === logObj.logLevel) {
                    typeof window.console === 'object' ? console[logObj.type](logObj.log) : alert(logObj.log);
                }
            }
        }
        else if (typeof logObj === 'string') {
            typeof window.console === 'object' ? console.log(logObj) : alert(logObj);
        }
    }
};

ƒ.init = function () {

    this.version = '1.1.1';
    this.copyright = 'Get Kraken Ltd.'

    if (typeof $ === 'undefined') {
        ƒ.debug.log({ type: 'error', logLevel: 1, log: 'No jQuery found on page. [required]' });
        throw new Error('Missing Dependency', 'No jquery found.');
    }

    $(document).ready(function () {
        ƒ.window.init();
        if (typeof ƒ.init.callback === 'function') { ƒ.init.callback() };
    });

    return { callback: this.init.callback = typeof arguments !== 'undefined' && arguments.length === 1 && typeof arguments[0] === 'function' ? arguments[0] : null };

};

// pubsub pattern https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern
(function (ƒ, $) {

    var o = $({});

    ƒ.subscribe = function () {
        o.on.apply(o, arguments);
    };

    ƒ.unsubscribe = function () {
        o.off.apply(o, arguments);
    };

    ƒ.publish = function () {
        o.trigger.apply(o, arguments);
    };

}(fixx, jQuery));

ƒ.browser = function () {

    var _private = {
        dataOs: [
            { string: navigator.userAgent, subString: 'iPhone', identity: 'iPhone' },
            { string: navigator.userAgent, subString: 'iPad', identity: 'iPad' },
            { string: navigator.userAgent, subString: 'Sym', identity: 'SymbianOS' },
            { string: navigator.userAgent, subString: 'Andr', identity: 'Android' },
            { string: navigator.userAgent, subString: 'BlackB', identity: 'BlackBerry' },
            { string: navigator.userAgent, subString: 'RIM', identity: 'BlackBerry Tablet' },
            { string: navigator.userAgent, subString: '(BB', identity: 'BlackBerry' },
            { string: navigator.userAgent, subString: 'Silk', identity: 'Kindle' },
            { string: navigator.userAgent, subString: 'MeeGo', identity: 'MeeGo OS' },
            { string: navigator.userAgent, subString: 'Windows Phone', identity: 'Windows Phone' },
            { string: navigator.platform, subString: 'Win', identity: 'Windows' },
            { string: navigator.platform, subString: 'Mac', identity: 'Mac' },
            { string: navigator.platform, subString: 'Linux', identity: 'Linux' }
        ],
        dataBrowser: [
            { string: navigator.userAgent, subString: 'OPR', identity: 'Opera', versionSearch: 'OPR' },
            { string: navigator.userAgent, subString: 'Edge', identity: 'Edge', versionSearch: 'Edge' },
            { string: navigator.userAgent, subString: 'Chrome', identity: 'Chrome' },
            { string: navigator.userAgent, subString: 'OmniWeb', versionSearch: 'OmniWeb/', identity: 'OmniWeb' },
            { string: navigator.vendor, subString: 'Apple', identity: 'Safari', versionSearch: 'Version' },
            { prop: window.opera, identity: 'Opera', versionSearch: 'Version' },
            { string: navigator.vendor, subString: 'iCab', identity: 'iCab' },
            { string: navigator.vendor, subString: 'KDE', identity: 'Konqueror' },
            { string: navigator.userAgent, subString: 'Firefox', identity: 'Firefox' },
            { string: navigator.vendor, subString: 'Camino', identity: 'Camino' },
            { string: navigator.userAgent, subString: 'iPhone', identity: 'WebKit', versionSearch: 'Version' },
            { string: navigator.userAgent, subString: 'iPad', identity: 'WebKit', versionSearch: 'Version' },
            { string: navigator.userAgent, subString: 'RIM', identity: 'WebKit', versionSearch: 'Version' },
            { string: navigator.userAgent, subString: '(BB', identity: 'WebKit', versionSearch: 'Version' },
            { string: navigator.userAgent, subString: 'Silk', identity: 'WebKit', versionSearch: 'Silk' },
            { string: navigator.userAgent, subString: 'NokiaBrowser', identity: 'WebKit', versionSearch: 'NokiaBrowser' },
            { string: navigator.userAgent, subString: 'SM-', identity: 'WebKit', versionSearch: 'Version' },
            { string: navigator.userAgent, subString: 'GT-', identity: 'WebKit', versionSearch: 'Version' },
            { string: navigator.userAgent, subString: 'Netscape', identity: 'Netscape' /* for newer Netscapes (6+) */ },
            { string: navigator.userAgent, subString: 'MSIE', identity: 'Explorer', versionSearch: 'MSIE' },
            { string: navigator.userAgent, subString: 'Trident', identity: 'Explorer', versionSearch: 'rv' },
            { string: navigator.userAgent, subString: 'Gecko', identity: 'Mozilla', versionSearch: 'rv' },
            { string: navigator.userAgent, subString: 'Mozilla', identity: 'Netscape', versionSearch: 'Mozilla' /* for older Netscapes (4-) */ }
        ],
        searchString: function (data) {
            for (var i = 0, iLoops = data.length; i < iLoops; i++) {
                var dataString = data[i].string;
                var dataProp = data[i].prop;
                if (dataString) {
                    if (dataString.indexOf(data[i].subString) !== -1) {
                        return data[i].identity;
                    }
                } else if (dataProp) {
                    return data[i].identity;
                }
            }
            return null;
        },
        searchVersion: function (ua, data) {
            var versionSearchString = '', index = -1;
            for (var i = 0, iLoops = data.length; i < iLoops; i++) {
                var dataString = data[i].string;
                var dataProp = data[i].prop;
                versionSearchString = data[i].versionSearch || data[i].identity;
                if (dataString) {
                    if (dataString.indexOf(data[i].subString) !== -1) {
                        break;
                    }
                } else if (dataProp) {
                    break;
                }
            }

            index = ua.indexOf(versionSearchString);
            return index > -1 ? parseFloat(ua.substring(index + versionSearchString.length + 1)) : null;
        }
    };

    var is = {
        IE: function () {
            return Boolean(ƒ.browser.is.ltIE11() || ƒ.browser.is.IE11() || ƒ.browser.is.Edge() || ƒ.browser.name() === 'Explorer');
        },
        ltIE8: function () {
            return Boolean(document.all && !document.querySelector);
        },
        IE8: function () {
            return Boolean(document.all && document.querySelector && !document.addEventListener);
        },
        gtIE8: function () {
            return Boolean(document.all && document.addEventListener || ƒ.browser.is.IE11());
        },
        IE9: function () {
            return Boolean(ƒ.browser.name() === 'Explorer' && ƒ.browser.version() === 9);
        },
        IE10: function () {
            return Boolean(ƒ.browser.name() === 'Explorer' && ƒ.browser.version() === 10);
        },
        gteIE10: function () {
            return Boolean(document.body.style.msTouchAction !== undefined);
        },
        ltIE11: function () {
            return Boolean( /*@cc_on!@*/false);
        },
        IE11: function () {
            return Boolean(ƒ.browser.name() === 'Explorer' && ƒ.browser.version() > 10);
        },
        Edge: function () {
            return Boolean(ƒ.browser.name() === 'Edge' && ƒ.browser.version() > 10);
        },
        mobile: function () {
            var useragent = navigator.userAgent || navigator.vendor || window.opera || null;
            var regex1 = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i;
            var regex2 = /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i;

            if (!useragent) {
                ƒ.debug.log({ type: 'error', logLevel: 1, log: 'Could not detect browser useragent.' });
                return null;
            } else {
                return regex1.test(useragent) || regex2.test(useragent.substr(0, 4));
            }
        },
        desktop: function (breakpoint) {
            breakpoint = parseInt(breakpoint, 10) || 1024;
            return !ƒ.browser.is.mobile() && ƒ.window.get.viewportSize().width >= breakpoint;
        }
    };

    var name = function () {
        return _private.searchString(_private.dataBrowser) || 'unknown browser';
    };

    var version = function () {
        return _private.searchVersion(navigator.userAgent, _private.dataBrowser) ||
            _private.searchVersion(navigator.appVersion, _private.dataBrowser) ||
            'unknown version';
    };

    var os = function () {
        return _private.searchString(_private.dataOs) || 'unknown OS';
    };

    return {
        is: is, name: name, version: version, os: os
    };

}();

ƒ.collections = {

    fileTypes: {

        // office docs
        'doc': true, 'docx': true, 'xls': true, 'xlsx': true, 'ppt': true, 'pptx': true, 'pps': true,

        // images
        'jpg': true, 'jpeg': true, 'tif': true, 'tiff': true, 'png': true, 'apng': true, 'gif': true, 'bmp': true, 'svg': true,

        // text
        'txt': true, 'rtf': true, 'xps': true,

        // adobe
        'pdf': true, 'psd': true, 'ai': true, 'eps': true,

        // video
        'mp4': true, 'm4a': true, 'm4p': true, 'mpg': true, 'mpeg': true, 'avi': true,
        'wmv': true, 'divx': true, 'xvid': true, 'rm': true, 'flv': true, 'mkv': true, 'ogg': true, 'ogv': true, 'webm': true,
        'mov': true, 'qt': true,

        // audio
        'wav': true, 'wma': true, 'ra': true, 'mp3': true, 'flac': true, 'oga': true,

        // archives
        'zip': true, 'rar': true, 'tgz': true, 'tar': true,

        // web/code formats
        // set to true only if you want events for normal internal links that match common web fileTypes below.
        'htm': false, 'html': false, 'xhtml': false, 'shtml': false,
        'asp': false, 'aspx': false, 'ascx': false,
        'rss': false, 'xml': false,
        'jsp': false, 'php': false, 'cfm': false,
        'css': false, 'js': false
    }

};

ƒ.static = {

    locale:
    {
        'en-gb': {
            months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        }
        ,
        'en-us': {
            months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        }
    }

};

ƒ.typeOf = {

    'Number': function (nr) { return typeof nr === 'number'; }
    ,
    'Function': function (fn) { return typeof fn === 'function'; }
    ,
    'String': function (str) { return typeof str === 'string'; }
    ,
    'Array': function (arr) { return Object.prototype.toString.call(arr) === '[object Array]'; }
    ,
    'Object': function (obj) { return Object.prototype.toString.call(obj) === '[object Object]'; }
    ,
    'Date': function (date) { return Object.prototype.toString.call(date) === '[object Date]'; }
    ,
    'Boolean': function (bool) { return typeof bool === 'boolean'; }
    ,
    'Null': function (val) { return val === null || val === false; }
    ,
    'Empty': function (val) { return val === ''; }
    ,
    'Undefined': function (obj) { return obj === void 0; }

};

ƒ.number = {
    typeOf: function (nr) {
        return ƒ.typeOf.Number(nr);
    },
    count: function (nr) {
        return String(nr).split('.').join('').split(',').join('').split(' ').join('').length;
    }
};

ƒ.object = {
    typeOf: function (obj) {
        return ƒ.typeOf.Object(obj);
    },
    count: function (obj) {
        if (!Object.keys) {
            var keys = [];
            for (var i in obj) {
                if (obj.hasOwnProperty(i)) {
                    keys.push(i);
                }
            }
            return keys.length;
        }
        else {
            return Object.keys(obj).length;
        }
    }
};

ƒ.string = {
    typeOf: function (str) {
        return ƒ.typeOf.String(str);
    }
    ,
    make: {
        guid: function () {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
        }
    },
    convert: {
        br2nl: function (txt) {
            return txt.replace(/<br\s?\/?>/g, '\n');
        }
        ,
        nl2br: function (txt) {
            return txt.replace(/\r\n|\r|\n/g, '<br />');
        }
    }
    ,
    contains: function (string, term) {

        string = string || '';
        term = term || '';

        var result;
        var searchTerm = term.toString();
        var searchString = string.toString();

        var stringCheck = searchString.indexOf(searchTerm);
        if (stringCheck !== -1) {
            result = true;
        } else {
            result = false;
        }
        return result;
    }
};

ƒ.url = {

    get: {
        parameter: function (parameter, url) {
            //search for a URL variable/parameter and return its value
            parameter = parameter.replace(/[\[]/, '\\\[').replace(/[\]]/, '\\\]');
            var regexS = '[\\?&]' + parameter + '=([^&#]*)';
            var regex = new RegExp(regexS);
            var urlStr = typeof url !== 'undefined' && ƒ.typeOf.String(url) ? url : window.location.href;
            // no warning issued if url is not a string -> will assume window.location.href
            var results = regex.exec(urlStr);
            return results === null ? '' : results[1];
        }
        ,
        toggleChar: function (url) {
            if (typeof ƒ.string !== 'undefined' && ƒ.string.contains !== 'undefined') {
                url = url || '';
                return ƒ.string.contains(url, '?') ? '&' : '?';
            }
            else {
                throw new Error('ƒ.url.get.toggleChar', 'ƒ.string.contains() is undefined [missing dependency]');
            }
        }
    },
    contains: function (term, toLower) {
        if (typeof ƒ.string !== 'undefined' && ƒ.string.contains !== 'undefined') {
            toLower = typeof toLower !== 'undefined' ? toLower : false;
            var pageUrl = document.url ? document.url : window.location ? window.location : "";
            pageUrl = toLower ? pageUrl.toString().toLowerCase() : pageUrl.toString();
            return ƒ.string.contains(pageUrl, term);
        }
        else {
            throw new Error('ƒ.url.contains', 'ƒ.string.contains() is undefined [missing dependency]');
        }
    }

};

ƒ.date = {
    parse: {
        'dd/mm/yyyy HH:MM:SS': function (dateString) {

            if (typeof dateString === 'undefined' || !dateString || dateString.length !== 19) {
                ƒ.debug.log({ type: 'error', logLevel: 1, log: 'Malformed date. Cannot parse from dd/mm/yyyy HH:MM:SS' });
                return null;
            }
            else {
                var dateTimeParts = dateString.split(' '),
                    dateParts = dateTimeParts[0].split('/'),
                    timeParts = dateTimeParts[1].split(':');

                return new Date(parseInt(dateParts[2], 10), parseInt(dateParts[1] - 1, 10), parseInt(dateParts[0], 10), parseInt(timeParts[0], 10), parseInt(timeParts[1], 10), parseInt(timeParts[2], 10));

            }
        }
        ,
        'YYYY-MM-DD': function (dateString) {

            if (typeof dateString === 'undefined' || !dateString || dateString.length !== 10) {
                ƒ.debug.log({ type: 'error', logLevel: 1, log: 'Malformed date. Cannot parse from YYYY-MM-DD' });
                return null;
            }
            else {
                dateString = dateString + '-'; // fix for when a duff ISOstr var is passed in (i.e. a non empty string that's not a date)
                var dateComponents = dateString.split('-'); // .split will fail without the above line
                return new Date(dateComponents[0], (dateComponents[1] - 1), dateComponents[2]);
            }
        }

    }
    ,
    convertTo:
    {
        'd M yyyy': function (args) {

            if (typeof args !== 'undefined' &&
                typeof args.date !== 'undefined' &&
                args.date instanceof Date &&
                typeof args.locale !== 'undefined' &&
                ƒ.static.locale[args.locale] !== 'undefined') {

                return args.date.getDate() + ' ' + ƒ.static.locale[args.locale].months[args.date.getMonth()] + ' ' + args.date.getFullYear();
            }
            else {
                ƒ.debug.log({ type: 'error', logLevel: 1, log: 'Malformed date or missing locale. Cannot parse from d M yyyy' });
                return '';
            }

        }
    }
    ,
    now: function () { return new Date(); }
};

ƒ.window = function () {
    var config = {

        delays: {
            resize: 0.15e3,
            scroll: 0.15e3
        },
        scroll: {
            trigger: {
                depth: 100 // pixels
            }
        }
        ,
        resize: {
            trigger: {
                depth: 75 // pixels
            }
        }
    };

    var get = {
        viewportSize: function () {
            var e = window, a = 'inner';
            if (!('innerWidth' in window)) {
                a = 'client';
                e = document.documentElement || document.body;
            }
            return { width: e[a + 'Width'], height: e[a + 'Height'] };
        }
        ,
        orientation: function () {
            return get.viewportSize().width >= $(window).outerHeight() ? 'landscape' : 'portrait';
        }
        ,
        rAF: function () {
            return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                function (callback) { window.setTimeout(callback, ƒ.window.config.delays.scroll); }
        }
    };

    var _private = {
        methods: { resize: [], breakpoint: [], scroll: [], waypoint: [], orientationchange: [] },
        resize: function () {

            ƒ.debug.log({ type: 'info', logLevel: 3, log: 'ƒ.window._private.resize() [raw event]' });

            try { clearTimeout($.data(this, 'resizeTimer')); } catch (e) { /**/ }; // helper to simulate resize end on x ms

            var currentViewport = ƒ.window.get.viewportSize();

            var xChange = Math.max(ƒ.window.width, currentViewport.width) - Math.min(ƒ.window.width, currentViewport.width);
            var yChange = Math.max(ƒ.window.height, currentViewport.height) - Math.min(ƒ.window.height, currentViewport.height);

            if (xChange > ƒ.window.config.resize.trigger.depth || yChange > ƒ.window.config.resize.trigger.depth) {
                _private.on.resize.call(this, {
                    x: currentViewport.width < ƒ.window.width ? 'narrower' : currentViewport.width === ƒ.window.width ? 'unchanged' : 'wider',
                    y: currentViewport.height < ƒ.window.height ? 'shorter' : currentViewport.height === ƒ.window.height ? 'unchanged' : 'taller'
                });
            }

            $.data(this, 'resizeTimer', setTimeout(function () { _private.on.resize(); }, ƒ.window.config.delays.resize));

        },
        scroll: function () {
            ƒ.debug.log({ type: 'info', logLevel: 3, log: 'ƒ.window._private.scroll() [raw event]' });

            try { clearTimeout($.data(this, 'scrollTimer')); } catch (e) { /**/ } // helper to simulate resize end on x ms

            // event throttling
            if (Math.max($(window).scrollTop(), _private.vars.scrollY) - Math.min($(window).scrollTop(), _private.vars.scrollY) > ƒ.window.config.scroll.trigger.depth) {
                _private.on.scroll.call(this, { direction: $(window).scrollTop() < _private.vars.scrollY ? 'up' : $(window).scrollTop() === _private.vars.scrollY ? 'unchanged' : 'down' });
            }

            $.data(this, 'scrollTimer', setTimeout(function () { _private.on.scroll(); }, ƒ.window.config.delays.scroll));

        },
        vars: {
            scrollY: $(window).scrollTop(),
            orientation: 'unknown'
        },
        on: {
            scroll: function () {
                ƒ.debug.log({ type: 'info', logLevel: 3, log: 'ƒ.window._private.scroll() [controlled event]' });

                for (var i = 0, iLoops = _private.methods.scroll.length; i < iLoops; i++) {
                    _private.methods.scroll[i].call(this, { direction: $(window).scrollTop() < _private.vars.scrollY ? 'up' : $(window).scrollTop() === _private.vars.scrollY ? 'unchanged' : 'down' });
                }

                _private.waypoint();
                _private.vars.scrollY = $(window).scrollTop();

            }
            ,
            resize: function () {

                ƒ.debug.log({ type: 'info', logLevel: 3, log: 'ƒ.window._private.resize() [controlled event]' });

                var currentViewport = ƒ.window.get.viewportSize();

                var xChange = Math.max(ƒ.window.width, currentViewport.width) - Math.min(ƒ.window.width, currentViewport.width);
                var yChange = Math.max(ƒ.window.height, currentViewport.height) - Math.min(ƒ.window.height, currentViewport.height);

                for (var i = 0, iLoops = _private.methods.resize.length; i < iLoops; i++) {
                    _private.methods.resize[i].call(this, {
                        x: currentViewport.width < ƒ.window.width ? 'narrower' : currentViewport.width === ƒ.window.width ? 'unchanged' : 'wider',
                        y: currentViewport.height < ƒ.window.height ? 'shorter' : currentViewport.height === ƒ.window.height ? 'unchanged' : 'taller'
                    });
                }

                ƒ.window.width = currentViewport.width;
                ƒ.window.height = currentViewport.height;
                ƒ.debug.log({ type: 'info', logLevel: 3, log: 'ƒ.window.width → ' + ƒ.window.width + ' | ƒ.window.height → ' + ƒ.window.height });
                _private.breakpoint();
                _private.on.orientationchange();
                ƒ.debug.log({ type: 'info', logLevel: 3, log: 'ƒ.window.get.orientation() → ' + ƒ.window.get.orientation() });

            }
            ,
            orientationchange: function () {

                var currentOrientation = get.orientation();

                if (_private.vars.orientation !== currentOrientation) {
                    _private.vars.orientation = currentOrientation;
                    _private.orientationchange();
                }

            }
        },
        breakpoint: function () {
            ƒ.debug.log({ type: 'info', logLevel: 3, log: 'ƒ.window._private.breakpoint()' });
            // check and run breakpoints
            for (var i = 0, iLoops = _private.methods.breakpoint.length; i < iLoops; i++) {

                var breakpoint = _private.methods.breakpoint[i];

                if (ƒ.object.count(breakpoint.range) === 1) {
                    if (typeof breakpoint.range.minWidth !== 'undefined' && ƒ.typeOf.Number(breakpoint.range.minWidth)) {
                        // minWidth only
                        if (ƒ.window.width >= breakpoint.range.minWidth) {
                            breakpoint.method.call();
                        } else if (breakpoint.failovers.length === 1) {
                            if (typeof breakpoint.failovers[0] === 'function') {
                                breakpoint.failovers[0].call();
                            } else {
                                ƒ.debug.log({ type: 'error', logLevel: 2, log: 'ƒ.window._private.breakpoint: minWidth failover is not a function.' });
                            }
                        }
                    } else if (typeof breakpoint.range.maxWidth !== 'undefined' && ƒ.typeOf.Number(breakpoint.range.maxWidth)) {
                        // maxWidth only
                        if (ƒ.window.width <= breakpoint.range.maxWidth) {
                            breakpoint.method.call();
                        } else if (breakpoint.failovers.length === 1) {
                            if (typeof breakpoint.failovers[0] === 'function') {
                                breakpoint.failovers[0].call();
                            } else {
                                ƒ.debug.log({ type: 'error', logLevel: 2, log: 'ƒ.window._private.breakpoint: maxWidth failover is not a function.' });
                            }
                        }
                    }
                } else if (ƒ.object.count(breakpoint.range) === 2 &&
                    typeof breakpoint.range.minWidth !== 'undefined' && ƒ.typeOf.Number(breakpoint.range.minWidth) &&
                    typeof breakpoint.range.maxWidth !== 'undefined' && ƒ.typeOf.Number(breakpoint.range.maxWidth)) {
                    // minWidth && maxWidth
                    if (breakpoint.range.minWidth <= breakpoint.range.maxWidth) {

                        if (ƒ.window.width >= breakpoint.range.minWidth && ƒ.window.width <= breakpoint.range.maxWidth) {
                            breakpoint.method.call();
                        } else if (ƒ.window.width < breakpoint.range.minWidth) {
                            if (breakpoint.failovers.length > 0) {
                                if (typeof breakpoint.failovers[0] === 'function') {
                                    breakpoint.failovers[0].call();
                                } else {
                                    ƒ.debug.log({ type: 'error', logLevel: 2, log: 'ƒ.window._private.breakpoint: ranged minWidth failover is not a function.' });
                                }
                            }
                        } else if (ƒ.window.width > breakpoint.range.maxWidth) {
                            if (breakpoint.failovers.length === 2) {
                                if (typeof breakpoint.failovers[1] === 'function') {
                                    breakpoint.failovers[1].call();
                                } else {
                                    ƒ.debug.log({ type: 'error', logLevel: 2, log: 'ƒ.window._private.breakpoint: ranged maxWidth failover is not a function.' });
                                }
                            }
                        }
                    } else {
                        ƒ.debug.log({ type: 'error', logLevel: 2, log: 'ƒ.window._private.breakpoint: minWidth breakpoint must be less than maxWidth breakpoint.' });
                    }

                } else {
                    ƒ.debug.log({ type: 'error', logLevel: 2, log: 'ƒ.window._private.breakpoint: malformed breakpoint parameters.' });
                }
            } // end for
        },
        waypoint: function () {
            ƒ.debug.log({ type: 'info', logLevel: 3, log: 'ƒ.window._private.waypoint()' });
            // check and run waypoints
            for (var i = 0, iLoops = _private.methods.waypoint.length; i < iLoops; i++) {

                var waypoint = _private.methods.waypoint[i], triggerOn;

                if (ƒ.object.count(waypoint.triggers) >= 2) {

                    triggerOn = ƒ.typeOf.Object(waypoint.triggers.trigger) ? $(waypoint.triggers.trigger).offset().top : waypoint.triggers.trigger;

                    if ((triggerOn - $(window).scrollTop()) < ($(window).height() * waypoint.triggers.depth)) {
                        if (!waypoint.triggers.once) {
                            waypoint.method.call(this, waypoint.triggers.trigger);
                        } else if (typeof waypoint.hasTriggerd === 'undefined') {
                            waypoint.hasTriggerd = true;
                            waypoint.method.call(this, waypoint.triggers.trigger);
                        }

                    }

                } else {
                    ƒ.debug.log({ type: 'error', logLevel: 2, log: 'ƒ.window._private.waypoint: malformed waypoint parameters.' });
                }
            } // end for

        },
        orientationchange: function () {
            ƒ.debug.log({ type: 'info', logLevel: 3, log: 'ƒ.window._private.orientationchange() [controlled event]' });
            for (var i = 0, iLoops = _private.methods.orientationchange.length; i < iLoops; i++) {

                if (_private.methods.orientationchange[i].orientation === 'any' || _private.methods.orientationchange[i].orientation === get.orientation()) {
                    _private.methods.orientationchange[i].method.call();
                }

            }
        }
    };

    var stack = function () {

        // TODO: named methods with guid fallbacks

        ƒ.debug.log({ type: 'info', logLevel: 3, log: 'ƒ.window.stack()' });

        // resize and scroll
        if (arguments.length === 2 && ƒ.typeOf.String(arguments[0]) &&
            (arguments[0] === 'resize' || arguments[0] === 'scroll') &&
            ƒ.typeOf.Function(arguments[1]) &&
            typeof _private.methods !== 'undefined' &&
            typeof _private.methods[arguments[0]] !== 'undefined') {
            _private.methods[arguments[0]].push(arguments[1]);
        }
        // orientationchange
        else if (arguments[0] === 'orientationchange' &&
            arguments.length > 1 &&
            arguments.length < 4 &&
            (typeof arguments[1] === 'function' || typeof arguments[2] === 'function') &&
            typeof _private.methods !== 'undefined' &&
            typeof _private.methods[arguments[0]] !== 'undefined') {

            var orientation = typeof arguments[1] === 'string' && (arguments[1] === 'landscape' || arguments[1] === 'portrait') ? arguments[1] : 'any';
            var method = typeof arguments[1] === 'function' ? arguments[1] : arguments[2];

            _private.methods[arguments[0]].push({ orientation: orientation, method: method });

        }
        // breakpoints
        else if (arguments[0] === 'breakpoint' &&
            arguments.length >= 3 &&
            ƒ.typeOf.Object(arguments[1]) &&
            ƒ.object.count(arguments[1]) > 0 &&
            ƒ.typeOf.Function(arguments[2]) &&
            typeof _private.methods !== 'undefined' &&
            typeof _private.methods[arguments[0]] !== 'undefined') {

            var hasFailovers = [];
            if (typeof arguments[3] !== 'undefined' && typeof arguments[3] === 'function') {
                hasFailovers.push(arguments[3]);
            }
            if (typeof arguments[4] !== 'undefined' && typeof arguments[4] === 'function') {
                hasFailovers.push(arguments[4]);
            }

            _private.methods[arguments[0]].push({ range: arguments[1], method: arguments[2], failovers: hasFailovers });

        }
        // waypoints // TODO $.each
        else if (arguments[0] === 'waypoint' &&
            arguments.length === 3 &&
            ƒ.typeOf.Object(arguments[1]) &&
            ƒ.object.count(arguments[1]) > 0 &&
            ƒ.typeOf.Function(arguments[2]) &&
            typeof _private.methods !== 'undefined' &&
            typeof _private.methods[arguments[0]] !== 'undefined') {

            if (typeof arguments[1].triggerOn !== 'undefined' &&
                typeof arguments[1].triggerDepth !== 'undefined' &&
                (ƒ.typeOf.Object(arguments[1].triggerOn) || ƒ.typeOf.Number(arguments[1].triggerOn)) &&
                ƒ.typeOf.Number(arguments[1].triggerDepth) &&
                (arguments[1].triggerDepth >= 0 && arguments[1].triggerDepth <= 1)
            ) {

                _private.methods[arguments[0]].push({
                    triggers: {
                        trigger: arguments[1].triggerOn,
                        depth: arguments[1].triggerDepth,
                        once: typeof arguments[1].triggerOnce === 'undefined' ? true :
                            typeof arguments[1].triggerOnce !== 'undefined' && arguments[1].triggerOnce ? true :
                                typeof arguments[1].triggerOnce !== 'undefined' && !arguments[1].triggerOnce ? false :
                                    false
                    },
                    method: arguments[2]
                });

            } else {
                throw new Error('ƒ.window.stack', 'Malformed waypoint data');
            }

        } else {
            throw new Error('ƒ.window.stack', 'Malformed input data');
        }
    };

    var unstack = function () {
        ƒ.debug.log({ type: 'info', logLevel: 3, log: 'ƒ.window.unstack()' });
        // TODO if (arguments.length === 2) { // i.e. named breakpoint/stacks unstack('breakpoint','name');
        if (arguments.length === 1) {
            if (typeof arguments[0] === 'string' && typeof _private.methods[arguments[0]] !== 'undefined') {
                _private.methods[arguments[0]] = [];
            } else {
                throw new Error('ƒ.window.unstack', 'Method to be unstacked is not supported');
            }
        } else if (arguments.length === 0) {
            for (var method in _private.methods) {
                _private.methods[method] = [];
                // no need to check hasOwnProperty as we don't extend the object prototype anywhere in ƒ
            }
        }

    };

    var init = function () {
        ƒ.debug.log({ type: 'info', logLevel: 3, log: 'ƒ.window.init()' });

        // fix for iOS window resize triggered on scroll
        this.width = 0; // initial value to detect first load
        this.height = 0; // initial value to detect first load
        _private.vars.orientation = get.orientation();
        $(window).resize(function () { _private.resize(); }).trigger('resize');
        $(window).scroll(function () { _private.scroll(); }).trigger('scroll');
    };

    return { config: config, init: init, get: get, stack: stack, unstack: unstack };
}();

ƒ.stack = ƒ.window.stack || {}; // alias

ƒ.storage = {
    caniuse: {
        sessionStorage: function () {
            var test = typeof window.sessionStorage !== 'undefined' ? true : false;
            if (!test) { ƒ.debug.log({ type: 'error', logLevel: 2, log: 'Browser does not support sessionStorage.' }); }
            return test;
        }
        ,
        localStorage: function () {
            var test = typeof window.localStorage !== 'undefined' ? true : false;
            if (!test) { ƒ.debug.log({ type: 'error', logLevel: 2, log: 'Browser does not support localStorage.' }); }
            return test;
        }
        ,
        cookie: function () {
            var test = (navigator.cookieEnabled) ? true : false;
            if (typeof navigator.cookieEnabled === 'undefined' && !test) {
                document.cookie = 'testcookie';
                test = (document.cookie.indexOf('testcookie') !== -1) ? true : false;
            }
            if (!test) { ƒ.debug.log({ type: 'error', logLevel: 2, log: 'Browser does not support cookies or have cookies disabled.' }); }
            return test;
        }
    },
    // start cookie abstraction 

    cookie:
    {
        namespace: 'fixx_',

        create: function (name, value, days, raw) { // TODO make _private
            var prefix = typeof raw === 'undefined' ? this.namespace : '', expires;
            if (days) {
                var date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires = '; expires=' + date.toUTCString();
            }
            else { expires = ''; }
            document.cookie = prefix + name + '=' + value + expires + '; path=/';
            return true;
        },

        read: function (name, raw) { // TODO make _private
            var prefix = typeof raw === 'undefined' ? this.namespace : '';
            var nameEq = prefix + name + '=';
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) === ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEq) === 0) return c.substring(nameEq.length, c.length);
            }

            return null;

        },

        erase: function (name, raw) { // TODO make _private
            var prefix = typeof raw === 'undefined' ? this.namespace : '';
            document.cookie = prefix + name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
            return true;
        }
        ,
        init: function (cookiesArrObj) {

            try { ƒ.cookies = {}; } catch (e) { console.error('ƒ.storage.cookie.init() error: ƒ object not defined'); }

            if (ƒ.typeOf.Array(cookiesArrObj) && ƒ.typeOf.Object(ƒ.cookies)) {
                if (cookiesArrObj.length > 0) {
                    for (var i = 0, iloops = cookiesArrObj.length; i < iloops; i++) {
                        if (typeof cookiesArrObj[i]['name'] !== 'undefined') {
                            ƒ.cookies[cookiesArrObj[i]['name']] = new ƒ.storage.cookie.instance(cookiesArrObj[i]);
                        }
                    }
                }
            }
            else {
                throw new Error('ƒ.storage.cookie.init(initData)', 'Malformed initData [empty or not an array].');
            }
        }
        ,
        instance: function (cookie) {

            /* possible dataTypes
            * 'boolean'
            * 'date'
            * 'string'
            * 'integer'
            * 'float'
            **/

            // set defaults
            cookie.name = typeof cookie.name === 'undefined' ? 'cookie' : cookie.name;
            cookie.data = typeof cookie.data === 'undefined' ? null : cookie.data;
            cookie.type = typeof cookie.type === 'undefined' ? 'string' : cookie.type;
            cookie.expire = typeof cookie.expire === 'undefined' ? 0 : cookie.expire;

            this.cookieName = cookie.name;
            this.data = cookie.data;

            this.setType = function (dataType) { // TODO this.prototype.xyz = 

                dataType = dataType.toLowerCase();

                if (dataType === 'boolean'
                    || dataType === 'date'
                    || dataType === 'string'
                    || dataType === 'integer'
                    || dataType === 'float'
                    || dataType === 'object'
                ) {
                    this.dataType = dataType;
                    return true;
                }
                else {
                    return false;
                }
            };

            this.setExpireTime = function (expireTime) { // TODO this.prototype.xyz = 

                var expireInDays = parseInt(expireTime, 10);

                if (isNaN(expireInDays) || expireInDays > 365) {
                    this.expireTime = 0; /* expire with session */
                    console.error('cookie.instance setExpireTime Error: Invalid expire time');
                    return false;
                    /* only ints from 0 to 365 */
                }
                else {
                    this.expireTime = expireInDays;
                    return true;
                }

            };

            this.read = function () { // TODO this.prototype.xyz = 
                var cookieData = ƒ.storage.cookie.read(this.cookieName);

                if (cookieData) {

                    switch (this.dataType) {
                        case 'boolean':
                            this.data = cookieData.toLowerCase() === 'true' || parseInt(cookieData, 10) === 1 ? true : false;
                            return true; /* do not use JS Boolean() | will return true even for the string 'false' causing always true */

                        case 'date':
                            this.data = new Date(cookieData);
                            return true;

                        case 'string':
                            this.data = String(cookieData);
                            return true;

                        case 'integer':
                            this.data = Number(parseInt(cookieData, 10));
                            return true;

                        case 'float':
                            this.data = Number(parseFloat(cookieData));
                            return true;

                        case 'object':
                            if (ƒ.encoding.caniuse.JSON()) {
                                this.data = JSON.parse(cookieData);
                                return true;
                            }
                            else {
                                throw new Error('Cookie read Error', 'Browser does not support JSON');
                            }

                        default:
                            console.error('Cookie read Error: undefined dataType');
                            return false;
                    }

                }
                else {
                    return false;
                }
            };

            this.write = function (data) { // TODO this.prototype.xyz = 

                if (this.dataType === 'date') {
                    return ƒ.storage.cookie.create(this.cookieName, data.valueOf(), this.expireTime);
                }
                else if (this.dataType === 'boolean' || this.dataType === 'string' || this.dataType === 'integer' || this.dataType === 'float') {
                    return ƒ.storage.cookie.create(this.cookieName, data.toString(), this.expireTime);
                }
                else if (this.dataType === 'object') {
                    if (ƒ.encoding.caniuse.JSON()) {
                        return ƒ.storage.cookie.create(this.cookieName, JSON.stringify(data), this.expireTime);
                    }
                    else {
                        throw new Error('Cookie write Error', 'Browser does not support JSON');
                    }

                }
                else {
                    console.error('Cookie write Error: undefined dataType');
                    return false;
                }

            };

            this.update = function (data) { // TODO this.prototype.xyz = 

                this.data = null; /* reset data before assigning new value (acts as catch for fail) */

                switch (this.dataType) {
                    case 'boolean':
                        this.data = Boolean(data);
                        break;
                    case 'date':
                        this.data = new Date(data);
                        break;
                    case 'string':
                        this.data = String(data);
                        break;
                    case 'integer':
                        this.data = parseInt(data, 10);
                        break;
                    case 'float':
                        this.data = parseFloat(data);
                        break;
                    default:
                        console.error('Update Error', 'undefined dataType');
                        return false;
                }

                return this.data !== null ? this.write(this.data.toString()) : false;

            };

            this.destroy = function () { // TODO this.prototype.xyz = 
                this.data = null;
                return ƒ.storage.cookie.erase(this.cookieName);
            };

            this.isSet = function () { // TODO this.prototype.xyz = 
                return this.data !== null ? true : false;
            };

            /* run on init */
            this.setExpireTime(cookie.expire); /* 0 or '' = session | number > 0 = expireInDays */
            this.setType(cookie.type); /* set data type */
            this.read(); /* init read cookie */

        }
    }
    // end cookie abstraction
};

ƒ.encoding = {
    caniuse: {
        JSON: function () {
            var test = typeof JSON !== 'undefined' ? true : false;
            if (!test) { ƒ.debug.log({ type: 'error', logLevel: 2, log: 'Browser does not natively support JSON.' }) }
            return test;
        },
        Base64: function () {
            var test = typeof window.atob !== 'undefined' && typeof window.btoa !== 'undefined' ? true : false;
            if (!test) { ƒ.debug.log({ type: 'error', logLevel: 2, log: 'No Base64 support found' }); }
            return test;
        }
    },
    Base64: {
        encode: function (btoaString) {
            if (ƒ.encoding.caniuse.Base64()) {
                return window.btoa(unescape(encodeURIComponent(btoaString)));
            }
            else {
                throw new Error('ƒ.encoding.base64.encode()', 'No support for Base64 encoding');
            }
        }
        ,
        decode: function (atobString) {

            if (ƒ.encoding.caniuse.Base64()) {
                return decodeURIComponent(escape(window.atob(atobString)));
            }
            else {
                throw new Error('ƒ.encoding.base64.decode()', 'No support for Base64 decoding');
            }
        }
    }
    ,
    data: {
        pack: function (payload) {
            if (ƒ.encoding.caniuse.Base64() && ƒ.encoding.caniuse.JSON() && ƒ.typeOf.Object(payload)) {
                return ƒ.encoding.Base64.encode(JSON.stringify(payload));
            }
            else {
                throw new Error('ƒ.encoding.data.pack()', 'Malformed payload or missing dependency.');
            }
        }
        ,
        unpack: function (payload) {
            if (ƒ.encoding.caniuse.Base64() && ƒ.encoding.caniuse.JSON() && typeof payload !== 'undefined' && payload) {
                return JSON.parse(ƒ.encoding.Base64.decode(payload));
            }
            else {
                throw new Error('ƒ.encoding.data.unpack()', 'Malformed payload or missing dependency.');
            }
        }
    }
    ,
    convert: {
        xmlToJson: function (xml) {

            var _json = {};

            if (xml.nodeType === 1) { // element
                //  attributes
                if (xml.attributes.length > 0) {
                    _json["@attributes"] = {};
                    for (var j = 0; j < xml.attributes.length; j++) {
                        var attribute = xml.attributes.item(j);
                        _json["@attributes"][attribute.nodeName] = attribute.nodeValue;
                    }
                }
            } else if (xml.nodeType === 3) { // text
                _json = xml.nodeValue;
            }

            // child nodes
            if (xml.hasChildNodes()) {
                for (var i = 0; i < xml.childNodes.length; i++) {
                    var item = xml.childNodes.item(i);
                    var nodeName = item.nodeName;
                    if (typeof (_json[nodeName]) === 'undefined') {
                        _json[nodeName] = this.xmlToJson(item);
                    } else {
                        if (typeof (_json[nodeName].push) === 'undefined') {
                            var old = _json[nodeName];
                            _json[nodeName] = [];
                            _json[nodeName].push(old);
                        }
                        _json[nodeName].push(this.xmlToJson(item));
                    }
                }
            }
            return _json;
        }
    }
};

ƒ.stats = {
    optOutClass: 'no-stats',
    caniuse: {

        GA: function () {
            var test = typeof ga !== 'undefined' || typeof _gaq !== 'undefined';
            if (!test) { ƒ.debug.log({ type: 'error', logLevel: 2, log: 'No Google Analytics script found on page.' }); }
            return test;
        }

    },
    GA: {
        optOutClass: 'no-ga',
        attach: {

            downloadClickEvent: function (selector) {

                if (!ƒ.stats.caniuse.GA()) { return; }

                selector = selector || 'a';

                $(selector).each(function (eq, me) {

                    var href = ($(me).attr('href') || '').toLowerCase();

                    if (href && href !== '#' && !$(me).hasClass('ga-ev')) {

                        var pathParts = href.split('.');
                        if (pathParts.length > 1) {

                            var fileType = pathParts[pathParts.length - 1];

                            switch (fileType) {

                                case fileType.indexOf('#') > 1 && fileType.indexOf('?') > 1:
                                    fileType = fileType.split(fileType.indexOf('#') < fileType.indexOf('?') ? '#' : '?')[0];
                                    break;

                                case fileType.indexOf('#') > 1:
                                    fileType = fileType.split('#')[0];
                                    break;

                                case fileType.indexOf('?') > 1:
                                    fileType = fileType.split('?')[0];
                                    break;

                            }

                            if (typeof ƒ.collections.fileTypes[fileType] !== 'undefined' &&
                                ƒ.collections.fileTypes[fileType]
                                && !($(me).hasClass(ƒ.stats.GA.optOutClass)
                                    || $(me).hasClass(ƒ.stats.optOutClass))
                            ) {
                                $(me).click(function () {
                                    ƒ.stats.GA.send.event({
                                        category: 'download',
                                        action: 'click | ' + fileType,
                                        label: $(this).attr('href')
                                    });
                                }).addClass('ga-ev'); // end click
                            }
                        }
                    }
                }); // end each
            },
            contactLinks: function (scope) {

                if (!ƒ.stats.caniuse.GA()) { return; }

                scope = scope || 'body';

                $(scope).find('a[href*="tel"]').not('.ga-ev').click(function () {
                    if ($(this).hasClass(ƒ.stats.GA.optOutClass) || $(this).hasClass(ƒ.stats.optOutClass)) { return; }
                    ƒ.stats.GA.send.event({ category: 'telephone', action: 'click | tel', label: $(this).attr('href').replace('tel:', '') });
                }).addClass('ga-ev');

                $(scope).find('a[href*="fax"]').not('.ga-ev').click(function () {
                    if ($(this).hasClass(ƒ.stats.GA.optOutClass) || $(this).hasClass(ƒ.stats.optOutClass)) { return; }
                    ƒ.stats.GA.send.event({ category: 'fax', action: 'click | fax', label: $(this).attr('href').replace('fax:', '') });
                }).addClass('ga-ev');

                $(scope).find('a[href*="mailto"]').not('.ga-ev').click(function () {
                    if ($(this).hasClass(ƒ.stats.GA.optOutClass) || $(this).hasClass(ƒ.stats.optOutClass)) { return; }
                    ƒ.stats.GA.send.event({ category: 'email', action: 'click | mailto', label: $(this).attr('href').replace('mailto:', '') });
                }).addClass('ga-ev');
            }
        }
        ,
        send: {
            event: function (args) {

                if (ƒ.stats.caniuse.GA() &&
                    typeof args !== 'undefined' &&
                    typeof args === 'object') {

                    if (typeof ga !== 'undefined') {
                        ga('send', 'event',
                            args.category || 'Undefined Category',
                            args.action || 'Undefined Action',
                            args.label || 'Undefined Label',
                            { 'nonInteraction': 1 });
                    }
                    else if (typeof _gaq !== 'undefined') {
                        _gaq.push(['_trackEvent',
                            args.category || 'Undefined Category',
                            args.action || 'Undefined Action',
                            args.label || 'Undefined Label',
                            0, true]);
                    }
                }
            }
        }
    }
};

(function () {
    ƒ.init( /* optional callback here */);
})();

/* end ƒ utilities */
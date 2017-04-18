const global = require('global');
const stringHash = require('string-hash');
const once = require('once');

const globalState = global.__idyllScriptLoaderState = global.__idyllScriptLoaderState || {
  registry: {}
};

function makeLogger (src, verbose) {
  if (!verbose) return function () {}
  const parts = src.split('/');
  const label = parts[parts.length - 1];
  return function log (msg) {
    console.log(label + ': ', msg);
  }
}

module.exports.load = function (src, callback, opts) {
  opts = opts || {};
  let verbose = typeof opts.verbose === 'undefined' ? false : opts.verbose;
  let log, script, foundScript;

  if (opts.scriptId) {
    foundScript = document.getElementById(opts.scriptId);
    if (foundScript) {
      src = foundScript.src;
      log = makeLogger(src, opts.verbose);
      log('Found existing script element');
    }
  }

  log = log || makeLogger(src, opts.verbose);

  let loadState = globalState.registry[src];
  if (loadState) {
    if (loadState.loaded) {
      log('Already loaded');
      callback();
    } else if (loadState.error) {
      log('Error');
      callback(loadState.error);
    } else {
      log('Waiting for completion of already injected script');
      loadState.callbacks.push(callback);
    }
  } else {
    loadState = globalState.registry[src] = {
      loaded: false,
      error: null,
      callbacks: [callback]
    };

    let hash = stringHash(src);
    let id = opts.scriptId || ('idyll-loader-' + hash);

    script = foundScript || document.getElementById(id);

    let executeCallbacks = function (err, data) {
      while(loadState.callbacks.length) {
        log('Executing callback');
        loadState.callbacks.shift().apply(null, [err, data]);
      }
    }

    let cb = once(function (err) {
      if (err) {
        loadState.error = err;
        executeCallbacks(err);
        return;
      } else {
        loadState.loaded = true;
        executeCallbacks();
      }
    });

    if (!foundScript) {
      log('Injecting script tag');
      script = document.createElement('script');
      script.id = id;
    }

    script.addEventListener('load', function () {
      log('Script loaded');
      cb();
    });

    script.addEventListener('readystatechange', function () {
      log('Script state change: complete');
      if (script.readyState === 'complete') cb();
    });

    script.addEventListener('error', function () {
      log('Script load error');
      cb('Idyll Loader: failed to load script "' + src + '"');
    });

    if (!foundScript) {
      script.src = src;
      document.body.appendChild(script);
    }
  }
};

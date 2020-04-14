/**
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

// DO NOT EDIT THIS GENERATED OUTPUT DIRECTLY!
// This file should be overwritten as part of your build process.
// If you need to extend the behavior of the generated service worker, the best approach is to write
// additional code and include it using the importScripts option:
//   https://github.com/GoogleChrome/sw-precache#importscripts-arraystring
//
// Alternatively, it's possible to make changes to the underlying template file and then use that as the
// new base for generating output, via the templateFilePath option:
//   https://github.com/GoogleChrome/sw-precache#templatefilepath-string
//
// If you go that route, make sure that whenever you update your sw-precache dependency, you reconcile any
// changes made to this original template file with your modified copy.

// This generated service worker JavaScript will precache your site's resources.
// The code needs to be saved in a .js file at the top-level of your site, and registered
// from your pages in order to be used. See
// https://github.com/googlechrome/sw-precache/blob/master/demo/app/js/service-worker-registration.js
// for an example of how you can register this script and handle various service worker events.

/* eslint-env worker, serviceworker */
/* eslint-disable indent, no-unused-vars, no-multiple-empty-lines, max-nested-callbacks, space-before-function-paren, quotes, comma-spacing */
'use strict';

var precacheConfig = [["/about/index.html","249e73a227105c394e93c0fb950d612f"],["/archives/index.html","78502ba8587255a64540f22f52d928c2"],["/atom.xml","a10f937128c6edd6ccd41500e853cbaf"],["/categories/cs/index.html","10a21ae3a2dae5699fbb7e5fe07c197b"],["/categories/css/index.html","82726e181e0f66f9e238ab325c0f6c24"],["/categories/front-end-css/index.html","8d8c4bc50d8686e47b56b05405c64755"],["/categories/front-end-interview/index.html","59f65ef20c6c69bfc7f5333abb7bf73a"],["/categories/front-end-javascript-pattern/index.html","e0dd6e67843fd6fb9e30991158032f87"],["/categories/front-end-javascript/index.html","56cea0a46b90fdca4159003cded6ad42"],["/categories/git/index.html","7a40fa0cefc9226e917d66ee00f7ae23"],["/categories/golang/index.html","e0612aa4805cde659f3fd4e8cd93dc58"],["/categories/http/index.html","a7ba560f6266d4d0c825f8a7ea5ef087"],["/categories/interview/index.html","e384217137dc724f34e1a58ba5e55e86"],["/categories/javascript-react/index.html","cc07e70d952b62ad1bb1219e6b125a26"],["/categories/javascript/index.html","6eeff6125fda5346cd72138b5fcf21e4"],["/categories/open-source/index.html","8da0e54935adc2ca7092cd8ce00643f6"],["/categories/programmer-reading/index.html","d47d34b20537efba7e21350d722df436"],["/categories/react/index.html","53d30f3a0ec5506bbef50f00fafc3d1b"],["/categories/regex-javascript/index.html","7478b0dc2264c9b96a8bf102fd13758a"],["/categories/render-animation/index.html","8a55e0059a6cc717b3e7e12fcb3a7143"],["/categories/render-chrome/index.html","541b1bea13f4e4407cfefe2487e72e62"],["/categories/route-javascript/index.html","9d079570037ee5f848e152968561153c"],["/categories/shell-git-linux/index.html","6c68013b91909af2f2a0fcf18d583c17"],["/categories/summary/index.html","8925769c9eb4eb70fc675ea80389d370"],["/categories/test/index.html","b08507278160065b9175f579e385dea6"],["/categories/thrift/index.html","1f5eb36c7476ede076078b67e3cd09d0"],["/categories/webpack/index.html","c6ec01448437f7890ebb16c0e497e134"],["/css/apollo.css","24c0b04d4f64aac12918d57c688dbb86"],["/favicon.png","8f03a5daec1c1aec2f99e70f83851e31"],["/images/2018-3-git.png","f2445db6a86b9d61784f03f0a9ed7c05"],["/images/2018-3-microservices.png","52c9362ca547e3e3cd1bcfbf8eea9715"],["/images/2019-3-webpack.png","a8abe9ab0e0fa6c0489b528e48f983f9"],["/images/2020-interview.png","903b30bf3113b1baaa73cae0636ad50c"],["/images/JavaScript-for-Kids.png","83bed32ac18193b66217444f3fdd58e1"],["/images/chengdu-2018.jpeg","377f27b98263d0c7e6c0dc0f47bc9d2e"],["/images/chengdu-2019.jpeg","2f136c7ec59e0b45db1bea345dbaa92f"],["/images/chinese-pinyin.gif","673bb79866143611d5a85c6abdb43562"],["/images/cypress.png","feb4b8fe99eec8020a1c41fc2569e366"],["/images/decorator1.jpg","3b023991dbb9e856a6c31002b1c7e397"],["/images/decorator2.jpg","13ecb4a06b0ebb819cec4b51566f8d07"],["/images/decorator3.jpg","b65a9e263ca8b50e03308754066326c1"],["/images/dive-into-git/cover.jpg","83e399099f3a36e5edfa8437d63a9e3c"],["/images/dive-into-git/dive-into-git1.jpg","8f4211fd83c8867cbdc6ec3d5499a015"],["/images/dive-into-git/dive-into-git10.jpg","e50ce67b306e4e9b9761785be5c0bb08"],["/images/dive-into-git/dive-into-git11.jpg","3a158f56f888bb2394dd3945e750d7e5"],["/images/dive-into-git/dive-into-git12.jpg","565570cc5d6860c27b597c54f54e6445"],["/images/dive-into-git/dive-into-git13.jpg","3549137fbb27642c49d497a287e6dee6"],["/images/dive-into-git/dive-into-git14.jpg","20e54de85b36482957fb19031389fe54"],["/images/dive-into-git/dive-into-git15.jpg","9bafcab9ac9dea7cddd8a539806d83a6"],["/images/dive-into-git/dive-into-git16.jpg","4454eb8a79d10b4fa846737eb3f24abd"],["/images/dive-into-git/dive-into-git17.jpg","b79c0a80fb07b154eb60e71a38a125af"],["/images/dive-into-git/dive-into-git18.jpg","5c3e9b70f6f130ae3f016b0ac3c4ba99"],["/images/dive-into-git/dive-into-git2.jpg","61ea4889d3e907c13377514b81b848ba"],["/images/dive-into-git/dive-into-git3.jpg","ffa0c62a16ec2e0803f747306dc1f084"],["/images/dive-into-git/dive-into-git4.jpg","45c6de54d8de84f388c4e743d8199f01"],["/images/dive-into-git/dive-into-git5.jpg","2f53f03f668f118f544a2e9d6344b942"],["/images/dive-into-git/dive-into-git6.jpg","ac6aaad15fc495d84b13a6959149eb18"],["/images/dive-into-git/dive-into-git7.jpg","c2e7b5c77695bffdcc22e6759dbfd07b"],["/images/dive-into-git/dive-into-git8.jpg","2c3c9b699bbbe0eb0afb7f4618023fee"],["/images/dive-into-git/dive-into-git9.jpg","8da6d4671f335963a469c70338ce4b8d"],["/images/git-clone-shot.jpeg","2416bfbfd703e64f00ad526340d99da1"],["/images/go-slice.png","e0a1b22d7efd7332e0953a325a63c0d1"],["/images/icons/batman.png","4b9b0beaf237f72621c955b44b84438a"],["/images/icons/lego.jpeg","89dadcb2a7fc759fcf5220ac4e7d8f10"],["/images/iife.png","06c01931d6f41cd7cf0109f40d954d97"],["/images/javascript-is-fast.png","50e825981f3c2f331531f30d5760de5e"],["/images/jstips-animation.gif","385d3110c91606ffbaf73be636ce910d"],["/images/react-hooks-cover.jpeg","2a2fa9bec89c19f3dde9cd906dcb2280"],["/images/regex.jpg","ccba87aeab534e56fe68e33a765f195a"],["/images/render-pipeline-cover.jpg","7529aa0dd86b510add95221cb9f373a2"],["/images/review-copy-in-javascript.png","96f1e8249e6fd2ef4fca53791807b682"],["/images/router/01.jpg","8ab4f32313178bfde84815310d8f72e3"],["/images/router/02.jpg","3f9b3de36fc4cf8cedf6939d442c7e11"],["/images/router/03.jpg","d254ac87c607cb0d76065a0a083b635e"],["/images/router/04.jpg","c094e4a78ff215889d5b29a30df6e22c"],["/images/router/05.jpg","3bc3a495041ab2a88e5e6eb0317e476d"],["/images/router/06.jpg","742eede6a178633442f99280dba36ec8"],["/images/router/07.jpg","a355254d4fcf6214464aa7fadbc3dd24"],["/images/router/cover.jpg","b24f6e1bf6acf9d51239b5f71b6122fa"],["/images/ss.jpeg","32576113169244b62bce2ece8d3be292"],["/images/thrift.png","0df651e84be6be0aef19c764f5e0b14d"],["/images/tokyo-in-2017.jpg","9c9b58f23a3a95fd27472b05b9c4829b"],["/images/vue-reactive.jpg","7bd02ede81c8346014bd4e338cf69167"],["/index.html","455603cd12bd054b6df9c77f92aab24f"],["/manifest.json","d8445da269114fb322973e5dbc3d62ca"],["/page/2/index.html","4fde4c300703ac30ba4970ea539c4481"],["/page/3/index.html","5d93bdb919c9202746113271ad419bd8"],["/page/4/index.html","0dfe796f66cc1c830b06d5a8895e540d"],["/page/5/index.html","72ef73925f926dc5e98e09a52b665afc"],["/post/2015/angular-ui-router/index.html","e9f79e7c985fd98710f0adb4bec05871"],["/post/2015/html-in-email/index.html","ce4516d87319d5595356dd85104b9507"],["/post/2015/intern-qunar-interview/index.html","0f648ec173b0fdc80838d34244d38bf1"],["/post/2015/learning-note-bfc/index.html","58fa86113f878504d55678f726f91c67"],["/post/2015/note-learning-javascript-oop/index.html","cdd47add069b7b1f9c5cbc7f9b19b76f"],["/post/2016/angular-data-binding/index.html","040b7bb8111c767cd0154b5905b9f510"],["/post/2016/basic-fetch-api/index.html","db1f03bf1c0af9e0d1a4b6929bf08a93"],["/post/2016/basic-review-from-anonymous-function-to-iife/index.html","7852641a470dad1c610529e2942c111d"],["/post/2016/browser-cache-summary/index.html","30e14c520df39e73ff69d9928999eb91"],["/post/2016/cookie-localstorage-session/index.html","f187d6061f44e39755e16fc3731a5f55"],["/post/2016/git-rebase-workflow/index.html","903c4a16863908f11c1b4147f61e43a9"],["/post/2016/high-performance-javascript-a/index.html","7430bc5e9f4082e6b70a2c9fc55f18ee"],["/post/2016/high-performance-javascript-b/index.html","eec01f45a4ab91d05a1ad3f5862f2a2e"],["/post/2016/javascript-patterns/index.html","2fc74e4a417631f330a0450879be9c8d"],["/post/2016/learning-clouser-scope/index.html","260f061fc287932e1b39419a9986398a"],["/post/2016/trans-javascript-code-tips/index.html","975d1d1cee35f0b4e8b0d503ac826c2c"],["/post/2016/vieport-percentage/index.html","3e518380476b487896315391bb9e7cbd"],["/post/2017/2017-review/index.html","384ed2695940f2ccf5b3d81544b71766"],["/post/2017/fix-chinese-input-listener/index.html","08792beae53c41174e5fd048fe7fcf80"],["/post/2017/from-settimeout-to-event-loop/index.html","5efd894250843a95bd2730b3a3fccbeb"],["/post/2017/make-shell-and-git-better/index.html","fc75d62268da5b99d05644cdefa41fff"],["/post/2017/observer-pattern-in-vue/index.html","7f8512c2fcaf0b987927e8c1c0ed1f75"],["/post/2017/reading-pragmatic-programmer/index.html","7ca643d8e0d2a379e6a2f0893812a65b"],["/post/2018/character-encoding/index.html","b17bdfca1dc1e074056e819ccada26ac"],["/post/2018/dive-into-git/index.html","6d34f8e665b18fc06afc7d66faff0ddb"],["/post/2018/from-decorator-to-hoc/index.html","b6028da4669187e87dda7940eb5de2e5"],["/post/2018/gpu-animation-render-pipeline/index.html","8fc7c604cf9ca9f260b01a47c0f5f714"],["/post/2018/implement-of-frontend-route/index.html","b5bdb901fff62410bc382ac7c5ed3f24"],["/post/2018/learning-regex-again/index.html","6c9fa24d66d659bbea607be8f36089f7"],["/post/2018/review-copy-in-javascript/index.html","02d8bb90f438cc2d53687b92a23f537a"],["/post/2018/slove-git-clone-speed/index.html","1083ac0f4504f2006e3972709d4d4d8e"],["/post/2018/the-beginning-of-little-robot/index.html","ef175a3d448342e20e994a6bbf9a2b97"],["/post/2018/thrift-note/index.html","ff1217c2946f6d934428f8a6bf4ca678"],["/post/2018/translation-blink-render/index.html","017b40af52afa6d4cac6a456e8d8cbd2"],["/post/2019/2018-review/index.html","47265e3ce4d0dab0402bed4d0349d0e0"],["/post/2019/2019-review/index.html","bdeee5d57d43fdee2721e0839b7884b2"],["/post/2019/2019-webpack-optimization/index.html","b832871ec07c8fffe4ee21383528ba44"],["/post/2019/e2e-test-cypress/index.html","8bf291f8952579cbaf3b0ce8545d07ed"],["/post/2019/understand-golang-slice/index.html","498c9474e80481a5f08579e550d68fcc"],["/post/2020/2020-interviews/index.html","f6f7b037f4053086a8529d4189fc01b3"],["/post/2020/react-hooks-starter/index.html","66c9c40f47e6bcfcfd9b240e1fc77f37"],["/sitemap.xml","2a1143e7bee4e980619653be6b247701"]];
var cacheName = 'sw-precache-v3--' + (self.registration ? self.registration.scope : '');


var ignoreUrlParametersMatching = [/^utm_/];



var addDirectoryIndex = function(originalUrl, index) {
    var url = new URL(originalUrl);
    if (url.pathname.slice(-1) === '/') {
      url.pathname += index;
    }
    return url.toString();
  };

var cleanResponse = function(originalResponse) {
    // If this is not a redirected response, then we don't have to do anything.
    if (!originalResponse.redirected) {
      return Promise.resolve(originalResponse);
    }

    // Firefox 50 and below doesn't support the Response.body stream, so we may
    // need to read the entire body to memory as a Blob.
    var bodyPromise = 'body' in originalResponse ?
      Promise.resolve(originalResponse.body) :
      originalResponse.blob();

    return bodyPromise.then(function(body) {
      // new Response() is happy when passed either a stream or a Blob.
      return new Response(body, {
        headers: originalResponse.headers,
        status: originalResponse.status,
        statusText: originalResponse.statusText
      });
    });
  };

var createCacheKey = function(originalUrl, paramName, paramValue,
                           dontCacheBustUrlsMatching) {
    // Create a new URL object to avoid modifying originalUrl.
    var url = new URL(originalUrl);

    // If dontCacheBustUrlsMatching is not set, or if we don't have a match,
    // then add in the extra cache-busting URL parameter.
    if (!dontCacheBustUrlsMatching ||
        !(url.pathname.match(dontCacheBustUrlsMatching))) {
      url.search += (url.search ? '&' : '') +
        encodeURIComponent(paramName) + '=' + encodeURIComponent(paramValue);
    }

    return url.toString();
  };

var isPathWhitelisted = function(whitelist, absoluteUrlString) {
    // If the whitelist is empty, then consider all URLs to be whitelisted.
    if (whitelist.length === 0) {
      return true;
    }

    // Otherwise compare each path regex to the path of the URL passed in.
    var path = (new URL(absoluteUrlString)).pathname;
    return whitelist.some(function(whitelistedPathRegex) {
      return path.match(whitelistedPathRegex);
    });
  };

var stripIgnoredUrlParameters = function(originalUrl,
    ignoreUrlParametersMatching) {
    var url = new URL(originalUrl);
    // Remove the hash; see https://github.com/GoogleChrome/sw-precache/issues/290
    url.hash = '';

    url.search = url.search.slice(1) // Exclude initial '?'
      .split('&') // Split into an array of 'key=value' strings
      .map(function(kv) {
        return kv.split('='); // Split each 'key=value' string into a [key, value] array
      })
      .filter(function(kv) {
        return ignoreUrlParametersMatching.every(function(ignoredRegex) {
          return !ignoredRegex.test(kv[0]); // Return true iff the key doesn't match any of the regexes.
        });
      })
      .map(function(kv) {
        return kv.join('='); // Join each [key, value] array into a 'key=value' string
      })
      .join('&'); // Join the array of 'key=value' strings into a string with '&' in between each

    return url.toString();
  };


var hashParamName = '_sw-precache';
var urlsToCacheKeys = new Map(
  precacheConfig.map(function(item) {
    var relativeUrl = item[0];
    var hash = item[1];
    var absoluteUrl = new URL(relativeUrl, self.location);
    var cacheKey = createCacheKey(absoluteUrl, hashParamName, hash, false);
    return [absoluteUrl.toString(), cacheKey];
  })
);

function setOfCachedUrls(cache) {
  return cache.keys().then(function(requests) {
    return requests.map(function(request) {
      return request.url;
    });
  }).then(function(urls) {
    return new Set(urls);
  });
}

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return setOfCachedUrls(cache).then(function(cachedUrls) {
        return Promise.all(
          Array.from(urlsToCacheKeys.values()).map(function(cacheKey) {
            // If we don't have a key matching url in the cache already, add it.
            if (!cachedUrls.has(cacheKey)) {
              var request = new Request(cacheKey, {credentials: 'same-origin'});
              return fetch(request).then(function(response) {
                // Bail out of installation unless we get back a 200 OK for
                // every request.
                if (!response.ok) {
                  throw new Error('Request for ' + cacheKey + ' returned a ' +
                    'response with status ' + response.status);
                }

                return cleanResponse(response).then(function(responseToCache) {
                  return cache.put(cacheKey, responseToCache);
                });
              });
            }
          })
        );
      });
    }).then(function() {
      
      // Force the SW to transition from installing -> active state
      return self.skipWaiting();
      
    })
  );
});

self.addEventListener('activate', function(event) {
  var setOfExpectedUrls = new Set(urlsToCacheKeys.values());

  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.keys().then(function(existingRequests) {
        return Promise.all(
          existingRequests.map(function(existingRequest) {
            if (!setOfExpectedUrls.has(existingRequest.url)) {
              return cache.delete(existingRequest);
            }
          })
        );
      });
    }).then(function() {
      
      return self.clients.claim();
      
    })
  );
});


self.addEventListener('fetch', function(event) {
  if (event.request.method === 'GET') {
    // Should we call event.respondWith() inside this fetch event handler?
    // This needs to be determined synchronously, which will give other fetch
    // handlers a chance to handle the request if need be.
    var shouldRespond;

    // First, remove all the ignored parameters and hash fragment, and see if we
    // have that URL in our cache. If so, great! shouldRespond will be true.
    var url = stripIgnoredUrlParameters(event.request.url, ignoreUrlParametersMatching);
    shouldRespond = urlsToCacheKeys.has(url);

    // If shouldRespond is false, check again, this time with 'index.html'
    // (or whatever the directoryIndex option is set to) at the end.
    var directoryIndex = 'index.html';
    if (!shouldRespond && directoryIndex) {
      url = addDirectoryIndex(url, directoryIndex);
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond is still false, check to see if this is a navigation
    // request, and if so, whether the URL matches navigateFallbackWhitelist.
    var navigateFallback = '';
    if (!shouldRespond &&
        navigateFallback &&
        (event.request.mode === 'navigate') &&
        isPathWhitelisted([], event.request.url)) {
      url = new URL(navigateFallback, self.location).toString();
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond was set to true at any point, then call
    // event.respondWith(), using the appropriate cache key.
    if (shouldRespond) {
      event.respondWith(
        caches.open(cacheName).then(function(cache) {
          return cache.match(urlsToCacheKeys.get(url)).then(function(response) {
            if (response) {
              return response;
            }
            throw Error('The cached response that was expected is missing.');
          });
        }).catch(function(e) {
          // Fall back to just fetch()ing the request if some unexpected error
          // prevented the cached response from being valid.
          console.warn('Couldn\'t serve response for "%s" from cache: %O', event.request.url, e);
          return fetch(event.request);
        })
      );
    }
  }
});


// *** Start of auto-included sw-toolbox code. ***
/* 
 Copyright 2016 Google Inc. All Rights Reserved.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var t;t="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,t.toolbox=e()}}(function(){return function e(t,n,r){function o(c,s){if(!n[c]){if(!t[c]){var a="function"==typeof require&&require;if(!s&&a)return a(c,!0);if(i)return i(c,!0);var u=new Error("Cannot find module '"+c+"'");throw u.code="MODULE_NOT_FOUND",u}var f=n[c]={exports:{}};t[c][0].call(f.exports,function(e){var n=t[c][1][e];return o(n?n:e)},f,f.exports,e,t,n,r)}return n[c].exports}for(var i="function"==typeof require&&require,c=0;c<r.length;c++)o(r[c]);return o}({1:[function(e,t,n){"use strict";function r(e,t){t=t||{};var n=t.debug||m.debug;n&&console.log("[sw-toolbox] "+e)}function o(e){var t;return e&&e.cache&&(t=e.cache.name),t=t||m.cache.name,caches.open(t)}function i(e,t){t=t||{};var n=t.successResponses||m.successResponses;return fetch(e.clone()).then(function(r){return"GET"===e.method&&n.test(r.status)&&o(t).then(function(n){n.put(e,r).then(function(){var r=t.cache||m.cache;(r.maxEntries||r.maxAgeSeconds)&&r.name&&c(e,n,r)})}),r.clone()})}function c(e,t,n){var r=s.bind(null,e,t,n);d=d?d.then(r):r()}function s(e,t,n){var o=e.url,i=n.maxAgeSeconds,c=n.maxEntries,s=n.name,a=Date.now();return r("Updating LRU order for "+o+". Max entries is "+c+", max age is "+i),g.getDb(s).then(function(e){return g.setTimestampForUrl(e,o,a)}).then(function(e){return g.expireEntries(e,c,i,a)}).then(function(e){r("Successfully updated IDB.");var n=e.map(function(e){return t.delete(e)});return Promise.all(n).then(function(){r("Done with cache cleanup.")})}).catch(function(e){r(e)})}function a(e,t,n){return r("Renaming cache: ["+e+"] to ["+t+"]",n),caches.delete(t).then(function(){return Promise.all([caches.open(e),caches.open(t)]).then(function(t){var n=t[0],r=t[1];return n.keys().then(function(e){return Promise.all(e.map(function(e){return n.match(e).then(function(t){return r.put(e,t)})}))}).then(function(){return caches.delete(e)})})})}function u(e,t){return o(t).then(function(t){return t.add(e)})}function f(e,t){return o(t).then(function(t){return t.delete(e)})}function h(e){e instanceof Promise||p(e),m.preCacheItems=m.preCacheItems.concat(e)}function p(e){var t=Array.isArray(e);if(t&&e.forEach(function(e){"string"==typeof e||e instanceof Request||(t=!1)}),!t)throw new TypeError("The precache method expects either an array of strings and/or Requests or a Promise that resolves to an array of strings and/or Requests.");return e}function l(e,t,n){if(!e)return!1;if(t){var r=e.headers.get("date");if(r){var o=new Date(r);if(o.getTime()+1e3*t<n)return!1}}return!0}var d,m=e("./options"),g=e("./idb-cache-expiration");t.exports={debug:r,fetchAndCache:i,openCache:o,renameCache:a,cache:u,uncache:f,precache:h,validatePrecacheInput:p,isResponseFresh:l}},{"./idb-cache-expiration":2,"./options":4}],2:[function(e,t,n){"use strict";function r(e){return new Promise(function(t,n){var r=indexedDB.open(u+e,f);r.onupgradeneeded=function(){var e=r.result.createObjectStore(h,{keyPath:p});e.createIndex(l,l,{unique:!1})},r.onsuccess=function(){t(r.result)},r.onerror=function(){n(r.error)}})}function o(e){return e in d||(d[e]=r(e)),d[e]}function i(e,t,n){return new Promise(function(r,o){var i=e.transaction(h,"readwrite"),c=i.objectStore(h);c.put({url:t,timestamp:n}),i.oncomplete=function(){r(e)},i.onabort=function(){o(i.error)}})}function c(e,t,n){return t?new Promise(function(r,o){var i=1e3*t,c=[],s=e.transaction(h,"readwrite"),a=s.objectStore(h),u=a.index(l);u.openCursor().onsuccess=function(e){var t=e.target.result;if(t&&n-i>t.value[l]){var r=t.value[p];c.push(r),a.delete(r),t.continue()}},s.oncomplete=function(){r(c)},s.onabort=o}):Promise.resolve([])}function s(e,t){return t?new Promise(function(n,r){var o=[],i=e.transaction(h,"readwrite"),c=i.objectStore(h),s=c.index(l),a=s.count();s.count().onsuccess=function(){var e=a.result;e>t&&(s.openCursor().onsuccess=function(n){var r=n.target.result;if(r){var i=r.value[p];o.push(i),c.delete(i),e-o.length>t&&r.continue()}})},i.oncomplete=function(){n(o)},i.onabort=r}):Promise.resolve([])}function a(e,t,n,r){return c(e,n,r).then(function(n){return s(e,t).then(function(e){return n.concat(e)})})}var u="sw-toolbox-",f=1,h="store",p="url",l="timestamp",d={};t.exports={getDb:o,setTimestampForUrl:i,expireEntries:a}},{}],3:[function(e,t,n){"use strict";function r(e){var t=a.match(e.request);t?e.respondWith(t(e.request)):a.default&&"GET"===e.request.method&&0===e.request.url.indexOf("http")&&e.respondWith(a.default(e.request))}function o(e){s.debug("activate event fired");var t=u.cache.name+"$$$inactive$$$";e.waitUntil(s.renameCache(t,u.cache.name))}function i(e){return e.reduce(function(e,t){return e.concat(t)},[])}function c(e){var t=u.cache.name+"$$$inactive$$$";s.debug("install event fired"),s.debug("creating cache ["+t+"]"),e.waitUntil(s.openCache({cache:{name:t}}).then(function(e){return Promise.all(u.preCacheItems).then(i).then(s.validatePrecacheInput).then(function(t){return s.debug("preCache list: "+(t.join(", ")||"(none)")),e.addAll(t)})}))}e("serviceworker-cache-polyfill");var s=e("./helpers"),a=e("./router"),u=e("./options");t.exports={fetchListener:r,activateListener:o,installListener:c}},{"./helpers":1,"./options":4,"./router":6,"serviceworker-cache-polyfill":16}],4:[function(e,t,n){"use strict";var r;r=self.registration?self.registration.scope:self.scope||new URL("./",self.location).href,t.exports={cache:{name:"$$$toolbox-cache$$$"+r+"$$$",maxAgeSeconds:null,maxEntries:null},debug:!1,networkTimeoutSeconds:null,preCacheItems:[],successResponses:/^0|([123]\d\d)|(40[14567])|410$/}},{}],5:[function(e,t,n){"use strict";var r=new URL("./",self.location),o=r.pathname,i=e("path-to-regexp"),c=function(e,t,n,r){t instanceof RegExp?this.fullUrlRegExp=t:(0!==t.indexOf("/")&&(t=o+t),this.keys=[],this.regexp=i(t,this.keys)),this.method=e,this.options=r,this.handler=n};c.prototype.makeHandler=function(e){var t;if(this.regexp){var n=this.regexp.exec(e);t={},this.keys.forEach(function(e,r){t[e.name]=n[r+1]})}return function(e){return this.handler(e,t,this.options)}.bind(this)},t.exports=c},{"path-to-regexp":15}],6:[function(e,t,n){"use strict";function r(e){return e.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&")}var o=e("./route"),i=e("./helpers"),c=function(e,t){for(var n=e.entries(),r=n.next(),o=[];!r.done;){var i=new RegExp(r.value[0]);i.test(t)&&o.push(r.value[1]),r=n.next()}return o},s=function(){this.routes=new Map,this.routes.set(RegExp,new Map),this.default=null};["get","post","put","delete","head","any"].forEach(function(e){s.prototype[e]=function(t,n,r){return this.add(e,t,n,r)}}),s.prototype.add=function(e,t,n,c){c=c||{};var s;t instanceof RegExp?s=RegExp:(s=c.origin||self.location.origin,s=s instanceof RegExp?s.source:r(s)),e=e.toLowerCase();var a=new o(e,t,n,c);this.routes.has(s)||this.routes.set(s,new Map);var u=this.routes.get(s);u.has(e)||u.set(e,new Map);var f=u.get(e),h=a.regexp||a.fullUrlRegExp;f.has(h.source)&&i.debug('"'+t+'" resolves to same regex as existing route.'),f.set(h.source,a)},s.prototype.matchMethod=function(e,t){var n=new URL(t),r=n.origin,o=n.pathname;return this._match(e,c(this.routes,r),o)||this._match(e,[this.routes.get(RegExp)],t)},s.prototype._match=function(e,t,n){if(0===t.length)return null;for(var r=0;r<t.length;r++){var o=t[r],i=o&&o.get(e.toLowerCase());if(i){var s=c(i,n);if(s.length>0)return s[0].makeHandler(n)}}return null},s.prototype.match=function(e){return this.matchMethod(e.method,e.url)||this.matchMethod("any",e.url)},t.exports=new s},{"./helpers":1,"./route":5}],7:[function(e,t,n){"use strict";function r(e,t,n){return n=n||{},i.debug("Strategy: cache first ["+e.url+"]",n),i.openCache(n).then(function(t){return t.match(e).then(function(t){var r=n.cache||o.cache,c=Date.now();return i.isResponseFresh(t,r.maxAgeSeconds,c)?t:i.fetchAndCache(e,n)})})}var o=e("../options"),i=e("../helpers");t.exports=r},{"../helpers":1,"../options":4}],8:[function(e,t,n){"use strict";function r(e,t,n){return n=n||{},i.debug("Strategy: cache only ["+e.url+"]",n),i.openCache(n).then(function(t){return t.match(e).then(function(e){var t=n.cache||o.cache,r=Date.now();if(i.isResponseFresh(e,t.maxAgeSeconds,r))return e})})}var o=e("../options"),i=e("../helpers");t.exports=r},{"../helpers":1,"../options":4}],9:[function(e,t,n){"use strict";function r(e,t,n){return o.debug("Strategy: fastest ["+e.url+"]",n),new Promise(function(r,c){var s=!1,a=[],u=function(e){a.push(e.toString()),s?c(new Error('Both cache and network failed: "'+a.join('", "')+'"')):s=!0},f=function(e){e instanceof Response?r(e):u("No result returned")};o.fetchAndCache(e.clone(),n).then(f,u),i(e,t,n).then(f,u)})}var o=e("../helpers"),i=e("./cacheOnly");t.exports=r},{"../helpers":1,"./cacheOnly":8}],10:[function(e,t,n){t.exports={networkOnly:e("./networkOnly"),networkFirst:e("./networkFirst"),cacheOnly:e("./cacheOnly"),cacheFirst:e("./cacheFirst"),fastest:e("./fastest")}},{"./cacheFirst":7,"./cacheOnly":8,"./fastest":9,"./networkFirst":11,"./networkOnly":12}],11:[function(e,t,n){"use strict";function r(e,t,n){n=n||{};var r=n.successResponses||o.successResponses,c=n.networkTimeoutSeconds||o.networkTimeoutSeconds;return i.debug("Strategy: network first ["+e.url+"]",n),i.openCache(n).then(function(t){var s,a,u=[];if(c){var f=new Promise(function(r){s=setTimeout(function(){t.match(e).then(function(e){var t=n.cache||o.cache,c=Date.now(),s=t.maxAgeSeconds;i.isResponseFresh(e,s,c)&&r(e)})},1e3*c)});u.push(f)}var h=i.fetchAndCache(e,n).then(function(e){if(s&&clearTimeout(s),r.test(e.status))return e;throw i.debug("Response was an HTTP error: "+e.statusText,n),a=e,new Error("Bad response")}).catch(function(r){return i.debug("Network or response error, fallback to cache ["+e.url+"]",n),t.match(e).then(function(e){if(e)return e;if(a)return a;throw r})});return u.push(h),Promise.race(u)})}var o=e("../options"),i=e("../helpers");t.exports=r},{"../helpers":1,"../options":4}],12:[function(e,t,n){"use strict";function r(e,t,n){return o.debug("Strategy: network only ["+e.url+"]",n),fetch(e)}var o=e("../helpers");t.exports=r},{"../helpers":1}],13:[function(e,t,n){"use strict";var r=e("./options"),o=e("./router"),i=e("./helpers"),c=e("./strategies"),s=e("./listeners");i.debug("Service Worker Toolbox is loading"),self.addEventListener("install",s.installListener),self.addEventListener("activate",s.activateListener),self.addEventListener("fetch",s.fetchListener),t.exports={networkOnly:c.networkOnly,networkFirst:c.networkFirst,cacheOnly:c.cacheOnly,cacheFirst:c.cacheFirst,fastest:c.fastest,router:o,options:r,cache:i.cache,uncache:i.uncache,precache:i.precache}},{"./helpers":1,"./listeners":3,"./options":4,"./router":6,"./strategies":10}],14:[function(e,t,n){t.exports=Array.isArray||function(e){return"[object Array]"==Object.prototype.toString.call(e)}},{}],15:[function(e,t,n){function r(e,t){for(var n,r=[],o=0,i=0,c="",s=t&&t.delimiter||"/";null!=(n=x.exec(e));){var f=n[0],h=n[1],p=n.index;if(c+=e.slice(i,p),i=p+f.length,h)c+=h[1];else{var l=e[i],d=n[2],m=n[3],g=n[4],v=n[5],w=n[6],y=n[7];c&&(r.push(c),c="");var b=null!=d&&null!=l&&l!==d,E="+"===w||"*"===w,R="?"===w||"*"===w,k=n[2]||s,$=g||v;r.push({name:m||o++,prefix:d||"",delimiter:k,optional:R,repeat:E,partial:b,asterisk:!!y,pattern:$?u($):y?".*":"[^"+a(k)+"]+?"})}}return i<e.length&&(c+=e.substr(i)),c&&r.push(c),r}function o(e,t){return s(r(e,t))}function i(e){return encodeURI(e).replace(/[\/?#]/g,function(e){return"%"+e.charCodeAt(0).toString(16).toUpperCase()})}function c(e){return encodeURI(e).replace(/[?#]/g,function(e){return"%"+e.charCodeAt(0).toString(16).toUpperCase()})}function s(e){for(var t=new Array(e.length),n=0;n<e.length;n++)"object"==typeof e[n]&&(t[n]=new RegExp("^(?:"+e[n].pattern+")$"));return function(n,r){for(var o="",s=n||{},a=r||{},u=a.pretty?i:encodeURIComponent,f=0;f<e.length;f++){var h=e[f];if("string"!=typeof h){var p,l=s[h.name];if(null==l){if(h.optional){h.partial&&(o+=h.prefix);continue}throw new TypeError('Expected "'+h.name+'" to be defined')}if(v(l)){if(!h.repeat)throw new TypeError('Expected "'+h.name+'" to not repeat, but received `'+JSON.stringify(l)+"`");if(0===l.length){if(h.optional)continue;throw new TypeError('Expected "'+h.name+'" to not be empty')}for(var d=0;d<l.length;d++){if(p=u(l[d]),!t[f].test(p))throw new TypeError('Expected all "'+h.name+'" to match "'+h.pattern+'", but received `'+JSON.stringify(p)+"`");o+=(0===d?h.prefix:h.delimiter)+p}}else{if(p=h.asterisk?c(l):u(l),!t[f].test(p))throw new TypeError('Expected "'+h.name+'" to match "'+h.pattern+'", but received "'+p+'"');o+=h.prefix+p}}else o+=h}return o}}function a(e){return e.replace(/([.+*?=^!:${}()[\]|\/\\])/g,"\\$1")}function u(e){return e.replace(/([=!:$\/()])/g,"\\$1")}function f(e,t){return e.keys=t,e}function h(e){return e.sensitive?"":"i"}function p(e,t){var n=e.source.match(/\((?!\?)/g);if(n)for(var r=0;r<n.length;r++)t.push({name:r,prefix:null,delimiter:null,optional:!1,repeat:!1,partial:!1,asterisk:!1,pattern:null});return f(e,t)}function l(e,t,n){for(var r=[],o=0;o<e.length;o++)r.push(g(e[o],t,n).source);var i=new RegExp("(?:"+r.join("|")+")",h(n));return f(i,t)}function d(e,t,n){return m(r(e,n),t,n)}function m(e,t,n){v(t)||(n=t||n,t=[]),n=n||{};for(var r=n.strict,o=n.end!==!1,i="",c=0;c<e.length;c++){var s=e[c];if("string"==typeof s)i+=a(s);else{var u=a(s.prefix),p="(?:"+s.pattern+")";t.push(s),s.repeat&&(p+="(?:"+u+p+")*"),p=s.optional?s.partial?u+"("+p+")?":"(?:"+u+"("+p+"))?":u+"("+p+")",i+=p}}var l=a(n.delimiter||"/"),d=i.slice(-l.length)===l;return r||(i=(d?i.slice(0,-l.length):i)+"(?:"+l+"(?=$))?"),i+=o?"$":r&&d?"":"(?="+l+"|$)",f(new RegExp("^"+i,h(n)),t)}function g(e,t,n){return v(t)||(n=t||n,t=[]),n=n||{},e instanceof RegExp?p(e,t):v(e)?l(e,t,n):d(e,t,n)}var v=e("isarray");t.exports=g,t.exports.parse=r,t.exports.compile=o,t.exports.tokensToFunction=s,t.exports.tokensToRegExp=m;var x=new RegExp(["(\\\\.)","([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))"].join("|"),"g")},{isarray:14}],16:[function(e,t,n){!function(){var e=Cache.prototype.addAll,t=navigator.userAgent.match(/(Firefox|Chrome)\/(\d+\.)/);if(t)var n=t[1],r=parseInt(t[2]);e&&(!t||"Firefox"===n&&r>=46||"Chrome"===n&&r>=50)||(Cache.prototype.addAll=function(e){function t(e){this.name="NetworkError",this.code=19,this.message=e}var n=this;return t.prototype=Object.create(Error.prototype),Promise.resolve().then(function(){if(arguments.length<1)throw new TypeError;return e=e.map(function(e){return e instanceof Request?e:String(e)}),Promise.all(e.map(function(e){"string"==typeof e&&(e=new Request(e));var n=new URL(e.url).protocol;if("http:"!==n&&"https:"!==n)throw new t("Invalid scheme");return fetch(e.clone())}))}).then(function(r){if(r.some(function(e){return!e.ok}))throw new t("Incorrect response status");return Promise.all(r.map(function(t,r){return n.put(e[r],t)}))}).then(function(){})},Cache.prototype.add=function(e){return this.addAll([e])})}()},{}]},{},[13])(13)});


// *** End of auto-included sw-toolbox code. ***



// Runtime cache configuration, using the sw-toolbox library.

toolbox.router.get("/*", toolbox.cacheFirst, {"origin":"cdnjs.cloudflare.com"});





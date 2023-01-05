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

var precacheConfig = [["/WechatIMG133.jpeg","1f3b67e3262cc69004cd292e85dbf53b"],["/about/index.html","6360640558bc8a92ce38d91bb38f072e"],["/archives/index.html","24f6ffff811e606453bb28f31946b229"],["/atom.xml","075c898f94eb06c8466d624200431a5d"],["/categories/cs/index.html","d9b0cfd6153e6bbec0922182811d2548"],["/categories/css/index.html","a80a943bbcfc330f35715d3c4e571209"],["/categories/front-end-css/index.html","15b92f4c95aaa5a37cf349b42fbde696"],["/categories/front-end-interview/index.html","27808d83d198b4a095ed5b77ddb886dd"],["/categories/front-end-javascript-pattern/index.html","5a5980fcd4bdaed2eb6db9419f9a6897"],["/categories/front-end-javascript/index.html","f8eebfa59cff4ed984cd4cc684d0f8a6"],["/categories/git/index.html","6bf87c32779f338677925f0bfb35de95"],["/categories/golang/index.html","51f1fd426968b526aba524a0301a30da"],["/categories/http/index.html","82eb26d9a8282b0c90d59b89c5579d53"],["/categories/interview/index.html","b6971c32947aa3adc4cafe50ecb48c47"],["/categories/javascript-react/index.html","4a797e9f06a1a3f82b8cec76358f61a0"],["/categories/javascript/index.html","99a73d8337aa8b3516b32aa28bd2074c"],["/categories/open-source/index.html","77accdde27cbf8fd70931c2c43dcc19a"],["/categories/programmer-reading/index.html","8f19bb76ec03169658c40aec7b253f1d"],["/categories/react/index.html","d70529202d6bc8c9589e7ba0e1261731"],["/categories/regex-javascript/index.html","a3028b8cd49a2bfb9d7e4ec7d5b61054"],["/categories/render-animation/index.html","225746a20544a8ae6e58b70e60cd5cdf"],["/categories/render-chrome/index.html","bca084b1ef77292a045b394c04c4a929"],["/categories/route-javascript/index.html","8d17e486302ff8f6c5df13af392ac426"],["/categories/shell-git-linux/index.html","8d47e25b5692473c4df6e1e2afb365ba"],["/categories/summary/index.html","5f2422714eee2ba5f8762878046f2ee6"],["/categories/test/index.html","15516fe28b1b0620b52d9d0f92354857"],["/categories/thrift/index.html","b8b8fb313f9b880db82915a7395a3a7f"],["/categories/visualization/index.html","1a7f27d47f98a53046c55af8138d694d"],["/categories/webpack/index.html","ce44b8d0b36136a38dd75a43b10ebd56"],["/css/apollo.css","24c0b04d4f64aac12918d57c688dbb86"],["/favicon.png","8f03a5daec1c1aec2f99e70f83851e31"],["/images/2018-3-git.png","f2445db6a86b9d61784f03f0a9ed7c05"],["/images/2018-3-microservices.png","52c9362ca547e3e3cd1bcfbf8eea9715"],["/images/2019-3-webpack.png","a8abe9ab0e0fa6c0489b528e48f983f9"],["/images/2020-interview.png","903b30bf3113b1baaa73cae0636ad50c"],["/images/2021-review.jpeg","1f3b67e3262cc69004cd292e85dbf53b"],["/images/2022-game.jpeg","fddec702e28fbc06023d90b1f2e5caf4"],["/images/JavaScript-for-Kids.png","83bed32ac18193b66217444f3fdd58e1"],["/images/chengdu-2018.jpeg","377f27b98263d0c7e6c0dc0f47bc9d2e"],["/images/chengdu-2019.jpeg","2f136c7ec59e0b45db1bea345dbaa92f"],["/images/chinese-pinyin.gif","673bb79866143611d5a85c6abdb43562"],["/images/cypress.png","feb4b8fe99eec8020a1c41fc2569e366"],["/images/decorator1.jpg","3b023991dbb9e856a6c31002b1c7e397"],["/images/decorator2.jpg","13ecb4a06b0ebb819cec4b51566f8d07"],["/images/decorator3.jpg","b65a9e263ca8b50e03308754066326c1"],["/images/dive-into-git/cover.jpg","83e399099f3a36e5edfa8437d63a9e3c"],["/images/dive-into-git/dive-into-git1.jpg","8f4211fd83c8867cbdc6ec3d5499a015"],["/images/dive-into-git/dive-into-git10.jpg","e50ce67b306e4e9b9761785be5c0bb08"],["/images/dive-into-git/dive-into-git11.jpg","3a158f56f888bb2394dd3945e750d7e5"],["/images/dive-into-git/dive-into-git12.jpg","565570cc5d6860c27b597c54f54e6445"],["/images/dive-into-git/dive-into-git13.jpg","3549137fbb27642c49d497a287e6dee6"],["/images/dive-into-git/dive-into-git14.jpg","20e54de85b36482957fb19031389fe54"],["/images/dive-into-git/dive-into-git15.jpg","9bafcab9ac9dea7cddd8a539806d83a6"],["/images/dive-into-git/dive-into-git16.jpg","4454eb8a79d10b4fa846737eb3f24abd"],["/images/dive-into-git/dive-into-git17.jpg","b79c0a80fb07b154eb60e71a38a125af"],["/images/dive-into-git/dive-into-git18.jpg","5c3e9b70f6f130ae3f016b0ac3c4ba99"],["/images/dive-into-git/dive-into-git2.jpg","61ea4889d3e907c13377514b81b848ba"],["/images/dive-into-git/dive-into-git3.jpg","ffa0c62a16ec2e0803f747306dc1f084"],["/images/dive-into-git/dive-into-git4.jpg","45c6de54d8de84f388c4e743d8199f01"],["/images/dive-into-git/dive-into-git5.jpg","2f53f03f668f118f544a2e9d6344b942"],["/images/dive-into-git/dive-into-git6.jpg","ac6aaad15fc495d84b13a6959149eb18"],["/images/dive-into-git/dive-into-git7.jpg","c2e7b5c77695bffdcc22e6759dbfd07b"],["/images/dive-into-git/dive-into-git8.jpg","2c3c9b699bbbe0eb0afb7f4618023fee"],["/images/dive-into-git/dive-into-git9.jpg","8da6d4671f335963a469c70338ce4b8d"],["/images/git-clone-shot.jpeg","2416bfbfd703e64f00ad526340d99da1"],["/images/go-slice.png","e0a1b22d7efd7332e0953a325a63c0d1"],["/images/icons/batman.png","4b9b0beaf237f72621c955b44b84438a"],["/images/icons/lego.jpeg","89dadcb2a7fc759fcf5220ac4e7d8f10"],["/images/iife.png","06c01931d6f41cd7cf0109f40d954d97"],["/images/javascript-is-fast.png","50e825981f3c2f331531f30d5760de5e"],["/images/jstips-animation.gif","385d3110c91606ffbaf73be636ce910d"],["/images/react-hooks-cover.jpeg","2a2fa9bec89c19f3dde9cd906dcb2280"],["/images/regex.jpg","ccba87aeab534e56fe68e33a765f195a"],["/images/render-pipeline-cover.jpg","7529aa0dd86b510add95221cb9f373a2"],["/images/review-copy-in-javascript.png","96f1e8249e6fd2ef4fca53791807b682"],["/images/router/01.jpg","8ab4f32313178bfde84815310d8f72e3"],["/images/router/02.jpg","3f9b3de36fc4cf8cedf6939d442c7e11"],["/images/router/03.jpg","d254ac87c607cb0d76065a0a083b635e"],["/images/router/04.jpg","c094e4a78ff215889d5b29a30df6e22c"],["/images/router/05.jpg","3bc3a495041ab2a88e5e6eb0317e476d"],["/images/router/06.jpg","742eede6a178633442f99280dba36ec8"],["/images/router/07.jpg","a355254d4fcf6214464aa7fadbc3dd24"],["/images/router/cover.jpg","b24f6e1bf6acf9d51239b5f71b6122fa"],["/images/ss.jpeg","32576113169244b62bce2ece8d3be292"],["/images/thrift.png","0df651e84be6be0aef19c764f5e0b14d"],["/images/tokyo-in-2017.jpg","9c9b58f23a3a95fd27472b05b9c4829b"],["/images/visualization.png","1c3e37b8f9c1c88cbfbaeaf23b28bb1e"],["/images/vue-reactive.jpg","7bd02ede81c8346014bd4e338cf69167"],["/index.html","175260565f2ddca8c698c501cde5e294"],["/manifest.json","d8445da269114fb322973e5dbc3d62ca"],["/page/2/index.html","b91401d3229c623cc0d381182b1ef061"],["/page/3/index.html","dbb136d261c97e317ab51163e98e8f60"],["/page/4/index.html","effcfe302578a5098e0dfe6f6416d8c6"],["/page/5/index.html","4e75056aae7b769e0275652e33a1ad51"],["/post/2015/angular-ui-router/index.html","83841ac96b1c29728924721203a99a8e"],["/post/2015/html-in-email/index.html","c40e1c06a514e6b2cf772bf237f79dc8"],["/post/2015/intern-qunar-interview/index.html","e0476b2bc53f6f3cdf0712288b0727c1"],["/post/2015/learning-note-bfc/index.html","de72a281805704c669cd4d1d1c6c3792"],["/post/2015/note-learning-javascript-oop/index.html","ceb80a65b67c0adec1a11bcdf601fb9f"],["/post/2016/angular-data-binding/index.html","c23d697ccd3ad86f7a6bfd39681982e1"],["/post/2016/basic-fetch-api/index.html","5090e000fee9922d2306184037f7031f"],["/post/2016/basic-review-from-anonymous-function-to-iife/index.html","bdd7a98792bbfbfcf7ec3d88c9b586cc"],["/post/2016/browser-cache-summary/index.html","cadfa3b02916afd749fcd6042d221970"],["/post/2016/cookie-localstorage-session/index.html","2b152a44d4331551c2feca3379bba6eb"],["/post/2016/git-rebase-workflow/index.html","7392e7aa5a60b8dcdd9954f80c62f380"],["/post/2016/high-performance-javascript-a/index.html","881e27962b0a6920fe29e373f242bf28"],["/post/2016/high-performance-javascript-b/index.html","533ebec50dc07ec848b2ce0e15d5d2eb"],["/post/2016/javascript-patterns/index.html","4baf994015397371854f648b5c891ffd"],["/post/2016/learning-clouser-scope/index.html","043c908bd090b7b1b679f4d32e806ef3"],["/post/2016/trans-javascript-code-tips/index.html","c7b0cd3ecaa6cdbfb57a1b7b5f643300"],["/post/2016/vieport-percentage/index.html","47a3ee86f23b1da4a26ab0755053348d"],["/post/2017/2017-review/index.html","2147a7302e2448c8c43579a2e00f4a30"],["/post/2017/fix-chinese-input-listener/index.html","69701a3c03c20cbb1b23185a4b5a4dbf"],["/post/2017/from-settimeout-to-event-loop/index.html","d1267caf6852a0f1e944ac5b3dc5573e"],["/post/2017/make-shell-and-git-better/index.html","409c327dd6cdddbbec22b4cfa5373396"],["/post/2017/observer-pattern-in-vue/index.html","e4c4a9a5d79c74e1f4ce3f631acc9724"],["/post/2017/reading-pragmatic-programmer/index.html","74107d401ff8809b08071957999d549b"],["/post/2018/character-encoding/index.html","a65878dc0a20bf9a28f320547e1809c9"],["/post/2018/dive-into-git/index.html","733866c231e7bf1b4f62863239f4d7d3"],["/post/2018/from-decorator-to-hoc/index.html","b41a1efef8dd836f6cea6fdccf7e0d43"],["/post/2018/gpu-animation-render-pipeline/index.html","89be85cf82cb6ae64d2e6f62b6fa57f7"],["/post/2018/implement-of-frontend-route/index.html","d0f88018135a39c4033d8e073496c371"],["/post/2018/learning-regex-again/index.html","1ac52e3b385f6b3f27311c6cf9e7f879"],["/post/2018/review-copy-in-javascript/index.html","eb6a5c2a9c959e1b7653b22e1af3cf30"],["/post/2018/slove-git-clone-speed/index.html","48470e2b49bcb6f26b3123e0d8b10737"],["/post/2018/the-beginning-of-little-robot/index.html","8a84e6205e717f605216a50af0623de9"],["/post/2018/thrift-note/index.html","5ca6e70a9e85a1cb26dabc18f4a4156a"],["/post/2018/translation-blink-render/index.html","699a92f1a10a859287b97de58eb177b9"],["/post/2019/2018-review/index.html","68ad660c101337727bff35f69662716d"],["/post/2019/2019-review/index.html","2a9b9eb837c77f7d1408b16a1da8d5a8"],["/post/2019/2019-webpack-optimization/index.html","fd301b0d56a85d15ff9ffccbdd38765b"],["/post/2019/e2e-test-cypress/index.html","92f1a1c0c8c9810ce89750e0aa117e8b"],["/post/2019/understand-golang-slice/index.html","0a75847435912559eb912e0d10abdea2"],["/post/2020/2020-interviews/index.html","f52ccb9b094840ffa350294ed491eb1c"],["/post/2020/react-hooks-starter/index.html","50dc31ee81bc421377791ac31e1e11d4"],["/post/2021/2020-review/index.html","3f34127d422b6e3f391fbbc4d226ed7c"],["/post/2021/visualization-share/index.html","2187aaeaeec6c28741b9bf1754bc9261"],["/post/2022/2021-review/index.html","2eb3f70a783cdb442eb58810a37651f5"],["/post/2023/2022-review/index.html","385d5ed8ad93722c31eef711d7c238a5"],["/sitemap.xml","2e20e59380b20757f25c62ae2e76b62c"]];
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





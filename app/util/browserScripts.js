const getWindowInformation = `
  const __getLargeImg = function(){
    let img = undefined;
    const nodeList = document.getElementsByTagName("img");
    for (let i = 0; i < nodeList.length; i++)
    {
      const node = nodeList[i];
      if (node.naturalHeight >= 300 && node.naturalWidth >= 300  )
      {
        img = nodeList[i];
        break;
      }
    }
    return img && img.src
  }
  const __getFavicon = function(){
    let favicon = undefined;
    const nodeList = document.getElementsByTagName("link");
    for (let i = 0; i < nodeList.length; i++)
    {
      const rel = nodeList[i].getAttribute("rel")
      if (rel === "icon" || rel === "shortcut icon" || rel === "icon shortcut" || rel === "apple-touch-icon")
      {
        favicon = nodeList[i]
      }
    }
    return favicon && favicon.href
  }
  const __extractMeta = function(props, defval) {
    for (let i = 0; i < props.length; i++) {
      const tag = window.document.querySelector('head > meta[property="' + props[i] + '"]');
      if (tag) {
        return tag.content;
      }
    }
    return defval;
  };
  window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify(
    {
      type: 'GET_TITLE_FOR_BOOKMARK',
      payload: {
        title: __extractMeta(['og:title', 'twitter:title', 'title'], document.title),
        url: __extractMeta(['og:url', 'twitter:url'], location.href),
        icon: __extractMeta(['og:image', 'twitter:image'], __getLargeImg() || __getFavicon())
      }
    }
  ))
`;

const getWebviewUrl = `
  const __getFavicon = function(){
    let favicon = undefined;
    const nodeList = document.getElementsByTagName("link");
    for (let i = 0; i < nodeList.length; i++)
    {
      const rel = nodeList[i].getAttribute("rel")
      if (rel === "icon" || rel === "shortcut icon" || rel === "icon shortcut" || rel === "apple-touch-icon")
      {
        favicon = nodeList[i]
      }
    }
    return favicon && favicon.href
  }
  window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify(
    {
      type: 'GET_WEBVIEW_URL',
      payload: {
        url: location.href,
        icon: __getFavicon()
      }
    }
  ))
`;

export const SPA_urlChangeListener = `(function () {
  var __mmHistory = window.history;
  var __mmPushState = __mmHistory.pushState;
  var __mmReplaceState = __mmHistory.replaceState;
  function __mm__updateUrl(){
    const siteName = document.querySelector('head > meta[property="og:site_name"]');
    const title = siteName || document.querySelector('head > meta[name="title"]') || document.title;
    const height = Math.max(document.documentElement.clientHeight, document.documentElement.scrollHeight, document.body.clientHeight, document.body.scrollHeight);

    window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify(
      {
        type: 'NAV_CHANGE',
        payload: {
          url: location.href,
          title: title,
        }
      }
    ));

    setTimeout(() => {
      const height = Math.max(document.documentElement.clientHeight, document.documentElement.scrollHeight, document.body.clientHeight, document.body.scrollHeight);
      window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify(
      {
        type: 'GET_HEIGHT',
        payload: {
          height: height
        }
      }))
    }, 500);
  }

  __mmHistory.pushState = function(state) {
    setTimeout(function () {
      __mm__updateUrl();
    }, 100);
    return __mmPushState.apply(history, arguments);
  };

  __mmHistory.replaceState = function(state) {
    setTimeout(function () {
      __mm__updateUrl();
    }, 100);
    return __mmReplaceState.apply(history, arguments);
  };

  window.onpopstate = function(event) {
    __mm__updateUrl();
  };
  })();
`;

export const JS_WINDOW_INFORMATION = `
  (function () {
    ${getWindowInformation}
  })();
`;

export const JS_WEBVIEW_URL = `
  (function () {
    ${getWebviewUrl}
  })();
`;

export const JS_DESELECT_TEXT = `if (window.getSelection) {window.getSelection().removeAllRanges();}
else if (document.selection) {document.selection.empty();}`;

export const JS_POST_MESSAGE_TO_PROVIDER = (message, origin) => `(function () {
  try {
    window.postMessage(${JSON.stringify(message)}, '${origin}');
  } catch (e) {
    //Nothing to do
  }
})()`;

export const JS_IFRAME_POST_MESSAGE_TO_PROVIDER = (message, origin) =>
  '(function () {})()';
/** Disable sending messages to iframes for now
 *
`(function () {
  const iframes = document.getElementsByTagName('iframe');
  for (let frame of iframes){

      try {
        frame.contentWindow.postMessage(${JSON.stringify(message)}, '${origin}');
      } catch (e) {
        //Nothing to do
      }

  }
})()`;
 */

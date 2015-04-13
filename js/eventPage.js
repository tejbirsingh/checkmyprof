chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {

    if(request === 'showPageAction'){
      chrome.pageAction.show(sender.tab.id);
    }
    else {
      var http = new XMLHttpRequest();

      http.open('GET', request.url, true);
      http.send();

      http.onload = function () {
        sendResponse({prof: request.prof, result: http.responseText});
      };
      http.onerror = function () {
        sendResponse();
      };

      return true; // prevents the callback from being called too early on return
    }
  });
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    var http = new XMLHttpRequest();

    http.open('GET', request.url, true);
    http.send();

    http.onload = function(){
      sendResponse({prof: request.prof, result: http.responseText});
    };

    return true; // prevents the callback from being called too early on return
  });
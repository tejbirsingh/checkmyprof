debugger;
var target,
  instructors = [];

target = $x('/html/body/div[2]/div[4]/table[3]/tbody/tr/td[2]/a');
target.forEach(function(profElement, index){
  var name = profElement.innerText;
  var lastName = name.split(',')[0].toLowerCase().trim();
  var firstName = name.split(',')[1].toLowerCase().trim();
  var prof = {
    name: name,
    lastName: lastName,
    firstName: firstName,
    targetNum: index
  };

  var targetLink = $(target[prof.targetNum]).attr('href');
  var profDiv = '<a id="' + prof.lastName + prof.targetNum + '" href="' + targetLink + '" target="_blank" data-toggle="popover">' +
    target[prof.targetNum].innerText + '</a>';

  target[prof.targetNum].outerHTML = profDiv;

  $('#' + prof.lastName + prof.targetNum).each(function () {
    var $elem = $(this);
    $elem.popover({
      trigger: 'hover',
      html: true,
      container: $elem,
      title: prof.firstName + ' ' + prof.lastName,
      content: popoverTextContentDiv('Loading...'),
      template: '<div class="popover size inactive-link" onclick="return false" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
    });
  });

  instructors.push(prof);
})

bindRatingsToProfessors(instructors);

//find by xpath
function $x(path) {
  var result = document.evaluate(path, document, null, XPathResult.ANY_TYPE, null);
  var xnodes = [];
  var xres;
  while(xres = result.iterateNext()){
    xnodes.push(xres);
  }

  return xnodes;
}

function bindRatingsToProfessors(professors){

  for (var i = 0; i < professors.length; i++) {

    var searchUrl = ubcSearchUrl(professors[i].lastName);

    chrome.runtime.sendMessage({url: searchUrl, prof: professors[i]}, function (response) {

      var profResult = getProfResultFromSearch (response.result, response.prof);

      if(!profResult) {
        $('#' + response.prof.lastName + response.prof.targetNum).each(function () {
          var $elem = $(this);
          $elem.data('bs.popover').options.content = popoverTextContentDiv('Professor Not Found');
        });
        return;
      }

      response.prof.url = profPageUrl(profResult);

      chrome.runtime.sendMessage({url: response.prof.url, prof: response.prof}, function (response){

        var profRatings = professorRatings(response.result);

        var popoverElement
        if (profRatings) {
          popoverElement = makeRatingsPopover(profRatings, response.prof.url);
        }
        else {
          popoverElement = popoverTextContentDiv('Professor Not Found');
        }

        $('#' + response.prof.lastName + response.prof.targetNum).each(function () {
          var $elem = $(this);
          $elem.data('bs.popover').options.content = popoverElement;
        });

      });
    });
  }
}

function ubcSearchUrl(searchQuery) {
  return 'http://www.ratemyprofessors.com/search.jsp?queryBy=teacherName&schoolName=university+of+british+columbia+&queryoption=HEADER&query='
    + searchQuery + '&facetSearch=true';
}
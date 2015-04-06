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

  instructors.push(prof);
})

profRatings(instructors);

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

function profRatings(professors){

  for (var i = 0; i < professors.length; i++) {

    var searchUrl = ubcSearchUrl(professors[i].lastName);

    chrome.runtime.sendMessage({url: searchUrl, prof: professors[i]}, function (response) {

      var profResult = getProfResultFromSearch (response.result, response.prof);

      if(!profResult)
        return;

      response.prof.url = profPageUrl(profResult);

      chrome.runtime.sendMessage({url: response.prof.url, prof: response.prof}, function (response){

        var profRatings = professorRatings(response.result);

        var targetLink = $(target[response.prof.targetNum]).attr('href');
        var profDiv = '<a id="' + profRatings.profName.last + response.prof.targetNum + '" href="' + targetLink + '" target="_blank" data-toggle="popover">' +
          target[response.prof.targetNum].innerText + '</a>';

        target[response.prof.targetNum].outerHTML = profDiv;

        var popoverElement = makeRatingsPopover(profRatings, response.prof.url);

        $('#' + profRatings.profName.last + response.prof.targetNum).each(function () {
          var $elem = $(this);
          $elem.popover({
            trigger: 'hover',
            html: true,
            container: $elem,
            title: profRatings.profName.first + ' ' + profRatings.profName.last,
            content: popoverElement,
            template: '<div class="popover size" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
          });
        });

      });
    });
  }
}

function ubcSearchUrl(searchQuery) {
  return 'http://www.ratemyprofessors.com/search.jsp?queryBy=teacherName&schoolName=university+of+british+columbia+&queryoption=HEADER&query='
    + searchQuery + '&facetSearch=true';
}
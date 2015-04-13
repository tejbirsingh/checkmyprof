debugger;
var target,
  instructors = [];

target = $x('/html/body/div[2]/div[4]/div/div/div[2]/table/tbody/tr/td[2]');

target.forEach(function(profElement, index){
  var splitName = profElement.innerText.split(' ');
  if(splitName.length < 2){
    return;
  }
  var name = splitName[1] + ', ' + splitName[0];

  var lastName = name.split(',')[0].toLowerCase().trim();
  var firstName = name.split(',')[1].toLowerCase().trim();
  var prof = {
    name: name,
    lastName: lastName,
    firstName: firstName,
    targetNum: index
  };

  var profDiv = '<td id="' + prof.lastName.charAt(0) + prof.targetNum + '" style="width:20%;" data-toggle="popover">' + profElement.innerText + '</td>'

  target[prof.targetNum].outerHTML = profDiv;

  $('#' + prof.lastName.charAt(0) + prof.targetNum).each(function () {
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


function bindRatingsToProfessors(professors){

  console.log(professors);
  //for (var i = 0; i < professors.length; i++) {
  //
  //  var searchUrl = ubcSearchUrl(professors[i].lastName);
  //
  //  chrome.runtime.sendMessage({url: searchUrl, prof: professors[i]}, function (response) {
  //
  //    var profResult = getProfResultFromSearch (response.result, response.prof);
  //
  //    if(!profResult) {
  //      $('#' + response.prof.lastName.charAt(0) + response.prof.targetNum).each(function () {
  //        var $elem = $(this);
  //        $elem.data('bs.popover').options.content = popoverTextContentDiv('Professor Not Found');
  //      });
  //      return;
  //    }
  //
  //    response.prof.url = profPageUrl(profResult);
  //
  //    chrome.runtime.sendMessage({url: response.prof.url, prof: response.prof}, function (response){
  //
  //      var profRatings = professorRatings(response.result);
  //
  //      var popoverElement
  //      if (profRatings) {
  //        popoverElement = makeRatingsPopover(profRatings, response.prof.url);
  //      }
  //      else {
  //        popoverElement = popoverTextContentDiv('Professor Not Found');
  //      }
  //
  //      $('#' + response.prof.lastName.charAt(0) + response.prof.targetNum).each(function () {
  //        var $elem = $(this);
  //        $elem.data('bs.popover').options.content = popoverElement;
  //      });
  //
  //    });
  //  });
  //}
}

function sfuSearchUrl(searchQuery) {
  return 'http://www.ratemyprofessors.com/search.jsp?queryBy=teacherName&schoolName=simon+fraser+university+&queryoption=HEADER&query='
    + searchQuery + '&facetSearch=true';
}
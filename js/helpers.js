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

function popoverOptions($elem, prof){
  return {
    trigger: 'hover',
    html: true,
    container: $elem,
    title: prof.firstName + ' ' + prof.lastName,
    content: popoverTextContentDiv('Loading...'),
    template: '<div class="popover size inactive-link" onclick="return false" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  };
}

function bindRatingsToProfessor (searchUrl, professor) {
  chrome.runtime.sendMessage({url: searchUrl, prof: professor}, function (response) {

    var profResult = getProfResultFromSearch(response.result, response.prof);

    if (!profResult) {
      $('#' + response.prof.lastName.charAt(0) + response.prof.targetNum).each(function () {
        var $elem = $(this);
        $elem.data('bs.popover').options.content = popoverTextContentDiv('Professor Not Found');
      });
      return;
    }

    response.prof.url = profPageUrl(profResult);

    chrome.runtime.sendMessage({url: response.prof.url, prof: response.prof}, function (response) {

      var profRatings = professorRatings(response.result);

      var popoverContent
      if (profRatings) {
        popoverContent = makeRatingsPopover(profRatings, response.prof.url);
      }
      else {
        popoverContent = popoverTextContentDiv('Professor Not Found');
      }

      $('#' + response.prof.lastName.charAt(0) + response.prof.targetNum).each(function () {
        var $elem = $(this);
        $elem.data('bs.popover').options.content = popoverContent;
      });
    });
  });
}

function getProfResultFromSearch(result, prof) {

  var temp = document.createElement('div');
  temp.innerHTML = result;
  var searchResults = $(temp).find('.PROFESSOR');
  temp.remove();

  for (var i = 0; i < searchResults.length; i++) {
    var name = $(searchResults[i]).find('.main')[0].innerText;
    if (name.toLowerCase() === prof.name.toLowerCase()) {
      return searchResults[i];
    }

    var lastName = name.split(',')[0].toLowerCase().trim();
    var firstName = name.split(',')[1].toLowerCase().trim();

    if (lastName === prof.lastName) {
      if (firstName.charAt(0) === prof.firstName.charAt(0)) {
        return searchResults[i];
      }
    }
  }
}

function profPageUrl(rateMyProfSearchResult) {

  var link = $(rateMyProfSearchResult).find('a').attr('href');
  return professorUrl(link);
}

function professorUrl(link) {

  return 'http://www.ratemyprofessors.com' + link;
}

function professorRatings(profPage) {

  var temp = document.createElement('div');
  temp.innerHTML = profPage;

  // The prof's page could exist but there are no ratings
  // I check to find his first name at the top like a regular page
  // with ratings would have.
  if(!($(temp).find('.pfname')[0])){
    return false;
  }

  var profFirst = $(temp).find('.pfname')[0].innerText.trim();
  var profLast = $(temp).find('.plname')[0].innerText.trim();
  var profName = {
    first: profFirst,
    last: profLast
  };

  var numRatings = $(temp).find('.rating-count')[0].innerText.trim();

  var overallAndAverage = $(temp).find('.left-breakdown .grade');
  var otherRatings = $(temp).find('.left-breakdown .rating');
  temp.remove();

  return {
    profName: profName,
    quality: overallAndAverage[0].innerText,
    grade: overallAndAverage[1].innerText,
    helpfulness: otherRatings[0].innerText,
    clarity: otherRatings[1].innerText,
    easiness: otherRatings[2].innerText,
    numRatings: numRatings
  };
}

function makeRatingsPopover(profRatings, rateMyProfUrl) {

  var numRatingsDiv = document.createElement('div');
  numRatingsDiv.className = 'num-ratings';
  numRatingsDiv.innerHTML = '<a href="' + rateMyProfUrl + '" onclick="window.open(\'' + rateMyProfUrl + '\', \'_blank\')">' + profRatings.numRatings + '</a>';

  var qDiv = individualRatingDiv('grade', 'Overall Quality', profRatings.quality);
  var gDiv = individualRatingDiv('grade', 'Average Grade', profRatings.grade);
  var hDiv = individualRatingDiv('rating', 'Helpfulness', profRatings.helpfulness);
  var cDiv = individualRatingDiv('rating', 'Clarity', profRatings.clarity);
  var eDiv = individualRatingDiv('rating', 'Easiness', profRatings.easiness);


  var popoverElement = document.createElement('div');
  popoverElement.appendChild(qDiv);
  popoverElement.appendChild(gDiv);
  popoverElement.appendChild(hDiv);
  popoverElement.appendChild(cDiv);
  popoverElement.appendChild(eDiv);
  popoverElement.appendChild(numRatingsDiv);

  return popoverElement;
}

function individualRatingDiv(mainClass, title, value){

  var parentDiv = document.createElement('div');
  var titleDiv = document.createElement('div');
  var valueDiv = document.createElement('div');

  parentDiv.className = mainClass;
  titleDiv.className = 'title';
  valueDiv.className = 'value';

  titleDiv.innerText = title;
  valueDiv.innerText = value;

  titleDiv.appendChild(valueDiv);
  parentDiv.appendChild(titleDiv);

  return parentDiv;
}

function popoverTextContentDiv(text){
  var div = document.createElement('div');
  div.className = 'popover-plain-text';
  div.innerText = text;

  return div;
}
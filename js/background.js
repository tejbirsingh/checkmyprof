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
      var temp = document.createElement('div');
      temp.innerHTML = response.result;
      var searchResults = $(temp).find('.PROFESSOR');
      temp.remove();

      var profResult;

      for(var j = 0; j < searchResults.length; j++){
        var name = $(searchResults[j]).find('.main')[0].innerText;
        if(name.toLowerCase() === response.prof.name.toLowerCase()){
          profResult = searchResults[j];
          break;
        }

        var lastName = name.split(',')[0].toLowerCase().trim();
        var firstName = name.split(',')[1].toLowerCase().trim();

        if(lastName === response.prof.lastName){
          if(firstName.charAt(0) === response.prof.firstName.charAt(0)){
            profResult = searchResults[j];
            break;
          }
        }
      }

      if(!profResult)
        return;

      var link = $(profResult).find('a').attr('href');
      var profPage = professorUrl (link);
      response.prof.url = profPage;
      console.log(profPage);

      chrome.runtime.sendMessage({url: profPage, prof: response.prof}, function (response){

        var profName, numRatings, quality, grade, helpfulness, clarity, easiness,
          pElement, nElement, qElement, gElement, hElement, cElement, eElement;

        var temp = document.createElement('div');
        temp.innerHTML = response.result;

        var profFirst = $(temp).find('.pfname')[0].innerText.trim();
        var profLast = $(temp).find('.plname')[0].innerText.trim();
        profName = profFirst + ' ' + profLast;

        numRatings = $(temp).find('.rating-count')[0].innerText.trim();

        //var info = $(temp).find('.left-breakdown');
        var overallAndAverage = $(temp).find('.left-breakdown .grade');
        var otherRatings = $(temp).find('.left-breakdown .rating');
        temp.remove();

        quality = overallAndAverage[0].innerText;
        grade = overallAndAverage[1].innerText;
        helpfulness = otherRatings[0].innerText;
        clarity = otherRatings[1].innerText;
        easiness = otherRatings[2].innerText;

        var targetLink = $(target[response.prof.targetNum]).attr('href');
        var profDiv = '<a id="' + profLast + response.prof.targetNum + '" href="' + targetLink + '" data-toggle="popover">' +
          target[response.prof.targetNum].innerText + '</a>';

        target[response.prof.targetNum].outerHTML = profDiv;

        qElement = 'Overall Quality: ' + quality + '\n';
        gElement = 'Average Grade: ' + grade + '\n';
        hElement = 'Helpfulness: ' + helpfulness + '\n';
        cElement = 'Clarity: ' + clarity + '\n';
        eElement = 'Easiness: ' + easiness + '\n';


        var popoverElement;


        $('#' + profLast + response.prof.targetNum).each(function () {
          var $elem = $(this);
          $elem.popover({
            trigger: 'hover',
            html: true,
            container: $elem,
            title: profName,
            content: qElement + gElement + hElement + cElement + eElement
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

function professorUrl(link){
  return 'http://www.ratemyprofessors.com' + link;
}
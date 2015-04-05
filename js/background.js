debugger;
var target,
  professors = [];

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

  professors.push(prof);
})

profRatings(professors);

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
      console.log(profPage);

      //chrome.runtime.sendMessage({url: profPage}, function (response) {
      //  var temp = document.createElement('div');
      //  temp.innerHTML = response;
      //  var headings = $(temp).find(".breakdown-header");
      //  var profQuality = '0.0'
      //  for(var i = 0; i < headings.length; i++) {
      //    if(headings[i].innerText.indexOf('Overall Quality') > -1) {
      //      profQuality = $(headings[i]).find('.grade')[0].innerText;
      //    }
      //  }
      //  var proffer = {
      //    quality: profQuality,
      //    name: $(temp).find('.result-name')[0].innerText
      //
      //  }
      //  console.log(proffer);
      //});

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
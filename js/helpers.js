function getProfResultFromSearch (result, prof){
  var temp = document.createElement('div');
  temp.innerHTML = result;
  var searchResults = $(temp).find('.PROFESSOR');
  temp.remove();

  for(var i = 0; i < searchResults.length; i++){
    var name = $(searchResults[i]).find('.main')[0].innerText;
    if(name.toLowerCase() === prof.name.toLowerCase()){
      return searchResults[i];
    }

    var lastName = name.split(',')[0].toLowerCase().trim();
    var firstName = name.split(',')[1].toLowerCase().trim();

    if(lastName === prof.lastName){
      if(firstName.charAt(0) === prof.firstName.charAt(0)){
        return searchResults[i];
      }
    }
  }
}

function profPageUrl(rateMyProfSearchResult){
  var link = $(rateMyProfSearchResult).find('a').attr('href');
  return professorUrl (link);
}

function professorUrl(link){
  return 'http://www.ratemyprofessors.com' + link;
}

var target,
  instructors = [];

target = $x('/html/body/div[3]/form/table/tbody/tr/td[21]');
target.forEach(function(profElement, index){
  var splitName = profElement.innerText.split('(')[0];
  splitName = splitName.split(' ');
  if(splitName.length < 2){
    return;
  }
  var name = splitName[splitName.length - 2].trim() + ', ' + splitName[0].trim();

  var lastName = name.split(',')[0].toLowerCase().trim();
  var firstName = name.split(',')[1].toLowerCase().trim();
  var prof = {
    name: name,
    lastName: lastName,
    firstName: firstName,
    targetNum: index
  };

  var profDiv = '<td id="' + prof.lastName.charAt(0) + prof.targetNum + '" data-toggle="popover" class="dddefault">' + profElement.innerHTML + '</td>'

  target[prof.targetNum].outerHTML = profDiv;

  $('#' + prof.lastName.charAt(0) + prof.targetNum).each(function () {
    var $elem = $(this);
    $elem.popover(popoverOptions($elem, prof, 'left'));
  });

  instructors.push(prof);
})

for (var i = 0; i < instructors.length; i++) {

  var searchUrl = kwantlenSearchUrl(instructors[i].lastName);

  bindRatingsToProfessor(searchUrl, instructors[i]);

}

function kwantlenSearchUrl(searchQuery) {
  return 'http://www.ratemyprofessors.com/search.jsp?queryBy=teacherName&schoolName=kwantlen+polytechnic+university+&queryoption=HEADER&query='
    + searchQuery + '&facetSearch=true';
}
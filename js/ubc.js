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
  var profDiv = '<a id="' + prof.lastName.charAt(0) + prof.targetNum + '" href="' + targetLink + '" target="_blank" data-toggle="popover">' +
    target[prof.targetNum].innerText + '</a>';

  target[prof.targetNum].outerHTML = profDiv;

  $('#' + prof.lastName.charAt(0) + prof.targetNum).each(function () {
    var $elem = $(this);
    $elem.popover(popoverOptions($elem, prof));
  });

  instructors.push(prof);
})

for (var i = 0; i < instructors.length; i++) {

  var searchUrl = ubcSearchUrl(instructors[i].lastName);

  bindRatingsToProfessor(searchUrl, instructors[i]);

}

function ubcSearchUrl(searchQuery) {
  return 'http://www.ratemyprofessors.com/search.jsp?queryBy=teacherName&schoolName=university+of+british+columbia+&queryoption=HEADER&query='
    + searchQuery + '&facetSearch=true';
}
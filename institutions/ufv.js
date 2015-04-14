var target,
  instructors = [];

target = $x('/html/body/div[3]/form/table/tbody/tr/td[20]');

target.forEach(function(profElement, index){
  var splitName = profElement.innerText.split('(')[0];
  splitName = splitName.split(' ');

  var name = splitName[splitName.length - 2].trim() + ', ' + splitName[0].trim();

  var lastName = name.split(',')[0].toLowerCase().trim();
  var firstName = name.split(',')[1].toLowerCase().trim();
  var prof = {
    name: name,
    lastName: lastName,
    firstName: firstName,
    targetNum: index
  };

  var profDiv = '<td class="dddefault"><span id="' + prof.lastName.charAt(0) + prof.targetNum + '" data-toggle="popover" class="tool-tip underline">' + profElement.innerHTML + '</span></td>';

  target[prof.targetNum].outerHTML = profDiv;

  $('#' + prof.lastName.charAt(0) + prof.targetNum).each(function () {
    var $elem = $(this);
    $elem.hover(function () {$(this).removeClass('underline')});
    $elem.popover(popoverOptions($elem, prof, 'left')).on('hidden.bs.popover', function () {
      $(this).addClass('underline');
    });;
  });

  instructors.push(prof);
})

for (var i = 0; i < instructors.length; i++) {

  var searchUrl = ufvSearchUrl(instructors[i].lastName);

  bindRatingsToProfessor(searchUrl, instructors[i]);

}

function ufvSearchUrl(searchQuery) {
  return 'http://www.ratemyprofessors.com/search.jsp?queryBy=teacherName&schoolName=university+of+the+fraser+valley+&queryoption=HEADER&query='
    + searchQuery + '&facetSearch=true';
}
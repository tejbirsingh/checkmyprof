var target,
  instructors = [];

var url = window.location.href;

if(url.indexOf('P_GetCrse') > -1){
  target = $x('/html/body/div[3]/form/table/tbody/tr/td[21]');
  target.forEach(function(profElement, index){
    var splitName = profElement.innerText.split('(')[0];
    splitName = splitName.split(' ');
    if(splitName.length < 2){
      return;
    }
    var name = splitName[splitName.length - 2].trim() + ', ' + splitName[0].trim();

    interactWithProfElement(name, profElement, index, 'left');
  })
}
else {
  target = $x('/html/body/div[3]/form/table[2]/tbody/tr/td[7]');
  target.forEach(function(profElement, index){
    var splitName = profElement.innerText.split(' ');
    if(splitName.length < 2){
      return;
    }
    var name = splitName[1] + ', ' + splitName[0];

    interactWithProfElement(name, profElement, index);
  })

}

for (var i = 0; i < instructors.length; i++) {

  var searchUrl = kwantlenSearchUrl(instructors[i].lastName);

  bindRatingsToProfessor(searchUrl, instructors[i]);

}

function interactWithProfElement(name, profElement, index, placement){

  var lastName = name.split(',')[0].toLowerCase().trim();
  var firstName = name.split(',')[1].toLowerCase().trim();
  var prof = {
    name: name,
    lastName: lastName,
    firstName: firstName,
    targetNum: index
  };

  var profDiv = '<td class="dddefault"><span id="' + prof.lastName.charAt(0) + prof.targetNum + '" data-toggle="popover" class="tool-tip underline">' + profElement.innerHTML + '</span></td>'

  target[prof.targetNum].outerHTML = profDiv;

  $('#' + prof.lastName.charAt(0) + prof.targetNum).each(function () {
    var $elem = $(this);
    $elem.hover(function () {$(this).removeClass('underline')});
    $elem.popover(popoverOptions($elem, prof, placement)).on('hidden.bs.popover', function () {
      $(this).addClass('underline');
    });
  });

  instructors.push(prof);
}

function kwantlenSearchUrl(searchQuery) {
  return 'http://www.ratemyprofessors.com/search.jsp?queryBy=teacherName&schoolName=kwantlen+polytechnic+university+&queryoption=HEADER&query='
    + searchQuery + '&facetSearch=true';
}
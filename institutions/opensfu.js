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

  var profDiv = '<td style="width:20%;"><span id="' + prof.lastName.charAt(0) + prof.targetNum + '" data-toggle="popover" class="tool-tip underline">' + profElement.innerText + '</span></td>'

  target[prof.targetNum].outerHTML = profDiv;

  $('#' + prof.lastName.charAt(0) + prof.targetNum).each(function () {
    var $elem = $(this);
    $elem.hover(function () {$(this).removeClass('underline')});
    $elem.popover(popoverOptions($elem, prof)).on('hidden.bs.popover', function () {
      $(this).addClass('underline');
    });;
  });

  instructors.push(prof);
})

for (var i = 0; i < instructors.length; i++) {

  var searchUrl = sfuSearchUrl(instructors[i].lastName);

  bindRatingsToProfessor(searchUrl, instructors[i]);

}

function sfuSearchUrl(searchQuery) {
  return 'http://www.ratemyprofessors.com/search.jsp?queryBy=teacherName&schoolName=simon+fraser+university+&queryoption=HEADER&query='
    + searchQuery + '&facetSearch=true';
}
/*
* HELPER CLASS FOR ALL METHODS RELATED TO CREATING/DISPLAYING
* THE RATINGS POPOVERS
* */

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
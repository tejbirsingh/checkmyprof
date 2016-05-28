/*
* HELPER CLASS FOR ALL METHODS RELATED TO CREATING/DISPLAYING
* THE RATINGS POPOVERS
* */

function popoverOptions($elem, prof, placement){
  if(!placement){
    placement = 'right';
  }
  return {
    trigger: 'hover',
    html: true,
    container: $elem,
    placement: placement,
    title: prof.firstName + ' ' + prof.lastName,
    content: popoverTextContentDiv('Loading...'),
    template: '<div class="popover size inactive-link" onclick="return false" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  };
}

function makeRatingsPopover(profRatings, rateMyProfUrl) {

  var numRatingsDiv = document.createElement('div');
  numRatingsDiv.className = 'num-ratings';
  numRatingsDiv.innerHTML = '<a href="' + rateMyProfUrl + '" onclick="window.open(\'' + rateMyProfUrl + '\', \'_blank\')">' + profRatings.numRatings + '</a>';

  var qDiv = individualRatingDiv('overall-quality', 'Overall Quality', profRatings.quality);
  var wDiv = individualRatingDiv('grade', 'Would Take Again', profRatings.wouldTakeAgain);
  var lDiv = individualRatingDiv('grade', 'Level of Difficulty', profRatings.difficulty);


  var popoverElement = document.createElement('div');
  popoverElement.appendChild(qDiv);
  popoverElement.appendChild(wDiv);
  popoverElement.appendChild(lDiv);
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
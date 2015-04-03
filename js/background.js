debugger;
var rateDiv, target, professorName;

target = $x('/html/body/div[2]/div[4]/table[3]/tbody/tr/td[2]/a');
var profNames = [];
target.forEach(function(profElement){
  profNames.push(profElement.innerText);
})

profRatings(profNames);

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

function profRatings(profNames){

  chrome.runtime.sendMessage({profNames: profNames}, function(response) {
    console.log(response);
  });
}
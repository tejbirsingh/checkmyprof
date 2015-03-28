/**
 * Created by tejbirsingh on 15-03-27.
 */
debugger;
var rateDiv, target, professorName;

target = $x('/html/body/div[2]/div[4]/table[3]/tbody/tr/td[2]/a');

function $x(path) {
  var result = document.evaluate(path, document, null, XPathResult.ANY_TYPE, null);
  var xnodes = [];
  var xres;
  while(xres = result.iterateNext()){
    xnodes.push(xres);
  }

  return xnodes;
}
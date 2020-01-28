const firebase = require("firebase");
const firebaseConfig = require("../firebase/firebaseConfig");

// var xPathRes = document.evaluate(
//   '//*[@id="tsf"]/DIV[2]/DIV[1]/DIV[3]/CENTER[1]/INPUT[2]',
//   document,
//   null,
//   XPathResult.FIRST_ORDERED_NODE_TYPE,
//   null
// );
// xPathRes.singleNodeValue.click();
firebase.initializeApp(firebaseConfig);
function xpath(body) {
  var messageRef = firebase.database().ref("xpaths");
  body.addEventListener(
    "click",
    e => {
      if (e.shiftKey) {
        e.preventDefault();
        console.log(`${getXPath(e)}`);
        var newMessageRef = messageRef.push();
        newMessageRef.push(`${getXPath(e)}`);
        return `${getXPath(e)}`;
      }
    },
    false
  );
  body.addEventListener("click", e => {
    if (e.altKey) {
      e.preventDefault();
      messageRef.remove();
    }
  });
  body.addEventListener("click", e => {
    if (e.ctrlKey) {
      e.preventDefault();
      messageRef.once("value").then(function(snapshot) {
        console.log(snapshot.val());
      });
    }
  });
}

function getXPath(event) {
  if (event === undefined) event = window.event; // IE hack
  var target = "target" in event ? event.target : event.srcElement; // another IE hack

  var root =
    document.compatMode === "CSS1Compat"
      ? document.documentElement
      : document.body;
  var mxy = [event.clientX + root.scrollLeft, event.clientY + root.scrollTop];

  var path = getPathTo(target);
  var txy = getPageXY(target);
  // alert(
  //   "Clicked element " +
  //     path +
  //     " offset " +
  //     (mxy[0] - txy[0]) +
  //     ", " +
  //     (mxy[1] - txy[1])
  // );
  // console.log(path);
  return path;
}

function getPathTo(element) {
  if (element.id !== "") return `//*[@id="${element.id}"]`; //'//*[@id="' + element.id + '"]';
  if (element === document.body) return element.tagName;

  var ix = 0;
  var siblings = element.parentNode.childNodes;
  for (var i = 0; i < siblings.length; i++) {
    var sibling = siblings[i];
    if (sibling === element)
      return getPathTo(element.parentNode) + `/${element.tagName}[${ix + 1}]`;
    if (sibling.nodeType === 1 && sibling.tagName === element.tagName) ix++;
  }
}

function getPageXY(element) {
  var x = 0,
    y = 0;
  while (element) {
    x += element.offsetLeft;
    y += element.offsetTop;
    element = element.offsetParent;
  }
  return [x, y];
}
// function getXPath(element) {
//   var elm = element.path[0];
//   console.log(element.path);
//   console.log(elm.tagName);
// }
// };
module.exports = { xpath };

/* utils.js: utilities */

// Generate Universally Unique Identifier (UUID) v4
// https://en.wikipedia.org/wiki/Universally_unique_identifier
function generateUUID() {
  var d = new Date().getTime();
  var d2 =
    (typeof performance !== "undefined" &&
      performance.now &&
      performance.now() * 1000) ||
    0;
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = Math.random() * 16;
    if (d > 0) {
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

var colorIndex = 0;
// Returns a color for a custom task, cycle length = 10.
function nextColor() {
  const colors = [
    "blue",
    "orange",
    "green",
    "purple",
    "red",
    "pink",
    "yellow",
    "brown",
    "darkblue",
    "lime",
  ];

  if (colorIndex + 1 < colors.length) {
    colorIndex++;
  } else {
    colorIndex = 0;
  }

  return colors[colorIndex];
}

/* Milestone — render linimasa + kontrol geser */
(function () {
  "use strict";
  var SI = window.SI;
  var rail = document.getElementById("timeline-rail");
  var items = SI.MILESTONES || [];

  var count = document.getElementById("milestone-count");
  if (count) count.textContent = items.length;

  if (rail) {
    rail.innerHTML = items.map(SI.timelineItem).join("");
  }

  function scrollByCard(dir) {
    if (!rail) return;
    var card = rail.querySelector(".tl-item");
    var step = card ? card.getBoundingClientRect().width + 18 : 300;
    rail.scrollBy({ left: dir * step, behavior: "smooth" });
  }
  var prev = document.getElementById("tl-prev");
  var next = document.getElementById("tl-next");
  if (prev) prev.addEventListener("click", function () { scrollByCard(-1); });
  if (next) next.addEventListener("click", function () { scrollByCard(1); });

  SI.refreshReveal();
})();

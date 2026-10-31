/* A Walk Through the City Lights — standalone, needs nothing from script.js */
(function () {
  "use strict";
  var WALK_LINES = [ // one line appears each time they pass a streetlight. Write your own!
    "Imagine, this is me and you, walking through the city lights.",
    "I love the way your eyes sparkle in the night.",
    "The city lights are beautiful, but not as beautiful as your smile.",
    "I would walk any road if it meant holding your hand.",
    "I love you more than words can express.",
    "Kaluguran Daka, mahal ko. Maligayang kaarawan! ♡"
  ];

  var c = document.getElementById("wc"), el = document.getElementById("wline");
  if (!c || !c.getContext) return;
  if (el) el.textContent = WALK_LINES[0];
  var x = c.getContext("2d");
  x.imageSmoothingEnabled = false;

  var W = 240, H = 120, GY = 94, FY = 114, CX = 96, LS = 110, L0 = 240;
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var off = 0, vis = true, last = -1, t = 0, hs = [], userPaused = reduce;
  var R = function (a, b) { return a + Math.random() * (b - a); };
  var pick = function (a) { return a[Math.floor(Math.random() * a.length)]; };

  // follow the ✦ animations button if it exists
  var mo = document.getElementById("mo");
  function isPaused() { return mo ? mo.getAttribute("aria-pressed") === "true" : userPaused; }
  if (mo && reduce) mo.setAttribute("aria-pressed", "true");

  function rect(a, b, w, h, col) { x.fillStyle = col; x.fillRect(Math.floor(a), Math.floor(b), w, h); }
  function hp(a, b, col) { rect(a, b, 1, 1, col); rect(a + 2, b, 1, 1, col); rect(a, b + 1, 3, 1, col); rect(a + 1, b + 2, 1, 1, col); }

  function mk(n, w0, w1, h0, h1) {
    var a = [], p = 0, i;
    for (i = 0; i < n; i++) {
      var w = Math.floor(R(w0, w1)), wn = [], j;
      for (j = 0; j < 80; j++) wn.push(Math.random() < 0.45);
      a.push({ x: p, w: w, h: Math.floor(R(h0, h1)), wn: wn });
      p += w + Math.floor(R(1, 4));
    }
    return { a: a, len: p };
  }
  var far = mk(30, 14, 26, 30, 60), near = mk(24, 20, 34, 40, 76), stars = [], i0;
  for (i0 = 0; i0 < 30; i0++) stars.push({ x: R(0, W), y: R(0, 50), p: R(0, 6) });
  var sky = ["#080b24", "#0b1030", "#0f1538", "#141a42", "#1b1f4d", "#262256", "#35285f", "#4a2f6b"];

  function layer(L, sp, col, alpha) {
    var o = (off * sp) % L.len, k;
    for (k = 0; k < 2; k++) {
      L.a.forEach(function (b) {
        var bx = -o + k * L.len + b.x;
        if (bx > W || bx + b.w < 0) return;
        var top = GY - b.h, cols = Math.floor((b.w - 4) / 5), rows = Math.floor((b.h - 6) / 7), r, q;
        rect(bx, top, b.w, b.h, col);
        rect(bx, top, b.w, 1, "#2a2160");
        x.globalAlpha = alpha;
        for (r = 0; r < rows; r++) for (q = 0; q < cols; q++) {
          if (b.wn[r * cols + q]) {
            x.fillStyle = (r + q) % 3 ? "#ffe08a" : (r % 2 ? "#ff9ccf" : "#b9e6a0");
            x.fillRect(Math.floor(bx + 3 + q * 5), top + 4 + r * 7, 2, 3);
          }
        }
        x.globalAlpha = 1;
      });
    }
  }

  function lamp(sx) {
    var top = 60, i, j, w;
    for (i = 0; i < 40; i += 2) { w = 8 + i * 0.9; x.fillStyle = "rgba(255,224,138,.035)"; x.fillRect(Math.floor(sx + 4 - w / 2), top + 3 + i, Math.floor(w), 2); }
    for (j = 0; j < 5; j++) { w = 70 - j * 10; x.fillStyle = "rgba(255,224,138,.07)"; x.fillRect(Math.floor(sx + 4 - w / 2), 104 + j * 2, w, 2); }
    rect(sx, top, 1, 46, "#3a3480"); rect(sx, top, 6, 1, "#3a3480");
    rect(sx + 3, top + 1, 3, 2, "#ffe08a"); rect(sx - 1, 104, 3, 2, "#3a3480");
  }

  function chars() {
    var s = isPaused() ? 0 : Math.floor(off / 4) & 1, y = FY, g = CX, u = CX + 9, sk = "#f6d0b4", hr = "#2a1a3a";
    rect(g - 1, y, 16, 1, "rgba(0,0,0,.3)");
    rect(g, y - 16, 6, 2, hr); rect(g, y - 14, 1, 4, hr); rect(g + 5, y - 14, 1, 4, hr); rect(g + 1, y - 14, 4, 4, sk);
    rect(g + 1, y - 10, 4, 3, "#ff9ccf"); rect(g, y - 7, 6, 3, "#ff9ccf");
    rect(g + 2, y - 4, 1, 4 - s, sk); rect(g + 4, y - 4, 1, 3 + s, sk);
    rect(u, y - 17, 5, 2, hr); rect(u, y - 15, 5, 4, sk); rect(u, y - 11, 5, 6, "#b9e6a0");
    rect(u + 1, y - 5, 1, 5 - s, hr); rect(u + 3, y - 5, 1, 4 + s, hr);
    rect(g + 6, y - 8, 3, 1, sk);
    hp(g + 6, y - 22 + Math.sin(t / 15), "#ff6fb5");
  }

  function draw() {
    var i, k;
    sky.forEach(function (col, n) { rect(0, n * 15, W, 15, col); });
    stars.forEach(function (s) { if (Math.sin(t / 20 + s.p) > -0.3) rect(s.x, s.y, 1, 1, "#fff"); });
    x.fillStyle = "#fff3c4";
    for (i = -6; i <= 6; i++) { var w = Math.floor(Math.sqrt(36 - i * i)); x.fillRect(190 - w, 22 + i, w * 2, 1); }
    for (i = 0; i < 4; i++) rect(0, GY - 40 + i * 10, W, 10, "rgba(255,111,181," + (0.04 + i * 0.02) + ")");
    layer(far, 0.25, "#1f1c4c", 0.6);
    layer(near, 0.5, "#15123b", 1);
    rect(0, GY, W, H - GY, "#0f0d2e"); rect(0, GY, W, 2, "#2b2060"); rect(0, 106, W, 1, "#1a1640");
    for (k = Math.max(0, Math.floor((off - L0 - 10) / LS)); k <= Math.floor((off + W - L0) / LS); k++) lamp(k * LS + L0 - off);
    chars();
    hs.forEach(function (h) { hp(h.x, h.y, "#ff9ccf"); });
  }

  function say(n) {
    if (!el) return;
    el.style.opacity = 0;
    setTimeout(function () { el.textContent = WALK_LINES[n]; el.style.opacity = 1; }, reduce ? 0 : 450);
  }

  function update() {
    t++; off += 0.4;
    if (t % 50 === 0) hs.push({ x: CX + 7, y: FY - 20, v: R(0.2, 0.4) });
    hs.forEach(function (h) { h.y -= h.v; h.x += Math.sin(t / 25) * 0.2 - 0.1; });
    hs = hs.filter(function (h) { return h.y > -4; });
    if (t % 40 === 0) { var b = pick(pick([far, near]).a); b.wn[Math.floor(R(0, 60))] = !b.wn[Math.floor(R(0, 60))]; }
    var k = Math.floor((off + CX - L0) / LS);
    if (k >= 0 && k !== last) { last = k; say((k + 1) % WALK_LINES.length); }
  }

  try { draw(); } catch (e) { if (el) el.textContent = "Scene error: " + e.message; return; }
  if ("IntersectionObserver" in window) new IntersectionObserver(function (e) { vis = e[0].isIntersecting; }).observe(c);
  (function loop() {
    try { if (vis) { if (!isPaused()) update(); draw(); } } catch (e) { return; }
    requestAnimationFrame(loop);
  })();
})();
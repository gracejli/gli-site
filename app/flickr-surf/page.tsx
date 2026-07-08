"use client";

const APP_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>flickr surf</title>
  <script src="https://cdn.tailwindcss.com"><\/script>
  <style>
    * { box-sizing: border-box; }
    html, body {
      height: 100%;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 13px;
      line-height: 1.4;
      background: #f0f0f0;
      color: #222;
      display: flex;
      flex-direction: row;
      min-height: 100vh;
    }
    fieldset {
      border: 1px solid #999;
      padding: 14px 14px 16px;
      margin: 0 0 14px 0;
      background: #fff;
    }
    legend {
      padding: 0 6px;
      font-weight: bold;
      font-size: 12px;
      letter-spacing: 0.02em;
      text-transform: uppercase;
      color: #333;
    }
    .field {
      margin-top: 12px;
    }
    .field:first-child {
      margin-top: 0;
    }
    label {
      display: block;
      font-size: 11px;
      font-weight: normal;
      color: #555;
      margin-bottom: 5px;
    }
    input[type="text"],
    input[type="date"],
    select {
      width: 100%;
      border: 1px solid #999;
      padding: 6px 8px;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 13px;
      background: #fff;
      border-radius: 0;
    }
    input[type="range"] {
      width: 100%;
      margin: 4px 0 0;
      padding: 0;
    }
    .batch-value {
      font-size: 13px;
      font-weight: bold;
      color: #222;
    }
    .tags-row {
      display: flex;
      gap: 8px;
      align-items: stretch;
    }
    .tags-row input {
      flex: 1;
      min-width: 0;
    }
    .btn-row {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 14px;
    }
    .btn {
      border: 1px solid #999;
      background: #e8e8e8;
      padding: 7px 12px;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 12px;
      line-height: 1.3;
      cursor: pointer;
      border-radius: 0;
      margin: 0;
    }
    .btn:hover { background: #ddd; }
    .btn:active { background: #ccc; }
    .btn-inline {
      padding: 6px 10px;
      white-space: nowrap;
      flex-shrink: 0;
      align-self: stretch;
    }
    #sidebar {
      width: 280px;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      background: #e4e4e4;
      border-right: 1px solid #999;
      padding: 20px 16px;
      overflow-y: auto;
      height: 100vh;
    }
    .sidebar-main {
      flex: 1;
    }
    #sidebar h1 {
      font-size: 15px;
      font-weight: bold;
      line-height: 1.3;
      margin: 0 0 18px 0;
      color: #111;
    }
    .sidebar-about {
      margin-top: 10px;
      padding-top: 10px;
      border-top: 1px solid #b8b8b8;
      font-size: 11px;
      color: #555;
      line-height: 1.4;
    }
    .sidebar-about-summary {
      display: inline-block;
      text-decoration: underline;
      cursor: default;
    }
    .sidebar-about-copy {
      display: none;
      margin-top: 6px;
    }
    .sidebar-about:hover .sidebar-about-copy {
      display: block;
    }
    #main {
      flex: 1;
      overflow-y: auto;
      height: 100vh;
      padding: 20px;
      min-width: 0;
    }
    .photo-card {
      border: 1px solid #bbb;
      background: #fff;
      break-inside: avoid;
      margin-bottom: 16px;
    }
    .photo-card.new {
      animation: fadeSlideUp 0.5s ease-out forwards;
    }
    @keyframes fadeSlideUp {
      from {
        opacity: 0;
        transform: translateY(12px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .photo-wrap {
      cursor: default;
    }
    .photo-overlay {
      display: none;
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.65);
      color: #fff;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 14px;
      text-align: center;
      gap: 4px;
    }
    .photo-wrap:hover .photo-overlay {
      display: flex;
    }
    .overlay-title {
      font-size: 14px;
      font-weight: bold;
      line-height: 1.3;
    }
    .overlay-meta {
      font-size: 11px;
      line-height: 1.4;
      color: rgba(255, 255, 255, 0.9);
    }
    .photo-overlay-link {
      color: #fff;
      text-decoration: underline;
      font-size: 11px;
      margin-top: 6px;
    }
    .photo-overlay-link:hover {
      color: #ddd;
    }
    #status {
      font-size: 11px;
      line-height: 1.4;
      color: #900;
      margin-top: 12px;
      min-height: 16px;
    }
    .hidden { display: none !important; }
    @media (max-width: 640px) {
      body { flex-direction: column; }
      #sidebar {
        width: 100%;
        height: auto;
        max-height: 50vh;
        border-right: none;
        border-bottom: 1px solid #999;
      }
      #main { height: auto; min-height: 50vh; }
    }
  </style>
</head>
<body>
  <aside id="sidebar">
    <div class="sidebar-main">
    <h1>flickr surf</h1>

    <fieldset>
      <legend>Search Parameters</legend>
      <div class="field">
        <label for="tags">Tags (comma-separated)</label>
        <div class="tags-row">
          <input type="text" id="tags" placeholder="e.g. nature, landscape" />
          <button type="button" class="btn btn-inline" id="btn-random-tag">Random</button>
        </div>
      </div>
      <div class="field">
        <label for="tag-mode">Tag Mode</label>
        <select id="tag-mode">
          <option value="all">Match ALL</option>
          <option value="any">Match ANY</option>
        </select>
      </div>
      <div class="field">
        <label for="safe-search">Safe Search</label>
        <select id="safe-search">
          <option value="1">Safe</option>
          <option value="2">Moderate</option>
          <option value="3">Restricted</option>
        </select>
      </div>
    </fieldset>

    <fieldset>
      <legend>Date Range</legend>
      <div class="field">
        <label for="date-mode">Date Mode</label>
        <select id="date-mode">
          <option value="random">Random Date</option>
          <option value="custom">Custom Range</option>
        </select>
      </div>
      <div id="custom-dates" class="hidden">
        <div class="field">
          <label for="start-date">Start Date</label>
          <input type="date" id="start-date" />
        </div>
        <div class="field">
          <label for="end-date">End Date</label>
          <input type="date" id="end-date" />
        </div>
      </div>
    </fieldset>

    <fieldset>
      <legend>Batch Size</legend>
      <div class="field">
        <label for="batch-size">Images per batch: <span class="batch-value" id="batch-size-value">30</span></label>
        <input type="range" id="batch-size" min="0" max="30" value="30" />
      </div>
      <div class="btn-row">
        <button type="button" class="btn" id="btn-start">Start Getting Images</button>
        <button type="button" class="btn hidden" id="btn-stop">Cancel</button>
        <button type="button" class="btn" id="btn-clear">Clear</button>
      </div>
      <div id="status"></div>
    </fieldset>
    </div>
    <div class="sidebar-about">
      <div class="sidebar-about-summary">about</div>
      <div class="sidebar-about-copy">A small tool for image inspiration search, non algorithmic and from real images from flickr. Built in the old HTML style. have fun surfing.<div>
    </div>
  </aside>

  <main id="main">
    <div id="image-grid" class="columns-1 sm:columns-2 gap-4"></div>
  </main>

  <script>
(function () {
  var isRunning = false;

  var tagsEl = document.getElementById("tags");
  var tagModeEl = document.getElementById("tag-mode");
  var safeSearchEl = document.getElementById("safe-search");
  var dateModeEl = document.getElementById("date-mode");
  var customDatesEl = document.getElementById("custom-dates");
  var startDateEl = document.getElementById("start-date");
  var endDateEl = document.getElementById("end-date");
  var btnStart = document.getElementById("btn-start");
  var btnStop = document.getElementById("btn-stop");
  var btnClear = document.getElementById("btn-clear");
  var btnRandomTag = document.getElementById("btn-random-tag");
  var batchSizeEl = document.getElementById("batch-size");
  var batchSizeValueEl = document.getElementById("batch-size-value");
  var statusEl = document.getElementById("status");
  var imageGrid = document.getElementById("image-grid");

  function sleep(ms) {
    return new Promise(function (resolve) { setTimeout(resolve, ms); });
  }

  function setStatus(msg) {
    statusEl.textContent = msg || "";
  }

  dateModeEl.addEventListener("change", function () {
    if (dateModeEl.value === "custom") {
      customDatesEl.classList.remove("hidden");
    } else {
      customDatesEl.classList.add("hidden");
    }
  });

  batchSizeEl.addEventListener("input", function () {
    batchSizeValueEl.textContent = batchSizeEl.value;
  });

  function getBatchSize() {
    return parseInt(batchSizeEl.value, 10) || 0;
  }

  btnRandomTag.addEventListener("click", async function () {
    try {
      btnRandomTag.disabled = true;
      var res = await fetch("/api/nouns/random");
      var data = await res.json();
      if (data.noun) {
        tagsEl.value = data.noun;
        setStatus("");
      } else {
        setStatus(data.error || "Failed to get random tag");
      }
    } catch (err) {
      setStatus("Failed to get random tag");
    } finally {
      btnRandomTag.disabled = false;
    }
  });

  function dateToUnixStart(dateStr) {
    var parts = dateStr.split("-");
    var d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10), 0, 0, 0);
    return Math.floor(d.getTime() / 1000);
  }

  function dateToUnixEnd(dateStr) {
    var parts = dateStr.split("-");
    var d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10), 23, 59, 59);
    return Math.floor(d.getTime() / 1000);
  }

  function randomDateBetween2005AndToday() {
    return randomDayBetween(new Date(2005, 0, 1), new Date());
  }

  function randomDayBetween(rangeStart, rangeEnd) {
    var startDay = new Date(rangeStart.getFullYear(), rangeStart.getMonth(), rangeStart.getDate());
    var endDay = new Date(rangeEnd.getFullYear(), rangeEnd.getMonth(), rangeEnd.getDate());
    var dayCount = Math.floor((endDay.getTime() - startDay.getTime()) / 86400000) + 1;
    var offset = Math.floor(Math.random() * dayCount);
    var d = new Date(startDay);
    d.setDate(d.getDate() + offset);
    return d;
  }

  function randomDayInCustomRange() {
    var rangeStart = startDateEl.value
      ? new Date(startDateEl.value + "T00:00:00")
      : new Date(2005, 0, 1);
    var rangeEnd = endDateEl.value
      ? new Date(endDateEl.value + "T23:59:59")
      : new Date();
    return randomDayBetween(rangeStart, rangeEnd);
  }

  function dateToYYYYMMDD(d) {
    var y = d.getFullYear();
    var m = String(d.getMonth() + 1).padStart(2, "0");
    var day = String(d.getDate()).padStart(2, "0");
    return y + "-" + m + "-" + day;
  }

  function formatDateYYYYMMDD(dateTaken) {
    if (!dateTaken) return "";
    return dateTaken.substring(0, 10);
  }

  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function getPhotoUrl(photo) {
    if (photo.url_l) return photo.url_l;
    if (photo.url_w) return photo.url_w;
    if (photo.url_m) return photo.url_m;
    return "https://live.staticflickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + "_m.jpg";
  }

  function getFlickrPageUrl(photo) {
    return "https://www.flickr.com/photos/" + photo.owner + "/" + photo.id;
  }

  function buildBaseParams() {
    var params = {
      safe_search: safeSearchEl.value,
      sort: "interestingness-desc"
    };
    var tags = tagsEl.value.trim();
    if (tags) {
      params.tags = tags;
      params.tag_mode = tagModeEl.value;
    }
    return params;
  }

  async function fetchPhotos(extraParams) {
    var params = buildBaseParams();
    Object.keys(extraParams).forEach(function (k) {
      params[k] = extraParams[k];
    });
    var qs = new URLSearchParams(params).toString();
    var res = await fetch("/api/flickr?" + qs);
    var data = await res.json();
    if (data.stat === "fail") {
      throw new Error(data.message || "Flickr API error");
    }
    return data;
  }

  function renderPhoto(photo) {
    var url = getPhotoUrl(photo);
    if (!url) return;

    var title = escapeHtml(photo.title || "Untitled");
    var owner = escapeHtml(photo.ownername || "Unknown");
    var dateStr = formatDateYYYYMMDD(photo.datetaken);
    var flickrUrl = escapeHtml(getFlickrPageUrl(photo));

    var html =
      '<div class="photo-card new">' +
        '<div class="photo-wrap relative">' +
          '<img src="' + escapeHtml(url) + '" alt="' + title + '" class="w-full block" loading="lazy" />' +
          '<div class="photo-overlay">' +
            '<div class="overlay-title">' + title + '</div>' +
            '<div class="overlay-meta">' + owner + '</div>' +
            '<div class="overlay-meta">' + escapeHtml(dateStr) + '</div>' +
            '<a class="photo-overlay-link" href="' + flickrUrl + '" target="_blank" rel="noopener noreferrer">link</a>' +
          '</div>' +
        '</div>' +
      '</div>';

    imageGrid.insertAdjacentHTML("afterbegin", html);

    var card = imageGrid.firstElementChild;
    if (card) {
      var wrap = card.querySelector(".photo-wrap");
      if (wrap) {
        wrap.addEventListener("click", function (e) {
          if (e.ctrlKey || e.metaKey) {
            window.open(getFlickrPageUrl(photo), "_blank", "noopener,noreferrer");
          }
        });
      }
      card.addEventListener("animationend", function () {
        card.classList.remove("new");
      }, { once: true });
    }
  }

  async function fetchRandomPhotoForTick() {
    var d = dateModeEl.value === "random"
      ? randomDateBetween2005AndToday()
      : randomDayInCustomRange();
    var dateStr = dateToYYYYMMDD(d);

    var extra = {
      per_page: String(Math.max(getBatchSize(), 1)),
      page: "1",
      min_taken_date: String(dateToUnixStart(dateStr)),
      max_taken_date: String(dateToUnixEnd(dateStr))
    };

    var data = await fetchPhotos(extra);
    var photos = (data.photos && data.photos.photo) || [];
    if (photos.length === 0) return null;
    return photos[Math.floor(Math.random() * photos.length)];
  }

  async function runLoop() {
    while (isRunning) {
      try {
        var photo = await fetchRandomPhotoForTick();
        if (photo) {
          renderPhoto(photo);
          setStatus("");
        } else {
          setStatus("No photos found, retrying...");
        }
      } catch (err) {
        setStatus(err.message || "Request failed");
        isRunning = false;
        btnStart.classList.remove("hidden");
        btnStop.classList.add("hidden");
        break;
      }

      if (isRunning) {
        await sleep(2000);
      }
    }
  }

  btnStart.addEventListener("click", function () {
    if (dateModeEl.value === "custom" && !startDateEl.value && !endDateEl.value) {
      setStatus("Please set a start and/or end date for custom range.");
      return;
    }
    if (getBatchSize() === 0) {
      setStatus("Set images per batch above 0.");
      return;
    }

    isRunning = true;
    setStatus("");
    btnStart.classList.add("hidden");
    btnStop.classList.remove("hidden");
    runLoop();
  });

  btnStop.addEventListener("click", function () {
    isRunning = false;
    btnStart.classList.remove("hidden");
    btnStop.classList.add("hidden");
  });

  btnClear.addEventListener("click", function () {
    isRunning = false;
    imageGrid.innerHTML = "";
    setStatus("");
    btnStart.classList.remove("hidden");
    btnStop.classList.add("hidden");
  });
})();
  <\/script>
</body>
</html>`;

export default function FlickrSurfPage() {
  return (
    <iframe
      srcDoc={APP_HTML}
      title="flickr surf"
      className="w-full h-screen border-0 block"
      sandbox="allow-scripts allow-same-origin allow-popups"
    />
  );
}

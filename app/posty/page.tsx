"use client";

const APP_HTML = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <title>posty</title>
  <style>
    :root {
      --bg:#f5f3ee; --bg-soft:#fbfaf7; --panel:rgba(29,29,29,0.03); --paper:#f5f3ee;
      --ink:rgba(29,29,29,0.9); --muted:rgba(29,29,29,0.55); --line:rgba(29,29,29,0.12);
      --soft-line:rgba(29,29,29,0.08); --accent:rgba(20,20,20,0.82); --error:#a33;
      --radius-lg:28px; --radius-md:20px; --radius-sm:12px;
      --font:Arial, Helvetica, sans-serif;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: radial-gradient(circle at 22% 0%, var(--bg-soft) 0%, var(--bg) 58%);
      color: var(--ink);
      font-family: var(--font);
      font-size: 16px;
      line-height: 1.3;
      letter-spacing: 0.01em;
      -webkit-font-smoothing: antialiased;
    }
    button, input, textarea { font: inherit; }
    button { cursor: pointer; color: inherit; }
    .app { min-height: 100dvh; display: grid; grid-template-columns: minmax(360px, 460px) 1fr; }
    .controls { background: transparent; border-right: 1px solid var(--line); padding: 40px 40px 36px; overflow: auto; }
    .brand { font-size: 20px; font-weight: 400; letter-spacing: 0.01em; margin: 0 0 8px; }
    .brand-note { margin: 0 0 36px; font-size: 16px; line-height: 1.3; color: var(--muted); max-width: 28em; }
    .section { border-top: 1px solid var(--line); padding: 26px 0; margin: 0; }
    .section-title { margin: 0 0 18px; font-size: 13px; font-weight: 400; text-transform: lowercase; letter-spacing: .04em; color: var(--muted); }
    .section-inner { padding: 0; }
    .label { display: block; margin: 0 0 7px; font-size: 15px; color: var(--ink); }
    .hint { display: block; margin-top: 6px; color: var(--muted); font-size: 13px; line-height: 1.35; }
    .field {
      width: 100%; min-height: 44px; padding: 12px 14px;
      border: 1px solid var(--line); border-radius: var(--radius-sm);
      background: rgba(255,255,255,0.35); outline: 0; color: var(--ink);
    }
    .field:focus { border-color: rgba(29,29,29,0.35); box-shadow: 0 0 0 3px rgba(29,29,29,.06); }
    textarea.field { min-height: 150px; line-height: 1.45; resize: vertical; }
    .button {
      min-height: 44px; border: 1px solid var(--line); border-radius: var(--radius-sm);
      background: rgba(255,255,255,0.35); padding: 0 16px; white-space: nowrap; font-weight: 400;
    }
    .button:hover { background: rgba(29,29,29,0.04); }
    .button.primary { background: var(--accent); border-color: transparent; color: #fff; }
    .button.primary:hover { background: #111; }
    .camera-line { display: flex; gap: 12px; margin-bottom: 12px; }
    .camera-line .button { flex: 1; }
    #message { font-family: Arial, Helvetica, sans-serif; }
    .message-head { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 7px; }
    .counter { font-size: 13px; color: var(--muted); }
    .status { min-height: 20px; margin: 16px 0 0; font-size: 14px; line-height: 1.4; }
    .status.error { color: var(--error); }
    .status.success { color: #2f6b3c; }
    .preview {
      position: relative; min-height: 100dvh; display: flex; align-items: center; justify-content: center;
      background: transparent; padding: clamp(28px, 4vw, 64px);
    }
    .preview-stage { width: min(100%, 520px); }
    .preview-label {
      margin: 0 0 14px; font-size: 13px; font-weight: 400; letter-spacing: .04em;
      text-transform: lowercase; color: var(--muted);
    }
    .sent-card {
      background: #ffffff; border: 1px solid var(--line); border-radius: 0;
      overflow: hidden; box-shadow: 0 10px 30px rgba(36,34,28,.06);
      padding: 0;
    }
    .sent-card-photo {
      position: relative; width: 100%; aspect-ratio: 1.55 / 1;
      background: rgba(29,29,29,0.04); overflow: hidden;
      border-radius: 0;
    }
    .sent-card-photo img { display: block; width: 100%; height: 100%; object-fit: cover; }
    .sent-card-photo .empty-photo {
      height: 100%; display: grid; place-items: center; color: var(--muted);
      font-size: 15px; text-align: center; padding: 30px; line-height: 1.4;
    }
    .sent-card-body {
      padding: 22px 24px 26px; color: rgba(29,29,29,0.9);
    }
    .sent-card-message {
      margin: 0; font-size: 17px; line-height: 1.4; white-space: pre-wrap; word-break: break-word;
      min-height: 1.4em;
    }
    .sent-card-message.is-placeholder { color: var(--muted); }
    .sent-card-meta {
      display: flex; justify-content: space-between; gap: 16px; align-items: baseline;
      margin-top: 18px; font-size: 13px; line-height: 1.35; color: #8a8680;
    }
    .sent-card-meta span { min-width: 0; }
    .sent-card-meta .sender { text-align: right; }
    .modal { position: fixed; inset: 0; background: rgba(0,0,0,.5); z-index: 10; display: grid; place-items: center; padding: 20px; }
    .camera-box { width: min(620px, 100%); background: var(--bg); border-radius: var(--radius-md); padding: 18px; }
    .camera-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
    .camera-stage { position: relative; overflow: hidden; background: #202020; border-radius: var(--radius-sm); }
    .camera-box video { display: block; width: 100%; max-height: 65dvh; background: #202020; object-fit: cover; }
    .frame-guide {
      position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);
      aspect-ratio: 1.55; width: min(90vw, 88%); max-height: 82%;
      border: 2px solid #fff; border-radius: 0;
      box-shadow: 0 0 0 1200px rgba(0,0,0,.55); pointer-events: none;
    }
    .rotate-hint { display: flex; align-items: center; gap: 8px; margin: 0 0 12px; padding: 9px 12px; background: rgba(29,29,29,0.04); border: 1px solid var(--line); border-radius: var(--radius-sm); color: var(--ink); font-size: 13px; line-height: 1.35; }
    .rotate-hint svg { flex-shrink: 0; }
    .camera-note { min-height: 18px; margin: 10px 0 0; font-size: 13px; line-height: 1.35; color: var(--muted); }
    .camera-note.error { color: var(--error); }
    .camera-actions { display: flex; justify-content: center; margin-top: 16px; }
    .camera-shutter {
      width: 58px; height: 58px; border-radius: 999px; border: 1.5px solid var(--line);
      background: rgba(255,255,255,0.55); color: var(--ink); padding: 0;
      display: grid; place-items: center;
    }
    .camera-shutter:hover { background: rgba(29,29,29,0.06); }
    .camera-shutter:disabled { cursor: not-allowed; opacity: .4; }
    .camera-shutter svg { width: 22px; height: 22px; display: block; pointer-events: none; }
    .button:disabled { cursor: not-allowed; opacity: .45; }
    .close { border: 0; background: transparent; font-size: 22px; line-height: 1; padding: 0 4px; color: var(--muted); }
    @media (max-width: 760px) {
      .app { display: block; }
      .controls { border-right: 0; border-bottom: 1px solid var(--line); padding: 28px 20px; }
      .brand { font-size: 20px; }
      .camera-button { width: 100%; }
      .preview { min-height: auto; padding: 32px 20px; }
      .preview-stage { width: min(100%, 540px); margin: 0 auto; }
      .camera-box { padding: 14px; }
      .camera-shutter { width: 64px; height: 64px; }
    }
    @media (prefers-reduced-motion: no-preference) {
      .button, .field { transition: background 120ms ease, border-color 120ms ease, opacity 120ms ease; }
    }
  </style>
</head>
<body>
  <main id="app-root" class="app" aria-live="polite"></main>
  <script>
(function () {
  var root = document.getElementById("app-root");
  var DRAFT_KEY = "postcard-simple-draft";
  var CONTACTS_KEY = "postcard-simple-contacts";
  var SENT_KEY = "postcard-simple-sent";
  var stream = null;
  var draft = loadDraft();
  var POSTCARD_FRONT_RATIO = 1.55;

  function loadDraft() {
    try {
      var saved = JSON.parse(localStorage.getItem(DRAFT_KEY) || "{}");
      return {
        photo: saved.photo || "",
        location: saved.location || "",
        date: saved.date || "",
        sender: saved.sender || "",
        recipients: saved.recipients || "",
        message: saved.message || ""
      };
    } catch (e) {
      return { photo: "", location: "", date: "", sender: "", recipients: "", message: "" };
    }
  }

  function escapeHtml(value) {
    return value.replace(/[&<>"']/g, function (char) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char];
    });
  }

  function wordCount(value) {
    return value.trim() ? value.trim().split(/\\s+/).length : 0;
  }

  function saveDraft() {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  }

  function contacts() {
    try {
      return JSON.parse(localStorage.getItem(CONTACTS_KEY) || "[]");
    } catch (e) {
      return [];
    }
  }

  function renderedPhoto() {
    return draft.photo || "";
  }

  function currentRecipients() {
    return draft.recipients.split(/[\\n,]+/).map(function (value) {
      return value.trim();
    }).filter(Boolean);
  }

  function formatDate(value) {
    var source = value || new Date().toISOString().slice(0, 10);
    var parsed = new Date(source + "T12:00:00");
    if (Number.isNaN(parsed.getTime())) return value || "";
    return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  function dataUrlToFile(dataUrl, filename) {
    var parts = dataUrl.split(",");
    var header = parts[0];
    var base64 = parts[1];
    var mimeMatch = /data:(.*?);base64/.exec(header);
    var mime = mimeMatch ? mimeMatch[1] : "image/jpeg";
    var binary = atob(base64);
    var bytes = new Uint8Array(binary.length);
    for (var i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new File([bytes], filename, { type: mime });
  }

  function downloadPhoto(dataUrl, filename) {
    var link = document.createElement("a");
    link.href = dataUrl;
    link.download = filename;
    document.body.append(link);
    link.click();
    link.remove();
  }

  function photoWithWhiteBorder(dataUrl) {
    return new Promise(function (resolve, reject) {
      var photo = new Image();
      photo.onload = function () {
        var border = Math.max(12, Math.round(photo.naturalWidth * 0.018));
        var canvas = document.createElement("canvas");
        canvas.width = photo.naturalWidth + border * 2;
        canvas.height = photo.naturalHeight + border * 2;
        var context = canvas.getContext("2d");
        if (!context) {
          resolve(dataUrl);
          return;
        }
        context.fillStyle = "#fffefb";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(photo, border, border, photo.naturalWidth, photo.naturalHeight);
        resolve(canvas.toDataURL("image/jpeg", 0.9));
      };
      photo.onerror = function () {
        reject(new Error("The postcard photo could not be prepared."));
      };
      photo.src = dataUrl;
    });
  }

  function postcardMarkup() {
    var photo = renderedPhoto();
    var hasMessage = Boolean(draft.message.trim());
    var message = hasMessage ? draft.message : "Your message will appear here as you write it.";
    var sender = draft.sender.trim() || "someone you know";
    var dateLabel = formatDate(draft.date);
    var leftMeta = [dateLabel, draft.location.trim()].filter(Boolean).join(" · ");
    return '<div class="preview-stage">' +
      '<p class="preview-label">preview</p>' +
      '<article class="sent-card" aria-label="Postcard as it will be sent">' +
        '<div class="sent-card-photo">' +
          (photo
            ? '<img src="' + photo + '" alt="Current postcard photograph" />'
            : '<div class="empty-photo">Your landscape photo<br>will appear here.</div>') +
        "</div>" +
        '<div class="sent-card-body">' +
          '<p class="sent-card-message' + (hasMessage ? "" : " is-placeholder") + '">' + escapeHtml(message) + "</p>" +
          '<div class="sent-card-meta">' +
            "<span>" + escapeHtml(leftMeta) + "</span>" +
            '<span class="sender">' + escapeHtml(sender) + "</span>" +
          "</div>" +
        "</div>" +
      "</article>" +
    "</div>";
  }

  function render() {
    root.innerHTML =
      '<section class="controls" aria-label="Postcard controls">' +
        '<h1 class="brand">posty</h1>' +
        '<p class="brand-note">send a digital postcard of where you are, right now. estimated delivery time: sometime in 7-14 days.</p>' +
        '<section class="section"><h2 class="section-title"><span>Photo</span></h2><div class="section-inner">' +
          '<div class="camera-line"><button class="button primary camera-button" type="button" data-action="camera">Take photo</button></div>' +

        "</div></section>" +
        '<section class="section"><h2 class="section-title"><span>Write</span></h2><div class="section-inner">' +
          '<label class="label" for="recipients">To</label>' +
          '<input id="recipients" class="field" type="email" value="' + escapeHtml(draft.recipients) + '" placeholder="recipient@email.com" autocomplete="email" />' +
          '<label class="label" for="sender" style="margin-top:18px">From</label>' +
          '<input id="sender" class="field" value="' + escapeHtml(draft.sender) + '" placeholder="<3 grace" autocomplete="off" />' +
          '<label class="label" for="location" style="margin-top:18px">Location <span class="hint" style="display:inline">optional</span></label>' +
          '<input id="location" class="field" value="' + escapeHtml(draft.location) + '" placeholder="outside in the grass" autocomplete="off" />' +
          '<label class="label" for="date" style="margin-top:18px">Date <span class="hint" style="display:inline">optional</span></label>' +
          '<input id="date" type="date" class="field" value="' + escapeHtml(draft.date) + '" autocomplete="off" />' +
          '<div class="message-head"><label class="label" for="message" style="margin:18px 0 0">Message</label>' +
          '<span class="counter" id="counter">' + wordCount(draft.message) + " / 150 words</span></div>" +
          '<textarea id="message" class="field" placeholder="Write your message…">' + escapeHtml(draft.message) + "</textarea>" +
        "</div></section>" +
        '<button class="button primary" type="button" data-action="send">Send postcard' +
          (currentRecipients().length > 1 ? "s" : "") +
        "</button>" +
        '<span class="hint">Sent by the postcard email backend. If delivery is not configured yet, you can use your device\\'s share sheet instead.</span>' +
        '<p id="status" class="status"></p>' +
      "</section>" +
      '<section class="preview" aria-label="Postcard preview">' + postcardMarkup() + "</section>";
    bind();
  }

  function updateFromInputs() {
    draft.location = document.getElementById("location").value;
    draft.date = document.getElementById("date").value;
    draft.sender = document.getElementById("sender").value;
    draft.recipients = document.getElementById("recipients").value;
    draft.message = document.getElementById("message").value;
    saveDraft();
    var counter = document.getElementById("counter");
    if (counter) counter.textContent = wordCount(draft.message) + " / 150 words";
    updatePreviewOnly();
  }

  function updatePreviewOnly() {
    var preview = root.querySelector(".preview");
    if (!preview) return;
    preview.innerHTML = postcardMarkup();
  }

  function showCamera() {
    var modal = document.createElement("section");
    modal.className = "modal";
    modal.innerHTML =
      '<div class="camera-box" role="dialog" aria-modal="true" aria-label="Back camera">' +
        '<div class="camera-bar"><strong>Back camera</strong>' +
        '<button class="close" aria-label="Close camera" data-action="close-camera">×</button></div>' +
        '<div class="rotate-hint" aria-hidden="true">' +
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="none">' +
            '<path d="M4 12a8 8 0 0 1 13.66-5.66M20 12a8 8 0 0 1-13.66 5.66" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
            '<path d="M14 3.5 17.66 6.34 14.6 8.6M10 20.5 6.34 17.66 9.4 15.4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
          "</svg>" +
          "<span>Turn your phone sideways — the postcard is landscape.</span>" +
        "</div>" +
        '<div class="camera-stage"><video id="camera-video" autoplay muted playsinline></video>' +
        '<div class="frame-guide" aria-hidden="true"></div></div>' +
        '<p class="camera-note" id="camera-note">Opening your back camera…</p>' +
        '<div class="camera-actions">' +
          '<button class="camera-shutter" type="button" data-action="capture" aria-label="Take photo" disabled>' +
            '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
              '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>' +
              '<circle cx="12" cy="13" r="3.25" stroke="currentColor" stroke-width="1.8"/>' +
            "</svg>" +
          "</button>" +
        "</div>" +
      "</div>";
    document.body.append(modal);
    var video = modal.querySelector("video");
    var note = modal.querySelector("#camera-note");
    var captureButton = modal.querySelector('[data-action="capture"]');
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      note.textContent = "This browser cannot open a camera.";
      note.classList.add("error");
      return;
    }

    function attachStream(value, label) {
      stream = value;
      video.srcObject = value;
      video.addEventListener(
        "loadedmetadata",
        function () {
          note.textContent = label;
          note.classList.remove("error");
          captureButton.disabled = false;
        },
        { once: true }
      );
    }

    // Prefer the back camera on phones; fall back to any camera (needed on desktop).
    // exact environment facingMode fails silently on Macs with no rear camera and never prompts.
    navigator.mediaDevices
      .getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      })
      .then(function (value) {
        attachStream(
          value,
          "Rotate your phone to landscape and fill the outlined frame — that\\u2019s exactly what will print on the postcard."
        );
      })
      .catch(function () {
        return navigator.mediaDevices
          .getUserMedia({ video: true, audio: false })
          .then(function (value) {
            attachStream(
              value,
              "Fill the outlined frame — that\\u2019s exactly what will print on the postcard."
            );
          });
      })
      .catch(function (error) {
        var denied = error && (error.name === "NotAllowedError" || error.name === "PermissionDeniedError");
        note.textContent = denied
          ? "Camera permission was blocked. Allow camera access for this site and try again."
          : "Camera access is needed to make a postcard. Check permission and try again.";
        note.classList.add("error");
      });
    modal.addEventListener("click", function (event) {
      var actionEl = event.target.closest("[data-action]");
      if (!actionEl) return;
      var action = actionEl.dataset.action;
      if (action === "close-camera") closeCamera();
      if (action === "capture") capture(video);
    });
  }

  function closeCamera() {
    if (stream) stream.getTracks().forEach(function (track) { track.stop(); });
    stream = null;
    var modal = document.querySelector(".modal");
    if (modal) modal.remove();
  }

  function capture(video) {
    if (!video.videoWidth || !video.videoHeight) return;
    var vw = video.videoWidth;
    var vh = video.videoHeight;
    var sw = vw;
    var sh = vw / POSTCARD_FRONT_RATIO;
    if (sh > vh) {
      sh = vh;
      sw = vh * POSTCARD_FRONT_RATIO;
    }
    var sx = (vw - sw) / 2;
    var sy = (vh - sh) / 2;
    var canvas = document.createElement("canvas");
    var targetWidth = Math.min(1000, sw);
    canvas.width = Math.round(targetWidth);
    canvas.height = Math.round(targetWidth / POSTCARD_FRONT_RATIO);
    var ctx = canvas.getContext("2d");
    if (ctx) ctx.drawImage(video, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
    draft.photo = canvas.toDataURL("image/jpeg", 0.82);
    saveDraft();
    closeCamera();
    render();
  }

  function shareFallback(emails, subject, body, filename) {
    return photoWithWhiteBorder(draft.photo)
      .catch(function () {
        return draft.photo;
      })
      .then(function (finishedPhoto) {
        try {
          var file = dataUrlToFile(finishedPhoto, filename);
          if (navigator.canShare && navigator.canShare({ files: [file] }) && navigator.share) {
            return navigator
              .share({
                files: [file],
                title: subject,
                text: body + "\\n\\nSend to: " + emails.join(", ")
              })
              .then(function () {
                return "device share";
              });
          }
        } catch (e) {
          /* Fall through */
        }
        downloadPhoto(finishedPhoto, filename);
        window.location.href =
          "mailto:" +
          emails.map(function (email) {
            return encodeURIComponent(email);
          }).join(",") +
          "?subject=" +
          encodeURIComponent(subject) +
          "&body=" +
          encodeURIComponent(body);
        return "mail app";
      });
  }

  function rememberSend(emails, method) {
    var sent = JSON.parse(localStorage.getItem(SENT_KEY) || "[]");
    sent.push({
      photo: draft.photo,
      location: draft.location,
      date: draft.date,
      sender: draft.sender,
      message: draft.message,
      recipients: emails,
      sentAt: Date.now(),
      method: method
    });
    localStorage.setItem(SENT_KEY, JSON.stringify(sent));
    localStorage.setItem(
      CONTACTS_KEY,
      JSON.stringify(Array.from(new Set(contacts().concat(emails))))
    );
  }

  function send() {
    updateFromInputs();
    var status = document.getElementById("status");
    var emails = currentRecipients();
    var words = wordCount(draft.message);
    if (!draft.photo) {
      status.className = "status error";
      status.textContent = "Take a photo with the back camera first.";
      return;
    }
    if (!emails.length || emails.some(function (email) {
      return !/^\\S+@\\S+\\.\\S+$/.test(email);
    })) {
      status.className = "status error";
      status.textContent = "Add at least one valid email address.";
      return;
    }
    if (words > 150) {
      status.className = "status error";
      status.textContent = "Your message must be 150 words or fewer.";
      return;
    }

    var sendButton = root.querySelector('[data-action="send"]');
    if (sendButton) {
      sendButton.disabled = true;
      sendButton.textContent = "Sending…";
    }
    status.className = "status";
    status.textContent = "Sending your postcard securely…";

    var senderName = draft.sender.trim() || "a friend";
    var dateLabel = formatDate(draft.date);
    var subject = "A postcard from " + senderName;
    var body = [
      draft.message,
      "",
      "— " +
        senderName +
        (draft.location ? " · " + draft.location : "") +
        (dateLabel ? " · " + dateLabel : "")
    ].join("\\n");
    var filename = "postcard-" + Date.now() + ".jpg";

    fetch("/api/posty/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        photo: draft.photo,
        location: draft.location,
        date: draft.date,
        sender: draft.sender,
        recipients: emails,
        message: draft.message
      })
    })
      .then(function (response) {
        return response.json().catch(function () {
          return {};
        }).then(function (result) {
          return { response: response, result: result };
        });
      })
      .then(function (payload) {
        var response = payload.response;
        var result = payload.result;
        if (response.ok && result.sent) {
          rememberSend(emails, "postcard backend");
          status.className = "status success";
          var recipientLabel =
            "Sent to " +
            emails.length +
            " recipient" +
            (emails.length > 1 ? "s" : "") +
            ". ";
          if (result.immediate) {
            status.textContent =
              recipientLabel + "Delivered immediately (dev mode).";
          } else if (result.delayDays) {
            status.textContent =
              recipientLabel +
              "Your postcard is on its way — delivery in about " +
              result.delayDays +
              " days.";
          } else {
            status.textContent = recipientLabel + "Your postcard is on its way.";
          }
          return;
        }
        if (result.code === "EMAIL_NOT_CONFIGURED") {
          return shareFallback(emails, subject, body, filename).then(function (method) {
            rememberSend(emails, method);
            status.className = "status success";
            status.textContent =
              method === "device share"
                ? "The backend still needs its Resend settings, so your device share sheet opened with the photo attached."
                : "The backend still needs its Resend settings, so your mail app opened and the photo downloaded for attachment.";
          });
        }
        throw new Error(result.error || "The postcard could not be sent.");
      })
      .catch(function (error) {
        status.className = "status error";
        status.textContent =
          error instanceof Error
            ? error.message
            : "The postcard could not be sent. Please try again.";
      })
      .finally(function () {
        if (sendButton) {
          sendButton.disabled = false;
          sendButton.textContent =
            "Send postcard" + (currentRecipients().length > 1 ? "s" : "");
        }
      });
  }

  function bind() {
    var cameraBtn = root.querySelector('[data-action="camera"]');
    var sendBtn = root.querySelector('[data-action="send"]');
    if (cameraBtn) cameraBtn.addEventListener("click", showCamera);
    if (sendBtn) sendBtn.addEventListener("click", send);
    ["location", "date", "sender", "recipients", "message"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener("input", updateFromInputs);
    });
  }

  render();
})();
  <\/script>
</body>
</html>`;

export default function PostyPage() {
  return (
    <iframe
      srcDoc={APP_HTML}
      title="posty"
      className="w-full h-screen border-0 block"
      allow="camera; microphone"
      sandbox="allow-scripts allow-same-origin allow-popups allow-downloads"
    />
  );
}

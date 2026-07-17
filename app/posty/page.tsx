"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import "./posty.css";

type Draft = {
  photo: string;
  location: string;
  sender: string;
  recipients: string;
  message: string;
};

type Status = { kind: "error" | "success" | ""; text: string };

const DRAFT_KEY = "postcard-simple-draft";
const CONTACTS_KEY = "postcard-simple-contacts";
const SENT_KEY = "postcard-simple-sent";
const POSTCARD_FRONT_RATIO = 1.55;
const DEFAULT_PHOTO = "/images/posty/default.jpg";

function emptyDraft(): Draft {
  return {
    photo: "",
    location: "",
    sender: "",
    recipients: "",
    message: "",
  };
}

function loadDraft(): Draft {
  try {
    const saved = JSON.parse(localStorage.getItem(DRAFT_KEY) || "{}") as Partial<Draft>;
    return {
      photo: saved.photo || "",
      location: saved.location || "",
      sender: saved.sender || "",
      recipients: saved.recipients || "",
      message: saved.message || "",
    };
  } catch {
    return emptyDraft();
  }
}

function wordCount(value: string) {
  return value.trim() ? value.trim().split(/\s+/).length : 0;
}

/** Today's date in the sender's local timezone (not UTC). */
function localDateLabel(now = new Date()) {
  return now.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function currentRecipients(recipients: string) {
  return recipients
    .split(/[\n,]+/)
    .map((value) => value.trim())
    .filter(Boolean);
}

function contacts(): string[] {
  try {
    return JSON.parse(localStorage.getItem(CONTACTS_KEY) || "[]") as string[];
  } catch {
    return [];
  }
}

function shouldMirrorCamera(stream: MediaStream) {
  const track = stream.getVideoTracks()[0];
  if (!track) return false;
  return track.getSettings().facingMode !== "environment";
}

function dataUrlToFile(dataUrl: string, filename: string): File {
  const [header, base64] = dataUrl.split(",");
  const mime = /data:(.*?);base64/.exec(header)?.[1] || "image/jpeg";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new File([bytes], filename, { type: mime });
}

function downloadPhoto(dataUrl: string, filename: string) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
}

async function photoWithWhiteBorder(dataUrl: string): Promise<string> {
  const photo = new Image();
  await new Promise<void>((resolve, reject) => {
    photo.onload = () => resolve();
    photo.onerror = () =>
      reject(new Error("The postcard photo could not be prepared."));
    photo.src = dataUrl;
  });
  const border = Math.max(12, Math.round(photo.naturalWidth * 0.018));
  const canvas = document.createElement("canvas");
  canvas.width = photo.naturalWidth + border * 2;
  canvas.height = photo.naturalHeight + border * 2;
  const context = canvas.getContext("2d");
  if (!context) return dataUrl;
  context.fillStyle = "#fffefb";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(photo, border, border, photo.naturalWidth, photo.naturalHeight);
  return canvas.toDataURL("image/jpeg", 0.9);
}

export default function PostyPage() {
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [ready, setReady] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraNote, setCameraNote] = useState("Opening your back camera…");
  const [cameraError, setCameraError] = useState(false);
  const [canCapture, setCanCapture] = useState(false);
  const [mirrorPreview, setMirrorPreview] = useState(false);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: "", text: "" });
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    setDraft(loadDraft());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  }, [draft, ready]);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);

  const closeAbout = useCallback(() => {
    setAboutOpen(false);
  }, []);

  const closeCamera = useCallback(() => {
    stopCamera();
    setCameraOpen(false);
    setCanCapture(false);
    setMirrorPreview(false);
    setCameraError(false);
    setCameraNote("Opening your back camera…");
  }, [stopCamera]);

  useEffect(() => {
    if (!aboutOpen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeAbout();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [aboutOpen, closeAbout]);

  useEffect(() => {
    if (!cameraOpen) return;

    let cancelled = false;
    setCameraNote("Opening your back camera…");
    setCameraError(false);
    setCanCapture(false);
    setMirrorPreview(false);

    async function openStream() {
      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraNote("This browser cannot open a camera.");
        setCameraError(true);
        return;
      }

      try {
        let stream: MediaStream;
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: { ideal: "environment" },
              width: { ideal: 1920 },
              height: { ideal: 1080 },
            },
            audio: false,
          });
          if (!cancelled) {
            setCameraNote("Frame your postcard, then take the photo.");
          }
        } catch {
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          });
          if (!cancelled) {
            setCameraNote("Frame your postcard, then take the photo.");
          }
        }

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        if (!cancelled) {
          setMirrorPreview(shouldMirrorCamera(stream));
        }
        const video = videoRef.current;
        if (video) {
          video.srcObject = stream;
          video.onloadedmetadata = () => {
            if (!cancelled) setCanCapture(true);
          };
        }
      } catch (error) {
        if (cancelled) return;
        const denied =
          error instanceof DOMException &&
          (error.name === "NotAllowedError" ||
            error.name === "PermissionDeniedError");
        setCameraNote(
          denied
            ? "Camera permission was blocked. Allow camera access for this site and try again."
            : "Camera access is needed to make a postcard. Check permission and try again.",
        );
        setCameraError(true);
      }
    }

    void openStream();
    return () => {
      cancelled = true;
      stopCamera();
    };
  }, [cameraOpen, stopCamera]);

  function updateField<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
    setStatus({ kind: "", text: "" });
  }

  function onFieldChange(
    key: keyof Draft,
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    updateField(key, event.target.value);
  }

  function clearDraft() {
    setDraft(emptyDraft());
    setStatus({ kind: "", text: "" });
  }

  function capture() {
    const video = videoRef.current;
    if (!video?.videoWidth || !video.videoHeight) return;

    const vw = video.videoWidth;
    const vh = video.videoHeight;
    let sw = vw;
    let sh = vw / POSTCARD_FRONT_RATIO;
    if (sh > vh) {
      sh = vh;
      sw = vh * POSTCARD_FRONT_RATIO;
    }
    const sx = (vw - sw) / 2;
    const sy = (vh - sh) / 2;
    const canvas = document.createElement("canvas");
    const targetWidth = Math.min(1000, sw);
    canvas.width = Math.round(targetWidth);
    canvas.height = Math.round(targetWidth / POSTCARD_FRONT_RATIO);
    const context = canvas.getContext("2d");
    if (!context) return;
    if (mirrorPreview) {
      context.translate(canvas.width, 0);
      context.scale(-1, 1);
    }
    context.drawImage(video, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
    updateField("photo", canvas.toDataURL("image/jpeg", 0.82));
    closeCamera();
  }

  function rememberSend(emails: string[], method: string, snapshot: Draft) {
    const sent = JSON.parse(localStorage.getItem(SENT_KEY) || "[]") as unknown[];
    sent.push({
      ...snapshot,
      recipients: emails,
      sentAt: Date.now(),
      method,
    });
    localStorage.setItem(SENT_KEY, JSON.stringify(sent));
    localStorage.setItem(
      CONTACTS_KEY,
      JSON.stringify(Array.from(new Set([...contacts(), ...emails]))),
    );
  }

  async function shareFallback(
    emails: string[],
    subject: string,
    body: string,
    filename: string,
    photo: string,
  ): Promise<"device share" | "mail app"> {
    let finishedPhoto = photo;
    try {
      finishedPhoto = await photoWithWhiteBorder(photo);
    } catch {
      /* keep original */
    }
    try {
      const file = dataUrlToFile(finishedPhoto, filename);
      const nav = navigator as Navigator & {
        canShare?: (data: { files: File[] }) => boolean;
        share?: (data: {
          files?: File[];
          title?: string;
          text?: string;
        }) => Promise<void>;
      };
      if (nav.canShare?.({ files: [file] }) && nav.share) {
        await nav.share({
          files: [file],
          title: subject,
          text: `${body}\n\nSend to: ${emails.join(", ")}`,
        });
        return "device share";
      }
    } catch {
      /* fall through */
    }
    downloadPhoto(finishedPhoto, filename);
    window.location.href = `mailto:${emails.map((email) => encodeURIComponent(email)).join(",")}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    return "mail app";
  }

  async function send() {
    const emails = currentRecipients(draft.recipients);
    const words = wordCount(draft.message);
    if (!draft.photo) {
      setStatus({
        kind: "error",
        text: "Take a photo with the back camera first.",
      });
      return;
    }
    if (!emails.length || emails.some((email) => !/^\S+@\S+\.\S+$/.test(email))) {
      setStatus({ kind: "error", text: "Add at least one valid email address." });
      return;
    }
    if (words > 150) {
      setStatus({
        kind: "error",
        text: "Your message must be 150 words or fewer.",
      });
      return;
    }

    setSending(true);
    setStatus({ kind: "", text: "Sending your postcard..." });

    const snapshot = { ...draft };
    const senderName = snapshot.sender.trim() || "a friend";
    const dateLabel = localDateLabel();
    const subject = `a postcard from ${senderName}`;
    const body = [
      snapshot.message,
      "",
      `— ${senderName}${snapshot.location ? ` · ${snapshot.location}` : ""} · ${dateLabel}`,
    ].join("\n");
    const filename = `postcard-${Date.now()}.jpg`;

    try {
      const response = await fetch("/api/posty/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          photo: snapshot.photo,
          location: snapshot.location,
          date: dateLabel,
          sender: snapshot.sender,
          recipients: emails,
          message: snapshot.message,
        }),
      });
      const result = (await response.json().catch(() => ({}))) as {
        sent?: boolean;
        code?: string;
        error?: string;
        immediate?: boolean;
        delayDays?: number | null;
      };

      if (response.ok && result.sent) {
        rememberSend(emails, "postcard backend", snapshot);
        const to = emails[0] ?? "recipient";
        if (result.immediate) {
          setStatus({
            kind: "success",
            text: `Sent to ${to}. Delivered immediately (dev mode).`,
          });
        } else if (result.delayDays) {
          setStatus({
            kind: "success",
            text: `Success, your postcard is on its way to ${to}, estimated delivery in about ${result.delayDays} days.`,
          });
        } else {
          setStatus({
            kind: "success",
            text: `Sent to ${to}. Your postcard is on its way.`,
          });
        }
        return;
      }

      if (result.code === "EMAIL_NOT_CONFIGURED") {
        const method = await shareFallback(
          emails,
          subject,
          body,
          filename,
          snapshot.photo,
        );
        rememberSend(emails, method, snapshot);
        setStatus({
          kind: "success",
          text:
            method === "device share"
              ? "The backend still needs its Resend settings, so your device share sheet opened with the photo attached."
              : "The backend still needs its Resend settings, so your mail app opened and the photo downloaded for attachment.",
        });
        return;
      }

      throw new Error(result.error || "The postcard could not be sent.");
    } catch (error) {
      setStatus({
        kind: "error",
        text:
          error instanceof Error
            ? error.message
            : "The postcard could not be sent. Please try again.",
      });
    } finally {
      setSending(false);
    }
  }

  const photo = draft.photo || DEFAULT_PHOTO;
  const hasMessage = Boolean(draft.message.trim());
  const message = hasMessage
    ? draft.message
    : "your message will appear here~";
  const sender = draft.sender.trim() || "<3 grace";
  const location = draft.location.trim() || "playing at glassell park";
  const leftMeta = [localDateLabel(), location].filter(Boolean).join(" · ");

  return (
    <main className="posty" aria-live="polite">
      <section className="posty-controls" aria-label="Postcard controls">
        <div className="posty-intro">
          <h1 className="posty-brand">
            posty{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="posty-brand-icon"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 9v.906a2.25 2.25 0 0 1-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 0 0 1.183 1.981l6.478 3.488m8.839 2.51-4.66-2.51m0 0-1.023-.55a2.25 2.25 0 0 0-2.134 0l-1.022.55m0 0-4.661 2.51m16.5 1.615a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V8.844a2.25 2.25 0 0 1 1.183-1.981l7.5-4.039a2.25 2.25 0 0 1 2.134 0l7.5 4.039a2.25 2.25 0 0 1 1.183 1.98V19.5Z"
              />
            </svg>
          </h1>
          <p className="posty-brand-note">
            send someone a digital postcard
            <br />
            <em className="posty-brand-note-sub">
              estimated delivery time: 7-14 days
            </em>
          </p>
          <button
            type="button"
            className="posty-about-link"
            aria-expanded={aboutOpen}
            onClick={() => setAboutOpen(true)}
          >
            about
          </button>
        </div>

        <section className="posty-section posty-section-photo">
          <h2 className="posty-section-title">
            <span>Photo</span>
          </h2>
          <div className="posty-row">
            <button
              className="posty-button primary"
              type="button"
              onClick={() => setCameraOpen(true)}
            >
              Take photo
            </button>
          </div>
        </section>

        <section className="posty-section posty-section-write">
          <h2 className="posty-section-title">
            <span>Write</span>
          </h2>
          <label className="posty-label" htmlFor="recipients">
            To
          </label>
          <input
            id="recipients"
            className="posty-field"
            type="email"
            value={draft.recipients}
            placeholder="recipient@email.com"
            autoComplete="email"
            onChange={(event) => onFieldChange("recipients", event)}
          />
          <label className="posty-label posty-field-gap" htmlFor="sender">
            From
          </label>
          <input
            id="sender"
            className="posty-field"
            value={draft.sender}
            placeholder="<3 grace"
            autoComplete="off"
            onChange={(event) => onFieldChange("sender", event)}
          />
          <label className="posty-label posty-field-gap" htmlFor="location">
            Location
          </label>
          <input
            id="location"
            className="posty-field"
            value={draft.location}
            placeholder="playing at glassell park"
            autoComplete="off"
            onChange={(event) => onFieldChange("location", event)}
          />
          <div className="posty-message-head">
            <label className="posty-label" htmlFor="message" style={{ margin: 0 }}>
              Message
            </label>
            <span className="posty-counter">
              {wordCount(draft.message)} / 150 words
            </span>
          </div>
          <textarea
            id="message"
            className="posty-field"
            placeholder="Write your message…"
            value={draft.message}
            onChange={(event) => onFieldChange("message", event)}
          />
        </section>

        <div className="posty-row posty-actions">
          <button className="posty-button" type="button" onClick={clearDraft}>
            Clear
          </button>
          <button
            className="posty-button primary"
            type="button"
            disabled={sending}
            onClick={() => void send()}
          >
            {sending ? "Sending…" : "Send postcard"}
          </button>
        </div>
        <p className={`posty-status ${status.kind}`.trim()}>{status.text}</p>
      </section>

      <section className="posty-preview" aria-label="Postcard preview">
        <div className="posty-preview-stage">
          <p className="posty-preview-label">preview</p>
          <article
            className="posty-card"
            aria-label="Postcard as it will be sent"
          >
            <div className="posty-card-photo">
              <img src={photo} alt="Current postcard photograph" />
            </div>
            <div className="posty-card-body">
              <p
                className={`posty-card-message${hasMessage ? "" : " is-placeholder"}`}
              >
                {message}
              </p>
              <div className="posty-card-meta">
                <span>{leftMeta}</span>
                <span className="sender">{sender}</span>
              </div>
            </div>
          </article>
        </div>
      </section>

      {aboutOpen ? (
        <section className="posty-modal" onClick={closeAbout}>
          <div
            className="posty-about-box"
            role="dialog"
            aria-modal="true"
            aria-labelledby="posty-about-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="posty-about-head">
              <span id="posty-about-title" className="posty-about-title">
                about posty
              </span>
              <button
                className="posty-close"
                aria-label="Close about posty"
                type="button"
                onClick={closeAbout}
              >
                ×
              </button>
            </div>
            <div className="posty-about-body">
              <p>
                take a photo for someone, and write them. they&apos;ll get your digital postcard in about{" "}
                7–14 days from no-reply [at] posty.gracejli.com. 
              </p>
              <p className="posty-about-signoff"></p>
            </div>
          </div>
        </section>
      ) : null}

      {cameraOpen ? (
        <section className="posty-modal">
          <div
            className="posty-camera-box"
            role="dialog"
            aria-modal="true"
            aria-label={mirrorPreview ? "Camera" : "Back camera"}
          >
            <div className="posty-camera-bar">
              <strong>{mirrorPreview ? "Camera" : "Back camera"}</strong>
              <button
                className="posty-close"
                aria-label="Close camera"
                type="button"
                onClick={closeCamera}
              >
                ×
              </button>
            </div>
            <div className="posty-camera-stage">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className={mirrorPreview ? "posty-camera-mirror" : undefined}
              />
            </div>
            <p
              className={`posty-camera-note${cameraError ? " error" : ""}`.trim()}
            >
              {cameraNote}
            </p>
            <div className="posty-camera-actions">
              <button
                className="posty-shutter"
                type="button"
                aria-label="Take photo"
                disabled={!canCapture}
                onClick={capture}
              >
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="12"
                    cy="13"
                    r="3.25"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                </svg>
              </button>
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}

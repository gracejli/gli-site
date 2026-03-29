"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  getApps,
  initializeApp,
  type FirebaseApp,
  type FirebaseOptions,
} from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
  query,
  limit,
  orderBy,
  type Firestore,
} from "firebase/firestore";
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
  signInWithCustomToken,
  type Auth,
  type User,
} from "firebase/auth";
import {
  Camera,
  ChevronLeft,
  Info,
  MapPin,
  RefreshCw,
  Share,
  MoreHorizontal,
} from "lucide-react";

// --- CONFIGURATION ---
const SIGNPOST_LAT = 34.0522;
const SIGNPOST_LON = -118.2437;
const ALLOWED_RADIUS_METERS = 100;

/** Full Firebase web config as JSON: `NEXT_PUBLIC_FIREBASE_CONFIG='{"apiKey":"...",...}'` */
function getPhotoBoothFirebase(): {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
} | null {
  const raw = process.env.NEXT_PUBLIC_FIREBASE_CONFIG;
  if (!raw) return null;
  try {
    const firebaseConfig = JSON.parse(raw) as FirebaseOptions;
    const app =
      getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]!;
    return { app, auth: getAuth(app), db: getFirestore(app) };
  } catch {
    return null;
  }
}

const firebaseClient = getPhotoBoothFirebase();
const auth = firebaseClient?.auth ?? null;
const db = firebaseClient?.db ?? null;
const artifactAppId =
  process.env.NEXT_PUBLIC_PHOTO_BOOTH_ARTIFACT_APP_ID ?? "photo-booth-signpost";

// --- HELPERS ---
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  const R = 6371e3;
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

type LocationStatus = "checking" | "granted" | "denied" | "too-far";

type GalleryPhoto = {
  id: string;
  image?: string;
  timestamp?: { seconds: number };
  userId?: string;
  distance?: number;
};

const FILTERS = [
  { id: "none", name: "Normal", css: "" },
  { id: "mirror", name: "Mirror", css: "scaleX(-1)" },
  {
    id: "thermal",
    name: "Thermal",
    css: "invert(1) hue-rotate(180deg) brightness(1.2) contrast(1.5)",
  },
  { id: "sepia", name: "Sepia", css: "sepia(1) contrast(1.1)" },
  { id: "bw", name: "B&W", css: "grayscale(1) contrast(1.2)" },
];

export default function App() {
  const [view, setView] = useState<"albums" | "grid" | "booth">("albums");
  const [user, setUser] = useState<User | null>(null);
  const [locationStatus, setLocationStatus] =
    useState<LocationStatus>("checking");
  const [distance, setDistance] = useState<number | null>(null);
  const [gallery, setGallery] = useState<GalleryPhoto[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(
    null
  );

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [activeFilter, setActiveFilter] = useState(FILTERS[0]);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!auth) return;
    const initAuth = async () => {
      const token = process.env.NEXT_PUBLIC_FIREBASE_INITIAL_AUTH_TOKEN;
      try {
        if (token) {
          await signInWithCustomToken(auth, token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (e) {
        console.error("Auth failed", e);
      }
    };
    void initAuth();
    return onAuthStateChanged(auth, setUser);
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatus("denied");
      return;
    }
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const d = calculateDistance(
          pos.coords.latitude,
          pos.coords.longitude,
          SIGNPOST_LAT,
          SIGNPOST_LON
        );
        setDistance(Math.round(d));
        setLocationStatus(d <= ALLOWED_RADIUS_METERS ? "granted" : "too-far");
      },
      () => setLocationStatus("denied"),
      { enableHighAccuracy: true }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  useEffect(() => {
    if (!db || !user) return;
    const photosRef = collection(
      db,
      "artifacts",
      artifactAppId,
      "public",
      "data",
      "photos"
    );
    const photosQuery = query(
      photosRef,
      orderBy("timestamp", "desc"),
      limit(20)
    );
    const unsubscribe = onSnapshot(
      photosQuery,
      (snapshot) => {
        const docs: GalleryPhoto[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as GalleryPhoto[];
        setGallery(docs);
      },
      (err) => console.error("Firestore Error:", err)
    );
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (view !== "booth" || !stream) return;
    const el = videoRef.current;
    if (el) el.srcObject = stream;
    return () => {
      if (el) el.srcObject = null;
    };
  }, [view, stream]);

  const stopCamera = useCallback(() => {
    stream?.getTracks().forEach((t) => t.stop());
    setStream(null);
    setCapturedImage(null);
    setView("albums");
  }, [stream]);

  const handleHeaderBack = () => {
    if (view === "booth") stopCamera();
    else setView("albums");
  };

  const startCamera = async () => {
    if (!firebaseClient || locationStatus !== "granted") return;
    setView("booth");
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      setStream(s);
    } catch (err) {
      console.error("Camera denied", err);
    }
  };

  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.filter = getComputedStyle(video).filter;
    if (activeFilter.id === "mirror") {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    setCapturedImage(canvas.toDataURL("image/jpeg", 0.8));
  };

  const uploadPhoto = async () => {
    if (!db || !user || !capturedImage || isUploading) return;
    setIsUploading(true);
    try {
      await addDoc(
        collection(
          db,
          "artifacts",
          artifactAppId,
          "public",
          "data",
          "photos"
        ),
        {
          image: capturedImage,
          timestamp: serverTimestamp(),
          userId: user.uid,
          distance,
        }
      );
      stopCamera();
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setIsUploading(false);
    }
  };

  if (!firebaseClient) {
    return (
      <div className="min-h-screen bg-white text-black font-sans flex items-center justify-center p-6">
        <div className="max-w-md text-center space-y-3">
          <h1 className="text-xl font-semibold">Photo booth needs Firebase</h1>
          <p className="text-sm text-gray-600 leading-relaxed">
            Add{" "}
            <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">
              NEXT_PUBLIC_FIREBASE_CONFIG
            </code>{" "}
            to{" "}
            <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">
              .env.local
            </code>{" "}
            as a JSON string of your Firebase web app config (same object as
            the Firebase console snippet).
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-blue-100 pb-20">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 saturate-150">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-end justify-between min-h-[64px]">
          {view === "albums" ? (
            <h1 className="text-3xl font-bold tracking-tight">Albums</h1>
          ) : (
            <div className="flex flex-col w-full">
              <button
                type="button"
                onClick={handleHeaderBack}
                className="flex items-center text-blue-500 -ml-2 mb-1"
              >
                <ChevronLeft size={24} />
                <span className="text-lg">Albums</span>
              </button>
              <div className="flex justify-between items-end">
                <h1 className="text-3xl font-bold tracking-tight truncate">
                  {view === "grid" ? "Recent Snaps" : "Photo Booth"}
                </h1>
                <span className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">
                  {view === "grid" ? `${gallery.length} Photos` : "Live"}
                </span>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4">
        
        {/* VIEW: ALBUMS */}
        {view === "albums" && (
          <div className="flex flex-col gap-12 pt-4">
            <div className="grid grid-cols-2 gap-6">
              <div
                className="group cursor-pointer"
                onClick={() => setView("grid")}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setView("grid");
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden relative shadow-sm border border-gray-200/50 mb-2">
                  {gallery[0]?.image ? (
                    <img
                      src={gallery[0].image}
                      className="w-full h-full object-cover"
                      alt="Recents"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <ImageIcon size={48} />
                    </div>
                  )}
                </div>
                <h2 className="text-base font-semibold">Recent Snaps</h2>
                <p className="text-sm text-gray-500">{gallery.length}</p>
              </div>

              <div
                className={`group cursor-pointer ${locationStatus !== "granted" ? "opacity-60" : ""}`}
                onClick={startCamera}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    void startCamera();
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden relative shadow-sm border border-gray-200/50 mb-2 flex items-center justify-center">
                  {locationStatus === "granted" ? (
                    <div className="bg-blue-50 p-6 rounded-full text-blue-500">
                      <Camera size={48} />
                    </div>
                  ) : locationStatus === "checking" ? (
                    <div className="flex flex-col items-center gap-2 text-gray-400 px-4 text-center">
                      <MapPin size={32} className="animate-pulse" />
                      <span className="text-[10px] uppercase font-bold tracking-tighter">
                        Checking location…
                      </span>
                    </div>
                  ) : locationStatus === "too-far" ? (
                    <div className="flex flex-col items-center gap-2 text-amber-600 px-4 text-center">
                      <MapPin size={32} />
                      <span className="text-[10px] uppercase font-bold tracking-tighter">
                        Too far from signpost
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-400 px-4 text-center">
                      <MapPin size={32} />
                      <span className="text-[10px] uppercase font-bold tracking-tighter">
                        Location required
                      </span>
                    </div>
                  )}
                </div>
                <h2 className="text-base font-semibold">New Entry</h2>
                <p className="text-sm text-gray-500">
                  {locationStatus === "too-far" && distance != null
                    ? `${distance}m away`
                    : locationStatus === "granted"
                      ? "At signpost — open booth"
                      : locationStatus === "checking"
                        ? "…"
                        : "Enable location to unlock"}
                </p>
              </div>
            </div>

            {/* About Section */}
            <div className="px-1 border-t border-gray-100 pt-8">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">About</h3>
              <p className="text-sm text-gray-600 leading-relaxed max-w-lg">
                Project inspired by the camera rolls in public Apple Stores of the people who take photos. 
                Photos will be deleted after 1 month, and users can only see the most recent 20. 
                Location is only used so that folks are uploading only where the signs are posted :)
              </p>
            </div>
          </div>
        )}

        {/* VIEW: GRID */}
        {view === "grid" && (
          <div className="grid grid-cols-3 gap-[2px] -mx-4">
            {gallery.map((photo) => (
              <div
                key={photo.id}
                className="aspect-square bg-gray-100 cursor-pointer overflow-hidden relative active:opacity-70 transition-opacity"
                onClick={() => setSelectedPhoto(photo)}
              >
                {photo.image ? (
                  <img
                    src={photo.image}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    alt=""
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200" />
                )}
              </div>
            ))}
          </div>
        )}

        {/* VIEW: BOOTH */}
        {view === 'booth' && (
          <div className="space-y-6 pt-4">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-black shadow-2xl">
              {!capturedImage ? (
                <>
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    className="w-full h-full object-cover"
                    style={{ filter: activeFilter.css }}
                  />
                  <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 px-4 overflow-x-auto no-scrollbar">
                    {FILTERS.map(f => (
                      <button
                        key={f.id}
                        onClick={() => setActiveFilter(f)}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap backdrop-blur-md transition-all ${
                          activeFilter.id === f.id ? 'bg-white text-black' : 'bg-black/40 text-white'
                        }`}
                      >
                        {f.name}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <img src={capturedImage} className="w-full h-full object-cover" alt="Captured" />
              )}
            </div>

            <div className="flex gap-4">
              {!capturedImage ? (
                <button 
                  onClick={takePhoto}
                  className="flex-1 bg-black text-white h-16 rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform"
                >
                  <Camera size={24} /> SNAP
                </button>
              ) : (
                <>
                  <button 
                    onClick={() => setCapturedImage(null)}
                    className="flex-1 bg-gray-100 text-black h-16 rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform"
                  >
                    <RefreshCw size={20} /> RETAKE
                  </button>
                  <button 
                    onClick={uploadPhoto}
                    disabled={isUploading}
                    className="flex-1 bg-blue-500 text-white h-16 rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-50"
                  >
                    {isUploading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'SHARE'}
                  </button>
                </>
              )}
            </div>
            <p className="text-center text-[10px] text-gray-400 uppercase tracking-widest">
              Photos are public and stored for 1 month.
            </p>
          </div>
        )}
      </main>

      {/* LIGHTBOX / DETAIL VIEW */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col animate-in fade-in duration-200">
          <header className="flex items-center justify-between p-4 bg-white/90 backdrop-blur-md">
            <button onClick={() => setSelectedPhoto(null)} className="text-blue-500"><ChevronLeft size={28} /></button>
            <div className="text-center">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-tighter">
                {selectedPhoto.timestamp?.seconds ? new Date(selectedPhoto.timestamp.seconds * 1000).toLocaleDateString() : 'Just now'}
              </p>
              <p className="text-xs text-gray-500">
                {selectedPhoto.timestamp?.seconds ? new Date(selectedPhoto.timestamp.seconds * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
              </p>
            </div>
            <div className="w-10" />
          </header>
          
          <div className="flex-1 flex items-center justify-center p-2 bg-gray-50">
            {selectedPhoto.image ? (
              <img
                src={selectedPhoto.image}
                className="max-w-full max-h-full object-contain rounded-lg shadow-xl"
                alt=""
              />
            ) : null}
          </div>

          <footer className="p-6 border-t border-gray-100 flex justify-around text-blue-500">
            <Share size={24} className="opacity-50" />
            <Info size={24} className="opacity-50" />
            <MoreHorizontal size={24} className="opacity-50" />
          </footer>
        </div>
      )}

      {/* Canvas for Capture */}
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Hide Scrollbar Style */}
      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}

function ImageIcon({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  );
}
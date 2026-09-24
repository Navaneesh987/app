import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./config.js";

const statusEl = document.getElementById("status");
const button = document.getElementById("shareBtn");
const result = document.getElementById("result");
const latEl = document.getElementById("lat");
const lngEl = document.getElementById("lng");
const accuracyEl = document.getElementById("accuracy");
const mapLink = document.getElementById("mapLink");

const configured =
  SUPABASE_URL.startsWith("https://") &&
  !SUPABASE_URL.includes("YOUR_") &&
  !SUPABASE_ANON_KEY.includes("YOUR_");

const supabase = configured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

function setStatus(message) {
  statusEl.textContent = message;
}

function showLocation(latitude, longitude, accuracy) {
  latEl.textContent = latitude.toFixed(6);
  lngEl.textContent = longitude.toFixed(6);
  accuracyEl.textContent = `${Math.round(accuracy)} m`;
  mapLink.href = `https://www.google.com/maps?q=${latitude},${longitude}`;
  result.classList.remove("hidden");
}

async function shareLocation() {
  if (!configured) {
    setStatus("Add your Supabase URL and anon key in config.js first.");
    return;
  }

  if (!window.isSecureContext) {
    setStatus("Location requires HTTPS. Deploy this site on Vercel or another HTTPS host.");
    return;
  }

  if (!navigator.geolocation) {
    setStatus("This browser does not support location services.");
    return;
  }

  button.disabled = true;
  result.classList.add("hidden");
  setStatus("Requesting your location...");

  const started = performance.now();

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude, accuracy } = position.coords;
      showLocation(latitude, longitude, accuracy);
      setStatus(`Location found in ${((performance.now() - started) / 1000).toFixed(1)}s. Saving...`);

      const { error } = await supabase.from("locations").insert({
        latitude,
        longitude,
        accuracy
      });

      if (error) {
        console.error(error);
        setStatus("Location found, but it could not be saved.");
      } else {
        setStatus("Location found and saved successfully.");
      }

      button.disabled = false;
    },
    (error) => {
      const messages = {
        1: "Permission denied. Allow location access and try again.",
        2: "Location unavailable. Check GPS/network and try again.",
        3: "Location request timed out. Try again."
      };
      setStatus(messages[error.code] || "Could not get your location.");
      button.disabled = false;
    },
    {
      enableHighAccuracy: true,
      timeout: 2000,
      maximumAge: 0
    }
  );
}

button.addEventListener("click", shareLocation);

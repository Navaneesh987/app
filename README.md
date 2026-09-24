# Location Share App

A simple consent-based location sharing website using:
- HTML/CSS/JavaScript
- Supabase database
- Vercel (or another HTTPS static host)

## 1. Create the Supabase table
Open Supabase -> SQL Editor and run `supabase.sql`.

## 2. Get your Supabase credentials
Open:
Project Settings -> API

Copy:
- Project URL
- Publishable/anon key

Put them in `config.js`.

Do NOT put your Supabase service-role/secret key in this project.

## 3. Test locally
Because browser geolocation requires a secure context, use an HTTPS deployment for phone testing.

## 4. Deploy to Vercel
Upload this folder to GitHub, then import the repository in Vercel.

The site asks the user to explicitly press "Share My Location" and grant browser location permission. It does not secretly collect location.

## Speed
The browser request uses:
enableHighAccuracy: true
timeout: 2000
maximumAge: 0

The 2-second value is a timeout, not a guarantee. GPS/network conditions and the user's device determine how quickly a location is returned.

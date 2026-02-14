# Google Maps API REQUEST_DENIED Error - Fix Guide

## 🐛 Problem

When editing trips, you see the error:
> Google Maps error: REQUEST_DENIED

This means the Google Maps API key is not properly configured or doesn't have the required permissions.

## 🔍 Root Cause

The `REQUEST_DENIED` error occurs when:
1. ❌ **Distance Matrix API is not enabled** in Google Cloud Console
2. ❌ **API key has restrictions** that block your requests
3. ❌ **API key is invalid or expired**
4. ❌ **Billing is not enabled** on the Google Cloud project

## ✅ Solution

### Step 1: Enable Required APIs

You need to enable **TWO** APIs in Google Cloud Console:

1. **Go to Google Cloud Console:**
   - Visit: https://console.cloud.google.com/
   - Select your project: `stua-da096`

2. **Enable Distance Matrix API:**
   - Go to: https://console.cloud.google.com/apis/library/distance-matrix-backend.googleapis.com
   - Click **"ENABLE"**
   - Wait for it to activate

3. **Enable Maps JavaScript API** (if not already enabled):
   - Go to: https://console.cloud.google.com/apis/library/maps-backend.googleapis.com
   - Click **"ENABLE"**

### Step 2: Check API Key Restrictions

1. **Go to Credentials:**
   - Visit: https://console.cloud.google.com/apis/credentials
   - Find your API key: `AIzaSyDPHdume1DHOOJISI3QOGTWTWk85-v6Fls`
   - Click on it to edit

2. **Check Application Restrictions:**
   - Should be set to **"None"** for development
   - OR set to **"HTTP referrers"** with:
     - `http://localhost:*`
     - `http://127.0.0.1:*`
     - Your production domain

3. **Check API Restrictions:**
   - Should include:
     - ✅ Distance Matrix API
     - ✅ Maps JavaScript API
     - ✅ Places API (optional, for autocomplete)
     - ✅ Geocoding API (optional, for address validation)

### Step 3: Enable Billing

Google Maps APIs require billing to be enabled (even for free tier):

1. **Go to Billing:**
   - Visit: https://console.cloud.google.com/billing
   - Link a billing account to your project
   - Don't worry: Google provides **$200 free credit per month**

2. **Free Tier Limits:**
   - Distance Matrix API: First 100,000 elements free per month
   - Maps JavaScript API: First 28,000 loads free per month
   - You're unlikely to exceed these limits in development

### Step 4: Verify API Key

After making changes, verify your API key works:

1. **Test in Browser Console:**
   ```javascript
   // Open browser console on your app
   console.log(import.meta.env.VITE_GOOGLE_MAPS_API_KEY);
   // Should show: AIzaSyDPHdume1DHOOJISI3QOGTWTWk85-v6Fls
   ```

2. **Test Distance Matrix API:**
   ```javascript
   // In browser console
   const service = new google.maps.DistanceMatrixService();
   service.getDistanceMatrix({
     origins: ['New York, NY'],
     destinations: ['Boston, MA'],
     travelMode: google.maps.TravelMode.DRIVING
   }, (response, status) => {
     console.log('Status:', status);
     console.log('Response:', response);
   });
   ```

   **Expected:** Status should be `"OK"`
   **If still denied:** API key needs more configuration

## 🔧 Quick Fix Checklist

- [ ] Enable Distance Matrix API in Google Cloud Console
- [ ] Enable Maps JavaScript API in Google Cloud Console
- [ ] Set API key restrictions to "None" or allow localhost
- [ ] Enable billing on the project
- [ ] Wait 2-5 minutes for changes to propagate
- [ ] Restart your dev server: `npm run dev`
- [ ] Clear browser cache and reload
- [ ] Test trip editing again

## 🎯 Alternative: Use Existing Trip Data

If you can't fix the Google Maps API immediately, you can modify the EditTripModal to skip recalculation:

### Option 1: Manual Distance Entry (Quick Fix)

Add a manual distance input field as a fallback:

```javascript
// In EditTripModal.jsx
const [manualMode, setManualMode] = useState(false);

// Add this in the form
{manualMode && (
  <div>
    <label>Manual Distance (km)</label>
    <input
      type="number"
      value={calculatedData.distance}
      onChange={(e) => setCalculatedData(prev => ({
        ...prev,
        distance: parseFloat(e.target.value)
      }))}
    />
  </div>
)}

<button onClick={() => setManualMode(!manualMode)}>
  {manualMode ? 'Auto Calculate' : 'Enter Manually'}
</button>
```

### Option 2: Skip Recalculation for Now

Modify the recalculation logic to be optional:

```javascript
// In EditTripModal.jsx, modify the useEffect
useEffect(() => {
  const recalculate = async () => {
    // Skip if Google Maps not available
    if (!window.google || !window.google.maps) {
      console.warn('Skipping recalculation - Google Maps not available');
      return;
    }
    
    // ... rest of recalculation logic
  };

  if (hasChanges) {
    recalculate();
  }
}, [formData.source, formData.destination, formData.mode, formData.vehicleId, hasChanges, trip]);
```

## 📊 Google Cloud Console URLs

Quick links for your project:

1. **API Library:**
   https://console.cloud.google.com/apis/library?project=stua-da096

2. **Distance Matrix API:**
   https://console.cloud.google.com/apis/library/distance-matrix-backend.googleapis.com?project=stua-da096

3. **Maps JavaScript API:**
   https://console.cloud.google.com/apis/library/maps-backend.googleapis.com?project=stua-da096

4. **Credentials:**
   https://console.cloud.google.com/apis/credentials?project=stua-da096

5. **Billing:**
   https://console.cloud.google.com/billing?project=stua-da096

## 🧪 Testing After Fix

1. **Restart Dev Server:**
   ```bash
   # Stop current server (Ctrl+C)
   npm run dev
   ```

2. **Clear Browser Cache:**
   - Open DevTools (F12)
   - Right-click refresh button
   - Select "Empty Cache and Hard Reload"

3. **Test Trip Edit:**
   - Go to Dashboard
   - Click "Edit" on a trip
   - Change source or destination
   - Should see "Recalculating..." indicator
   - Should show new distance and emission values

4. **Check Console:**
   - No errors should appear
   - Should see successful API calls

## ⚠️ Common Mistakes

1. **Forgetting to enable Distance Matrix API**
   - Maps JavaScript API ≠ Distance Matrix API
   - You need BOTH

2. **Not enabling billing**
   - Even free tier requires billing to be linked
   - You won't be charged unless you exceed free limits

3. **API key restrictions too strict**
   - If restricted to specific domains, add localhost
   - For development, "None" is easiest

4. **Not waiting for changes to propagate**
   - Google Cloud changes can take 2-5 minutes
   - Be patient after enabling APIs

5. **Not restarting dev server**
   - Environment variables are loaded at startup
   - Must restart after changing .env

## 📞 Still Not Working?

If you've tried everything and it still doesn't work:

### Check API Key Status:
```bash
# Test API key directly
curl "https://maps.googleapis.com/maps/api/distancematrix/json?origins=New+York&destinations=Boston&key=AIzaSyDPHdume1DHOOJISI3QOGTWTWk85-v6Fls"
```

**Expected Response:**
```json
{
  "status": "OK",
  "rows": [...]
}
```

**If you get REQUEST_DENIED:**
- API key is invalid or restricted
- Distance Matrix API not enabled
- Billing not enabled

### Create New API Key:

1. Go to: https://console.cloud.google.com/apis/credentials
2. Click "CREATE CREDENTIALS" → "API key"
3. Copy the new key
4. Update `.env`:
   ```
   VITE_GOOGLE_MAPS_API_KEY=YOUR_NEW_KEY_HERE
   ```
5. Restart dev server

## ✅ Success Indicators

You'll know it's working when:
- ✅ No "REQUEST_DENIED" errors in console
- ✅ Trip edit modal shows "Recalculating..." when you change addresses
- ✅ New distance and emission values appear
- ✅ Can successfully save edited trips

---

## 🎯 Recommended Setup for Development

**API Restrictions:**
- Application restrictions: **None**
- API restrictions: **Distance Matrix API, Maps JavaScript API**

**Billing:**
- **Enabled** (don't worry, you have $200/month free)

**APIs Enabled:**
- ✅ Distance Matrix API
- ✅ Maps JavaScript API
- ✅ Places API (optional)
- ✅ Geocoding API (optional)

---

**Last Updated:** 2026-02-10  
**Issue:** Google Maps REQUEST_DENIED  
**Status:** Awaiting user to enable APIs in Google Cloud Console

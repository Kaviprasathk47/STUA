# Motorbike Engine Size Fix

## 🐛 Problem

When adding a motorbike (Bike/Scooter) vehicle:
- Engine size field was being set to "Average" (correct)
- But after saving and viewing, it displayed as "N/A" (incorrect)
- When editing, the engine size couldn't be changed

## 🔍 Root Cause

The issue was in the `VehicleManagement.jsx` component:

1. **In `handleEdit()` function (line 60):**
   ```javascript
   vehicle_engine_size: vehicle.vehicle_engine_size || "N/A"
   ```
   - When editing a vehicle, if `vehicle_engine_size` was empty/null, it defaulted to "N/A"
   - This was incorrect for motorbikes which should use "Average"

2. **In `handleInputChange()` function:**
   - Only handled Cycle type (setting to "N/A")
   - Didn't handle Bike/Scooter types (should set to "Average")

3. **In `getEngineSizes()` function (line 120-122):**
   ```javascript
   if (formData.vehicle_type === "Bike" || formData.vehicle_type === "Scooter") {
       return ["Average"];
   }
   ```
   - This was correct, but the other functions weren't using it properly

## ✅ Solution

### 1. Fixed `handleEdit()` Function

**Before:**
```javascript
vehicle_engine_size: vehicle.vehicle_engine_size || "N/A"
```

**After:**
```javascript
vehicle_engine_size: vehicle.vehicle_engine_size || "Average"
```

**Reasoning:** Default to "Average" which is valid for most vehicle types (Cars with Electric/Hybrid, Bikes, Scooters)

### 2. Updated `handleInputChange()` Function

**Before:**
```javascript
if (name === "vehicle_type" && (value === "Cycle")) {
    newData.fuel_type = "Human Power";
    newData.vehicle_emission_rating = "0";
    newData.vehicle_engine_size = "N/A";
}
```

**After:**
```javascript
if (name === "vehicle_type" && (value === "Cycle")) {
    newData.fuel_type = "Human Power";
    newData.vehicle_emission_rating = "0";
    newData.vehicle_engine_size = "N/A";
}

// Auto-set engine size for Bike/Scooter
if (name === "vehicle_type" && (value === "Bike" || value === "Scooter")) {
    newData.vehicle_engine_size = "Average";
}
```

**Reasoning:** When user selects Bike or Scooter, automatically set engine size to "Average"

## 📊 Engine Size Logic by Vehicle Type

| Vehicle Type | Fuel Type | Available Engine Sizes | Auto-Selected |
|--------------|-----------|------------------------|---------------|
| Car | Petrol/Diesel | Small, Medium, Large | Small |
| Car | Electric/Hybrid | Average | Average |
| Bike | Any | Average | Average ✅ |
| Scooter | Any | Average | Average ✅ |
| Cycle | Human Power | N/A | N/A |

## 🧪 Testing

### Test Case 1: Add New Motorbike
1. Click "Add Vehicle"
2. Select Type: "Motorbike"
3. Fill in other details
4. **Verify:** Engine Size shows "Average" (not editable)
5. Save vehicle
6. **Verify:** Vehicle card shows "Size: Average" (not "N/A")

### Test Case 2: Edit Existing Motorbike
1. Click "Edit" on a motorbike
2. **Verify:** Engine Size field shows "Average"
3. **Verify:** Field is disabled (grayed out)
4. Modify other fields
5. Save changes
6. **Verify:** Engine Size still shows "Average"

### Test Case 3: Change Vehicle Type
1. Add new vehicle as "Car"
2. Select Petrol fuel
3. **Verify:** Engine Size shows Small/Medium/Large options
4. Change Type to "Motorbike"
5. **Verify:** Engine Size automatically changes to "Average"
6. **Verify:** Field becomes disabled

## 📁 Files Modified

- ✅ `frontend/src/components/VehicleManagement.jsx`
  - Line 60: Fixed `handleEdit()` default value
  - Lines 106-108: Added auto-set logic for Bike/Scooter

## ✅ Expected Behavior After Fix

### Adding a Motorbike:
```
1. User selects "Motorbike" type
   ↓
2. Engine Size automatically set to "Average"
   ↓
3. Engine Size field is disabled (grayed out)
   ↓
4. User fills other fields and saves
   ↓
5. Vehicle card displays "Size: Average" ✅
```

### Editing a Motorbike:
```
1. User clicks "Edit" on motorbike
   ↓
2. Form opens with Engine Size = "Average"
   ↓
3. Engine Size field is disabled
   ↓
4. User modifies other fields and saves
   ↓
5. Engine Size remains "Average" ✅
```

## 🎯 Why "Average" for Motorbikes?

According to the emission calculation dataset:
- Motorbikes don't have Small/Medium/Large engine categories
- They use a single "Average" category
- This matches the emission factors in the backend dataset

## 🔄 Related Components

This fix ensures consistency with:
- **Backend Emission Service** (`backend/services/emissionService.js`)
  - Uses `vehicle.vehicle_engine_size` for calculations
  - Expects "Average" for motorbikes
- **Emission Dataset**
  - Has "Average" category for motorbikes
  - Doesn't have Small/Medium/Large for bikes

## ✅ Status

**Status:** ✅ **FIXED**

The motorbike engine size issue has been resolved. Users can now:
- Add motorbikes with correct "Average" engine size
- Edit motorbikes without losing engine size data
- See "Average" displayed correctly (not "N/A")

---

**Last Updated:** 2026-02-10  
**Version:** 1.0.1  
**Issue:** Motorbike engine size showing N/A  
**Resolution:** Fixed default values and auto-selection logic

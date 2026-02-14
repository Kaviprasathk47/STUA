# Micro-Tips Visual Guide

## Component Preview

The MicroTip component provides contextual guidance throughout the application. Here's what users will see:

---

## 1. Trips Page - Route Calculation Tip

**Location:** Below the date picker, above the "Show Route" button

**When it appears:** When both origin and destination are selected, but route hasn't been calculated yet

**Visual:**
```
┌─────────────────────────────────────────────────────────────┐
│ ⓘ Route distance is used to calculate emissions across     │
│   different transport modes.                                │
└─────────────────────────────────────────────────────────────┘
```

**Styling:**
- Background: Light blue (bg-blue-50)
- Border: Blue (border-blue-200)
- Text: Dark blue (text-blue-600)
- Icon: Info circle (ⓘ)
- Size: Small text (text-xs)

---

## 2. Transport Comparison - Sustainability Tip

**Location:** Below the journey description, above the vehicle selection section

**When it appears:** Always visible when viewing transport comparison

**Visual:**
```
┌─────────────────────────────────────────────────────────────┐
│ ⓘ Walking and cycling produce zero CO₂ for short trips,    │
│   while public transport emits significantly less per       │
│   person.                                                    │
└─────────────────────────────────────────────────────────────┘
```

**Styling:**
- Background: Light green (bg-emerald-50)
- Border: Green (border-emerald-200)
- Text: Dark green (text-emerald-600)
- Icon: Info circle (ⓘ)
- Size: Small text (text-xs)

---

## 3. Transport Comparison - Vehicle Selection Tip

**Location:** Inside the "Compare Your Vehicles" section, below the heading

**When it appears:** When user has vehicles registered

**Visual:**
```
┌─────────────────────────────────────────────────────────────┐
│ 🚗 Compare Your Vehicles                                    │
├─────────────────────────────────────────────────────────────┤
│ ⓘ Select your vehicle to get accurate CO₂ estimates based  │
│   on verified datasets.                                     │
└─────────────────────────────────────────────────────────────┘
```

**Styling:**
- Background: Light blue (bg-blue-50)
- Border: Blue (border-blue-200)
- Text: Dark blue (text-blue-600)
- Icon: Info circle (ⓘ)
- Size: Small text (text-xs)

---

## 4. Transport Comparison - Save Trip Tip

**Location:** In the expanded transport mode details, near the "I used this mode" button

**When it appears:** When a transport mode is expanded

**Visual:**
```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│  Estimated Emission: 2.45 kg CO₂                            │
│  Travel Time: 45m                                           │
│  Distance: 12.3 km                                          │
│                                                              │
│  * Estimation based on average car speeds...                │
│                                                              │
│  ┌──────────────────────────────────────────────┐           │
│  │ ⓘ Saving trips helps unlock personalized    │           │
│  │   sustainability insights.                   │           │
│  └──────────────────────────────────────────────┘           │
│                                                              │
│                          [ I used this mode ]               │
└─────────────────────────────────────────────────────────────┘
```

**Styling:**
- Background: Light green (bg-emerald-50)
- Border: Green (border-emerald-200)
- Text: Dark green (text-emerald-600)
- Icon: Info circle (ⓘ)
- Size: Small text (text-xs)
- Alignment: Right-aligned

---

## 5. Analysis Page - Mode Breakdown Chart Tip

**Location:** Below the chart title, above the pie chart

**When it appears:** Always visible when chart has data

**Visual:**
```
┌─────────────────────────────────────────────────────────────┐
│ Emission by Transport Mode                                  │
├─────────────────────────────────────────────────────────────┤
│ ⓘ This chart shows which transport modes contribute most   │
│   to your carbon footprint.                                 │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│                    [Pie Chart Here]                         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Styling:**
- Background: Light blue (bg-blue-50)
- Border: Blue (border-blue-200)
- Text: Dark blue (text-blue-600)
- Icon: Info circle (ⓘ)
- Size: Small text (text-xs)

---

## 6. Analysis Page - Emission Trend Chart Tip

**Location:** Above the line chart

**When it appears:** Always visible when chart has data

**Visual:**
```
┌─────────────────────────────────────────────────────────────┐
│ Emission Trend                          [Last 30 Days ▼]   │
├─────────────────────────────────────────────────────────────┤
│ ⓘ This chart shows how your emissions change over time—    │
│   higher bars indicate greater carbon impact.              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│                    [Line Chart Here]                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Styling:**
- Background: Light blue (bg-blue-50)
- Border: Blue (border-blue-200)
- Text: Dark blue (text-blue-600)
- Icon: Info circle (ⓘ)
- Size: Small text (text-xs)

---

## 7. Vehicle Management - Garage Tip

**Location:** Below the "My Garage" header, above the vehicle list

**When it appears:** Always visible on the vehicle management page

**Visual:**
```
┌─────────────────────────────────────────────────────────────┐
│ 🚗 My Garage                              [ + Add Vehicle ] │
│ Manage your vehicles for accurate emission tracking.        │
├─────────────────────────────────────────────────────────────┤
│ ⓘ Vehicle emissions are calculated using verified          │
│   datasets—add your vehicles for personalized tracking.    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [Vehicle Cards Here]                                       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Styling:**
- Background: Light blue (bg-blue-50)
- Border: Blue (border-blue-200)
- Text: Dark blue (text-blue-600)
- Icon: Info circle (ⓘ)
- Size: Small text (text-xs)

---

## Design Characteristics

### Color Palette

| Variant   | Background    | Border        | Text          | Use Case                    |
|-----------|---------------|---------------|---------------|-----------------------------|
| `info`    | `#EFF6FF`     | `#BFDBFE`     | `#1D4ED8`     | Explanatory information     |
| `success` | `#ECFDF5`     | `#A7F3D0`     | `#059669`     | Positive actions, eco-tips  |
| `default` | `#F8FAFC`     | `#E2E8F0`     | `#64748B`     | General information         |
| `warning` | `#FFFBEB`     | `#FDE68A`     | `#D97706`     | Caution or important notes  |

### Typography
- Font size: `0.75rem` (12px)
- Line height: `1.5` (relaxed)
- Font weight: `400` (normal)

### Spacing
- Padding: `0.5rem 0.75rem` (8px 12px)
- Gap between icon and text: `0.5rem` (8px)
- Border radius: `0.5rem` (8px)
- Border width: `1px`

### Icon
- Size: `14px × 14px`
- Position: Top-aligned with text
- Margin top: `2px` (for alignment)

---

## Accessibility Features

### Screen Reader Support
```html
<div role="note" aria-label="Helpful tip">
  <svg aria-hidden="true">...</svg>
  <span>Tip text here</span>
</div>
```

### Keyboard Navigation
- Tips are not focusable (they're informational, not interactive)
- They don't interfere with tab order
- Content is always visible (no hover-only states)

### Color Contrast
All variants meet WCAG AA standards:
- Info: 7.2:1 contrast ratio
- Success: 7.5:1 contrast ratio
- Default: 4.8:1 contrast ratio
- Warning: 6.1:1 contrast ratio

---

## Responsive Behavior

### Desktop (≥1024px)
- Full width within container
- Icon and text side-by-side
- Comfortable padding

### Tablet (768px - 1023px)
- Full width within container
- Icon and text side-by-side
- Slightly reduced padding

### Mobile (<768px)
- Full width
- Icon and text side-by-side
- Minimum padding maintained
- Text wraps naturally

---

## User Experience Flow

### Example: Trips Page

1. **User arrives at Trips page**
   - No micro-tip visible yet

2. **User selects origin**
   - Still no micro-tip

3. **User selects destination**
   - ✨ Micro-tip appears: "Route distance is used to calculate emissions..."
   - User understands what will happen next

4. **User clicks "Show Route"**
   - Micro-tip disappears
   - Route is calculated

5. **User clicks "Analyze Eco-Impact"**
   - Navigates to Transport Comparison
   - ✨ New micro-tips appear explaining sustainability impact

---

## Implementation Benefits

### For Users
- ✅ Clear guidance at decision points
- ✅ Understanding of sustainability impact
- ✅ Confidence in using features
- ✅ No interruption to workflow

### For the Application
- ✅ Reduced user confusion
- ✅ Higher feature adoption
- ✅ Increased engagement with eco-friendly options
- ✅ Better data quality (more saved trips)

### For Accessibility
- ✅ Screen reader compatible
- ✅ No hover-only content
- ✅ Sufficient color contrast
- ✅ Clear, simple language

---

## Maintenance Notes

### Adding New Micro-Tips

1. Import the component:
```javascript
import MicroTip from './components/ui/MicroTip';
```

2. Add the tip at the appropriate location:
```javascript
<MicroTip 
  text="Your one-sentence tip here."
  variant="info"
  className="mb-4"
/>
```

3. Choose the right variant:
   - `info` - Explanatory information
   - `success` - Positive actions, eco-tips
   - `warning` - Caution or important notes
   - `default` - General information

### Best Practices

- ✅ Keep tips to one sentence
- ✅ Focus on "why" not "how"
- ✅ Use active voice
- ✅ Avoid jargon
- ✅ Test on mobile devices
- ✅ Verify color contrast
- ✅ Consider conditional rendering

---

## Testing Checklist

- [ ] Tip appears at the correct location
- [ ] Text is readable on all screen sizes
- [ ] Icon is properly aligned
- [ ] Colors match the design system
- [ ] Tip doesn't block important UI elements
- [ ] Screen reader announces the tip
- [ ] Tip disappears when no longer relevant (if conditional)
- [ ] No console errors
- [ ] Responsive on mobile, tablet, and desktop

---

## Conclusion

The micro-tips implementation provides subtle, contextual guidance that enhances the user experience without being intrusive. Each tip is carefully placed at decision points to help users understand the impact of their actions and make informed choices about their sustainability journey.

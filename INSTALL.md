# How to Install the Extension in Chrome

## Step-by-Step Installation Guide

### Step 1: Open Chrome Extensions Page

1. Open Google Chrome browser
2. Go to the Extensions page using one of these methods:
   - Type `chrome://extensions/` in the address bar and press Enter
   - OR click the three dots (⋮) in top right → **More tools** → **Extensions**
   - OR right-click the extension icon area → **Manage extensions**

### Step 2: Enable Developer Mode

1. On the Extensions page, look for **"Developer mode"** toggle in the **top right corner**
2. **Toggle it ON** (it should turn blue/active)
3. You'll see new buttons appear: **"Load unpacked"**, **"Pack extension"**, etc.

### Step 3: Load the Extension

1. Click the **"Load unpacked"** button
2. A file picker dialog will open
3. Navigate to and **select** the extension folder:
   ```
   /Users/shivkumarkothale/Extension
   ```
4. Click **"Select"** or **"Open"**

### Step 4: Verify Installation

1. The extension should now appear in your extensions list
2. You should see:
   - Extension name: "Job Link to Google Sheets"
   - Version: 1.0.0
   - An extension icon (may be default if icons aren't created yet)
3. Make sure the extension is **enabled** (toggle should be ON)

### Step 5: Pin the Extension (Optional but Recommended)

1. Look for the extension icon in Chrome's toolbar (top right, near the address bar)
2. If you don't see it, click the **puzzle piece icon** (extensions menu)
3. Find "Job Link to Google Sheets" in the list
4. Click the **pin icon** 📌 next to it to pin it to the toolbar
5. Now you can easily click the extension icon anytime!

## Troubleshooting

### Issue: "Load unpacked" button is grayed out

**Solution:**
- Make sure Developer mode is enabled (toggle in top right)

### Issue: "Extension load failed" or "Manifest file is missing"

**Solution:**
- Make sure you selected the **folder** `/Users/shivkumarkothale/Extension`, not a file inside it
- Verify `manifest.json` exists in the folder
- Check that all files are in the correct location

### Issue: Extension doesn't appear after loading

**Solution:**
- Check if there are any error messages in red
- Click "Errors" or "Details" to see what went wrong
- Common issues:
  - Missing Client ID in manifest.json
  - Invalid JSON in manifest.json
  - Missing required files

### Issue: Extension icon doesn't show in toolbar

**Solution:**
- Click the puzzle piece icon (extensions menu)
- Find your extension and pin it
- Or click the extension icon area and select it

### Issue: "This extension may have been corrupted"

**Solution:**
- Remove the extension (click "Remove")
- Reload it again using "Load unpacked"
- Make sure all files are intact

## Visual Guide

```
Chrome Extensions Page Layout:
┌─────────────────────────────────────────┐
│  Extensions                    [Developer mode: ON]  │
├─────────────────────────────────────────┤
│                                         │
│  Job Link to Google Sheets             │
│  Version: 1.0.0        [Enabled] [Remove] │
│                                         │
│  [Load unpacked] [Pack extension]      │
│                                         │
└─────────────────────────────────────────┘
```

## Next Steps After Installation

1. **Configure OAuth** (if not done):
   - Update `manifest.json` with your Google Client ID
   - See SETUP.md for details

2. **Set up the extension**:
   - Right-click extension icon → **Options**
   - Click **"Authenticate"**
   - Enter your Google Sheet ID and Sheet Name

3. **Test it**:
   - Go to any webpage
   - Click the extension icon
   - It should save the URL automatically!

## Updating the Extension

If you make changes to the extension code:

1. Go to `chrome://extensions/`
2. Find "Job Link to Google Sheets"
3. Click the **refresh/reload icon** 🔄 (circular arrow icon)
4. The extension will reload with your changes

**Note:** You don't need to remove and re-add the extension for updates, just reload it!


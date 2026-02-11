# Job Link Saver

Save job links to a shared Google Sheet with one click. No Google sign-in needed.

**Sheet columns:** Company name | Date | Author | URL

---

## Quick Setup

### One person sets up the sheet

1. Create a Google Sheet. Row 1: **Company name | Date | Author | URL**
2. **Extensions → Apps Script** → paste all of **`APPS_SCRIPT_CODE.js`**
3. (Optional) Set `const SECRET = 'your-password';` in the script
4. **Deploy → New deployment → Web app** → Execute as: **Me**, Who has access: **Anyone** → Deploy
5. Copy the **Web App URL** (ends with `/exec`) and share it with friends (+ secret if you set one)

### Everyone installs the extension

1. Chrome → `chrome://extensions/` → **Developer mode** → **Load unpacked** → select this folder
2. Click extension icon → **Advanced settings** → enter:
   - **Web App URL** (required)
   - **Your name** (required)
   - Sheet tab name (default: `Sheet1`)
   - Secret (only if the sheet owner gave you one)
3. Click **Save settings**

### Use it

- On a job page: click extension → type Company (optional) → **Save to Google Sheet**
- Or right‑click page/link → **Save this link to Google Sheet**

---

**Note:** Web App URL and Your name are required. Set them in Advanced settings before saving links.

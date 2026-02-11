// Background – saves job links via Google Apps Script Web App (no OAuth)
// Sheet columns: Company name | Date (sortable, displays as 01 Feb) | Author | URL

function getDateISO() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD for sortable dates
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'saveJobLink',
    title: 'Save this link to Google Sheet',
    contexts: ['link', 'page']
  });
});

async function saveUrlToSheet(urlToSave, company = '') {
  const settings = await chrome.storage.sync.get(['webAppUrl', 'sheetName', 'authorName', 'secret']);
  const webAppUrl = (settings.webAppUrl || '').trim();
  if (!webAppUrl) {
    showNotification('Setup needed', 'Click the extension → enter Web App URL and your name → Save settings.');
    chrome.runtime.openOptionsPage();
    return;
  }

  const sheetName = (settings.sheetName || 'Sheet1').trim();
  const author = (settings.authorName || '').trim();
  const secret = (settings.secret || '').trim();

  const body = {
    url: urlToSave,
    date: getDateISO(),
    sheetName,
    author,
    company: company || ''
  };
  if (secret) body.secret = secret;

  try {
    const response = await fetch(webAppUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const contentType = response.headers.get('content-type') || '';
    let data = null;
    if (contentType.includes('application/json')) {
      try {
        data = await response.json();
      } catch (_) {}
    }

    if (!response.ok) {
      const errMsg = (data && data.error) ? data.error : `HTTP ${response.status}`;
      showNotification('Save failed', errMsg);
      return;
    }
    if (data && data.success === false && data.error) {
      showNotification('Save failed', data.error);
      return;
    }

    showNotification('Saved', 'Job link saved to sheet.');
  } catch (error) {
    showNotification('Save failed', error.message || 'Check Web App URL and connection.');
  }
}

function showNotification(title, message) {
  const notificationTitle = String(title || 'Job Link Saver').trim();
  const notificationMessage = String(message || '').trim();
  const iconDataUri = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==';
  if (!notificationTitle || !notificationMessage) return;
  try {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: iconDataUri,
      title: notificationTitle,
      message: notificationMessage
    }, () => {
      if (chrome.runtime.lastError) {
        console.log(`[${notificationTitle}]: ${notificationMessage}`);
      }
    });
  } catch (e) {
    console.log(`[${notificationTitle}]: ${notificationMessage}`);
  }
}

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== 'saveJobLink') return;
  const urlToSave = info.linkUrl || info.pageUrl || '';
  if (urlToSave) {
    await saveUrlToSheet(urlToSave);
  }
});

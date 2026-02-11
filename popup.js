// Popup – saves job links via Google Apps Script Web App (no OAuth)
// Sheet columns: Company name | Date (sortable, displays as 01 Feb) | Author | URL

function getDateISO() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD for sortable dates
}

document.addEventListener('DOMContentLoaded', async () => {
  const saveBtn = document.getElementById('saveBtn');
  const saveSettingsBtn = document.getElementById('saveSettingsBtn');
  const advancedToggle = document.getElementById('advancedToggle');
  const advancedContent = document.getElementById('advancedContent');
  const advancedToggleIcon = document.getElementById('advancedToggleIcon');
  const statusDiv = document.getElementById('status');
  const currentUrlDiv = document.getElementById('currentUrl');
  const webAppUrlInput = document.getElementById('webAppUrl');
  const sheetNameInput = document.getElementById('sheetName');
  const authorNameInput = document.getElementById('authorName');
  const secretInput = document.getElementById('secret');
  const companyOptionalInput = document.getElementById('companyOptional');

  let currentUrl = '';
  let advancedOpen = false;

  // Load saved settings
  const settings = await chrome.storage.sync.get(['webAppUrl', 'sheetName', 'authorName', 'secret']);
  if (settings.webAppUrl) webAppUrlInput.value = settings.webAppUrl.trim();
  if (settings.sheetName) sheetNameInput.value = settings.sheetName.trim();
  if (settings.authorName) authorNameInput.value = settings.authorName.trim();
  if (settings.secret) secretInput.value = settings.secret;
  if (!sheetNameInput.value) sheetNameInput.value = 'Sheet1';

  // Capture current tab URL
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.url) {
      if (!tab.url.startsWith('chrome://') &&
          !tab.url.startsWith('chrome-extension://') &&
          !tab.url.startsWith('edge://')) {
        currentUrl = tab.url.trim();
        const displayUrl = currentUrl.length > 60 ? currentUrl.substring(0, 60) + '...' : currentUrl;
        currentUrlDiv.textContent = displayUrl;
        currentUrlDiv.title = currentUrl;
      } else {
        currentUrlDiv.textContent = 'Cannot save Chrome internal pages';
        currentUrlDiv.style.color = '#999';
      }
    }
  } catch (e) {
    currentUrlDiv.textContent = 'Unable to get current page URL';
    currentUrlDiv.style.color = '#999';
  }

  function showStatus(message, type) {
    if (!statusDiv) return;
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
    statusDiv.style.display = 'block';
    if (statusDiv.timeoutId) clearTimeout(statusDiv.timeoutId);
    statusDiv.timeoutId = setTimeout(() => {
      statusDiv.style.display = 'none';
    }, 5000);
  }

  // Toggle advanced settings
  advancedToggle.addEventListener('click', () => {
    advancedOpen = !advancedOpen;
    if (advancedOpen) {
      advancedContent.style.display = 'block';
      advancedToggleIcon.textContent = '▲';
    } else {
      advancedContent.style.display = 'none';
      advancedToggleIcon.textContent = '▼';
    }
  });

  // Save settings
  saveSettingsBtn.addEventListener('click', async () => {
    const webAppUrl = webAppUrlInput.value.trim();
    const authorName = authorNameInput.value.trim();
    
    if (!webAppUrl) {
      showStatus('Web App URL is required.', 'error');
      webAppUrlInput.focus();
      return;
    }
    if (!authorName) {
      showStatus('Your name (Author) is required.', 'error');
      authorNameInput.focus();
      return;
    }

    const sheetName = (sheetNameInput.value || 'Sheet1').trim();
    await chrome.storage.sync.set({
      webAppUrl,
      sheetName,
      authorName,
      secret: secretInput.value.trim()
    });
    showStatus('Settings saved!', 'success');
    
    // Auto-close advanced after saving
    setTimeout(() => {
      advancedOpen = false;
      advancedContent.style.display = 'none';
      advancedToggleIcon.textContent = '▼';
    }, 1000);
  });

  // Save job link
  saveBtn.addEventListener('click', async () => {
    // Get settings from storage (they might be in advanced section)
    const storedSettings = await chrome.storage.sync.get(['webAppUrl', 'sheetName', 'authorName', 'secret']);
    const webAppUrl = storedSettings.webAppUrl?.trim() || webAppUrlInput.value?.trim();
    const author = storedSettings.authorName?.trim() || authorNameInput.value?.trim();
    
    if (!webAppUrl) {
      showStatus('Web App URL is required. Open Advanced Settings to configure.', 'error');
      advancedOpen = true;
      advancedContent.style.display = 'block';
      advancedToggleIcon.textContent = '▲';
      webAppUrlInput.focus();
      return;
    }
    if (!author) {
      showStatus('Your name (Author) is required. Open Advanced Settings to configure.', 'error');
      advancedOpen = true;
      advancedContent.style.display = 'block';
      advancedToggleIcon.textContent = '▲';
      authorNameInput.focus();
      return;
    }
    if (!currentUrl) {
      showStatus('Open a job page first.', 'error');
      return;
    }

    const sheetName = storedSettings.sheetName || sheetNameInput.value || 'Sheet1';
    const secret = storedSettings.secret || secretInput.value || '';
    const company = companyOptionalInput.value?.trim() || '';

    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving...';
    showStatus('Saving...', 'info');

    try {
      const body = {
        url: currentUrl,
        date: getDateISO(),
        sheetName: sheetName.trim(),
        author: author.trim(),
        company
      };
      if (secret) body.secret = secret;

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
        throw new Error(errMsg);
      }
      if (data && data.success === false && data.error) {
        throw new Error(data.error);
      }

      showStatus('Saved to Google Sheet!', 'success');
      companyOptionalInput.value = '';
    } catch (error) {
      showStatus(error.message || 'Failed to save.', 'error');
    } finally {
      saveBtn.disabled = false;
      saveBtn.textContent = 'Save to Google Sheet';
    }
  });
});

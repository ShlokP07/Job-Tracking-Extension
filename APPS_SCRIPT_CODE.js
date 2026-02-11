/**
 * Job Link Saver – Google Apps Script (no OAuth)
 * Sheet columns: A = Company name, B = Date (sortable, shows as 01 Feb), C = Author, D = URL
 *
 * SETUP: Paste this entire file into your sheet's Apps Script (Extensions → Apps Script).
 * Then Deploy as Web app (Execute as: Me, Who has access: Anyone) and copy the Web App URL.
 */

const SECRET = ''; // Optional: set e.g. 'your-password' and share with friends. Do not commit a real secret.

function doPost(e) {
  const result = { success: false, error: '' };
  try {
    if (!e || !e.postData || !e.postData.contents) {
      result.error = 'No data received';
      return jsonResponse(result);
    }
    const body = JSON.parse(e.postData.contents);
    if (SECRET && body.secret !== SECRET) {
      result.error = 'Invalid secret';
      return jsonResponse(result);
    }

    const url = (body.url || '').toString().trim();
    const sheetName = (body.sheetName || 'Sheet1').toString().trim();
    const dateInput = (body.date || '').toString().trim();
    const author = (body.author || '').toString().trim();
    const company = (body.company || '').toString().trim();
    if (!url) {
      result.error = 'Missing url';
      return jsonResponse(result);
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(sheetName);
    if (!sheet) sheet = ss.getSheets()[0];

    const lastRow = Math.max(sheet.getLastRow(), 1);
    const rows = sheet.getRange(2, 1, Math.min(lastRow + 100, 1000), 4).getValues();
    let targetRow = 2;
    for (let i = 0; i < rows.length; i++) {
      const colD = rows[i][3] ? String(rows[i][3]).trim() : '';
      if (colD === '') {
        targetRow = i + 2;
        break;
      }
    }
    if (targetRow === 2 && rows.length > 0) {
      let found = false;
      for (let i = 0; i < rows.length; i++) {
        if ((rows[i][3] ? String(rows[i][3]).trim() : '') === '') {
          found = true;
          targetRow = i + 2;
          break;
        }
      }
      if (!found) targetRow = rows.length + 2;
    }

    sheet.getRange('A' + targetRow).setValue(company);
    if (dateInput) {
      const dateCell = sheet.getRange('B' + targetRow);
      dateCell.setValue(new Date(dateInput));
      dateCell.setNumberFormat('dd mmm');
    }
    if (author) sheet.getRange('C' + targetRow).setValue(author);
    // Put the URL as a clickable hyperlink with text "LINK"
    const safeUrl = url.replace(/"/g, '""');
    sheet.getRange('D' + targetRow).setFormula('=HYPERLINK("' + safeUrl + '","LINK")');

    // Center align the row
    sheet.getRange('A' + targetRow + ':D' + targetRow).setHorizontalAlignment('center');

    // Format header row (row 1) if it exists and isn't formatted yet
    if (sheet.getLastRow() >= 1) {
      const headerRange = sheet.getRange('A1:D1');
      const headerValues = headerRange.getValues()[0];
      // Only format if headers exist (not empty)
      if (headerValues.some(cell => cell && String(cell).trim() !== '')) {
        headerRange.setHorizontalAlignment('center');
        headerRange.setFontWeight('bold');
      }
    }

    result.success = true;
    return jsonResponse(result);
  } catch (err) {
    result.error = err.toString();
    return jsonResponse(result);
  }
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

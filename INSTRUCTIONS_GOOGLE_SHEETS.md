# How to Connect Your Form to Google Sheets

Follow these steps to create a free, permanent database for your leads.

## Step 1: Create the Spreadsheet
1.  Go to [Google Sheets](https://sheets.new) and create a new sheet.
2.  **Rename the tabs** at the bottom:
    *   Rename "Sheet1" to **"Purchase"**.
    *   Click the **+** to add a second tab and name it **"Refinance"**.

3.  **Purchase Tab Headers**: Copy and paste into Row 1 of the **"Purchase"** tab (inserted "Status"):
    ```
    Date, Status, Name, Email, Phone, Mortgage Type, Property Type, Decision Process, Residency Usage, State, Zip, Property Value, Down Payment, Income, Credit Score, Military, Message
    ```

4.  **Refinance Tab Headers**: Copy and paste into Row 1 of the **"Refinance"** tab (inserted "Status"):
    ```
    Date, Status, Name, Email, Phone, Mortgage Type, Property Type, Residency Usage, State, Zip, Property Value, Loan Balance, Cash Out, Income, Credit Score, Military, Message
    ```

## Step 2: Add the Script
1.  In the Google Sheet, click **Extensions** > **Apps Script**.
2.  Delete any code in the editor (`myFunction`).
3.  **Copy and Paste** the code below:

```javascript
/* 
  Google Apps Script to generally handle form submissions.
  Routes data to "Purchase" or "Refinance" sheet based on selection.
  Adds default "Status" and formatting.
*/

const scriptProp = PropertiesService.getScriptProperties()

function setup() {
  const doc = SpreadsheetApp.getActiveSpreadsheet()
  scriptProp.setProperty('key', doc.getId())
}

function doPost(e) {
  const lock = LockService.getScriptLock()
  lock.tryLock(10000)

  try {
    const doc = SpreadsheetApp.openById(scriptProp.getProperty('key'))
    
    // Determine which sheet to use based on the form selection
    let sheetName = 'Purchase' // default
    if (e.parameter.mortgage_type && e.parameter.mortgage_type.toLowerCase() === 'refinance') {
      sheetName = 'Refinance'
    }
    
    const sheet = doc.getSheetByName(sheetName)
    if (!sheet) throw new Error("Sheet not found: " + sheetName)

    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
    const nextRow = sheet.getLastRow() + 1

    const newRow = headers.map(function(header) {
      if (header === 'Date') return new Date()
      // Default value for Status column
      if (header === 'Status') return 'New Lead'
      
      // Helper to map clear header names to form field names
      if (header === 'Mortgage Type') return e.parameter['mortgage_type']
      if (header === 'Property Type') return e.parameter['purchase_property_type'] || e.parameter['refinance_property_type']
      if (header === 'Decision Process') return e.parameter['purchase_process']
      if (header === 'Residency Usage') return e.parameter['purchase_residency_usage'] || e.parameter['refinance_residency_usage']
      if (header === 'State') return e.parameter['purchase_state'] || e.parameter['refinance_state']
      if (header === 'Zip') return e.parameter['purchase_zip'] || e.parameter['refinance_zip']
      if (header === 'Property Value') return e.parameter['purchase_property_value'] || e.parameter['refinance_property_value']
      if (header === 'Down Payment') return e.parameter['purchase_down_payment']
      if (header === 'Loan Balance') return e.parameter['refinance_loan_balance']
      if (header === 'Cash Out') return e.parameter['refinance_cash_out']
      if (header === 'Income') return e.parameter['purchase_income'] || e.parameter['refinance_income']
      if (header === 'Credit Score') return e.parameter['purchase_credit_score'] || e.parameter['refinance_credit_score']
      if (header === 'Military') return e.parameter['purchase_military'] || e.parameter['refinance_military']
      
      // Fallback for simple fields like Name, Email, Phone, Message
      return e.parameter[header] || e.parameter[header.toLowerCase()] || ''
    })

    sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow])
    
    // Color the "Status" cell if it exists
    const statusIndex = headers.indexOf('Status')
    if (statusIndex > -1) {
      // +1 because indices are 0-based but getRange is 1-based
      sheet.getRange(nextRow, statusIndex + 1).setBackground('#8dc178')
    }

    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success', 'row': nextRow }))
      .setMimeType(ContentService.MimeType.JSON)
  }

  catch (e) {
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': e.toString() }))
      .setMimeType(ContentService.MimeType.JSON)
  }

  finally {
    lock.releaseLock()
  }
}
```

4.  Click the **Save** icon (disk). Name the project "Form Handler".
5.  **IMPORANT**: Run the `setup` function once:
    -   Select `setup` from the dropdown in the toolbar (next to "Debug").
    -   Click **Run**.
    -   Review Permissions > Choose Account > Advanced > Go to Form Handler (unsafe) > Allow.

## Step 3: Deploy as Web App
1.  Click the big blue **Deploy** button (top right) > **New deployment**.
2.  Click the **Gear icon** (Select type) > **Web app**.
3.  Fill in these details:
    -   **Description**: Contact Form
    -   **Execute as**: Me (your email)
    -   **Who has access**: **Anyone** (This is crucial, otherwise the form won't work).
4.  Click **Deploy**.
5.  **COPY the Web App URL** (starts with `https://script.google.com/...`).

## Step 4: Update Your Code
1.  Paste the URL into the chat window so I can update your form code.
    OR
2.  Open `assets/contact-form.js` and look for the placeholder `const GOOGLE_SCRIPT_URL = "..."`.

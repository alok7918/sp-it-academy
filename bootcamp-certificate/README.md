# Bootcamp Certificate Automation

This directory is designed for the GitHub Pages version of `https://spacademy.ai/bootcamp-certificate/`.

## Architecture

`GitHub Pages form` → `FormSubmit` → `Google Apps Script Web App` → `Google Slides certificate template` → `PDF` → `student email`

The assignment upload continues to be handled by FormSubmit. The certificate service only needs the submitted name, email, and bootcamp.

## 1. Create the certificate template

Create a Google Slides presentation containing the certificate design you want to email. Use a landscape layout.

Keep your existing certificate styling: rectangular certificate, small title `CERTIFICATE OF PARTICIPATION & PROJECT COMPLETION`, cursive student name, academy branding, seal, and the label `Official Seal of Swyam Prabha IT Academy Pvt. Ltd.`.

Put these exact placeholders into text boxes:

- `{{NAME}}` — student name
- `{{BOOTCAMP}}` — Data Analytics Bootcamp / Data Science Bootcamp
- `{{PROJECT_TYPE}}` — Data Analytics Project / Data Science Project
- `{{PROJECT_TITLE}}` — project title from the form
- `{{CERTIFICATE_ID}}` — generated certificate ID
- `{{YEAR}}` — current year
- `{{COLLEGE}}` — college/institute, if supplied

The seal can be uploaded directly into the Slides template. Do not rely on a relative GitHub path inside Google Slides.

Copy the Google Slides presentation ID from its URL:

`https://docs.google.com/presentation/d/THIS_PART_IS_THE_TEMPLATE_ID/edit`

## 2. Configure Code.gs

Open `Code.gs` and replace:

`PASTE_GOOGLE_SLIDES_TEMPLATE_ID_HERE`

with the Slides template ID.

Replace `CHANGE_THIS_TO_A_LONG_RANDOM_KEY` with a long random string.

## 3. Deploy Google Apps Script

1. Go to Google Apps Script.
2. Create a new project.
3. Paste the contents of `Code.gs`.
4. Save.
5. Click **Deploy → New deployment**.
6. Select **Web app**.
7. Execute as: **Me**.
8. Who has access: **Anyone**.
9. Deploy and authorize the requested Google Drive / Slides / Gmail permissions.
10. Copy the `/exec` URL.

Your final webhook URL will look like:

`https://script.google.com/macros/s/DEPLOYMENT_ID/exec?key=YOUR_LONG_RANDOM_KEY`

## 4. Put the webhook URL into index.html

In `index.html`, find:

`<input type="hidden" name="_webhook" value="YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL">`

Replace the value with your deployed Apps Script `/exec` URL including `?key=...`.

## 5. Upload to GitHub Pages

The directory should be:

```text
bootcamp-certificate/
├── index.html
├── Code.gs
├── README.md
├── certificate-template.pptx
└── seal.PNG
```

Only `index.html` and the public web assets need to be published to GitHub Pages. `Code.gs` is included here as the backend source/reference; it does not execute on GitHub Pages.

## 6. Test

Submit a real test using an email address you control.

Expected result:

1. FormSubmit receives the assignment and sends the submission to the academy.
2. FormSubmit calls the Apps Script webhook.
3. Apps Script copies the Google Slides template.
4. Placeholders are replaced with the student's data.
5. A PDF certificate is generated.
6. The PDF is emailed to the student's submitted email address.
7. The temporary Slides copy is moved to Trash.

## Important

The automation issues the certificate immediately after submission. If you later want academy approval before issuing the certificate, the workflow must be changed to an approval step instead of sending immediately.

Google Apps Script and Gmail sending are subject to Google's quotas. For high-volume bootcamps, use a dedicated Workspace account and monitor quota limits.

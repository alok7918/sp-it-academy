/**
 * Swyam Prabha IT Academy — Bootcamp Certificate Automation
 *
 * Flow:
 * GitHub Pages form -> FormSubmit -> this Google Apps Script -> Google Slides template -> PDF -> Gmail
 *
 * IMPORTANT:
 * 1. Create a Google Slides certificate template using the placeholders listed below.
 * 2. Put the template ID into TEMPLATE_ID.
 * 3. Deploy this script as a Web App: Execute as Me / Who has access: Anyone.
 * 4. Put the /exec URL into the _webhook field in index.html.
 */

const CONFIG = {
  TEMPLATE_ID: '1PAi6zsuLX_BCqtbtVbgWYeKW0zolbaeHWIEHZnSxhQ8',
  WEBHOOK_KEY: 'thisistobecertifiedthat',
  ACADEMY_NAME: 'Swyam Prabha IT Academy Pvt. Ltd.',
  ACADEMY_EMAIL: 'trainer@spacademy.ai',
  SITE_URL: 'https://spacademy.ai/bootcamp-certificate/'
};

function doGet(e) {
  return json_({ ok: true, service: 'Swyam Prabha Bootcamp Certificate Automation' });
}

function doPost(e) {
  try {
    if (CONFIG.WEBHOOK_KEY && CONFIG.WEBHOOK_KEY !== 'CHANGE_THIS_TO_A_LONG_RANDOM_KEY') {
      const suppliedKey = e && e.parameter ? (e.parameter.key || '') : '';
      if (suppliedKey !== CONFIG.WEBHOOK_KEY) {
        return json_({ ok: false, error: 'Unauthorized webhook request.' });
      }
    }

    const raw = e && e.postData && e.postData.contents ? e.postData.contents : '';
    let payload = {};
    if (raw) {
      try { payload = JSON.parse(raw); } catch (_) {}
    }

    // FormSubmit webhook payloads put submitted fields under form_data.
    const data = payload.form_data || payload || (e && e.parameter ? e.parameter : {});

    const name = clean_(data.name);
    const email = clean_(data.email);
    const phone = clean_(data.phone);
    const bootcamp = clean_(data.bootcamp);
    const college = clean_(data.college);
    const projectTitle = clean_(data.project_title);

    if (!name || !email || !bootcamp) {
      throw new Error('Missing required fields: name, email, or bootcamp.');
    }
    if (!isEmail_(email)) throw new Error('Invalid email address: ' + email);
    if (CONFIG.TEMPLATE_ID.indexOf('PASTE_') === 0) {
      throw new Error('Configure TEMPLATE_ID before using the webhook.');
    }

    const certificateId = makeCertificateId_(bootcamp);
    const projectType = bootcamp.toLowerCase().indexOf('data analytics') >= 0
      ? 'Data Analytics Project'
      : 'Data Science Project';

    const templateFile = DriveApp.getFileById(CONFIG.TEMPLATE_ID);
    const copyName = 'Certificate - ' + safeFileName_(name) + ' - ' + certificateId;
    const copy = templateFile.makeCopy(copyName);

    const presentation = SlidesApp.openById(copy.getId());
    replaceEverywhere_(presentation, '{{NAME}}', name);
    replaceEverywhere_(presentation, '{{BOOTCAMP}}', bootcamp);
    replaceEverywhere_(presentation, '{{PROJECT_TYPE}}', projectType);
    replaceEverywhere_(presentation, '{{PROJECT_TITLE}}', projectTitle || 'Bootcamp Project');
    replaceEverywhere_(presentation, '{{CERTIFICATE_ID}}', certificateId);
    replaceEverywhere_(presentation, '{{YEAR}}', String(new Date().getFullYear()));
    replaceEverywhere_(presentation, '{{COLLEGE}}', college || '');
    presentation.saveAndClose();

    Utilities.sleep(1500);

    const pdf = copy.getAs(MimeType.PDF)
      .setName('Certificate - ' + safeFileName_(name) + '.pdf');

    const htmlBody =
      '<div style="font-family:Arial,sans-serif;line-height:1.6;color:#172033">' +
      '<p>Dear ' + escapeHtml_(name) + ',</p>' +
      '<p>Congratulations! Your <strong>' + escapeHtml_(bootcamp) + '</strong> certificate has been generated successfully.</p>' +
      '<p>Your personalized certificate is attached to this email.</p>' +
      '<p><strong>Certificate ID:</strong> ' + escapeHtml_(certificateId) + '</p>' +
      '<p>Regards,<br>' + escapeHtml_(CONFIG.ACADEMY_NAME) + '</p>' +
      '</div>';

    MailApp.sendEmail({
      to: email,
      subject: 'Your ' + bootcamp + ' Certificate - ' + certificateId,
      htmlBody: htmlBody,
      body: 'Congratulations! Your ' + bootcamp + ' certificate is attached. Certificate ID: ' + certificateId,
      attachments: [pdf],
      name: CONFIG.ACADEMY_NAME
    });

    // Optional audit log in Apps Script execution logs.
    console.log(JSON.stringify({
      certificateId: certificateId,
      name: name,
      email: email,
      phone: phone,
      bootcamp: bootcamp,
      projectTitle: projectTitle,
      createdAt: new Date().toISOString()
    }));

    // The Slides copy is only a temporary PDF source.
    copy.setTrashed(true);

    return json_({ ok: true, certificate_id: certificateId });
  } catch (err) {
    console.error(err && err.stack ? err.stack : err);
    return json_({ ok: false, error: String(err && err.message ? err.message : err) });
  }
}

function replaceEverywhere_(presentation, token, value) {
  presentation.replaceAllText(token, value == null ? '' : String(value), false);
}

function makeCertificateId_(bootcamp) {
  const prefix = bootcamp.toLowerCase().indexOf('data analytics') >= 0 ? 'SPDA' : 'SPDS';
  const year = new Date().getFullYear();
  const random = Utilities.getUuid().replace(/-/g, '').substring(0, 8).toUpperCase();
  return prefix + '-' + year + '-' + random;
}

function clean_(value) {
  return String(value == null ? '' : value).replace(/\s+/g, ' ').trim();
}

function isEmail_(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function safeFileName_(value) {
  return value.replace(/[\\/:*?"<>|#%{}]/g, '').substring(0, 80) || 'Student';
}

function escapeHtml_(value) {
  return String(value).replace(/[&<>"']/g, function (c) {
    return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]);
  });
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

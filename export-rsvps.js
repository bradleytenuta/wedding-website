'use strict';

const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

const PROJECT_ID = 'bradley-louise-wedding';
const COLLECTION = 'rsvps';

const COLUMNS = [
  'documentId',
  'fullName',
  'attending',
  'starter',
  'main',
  'dessert',
  'dietary',
  'submittedAt'
];

function parseArgs(argv) {
  let outputPath = null;

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--output' || arg === '-o') {
      outputPath = argv[i + 1];
      i++;
      continue;
    }
    if (arg.startsWith('--output=')) {
      outputPath = arg.slice('--output='.length);
      continue;
    }
    if (arg === '--help' || arg === '-h') {
      return { help: true, outputPath: null };
    }
  }

  return { help: false, outputPath };
}

function printHelp() {
  console.log(`Usage: node export-rsvps.js [--output|-o <path>]

Downloads all documents from the Firestore "${COLLECTION}" collection and
writes one RSVP per row to a CSV file.

Options:
  -o, --output <path>   Output CSV path (default: rsvps-export-YYYYMMDD-HHMMSS.csv)

Authentication (set one before running):
  GOOGLE_APPLICATION_CREDENTIALS   Path to a Firebase service account JSON key
  gcloud auth application-default login   Uses Application Default Credentials
`);
}

function escapeCsvCell(value) {
  const text = value == null ? '' : String(value);
  if (/[",\r\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function formatTimestamp(value) {
  if (!value) {
    return '';
  }
  if (value.toDate) {
    return value.toDate().toISOString();
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  return String(value);
}

function rowToCsv(row) {
  return COLUMNS.map((column) => escapeCsvCell(row[column])).join(',');
}

function defaultOutputPath() {
  const stamp = new Date()
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\..+$/, '')
    .replace('T', '-');
  return path.join(process.cwd(), `rsvps-export-${stamp}.csv`);
}

async function fetchRsvps(db) {
  const snapshot = await db.collection(COLLECTION).get();
  const rows = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      documentId: doc.id,
      fullName: data.fullName || '',
      attending: data.attending === true ? 'yes' : data.attending === false ? 'no' : '',
      starter: data.starter || '',
      main: data.main || '',
      dessert: data.dessert || '',
      dietary: data.dietary || '',
      submittedAt: formatTimestamp(data.submittedAt)
    };
  });

  rows.sort((a, b) => {
    const timeCompare = b.submittedAt.localeCompare(a.submittedAt);
    if (timeCompare !== 0) {
      return timeCompare;
    }
    return a.fullName.localeCompare(b.fullName, undefined, { sensitivity: 'base' });
  });

  return rows;
}

async function main() {
  const { help, outputPath } = parseArgs(process.argv.slice(2));
  if (help) {
    printHelp();
    return;
  }

  if (!admin.apps.length) {
    admin.initializeApp({
      projectId: PROJECT_ID
    });
  }

  const db = admin.firestore();
  const rows = await fetchRsvps(db);
  const destination = outputPath
    ? path.resolve(outputPath)
    : defaultOutputPath();

  const csv = [COLUMNS.join(','), ...rows.map(rowToCsv)].join('\r\n') + '\r\n';
  fs.writeFileSync(destination, csv, 'utf8');

  console.log(`Exported ${rows.length} RSVP record(s) to ${destination}`);
}

main().catch((err) => {
  const message = err && err.message ? err.message : String(err);

  if (err && err.code === 'ENOENT' && process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.error(
      `Service account key not found: ${process.env.GOOGLE_APPLICATION_CREDENTIALS}`
    );
  } else if (err && (err.code === 7 || err.code === 'permission-denied')) {
    console.error(
      'Permission denied. Use a Firebase service account with Cloud Datastore User or Firebase Admin access.'
    );
  } else if (message.includes('Could not load the default credentials')) {
    console.error(
      'No credentials found. Set GOOGLE_APPLICATION_CREDENTIALS to a service account JSON key, or run:\n' +
      '  gcloud auth application-default login'
    );
  } else if (message.includes('invalid_grant')) {
    console.error(
      'Google credentials are expired or invalid. Refresh them with one of:\n' +
      '  gcloud auth application-default login\n' +
      '  Set GOOGLE_APPLICATION_CREDENTIALS to a fresh service account JSON key from Firebase Console > Project Settings > Service Accounts'
    );
  } else {
    console.error('Export failed:', message);
  }
  process.exit(1);
});

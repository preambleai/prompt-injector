// Node.js script to merge and normalize all payloads into all-attack-payloads.json
const fs = require('fs');
const path = require('path');

const sources = [
  'assets/payloads/owasp-llm01-llm10.json',
  'assets/payloads/advanced-attacks.json',
  'assets/payloads/comprehensive-attacks-2025.json',
  'assets/payloads/latest-research-2025.json',
];

const output = 'public/assets/payloads/all-attack-payloads.json';

// Reference schema fields
const schema = {
  id: '',
  name: '',
  description: '',
  category: '',
  payload: '',
  tags: [],
  source: '',
  owasp: [],
  mitreAtlas: [],
  aiSystem: [],
  technique: '',
  successRate: null,
  bypassMethods: [],
  isEditable: false,
  version: '',
  lastModified: '',
  createdBy: '',
  expectedOutput: '',
  successIndicators: [],
  failureIndicators: []
};

function normalize(payload) {
  // Map alternative field names to schema
  const mapped = { ...schema, ...payload };
  // Handle label renames from comprehensive-attacks-2025.json
  if (payload.owaspLabels) mapped.owasp = payload.owaspLabels;
  if (payload.mitreAtlasLabels) mapped.mitreAtlas = payload.mitreAtlasLabels;
  if (payload.aiSystemLabels) mapped.aiSystem = payload.aiSystemLabels;
  if (payload.nameUrl) mapped.nameUrl = payload.nameUrl;
  // Ensure arrays
  mapped.tags = Array.isArray(mapped.tags) ? mapped.tags : [];
  mapped.owasp = Array.isArray(mapped.owasp) ? mapped.owasp : [];
  mapped.mitreAtlas = Array.isArray(mapped.mitreAtlas) ? mapped.mitreAtlas : [];
  mapped.aiSystem = Array.isArray(mapped.aiSystem) ? mapped.aiSystem : [];
  mapped.bypassMethods = Array.isArray(mapped.bypassMethods) ? mapped.bypassMethods : [];
  mapped.successIndicators = Array.isArray(mapped.successIndicators) ? mapped.successIndicators : [];
  mapped.failureIndicators = Array.isArray(mapped.failureIndicators) ? mapped.failureIndicators : [];
  // Set missing fields to defaults
  Object.keys(schema).forEach(key => {
    if (mapped[key] === undefined) mapped[key] = schema[key];
  });
  return mapped;
}

let allPayloads = [];
for (const src of sources) {
  const filePath = path.resolve(__dirname, '..', src);
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${filePath}`);
    continue;
  }
  const arr = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  for (const p of arr) {
    allPayloads.push(normalize(p));
  }
}

// Remove duplicates by id
const seen = new Set();
allPayloads = allPayloads.filter(p => {
  if (seen.has(p.id)) return false;
  seen.add(p.id);
  return true;
});

fs.writeFileSync(path.resolve(__dirname, '..', output), JSON.stringify(allPayloads, null, 2));
console.log(`Merged ${allPayloads.length} payloads into ${output}`); 
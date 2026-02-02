import { supabase } from '@/lib/supabase';
import type { PersonInsert, GroupType } from '@/types/database';

export type ImportSource = 'phone' | 'linkedin' | 'facebook' | 'google' | 'csv';

export interface ImportedContact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role?: string;
  company?: string;
  notes?: string;
  source: ImportSource;
  selected: boolean;
}

export interface ImportResult {
  success: number;
  failed: number;
  errors: string[];
}

// Parse CSV content into rows
export function parseCSV(content: string): Record<string, string>[] {
  const lines = content.trim().split(/\r?\n/);
  if (lines.length < 2) return [];

  // Parse header line
  const headers = parseCSVLine(lines[0]);

  // Parse data lines
  const rows: Record<string, string>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length === 0) continue;

    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header.toLowerCase().trim()] = values[index]?.trim() || '';
    });
    rows.push(row);
  }

  return rows;
}

// Parse a single CSV line (handles quoted values)
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
}

// LinkedIn CSV field mapping
const LINKEDIN_FIELD_MAP: Record<string, keyof ImportedContact> = {
  'name': 'name',
  'first name': 'name',
  'last name': 'name',
  'email address': 'email',
  'email': 'email',
  'company': 'company',
  'position': 'role',
  'title': 'role',
  'connected on': 'notes',
};

// Facebook CSV field mapping
const FACEBOOK_FIELD_MAP: Record<string, keyof ImportedContact> = {
  'name': 'name',
  'email': 'email',
  'phone': 'phone',
};

// Google Contacts CSV field mapping
const GOOGLE_FIELD_MAP: Record<string, keyof ImportedContact> = {
  'name': 'name',
  'full name': 'name',
  'given name': 'name',
  'family name': 'name',
  'e-mail 1 - value': 'email',
  'email': 'email',
  'phone 1 - value': 'phone',
  'phone': 'phone',
  'organization 1 - name': 'company',
  'company': 'company',
  'organization 1 - title': 'role',
  'job title': 'role',
  'notes': 'notes',
};

// Generic CSV field mapping
const GENERIC_FIELD_MAP: Record<string, keyof ImportedContact> = {
  'name': 'name',
  'full name': 'name',
  'first name': 'name',
  'firstname': 'name',
  'last name': 'name',
  'lastname': 'name',
  'email': 'email',
  'email address': 'email',
  'e-mail': 'email',
  'phone': 'phone',
  'phone number': 'phone',
  'mobile': 'phone',
  'cell': 'phone',
  'company': 'company',
  'organization': 'company',
  'employer': 'company',
  'role': 'role',
  'title': 'role',
  'job title': 'role',
  'position': 'role',
  'notes': 'notes',
  'note': 'notes',
};

// Map CSV row to ImportedContact based on source
export function mapRowToContact(
  row: Record<string, string>,
  source: ImportSource,
  index: number
): ImportedContact | null {
  let fieldMap: Record<string, keyof ImportedContact>;

  switch (source) {
    case 'linkedin':
      fieldMap = LINKEDIN_FIELD_MAP;
      break;
    case 'facebook':
      fieldMap = FACEBOOK_FIELD_MAP;
      break;
    case 'google':
      fieldMap = GOOGLE_FIELD_MAP;
      break;
    default:
      fieldMap = GENERIC_FIELD_MAP;
  }

  const contact: Partial<ImportedContact> = {
    id: `import-${index}-${Date.now()}`,
    source,
    selected: true,
  };

  // Handle name specially for LinkedIn (first + last name)
  let firstName = '';
  let lastName = '';

  for (const [csvField, value] of Object.entries(row)) {
    const normalizedField = csvField.toLowerCase().trim();
    const mappedField = fieldMap[normalizedField];

    if (mappedField === 'name') {
      if (normalizedField.includes('first')) {
        firstName = value;
      } else if (normalizedField.includes('last')) {
        lastName = value;
      } else {
        contact.name = value;
      }
    } else if (mappedField) {
      contact[mappedField] = value;
    }
  }

  // Combine first and last name if separate
  if (firstName || lastName) {
    contact.name = `${firstName} ${lastName}`.trim();
  }

  // Skip if no name
  if (!contact.name) return null;

  return contact as ImportedContact;
}

// Parse contacts from CSV content
export function parseContactsFromCSV(
  content: string,
  source: ImportSource
): ImportedContact[] {
  const rows = parseCSV(content);
  const contacts: ImportedContact[] = [];

  rows.forEach((row, index) => {
    const contact = mapRowToContact(row, source, index);
    if (contact) {
      contacts.push(contact);
    }
  });

  return contacts;
}

// Determine group based on source and company
export function determineGroup(contact: ImportedContact): GroupType {
  if (contact.source === 'linkedin') {
    return 'work';
  }
  if (contact.source === 'facebook') {
    return 'friends';
  }
  if (contact.company) {
    return 'work';
  }
  return 'acquaintances';
}

// Import contacts to database
export async function importContacts(
  contacts: ImportedContact[]
): Promise<ImportResult> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const result: ImportResult = {
    success: 0,
    failed: 0,
    errors: [],
  };

  const selectedContacts = contacts.filter(c => c.selected);

  for (const contact of selectedContacts) {
    try {
      const personData: PersonInsert = {
        user_id: user.id,
        name: contact.name,
        email: contact.email || null,
        phone: contact.phone || null,
        role: contact.role || null,
        group: determineGroup(contact),
        subgroup: contact.company || null,
        notes: contact.notes ? `Imported from ${contact.source}: ${contact.notes}` : `Imported from ${contact.source}`,
        relationship_health: 50, // Default health for new contacts
      };

      const { error } = await supabase
        .from('people')
        .insert(personData);

      if (error) {
        result.failed++;
        result.errors.push(`${contact.name}: ${error.message}`);
      } else {
        result.success++;
      }
    } catch (err) {
      result.failed++;
      result.errors.push(`${contact.name}: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }

  return result;
}

// Check if Contact Picker API is available (for phone contacts)
export function isContactPickerSupported(): boolean {
  return 'contacts' in navigator && 'ContactsManager' in window;
}

// Pick contacts using Contact Picker API (mobile only)
export async function pickPhoneContacts(): Promise<ImportedContact[]> {
  if (!isContactPickerSupported()) {
    throw new Error('Contact Picker API not supported on this device');
  }

  try {
    const props = ['name', 'email', 'tel'];
    const opts = { multiple: true };

    // @ts-expect-error - Contact Picker API types not in standard lib
    const contacts = await navigator.contacts.select(props, opts);

    return contacts.map((contact: { name?: string[]; email?: string[]; tel?: string[] }, index: number) => ({
      id: `phone-${index}-${Date.now()}`,
      name: contact.name?.[0] || 'Unknown',
      email: contact.email?.[0],
      phone: contact.tel?.[0],
      source: 'phone' as ImportSource,
      selected: true,
    }));
  } catch (err) {
    if (err instanceof Error && err.name === 'InvalidStateError') {
      throw new Error('Please try again - contact picker requires user gesture');
    }
    throw err;
  }
}

// Generate VCard format for export (future feature)
export function generateVCard(contacts: ImportedContact[]): string {
  return contacts
    .map(contact => {
      const lines = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `FN:${contact.name}`,
      ];

      if (contact.email) {
        lines.push(`EMAIL:${contact.email}`);
      }
      if (contact.phone) {
        lines.push(`TEL:${contact.phone}`);
      }
      if (contact.company) {
        lines.push(`ORG:${contact.company}`);
      }
      if (contact.role) {
        lines.push(`TITLE:${contact.role}`);
      }

      lines.push('END:VCARD');
      return lines.join('\n');
    })
    .join('\n\n');
}

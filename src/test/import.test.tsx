import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as importService from '@/services/import';

// Mock the supabase client
vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: 'test-user-id' } },
      }),
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockResolvedValue({ data: null, error: null }),
      eq: vi.fn().mockReturnThis(),
    })),
  },
}));

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={createQueryClient()}>
    {children}
  </QueryClientProvider>
);

describe('Import Service - CSV Parsing', () => {
  describe('parseCSV', () => {
    it('parses simple CSV content', () => {
      const csv = `Name,Email,Phone
John Doe,john@example.com,555-1234
Jane Smith,jane@example.com,555-5678`;

      const result = importService.parseCSV(csv);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '555-1234',
      });
      expect(result[1]).toEqual({
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '555-5678',
      });
    });

    it('handles quoted values with commas', () => {
      const csv = `Name,Company,Email
"Doe, John","Acme, Inc.",john@example.com`;

      const result = importService.parseCSV(csv);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Doe, John');
      expect(result[0].company).toBe('Acme, Inc.');
    });

    it('handles empty values', () => {
      const csv = `Name,Email,Phone
John Doe,,555-1234`;

      const result = importService.parseCSV(csv);

      expect(result).toHaveLength(1);
      expect(result[0].email).toBe('');
      expect(result[0].phone).toBe('555-1234');
    });

    it('returns empty array for empty content', () => {
      const result = importService.parseCSV('');
      expect(result).toHaveLength(0);
    });

    it('returns empty array for header-only CSV', () => {
      const result = importService.parseCSV('Name,Email,Phone');
      expect(result).toHaveLength(0);
    });

    it('handles Windows line endings (CRLF)', () => {
      const csv = `Name,Email\r\nJohn,john@example.com\r\nJane,jane@example.com`;

      const result = importService.parseCSV(csv);

      expect(result).toHaveLength(2);
    });
  });

  describe('parseContactsFromCSV', () => {
    it('parses contacts from generic CSV', () => {
      const csv = `Full Name,Email,Phone,Company,Title
John Doe,john@example.com,555-1234,Acme Inc,Developer`;

      const contacts = importService.parseContactsFromCSV(csv, 'csv');

      expect(contacts).toHaveLength(1);
      expect(contacts[0].name).toBe('John Doe');
      expect(contacts[0].email).toBe('john@example.com');
      expect(contacts[0].phone).toBe('555-1234');
      expect(contacts[0].company).toBe('Acme Inc');
      expect(contacts[0].role).toBe('Developer');
      expect(contacts[0].source).toBe('csv');
      expect(contacts[0].selected).toBe(true);
    });

    it('handles LinkedIn CSV format', () => {
      const csv = `First Name,Last Name,Email Address,Company,Position
John,Doe,john@example.com,Acme Inc,Developer`;

      const contacts = importService.parseContactsFromCSV(csv, 'linkedin');

      expect(contacts).toHaveLength(1);
      expect(contacts[0].name).toBe('John Doe');
      expect(contacts[0].email).toBe('john@example.com');
      expect(contacts[0].source).toBe('linkedin');
    });

    it('skips rows without name', () => {
      const csv = `Name,Email
,john@example.com
Jane,jane@example.com`;

      const contacts = importService.parseContactsFromCSV(csv, 'csv');

      expect(contacts).toHaveLength(1);
      expect(contacts[0].name).toBe('Jane');
    });

    it('assigns unique IDs to contacts', () => {
      const csv = `Name,Email
John,john@example.com
Jane,jane@example.com`;

      const contacts = importService.parseContactsFromCSV(csv, 'csv');

      expect(contacts[0].id).not.toBe(contacts[1].id);
    });
  });
});

describe('Import Service - Contact Mapping', () => {
  describe('mapRowToContact', () => {
    it('maps basic fields correctly', () => {
      const row = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '555-1234',
      };

      const contact = importService.mapRowToContact(row, 'csv', 0);

      expect(contact).not.toBeNull();
      expect(contact?.name).toBe('John Doe');
      expect(contact?.email).toBe('john@example.com');
      expect(contact?.phone).toBe('555-1234');
    });

    it('combines first and last name for LinkedIn', () => {
      const row = {
        'first name': 'John',
        'last name': 'Doe',
        email: 'john@example.com',
      };

      const contact = importService.mapRowToContact(row, 'linkedin', 0);

      expect(contact?.name).toBe('John Doe');
    });

    it('returns null if no name field', () => {
      const row = {
        email: 'john@example.com',
        phone: '555-1234',
      };

      const contact = importService.mapRowToContact(row, 'csv', 0);

      expect(contact).toBeNull();
    });

    it('sets source correctly', () => {
      const row = { name: 'John' };

      const csvContact = importService.mapRowToContact(row, 'csv', 0);
      const linkedinContact = importService.mapRowToContact(row, 'linkedin', 0);
      const facebookContact = importService.mapRowToContact(row, 'facebook', 0);
      const googleContact = importService.mapRowToContact(row, 'google', 0);

      expect(csvContact?.source).toBe('csv');
      expect(linkedinContact?.source).toBe('linkedin');
      expect(facebookContact?.source).toBe('facebook');
      expect(googleContact?.source).toBe('google');
    });

    it('sets selected to true by default', () => {
      const row = { name: 'John' };
      const contact = importService.mapRowToContact(row, 'csv', 0);

      expect(contact?.selected).toBe(true);
    });
  });

  describe('determineGroup', () => {
    it('assigns work group for LinkedIn contacts', () => {
      const contact: importService.ImportedContact = {
        id: '1',
        name: 'John',
        source: 'linkedin',
        selected: true,
      };

      expect(importService.determineGroup(contact)).toBe('work');
    });

    it('assigns friends group for Facebook contacts', () => {
      const contact: importService.ImportedContact = {
        id: '1',
        name: 'John',
        source: 'facebook',
        selected: true,
      };

      expect(importService.determineGroup(contact)).toBe('friends');
    });

    it('assigns work group for contacts with company', () => {
      const contact: importService.ImportedContact = {
        id: '1',
        name: 'John',
        company: 'Acme Inc',
        source: 'csv',
        selected: true,
      };

      expect(importService.determineGroup(contact)).toBe('work');
    });

    it('assigns acquaintances for generic contacts', () => {
      const contact: importService.ImportedContact = {
        id: '1',
        name: 'John',
        source: 'csv',
        selected: true,
      };

      expect(importService.determineGroup(contact)).toBe('acquaintances');
    });
  });
});

describe('Import Service - Contact Picker', () => {
  describe('isContactPickerSupported', () => {
    it('returns false when navigator.contacts is not available', () => {
      expect(importService.isContactPickerSupported()).toBe(false);
    });
  });
});

describe('Import Service - VCard Generation', () => {
  describe('generateVCard', () => {
    it('generates valid VCard format', () => {
      const contacts: importService.ImportedContact[] = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '555-1234',
          company: 'Acme Inc',
          role: 'Developer',
          source: 'csv',
          selected: true,
        },
      ];

      const vcard = importService.generateVCard(contacts);

      expect(vcard).toContain('BEGIN:VCARD');
      expect(vcard).toContain('VERSION:3.0');
      expect(vcard).toContain('FN:John Doe');
      expect(vcard).toContain('EMAIL:john@example.com');
      expect(vcard).toContain('TEL:555-1234');
      expect(vcard).toContain('ORG:Acme Inc');
      expect(vcard).toContain('TITLE:Developer');
      expect(vcard).toContain('END:VCARD');
    });

    it('handles contacts without optional fields', () => {
      const contacts: importService.ImportedContact[] = [
        {
          id: '1',
          name: 'John Doe',
          source: 'csv',
          selected: true,
        },
      ];

      const vcard = importService.generateVCard(contacts);

      expect(vcard).toContain('FN:John Doe');
      expect(vcard).not.toContain('EMAIL:');
      expect(vcard).not.toContain('TEL:');
    });

    it('generates multiple VCards for multiple contacts', () => {
      const contacts: importService.ImportedContact[] = [
        { id: '1', name: 'John', source: 'csv', selected: true },
        { id: '2', name: 'Jane', source: 'csv', selected: true },
      ];

      const vcard = importService.generateVCard(contacts);

      expect(vcard.match(/BEGIN:VCARD/g)).toHaveLength(2);
      expect(vcard.match(/END:VCARD/g)).toHaveLength(2);
    });
  });
});

describe('ImportContactsModal Component', () => {
  it('renders without crashing', async () => {
    const ImportContactsModal = (await import('@/components/attune/ImportContactsModal')).default;

    render(
      <ImportContactsModal
        isOpen={true}
        onClose={() => {}}
        source="csv"
      />,
      { wrapper }
    );

    expect(screen.getByText('Import CSV File')).toBeInTheDocument();
  });

  it('shows correct title for LinkedIn import', async () => {
    const ImportContactsModal = (await import('@/components/attune/ImportContactsModal')).default;

    render(
      <ImportContactsModal
        isOpen={true}
        onClose={() => {}}
        source="linkedin"
      />,
      { wrapper }
    );

    expect(screen.getByText('Import LinkedIn Connections')).toBeInTheDocument();
  });

  it('shows correct title for Facebook import', async () => {
    const ImportContactsModal = (await import('@/components/attune/ImportContactsModal')).default;

    render(
      <ImportContactsModal
        isOpen={true}
        onClose={() => {}}
        source="facebook"
      />,
      { wrapper }
    );

    expect(screen.getByText('Import Facebook Friends')).toBeInTheDocument();
  });

  it('shows correct title for Google import', async () => {
    const ImportContactsModal = (await import('@/components/attune/ImportContactsModal')).default;

    render(
      <ImportContactsModal
        isOpen={true}
        onClose={() => {}}
        source="google"
      />,
      { wrapper }
    );

    expect(screen.getByText('Import Google Contacts')).toBeInTheDocument();
  });

  it('shows correct title for Phone import', async () => {
    const ImportContactsModal = (await import('@/components/attune/ImportContactsModal')).default;

    render(
      <ImportContactsModal
        isOpen={true}
        onClose={() => {}}
        source="phone"
      />,
      { wrapper }
    );

    expect(screen.getByText('Import Phone Contacts')).toBeInTheDocument();
  });

  it('does not render when closed', async () => {
    const ImportContactsModal = (await import('@/components/attune/ImportContactsModal')).default;

    render(
      <ImportContactsModal
        isOpen={false}
        onClose={() => {}}
        source="csv"
      />,
      { wrapper }
    );

    expect(screen.queryByText('Import CSV File')).not.toBeInTheDocument();
  });

  it('calls onClose when cancel is clicked', async () => {
    const ImportContactsModal = (await import('@/components/attune/ImportContactsModal')).default;
    const onClose = vi.fn();

    render(
      <ImportContactsModal
        isOpen={true}
        onClose={onClose}
        source="csv"
      />,
      { wrapper }
    );

    fireEvent.click(screen.getByText('Cancel'));
    expect(onClose).toHaveBeenCalled();
  });

  it('has continue button on instructions step', async () => {
    const ImportContactsModal = (await import('@/components/attune/ImportContactsModal')).default;

    render(
      <ImportContactsModal
        isOpen={true}
        onClose={() => {}}
        source="csv"
      />,
      { wrapper }
    );

    expect(screen.getByText('Continue')).toBeInTheDocument();
  });
});

describe('Import Field Mappings', () => {
  it('recognizes common name field variations', () => {
    const variations = [
      { name: 'John' },
      { 'full name': 'John' },
      { 'first name': 'John' },
      { firstname: 'John' },
    ];

    variations.forEach(row => {
      const contact = importService.mapRowToContact(row, 'csv', 0);
      expect(contact?.name).toBeTruthy();
    });
  });

  it('recognizes common email field variations', () => {
    const variations = [
      { name: 'John', email: 'john@example.com' },
      { name: 'John', 'email address': 'john@example.com' },
      { name: 'John', 'e-mail': 'john@example.com' },
    ];

    variations.forEach(row => {
      const contact = importService.mapRowToContact(row, 'csv', 0);
      expect(contact?.email).toBe('john@example.com');
    });
  });

  it('recognizes common phone field variations', () => {
    const variations = [
      { name: 'John', phone: '555-1234' },
      { name: 'John', 'phone number': '555-1234' },
      { name: 'John', mobile: '555-1234' },
      { name: 'John', cell: '555-1234' },
    ];

    variations.forEach(row => {
      const contact = importService.mapRowToContact(row, 'csv', 0);
      expect(contact?.phone).toBe('555-1234');
    });
  });

  it('recognizes common company field variations', () => {
    const variations = [
      { name: 'John', company: 'Acme' },
      { name: 'John', organization: 'Acme' },
      { name: 'John', employer: 'Acme' },
    ];

    variations.forEach(row => {
      const contact = importService.mapRowToContact(row, 'csv', 0);
      expect(contact?.company).toBe('Acme');
    });
  });

  it('recognizes common role field variations', () => {
    const variations = [
      { name: 'John', role: 'Developer' },
      { name: 'John', title: 'Developer' },
      { name: 'John', 'job title': 'Developer' },
      { name: 'John', position: 'Developer' },
    ];

    variations.forEach(row => {
      const contact = importService.mapRowToContact(row, 'csv', 0);
      expect(contact?.role).toBe('Developer');
    });
  });
});

describe('Import Sources', () => {
  it('has all expected import sources', () => {
    const sources: importService.ImportSource[] = ['phone', 'linkedin', 'facebook', 'google', 'csv'];

    sources.forEach(source => {
      const contacts = importService.parseContactsFromCSV('Name\nJohn', source);
      expect(contacts[0].source).toBe(source);
    });
  });
});

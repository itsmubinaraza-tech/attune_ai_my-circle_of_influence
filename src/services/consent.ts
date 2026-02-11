import { supabase } from '@/lib/supabase';

export type ConsentType =
  | 'terms_of_service'
  | 'privacy_policy'
  | 'ai_disclaimer'
  | 'crisis_resources_acknowledgement'
  | 'data_handling'
  | 'marketing_communications';

export interface ConsentRecord {
  id: string;
  created_at: string;
  user_id: string | null;
  email: string | null;
  consent_type: ConsentType;
  version_hash: string;
  document_version: string;
  consent_flag: boolean;
  ip_address: string | null;
  user_agent: string | null;
  consent_method: string;
  withdrawn_at: string | null;
  withdrawal_reason: string | null;
}

export interface LegalDocumentVersion {
  id: string;
  created_at: string;
  document_type: ConsentType;
  version: string;
  version_hash: string;
  effective_date: string;
  title: string;
  content_url: string | null;
  is_current: boolean;
}

export interface RecordConsentInput {
  email?: string;
  consentType: ConsentType;
  consentFlag?: boolean;
}

/**
 * Get the current version of a legal document
 */
export async function getCurrentDocumentVersion(
  documentType: ConsentType
): Promise<LegalDocumentVersion | null> {
  const { data, error } = await supabase
    .from('legal_document_versions')
    .select('*')
    .eq('document_type', documentType)
    .eq('is_current', true)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

/**
 * Get all current document versions
 */
export async function getAllCurrentDocumentVersions(): Promise<LegalDocumentVersion[]> {
  const { data, error } = await supabase
    .from('legal_document_versions')
    .select('*')
    .eq('is_current', true);

  if (error) throw error;
  return data || [];
}

/**
 * Record user consent for a legal document
 */
export async function recordConsent(input: RecordConsentInput): Promise<ConsentRecord> {
  const { email, consentType, consentFlag = true } = input;

  // Get current document version
  const docVersion = await getCurrentDocumentVersion(consentType);
  if (!docVersion) {
    throw new Error(`No current version found for document type: ${consentType}`);
  }

  // Get current user (may be null for pre-signup consent)
  const { data: { user } } = await supabase.auth.getUser();

  const consentData = {
    user_id: user?.id || null,
    email: email || user?.email || null,
    consent_type: consentType,
    version_hash: docVersion.version_hash,
    document_version: docVersion.version,
    consent_flag: consentFlag,
    user_agent: navigator.userAgent,
    consent_method: 'modal',
  };

  const { data, error } = await supabase
    .from('consent_records')
    .insert(consentData)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Record multiple consents at once (for signup flow)
 */
export async function recordAllRequiredConsents(email: string): Promise<ConsentRecord[]> {
  const requiredConsents: ConsentType[] = [
    'terms_of_service',
    'privacy_policy',
    'ai_disclaimer',
    'crisis_resources_acknowledgement',
  ];

  const results: ConsentRecord[] = [];

  for (const consentType of requiredConsents) {
    const result = await recordConsent({ email, consentType });
    results.push(result);
  }

  return results;
}

/**
 * Check if user has given consent for a specific document type
 */
export async function hasUserConsented(
  consentType: ConsentType,
  userId?: string
): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  const checkUserId = userId || user?.id;

  if (!checkUserId) return false;

  // Get current document version
  const docVersion = await getCurrentDocumentVersion(consentType);
  if (!docVersion) return false;

  // Check for active consent (not withdrawn)
  const { data, error } = await supabase
    .from('consent_records')
    .select('id')
    .eq('user_id', checkUserId)
    .eq('consent_type', consentType)
    .eq('version_hash', docVersion.version_hash)
    .eq('consent_flag', true)
    .is('withdrawn_at', null)
    .limit(1);

  if (error) throw error;
  return (data?.length || 0) > 0;
}

/**
 * Check if user has all required consents
 */
export async function hasAllRequiredConsents(userId?: string): Promise<boolean> {
  const requiredConsents: ConsentType[] = [
    'terms_of_service',
    'privacy_policy',
    'ai_disclaimer',
    'crisis_resources_acknowledgement',
  ];

  for (const consentType of requiredConsents) {
    const hasConsent = await hasUserConsented(consentType, userId);
    if (!hasConsent) return false;
  }

  return true;
}

/**
 * Get user's consent history
 */
export async function getConsentHistory(userId?: string): Promise<ConsentRecord[]> {
  const { data: { user } } = await supabase.auth.getUser();
  const checkUserId = userId || user?.id;

  if (!checkUserId) return [];

  const { data, error } = await supabase
    .from('consent_records')
    .select('*')
    .eq('user_id', checkUserId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * Withdraw consent for a specific document type
 */
export async function withdrawConsent(
  consentType: ConsentType,
  reason?: string
): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User must be logged in to withdraw consent');

  const docVersion = await getCurrentDocumentVersion(consentType);
  if (!docVersion) return;

  const { error } = await supabase
    .from('consent_records')
    .update({
      withdrawn_at: new Date().toISOString(),
      withdrawal_reason: reason || null,
    })
    .eq('user_id', user.id)
    .eq('consent_type', consentType)
    .eq('version_hash', docVersion.version_hash)
    .is('withdrawn_at', null);

  if (error) throw error;
}

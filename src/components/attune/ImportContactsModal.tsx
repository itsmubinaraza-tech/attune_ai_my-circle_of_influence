import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Upload,
  FileText,
  Check,
  CheckCircle2,
  XCircle,
  Smartphone,
  Linkedin,
  Facebook,
  Mail as GoogleIcon,
  AlertCircle,
  Loader2,
  ChevronRight,
  Download,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQueryClient } from '@tanstack/react-query';
import {
  parseContactsFromCSV,
  importContacts,
  isContactPickerSupported,
  pickPhoneContacts,
  type ImportSource,
  type ImportedContact,
  type ImportResult,
} from '@/services/import';

interface ImportContactsModalProps {
  isOpen: boolean;
  onClose: () => void;
  source: ImportSource;
}

const sourceConfig: Record<ImportSource, {
  title: string;
  icon: React.ElementType;
  color: string;
  instructions: React.ReactNode;
  acceptedFormats: string;
}> = {
  phone: {
    title: 'Phone Contacts',
    icon: Smartphone,
    color: 'text-green-400',
    acceptedFormats: '.csv,.vcf',
    instructions: (
      <div className="space-y-3 text-sm text-white/70">
        <p>Import contacts from your phone:</p>
        <div className="space-y-2">
          <p className="font-medium text-white/90">Option 1: Direct Import (Mobile)</p>
          <p>On mobile devices, tap the button below to select contacts directly.</p>
        </div>
        <div className="space-y-2">
          <p className="font-medium text-white/90">Option 2: CSV Upload</p>
          <p>Export contacts as CSV from your phone and upload the file.</p>
        </div>
      </div>
    ),
  },
  linkedin: {
    title: 'LinkedIn Connections',
    icon: Linkedin,
    color: 'text-blue-400',
    acceptedFormats: '.csv',
    instructions: (
      <div className="space-y-3 text-sm text-white/70">
        <p>To export your LinkedIn connections:</p>
        <ol className="list-decimal list-inside space-y-2">
          <li>Go to <a href="https://www.linkedin.com/mypreferences/d/download-my-data" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline inline-flex items-center gap-1">LinkedIn Data Export <ExternalLink className="w-3 h-3" /></a></li>
          <li>Select "Connections" and click "Request archive"</li>
          <li>Wait for LinkedIn to email you (may take up to 24 hours)</li>
          <li>Download and unzip the file</li>
          <li>Upload the <code className="bg-white/10 px-1 rounded">Connections.csv</code> file below</li>
        </ol>
      </div>
    ),
  },
  facebook: {
    title: 'Facebook Friends',
    icon: Facebook,
    color: 'text-blue-500',
    acceptedFormats: '.csv,.json',
    instructions: (
      <div className="space-y-3 text-sm text-white/70">
        <p>To export your Facebook friends:</p>
        <ol className="list-decimal list-inside space-y-2">
          <li>Go to <a href="https://www.facebook.com/dyi" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline inline-flex items-center gap-1">Facebook Download Your Information <ExternalLink className="w-3 h-3" /></a></li>
          <li>Select "Friends and followers" in the filter</li>
          <li>Choose JSON or CSV format</li>
          <li>Click "Request a download"</li>
          <li>Upload the friends file below when ready</li>
        </ol>
      </div>
    ),
  },
  google: {
    title: 'Google Contacts',
    icon: GoogleIcon,
    color: 'text-red-400',
    acceptedFormats: '.csv',
    instructions: (
      <div className="space-y-3 text-sm text-white/70">
        <p>To export your Google Contacts:</p>
        <ol className="list-decimal list-inside space-y-2">
          <li>Go to <a href="https://contacts.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline inline-flex items-center gap-1">Google Contacts <ExternalLink className="w-3 h-3" /></a></li>
          <li>Click the gear icon (Settings)</li>
          <li>Select "Export"</li>
          <li>Choose "Google CSV" format</li>
          <li>Click "Export" and upload the file below</li>
        </ol>
      </div>
    ),
  },
  csv: {
    title: 'CSV File',
    icon: FileText,
    color: 'text-violet-400',
    acceptedFormats: '.csv',
    instructions: (
      <div className="space-y-3 text-sm text-white/70">
        <p>Upload any CSV file with contact information.</p>
        <p>The CSV should include columns like:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Name (required)</li>
          <li>Email</li>
          <li>Phone</li>
          <li>Company</li>
          <li>Role/Title</li>
        </ul>
      </div>
    ),
  },
};

type Step = 'instructions' | 'upload' | 'preview' | 'importing' | 'complete';

const ImportContactsModal = ({ isOpen, onClose, source }: ImportContactsModalProps) => {
  const [step, setStep] = useState<Step>('instructions');
  const [contacts, setContacts] = useState<ImportedContact[]>([]);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const config = sourceConfig[source];
  const Icon = config.icon;

  const resetState = () => {
    setStep('instructions');
    setContacts([]);
    setResult(null);
    setError(null);
    setIsDragging(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleFileSelect = useCallback(async (file: File) => {
    setError(null);

    try {
      const content = await file.text();
      const parsedContacts = parseContactsFromCSV(content, source);

      if (parsedContacts.length === 0) {
        setError('No valid contacts found in the file. Please check the format.');
        return;
      }

      setContacts(parsedContacts);
      setStep('preview');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse file');
    }
  }, [source]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handlePhonePickerClick = async () => {
    if (!isContactPickerSupported()) {
      setStep('upload');
      return;
    }

    try {
      const pickedContacts = await pickPhoneContacts();
      if (pickedContacts.length > 0) {
        setContacts(pickedContacts);
        setStep('preview');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to pick contacts');
      setStep('upload');
    }
  };

  const toggleContact = (id: string) => {
    setContacts(prev =>
      prev.map(c => c.id === id ? { ...c, selected: !c.selected } : c)
    );
  };

  const toggleAll = () => {
    const allSelected = contacts.every(c => c.selected);
    setContacts(prev => prev.map(c => ({ ...c, selected: !allSelected })));
  };

  const handleImport = async () => {
    setStep('importing');
    setError(null);

    try {
      const importResult = await importContacts(contacts);
      setResult(importResult);
      setStep('complete');

      // Refresh people list
      queryClient.invalidateQueries({ queryKey: ['people'] });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Import failed');
      setStep('preview');
    }
  };

  const selectedCount = contacts.filter(c => c.selected).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-x-4 top-[5%] bottom-[5%] sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-xl z-50 flex flex-col"
          >
            <div className="liquid-glass rounded-2xl overflow-hidden flex flex-col h-full">
              {/* Header */}
              <div className="p-4 sm:p-6 border-b border-white/10 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full bg-white/10 flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${config.color}`} />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-white">Import {config.title}</h2>
                      <p className="text-sm text-white/50">
                        {step === 'instructions' && 'Follow the steps below'}
                        {step === 'upload' && 'Upload your file'}
                        {step === 'preview' && `${contacts.length} contacts found`}
                        {step === 'importing' && 'Importing...'}
                        {step === 'complete' && 'Import complete'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleClose}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors"
                  >
                    <X className="w-5 h-5 text-white/60" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-6 flex-1 overflow-y-auto">
                <AnimatePresence mode="wait">
                  {/* Step 1: Instructions */}
                  {step === 'instructions' && (
                    <motion.div
                      key="instructions"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                        {config.instructions}
                      </div>

                      {source === 'phone' && isContactPickerSupported() && (
                        <Button
                          onClick={handlePhonePickerClick}
                          className="w-full bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Smartphone className="w-4 h-4 mr-2" />
                          Select Contacts from Phone
                        </Button>
                      )}
                    </motion.div>
                  )}

                  {/* Step 2: Upload */}
                  {step === 'upload' && (
                    <motion.div
                      key="upload"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <div
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onClick={() => fileInputRef.current?.click()}
                        className={`p-8 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
                          isDragging
                            ? 'border-violet-400 bg-violet-500/10'
                            : 'border-white/20 hover:border-white/40 bg-white/5'
                        }`}
                      >
                        <div className="text-center">
                          <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragging ? 'text-violet-400' : 'text-white/40'}`} />
                          <p className="text-white/80 font-medium mb-1">
                            {isDragging ? 'Drop file here' : 'Click to upload or drag & drop'}
                          </p>
                          <p className="text-sm text-white/50">
                            Accepts: {config.acceptedFormats}
                          </p>
                        </div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept={config.acceptedFormats}
                          onChange={handleInputChange}
                          className="hidden"
                        />
                      </div>

                      {error && (
                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-2">
                          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-red-300">{error}</p>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Step 3: Preview */}
                  {step === 'preview' && (
                    <motion.div
                      key="preview"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      {/* Select All */}
                      <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                        <span className="text-sm text-white/70">
                          {selectedCount} of {contacts.length} selected
                        </span>
                        <button
                          onClick={toggleAll}
                          className="text-sm text-violet-400 hover:text-violet-300"
                        >
                          {contacts.every(c => c.selected) ? 'Deselect All' : 'Select All'}
                        </button>
                      </div>

                      {/* Contacts List */}
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {contacts.map(contact => (
                          <div
                            key={contact.id}
                            onClick={() => toggleContact(contact.id)}
                            className={`p-3 rounded-lg cursor-pointer transition-all ${
                              contact.selected
                                ? 'bg-violet-500/20 border border-violet-400/30'
                                : 'bg-white/5 border border-transparent hover:bg-white/10'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                                contact.selected
                                  ? 'bg-violet-500 border-violet-400'
                                  : 'border-white/30'
                              }`}>
                                {contact.selected && <Check className="w-3 h-3 text-white" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-white truncate">{contact.name}</p>
                                <p className="text-xs text-white/50 truncate">
                                  {[contact.email, contact.phone, contact.company].filter(Boolean).join(' · ') || 'No details'}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {error && (
                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-2">
                          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-red-300">{error}</p>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Step 4: Importing */}
                  {step === 'importing' && (
                    <motion.div
                      key="importing"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex flex-col items-center justify-center py-12"
                    >
                      <Loader2 className="w-12 h-12 text-violet-400 animate-spin mb-4" />
                      <p className="text-white/80 font-medium">Importing {selectedCount} contacts...</p>
                      <p className="text-sm text-white/50 mt-1">This may take a moment</p>
                    </motion.div>
                  )}

                  {/* Step 5: Complete */}
                  {step === 'complete' && result && (
                    <motion.div
                      key="complete"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <div className="text-center py-6">
                        <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">Import Complete!</h3>
                        <p className="text-white/60">
                          Successfully imported {result.success} {result.success === 1 ? 'contact' : 'contacts'}
                        </p>
                      </div>

                      {result.failed > 0 && (
                        <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertCircle className="w-5 h-5 text-yellow-400" />
                            <span className="font-medium text-yellow-300">
                              {result.failed} {result.failed === 1 ? 'contact' : 'contacts'} failed
                            </span>
                          </div>
                          <ul className="text-sm text-white/60 space-y-1 max-h-24 overflow-y-auto">
                            {result.errors.slice(0, 5).map((err, i) => (
                              <li key={i}>• {err}</li>
                            ))}
                            {result.errors.length > 5 && (
                              <li className="text-white/40">...and {result.errors.length - 5} more</li>
                            )}
                          </ul>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-4 rounded-xl bg-green-500/10 text-center">
                          <p className="text-2xl font-bold text-green-400">{result.success}</p>
                          <p className="text-xs text-white/50">Imported</p>
                        </div>
                        <div className="p-4 rounded-xl bg-white/5 text-center">
                          <p className="text-2xl font-bold text-white/70">{result.failed}</p>
                          <p className="text-xs text-white/50">Failed</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="p-4 sm:p-6 border-t border-white/10 flex items-center justify-between flex-shrink-0">
                {step === 'instructions' && (
                  <>
                    <Button variant="ghost" onClick={handleClose} className="text-white/70">
                      Cancel
                    </Button>
                    <Button
                      onClick={() => setStep('upload')}
                      className="bg-violet-600 hover:bg-violet-700 text-white"
                    >
                      Continue
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </>
                )}

                {step === 'upload' && (
                  <>
                    <Button variant="ghost" onClick={() => setStep('instructions')} className="text-white/70">
                      Back
                    </Button>
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-violet-600 hover:bg-violet-700 text-white"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Choose File
                    </Button>
                  </>
                )}

                {step === 'preview' && (
                  <>
                    <Button variant="ghost" onClick={() => setStep('upload')} className="text-white/70">
                      Back
                    </Button>
                    <Button
                      onClick={handleImport}
                      disabled={selectedCount === 0}
                      className="bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-700 hover:to-pink-700 text-white"
                    >
                      Import {selectedCount} Contacts
                    </Button>
                  </>
                )}

                {step === 'complete' && (
                  <>
                    <div />
                    <Button
                      onClick={handleClose}
                      className="bg-violet-600 hover:bg-violet-700 text-white"
                    >
                      Done
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ImportContactsModal;

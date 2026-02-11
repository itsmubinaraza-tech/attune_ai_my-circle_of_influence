import { Link } from 'react-router-dom';
import { ArrowLeft, Database, Lock, Globe, Shield, Trash2, Download, Mail } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f1a] via-[#1a1a2e] to-[#0f0f1a]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/50 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link
            to="/"
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white/70" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Database className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Privacy Policy</h1>
              <p className="text-xs text-white/60">Last updated: February 11, 2026</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="prose prose-invert prose-blue max-w-none">
          {/* Introduction */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Your Privacy Matters</h2>
            <p className="text-white/80 leading-relaxed">
              At AttuneAI ("we," "us," or "our"), we are committed to protecting your privacy.
              This Privacy Policy explains how we collect, use, disclose, and safeguard your
              information when you use our Attune application ("Service").
            </p>
          </section>

          {/* Data We Collect */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-400" />
              Information We Collect
            </h2>

            <h3 className="text-lg font-semibold text-white/90 mt-6 mb-3">Account Information</h3>
            <ul className="list-disc list-inside text-white/70 space-y-2 ml-4">
              <li>Email address (for authentication and communication)</li>
              <li>Name (optional, for personalization)</li>
              <li>Profile preferences and settings</li>
            </ul>

            <h3 className="text-lg font-semibold text-white/90 mt-6 mb-3">Usage Data</h3>
            <ul className="list-disc list-inside text-white/70 space-y-2 ml-4">
              <li>Conversation history with our AI assistant</li>
              <li>Contact information you enter (names, relationships, notes)</li>
              <li>Interaction logs and session data</li>
              <li>Feature usage patterns</li>
            </ul>

            <h3 className="text-lg font-semibold text-white/90 mt-6 mb-3">Technical Data</h3>
            <ul className="list-disc list-inside text-white/70 space-y-2 ml-4">
              <li>Device type and operating system</li>
              <li>Browser type and version</li>
              <li>IP address (anonymized for analytics)</li>
              <li>App performance metrics</li>
            </ul>
          </section>

          {/* How We Use Data */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-400" />
              How We Use Your Information
            </h2>
            <ul className="list-disc list-inside text-white/70 space-y-2 ml-4">
              <li>Provide, maintain, and improve the Service</li>
              <li>Personalize your experience and AI responses</li>
              <li>Send important service notifications</li>
              <li>Respond to your inquiries and support requests</li>
              <li>Analyze usage patterns to improve features</li>
              <li>Ensure security and prevent fraud</li>
            </ul>
          </section>

          {/* Data Security */}
          <section className="mb-8 bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <Lock className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-blue-400 mb-2">Data Security</h3>
                <p className="text-white/80 mb-3">
                  We implement industry-standard security measures to protect your data:
                </p>
                <ul className="text-white/70 space-y-2 list-disc list-inside">
                  <li>AES-256 encryption for data at rest</li>
                  <li>TLS/HTTPS encryption for data in transit</li>
                  <li>Row-Level Security (RLS) in our database</li>
                  <li>Regular security audits and updates</li>
                  <li>Secure authentication via Supabase Auth</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Data Retention */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Data Retention</h2>
            <p className="text-white/80 mb-4">
              We retain your data for as long as your account is active or as needed to provide
              the Service. You may request deletion of your data at any time. After account
              deletion, we may retain certain data for legal compliance purposes for up to 90 days.
            </p>
          </section>

          {/* Your Rights - GDPR/CCPA */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-400" />
              Your Privacy Rights
            </h2>

            <h3 className="text-lg font-semibold text-white/90 mt-6 mb-3">For All Users</h3>
            <ul className="list-disc list-inside text-white/70 space-y-2 ml-4">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your account and data</li>
              <li><strong>Export:</strong> Download your data in a portable format</li>
            </ul>

            <h3 className="text-lg font-semibold text-white/90 mt-6 mb-3">GDPR Rights (EU Users)</h3>
            <p className="text-white/70 mb-3">
              Under the General Data Protection Regulation, you have additional rights including:
            </p>
            <ul className="list-disc list-inside text-white/70 space-y-2 ml-4">
              <li>Right to object to processing</li>
              <li>Right to restrict processing</li>
              <li>Right to data portability (Article 20)</li>
              <li>Right to withdraw consent</li>
              <li>Right to lodge a complaint with a supervisory authority</li>
            </ul>

            <h3 className="text-lg font-semibold text-white/90 mt-6 mb-3">CCPA Rights (California Residents)</h3>
            <p className="text-white/70 mb-3">
              Under the California Consumer Privacy Act, you have the right to:
            </p>
            <ul className="list-disc list-inside text-white/70 space-y-2 ml-4">
              <li>Know what personal information is collected</li>
              <li>Know whether your data is sold or disclosed</li>
              <li>Say no to the sale of personal information (we do not sell data)</li>
              <li>Request deletion of your data</li>
              <li>Non-discrimination for exercising your rights</li>
            </ul>
          </section>

          {/* Data Sharing */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Data Sharing & Third Parties</h2>
            <p className="text-white/80 mb-4">
              We do not sell your personal information. We may share data with:
            </p>
            <ul className="list-disc list-inside text-white/70 space-y-2 ml-4">
              <li><strong>Service Providers:</strong> Supabase (database), Anthropic (AI), Vercel (hosting)</li>
              <li><strong>Legal Requirements:</strong> When required by law or legal process</li>
              <li><strong>Safety:</strong> To protect rights, privacy, safety, or property</li>
            </ul>
          </section>

          {/* Exercise Your Rights */}
          <section className="mb-8 bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              How to Exercise Your Rights
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 bg-white/5 rounded-lg">
                <Download className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-white">Export Data</h4>
                  <p className="text-sm text-white/60">Go to Profile &gt; Settings &gt; Export My Data</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-white/5 rounded-lg">
                <Trash2 className="w-5 h-5 text-red-400 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-white">Delete Account</h4>
                  <p className="text-sm text-white/60">Go to Profile &gt; Settings &gt; Delete Account</p>
                </div>
              </div>
            </div>
          </section>

          {/* Cookies */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Cookies & Local Storage</h2>
            <p className="text-white/80">
              We use essential cookies and local storage to maintain your session and preferences.
              We do not use third-party tracking cookies for advertising purposes.
            </p>
          </section>

          {/* Children */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Children's Privacy</h2>
            <p className="text-white/80">
              Our Service is not intended for users under 18 years of age. We do not knowingly
              collect personal information from children. If you believe a child has provided us
              with personal information, please contact us immediately.
            </p>
          </section>

          {/* Changes */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Changes to This Policy</h2>
            <p className="text-white/80">
              We may update this Privacy Policy periodically. We will notify you of material
              changes by email or through the Service. Your continued use after changes indicates
              acceptance of the updated policy.
            </p>
          </section>

          {/* Contact */}
          <section className="mb-8 bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-400" />
              Contact Us
            </h2>
            <p className="text-white/80 mb-3">
              For privacy-related inquiries or to exercise your rights, contact us at:
            </p>
            <p className="text-blue-400">privacy@weattuned.com</p>
            <p className="text-white/60 text-sm mt-2">
              For GDPR inquiries, you may also contact our Data Protection Officer at dpo@weattuned.com
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="max-w-4xl mx-auto px-4 flex flex-wrap gap-4 justify-center text-sm text-white/60">
          <Link to="/legal/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          <span className="text-white/30">|</span>
          <Link to="/legal/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <span className="text-white/30">|</span>
          <Link to="/legal/crisis" className="hover:text-white transition-colors">Crisis Resources</Link>
          <span className="text-white/30">|</span>
          <a href="mailto:contact@weattuned.com" className="hover:text-white transition-colors">Contact</a>
        </div>
      </footer>
    </div>
  );
}

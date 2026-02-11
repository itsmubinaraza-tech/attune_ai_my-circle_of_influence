import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Shield, AlertTriangle, Scale } from 'lucide-react';

export default function TermsOfService() {
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
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Terms of Service</h1>
              <p className="text-xs text-white/60">Last updated: February 11, 2026</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="prose prose-invert prose-purple max-w-none">
          {/* Introduction */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Welcome to Attune</h2>
            <p className="text-white/80 leading-relaxed">
              These Terms of Service ("Terms") govern your access to and use of Attune ("Service"),
              operated by AttuneAI ("we," "us," or "our"). By accessing or using our Service,
              you agree to be bound by these Terms.
            </p>
          </section>

          {/* Age Requirement */}
          <section className="mb-8 bg-amber-500/10 border border-amber-500/30 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-amber-400 mb-2">Age Requirement</h3>
                <p className="text-white/80">
                  You must be at least <strong>18 years of age</strong> to use this Service.
                  By using Attune, you represent and warrant that you are at least 18 years old
                  and have the legal capacity to enter into these Terms.
                </p>
              </div>
            </div>
          </section>

          {/* Service Description */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-400" />
              Service Description
            </h2>
            <p className="text-white/80 mb-4">
              Attune is an AI-powered communication coaching application designed to help users
              improve their interpersonal communication skills. The Service provides:
            </p>
            <ul className="list-disc list-inside text-white/70 space-y-2 ml-4">
              <li>AI-generated conversation guidance and suggestions</li>
              <li>Tools to manage and track personal relationships</li>
              <li>Communication insights and recommendations</li>
            </ul>
          </section>

          {/* Disclaimer */}
          <section className="mb-8 bg-red-500/10 border border-red-500/30 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-red-400 mb-3">Important Disclaimers</h3>
            <ul className="text-white/80 space-y-3">
              <li>
                <strong>Not Professional Advice:</strong> The Service does not provide professional
                therapy, counseling, medical, legal, or any other professional advice. AI-generated
                content is for informational purposes only.
              </li>
              <li>
                <strong>Not a Crisis Service:</strong> Attune is not equipped to handle mental health
                emergencies or crisis situations. If you are in crisis, please contact emergency
                services or a crisis hotline immediately.
              </li>
              <li>
                <strong>AI Limitations:</strong> Our AI may produce inaccurate, inappropriate, or
                unhelpful responses. You are solely responsible for evaluating and acting upon any
                information provided.
              </li>
            </ul>
          </section>

          {/* User Responsibilities */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">User Responsibilities</h2>
            <p className="text-white/80 mb-4">By using the Service, you agree to:</p>
            <ul className="list-disc list-inside text-white/70 space-y-2 ml-4">
              <li>Provide accurate information when creating your account</li>
              <li>Maintain the confidentiality of your account credentials</li>
              <li>Use the Service only for lawful purposes</li>
              <li>Not attempt to circumvent security measures</li>
              <li>Not use the Service to harm, harass, or abuse others</li>
              <li>Not use automated systems to access the Service without permission</li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Intellectual Property</h2>
            <p className="text-white/80">
              The Service and its original content, features, and functionality are owned by
              AttuneAI and are protected by international copyright, trademark, and other
              intellectual property laws. You retain ownership of any content you submit,
              but grant us a license to use it to provide the Service.
            </p>
          </section>

          {/* Termination */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Account Termination</h2>
            <p className="text-white/80">
              We may terminate or suspend your account immediately, without prior notice,
              for conduct that we believe violates these Terms or is harmful to other users,
              us, or third parties, or for any other reason at our discretion. You may also
              delete your account at any time through your account settings.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Scale className="w-5 h-5 text-purple-400" />
              Limitation of Liability
            </h2>
            <p className="text-white/80">
              To the maximum extent permitted by law, AttuneAI shall not be liable for any
              indirect, incidental, special, consequential, or punitive damages, or any loss
              of profits or revenues, whether incurred directly or indirectly, or any loss of
              data, use, goodwill, or other intangible losses resulting from your use of the Service.
            </p>
          </section>

          {/* Changes to Terms */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Changes to Terms</h2>
            <p className="text-white/80">
              We reserve the right to modify these Terms at any time. We will notify you of
              material changes by posting the new Terms on this page and updating the "Last
              updated" date. Your continued use of the Service after any changes constitutes
              acceptance of the new Terms.
            </p>
          </section>

          {/* Governing Law */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Governing Law</h2>
            <p className="text-white/80">
              These Terms shall be governed by and construed in accordance with the laws of
              the State of Delaware, United States, without regard to its conflict of law provisions.
            </p>
          </section>

          {/* Contact */}
          <section className="mb-8 bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Contact Us</h2>
            <p className="text-white/80">
              If you have any questions about these Terms, please contact us at:
            </p>
            <p className="text-purple-400 mt-2">legal@weattuned.com</p>
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

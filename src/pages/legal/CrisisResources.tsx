import { Link } from 'react-router-dom';
import { ArrowLeft, Phone, MessageCircle, Globe, Heart, AlertTriangle, ExternalLink } from 'lucide-react';

export default function CrisisResources() {
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
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Crisis Resources</h1>
              <p className="text-xs text-white/60">Help is available 24/7</p>
            </div>
          </div>
        </div>
      </header>

      {/* Critical Warning Banner */}
      <div className="bg-red-600 text-white py-4">
        <div className="max-w-4xl mx-auto px-4 flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 flex-shrink-0" />
          <div>
            <p className="font-semibold">If you are in immediate danger, call emergency services now.</p>
            <p className="text-sm text-red-100">In the US, dial 911. Elsewhere, dial your local emergency number.</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Important Notice */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-8 h-8 text-amber-400 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-bold text-amber-400 mb-2">Attune is Not a Crisis Service</h2>
              <p className="text-white/80 leading-relaxed">
                Attune is designed to help with everyday communication challenges. It is <strong>not</strong> equipped
                to handle mental health crises, emergencies, or situations involving harm to yourself or others.
                If you are experiencing a crisis, please reach out to the professional resources below.
              </p>
            </div>
          </div>
        </div>

        {/* US Resources */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="text-2xl">🇺🇸</span> United States
          </h2>

          <div className="grid gap-4">
            {/* 988 Suicide & Crisis Lifeline */}
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-7 h-7 text-red-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-red-400">988 Suicide & Crisis Lifeline</h3>
                  <p className="text-white/70 mt-1 mb-3">
                    Free, confidential support for people in distress, 24/7
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href="tel:988"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      Call 988
                    </a>
                    <a
                      href="sms:988"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Text 988
                    </a>
                    <a
                      href="https://988lifeline.org/chat/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-colors"
                    >
                      <Globe className="w-4 h-4" />
                      Online Chat
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Crisis Text Line */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-7 h-7 text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-blue-400">Crisis Text Line</h3>
                  <p className="text-white/70 mt-1 mb-3">
                    Free, 24/7 support via text message
                  </p>
                  <a
                    href="sms:741741&body=HOME"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Text HOME to 741741
                  </a>
                </div>
              </div>
            </div>

            {/* SAMHSA */}
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-7 h-7 text-green-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-green-400">SAMHSA National Helpline</h3>
                  <p className="text-white/70 mt-1 mb-3">
                    Treatment referral and information service for mental health and substance use disorders
                  </p>
                  <a
                    href="tel:1-800-662-4357"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    1-800-662-4357
                  </a>
                </div>
              </div>
            </div>

            {/* Veterans Crisis Line */}
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-7 h-7 text-purple-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-purple-400">Veterans Crisis Line</h3>
                  <p className="text-white/70 mt-1 mb-3">
                    Support for Veterans and their loved ones
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href="tel:988"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-lg transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      Dial 988, then Press 1
                    </a>
                    <a
                      href="sms:838255"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Text 838255
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* International Resources */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Globe className="w-6 h-6 text-blue-400" />
            International Resources
          </h2>

          <div className="grid gap-4">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">International Association for Suicide Prevention</h3>
              <p className="text-white/70 mb-4">
                Find crisis centers in your country:
              </p>
              <a
                href="https://www.iasp.info/resources/Crisis_Centres/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
              >
                <Globe className="w-4 h-4" />
                Visit IASP Crisis Centres Directory
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Befrienders Worldwide</h3>
              <p className="text-white/70 mb-4">
                Emotional support to prevent suicide worldwide:
              </p>
              <a
                href="https://www.befrienders.org/find-a-helpline"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
              >
                <Globe className="w-4 h-4" />
                Find a Helpline Near You
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Country Quick Links */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Quick Links by Country</h3>
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-white/70">
                  <span>🇬🇧</span> UK: <a href="tel:116123" className="text-blue-400 hover:underline">116 123</a> (Samaritans)
                </div>
                <div className="flex items-center gap-2 text-white/70">
                  <span>🇨🇦</span> Canada: <a href="tel:1-833-456-4566" className="text-blue-400 hover:underline">1-833-456-4566</a>
                </div>
                <div className="flex items-center gap-2 text-white/70">
                  <span>🇦🇺</span> Australia: <a href="tel:131114" className="text-blue-400 hover:underline">13 11 14</a> (Lifeline)
                </div>
                <div className="flex items-center gap-2 text-white/70">
                  <span>🇮🇳</span> India: <a href="tel:9152987821" className="text-blue-400 hover:underline">9152987821</a> (iCall)
                </div>
                <div className="flex items-center gap-2 text-white/70">
                  <span>🇩🇪</span> Germany: <a href="tel:08001110111" className="text-blue-400 hover:underline">0800 111 0 111</a>
                </div>
                <div className="flex items-center gap-2 text-white/70">
                  <span>🇫🇷</span> France: <a href="tel:0145394000" className="text-blue-400 hover:underline">01 45 39 40 00</a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Additional Resources */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-6">Additional Support</h2>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">When to Seek Professional Help</h3>
            <p className="text-white/70 mb-4">
              Consider reaching out to a mental health professional if you experience:
            </p>
            <ul className="list-disc list-inside text-white/60 space-y-2 ml-4">
              <li>Persistent feelings of sadness, anxiety, or hopelessness</li>
              <li>Difficulty managing daily activities or relationships</li>
              <li>Thoughts of self-harm or harming others</li>
              <li>Substance use issues</li>
              <li>Traumatic experiences affecting your well-being</li>
              <li>Any concern about your mental health</li>
            </ul>
            <p className="text-white/70 mt-4">
              You can find a therapist through your insurance provider, employer's EAP program,
              or directories like <a href="https://www.psychologytoday.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Psychology Today</a>.
            </p>
          </div>
        </section>

        {/* Closing */}
        <section className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6 text-center">
          <Heart className="w-10 h-10 text-pink-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">You Are Not Alone</h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Whatever you're going through, help is available. Reaching out takes courage,
            and there are people who care and want to support you.
          </p>
        </section>
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

import React from 'react';
import { motion } from 'motion/react';
import { X, Shield, Calendar, AlertCircle } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TermsModal({ isOpen, onClose }: TermsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 md:p-6">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="relative bg-imm-sidebar border border-imm-border rounded-[2rem] w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl z-10"
      >
        {/* Close Button Top Right */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 text-imm-text/60 hover:text-white rounded-full border border-imm-border/50 hover:border-imm-accent/40 transition-all z-20 cursor-pointer"
          title="Close Terms"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="p-8 pb-6 border-b border-imm-border relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute -top-12 -left-12 w-32 h-32 bg-imm-accent/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-imm-accent/10 rounded-2xl border border-imm-accent/20">
              <Shield className="w-6 h-6 text-imm-accent animate-pulse" />
            </div>
            <div>
              <h2 className="serif text-3xl font-bold tracking-wide text-white">Terms of Service</h2>
              <div className="flex items-center gap-1.5 text-imm-text/40 text-[10px] uppercase tracking-widest font-bold mt-1">
                <Calendar className="w-3.5 h-3.5 text-imm-accent/60" />
                <span>Last Updated: July 2, 2026</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body / Scrollable Content */}
        <div className="flex-1 p-8 overflow-y-auto custom-scrollbar space-y-8 text-imm-text/80 leading-relaxed font-light text-sm">
          {/* Intro Card */}
          <div className="bg-imm-card/40 border border-imm-border/40 p-6 rounded-2xl flex gap-4 items-start">
            <AlertCircle className="w-5 h-5 text-imm-accent shrink-0 mt-0.5" />
            <p className="italic text-imm-text/70 font-light">
              Welcome to <strong className="text-white not-italic font-semibold">Helium</strong>. By accessing or using Helium ("the Website," "we," "our," or "us"), you agree to be bound by these Terms of Service. If you do not agree with these Terms, please do not use the Website.
            </p>
          </div>

          {/* Section 1 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-imm-accent font-bold font-mono">01/</span>
              <h3 className="serif text-xl font-bold text-white tracking-wide">Eligibility</h3>
            </div>
            <p>
              You must comply with all applicable laws when using Helium. If you are under the age required to enter into a legally binding agreement in your jurisdiction, you should use the Website only with the permission of a parent or legal guardian.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-imm-accent font-bold font-mono">02/</span>
              <h3 className="serif text-xl font-bold text-white tracking-wide">Description of Service</h3>
            </div>
            <p>
              Helium provides users with information and access to movie-related content. Helium does not claim ownership of movies, television shows, or other copyrighted works made available by third parties.
            </p>
            <p className="border-l-2 border-imm-accent/20 pl-4 italic text-imm-text/60">
              Unless otherwise stated, Helium does not produce, create, or own the media referenced on the Website.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-imm-accent font-bold font-mono">03/</span>
              <h3 className="serif text-xl font-bold text-white tracking-wide">Third-Party Content</h3>
            </div>
            <p>
              Some content available through Helium may originate from third-party sources. We are not responsible for the availability, accuracy, legality, or content of third-party websites or services.
            </p>
            <p>
              Your interactions with third-party services are solely between you and those third parties.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-imm-accent font-bold font-mono">04/</span>
              <h3 className="serif text-xl font-bold text-white tracking-wide">Intellectual Property</h3>
            </div>
            <p>
              The Helium name, logo, website design, graphics, text, and original content created by Helium are the property of Helium unless otherwise stated.
            </p>
            <p>
              All movie titles, artwork, trademarks, logos, and other copyrighted material belong to their respective owners.
            </p>
            <p>
              Nothing in these Terms grants you ownership of any intellectual property belonging to Helium or third parties.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3 bg-imm-card/20 p-5 rounded-2xl border border-imm-border/30">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-imm-accent font-bold font-mono">05/</span>
              <h3 className="serif text-xl font-bold text-white tracking-wide">Copyright Policy</h3>
            </div>
            <p className="mb-3">
              Helium respects the intellectual property rights of others.
            </p>
            <p className="text-imm-text/70 mb-3">
              If you believe that copyrighted material is being used on the Website in a manner that infringes your rights, please contact us with:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-imm-text/70">
              <li>Your name and contact information.</li>
              <li>Identification of the copyrighted work.</li>
              <li>Identification of the allegedly infringing material.</li>
              <li>A statement that you have a good-faith belief the use is unauthorized.</li>
              <li>A statement that the information provided is accurate.</li>
            </ul>
            <p className="mt-3">
              Upon receiving a valid copyright complaint, we will investigate and take appropriate action, which may include removing or disabling access to the material.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-imm-accent font-bold font-mono">06/</span>
              <h3 className="serif text-xl font-bold text-white tracking-wide">Acceptable Use</h3>
            </div>
            <p className="mb-2">You agree not to:</p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                'Violate any applicable law.',
                'Attempt to gain unauthorized access to the Website.',
                'Interfere with the operation or security of the Website.',
                "Copy, scrape, or redistribute Helium's original content without permission.",
                'Use automated systems in a way that negatively impacts the Website.'
              ].map((item, idx) => (
                <li key={idx} className="bg-imm-card/30 border border-imm-border/40 p-3 rounded-xl flex items-start gap-2 text-xs">
                  <span className="text-imm-accent mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-imm-accent font-bold font-mono">07/</span>
              <h3 className="serif text-xl font-bold text-white tracking-wide">Disclaimer</h3>
            </div>
            <p>
              Helium is provided on an <strong className="text-white font-medium">"AS IS"</strong> and <strong className="text-white font-medium">"AS AVAILABLE"</strong> basis.
            </p>
            <p className="mb-2">We make no warranties regarding:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-imm-text/70">
              <li>Availability of the Website.</li>
              <li>Accuracy of information.</li>
              <li>Continuous or uninterrupted access.</li>
              <li>Freedom from errors or viruses.</li>
            </ul>
            <p className="italic text-imm-accent/80 font-medium">Use of the Website is at your own risk.</p>
          </section>

          {/* Section 8 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-imm-accent font-bold font-mono">08/</span>
              <h3 className="serif text-xl font-bold text-white tracking-wide">Limitation of Liability</h3>
            </div>
            <p>
              To the fullest extent permitted by law, Helium and its owners shall not be liable for any indirect, incidental, consequential, or special damages arising from your use of the Website.
            </p>
          </section>

          {/* Section 9 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-imm-accent font-bold font-mono">09/</span>
              <h3 className="serif text-xl font-bold text-white tracking-wide">Termination</h3>
            </div>
            <p>
              We reserve the right to suspend or terminate access to the Website at any time, with or without notice, for violations of these Terms or for any other lawful reason.
            </p>
          </section>

          {/* Section 10 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-imm-accent font-bold font-mono">10/</span>
              <h3 className="serif text-xl font-bold text-white tracking-wide">Changes to These Terms</h3>
            </div>
            <p>
              We may update these Terms from time to time. Continued use of the Website after changes become effective constitutes acceptance of the revised Terms.
            </p>
          </section>

          {/* Section 11 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-imm-accent font-bold font-mono">11/</span>
              <h3 className="serif text-xl font-bold text-white tracking-wide">Governing Law</h3>
            </div>
            <p>
              These Terms shall be governed by the laws applicable in the jurisdiction where Helium is operated, without regard to conflict of law principles.
            </p>
          </section>

          {/* Section 12 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-imm-accent font-bold font-mono">12/</span>
              <h3 className="serif text-xl font-bold text-white tracking-wide">Contact</h3>
            </div>
            <p>
              If you have questions regarding these Terms of Service or wish to submit a copyright notice, please contact us through the contact information provided on the Website.
            </p>
          </section>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-imm-border bg-imm-card/30 flex justify-end">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-imm-accent text-black font-bold uppercase text-[10px] tracking-[0.2em] rounded-2xl hover:brightness-110 transition-all cursor-pointer shadow-lg active:scale-95"
          >
            I Accept
          </button>
        </div>
      </motion.div>
    </div>
  );
}

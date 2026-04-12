'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import {
  KONFIGURATOR_SUBMISSION_DRAFT_KEY,
  type KonfiguratorSubmissionDraft,
} from '../app/konfigurator/submissionDraft';

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasConfiguratorDraft, setHasConfiguratorDraft] = useState(false);
  const [configuratorDraft, setConfiguratorDraft] = useState<KonfiguratorSubmissionDraft | null>(null);
  const [activeSnapshotPosition, setActiveSnapshotPosition] = useState<number | null>(null);

  useEffect(() => {
    try {
      const rawDraft = sessionStorage.getItem(KONFIGURATOR_SUBMISSION_DRAFT_KEY);
      if (!rawDraft) {
        setHasConfiguratorDraft(false);
        setConfiguratorDraft(null);
        return;
      }

      const parsedDraft = JSON.parse(rawDraft) as KonfiguratorSubmissionDraft;
      setHasConfiguratorDraft(true);
      setConfiguratorDraft(parsedDraft);
    } catch {
      setHasConfiguratorDraft(false);
      setConfiguratorDraft(null);
    }
  }, []);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveSnapshotPosition(null);
      }
    };

    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, []);

  // Erfolgs- und Fehlermeldung nach 5 Sekunden automatisch ausblenden
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(false);
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      let draft: KonfiguratorSubmissionDraft | null = null;

      try {
        const rawDraft = sessionStorage.getItem(KONFIGURATOR_SUBMISSION_DRAFT_KEY);
        if (rawDraft) {
          draft = JSON.parse(rawDraft) as KonfiguratorSubmissionDraft;
        }
      } catch {
        draft = null;
      }

      const endpoint = draft ? '/api/konfigurator/submit' : '/api/contact';
      const body = draft
        ? {
            contact: formData,
            activeWorkwearIndex: draft.activeWorkwearIndex,
            workwearStateByIndex: draft.workwearStateByIndex,
            snapshots: draft.snapshots,
            printMaterial: draft.printMaterial,
          }
        : formData;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        if (draft) {
          sessionStorage.removeItem(KONFIGURATOR_SUBMISSION_DRAFT_KEY);
          setHasConfiguratorDraft(false);
          setConfiguratorDraft(null);
          setActiveSnapshotPosition(null);
        }
        setSuccess(true);
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        const data = await res.json().catch(() => null);
        setError(data?.error || 'Beim Senden ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.');
      }
    } catch {
      setError('Verbindungsfehler. Bitte prüfen Sie Ihre Internetverbindung und versuchen Sie es erneut.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="kontakt" className="py-12 sm:py-16 md:py-24 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 sm:mb-8 md:mb-10">
          Unverbindliche <span className="text-nordwerk-orange">Anfrage</span>
        </h2>

        {hasConfiguratorDraft && (
          <div className="mb-4 rounded-lg border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-900">
            <p className="font-medium">Ihre Konfiguration wurde übernommen und wird mit dieser Anfrage gesendet.</p>
            <p className="mt-1 text-xs text-orange-900/70">
              Klicken Sie auf ein Bild, um die Großansicht zu öffnen.
            </p>

            {configuratorDraft?.snapshots?.length ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {configuratorDraft.snapshots.map((snapshot, position) => (
                  <button
                    key={`${snapshot.imageIndex}-${snapshot.imageUrl}`}
                    type="button"
                    onClick={() => setActiveSnapshotPosition(position)}
                    className="overflow-hidden rounded-xl border border-orange-200 bg-white text-left transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="flex items-center justify-center bg-orange-50 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-orange-900/70">
                      Vorschau {snapshot.imageIndex + 1}
                    </div>
                    <Image
                      src={snapshot.dataUrl}
                      alt={`Konfigurierte Vorschau ${snapshot.imageIndex + 1}`}
                      width={768}
                      height={1320}
                      unoptimized
                      className="h-40 w-full bg-white object-contain"
                    />
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-4 sm:space-y-6 bg-white p-5 sm:p-6 md:p-8 rounded-2xl shadow-xl border border-gray-400"
        >
          <input
            name="name"
            placeholder="Ihr Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-3 sm:p-3.5 border rounded-lg text-sm sm:text-base"
          />

          <input
            type="email"
            name="email"
            placeholder="Ihre E-Mail"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 sm:p-3.5 border rounded-lg text-sm sm:text-base"
          />

          <input
            name="phone"
            placeholder="Ihre Telefonnummer"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-3 sm:p-3.5 border rounded-lg text-sm sm:text-base"
          />

          <textarea
            name="message"
            placeholder="Beschreiben Sie Ihre Anfrage..."
            rows={5}
            value={formData.message}
            onChange={handleChange}
            required
            className="w-full p-3 sm:p-3.5 border rounded-lg text-sm sm:text-base resize-y"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-nordwerk-orange text-black p-3 sm:p-3.5 rounded-2xl text-base sm:text-lg font-semibold hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] transition disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? 'Wird gesendet...' : 'Anfrage senden'}
          </button>

          {success && (
            <p className="text-green-600 text-center text-sm sm:text-base">
              Ihre Anfrage wurde erfolgreich gesendet!
            </p>
          )}

          {error && (
            <p className="text-red-600 text-center text-sm sm:text-base">
              {error}
            </p>
          )}
        </form>
      </div>

      {hasConfiguratorDraft &&
      activeSnapshotPosition !== null &&
      configuratorDraft?.snapshots?.[activeSnapshotPosition] ? (
        <div
          className="fixed inset-0 flex items-start justify-center overflow-y-auto px-4 pb-4 pt-24 sm:pt-28"
          style={{ zIndex: 9999 }}
        >
          <button
            type="button"
            aria-label="Großansicht schließen"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setActiveSnapshotPosition(null)}
          />

          <div className="relative z-10 w-full max-w-5xl overflow-hidden rounded-3xl border border-white/15 bg-white shadow-2xl">
            <div className="flex items-center justify-between gap-4 border-b border-gray-200 px-4 py-3 sm:px-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                  Großansicht
                </p>
                <h3 className="text-lg font-semibold text-gray-900">
                  Vorschau {configuratorDraft.snapshots[activeSnapshotPosition].imageIndex + 1}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveSnapshotPosition(null)}
                className="rounded-full border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
              >
                Schließen
              </button>
            </div>

            <div className="bg-gray-50 p-4 sm:p-6">
              <Image
                src={configuratorDraft.snapshots[activeSnapshotPosition].dataUrl}
                alt={`Großansicht Konfigurierte Vorschau ${configuratorDraft.snapshots[activeSnapshotPosition].imageIndex + 1}`}
                width={768}
                height={1320}
                unoptimized
                className="max-h-[80vh] w-full object-contain"
              />
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
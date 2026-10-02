import { useEffect, useState } from 'react';

type ConsentChoice = 'accepted' | 'rejected' | 'unknown';

const COOKIE_NAME = 'x5med_consent';
const ONE_YEAR = 60 * 60 * 24 * 365;

function readChoice(): ConsentChoice {
  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));
  const value = match ? decodeURIComponent(match[1]) : 'unknown';
  return value === 'accepted' || value === 'rejected' ? value : 'unknown';
}

function updateConsent(choice: Exclude<ConsentChoice, 'unknown'>) {
  const trackingWindow = window as Window & {
    dataLayer?: Array<Record<string, unknown> | IArguments>;
    gtag?: (...args: unknown[]) => void;
  };
  trackingWindow.dataLayer ||= [];
  trackingWindow.gtag ||= function gtag(...args: unknown[]) {
    trackingWindow.dataLayer?.push(args as unknown as IArguments);
  };
  const value = choice === 'accepted' ? 'granted' : 'denied';
  trackingWindow.gtag('consent', 'update', {
    ad_storage: value,
    analytics_storage: value,
    ad_user_data: value,
    ad_personalization: value,
  });
  trackingWindow.dataLayer.push({ event: 'consent_update', consent_choice: choice });
}

export function ConsentBanner() {
  const [choice, setChoice] = useState<ConsentChoice>('accepted');
  useEffect(() => setChoice(readChoice()), []);
  if (choice !== 'unknown') return null;

  const choose = (nextChoice: Exclude<ConsentChoice, 'unknown'>) => {
    document.cookie = [
      `${COOKIE_NAME}=${nextChoice}`,
      'Path=/',
      `Max-Age=${ONE_YEAR}`,
      'SameSite=Lax',
      location.protocol === 'https:' ? 'Secure' : '',
    ].filter(Boolean).join('; ');
    updateConsent(nextChoice);
    setChoice(nextChoice);
  };

  return (
    <aside className="consent-banner" role="dialog" aria-label="Preferências de privacidade" aria-live="polite">
      <div>
        <strong>Privacidade e medição</strong>
        <p>
          Usamos cookies de análise e publicidade para medir a experiência e melhorar nossas campanhas. Você pode aceitar ou continuar apenas com os cookies essenciais. Consulte nossa{' '}
          <a href="https://metrics.x5med.com.br/politica-de-privacidade" target="_blank" rel="noreferrer">Política de Privacidade</a>.
        </p>
      </div>
      <div className="consent-actions">
        <button type="button" className="consent-reject" onClick={() => choose('rejected')}>Recusar</button>
        <button type="button" className="consent-accept" onClick={() => choose('accepted')}>Aceitar</button>
      </div>
    </aside>
  );
}

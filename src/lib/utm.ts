// First-touch UTM attribution — captura parâmetros da URL e persiste em sessionStorage.
// Mesmo padrão usado no EndoMax para manter consistência de tracking.

const STORAGE_KEY = 'x5med_utm';
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'ref'] as const;

export type UtmParams = Partial<Record<(typeof UTM_KEYS)[number], string>>;

export function captureUtmParams(): void {
  if (typeof window === 'undefined') return;

  const existing = sessionStorage.getItem(STORAGE_KEY);
  if (existing) return; // first-touch: não sobrescreve

  const params = new URLSearchParams(window.location.search);
  const utm: UtmParams = {};
  let hasAny = false;

  for (const key of UTM_KEYS) {
    const value = params.get(key)?.trim().toLowerCase();
    if (value) {
      utm[key] = value;
      hasAny = true;
    }
  }

  if (hasAny) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(utm));
}

export function getUtmParams(): UtmParams {
  if (typeof window === 'undefined') return {};
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as UtmParams) : {};
  } catch {
    return {};
  }
}

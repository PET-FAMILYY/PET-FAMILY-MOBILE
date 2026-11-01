import { InteracaoIARequest, InteracaoIAResponse } from '../types/api';

// Sem barra final: "//interacoes-ia" retorna 404 no FastAPI.
const IA_API_URL = (process.env.EXPO_PUBLIC_IA_API_URL ?? 'https://pet-family-ia.onrender.com').replace(/\/+$/, '');

// 502/504: servidor no Render acordando/reiniciando; 503: Gemini sobrecarregado.
const RETRYABLE_STATUS = [502, 503, 504];
const MAX_ATTEMPTS = 3;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const mensagemAmigavel = (status: number) =>
  RETRYABLE_STATUS.includes(status)
    ? 'O assistente está com muita demanda no momento. Tente novamente em instantes.'
    : 'Não foi possível consultar o assistente. Tente novamente.';

export async function criarInteracaoIA(data: InteracaoIARequest): Promise<InteracaoIAResponse> {
  let status = 0;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    let response: Response;
    try {
      response = await fetch(`${IA_API_URL}/interacoes-ia`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch {
      throw new Error('Não foi possível conectar ao assistente. Verifique sua internet.');
    }

    if (response.ok) return response.json();

    status = response.status;
    if (!RETRYABLE_STATUS.includes(status) || attempt === MAX_ATTEMPTS) {
      const corpo = await response.text().catch(() => '');
      console.warn(`[IA] POST ${IA_API_URL}/interacoes-ia -> ${status}`, corpo.slice(0, 500));
      break;
    }
    await sleep(attempt * 2000);
  }

  throw new Error(`${mensagemAmigavel(status)} (erro ${status})`);
}

export async function listInteracoesDoPet(petId: number): Promise<InteracaoIAResponse[]> {
  const response = await fetch(`${IA_API_URL}/interacoes-ia/pet/${petId}`);

  if (!response.ok) {
    return [];
  }

  return response.json();
}
import { InteracaoIARequest, InteracaoIAResponse } from '../types/api';

const IA_API_URL = 'https://pet-family-ia.onrender.com';

export async function criarInteracaoIA(
  data: InteracaoIARequest & {
    petNome?: string;
    petEspecie?: string;
    petRaca?: string | null;
    petIdade?: number | null;
    petPeso?: number | null;
    petObservacoes?: string | null;
  }
): Promise<InteracaoIAResponse> {
  const response = await fetch(`${IA_API_URL}/interacoes-ia`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const erro = await response.text();
    throw new Error(erro || 'Erro ao consultar assistente');
  }

  return response.json();
}

export async function listInteracoesDoPet(petId: number): Promise<InteracaoIAResponse[]> {
  const response = await fetch(`${IA_API_URL}/interacoes-ia/pet/${petId}`);

  if (!response.ok) {
    return [];
  }

  return response.json();
}
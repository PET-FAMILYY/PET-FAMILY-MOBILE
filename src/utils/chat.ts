import type { ChatMessage, InteracaoIARequest, InteracaoIAResponse, PetResponse } from '../types';

const timestampOf = (interacao: InteracaoIAResponse): number => {
  const time = new Date(interacao.dataHora).getTime();
  return Number.isNaN(time) ? 0 : time;
};

// Cada interacao da API vira duas bolhas (pergunta do tutor e resposta da IA), da mais antiga para a mais recente.
// A ordem e definida pela data (e pelo id, em caso de empate) e nao pela ordem em que a API devolve a lista.
export const interacoesParaMensagens = (interacoes: InteracaoIAResponse[]): ChatMessage[] =>
  [...interacoes]
    .sort((a, b) => timestampOf(a) - timestampOf(b) || a.id - b.id)
    .flatMap((i): ChatMessage[] => [
      { id: `${i.id}-q`, text: i.pergunta, sender: 'user', timestamp: new Date(i.dataHora) },
      { id: `${i.id}-a`, text: i.resposta, sender: 'ai', timestamp: new Date(i.dataHora) },
    ]);

// Envia junto da pergunta os dados do pet para o assistente personalizar a resposta.
export const montarPergunta = (pergunta: string, petId: number, pet?: PetResponse): InteracaoIARequest => ({
  pergunta,
  petId,
  petNome: pet?.nome,
  petEspecie: pet?.especie,
  petRaca: pet?.raca ?? undefined,
  petIdade: pet?.idade ?? undefined,
  petPeso: pet?.peso ?? undefined,
  petObservacoes: pet?.observacoesSaude ?? undefined,
});

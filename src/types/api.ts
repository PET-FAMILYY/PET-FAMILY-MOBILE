export type Role = 'TUTOR' | 'VETERINARIO';
export type StatusLembrete = 'PENDENTE' | 'CONCLUIDO' | 'CANCELADO';
export type StatusConsulta = 'AGENDADA' | 'REALIZADA' | 'CANCELADA';

export interface ApiErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface RegistroRequest {
  nome: string;
  email: string;
  senha: string;
  telefone?: string;
}

export interface LoginResponse {
  token: string;
  tipo: string;
  expiraEmMs: number;
  usuarioId: number;
  email: string;
  nome: string;
  role: Role;
  tutorId: number | null;
}

export interface UsuarioResponse {
  usuarioId: number;
  email: string;
  nome: string;
  role: Role;
  tutorId: number | null;
}

export interface PetRequest {
  nome: string;
  especie: string;
  raca?: string;
  idade?: number;
  peso?: number;
  observacoesSaude?: string;
}

export interface PetResponse {
  id: number;
  nome: string;
  especie: string;
  raca: string | null;
  idade: number | null;
  peso: number | null;
  observacoesSaude: string | null;
  tutorId: number;
  tutorNome: string;
  totalConsultas: number;
  totalLembretesPendentes: number;
}

export interface LembreteRequest {
  titulo: string;
  descricao?: string;
  dataLembrete: string;
  tipo: string;
  petId: number;
  recorrenciaDias?: number;
}

export interface LembreteResponse {
  id: number;
  titulo: string;
  descricao: string | null;
  dataLembrete: string;
  tipo: string;
  status: StatusLembrete;
  petId: number;
  petNome: string;
  recorrenciaDias: number | null;
  dataConclusao: string | null;
  criadoPorNome: string | null;
  concluidoPorNome: string | null;
  atrasado: boolean;
}

export interface AgendarConsultaRequest {
  petId: number;
  tipoConsulta: string;
  data: string;
  horario: string;
  observacoes?: string;
}

export interface RealizarConsultaRequest {
  observacoes: string;
}

export interface ConsultaResponse {
  id: number;
  data: string;
  horario: string;
  tipoConsulta: string;
  status: StatusConsulta;
  observacoes: string | null;
  petId: number;
  petNome: string;
  tutorId: number;
  tutorNome: string;
}

export interface TutorRequest {
  nome: string;
  email: string;
  telefone?: string;
}

export interface TutorResponse {
  id: number;
  nome: string;
  email: string;
  telefone: string | null;
  totalPets: number;
}

export interface DashboardResponse {
  totalTutores: number;
  totalPets: number;
  totalConsultas: number;
  totalLembretesPendentes: number;
  totalInteracoesIA: number;
  taxaAdesaoPreventiva: number;
}

export interface InteracaoIARequest {
  pergunta: string;
  categoria?: string;
  petId: number;
}

export interface InteracaoIAResponse {
  id: number;
  pergunta: string;
  resposta: string;
  dataHora: string;
  categoria: string | null;
  petId: number;
  petNome: string;
}

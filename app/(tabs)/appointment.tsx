import React from 'react';
import { useAuth } from '../../src/providers/AuthProvider';
import { TutorConsultas } from '../../src/components/consultas/TutorConsultas';
import { VetConsultas } from '../../src/components/consultas/VetConsultas';

// A rota apenas escolhe a visao pelo perfil; a interface fica em src/components/consultas.
export default function AppointmentScreen() {
  const { isVeterinario } = useAuth();
  return isVeterinario ? <VetConsultas /> : <TutorConsultas />;
}

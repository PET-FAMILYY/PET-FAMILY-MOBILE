import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../providers/AuthProvider';
import type { RegistroRequest } from '../types/api';

export const useLoginMutation = () => {
  const { login } = useAuth();
  return useMutation({
    mutationFn: ({ email, senha }: { email: string; senha: string }) => login(email, senha),
  });
};

export const useRegisterMutation = () => {
  const { register } = useAuth();
  return useMutation({
    mutationFn: (data: RegistroRequest) => register(data),
  });
};

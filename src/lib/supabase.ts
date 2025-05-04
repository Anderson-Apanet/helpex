import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jtlluyozfqwqzhdnpbuk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0bGx1eW96ZnF3cXpoZG5wYnVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyNzUyNDgsImV4cCI6MjA2MTg1MTI0OH0.JXoMx7t4y3eDE35mu6QjjFw7WL9AZ_2g7K0jrILUPFE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Função para armazenar o ID da empresa no localStorage
export const setEmpresaId = (empresaId: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('empresaId', empresaId);
  }
};

// Função para obter o ID da empresa do localStorage
export const getEmpresaId = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('empresaId');
  }
  return null;
};

// Função para atualizar o ID da empresa no perfil do usuário
export const updateUserEmpresaId = async (userId: string, empresaId: string) => {
  const { error } = await supabase
    .from('usuarios')
    .update({ empresa_id: empresaId })
    .eq('id', userId);
  
  if (error) {
    console.error('Erro ao atualizar empresa_id do usuário:', error);
    throw error;
  }
  
  // Atualiza também no localStorage
  setEmpresaId(empresaId);
};

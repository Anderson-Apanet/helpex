"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import Link from "next/link";
import Modal from "../../../components/Modal";

// Declare a interface para Cliente
interface Cliente {
  id: string;
  razao_social: string;
  nome_fantasia: string;
  cnpj_cpf: string;
  status: string;
}

export default function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [clienteToDelete, setClienteToDelete] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setClienteToDelete(id);
    setModalOpen(true);
  };

  const confirmDelete = async () => {
    if (clienteToDelete) {
      await supabase.from('clientes').delete().eq('id', clienteToDelete);
      setClientes(clientes.filter((c) => c.id !== clienteToDelete));
      setModalOpen(false);
      setClienteToDelete(null);
    }
  };

  const cancelDelete = () => {
    setModalOpen(false);
    setClienteToDelete(null);
  };

  useEffect(() => {
    const fetchClientes = async () => {
      setLoading(true);
      setError("");
      const { data, error } = await supabase.from("clientes").select("*");
      if (error) {
        setError("Erro ao buscar clientes");
      } else {
        setClientes(data || []);
      }
      setLoading(false);
    };
    fetchClientes();
  }, []);

  return (
    <div className="min-h-screen bg-[#181f2a] p-8 text-white font-sans">
      <div className="mb-6">
        <a href="/dashboard" className="inline-block bg-[#232526] border border-[#3b82f6] px-4 py-2 rounded-lg font-bold text-white shadow hover:bg-[#181f2a] transition-all mb-2">← Voltar para Dashboard</a>
      </div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-extrabold tracking-wide text-[#3b82f6] drop-shadow-lg">Clientes</h2>
        <Link href="/dashboard/clientes/novo">
          <button className="bg-[#232526] border border-[#3b82f6] text-[#3b82f6] px-6 py-2 rounded-lg font-bold text-lg shadow-lg hover:bg-[#181f2a] hover:text-white transition-all duration-200">
            + Novo Cliente
          </button>
        </Link>
      </div>
      {loading && <div className="text-[#b5ffe1] animate-pulse">Carregando...</div>}
      {!loading && error && (
        <div className="text-[#f58a42] bg-[#1a1a1a] rounded p-3 mb-4 border-l-4 border-[#f58a42] shadow-md animate-fade-in">
          {error}
        </div>
      )}
      {!loading && !error && clientes.length === 0 && (
        <div className="text-[#b5ffe1] text-lg italic bg-[#232526] p-6 rounded-lg border border-[#3b82f6] shadow-md animate-fade-in">
          Nenhum cliente cadastrado ainda. Clique em <span className="font-bold text-[#3b82f6]">+ Novo Cliente</span> para começar!
        </div>
      )}
      {!loading && !error && clientes.length > 0 && (
        <div className="overflow-x-auto animate-fade-in">
          <table className="min-w-full bg-[#181f2a] rounded-lg shadow-lg border-separate border-spacing-0">
            <thead>
              <tr className="bg-[#232526] text-[#3b82f6]">
                <th className="p-3 text-left font-bold">Razão Social</th>
                <th className="p-3 text-left font-bold">Nome Fantasia</th>
                <th className="p-3 text-left font-bold">CNPJ/CPF</th>
                <th className="p-3 text-left font-bold">Status</th>
                <th className="p-3 text-left font-bold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente) => (
                <tr key={cliente.id} className="hover:bg-[#232526] transition-all duration-150 border-b border-[#2c5364]">
                  <td className="p-3 border-b border-[#232526] font-semibold text-white">{cliente.razao_social}</td>
                  <td className="p-3 border-b border-[#232526] text-[#b5ffe1]">{cliente.nome_fantasia}</td>
                  <td className="p-3 border-b border-[#232526] text-[#b5ffe1]">{cliente.cnpj_cpf}</td>
                  <td className="p-3 border-b border-[#232526] text-[#3b82f6]">{cliente.status}</td>
                  <td className="p-3 border-b border-[#232526] flex gap-2">
                    <Link href={`/dashboard/clientes/${cliente.id}`}>
                      <button className="bg-[#232526] border border-[#3b82f6] text-[#3b82f6] px-3 py-1 rounded-lg font-bold hover:bg-[#181f2a] hover:text-white transition-all">Editar</button>
                    </Link>
                    <button onClick={() => handleDeleteClick(cliente.id)} className="bg-[#232526] border border-[#f58a42] text-[#f58a42] px-3 py-1 rounded-lg font-bold hover:bg-[#181f2a] hover:text-white transition-all">Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Modal isOpen={modalOpen} onClose={cancelDelete}>
        <div className="text-center p-4">
          <h3 className="text-xl font-bold mb-4 text-[#2563eb]">Confirmação de Exclusão</h3>
          <p className="mb-4">Tem certeza que deseja excluir este cliente? Esta ação não poderá ser desfeita.</p>
          <div className="flex justify-center gap-6">
            <button onClick={confirmDelete} className="bg-[#3b82f6] text-white px-5 py-2 rounded-lg font-bold shadow hover:bg-[#60a5fa] transition">Sim, Excluir</button>
            <button onClick={cancelDelete} className="bg-[#232526] border border-[#3b82f6] text-[#3b82f6] px-5 py-2 rounded-lg font-bold shadow hover:bg-[#181f2a] hover:text-white transition">Cancelar</button>
          </div>
        </div>
      </Modal>
      <style jsx global>{`
        .animate-fade-in { animation: fadeIn 0.7s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
      `}</style>
    </div>
  );
}

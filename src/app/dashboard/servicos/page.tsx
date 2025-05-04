"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import Link from "next/link";
import Modal from "../../../components/Modal";

// Importe ou declare interfaces para Serviço conforme necessário
interface Servico {
  id: number;
  cliente: {
    razao_social: string;
  };
  produto: {
    nome: string;
  };
  plano: string;
  status: string;
}

export default function Servicos() {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [servicoToDelete, setServicoToDelete] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    const fetchServicos = async () => {
      setLoading(true);
      setError("");
      const { data, error } = await supabase.from("servicos_contratados").select("*, cliente:cliente_id(razao_social), produto:produto_id(nome)");
      if (error) {
        setError("Erro ao buscar serviços");
      } else {
        setServicos(data || []);
      }
      setLoading(false);
    };
    fetchServicos();
  }, []);

  const handleDeleteClick = (id: number) => {
    setServicoToDelete(id);
    setModalOpen(true);
  };

  const confirmDelete = async () => {
    if (servicoToDelete == null) return;
    setDeleteLoading(true);
    setDeleteError("");
    const { error } = await supabase.from("servicos").delete().eq("id", servicoToDelete);
    if (error) setDeleteError("Erro ao excluir serviço.");
    else {
      setServicos(servicos.filter((s) => s.id !== servicoToDelete));
      setModalOpen(false);
      setServicoToDelete(null);
    }
    setDeleteLoading(false);
  };
  const cancelDelete = () => {
    setModalOpen(false);
    setServicoToDelete(null);
    setDeleteError("");
  };

  return (
    <div className="min-h-screen bg-[#181f2a] p-8 text-white font-sans">
      <div className="mb-6">
        <a href="/dashboard" className="inline-block bg-[#232526] border border-[#3b82f6] text-[#3b82f6] px-4 py-2 rounded-lg font-bold text-white shadow hover:bg-[#181f2a] hover:text-white transition-all mb-2">← Voltar para Dashboard</a>
      </div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-extrabold tracking-wide text-[#3b82f6] drop-shadow-lg">Serviços</h2>
        <Link href="/dashboard/servicos/novo">
          <button className="bg-[#232526] border border-[#3b82f6] text-[#3b82f6] px-6 py-2 rounded-lg font-bold text-lg shadow-lg hover:bg-[#181f2a] hover:text-white transition-all duration-200">
            + Novo Serviço
          </button>
        </Link>
      </div>
      {loading && <div className="text-[#b5ffe1] animate-pulse">Carregando...</div>}
      {!loading && error && (
        <div className="text-[#f58a42] bg-[#1a1a1a] rounded p-3 mb-4 border-l-4 border-[#f58a42] shadow-md animate-fade-in">
          {error}
        </div>
      )}
      {!loading && !error && servicos.length === 0 && (
        <div className="text-[#b5ffe1] text-lg italic bg-[#232526] p-6 rounded-lg border border-[#232526] shadow-md animate-fade-in">
          Nenhum serviço cadastrado ainda. Clique em <span className="font-bold text-[#3b82f6]">+ Novo Serviço</span> para começar!
        </div>
      )}
      {!loading && !error && servicos.length > 0 && (
        <div className="overflow-x-auto animate-fade-in">
          <table className="min-w-full bg-[#181f2a] rounded-lg shadow-lg border-separate border-spacing-0">
            <thead>
              <tr className="bg-[#232526] text-[#3b82f6]">
                <th className="p-3 text-left font-bold">Cliente</th>
                <th className="p-3 text-left font-bold">Produto</th>
                <th className="p-3 text-left font-bold">Plano</th>
                <th className="p-3 text-left font-bold">Status</th>
                <th className="p-3 text-left font-bold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {servicos.map((servico) => (
                <tr key={servico.id} className="hover:bg-[#232526] transition-all duration-150 border-b border-[#232526]">
                  <td className="p-3 border-b border-[#232526] font-semibold text-white">{servico.cliente?.razao_social || "-"}</td>
                  <td className="p-3 border-b border-[#232526] text-[#b5ffe1]">{servico.produto?.nome || "-"}</td>
                  <td className="p-3 border-b border-[#232526] text-[#b5ffe1]">{servico.plano}</td>
                  <td className="p-3 border-b border-[#232526] text-[#3b82f6]">{servico.status}</td>
                  <td className="p-3 border-b border-[#232526] flex gap-2">
                    <Link href={`/dashboard/servicos/${servico.id}`}>
                      <button className="bg-[#232526] border border-[#2563eb] text-[#2563eb] px-3 py-1 rounded-lg font-bold hover:bg-[#181f2a] hover:text-white transition-all">Editar</button>
                    </Link>
                    <button onClick={() => handleDeleteClick(servico.id)} className="bg-[#232526] border border-[#f58a42] text-[#f58a42] px-3 py-1 rounded-lg font-bold hover:bg-[#181f2a] hover:text-white transition-all">Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Modal isOpen={modalOpen} onClose={cancelDelete}>
        <div className="text-center p-4">
          <h3 className="text-xl font-bold mb-4 text-[#3b82f6]">Confirmação de Exclusão</h3>
          <p className="mb-4">Tem certeza que deseja excluir este serviço? Esta ação não poderá ser desfeita.</p>
          {deleteError && <div className="text-[#f58a42] mb-2">{deleteError}</div>}
          <div className="flex justify-center gap-6">
            <button onClick={confirmDelete} disabled={deleteLoading} className="bg-[#3b82f6] text-white px-5 py-2 rounded-lg font-bold shadow hover:bg-[#60a5fa] transition">
              {deleteLoading ? "Excluindo..." : "Sim, Excluir"}
            </button>
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

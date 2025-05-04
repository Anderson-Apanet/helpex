"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import DashboardHeader from "../page";
import Link from "next/link";

// Importe ou declare interfaces para Credencial conforme necessário
interface Credencial {
  id: number;
  servico: {
    cliente: {
      razao_social: string;
    };
    plano: string;
  };
  usuario: string;
  status: string;
}

export default function Credenciais() {
  const [credenciais, setCredenciais] = useState<Credencial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCredenciais = async () => {
      setLoading(true);
      setError("");
      const { data, error } = await supabase.from("credenciais").select("*, servico:servico_contratado_id(plano, cliente:cliente_id(razao_social))");
      if (error) {
        setError("Erro ao buscar credenciais");
      } else {
        setCredenciais(data || []);
      }
      setLoading(false);
    };
    fetchCredenciais();
  }, []);

  return (
    <div className="bg-[#181f2a]">
      <DashboardHeader />
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-extrabold tracking-wide text-[#3b82f6]">Credenciais</h2>
        <Link href="/dashboard/credenciais/novo">
          <button className="bg-[#232526] border border-[#3b82f6] text-[#3b82f6] px-6 py-2 rounded-lg font-bold text-lg hover:bg-[#181f2a] hover:text-white transition-all duration-200">
            + Nova Credencial
          </button>
        </Link>
      </div>
      {loading && <div>Carregando...</div>}
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {!loading && credenciais.length === 0 && <div>Nenhuma credencial cadastrada.</div>}
      <table className="min-w-full rounded-lg shadow-lg border-separate border-spacing-0 border border-[#3b82f6]">
        <thead>
          <tr className="bg-[#232526] text-[#3b82f6]">
            <th className="p-3 text-left font-bold">Cliente</th>
            <th className="p-3 text-left font-bold">Plano Serviço</th>
            <th className="p-3 text-left font-bold">Usuário</th>
            <th className="p-3 text-left font-bold">Status</th>
          </tr>
        </thead>
        <tbody>
          {credenciais.map((cred) => (
            <tr key={cred.id} className="hover:bg-[#232526] transition-all duration-150 border-b border-[#232526]">
              <td className="p-3 border-b border-[#232526] font-semibold text-white">{cred.servico?.cliente?.razao_social || "-"}</td>
              <td className="p-3 border-b border-[#232526] text-[#60a5fa]">{cred.servico?.plano || "-"}</td>
              <td className="p-3 border-b border-[#232526] text-[#60a5fa]">{cred.usuario}</td>
              <td className="p-3 border-b border-[#232526] text-[#3b82f6]">{cred.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../../lib/supabase";

export default function NovoServico() {
  const [clientes, setClientes] = useState<any[]>([]);
  const [produtos, setProdutos] = useState<any[]>([]);
  const [form, setForm] = useState({
    cliente_id: "",
    produto_id: "",
    plano: "",
    valor_mensal: "",
    status: "ATIVO",
    data_vencimento: "",
    periodo_faturamento: "MENSAL",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchClientesProdutos = async () => {
      const { data: clientesData } = await supabase.from("clientes").select("id, razao_social");
      const { data: produtosData } = await supabase.from("produtos").select("id, nome");
      setClientes(clientesData || []);
      setProdutos(produtosData || []);
    };
    fetchClientesProdutos();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.from("servicos_contratados").insert([
      {
        cliente_id: form.cliente_id,
        produto_id: form.produto_id,
        plano: form.plano,
        valor_mensal: parseFloat(form.valor_mensal.replace(",", ".")),
        status: form.status,
        data_vencimento: form.data_vencimento ? new Date(form.data_vencimento).toISOString() : null,
        periodo_faturamento: form.periodo_faturamento,
      }
    ]);
    if (error) {
      setError("Erro ao cadastrar serviço: " + error.message);
    } else {
      router.push("/dashboard/servicos");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f2027] via-[#232526] to-[#2c5364] text-white flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-xl bg-[#181f2a] rounded-xl shadow-2xl p-8 border border-[#4f6df5] neon-blue animate-fade-in">
        <h2 className="text-3xl font-extrabold tracking-wide neon-blue mb-6 text-center">Novo Serviço Contratado</h2>
        <form onSubmit={handleSubmit}>
          <label className="block mb-4">
            <span className="font-semibold neon-blue">Cliente*</span>
            <select name="cliente_id" value={form.cliente_id} onChange={handleChange} required className="w-full border-none bg-[#232526] text-white p-3 rounded-lg mt-1 focus:ring-2 focus:ring-blue-400 outline-none">
              <option value="">Selecione...</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>{c.razao_social}</option>
              ))}
            </select>
          </label>
          <label className="block mb-4">
            <span className="font-semibold neon-blue">Produto*</span>
            <select name="produto_id" value={form.produto_id} onChange={handleChange} required className="w-full border-none bg-[#232526] text-white p-3 rounded-lg mt-1 focus:ring-2 focus:ring-blue-400 outline-none">
              <option value="">Selecione...</option>
              {produtos.map((p) => (
                <option key={p.id} value={p.id}>{p.nome}</option>
              ))}
            </select>
          </label>
          <label className="block mb-4">
            <span className="font-semibold neon-blue">Plano*</span>
            <input name="plano" value={form.plano} onChange={handleChange} required className="w-full border-none bg-[#232526] text-white p-3 rounded-lg mt-1 focus:ring-2 focus:ring-blue-400 outline-none" />
          </label>
          <label className="block mb-4">
            <span className="font-semibold neon-blue">Valor Mensal (R$)*</span>
            <input name="valor_mensal" value={form.valor_mensal} onChange={handleChange} required type="number" step="0.01" min="0" className="w-full border-none bg-[#232526] text-white p-3 rounded-lg mt-1 focus:ring-2 focus:ring-blue-400 outline-none" />
          </label>
          <label className="block mb-4">
            <span className="font-semibold neon-blue">Data de Vencimento</span>
            <input name="data_vencimento" value={form.data_vencimento} onChange={handleChange} type="date" className="w-full border-none bg-[#232526] text-white p-3 rounded-lg mt-1 focus:ring-2 focus:ring-blue-400 outline-none" />
          </label>
          <label className="block mb-4">
            <span className="font-semibold neon-blue">Período de Faturamento*</span>
            <select name="periodo_faturamento" value={form.periodo_faturamento} onChange={handleChange} required className="w-full border-none bg-[#232526] text-white p-3 rounded-lg mt-1 focus:ring-2 focus:ring-blue-400 outline-none">
              <option value="MENSAL">Mensal</option>
              <option value="TRIMESTRAL">Trimestral</option>
              <option value="SEMESTRAL">Semestral</option>
              <option value="ANUAL">Anual</option>
            </select>
          </label>
          <label className="block mb-4">
            <span className="font-semibold neon-blue">Status*</span>
            <select name="status" value={form.status} onChange={handleChange} required className="w-full border-none bg-[#232526] text-white p-3 rounded-lg mt-1 focus:ring-2 focus:ring-blue-400 outline-none">
              <option value="ATIVO">Ativo</option>
              <option value="SUSPENSO">Suspenso</option>
              <option value="CANCELADO">Cancelado</option>
              <option value="TRIAL">Trial</option>
              <option value="INADIMPLENTE">Inadimplente</option>
            </select>
          </label>
          {error && <div className="text-red-400 bg-[#1a1a1a] rounded p-3 mb-4 border-l-4 border-red-600 shadow-md animate-fade-in text-center">{error}</div>}
          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-500 via-cyan-400 to-green-400 shadow-lg neon-blue text-black px-6 py-3 rounded-lg font-bold text-lg transition-all duration-200 hover:scale-105 hover:from-orange-400 hover:to-pink-500 hover:text-white border-none mt-4">
            {loading ? "Salvando..." : "Salvar Serviço"}
          </button>
        </form>
      </div>
      <style jsx global>{`
        .neon-blue { text-shadow: 0 0 8px #4f6df5, 0 0 12px #42b883; }
        .animate-fade-in { animation: fadeIn 0.7s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
      `}</style>
    </div>
  );
}

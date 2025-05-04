"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../../lib/supabase";

export default function NovoCliente() {
  const [form, setForm] = useState({
    razao_social: "",
    nome_fantasia: "",
    cnpj_cpf: "",
    tipo_pessoa: "",
    segmento: "",
    origem_cliente: "",
    observacoes: "",
    tags: "",
    status: ""
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const { tags, ...rest } = form;
    const tagsArr = tags.split(",").map((t) => t.trim()).filter(Boolean);
    const { error } = await supabase.from("clientes").insert([{ ...rest, tags: tagsArr, status: "ATIVO" }]);
    if (error) {
      setError("Erro ao cadastrar cliente: " + error.message);
    } else {
      router.push("/dashboard/clientes");
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f2027] via-[#2c5364] to-[#232526] p-8 text-white font-sans flex flex-col items-center justify-center">
      <div className="w-full max-w-xl bg-[#181f2a] rounded-xl shadow-2xl p-8 border border-[#4f6df5] animate-fade-in">
        <h2 className="text-3xl font-extrabold tracking-wide neon-blue mb-6 text-center">Novo Cliente</h2>
        <form onSubmit={handleSubmit}>
          <label className="block mb-4">
            <span className="font-semibold neon-blue">Razão Social*</span>
            <input name="razao_social" value={form.razao_social || ""} onChange={handleChange} required className="w-full border-none bg-[#232526] text-white p-3 rounded-lg mt-1 focus:ring-2 focus:ring-blue-400 outline-none" />
          </label>
          <label className="block mb-4">
            <span className="font-semibold neon-blue">Nome Fantasia</span>
            <input name="nome_fantasia" value={form.nome_fantasia || ""} onChange={handleChange} className="w-full border-none bg-[#232526] text-white p-3 rounded-lg mt-1 focus:ring-2 focus:ring-blue-400 outline-none" />
          </label>
          <label className="block mb-4">
            <span className="font-semibold neon-blue">CNPJ/CPF*</span>
            <input name="cnpj_cpf" value={form.cnpj_cpf || ""} onChange={handleChange} required className="w-full border-none bg-[#232526] text-white p-3 rounded-lg mt-1 focus:ring-2 focus:ring-blue-400 outline-none" />
          </label>
          <label className="block mb-4">
            <span className="font-semibold neon-blue">Tipo Pessoa*</span>
            <select name="tipo_pessoa" value={form.tipo_pessoa || ""} onChange={handleChange} required className="w-full border-none bg-[#232526] text-white p-3 rounded-lg mt-1 focus:ring-2 focus:ring-blue-400 outline-none">
              <option value="PJ">PJ</option>
              <option value="PF">PF</option>
            </select>
          </label>
          <label className="block mb-4">
            <span className="font-semibold neon-blue">Segmento</span>
            <input name="segmento" value={form.segmento || ""} onChange={handleChange} className="w-full border-none bg-[#232526] text-white p-3 rounded-lg mt-1 focus:ring-2 focus:ring-blue-400 outline-none" />
          </label>
          <label className="block mb-4">
            <span className="font-semibold neon-blue">Origem Cliente</span>
            <input name="origem_cliente" value={form.origem_cliente || ""} onChange={handleChange} className="w-full border-none bg-[#232526] text-white p-3 rounded-lg mt-1 focus:ring-2 focus:ring-blue-400 outline-none" />
          </label>
          <label className="block mb-4">
            <span className="font-semibold neon-blue">Observações</span>
            <textarea name="observacoes" value={form.observacoes || ""} onChange={handleChange} className="w-full border-none bg-[#232526] text-white p-3 rounded-lg mt-1 focus:ring-2 focus:ring-blue-400 outline-none" />
          </label>
          <label className="block mb-4">
            <span className="font-semibold neon-blue">Tags</span>
            <input name="tags" value={form.tags || ""} onChange={handleChange} className="w-full border-none bg-[#232526] text-white p-3 rounded-lg mt-1 focus:ring-2 focus:ring-blue-400 outline-none" placeholder="Separadas por vírgula" />
          </label>
          <label className="block mb-4">
            <span className="font-semibold neon-blue">Status*</span>
            <select name="status" value={form.status || ""} onChange={handleChange} required className="w-full border-none bg-[#232526] text-white p-3 rounded-lg mt-1 focus:ring-2 focus:ring-blue-400 outline-none">
              <option value="ATIVO">Ativo</option>
              <option value="INATIVO">Inativo</option>
              <option value="SUSPENSO">Suspenso</option>
              <option value="CANCELADO">Cancelado</option>
            </select>
          </label>
          {error && <div className="text-red-400 bg-[#1a1a1a] rounded p-3 mb-4 border-l-4 border-red-600 shadow-md animate-fade-in text-center">{error}</div>}
          <button type="submit" disabled={saving} className="w-full bg-[#1e2d24] text-white px-6 py-3 rounded-lg font-bold text-lg shadow hover:bg-[#16351c] transition-all duration-200 mt-4">
            {saving ? "Salvando..." : "Salvar Cliente"}
          </button>
          <button type="button" onClick={() => router.push('/dashboard/clientes')} className="w-full mt-3 bg-[#232526] border border-[#42b883] text-[#42b883] px-4 py-2 rounded-lg font-bold shadow hover:bg-[#181f2a] hover:text-white transition-all">Cancelar</button>
        </form>
      </div>
      <style jsx global>{`
        .neon-blue { text-shadow: 0 0 8px #42a5f5, 0 0 14px #00bfff; color: #42a5f5; }
        .animate-fade-in { animation: fadeIn 0.7s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
      `}</style>
    </div>
  );
}

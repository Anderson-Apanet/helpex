"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../../lib/supabase";

export default function NovoProduto() {
  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    preco: "",
    status: "ATIVO",
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
    const { error } = await supabase.from("produtos").insert([
      {
        nome: form.nome,
        descricao: form.descricao,
        preco: parseFloat(form.preco.replace(",", ".")),
        status: form.status,
      },
    ]);
    if (error) {
      setError("Erro ao cadastrar produto: " + error.message);
    } else {
      router.push("/dashboard/produtos");
    }
    setSaving(false);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Novo Produto</h1>
      {error && <div className="text-red-400 bg-[#1a1a1a] rounded p-3 mb-4 border-l-4 border-red-600 shadow-md animate-fade-in text-center">{error}</div>}
      <form onSubmit={handleSubmit} className="bg-[#181f2a] rounded-xl shadow-lg p-6">
        <label className="block mb-4">
          <span className="font-semibold">Nome*</span>
          <input name="nome" value={form.nome} onChange={handleChange} required className="w-full border-none bg-[#232526] text-white p-3 rounded-lg mt-1 focus:ring-2 focus:ring-blue-400 outline-none" />
        </label>
        <label className="block mb-4">
          <span className="font-semibold">Descrição</span>
          <textarea name="descricao" value={form.descricao} onChange={handleChange} className="w-full border-none bg-[#232526] text-white p-3 rounded-lg mt-1 focus:ring-2 focus:ring-blue-400 outline-none" />
        </label>
        <label className="block mb-4">
          <span className="font-semibold">Preço*</span>
          <input name="preco" value={form.preco} onChange={handleChange} required type="number" step="0.01" min="0" className="w-full border-none bg-[#232526] text-white p-3 rounded-lg mt-1 focus:ring-2 focus:ring-blue-400 outline-none" />
        </label>
        <label className="block mb-4">
          <span className="font-semibold">Status*</span>
          <select name="status" value={form.status} onChange={handleChange} required className="w-full border-none bg-[#232526] text-white p-3 rounded-lg mt-1 focus:ring-2 focus:ring-blue-400 outline-none">
            <option value="ATIVO">Ativo</option>
            <option value="INATIVO">Inativo</option>
            <option value="SUSPENSO">Suspenso</option>
            <option value="CANCELADO">Cancelado</option>
          </select>
        </label>
        <div className="flex justify-end gap-4 mt-6">
          <button type="button" onClick={() => router.push("/dashboard/produtos")} className="bg-[#232526] border border-[#2563eb] text-[#2563eb] px-4 py-2 rounded-lg font-bold hover:bg-[#181f2a] hover:text-white transition-all">Cancelar</button>
          <button type="submit" disabled={saving} className="bg-[#2563eb] text-white px-4 py-2 rounded-lg font-bold hover:bg-[#1d4ed8] transition-all disabled:opacity-60">
            {saving ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </form>
    </div>
  );
}

"use client";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";

export default function EditarServico() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [form, setForm] = useState({
    cliente_id: "",
    produto_id: "",
    plano: "",
    status: "ATIVO",
  });
  // Tipagem explícita para evitar erro de TS
  type Cliente = { id: string; razao_social: string };
  type Produto = { id: string; nome: string };
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError("");
      // Busca clientes e produtos
      const [{ data: clientesData }, { data: produtosData }] = await Promise.all([
        supabase.from("clientes").select("id, razao_social"),
        supabase.from("produtos").select("id, nome")
      ]);
      setClientes(clientesData || []);
      setProdutos(produtosData || []);

      // Busca serviço contratado
      const { data, error } = await supabase
        .from("servicos_contratados")
        .select("*, produto:produto_id(nome), cliente:cliente_id(razao_social)")
        .eq("id", id)
        .single();
      if (error || !data) {
        setError("Serviço contratado não encontrado ou erro ao carregar serviço.");
        setForm({
          cliente_id: "",
          produto_id: "",
          plano: "",
          status: "ATIVO",
        });
      } else {
        setForm({
          cliente_id: data.cliente_id || "",
          produto_id: data.produto_id || "",
          plano: data.plano || "",
          status: data.status || "ATIVO",
        });
      }
      setLoading(false);
    }
    if (id) fetchData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    const { error } = await supabase
      .from("servicos_contratados")
      .update({
        cliente_id: form.cliente_id,
        produto_id: form.produto_id,
        plano: form.plano,
        status: form.status,
      })
      .eq("id", id);
    if (error) setError("Erro ao salvar alterações");
    else {
      setSuccess("Serviço atualizado com sucesso!");
      setTimeout(() => router.push("/dashboard/servicos"), 1200);
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-[#181f2a] flex items-center justify-center p-8">
      <div className="w-full max-w-xl bg-[#181f2a] rounded-xl shadow-2xl p-8 border border-[#2563eb]">
        <h2 className="text-3xl font-extrabold tracking-wide text-[#2563eb] mb-6 text-center">Editar Serviço</h2>
        {loading ? (
          <div className="text-[#b5ffe1] animate-pulse text-center">Carregando...</div>
        ) : error ? (
          <div className="text-[#f58a42] bg-[#1a1a1a] rounded p-3 mb-4 border-l-4 border-[#f58a42] shadow-md animate-fade-in text-center">{error}</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label className="block mb-4">
              <span className="font-semibold text-[#2563eb]">Cliente*</span>
              <select name="cliente_id" value={form.cliente_id} onChange={handleChange} required className="w-full border-none bg-[#232526] text-white p-3 rounded-lg mt-1 focus:ring-2 focus:ring-blue-400 outline-none">
                <option value="">Selecione o cliente</option>
                {clientes.map((c: Cliente) => (
                  <option key={c.id} value={c.id}>{c.razao_social}</option>
                ))}
              </select>
            </label>
            <label className="block mb-4">
              <span className="font-semibold text-[#2563eb]">Produto*</span>
              <select name="produto_id" value={form.produto_id} onChange={handleChange} required className="w-full border-none bg-[#232526] text-white p-3 rounded-lg mt-1 focus:ring-2 focus:ring-blue-400 outline-none">
                <option value="">Selecione o produto</option>
                {produtos.map((p: Produto) => (
                  <option key={p.id} value={p.id}>{p.nome}</option>
                ))}
              </select>
            </label>
            <label className="block mb-4">
              <span className="font-semibold text-[#2563eb]">Plano</span>
              <input name="plano" value={form.plano} onChange={handleChange} className="w-full border-none bg-[#232526] text-white p-3 rounded-lg mt-1 focus:ring-2 focus:ring-blue-400 outline-none" />
            </label>
            <label className="block mb-4">
              <span className="font-semibold text-[#2563eb]">Status*</span>
              <select name="status" value={form.status} onChange={handleChange} required className="w-full border-none bg-[#232526] text-white p-3 rounded-lg mt-1 focus:ring-2 focus:ring-blue-400 outline-none">
                <option value="ATIVO">Ativo</option>
                <option value="INATIVO">Inativo</option>
                <option value="SUSPENSO">Suspenso</option>
                <option value="CANCELADO">Cancelado</option>
              </select>
            </label>
            {success && <div className="text-[#2563eb] bg-[#1a1a1a] rounded p-3 mb-4 border-l-4 border-[#2563eb] shadow-md animate-fade-in text-center">{success}</div>}
            <button type="submit" disabled={saving} className="w-full bg-[#1e2d24] text-white px-6 py-3 rounded-lg font-bold text-lg shadow hover:bg-[#16351c] transition-all duration-200 mt-4">
              {saving ? "Salvando..." : "Salvar Alterações"}
            </button>
            <button type="button" onClick={() => router.push('/dashboard/servicos')} className="w-full mt-3 bg-[#232526] border border-[#2563eb] text-[#2563eb] px-4 py-2 rounded-lg font-bold shadow hover:bg-[#181f2a] hover:text-white transition-all">Cancelar</button>
          </form>
        )}
      </div>
    </div>
  );
}

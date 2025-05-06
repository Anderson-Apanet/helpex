"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import Link from "next/link";

interface Produto {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  status: string;
}

export default function Produtos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [produtoToDelete, setProdutoToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchProdutos = async () => {
      setLoading(true);
      setError("");
      const { data, error } = await supabase.from("produtos").select("*");
      if (error) {
        setError("Erro ao buscar produtos");
      } else {
        setProdutos(data || []);
      }
      setLoading(false);
    };
    fetchProdutos();
  }, []);

  const handleDeleteClick = (id: string) => {
    setProdutoToDelete(id);
    setModalOpen(true);
  };

  const confirmDelete = async () => {
    if (produtoToDelete) {
      await supabase.from('produtos').delete().eq('id', produtoToDelete);
      setProdutos(produtos.filter((p) => p.id !== produtoToDelete));
      setModalOpen(false);
      setProdutoToDelete(null);
    }
  };

  const cancelDelete = () => {
    setModalOpen(false);
    setProdutoToDelete(null);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans">
      <header className="bg-[var(--background)] border-b border-[var(--primary)] p-6 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-[var(--primary)]">Produtos</h1>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard/produtos/novo" className="bg-[var(--primary-dark)] text-[var(--primary-light)] px-4 py-2 rounded-lg font-semibold border border-[var(--primary)] hover:bg-[var(--background)] hover:text-[var(--foreground)] transition-all">
            Novo Produto
          </Link>
        </div>
      </header>
      <main className="max-w-5xl mx-auto p-8">
        {error && <div className="text-red-400 bg-[var(--primary-dark)] rounded p-3 mb-4 border-l-4 border-red-600 shadow text-center">{error}</div>}
        <div className="bg-[var(--primary-dark)] rounded-xl shadow-lg p-4">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="p-3 text-[var(--primary-light)]">Nome</th>
                <th className="p-3 text-[var(--primary-light)]">Descrição</th>
                <th className="p-3 text-[var(--primary-light)]">Preço</th>
                <th className="p-3 text-[var(--primary-light)]">Status</th>
                <th className="p-3 text-right text-[var(--primary-light)]">Ações</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map((produto) => (
                <tr key={produto.id} className="border-b border-[var(--background)]">
                  <td className="p-3 font-semibold text-[var(--foreground)]">{produto.nome}</td>
                  <td className="p-3 text-[var(--primary-light)]">{produto.descricao}</td>
                  <td className="p-3 text-[var(--primary-light)]">R$ {produto.preco?.toFixed(2)}</td>
                  <td className="p-3 text-[var(--primary)]">{produto.status}</td>
                  <td className="p-3 text-right">
                    <Link href={`/dashboard/produtos/${produto.id}`}>
                      <button className="bg-[var(--primary-dark)] border border-[var(--primary)] text-[var(--primary-light)] px-3 py-1 rounded-lg font-bold hover:bg-[var(--background)] hover:text-[var(--foreground)] transition-all">Editar</button>
                    </Link>
                    <button onClick={() => handleDeleteClick(produto.id)} className="ml-2 bg-[var(--primary-dark)] border border-[#f58a42] text-[#f58a42] px-3 py-1 rounded-lg font-bold hover:bg-[var(--background)] hover:text-[var(--foreground)] transition-all">Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Modal de confirmação de exclusão */}
        {modalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-[var(--primary-dark)] rounded-lg p-8 shadow-xl text-center">
              <h3 className="text-xl font-bold mb-4 text-[var(--primary)]">Confirmação de Exclusão</h3>
              <p className="mb-4">Tem certeza que deseja excluir este produto? Esta ação não poderá ser desfeita.</p>
              <div className="flex justify-center gap-4">
                <button onClick={confirmDelete} className="bg-[#f58a42] text-white px-4 py-2 rounded-lg font-bold hover:bg-[#ffb366] transition-all">Excluir</button>
                <button onClick={cancelDelete} className="bg-[var(--primary)] text-white px-4 py-2 rounded-lg font-bold hover:bg-[var(--primary-dark)] transition-all">Cancelar</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

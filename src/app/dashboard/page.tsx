"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
      } else {
        router.push("/login");
      }
      setLoading(false);
    };
    getUser();
  }, [router]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-[#181f2a] text-white font-sans">
      <header className="bg-[#181f2a] border-b border-[#3b82f6] p-6 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-4">
          <img src="https://dieycvogftvfoncigvtl.supabase.co/storage/v1/object/public/imagens//HELPEX%20BRANCO.png" alt="HELPEX Logo" className="h-10 w-auto drop-shadow-lg" />
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono text-lg text-[#3b82f6]"> {user?.email} </span>
          <button
            className="bg-[#232526] border border-[#3b82f6] text-[#3b82f6] px-4 py-2 rounded-lg font-bold shadow hover:bg-[#181f2a] hover:text-white transition"
            onClick={async () => {
              await supabase.auth.signOut();
              router.push("/login");
            }}
          >
            Sair
          </button>
        </div>
      </header>
      <main className="max-w-5xl mx-auto p-8">
        <nav className="flex flex-wrap gap-6 justify-center mb-10">
          <a href="/dashboard/clientes" className="border border-[#3b82f6] bg-[#232526] text-[#3b82f6] px-6 py-3 rounded-xl font-bold text-lg shadow-lg hover:scale-105 hover:bg-[#181f2a] hover:text-white transition-all">Clientes</a>
          <a href="/dashboard/servicos" className="border border-[#3b82f6] bg-[#232526] text-[#3b82f6] px-6 py-3 rounded-xl font-bold text-lg shadow-lg hover:scale-105 hover:bg-[#181f2a] hover:text-white transition-all">Serviços</a>
          <a href="/dashboard/credenciais" className="border border-[#3b82f6] bg-[#232526] text-[#3b82f6] px-6 py-3 rounded-xl font-bold text-lg shadow-lg hover:scale-105 hover:bg-[#181f2a] hover:text-white transition-all">Credenciais</a>
          <a href="/dashboard/relatorios" className="border border-[#3b82f6] bg-[#232526] text-[#3b82f6] px-6 py-3 rounded-xl font-bold text-lg shadow-lg hover:scale-105 hover:bg-[#181f2a] hover:text-white transition-all">Relatórios</a>
        </nav>
        <section className="text-center">
          <h2 className="text-3xl font-bold mb-4 text-[#3b82f6]">Bem-vindo ao sistema de gestão HELPEX!</h2>
          <p className="text-lg text-[#60a5fa] mb-6">Utilize o menu acima para administrar clientes, serviços, credenciais e relatórios.</p>
          <div className="flex flex-wrap gap-6 justify-center mt-8">
            <div className="bg-[#232526] rounded-xl p-6 min-w-[220px] shadow-lg border border-[#3b82f6]">
              <div className="text-xl font-bold mb-2 text-[#3b82f6]">Clientes</div>
              <div className="text-[#60a5fa]">Gerencie o cadastro completo dos clientes HELPEX.</div>
            </div>
            <div className="bg-[#232526] rounded-xl p-6 min-w-[220px] shadow-lg border border-[#3b82f6]">
              <div className="text-xl font-bold mb-2 text-[#3b82f6]">Serviços</div>
              <div className="text-[#60a5fa]">Controle os serviços contratados e históricos.</div>
            </div>
            <div className="bg-[#232526] rounded-xl p-6 min-w-[220px] shadow-lg border border-[#3b82f6]">
              <div className="text-xl font-bold mb-2 text-[#3b82f6]">Credenciais</div>
              <div className="text-[#60a5fa]">Acesse e gerencie credenciais de acesso.</div>
            </div>
            <div className="bg-[#232526] rounded-xl p-6 min-w-[220px] shadow-lg border border-[#3b82f6]">
              <div className="text-xl font-bold mb-2 text-[#3b82f6]">Relatórios</div>
              <div className="text-[#60a5fa]">Visualize relatórios de clientes e serviços.</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

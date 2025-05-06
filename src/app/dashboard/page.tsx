"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "../../components/ThemeToggle";

export default function Dashboard() {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUser({ id: user.id, email: user.email ?? "" });
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
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans">
      <header className="bg-[var(--background)] border-b border-[var(--primary)] p-6 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-4">
          <Image src="https://dieycvogftvfoncigvtl.supabase.co/storage/v1/object/public/imagens//HELPEX%20BRANCO.png" alt="HELPEX Logo" width={100} height={50} className="h-10 w-auto drop-shadow-lg" />
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono text-lg text-[var(--primary)]"> {user?.email} </span>
          <ThemeToggle />
          <button
            className="bg-[var(--primary-dark)] border border-[var(--primary)] text-[var(--primary-light)] px-4 py-2 rounded-lg font-bold shadow hover:bg-[var(--background)] hover:text-[var(--foreground)] transition"
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
          <Link href="/dashboard/clientes" className="border border-[var(--primary)] bg-[var(--primary-dark)] text-[var(--primary-light)] px-6 py-3 rounded-xl font-bold text-lg shadow-lg hover:scale-105 hover:bg-[var(--background)] hover:text-[var(--foreground)] transition-all">Clientes</Link>
          <Link href="/dashboard/servicos" className="border border-[var(--primary)] bg-[var(--primary-dark)] text-[var(--primary-light)] px-6 py-3 rounded-xl font-bold text-lg shadow-lg hover:scale-105 hover:bg-[var(--background)] hover:text-[var(--foreground)] transition-all">Serviços</Link>
          <Link href="/dashboard/produtos" className="border border-[var(--primary)] bg-[var(--primary-dark)] text-[var(--primary-light)] px-6 py-3 rounded-xl font-bold text-lg shadow-lg hover:scale-105 hover:bg-[var(--background)] hover:text-[var(--foreground)] transition-all">Produtos</Link>
        </nav>
        <section className="text-center">
          <h2 className="text-3xl font-bold mb-4 text-[var(--primary)]">Bem-vindo ao sistema de gestão HELPEX!</h2>
          <p className="text-lg text-[var(--primary-light)] mb-6">Utilize o menu acima para administrar clientes e serviços.</p>
          <div className="flex flex-wrap gap-6 justify-center mt-8">
            <div className="bg-[var(--primary-dark)] rounded-xl p-6 min-w-[220px] shadow-lg border border-[var(--primary)]">
              <div className="text-xl font-bold mb-2 text-[var(--primary)]">Clientes</div>
              <div className="text-[var(--primary-light)]">Gerencie clientes cadastrados.</div>
            </div>
            <div className="bg-[var(--primary-dark)] rounded-xl p-6 min-w-[220px] shadow-lg border border-[var(--primary)]">
              <div className="text-xl font-bold mb-2 text-[var(--primary)]">Serviços</div>
              <div className="text-[var(--primary-light)]">Gerencie serviços contratados.</div>
            </div>
            <div className="bg-[var(--primary-dark)] rounded-xl p-6 min-w-[220px] shadow-lg border border-[var(--primary)]">
              <div className="text-xl font-bold mb-2 text-[var(--primary)]">Produtos</div>
              <div className="text-[var(--primary-light)]">Gerencie os produtos cadastrados.</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

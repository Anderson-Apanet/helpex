"use client";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="w-full bg-[#181f2a] border-b border-[#3b82f6] shadow-lg py-3 px-4 flex items-center justify-between z-40 sticky top-0">
      <div className="flex items-center gap-3">
        <Image src="/logo-helpex.png" alt="HELPEX Logo" width={44} height={44} className="rounded-full border-2 border-[#3b82f6] shadow neon-blue" />
        <span className="ml-2 text-2xl font-extrabold neon-blue tracking-wide drop-shadow">HELPEX</span>
      </div>
      <nav className="flex gap-6">
        <Link href="/dashboard" className="font-bold neon-blue hover:text-[#60a5fa] transition">Dashboard</Link>
        <Link href="/dashboard/clientes" className="font-bold neon-blue hover:text-[#3b82f6] transition">Clientes</Link>
        <Link href="/dashboard/servicos" className="font-bold neon-orange hover:text-[#60a5fa] transition">Serviços</Link>
        <Link href="/dashboard/relatorios" className="font-bold neon-blue hover:text-[#f58a42] transition">Relatórios</Link>
        <Link href="/dashboard/credenciais" className="font-bold neon-blue hover:text-[#f58a42] transition">Credenciais</Link>
      </nav>
    </header>
  );
}

<style>
  .neon-blue { text-shadow: 0 0 8px #3b82f6, 0 0 12px #60a5fa; color: #3b82f6; }
  .neon-orange { text-shadow: 0 0 6px #f58a42, 0 0 10px #ffd700; color: #f58a42; }
  .animate-fade-in { animation: fadeIn 0.3s ease; }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
</style>

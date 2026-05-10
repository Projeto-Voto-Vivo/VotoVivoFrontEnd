export const dynamic = 'force-dynamic';

import { Header } from "@/components/layout/HeaderLayout";
import { HeroSearch } from "@/components/home/HeroSearch";
import { Destaques } from "@/components/home/Destaques"; 
import { ProjetoSection } from "@/components/home/ProjetoSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Header />
      
      <HeroSearch />
      
      <Destaques />

      <ProjetoSection />
      
    </main>
  );
}
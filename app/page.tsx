import { Header } from "@/components/layout/HeaderLayout";
import { HeroSearch } from "@/components/home/HeroSearch";
import { Destaques } from "@/components/home/Destaques"; 

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Header />
      
      <HeroSearch />
      
      <Destaques />
      
    </main>
  );
}
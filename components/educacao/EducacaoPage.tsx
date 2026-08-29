"use client";

import { MobileSectionNav } from "./layout/MobileSectionNav";
import { DesktopSectionNav } from "./layout/DesktopSectionNav";
import { EducacaoHero } from "./layout/EducacaoHero";

import { EstadoSection } from "./sections/EstadoSection";
import { CongressoSection } from "./sections/CongressoSection";
import { ParlamentarSection } from "./sections/ParlamentarSection";
import { CustosSection } from "./sections/CustosSection";
import { EmendasSection } from "./sections/EmendasSection";
import { ProcessoLegislativoSection } from "./sections/ProcessoLegislativoSection";
import { SistemaEleitoralSection } from "./sections/SistemaEleitoralSection";
import { FAQSection } from "./sections/FAQSection";

import { menuItems } from "./data/educacaoData";

export default function EducacaoPage() {
  return (
   <main className="min-h-screen w-full bg-[#F8FAFC] pb-28 selection:bg-blue-100 sm:pb-20">
      <MobileSectionNav items={menuItems} />

      <EducacaoHero />

      <div className="mx-auto mt-10 w-full max-w-7xl px-4 sm:mt-16 sm:px-6 lg:grid lg:grid-cols-12 lg:items-start lg:gap-8">
        <aside className="hidden lg:sticky lg:top-28 lg:col-span-2 lg:block lg:self-start">
          <DesktopSectionNav items={menuItems} />
        </aside>

        <div className="w-full min-w-0 space-y-8 scroll-smooth sm:space-y-12 lg:col-span-10">
          <EstadoSection />

          <CongressoSection />

          <ParlamentarSection />

          <CustosSection />

          <EmendasSection />

          <ProcessoLegislativoSection />

          <SistemaEleitoralSection />

          <FAQSection />
        </div>
      </div>
    </main>
  );
}
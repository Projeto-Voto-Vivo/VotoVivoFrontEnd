import {
  ChevronRight,
  HelpCircle,
} from "lucide-react";

import { faqs } from "../data/educacaoData";

export function FAQSection() {
  return (
    <section
      id="faq"
      className="mx-auto w-full max-w-3xl scroll-mt-24 px-0 py-6 sm:px-4 sm:py-10"
    >
      <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-slate-800 sm:mb-8">
        <HelpCircle className="shrink-0 text-blue-500" />

        Perguntas Comuns
      </h2>

      <div className="space-y-3 sm:space-y-4">
        {faqs.map((faq) => (
          <details
            key={faq.q}
            className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors hover:border-blue-100"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4 text-sm font-bold text-slate-700 hover:text-blue-600 sm:p-6 sm:text-base">
              <span>{faq.q}</span>

              <ChevronRight
                size={18}
                className="shrink-0 text-slate-400 transition-transform group-open:rotate-90"
              />
            </summary>

            <div className="border-t border-slate-50 px-4 pb-5 pt-4 text-sm leading-relaxed text-slate-500 sm:px-6 sm:pb-6">
              {faq.a}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
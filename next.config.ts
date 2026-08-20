import type { NextConfig } from "next";

/**
 * `output: "standalone"` existe para o Dockerfile, que copia `.next/standalone`.
 *
 * Na Vercel ele quebra o build. O passo de standalone lê
 * `.next/next-server.js.nft.json` sem tratar erro (`copyTracedFiles` em
 * `next/dist/build/utils.js`), e esse arquivo nem sempre é regravado quando a
 * plataforma restaura o cache de build — típico logo após uma troca de versão
 * do Next. O resultado é `ENOENT ... next-server.js.nft.json` e build falho.
 *
 * Na Vercel o standalone é desnecessário: a plataforma faz o próprio tracing de
 * arquivos e monta a saída de deploy. Fora dela (Docker, self-host) segue igual.
 */
const rodandoNaVercel = Boolean(process.env.VERCEL);

const nextConfig: NextConfig = {
  ...(rodandoNaVercel ? {} : { output: "standalone" as const }),
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: `${process.env.BACKEND_INTERNAL_URL || 'http://localhost:3001'}/:path*`,
      },
    ];
  },
};

export default nextConfig;

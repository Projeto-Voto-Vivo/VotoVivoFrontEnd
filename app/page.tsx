export const dynamic = 'force-dynamic';

import { HeroSearch } from "@/components/home/HeroSearch";
import { Destaques } from "@/components/home/Destaques";

export default function Home() {
  return (
    <>
      <HeroSearch />
      <Destaques />
    </>
  );
}
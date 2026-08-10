import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { TokenizerLab } from "./components/TokenizerLab";
import { RequestAnatomy } from "./components/RequestAnatomy";
import { ConversationTrap } from "./components/ConversationTrap";
import { CacheLab } from "./components/CacheLab";
import { PricingTable } from "./components/PricingTable";
import { WorkloadCalculator } from "./components/WorkloadCalculator";
import { Gotchas } from "./components/Gotchas";
import { Quiz } from "./components/Quiz";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <TokenizerLab />
        <RequestAnatomy />
        <ConversationTrap />
        <CacheLab />
        <PricingTable />
        <WorkloadCalculator />
        <Gotchas />
        <Quiz />
      </main>
      <Footer />
    </>
  );
}

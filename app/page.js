import Image from "next/image";
import Navbar from "@/components/navbar";
import CommitteeHeads from "@/components/committeeHeads";

export default function Home() {
  return (
    <div className="h-[300vh] relative"   title="cpcportal_home">
      <Navbar />
      <CommitteeHeads />
    </div>
    
  );
}

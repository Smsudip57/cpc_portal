import Image from "next/image";
import Navbar from "@/components/navbar";
import CommitteeHeads from "@/components/committeeHeads";
import Homeview from "@/components/homeview";

export default function Home() {
  return (
    <div className="h-[300vh] relative"   title="cpcportal_home">
      <Navbar />
      <Homeview />
      <div className='w-full aspect-[2.9/1] flex justify-center items-center'>
      <p className='text-white text-4xl'>
                Welcome to DIU Computer Programming Club
            </p>
      </div>
      <div className="bg-white w-full h-full">
      <CommitteeHeads />
      </div>
    </div>
    
  );
}

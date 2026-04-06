import { LogOut } from "lucide-react";

export default function Leader(){
  return (
    <div className="min-w-full min-h-full flex flex-col justify-between">
      <div className="w-full h-62.5 bg-[#05A787]">
        <div className="mt-22.5 mx-6.25 flex justify-between items-center">
          <div className="h-15 flex flex-col justify-between">
            <h1 className="font-bold text-[24px] text-white">
              이현석
            </h1>
            <p className="font-medium text-[14px] text-white">
              3학년 2반 16번
            </p>
          </div>
          <div className="w-6 h-6 flex justify-center items-center cursor-pointer">
            <LogOut size={18} color="white" />
          </div>
        </div>
        <div className="w-[352px] h-[165px] absolute top-[186px] left-[25px] bg-white rounded-[20px] shadow-[0_4px_10px_0_rgba(0,0,0,0.15)]">
          
        </div>
      </div>
    </div>
  );
}
import { LogOut } from "lucide-react";

interface StudentHeaderProps {
  name: string;
  grade: number;
  classNum: number;
  number: number;
  onLogout?: () => void;
}

export default function StudentHeader({
  name,
  grade,
  classNum,
  number,
  onLogout,
}: StudentHeaderProps) {
  return (
    <div className="mt-[90px] mx-6 flex justify-between items-center">
      <div className="flex flex-col gap-1">
        <h1 className="font-bold text-[24px] text-white">{name}</h1>
        <p className="font-medium text-[14px] text-white">
          {grade}학년 {classNum}반 {number}번
        </p>
      </div>
      <button
        onClick={onLogout}
        className="w-6 h-6 flex justify-center items-center"
      >
        <LogOut size={18} color="white" />
      </button>
    </div>
  );
}

import { KeyRound, LogOut } from "lucide-react";

interface StudentHeaderProps {
  name: string;
  grade: number;
  classNum: number;
  number?: number;
  onLogout?: () => void;
  onChangePassword?: () => void;
}

export default function StudentHeader({
  name,
  grade,
  classNum,
  number,
  onLogout,
  onChangePassword,
}: StudentHeaderProps) {
  return (
    <div className="relative z-10 mt-[90px] mx-6 flex justify-between items-center">
      <div className="flex flex-col gap-1">
        <h1 className="font-bold text-[24px] text-white">{name}</h1>
        <p className="font-medium text-[14px] text-white">
          {grade}학년 {classNum}반{number !== undefined ? ` ${number}번` : ''}
        </p>
      </div>
      <div className="flex items-center gap-[14px]">
        <button onClick={onChangePassword} aria-label="비밀번호 변경" className="w-6 h-6 flex justify-center items-center z-100">
          <KeyRound size={18} color="white" />
        </button>
        <button onClick={onLogout} aria-label="로그아웃" className="w-6 h-6 flex justify-center items-center z-100">
          <LogOut size={18} color="white" />
        </button>
      </div>
    </div>
  );
}

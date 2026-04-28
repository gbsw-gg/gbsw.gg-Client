'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icons } from "@/icons";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { useUser } from "@/context/UserContext";

export default function Home() {
  const router = useRouter();
  const { login } = useAuth();
  const { loadUser } = useUser();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(id, password);
      const user = await loadUser();
      if (user?.role === 'LEADER') {
        router.push('/auth/leader');
      } else if (user?.role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/auth/student');
      }
    } catch {
      // 에러 토스트는 useAuth 내부에서 처리
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-125 min-h-full flex flex-col items-center justify-center p-12.5">
      <Image src={Icons.Logo} alt="logo" width={100}/>
      <p className="text-[20px] text-[#3c3c3c] font-bold mt-7.5">경소마고 귀가/귀교 버스 탑승 관리</p>
      <form onSubmit={handleLogin} className="w-full h-auto flex flex-col gap-10 mt-15">
        <div className="w-full h-auto flex flex-col justify-between">
          <p className="text-[10px] font-medium text-[#3c3c3c]">아이디</p>
          <input required value={id} onChange={e => setId(e.target.value)} type="text" className="w-full h-10 outline-none border-b border-[#d2d2d2] px-1 duration-200 focus:border-[#05A787] text-sm" />
        </div>

        <div className="w-full h-auto flex flex-col justify-between">
          <p className="text-[10px] font-medium text-[#3c3c3c]">비밀번호</p>
          <input required value={password} onChange={e => setPassword(e.target.value)} type="password" className="w-full h-10 outline-none border-b border-[#d2d2d2] px-1 duration-200 focus:border-[#05A787] text-sm" />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-10 bg-[#05A787] rounded-lg flex justify-center items-center text-[12px] text-white font-bold duration-200 hover:bg-[#03886E] disabled:opacity-60 cursor-pointer"
        >
          {loading ? '로그인 중...' : '로그인'}
        </button>
      </form>
    </div>
  );
}

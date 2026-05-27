"use client";

import { useState } from "react";
import { useRequireRole } from "@/hooks/useRequireRole";
import Header from "./components/Header";
import DashBoard from "./components/DashBoard";
import RoundManage from "./components/RoundManage";
import BusDetail from "./components/BusDetail";
import BusChangeManage from "./components/BusChangeManage";

type Menu = "dashboard" | "round" | "busChange";

export default function Admin() {
  const { isChecking } = useRequireRole(['ADMIN']);
  const [selected, setSelected] = useState<Menu>("dashboard");
  const [selectedBus, setSelectedBus] = useState<{ id: number; leaderName: string } | null>(null);

  const handleSelectMenu = (menu: Menu) => {
    setSelected(menu);
    setSelectedBus(null);
  };

  if (isChecking) return null;

  return (
    <div className="w-full h-screen flex flex-col">
      <Header selected={selected} onSelect={handleSelectMenu} />
      <div className="flex-1 overflow-y-auto">
        {selected === "dashboard" && !selectedBus && (
          <DashBoard onSelectBus={(id, leaderName) => setSelectedBus({ id, leaderName })} />
        )}
        {selected === "dashboard" && selectedBus && (
          <BusDetail busId={selectedBus.id} leaderName={selectedBus.leaderName} onBack={() => setSelectedBus(null)} />
        )}
        {selected === "round" && <RoundManage />}
        {selected === "busChange" && <BusChangeManage />}
      </div>
    </div>
  );
}

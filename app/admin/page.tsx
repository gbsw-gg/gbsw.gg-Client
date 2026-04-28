"use client";

import { useState } from "react";
import { useRequireRole } from "@/hooks/useRequireRole";
import Header from "./components/Header";
import DashBoard from "./components/DashBoard";
import RoundManage from "./components/RoundManage";
import BusDetail from "./components/BusDetail";

type Menu = "dashboard" | "round";

export default function Admin() {
  const { isChecking } = useRequireRole(['ADMIN']);
  const [selected, setSelected] = useState<Menu>("dashboard");
  const [selectedBusId, setSelectedBusId] = useState<number | null>(null);

  const handleSelectMenu = (menu: Menu) => {
    setSelected(menu);
    setSelectedBusId(null);
  };

  if (isChecking) return null;

  return (
    <div className="w-full h-full flex flex-col">
      <Header selected={selected} onSelect={handleSelectMenu} />
      <div className="flex-1 overflow-y-auto">
        {selected === "dashboard" && !selectedBusId && (
          <DashBoard onSelectBus={setSelectedBusId} />
        )}
        {selected === "dashboard" && selectedBusId && (
          <BusDetail busId={selectedBusId} onBack={() => setSelectedBusId(null)} />
        )}
        {selected === "round" && <RoundManage />}
      </div>
    </div>
  );
}

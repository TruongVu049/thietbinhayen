"use client";

import { ManHinh, PhanQuyen } from "@/lib/db/types";
import { useEffect, useState } from "react";
import { getRoles, getScreens } from "@/lib/db";
import ScreenForm from "./screenForm";
import RoleForm from "./roleForm";

export default function RolePage() {
  const [roles, setRoles] = useState<PhanQuyen[]>([]);
  const [screens, setScreens] = useState<ManHinh[]>([]);

  useEffect(() => {
    Promise.all([getRoles(), getScreens()]).then((results) => {
      setRoles(results[0]);
      setScreens(results[1]);
    });
  }, []);

  function handleSetRoles(role: PhanQuyen) {
    setRoles([...roles, role]);
  }

  function handleUpdateRoles(role: PhanQuyen) {
    setRoles(
      roles.map((item) => {
        if (item.id === role.id) return role;
        return item;
      })
    );
  }

  function handleDeleteRoles(id: number) {
    setRoles(roles.filter((item) => item.id !== id));
  }

  //SCREEEN

  function handleSetScreens(screen: ManHinh) {
    setScreens([...screens, screen]);
  }

  function handleUpdateScreens(screen: ManHinh) {
    setScreens(
      screens.map((item) => {
        if (item.id === screen.id) return screen;
        return item;
      })
    );
  }

  function handleDeleteScreens(id: number) {
    setScreens(screens.filter((item) => item.id !== id));
  }

  return (
    <div className=" bg-[rgb(241_245_249)] p-6">
      <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
        <ScreenForm
          screens={screens}
          onSetScreens={handleSetScreens}
          onUpdateScreens={handleUpdateScreens}
          onDeleteScreens={handleDeleteScreens}
        />
        <RoleForm
          screens={screens}
          roles={roles}
          onSetRoles={handleSetRoles}
          onUpdateRoles={handleUpdateRoles}
          onDeleteRoles={handleDeleteRoles}
        />
      </div>
    </div>
  );
}

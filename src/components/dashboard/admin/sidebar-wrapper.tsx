// components/dashboard/admin/sidebar-wrapper.tsx
"use client";

import { useState } from "react";
import AdminSidebar from "./sidebar";

export default function AdminSidebarWrapper() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  return (
    <AdminSidebar
      isCollapsed={isCollapsed}
      setIsCollapsed={setIsCollapsed}
    />
  );
}
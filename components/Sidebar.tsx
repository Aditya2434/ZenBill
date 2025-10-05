import React from "react";
import { View } from "../App";
import {
  DashboardIcon,
  DocumentIcon,
  SettingsIcon,
  UsersIcon,
  BoxIcon,
  PdfIcon,
} from "./icons";

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: DashboardIcon,
      views: ["dashboard"],
    },
    {
      id: "invoices",
      label: "Invoices",
      icon: DocumentIcon,
      views: ["invoices", "create-invoice", "edit-invoice", "create-quotation"],
    },
    { id: "clients", label: "Clients", icon: UsersIcon, views: ["clients"] },
    { id: "products", label: "Products", icon: BoxIcon, views: ["products"] },
    { id: "DummyPDF", label: "Dummy PDF", icon: PdfIcon, views: ["DummyPDF"] },
    {
      id: "settings",
      label: "Settings",
      icon: SettingsIcon,
      views: ["settings"],
    },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800 tracking-tight">
          ZenBill
        </h1>
      </div>
      <nav className="flex-1 px-4 py-4 space-y-2">
        {navItems.map((item) => {
          const isActive = item.views.includes(currentView);
          return (
            <a
              key={item.id}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setView(item.id as View);
              }}
              className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
                isActive
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </a>
          );
        })}
      </nav>
      <div className="px-6 py-4 border-t border-gray-200">
        <div className="flex items-center">
          <img
            className="h-10 w-10 rounded-full object-cover"
            src="https://picsum.photos/100"
            alt="User"
          />
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700">Jane Doe</p>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
};

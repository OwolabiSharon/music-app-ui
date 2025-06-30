"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { IoIosAdd, IoMdMore } from "react-icons/io";
import { FiTrash } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import WhatsAppLink from "../../components/WhatsAppLink";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const menuItems = [
    {
      title: "Overview",
      path: "/dashboard",
      icon: <IoIosAdd />,
    },
    {
      title: "Catalog",
      path: "/dashboard/catalog",
      icon: <IoIosAdd />,
    },
    {
      title: "Earnings",
      path: "/dashboard/earnings",
      icon: <IoIosAdd />,
    },
    {
      title: "Analytics",
      path: "/dashboard/analytics",
      icon: <IoIosAdd />,
    },
    {
      title: "Profile",
      path: "/dashboard/profile",
      icon: <IoIosAdd />,
    },
  ];

  return (
    <div className="h-screen w-screen md:flex hidden">
      {/* Left Nav */}
      <div className="h-full w-[25%] p-3">
        <div className="dark:bg-[#2c2c2c] bg-neutral-50 flex flex-col gap-5 w-full h-full rounded-2xl transition-all duration-300 ease-in-out">
          {/* Title */}
          <div className="px-6 pt-10 flex items-center justify-between">
            <div className="flex items-center gap-2" onClick={() => router.push("/")}>
            <img 
              src="/images/chatgpt-logo.png" 
              alt="ChatGPT Logo" 
              className="w-8 h-8 object-contain"
            />
              <span className="text-3xl font-bold tracking-tighter">
                Dashboard
              </span>
            </div>
            
          </div>

          {/* Menu Items */}
          <div className="flex-grow scrollbar-thin overflow-auto p-3 space-y-3">
            {menuItems.map((item, index) => (
              <div
                key={index}
                onClick={() => router.push(item.path)}
                className="relative cursor-pointer p-4 rounded-xl hover:bg-neutral-300 dark:hover:bg-black transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="text-xl">{item.icon}</div>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                </div>
              </div>
            ))}
          </div>

          {/* WhatsApp Button */}
          <WhatsAppLink className="dash"/>

          {/* Sign Out Button */}
          <div className="p-3 mt-auto">
            <button
              onClick={() => router.push("/auth/login")}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl shadow-lg transition-colors duration-200 font-medium w-full"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="h-full w-[75%] p-3">
        <div className="dark:bg-[#2c2c2c] bg-neutral-50 w-full h-full rounded-2xl overflow-hidden">
          <div className="h-full overflow-y-auto p-6">
            {children}
            
          </div>
        </div>
        
      </div>
    </div>
  );
} 
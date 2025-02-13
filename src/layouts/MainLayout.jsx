import { Outlet } from "react-router-dom";

import { useMediaQuery } from "@uidotdev/usehooks";
import { useClickOutside } from "@/hooks/use-click-outside";

import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

import { cn } from "@/utils/cn";
import { useEffect, useRef, useState } from "react";

import { ConfigProvider, Modal, Button, Table, Space, Tag } from "antd";
import { theme as antdTheme } from 'antd';
import { useTheme } from "@/hooks/use-theme";

const MainLayout = () => {
  const { theme } = useTheme();

  const isDesktopDevice = useMediaQuery("(min-width: 768px)");
  const [collapsed, setCollapsed] = useState(!isDesktopDevice);

  const sidebarRef = useRef(null);

  useEffect(() => {
    setCollapsed(!isDesktopDevice);
  }, [isDesktopDevice]);

  useClickOutside([sidebarRef], () => {
    if (!isDesktopDevice && !collapsed) {
      setCollapsed(true);
    }
  });

  return (
    <div className="min-h-screen bg-slate-100 transition-colors dark:bg-slate-950">
      <div
        className={cn(
          "pointer-events-none fixed inset-0 -z-10 bg-black opacity-0 transition-opacity",
          !collapsed && "max-md:pointer-events-auto max-md:z-50 max-md:opacity-30",
        )}
      />
      <Sidebar
        ref={sidebarRef}
        collapsed={collapsed}
      />
      <div className={cn("transition-[margin] duration-300", collapsed ? "md:ml-[70px]" : "md:ml-[240px]")}>
        <Header
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />
        <div className="h-[calc(100vh-60px)] overflow-y-auto overflow-x-hidden p-6">
          
          <ConfigProvider
            theme={{
              algorithm: theme === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,  // Kích hoạt chế độ dark mode
              token: {
                // colorBgBase: theme === 'dark' && "#0f172a"
              },
              components: {
                Modal: {
                  contentBg: theme === 'dark'? "rgb(15,23,42)": "#fff",
                  headerBg: theme === 'dark'? "rgb(15,23,42)": "#fff",
                },
                Table: {
                  colorBgContainer: theme === 'dark'? "rgb(15,23,42)": "#fff"
                }
              },
             
            }}
          >
            <Outlet />

          </ConfigProvider>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default MainLayout

import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { Header } from "./Header";

export function Layout() {
  return (
    <div className="min-h-screen bg-slate-50/80">
      <Header />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
      >
        <Outlet />
      </motion.main>
    </div>
  );
}

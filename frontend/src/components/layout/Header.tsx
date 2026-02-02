import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { motion, AnimatePresence } from "framer-motion";
import { LogOutIcon, MenuIcon, XIcon, LayoutDashboardIcon, UserIcon } from "@/components/ui/Icons";
import { logout } from "@/store/slices/authSlice";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { RootState } from "@/store";

const navLinks = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/desks", label: "Desks" },
  { to: "/my-bookings", label: "My Bookings" },
];

const adminLinks = [
  { to: "/admin/desks", label: "Manage Desks" },
  { to: "/admin/bookings", label: "All Bookings" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    setUserMenuOpen(false);
    setMobileOpen(false);
  };

  const isAdmin = user?.role === "ADMIN";
  const links = isAdmin ? [...navLinks, ...adminLinks] : navLinks;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/dashboard" className="flex items-center gap-2 text-xl font-bold text-primary-600">
          <LayoutDashboardIcon />
          <span className="hidden sm:inline">ProSpace</span>
        </Link>

        {isAuthenticated && (
          <>
            <nav className="hidden items-center gap-1 md:flex">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100">
                    <UserIcon />
                  </div>
                  <span className="hidden max-w-32 truncate sm:inline">{user?.name}</span>
                </button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-1 w-48 rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
                    >
                      <div className="border-b border-slate-100 px-4 py-2">
                        <p className="text-sm font-medium text-slate-900">{user?.name}</p>
                        <p className="text-xs text-slate-500">{user?.email}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOutIcon />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="rounded-lg p-2 md:hidden"
              >
                {mobileOpen ? <XIcon /> : <MenuIcon />}
              </button>
            </div>
          </>
        )}
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-slate-200 bg-white md:hidden"
          >
            <nav className="flex flex-col px-4 py-3">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "rounded-lg px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Button
                variant="danger"
                className="mt-2"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

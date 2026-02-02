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
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        <Link
          to="/dashboard"
          className="flex items-center gap-2.5 font-bold text-slate-900 transition-colors hover:text-primary-600"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 text-white">
            <LayoutDashboardIcon />
          </span>
          <span className="hidden text-lg sm:inline">ProSpace</span>
        </Link>

        {isAuthenticated && (
          <>
            <nav className="hidden items-center gap-0.5 md:flex">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="rounded-lg px-3.5 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-1">
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                    <UserIcon />
                  </div>
                  <span className="hidden max-w-32 truncate sm:inline">
                    {/* {user?.name} */}
                  </span>
                </button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-1.5 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card-hover"
                    >
                      <div className="border-b border-slate-100 px-4 py-3">
                        <p className="font-medium text-slate-900">{user?.name}</p>
                        <p className="mt-0.5 truncate text-xs text-slate-500">
                          {user?.email}
                        </p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50"
                      >
                        <LogOutIcon />
                        Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 md:hidden"
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
            transition={{ duration: 0.2 }}
            className="border-t border-slate-200 bg-white md:hidden"
          >
            <nav className="flex flex-col px-4 py-3">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "rounded-lg px-4 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Button
                variant="ghost"
                className="mt-2 justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={handleLogout}
              >
                <LogOutIcon />
                Sign out
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { motion } from "framer-motion";
import { CalendarIcon, LayoutDashboardIcon, ChevronRightIcon } from "@/components/ui/Icons";
import { fetchDesks } from "@/store/slices/deskSlice";
import { fetchMyBookings } from "@/store/slices/bookingSlice";
import type { RootState } from "@/store";

export default function Dashboard() {
  const { user } = useSelector((state: RootState) => state.auth);
  const { desks } = useSelector((state: RootState) => state.desk);
  const { myBookings } = useSelector((state: RootState) => state.booking);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchDesks());
    dispatch(fetchMyBookings());
  }, [dispatch]);

  const upcomingBookings = myBookings.filter(
    (b) => new Date(b.date) >= new Date() && ["PENDING", "APPROVED"].includes(b.status)
  );
  const isAdmin = user?.role === "ADMIN";

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 p-6 text-white shadow-lg"
      >
        <h1 className="text-2xl font-bold sm:text-3xl">
          Hello, {user?.name?.split(" ")[0] ?? "User"}!
        </h1>
        <p className="mt-2 text-primary-100">
          {isAdmin ? "Manage desks and bookings from your admin panel." : "Book a desk for your next workday."}
        </p>
      </motion.div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Link
            to="/desks"
            className="block rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-primary-200 hover:shadow-md"
          >
            <div className="h-12 w-12 text-primary-600"><LayoutDashboardIcon /></div>
            <h3 className="mt-4 font-semibold text-slate-900">Available Desks</h3>
            <p className="mt-1 text-2xl font-bold text-primary-600">{desks.length}</p>
            <p className="mt-2 flex items-center text-sm text-slate-500">
              View & book <ChevronRightIcon />
            </p>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Link
            to="/my-bookings"
            className="block rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-primary-200 hover:shadow-md"
          >
            <CalendarIcon />
            <h3 className="mt-4 font-semibold text-slate-900">My Bookings</h3>
            <p className="mt-1 text-2xl font-bold text-primary-600">{upcomingBookings.length}</p>
            <p className="mt-2 flex items-center text-sm text-slate-500">
              View history <ChevronRightIcon />
            </p>
          </Link>
        </motion.div>

        {isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link
              to="/admin/bookings"
              className="block rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-primary-200 hover:shadow-md"
            >
              <CalendarIcon />
              <h3 className="mt-4 font-semibold text-slate-900">All Bookings</h3>
              <p className="mt-1 text-2xl font-bold text-primary-600">{myBookings.length}</p>
              <p className="mt-2 flex items-center text-sm text-slate-500">
                Manage <ChevronRightIcon />
              </p>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}

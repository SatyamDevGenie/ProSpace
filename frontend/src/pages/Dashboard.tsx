import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { motion } from "framer-motion";
import { CalendarIcon, LayoutDashboardIcon, ChevronRightIcon } from "@/components/ui/Icons";
import { fetchDesks } from "@/store/slices/deskSlice";
import { fetchMyBookings, fetchAllBookings } from "@/store/slices/bookingSlice";
import type { RootState } from "@/store";

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.3, ease: "easeOut" },
  }),
};

export default function Dashboard() {
  const { user } = useSelector((state: RootState) => state.auth);
  const { desks } = useSelector((state: RootState) => state.desk);
  const { myBookings, bookings } = useSelector((state: RootState) => state.booking);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchDesks());
    dispatch(fetchMyBookings());
    if (user?.role === "ADMIN") {
      dispatch(fetchAllBookings());
    }
  }, [dispatch, user?.role]);

  const today = new Date().toISOString().split("T")[0];
  const upcomingBookings = myBookings.filter(
    (b) => b.date >= today && ["PENDING", "APPROVED"].includes(b.status)
  );
  const isAdmin = user?.role === "ADMIN";

  const StatCard = ({
    to,
    icon: Icon,
    title,
    value,
    subtitle,
    delay = 0,
  }: {
    to: string;
    icon: React.ComponentType;
    title: string;
    value: number;
    subtitle: string;
    delay?: number;
  }) => (
    <motion.div custom={delay} variants={cardVariants} initial="hidden" animate="visible">
      <Link
        to={to}
        className="group block rounded-xl border border-slate-200/80 bg-white p-6 shadow-card transition-all duration-200 hover:border-slate-300 hover:shadow-card-hover dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600 classic:border-stone-300 classic:bg-stone-50 classic:hover:border-stone-400"
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 classic:bg-primary-100 classic:text-primary-700">
          <Icon />
        </div>
        <h3 className="mt-4 font-semibold text-slate-900 dark:text-slate-100 classic:text-stone-900">{title}</h3>
        <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 classic:text-stone-900">
          {value}
        </p>
        <p className="mt-2 flex items-center gap-1 text-sm text-slate-500 transition-colors group-hover:text-primary-600 dark:text-slate-400 dark:group-hover:text-primary-400 classic:text-stone-600 classic:group-hover:text-primary-700">
          {subtitle}
          <ChevronRightIcon />
        </p>
      </Link>
    </motion.div>
  );

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-xl border border-slate-200/80 bg-gradient-to-br from-primary-600 to-primary-700 p-6 text-white shadow-card dark:border-slate-700 dark:from-primary-700 dark:to-primary-900 classic:border-stone-400 classic:from-primary-700 classic:to-primary-800"
      >
        <h1 className="text-2xl font-bold sm:text-3xl">
          Hello, {user?.name?.split(" ")[0] ?? "User"}!
        </h1>
        <p className="mt-2 text-primary-100 dark:text-primary-200 classic:text-primary-100">
          {isAdmin
            ? "Manage desks and bookings from your admin panel."
            : "Book a desk for your next workday."}
        </p>
      </motion.div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          to="/desks"
          icon={LayoutDashboardIcon}
          title="Available Desks"
          value={desks.length}
          subtitle="View & book"
          delay={0.1}
        />
        <StatCard
          to="/my-bookings"
          icon={CalendarIcon}
          title="My Bookings"
          value={myBookings.length}
          subtitle={`${upcomingBookings.length} upcoming · View history`}
          delay={0.2}
        />
        {isAdmin && (
          <StatCard
            to="/admin/bookings"
            icon={CalendarIcon}
            title="All Bookings"
            value={bookings.length}
            subtitle="Manage all"
            delay={0.3}
          />
        )}
      </div>
    </div>
  );
}

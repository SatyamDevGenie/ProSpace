import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import { fetchAllUsers } from "@/store/slices/userSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useTheme } from "@/contexts/ThemeContext";
import type { RootState } from "@/store";
import type { IUser } from "@/types";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const ROLE_COLORS = {
  USER: "rgba(59, 130, 246, 0.8)",
  ADMIN: "rgba(16, 185, 129, 0.8)",
};
const ROLE_BORDERS = { USER: "rgb(59, 130, 246)", ADMIN: "rgb(16, 185, 129)" };
const MONTH_COLORS = [
  "rgba(99, 102, 241, 0.8)",
  "rgba(168, 85, 247, 0.8)",
  "rgba(236, 72, 153, 0.8)",
  "rgba(249, 115, 22, 0.8)",
  "rgba(234, 179, 8, 0.8)",
  "rgba(34, 197, 94, 0.8)",
  "rgba(20, 184, 166, 0.8)",
  "rgba(14, 165, 233, 0.8)",
  "rgba(59, 130, 246, 0.8)",
  "rgba(139, 92, 246, 0.8)",
  "rgba(244, 63, 94, 0.8)",
  "rgba(251, 146, 60, 0.8)",
];

function getRoleData(users: IUser[]) {
  const byRole = { USER: 0, ADMIN: 0 };
  users.forEach((u) => {
    if (u.role === "USER") byRole.USER++;
    else if (u.role === "ADMIN") byRole.ADMIN++;
  });
  return {
    labels: ["User", "Admin"],
    datasets: [
      {
        data: [byRole.USER, byRole.ADMIN],
        backgroundColor: [ROLE_COLORS.USER, ROLE_COLORS.ADMIN],
        borderColor: [ROLE_BORDERS.USER, ROLE_BORDERS.ADMIN],
        borderWidth: 1,
      },
    ],
  };
}

function getMonthlyData(users: IUser[]) {
  const byMonth: Record<string, number> = {};
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  monthNames.forEach((m) => (byMonth[m] = 0));

  users.forEach((u) => {
    const created = u.createdAt ? new Date(u.createdAt) : new Date();
    const key = monthNames[created.getMonth()];
    byMonth[key] = (byMonth[key] ?? 0) + 1;
  });

  const labels = monthNames;
  const data = labels.map((l) => byMonth[l] ?? 0);
  return {
    labels,
    datasets: [
      {
        label: "Registrations",
        data,
        backgroundColor: MONTH_COLORS,
        borderColor: MONTH_COLORS.map((c) => c.replace("0.8", "1")),
        borderWidth: 1,
      },
    ],
  };
}

export default function AdminAnalytics() {
  const { allUsers, allUsersLoading, allUsersError } = useSelector(
    (state: RootState) => state.user
  );
  const dispatch = useAppDispatch();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const textColor = isDark ? "#e2e8f0" : "#334155";
  const gridColor = isDark ? "rgba(148, 163, 184, 0.2)" : "rgba(148, 163, 184, 0.3)";

  const pieData = useMemo(() => getRoleData(allUsers), [allUsers]);
  const barData = useMemo(() => getMonthlyData(allUsers), [allUsers]);

  const pieOptions: ChartOptions<"pie"> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: textColor } },
        tooltip: { enabled: true },
      },
    }),
    [textColor]
  );

  const barOptions: ChartOptions<"bar"> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: { color: gridColor },
          ticks: { color: textColor },
        },
        y: {
          grid: { color: gridColor },
          ticks: { color: textColor },
          beginAtZero: true,
        },
      },
      plugins: {
        legend: { labels: { color: textColor } },
        tooltip: { enabled: true },
      },
    }),
    [textColor, gridColor]
  );

  const adminCount = allUsers.filter((u) => u.role === "ADMIN").length;
  const userCount = allUsers.filter((u) => u.role === "USER").length;

  if (allUsersLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-slate-600 dark:text-slate-400 classic:text-stone-600">
          Loading user analytics…
        </p>
      </div>
    );
  }

  if (allUsersError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/30 classic:border-red-300 classic:bg-red-50">
        <p className="text-red-700 dark:text-red-400 classic:text-red-800">{allUsersError}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 classic:text-stone-900">
            User Analytics
          </h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400 classic:text-stone-600">
            All users and role distribution
          </p>
        </div>

        {/* Summary cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 classic:text-stone-500">
                Total Users
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100 classic:text-stone-900">
                {allUsers.length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 classic:text-stone-500">
                Regular Users
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100 classic:text-stone-900">
                {userCount}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 classic:text-stone-500">
                Admins
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100 classic:text-stone-900">
                {adminCount}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Users by Role</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <Pie data={pieData} options={pieOptions} />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Registrations by Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <Bar data={barData} options={barOptions} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User list table */}
        <Card>
          <CardHeader>
            <CardTitle>All Users ({allUsers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 classic:border-stone-200">
                    <th className="pb-3 font-medium text-slate-700 dark:text-slate-300 classic:text-stone-700">
                      Name
                    </th>
                    <th className="pb-3 font-medium text-slate-700 dark:text-slate-300 classic:text-stone-700">
                      Email
                    </th>
                    <th className="pb-3 font-medium text-slate-700 dark:text-slate-300 classic:text-stone-700">
                      Role
                    </th>
                    <th className="pb-3 font-medium text-slate-700 dark:text-slate-300 classic:text-stone-700">
                      Joined
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {allUsers.map((u) => (
                    <tr
                      key={u._id}
                      className="border-b border-slate-100 dark:border-slate-700/50 classic:border-stone-200"
                    >
                      <td className="py-2.5 text-slate-900 dark:text-slate-100 classic:text-stone-900">
                        {u.name}
                      </td>
                      <td className="py-2.5 text-slate-600 dark:text-slate-400 classic:text-stone-600">
                        {u.email}
                      </td>
                      <td className="py-2.5">
                        <span
                          className={
                            u.role === "ADMIN"
                              ? "rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 classic:bg-emerald-200 classic:text-emerald-800"
                              : "rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300 classic:bg-stone-200 classic:text-stone-700"
                          }
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="py-2.5 text-slate-500 dark:text-slate-400 classic:text-stone-500">
                        {u.createdAt
                          ? new Date(u.createdAt).toLocaleDateString()
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

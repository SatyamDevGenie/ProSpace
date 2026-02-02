import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { motion } from "framer-motion";
import { CheckIcon, XIcon, BanIcon, PlusIcon } from "@/components/ui/Icons";
import {
  fetchAllBookings,
  approveBooking,
  rejectBooking,
  adminCancelBooking,
  adminCreateBooking,
} from "@/store/slices/bookingSlice";
import { fetchDesks } from "@/store/slices/deskSlice";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import type { RootState } from "@/store";
import type { IBooking, IUser } from "@/types";

const statusColors: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
  CANCELLED: "bg-slate-100 text-slate-600",
  ADMIN_CANCELLED: "bg-red-100 text-red-800",
};

function getUserName(booking: IBooking): string {
  const u = booking.user;
  if (!u) return "—";
  return typeof u === "object" ? (u as IUser).name : "—";
}

function getUserEmail(booking: IBooking): string {
  const u = booking.user;
  if (!u) return "—";
  return typeof u === "object" ? (u as IUser).email : "—";
}

function getDeskNumber(booking: IBooking): string {
  const d = booking.desk;
  if (!d) return "—";
  return typeof d === "object" ? d.deskNumber : "—";
}

export default function AdminBookings() {
  const { bookings, isLoading } = useSelector((state: RootState) => state.booking);
  const { desks } = useSelector((state: RootState) => state.desk);
  const dispatch = useAppDispatch();
  const [filter, setFilter] = useState<string>("all");
  const [showCreate, setShowCreate] = useState(false);
  const [createUserId, setCreateUserId] = useState("");
  const [createDeskId, setCreateDeskId] = useState("");
  const [createDate, setCreateDate] = useState("");

  useEffect(() => {
    dispatch(fetchAllBookings());
    dispatch(fetchDesks());
  }, [dispatch]);

  const filtered =
    filter === "all"
      ? bookings
      : bookings.filter((b) => b.status === filter);

  const handleApprove = (id: string) => dispatch(approveBooking(id));
  const handleReject = (id: string) => dispatch(rejectBooking(id));
  const handleCancel = (id: string) => {
    if (window.confirm("Admin cancel this booking?")) dispatch(adminCancelBooking(id));
  };

  const canAction = (b: IBooking) => b.status === "PENDING";

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createUserId || !createDeskId || !createDate) return;
    await dispatch(adminCreateBooking({ userId: createUserId, deskId: createDeskId, date: createDate }));
    setShowCreate(false);
    setCreateUserId("");
    setCreateDeskId("");
    setCreateDate("");
  };

  const uniqueUserIds = Array.from(
    new Set(
      bookings
        .map((b) => (typeof b.user === "object" && b.user ? (b.user as IUser)._id : null))
        .filter(Boolean) as string[]
    )
  );

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-900">All Bookings</h1>
          <p className="mt-1 text-slate-600">View and manage all user bookings</p>
        </div>
        <Button onClick={() => setShowCreate(!showCreate)}>
          <PlusIcon />
          Create Booking
        </Button>
      </motion.div>

      {showCreate && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Card>
            <CardContent className="p-4">
              <h3 className="mb-4 font-semibold">Create Booking for User</h3>
              <form onSubmit={handleCreate} className="flex flex-wrap items-end gap-4">
                <div className="min-w-[200px]">
                  <label className="mb-1 block text-sm font-medium">User ID</label>
                  {uniqueUserIds.length > 0 ? (
                    <select
                      value={createUserId}
                      onChange={(e) => setCreateUserId(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2"
                      required
                    >
                      <option value="">Select user</option>
                      {uniqueUserIds.map((id) => (
                        <option key={id} value={id}>{id}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={createUserId}
                      onChange={(e) => setCreateUserId(e.target.value)}
                      placeholder="Paste user MongoDB ID"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2"
                      required
                    />
                  )}
                </div>
                <div className="min-w-[120px]">
                  <label className="mb-1 block text-sm font-medium">Desk</label>
                  <select
                    value={createDeskId}
                    onChange={(e) => setCreateDeskId(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    required
                  >
                    <option value="">Select desk</option>
                    {desks.map((d) => (
                      <option key={d._id} value={d._id}>{d.deskNumber}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Date</label>
                  <input
                    type="date"
                    value={createDate}
                    onChange={(e) => setCreateDate(e.target.value)}
                    className="rounded-lg border border-slate-300 px-3 py-2"
                    required
                  />
                </div>
                <Button type="submit">Create</Button>
                <Button type="button" variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="flex flex-wrap gap-2">
        {["all", "PENDING", "APPROVED", "REJECTED", "CANCELLED", "ADMIN_CANCELLED"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              filter === s
                ? "bg-primary-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {s === "all" ? "All" : s.replace("_", " ")}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-slate-200" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((booking, i) => (
            <motion.div
              key={booking._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-slate-900">
                          {getUserName(booking)}
                        </span>
                        <span className="text-slate-500">{getUserEmail(booking)}</span>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            statusColors[booking.status] ?? "bg-slate-100"
                          }`}
                        >
                          {booking.status.replace("_", " ")}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-slate-500">
                        Desk {getDeskNumber(booking)} • {booking.date}
                      </p>
                    </div>
                    {canAction(booking) && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleApprove(booking._id)}
                          className="!bg-green-600 hover:!bg-green-700"
                        >
                          <CheckIcon />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleReject(booking._id)}
                        >
                          <XIcon />
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCancel(booking._id)}
                        >
                          <BanIcon />
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-slate-500">
            No bookings found.
          </CardContent>
        </Card>
      )}
    </div>
  );
}

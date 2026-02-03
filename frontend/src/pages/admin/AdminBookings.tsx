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
import { ReasonModal } from "@/components/ui/ReasonModal";
import type { RootState } from "@/store";
import type { IBooking, IUser } from "@/types";

const statusStyles: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  APPROVED: "bg-emerald-100 text-emerald-800",
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

const filterOptions = [
  "all",
  "PENDING",
  "APPROVED",
  "REJECTED",
  "CANCELLED",
  "ADMIN_CANCELLED",
];

export default function AdminBookings() {
  const { bookings, isLoading } = useSelector((state: RootState) => state.booking);
  const { desks } = useSelector((state: RootState) => state.desk);
  const dispatch = useAppDispatch();
  const [filter, setFilter] = useState<string>("all");
  const [showCreate, setShowCreate] = useState(false);
  const [createUserId, setCreateUserId] = useState("");
  const [createDeskId, setCreateDeskId] = useState("");
  const [createDate, setCreateDate] = useState("");
  const [rejectModalBookingId, setRejectModalBookingId] = useState<string | null>(null);
  const [cancelModalBookingId, setCancelModalBookingId] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchAllBookings());
    dispatch(fetchDesks());
  }, [dispatch]);

  const filtered =
    filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  const handleApprove = async (id: string) => {
    setActionLoadingId(id);
    await dispatch(approveBooking(id));
    setActionLoadingId(null);
  };
  const handleRejectClick = (id: string) => setRejectModalBookingId(id);
  const handleRejectConfirm = async (reason: string) => {
    if (!rejectModalBookingId) return;
    setActionLoadingId(rejectModalBookingId);
    await dispatch(rejectBooking({ id: rejectModalBookingId, reason }));
    setActionLoadingId(null);
    setRejectModalBookingId(null);
  };
  const handleCancelClick = (id: string) => setCancelModalBookingId(id);
  const handleCancelConfirm = async (reason: string) => {
    if (!cancelModalBookingId) return;
    setActionLoadingId(cancelModalBookingId);
    await dispatch(adminCancelBooking({ id: cancelModalBookingId, reason }));
    setActionLoadingId(null);
    setCancelModalBookingId(null);
  };

  const canAction = (b: IBooking) => b.status === "PENDING";

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createUserId || !createDeskId || !createDate) return;
    const result = await dispatch(
      adminCreateBooking({
        userId: createUserId,
        deskId: createDeskId,
        date: createDate,
      })
    );
    if (adminCreateBooking.fulfilled.match(result)) {
      setShowCreate(false);
      setCreateUserId("");
      setCreateDeskId("");
      setCreateDate("");
    }
  };

  const uniqueUserIds = Array.from(
    new Set(
      bookings
        .map((b) =>
          typeof b.user === "object" && b.user ? (b.user as IUser)._id : null
        )
        .filter(Boolean) as string[]
    )
  );

  const inputClass =
    "w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 classic:border-stone-300 classic:bg-stone-50 classic:text-stone-900";

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 classic:text-stone-900">All Bookings</h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400 classic:text-stone-600">
            View and manage all user bookings
          </p>
        </div>
        <Button onClick={() => setShowCreate(!showCreate)}>
          <PlusIcon />
          Create booking
        </Button>
      </motion.div>

      {showCreate && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Card>
            <CardContent className="p-5">
              <h3 className="mb-4 font-semibold text-slate-900 dark:text-slate-100 classic:text-stone-900">
                Create booking for user
              </h3>
              <form
                onSubmit={handleCreate}
                className="flex flex-wrap items-end gap-4"
              >
                <div className="min-w-[200px] flex-1">
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300 classic:text-stone-700">
                    User
                  </label>
                  {uniqueUserIds.length > 0 ? (
                    <select
                      value={createUserId}
                      onChange={(e) => setCreateUserId(e.target.value)}
                      className={inputClass}
                      required
                    >
                      <option value="">Select user</option>
                      {uniqueUserIds.map((id) => (
                        <option key={id} value={id}>
                          {id}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={createUserId}
                      onChange={(e) => setCreateUserId(e.target.value)}
                      placeholder="Paste user MongoDB ID"
                      className={inputClass}
                      required
                    />
                  )}
                </div>
                <div className="min-w-[120px]">
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300 classic:text-stone-700">
                    Desk
                  </label>
                  <select
                    value={createDeskId}
                    onChange={(e) => setCreateDeskId(e.target.value)}
                    className={inputClass}
                    required
                  >
                    <option value="">Select desk</option>
                    {desks.map((d) => (
                      <option key={d._id} value={d._id}>
                        {d.deskNumber}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300 classic:text-stone-700">
                    Date
                  </label>
                  <input
                    type="date"
                    value={createDate}
                    onChange={(e) => setCreateDate(e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit">Create</Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreate(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="flex flex-wrap gap-2">
        {filterOptions.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              filter === s
                ? "bg-primary-600 text-white dark:bg-primary-500 classic:bg-primary-700"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 classic:bg-stone-200 classic:text-stone-700 classic:hover:bg-stone-300"
            }`}
          >
            {s === "all" ? "All" : s.replace("_", " ")}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-slate-200/80 dark:bg-slate-700 classic:bg-stone-300" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((booking, i) => (
            <motion.div
              key={booking._id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02, duration: 0.2 }}
            >
              <Card>
                <CardContent className="p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-slate-900 dark:text-slate-100 classic:text-stone-900">
                          {getUserName(booking)}
                        </span>
                        <span className="text-slate-500 dark:text-slate-400 classic:text-stone-600">
                          {getUserEmail(booking)}
                        </span>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            statusStyles[booking.status] ?? "bg-slate-100"
                          }`}
                        >
                          {booking.status.replace("_", " ")}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 classic:text-stone-600">
                        Desk {getDeskNumber(booking)} · {booking.date}
                      </p>
                    </div>
                    {canAction(booking) && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleApprove(booking._id)}
                          className="!bg-emerald-600 hover:!bg-emerald-700"
                          disabled={actionLoadingId === booking._id}
                          isLoading={actionLoadingId === booking._id}
                        >
                          <CheckIcon />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleRejectClick(booking._id)}
                        >
                          <XIcon />
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCancelClick(booking._id)}
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

      <ReasonModal
        open={rejectModalBookingId !== null}
        onClose={() => setRejectModalBookingId(null)}
        onConfirm={handleRejectConfirm}
        title="Reject booking"
        message="The user will receive an email with your reason. Please provide a reason for rejecting this booking."
        placeholder="Reason for rejection (e.g. desk unavailable, capacity limit)"
        confirmLabel="Reject"
        variant="danger"
        isLoading={actionLoadingId === rejectModalBookingId}
      />
      <ReasonModal
        open={cancelModalBookingId !== null}
        onClose={() => setCancelModalBookingId(null)}
        onConfirm={handleCancelConfirm}
        title="Cancel booking"
        message="The user will receive an email with your reason. Please provide a reason for cancelling this booking."
        placeholder="Reason for cancellation (e.g. office closed, maintenance)"
        confirmLabel="Cancel booking"
        variant="danger"
        isLoading={actionLoadingId === cancelModalBookingId}
      />

      {!isLoading && filtered.length === 0 && (
        <Card>
          <CardContent className="py-16 text-center text-slate-500 dark:text-slate-400 classic:text-stone-600">
            No bookings found.
          </CardContent>
        </Card>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { motion } from "framer-motion";
import { fetchMyBookings, updateBooking, cancelBooking } from "@/store/slices/bookingSlice";
import { fetchDesks } from "@/store/slices/deskSlice";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import type { RootState } from "@/store";
import type { IBooking } from "@/types";

const statusColors: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
  CANCELLED: "bg-slate-100 text-slate-600",
  ADMIN_CANCELLED: "bg-red-100 text-red-800",
};

function getDeskInfo(booking: IBooking): string {
  const desk = booking.desk;
  if (!desk) return "—";
  return typeof desk === "object" ? desk.deskNumber : "—";
}

export default function MyBookings() {
  const { myBookings, isLoading } = useSelector((state: RootState) => state.booking);
  const { desks } = useSelector((state: RootState) => state.desk);
  const dispatch = useAppDispatch();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDeskId, setEditDeskId] = useState("");
  const [editDate, setEditDate] = useState("");

  useEffect(() => {
    dispatch(fetchMyBookings());
    dispatch(fetchDesks());
  }, [dispatch]);

  const canUpdate = (b: IBooking) =>
    ["PENDING", "APPROVED"].includes(b.status) && new Date(b.date) >= new Date();

  const handleUpdate = async (id: string) => {
    if (!editDeskId || !editDate) return;
    await dispatch(updateBooking({ id, data: { deskId: editDeskId, date: editDate } }));
    setEditingId(null);
  };

  const handleCancel = async (id: string) => {
    if (window.confirm("Cancel this booking?")) {
      await dispatch(cancelBooking(id));
    }
  };

  const startEdit = (b: IBooking) => {
    const desk = b.desk;
    const deskId = typeof desk === "object" && desk ? (desk as { _id: string })._id : desks[0]?._id ?? "";
    setEditingId(b._id);
    setEditDeskId(deskId);
    setEditDate(b.date);
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold text-slate-900">My Bookings</h1>
        <p className="mt-1 text-slate-600">View and manage your desk bookings</p>
      </motion.div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-slate-200" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {myBookings.map((booking, i) => (
            <motion.div
              key={booking._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card>
                <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900">
                        Desk {getDeskInfo(booking)}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[booking.status] ?? "bg-slate-100"}`}
                      >
                        {booking.status.replace("_", " ")}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">{booking.date}</p>
                  </div>

                  {editingId === booking._id ? (
                    <div className="flex flex-wrap items-end gap-2">
                      <select
                        value={editDeskId}
                        onChange={(e) => setEditDeskId(e.target.value)}
                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                        required
                      >
                        <option value="">Select desk</option>
                        {desks.filter((d) => d.isActive).map((d) => (
                          <option key={d._id} value={d._id}>{d.deskNumber}</option>
                        ))}
                      </select>
                      <input
                        type="date"
                        value={editDate}
                        onChange={(e) => setEditDate(e.target.value)}
                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                      />
                      <Button size="sm" onClick={() => handleUpdate(booking._id)} disabled={!editDeskId || !editDate}>
                        Save
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>Cancel Edit</Button>
                    </div>
                    ) : (
                    <div className="flex flex-wrap items-center gap-2">
                      {canUpdate(booking) ? (
                        <>
                          <Button size="sm" variant="outline" onClick={() => startEdit(booking)}>
                            Update Desk
                          </Button>
                          <Button size="sm" variant="danger" onClick={() => handleCancel(booking._id)}>
                            Cancel Booking
                          </Button>
                        </>
                      ) : (
                        <span className="text-xs text-slate-500">
                          {["REJECTED", "CANCELLED", "ADMIN_CANCELLED"].includes(booking.status)
                            ? "Cannot update or cancel"
                            : "Past date - cannot update or cancel"}
                        </span>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {!isLoading && myBookings.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-slate-500">
            You have no bookings yet. Go to Desks to book one.
          </CardContent>
        </Card>
      )}
    </div>
  );
}

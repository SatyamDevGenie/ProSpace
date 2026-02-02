import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { motion } from "framer-motion";
import { createBooking } from "@/store/slices/bookingSlice";
import { fetchDesks } from "@/store/slices/deskSlice";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import type { RootState } from "@/store";
import type { IDesk } from "@/types";

export default function Desks() {
  const { desks, isLoading } = useSelector((state: RootState) => state.desk);
  const { error: bookingError } = useSelector((state: RootState) => state.booking);
  const dispatch = useAppDispatch();
  const [selectedDesk, setSelectedDesk] = useState<IDesk | null>(null);
  const [date, setDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchDesks());
    const today = new Date().toISOString().split("T")[0];
    setDate(today);
  }, [dispatch]);

  const handleBook = async () => {
    if (!selectedDesk || !date) return;
    setSubmitting(true);
    await dispatch(createBooking({ deskId: selectedDesk._id, date }));
    setSubmitting(false);
    setSelectedDesk(null);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-slate-900">Available Desks</h1>
        <p className="mt-1 text-slate-600">Select a desk and date to book</p>
      </motion.div>

      {selectedDesk && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="rounded-xl border border-primary-200 bg-primary-50 p-4"
        >
          <h3 className="font-semibold">Book {selectedDesk.deskNumber}</h3>
          <div className="mt-3 flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-[150px]">
              <label className="block text-sm font-medium text-slate-700">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleBook} isLoading={submitting}>Confirm</Button>
              <Button variant="outline" onClick={() => setSelectedDesk(null)}>Cancel</Button>
            </div>
          </div>
          {bookingError && <p className="mt-2 text-sm text-red-600">{bookingError}</p>}
        </motion.div>
      )}

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-xl bg-slate-200" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {desks.filter((d) => d.isActive).map((desk, i) => (
            <motion.div
              key={desk._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card
                className={`cursor-pointer transition hover:shadow-md ${
                  selectedDesk?._id === desk._id ? "ring-2 ring-primary-500" : ""
                }`}
                onClick={() => setSelectedDesk(desk)}
              >
                <CardContent className="flex items-center justify-between p-6">
                  <div>
                    <p className="text-2xl font-bold text-primary-600">{desk.deskNumber}</p>
                    <p className="text-sm text-slate-500">
                      {desk.isActive ? "Available" : "Maintenance"}
                    </p>
                  </div>
                  <Button size="sm" variant="outline">Book</Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {!isLoading && desks.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-slate-500">
            No desks available. Contact admin to add desks.
          </CardContent>
        </Card>
      )}
    </div>
  );
}

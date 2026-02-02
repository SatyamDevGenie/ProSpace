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
    const result = await dispatch(createBooking({ deskId: selectedDesk._id, date }));
    setSubmitting(false);
    if (createBooking.fulfilled.match(result)) {
      setSelectedDesk(null);
    }
  };

  const activeDesks = desks.filter((d) => d.isActive);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 classic:text-stone-900">Available Desks</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400 classic:text-stone-600">
          Select a desk and date to book
        </p>
      </motion.div>

      {selectedDesk && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="rounded-xl border border-primary-200/80 bg-primary-50/50 p-5 dark:border-primary-800 dark:bg-primary-950/30 classic:border-primary-300 classic:bg-primary-50/50"
        >
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 classic:text-stone-900">
            Book desk {selectedDesk.deskNumber}
          </h3>
          <div className="mt-4 flex flex-wrap items-end gap-4">
            <div className="min-w-[160px] flex-1">
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300 classic:text-stone-700">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 classic:border-stone-300 classic:bg-stone-50 classic:text-stone-900"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleBook} isLoading={submitting}>
                Confirm booking
              </Button>
              <Button variant="outline" onClick={() => setSelectedDesk(null)}>
                Cancel
              </Button>
            </div>
          </div>
          {bookingError && (
            <p className="mt-3 text-sm text-red-600 dark:text-red-400 classic:text-red-700">{bookingError}</p>
          )}
        </motion.div>
      )}

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-xl bg-slate-200/80 dark:bg-slate-700 classic:bg-stone-300"
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {activeDesks.map((desk, i) => (
            <motion.div
              key={desk._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.25 }}
            >
              <Card
                className={`cursor-pointer transition-all duration-200 hover:shadow-card-hover dark:ring-offset-slate-900 classic:ring-offset-stone-100 ${
                  selectedDesk?._id === desk._id
                    ? "ring-2 ring-primary-500 ring-offset-2"
                    : ""
                }`}
                onClick={() => setSelectedDesk(desk)}
              >
                <CardContent className="flex items-center justify-between p-6">
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 classic:text-stone-900">
                      {desk.deskNumber}
                    </p>
                    <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400 classic:text-stone-600">Available</p>
                  </div>
                  <Button size="sm" variant="outline">
                    Book
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {!isLoading && activeDesks.length === 0 && (
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-slate-500 dark:text-slate-400 classic:text-stone-600">
              No desks available. Contact admin to add desks.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

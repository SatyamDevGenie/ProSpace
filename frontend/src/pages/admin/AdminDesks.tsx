import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { motion } from "framer-motion";
import { PlusIcon, PencilIcon, TrashIcon } from "@/components/ui/Icons";
import { fetchDesks, createDesk, updateDesk, deleteDesk } from "@/store/slices/deskSlice";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import type { RootState } from "@/store";

export default function AdminDesks() {
  const { desks, isLoading, error } = useSelector((state: RootState) => state.desk);
  const dispatch = useAppDispatch();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deskNumber, setDeskNumber] = useState("");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    dispatch(fetchDesks());
  }, [dispatch]);

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setDeskNumber("");
    setIsActive(true);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deskNumber.trim()) return;
    await dispatch(createDesk({ deskNumber: deskNumber.trim() }));
    resetForm();
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId || !deskNumber.trim()) return;
    await dispatch(
      updateDesk({ id: editingId, data: { deskNumber: deskNumber.trim(), isActive } })
    );
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Delete this desk?")) {
      await dispatch(deleteDesk(id));
    }
  };

  const startEdit = (id: string, number: string, active: boolean) => {
    setEditingId(id);
    setDeskNumber(number);
    setIsActive(active);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 classic:text-stone-900">Manage Desks</h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400 classic:text-stone-600">Add, edit or remove desks</p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setShowForm(true);
            setEditingId(null);
          }}
        >
          <PlusIcon />
          Add desk
        </Button>
      </motion.div>

      {(showForm || editingId) && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.2 }}
        >
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 classic:text-stone-900">
                {editingId ? "Edit desk" : "New desk"}
              </h3>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={editingId ? handleUpdate : handleCreate}
                className="flex flex-wrap items-end gap-4"
              >
                <div className="min-w-[180px] flex-1">
                  <Input
                    label="Desk number"
                    value={deskNumber}
                    onChange={(e) => setDeskNumber(e.target.value)}
                    placeholder="D-101"
                    required
                  />
                </div>
                {editingId && (
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm font-medium text-slate-700">Active</span>
                  </label>
                )}
                <div className="flex gap-2">
                  <Button type="submit">
                    {editingId ? "Update" : "Create"}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-400 classic:bg-red-50 classic:text-red-800">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-slate-200/80 dark:bg-slate-700 classic:bg-stone-300" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {desks.map((desk, i) => (
            <motion.div
              key={desk._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.25 }}
            >
              <Card>
                <CardContent className="flex items-center justify-between p-5">
                  <div>
                    <p className="text-xl font-bold text-slate-900">
                      {desk.deskNumber}
                    </p>
                    <span
                      className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        desk.isActive
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {desk.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        startEdit(desk._id, desk.deskNumber, desk.isActive)
                      }
                    >
                      <PencilIcon />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(desk._id)}
                    >
                      <TrashIcon />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {!isLoading && desks.length === 0 && (
        <Card>
          <CardContent className="py-16 text-center text-slate-500 dark:text-slate-400 classic:text-stone-600">
            No desks yet. Add your first desk.
          </CardContent>
        </Card>
      )}
    </div>
  );
}

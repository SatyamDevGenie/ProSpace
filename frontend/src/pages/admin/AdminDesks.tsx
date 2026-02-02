import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { motion } from "framer-motion";
import { PlusIcon, PencilIcon, TrashIcon } from "@/components/ui/Icons";
import { fetchDesks, createDesk, updateDesk, deleteDesk } from "@/store/slices/deskSlice";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
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
    await dispatch(updateDesk({ id: editingId, data: { deskNumber: deskNumber.trim(), isActive } }));
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
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage Desks</h1>
          <p className="mt-1 text-slate-600">Add, edit or remove desks</p>
        </div>
        <Button onClick={() => { resetForm(); setShowForm(true); setEditingId(null); }}>
          <PlusIcon />
          Add Desk
        </Button>
      </motion.div>

      {(showForm || editingId) && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
        >
          <Card>
            <CardHeader>
              <CardTitle>{editingId ? "Edit Desk" : "New Desk"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={editingId ? handleUpdate : handleCreate}
                className="flex flex-wrap items-end gap-4"
              >
                <div className="min-w-[180px] flex-1">
                  <Input
                    label="Desk Number"
                    value={deskNumber}
                    onChange={(e) => setDeskNumber(e.target.value)}
                    placeholder="D-101"
                    required
                  />
                </div>
                {editingId && (
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="h-4 w-4 rounded"
                    />
                    <span className="text-sm">Active</span>
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
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</div>
      )}

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-slate-200" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {desks.map((desk, i) => (
            <motion.div
              key={desk._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card>
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <p className="text-xl font-bold text-slate-900">{desk.deskNumber}</p>
                    <span
                      className={`inline-block mt-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                        desk.isActive ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {desk.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => startEdit(desk._id, desk.deskNumber, desk.isActive)}
                    >
                      <PencilIcon />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(desk._id)}>
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
          <CardContent className="py-12 text-center text-slate-500">
            No desks yet. Add your first desk.
          </CardContent>
        </Card>
      )}
    </div>
  );
}

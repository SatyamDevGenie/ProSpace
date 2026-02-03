import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { motion } from "framer-motion";
import { StarIcon, HeartIcon, PencilIcon, TrashIcon } from "@/components/ui/Icons";
import {
  fetchReviews,
  fetchMyReview,
  createReview,
  updateReview,
  deleteReview,
  toggleLike,
} from "@/store/slices/reviewSlice";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import type { RootState } from "@/store";
import type { IReview, IUser } from "@/types";

function getUserName(review: IReview): string {
  const u = review.user;
  if (!u) return "—";
  return typeof u === "object" ? (u as IUser).name : "—";
}

function StarRating({ value, readonly = false, onChange }: { value: number; readonly?: boolean; onChange?: (v: number) => void }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => !readonly && onChange?.(star)}
          className="rounded p-0.5 text-amber-500 transition-colors hover:text-amber-400 disabled:cursor-default disabled:hover:text-amber-500 dark:text-amber-400 dark:hover:text-amber-300"
        >
          <StarIcon filled={star <= value} />
        </button>
      ))}
    </div>
  );
}

export default function Reviews() {
  const { reviews, myReview, isLoading } = useSelector((state: RootState) => state.review);
  const dispatch = useAppDispatch();
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRating, setEditRating] = useState(5);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    dispatch(fetchReviews());
    dispatch(fetchMyReview());
  }, [dispatch]);

  useEffect(() => {
    if (myReview) {
      setRating(myReview.rating);
      setText(myReview.text);
    }
  }, [myReview]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    if (myReview) {
      await dispatch(updateReview({ id: myReview._id, data: { rating, text: text.trim() } }));
    } else {
      await dispatch(createReview({ rating, text: text.trim() }));
      dispatch(fetchReviews());
    }
  };

  const handleEdit = (r: IReview) => {
    setEditingId(r._id);
    setEditRating(r.rating);
    setEditText(r.text);
  };

  const handleUpdate = async () => {
    if (!editingId || !editText.trim()) return;
    await dispatch(updateReview({ id: editingId, data: { rating: editRating, text: editText.trim() } }));
    setEditingId(null);
    dispatch(fetchReviews());
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Delete your review?")) {
      await dispatch(deleteReview(id));
      dispatch(fetchReviews());
    }
  };

  const handleLike = (id: string) => dispatch(toggleLike(id));

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 classic:text-stone-900">
          Reviews
        </h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400 classic:text-stone-600">
          Share your experience with ProSpace desk services
        </p>
      </motion.div>

      <Card>
        <CardContent className="p-5">
          <h2 className="font-semibold text-slate-900 dark:text-slate-100 classic:text-stone-900">
            {myReview ? "Update your review" : "Write a review"}
          </h2>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 classic:text-stone-700">
                Rating
              </label>
              <StarRating value={rating} onChange={setRating} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 classic:text-stone-700">
                Your review
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Tell us about your experience..."
                rows={3}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 classic:border-stone-300 classic:bg-stone-50 classic:text-stone-900"
                required
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={!text.trim()}>
                {myReview ? "Update" : "Submit"}
              </Button>
              {myReview && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleDelete(myReview._id)}
                  className="!text-red-600 hover:!bg-red-50 dark:!text-red-400 dark:hover:!bg-red-950/20"
                >
                  <TrashIcon />
                  Delete
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-4 font-semibold text-slate-900 dark:text-slate-100 classic:text-stone-900">
          All reviews ({reviews.length})
        </h2>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 animate-pulse rounded-xl bg-slate-200/80 dark:bg-slate-700 classic:bg-stone-300" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review, i) => (
              <motion.div
                key={review._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <Card>
                  <CardContent className="p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-slate-900 dark:text-slate-100 classic:text-stone-900">
                            {getUserName(review)}
                          </span>
                          <StarRating value={review.rating} readonly />
                          {myReview?._id === review._id && (
                            <span className="rounded-full bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-700 dark:bg-primary-900/40 dark:text-primary-400">
                              Your review
                            </span>
                          )}
                        </div>
                        {editingId === review._id ? (
                          <div className="mt-3 space-y-3">
                            <StarRating value={editRating} onChange={setEditRating} />
                            <textarea
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              rows={2}
                              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 classic:border-stone-300 classic:bg-stone-50"
                            />
                            <div className="flex gap-2">
                              <Button size="sm" onClick={handleUpdate} disabled={!editText.trim()}>
                                Save
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <p className="mt-2 text-slate-600 dark:text-slate-400 classic:text-stone-600">
                            {review.text}
                          </p>
                        )}
                        {editingId !== review._id && (
                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-500 classic:text-stone-500">
                            {review.createdAt
                              ? new Date(review.createdAt).toLocaleDateString()
                              : ""}
                          </p>
                        )}
                      </div>
                      {editingId !== review._id && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleLike(review._id)}
                            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm transition-colors ${
                              review.likedByMe
                                ? "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400 classic:bg-red-100 classic:text-red-700"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-slate-600 classic:bg-stone-200 classic:text-stone-700"
                            }`}
                          >
                            <HeartIcon filled={review.likedByMe} />
                            <span>{review.likes ?? 0}</span>
                          </button>
                          {myReview?._id === review._id && (
                            <Button size="sm" variant="ghost" onClick={() => handleEdit(review)}>
                              <PencilIcon />
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {!isLoading && reviews.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center text-slate-500 dark:text-slate-400 classic:text-stone-600">
              No reviews yet. Be the first to share your experience!
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

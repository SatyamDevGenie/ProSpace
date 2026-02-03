import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { motion } from "framer-motion";
import { StarIcon, HeartIcon } from "@/components/ui/Icons";
import { fetchAdminReviews } from "@/store/slices/reviewSlice";
import { Card, CardContent } from "@/components/ui/Card";
import type { RootState } from "@/store";
import type { IReview, IUser } from "@/types";

function getUserName(review: IReview): string {
  const u = review.user;
  if (!u) return "—";
  return typeof u === "object" ? (u as IUser).name : "—";
}

function getUserEmail(review: IReview): string {
  const u = review.user;
  if (!u) return "—";
  return typeof u === "object" ? (u as IUser).email : "—";
}

function StarDisplay({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className="text-amber-500 dark:text-amber-400">
          <StarIcon filled={star <= value} />
        </span>
      ))}
    </div>
  );
}

export default function AdminReviews() {
  const { adminReviews, isLoading } = useSelector((state: RootState) => state.review);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchAdminReviews());
  }, [dispatch]);

  const avgRating =
    adminReviews.length > 0
      ? (
          adminReviews.reduce((acc, r) => acc + r.rating, 0) / adminReviews.length
        ).toFixed(1)
      : "0";
  const totalLikes = adminReviews.reduce((acc, r) => acc + (r.likes ?? (r.likedBy as string[] | undefined)?.length ?? 0), 0);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 classic:text-stone-900">
            Reviews & Ratings
          </h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400 classic:text-stone-600">
            User feedback on ProSpace desk services
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 classic:text-stone-500">
                Total reviews
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100 classic:text-stone-900">
                {adminReviews.length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 classic:text-stone-500">
                Average rating
              </p>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-2xl font-bold text-slate-900 dark:text-slate-100 classic:text-stone-900">
                  {avgRating}
                </span>
                <StarDisplay value={Math.round(parseFloat(avgRating))} />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 classic:text-stone-500">
                Total likes
              </p>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-2xl font-bold text-slate-900 dark:text-slate-100 classic:text-stone-900">
                  {totalLikes}
                </span>
                <HeartIcon filled />
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-xl bg-slate-200/80 dark:bg-slate-700 classic:bg-stone-300"
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {adminReviews.map((review, i) => (
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
                        <span className="text-sm text-slate-500 dark:text-slate-400 classic:text-stone-500">
                          {getUserEmail(review)}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center gap-3">
                        <StarDisplay value={review.rating} />
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-300 classic:text-stone-600">
                          {review.rating}/5
                        </span>
                      </div>
                      <p className="mt-2 text-slate-600 dark:text-slate-400 classic:text-stone-600">
                        {review.text}
                      </p>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-500 classic:text-stone-500">
                        {review.createdAt
                          ? new Date(review.createdAt).toLocaleString()
                          : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 dark:bg-slate-700 classic:bg-stone-200">
                      <HeartIcon filled />
                      <span className="font-medium text-slate-700 dark:text-slate-300 classic:text-stone-700">
                        {review.likes ?? (review.likedBy as string[] | undefined)?.length ?? 0} likes
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {!isLoading && adminReviews.length === 0 && (
        <Card>
          <CardContent className="py-16 text-center text-slate-500 dark:text-slate-400 classic:text-stone-600">
            No reviews yet.
          </CardContent>
        </Card>
      )}
    </div>
  );
}

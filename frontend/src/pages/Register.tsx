import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { motion } from "framer-motion";
import { register, clearError } from "@/store/slices/authSlice";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { LayoutDashboardIcon } from "@/components/ui/Icons";
import type { RootState } from "@/store";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isLoading, error } = useSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(register({ name, email, password }));
    if (register.fulfilled.match(result)) {
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12 transition-colors dark:bg-slate-900 classic:bg-stone-200">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100 classic:text-stone-900"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 text-white dark:bg-primary-500 classic:bg-primary-700">
              <LayoutDashboardIcon />
            </span>
            <span className="text-xl">ProSpace</span>
          </Link>
        </div>

        <Card className="border-slate-200 shadow-card-hover dark:border-slate-700 classic:border-stone-300">
          <CardHeader className="text-center">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 classic:text-stone-900">Create account</h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 classic:text-stone-600">
              Join ProSpace to start booking desks
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-400 classic:bg-red-50 classic:text-red-800">
                  {error}
                </div>
              )}
              <Input
                label="Full name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
              />
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
              />
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                Create account
              </Button>
            </form>
            <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400 classic:text-stone-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 classic:text-primary-700 classic:hover:text-primary-800"
              >
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

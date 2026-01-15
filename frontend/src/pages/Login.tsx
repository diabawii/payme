import { useState, FormEvent } from "react";
import { useAuth } from "../context/AuthContext";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Modal } from "../components/ui/Modal";
import { api } from "../api/client";

interface LoginProps {
  onSwitchToRegister: () => void;
}

export function Login({ onSwitchToRegister }: LoginProps) {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetUsername, setResetUsername] = useState("");
  const [resetNewPassword, setResetNewPassword] = useState("");
  const [resetConfirmPassword, setResetConfirmPassword] = useState("");
  const [resetError, setResetError] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(username, password);
    } catch {
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault();
    setResetError("");
    setResetSuccess(false);

    if (resetNewPassword.length < 6) {
      setResetError("Password must be at least 6 characters");
      return;
    }

    if (resetNewPassword !== resetConfirmPassword) {
      setResetError("Passwords do not match");
      return;
    }

    setResetLoading(true);
    try {
      await api.auth.resetPassword(resetUsername, resetNewPassword);
      setResetSuccess(true);
      setResetUsername("");
      setResetNewPassword("");
      setResetConfirmPassword("");
      setTimeout(() => {
        setShowForgotPassword(false);
        setResetSuccess(false);
      }, 2000);
    } catch {
      setResetError("Failed to reset password. Username not found.");
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sand-100 to-sand-200 dark:from-charcoal-950 dark:to-charcoal-900 p-4">
      <Card className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-center mb-8 text-charcoal-800 dark:text-sand-100">
          payme
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <div className="text-sm text-terracotta-600 dark:text-terracotta-400">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <button
            onClick={() => setShowForgotPassword(true)}
            className="text-sm text-charcoal-500 hover:text-charcoal-700 dark:text-charcoal-400 dark:hover:text-sand-300 block w-full"
          >
            Forgot password?
          </button>
          <button
            onClick={onSwitchToRegister}
            className="text-sm text-charcoal-500 hover:text-charcoal-700 dark:text-charcoal-400 dark:hover:text-sand-300 block w-full"
          >
            Create account
          </button>
        </div>
      </Card>

      <Modal
        isOpen={showForgotPassword}
        onClose={() => {
          setShowForgotPassword(false);
          setResetUsername("");
          setResetNewPassword("");
          setResetConfirmPassword("");
          setResetError("");
          setResetSuccess(false);
        }}
        title="Reset Password"
      >
        <form onSubmit={handleResetPassword} className="space-y-4">
          <p className="text-sm text-charcoal-600 dark:text-charcoal-300">
            Enter your username and choose a new password.
          </p>
          
          <Input
            type="text"
            placeholder="Username"
            value={resetUsername}
            onChange={(e) => setResetUsername(e.target.value)}
            required
            disabled={resetLoading || resetSuccess}
          />
          
          <Input
            type="password"
            placeholder="New Password"
            value={resetNewPassword}
            onChange={(e) => setResetNewPassword(e.target.value)}
            required
            disabled={resetLoading || resetSuccess}
          />
          
          <Input
            type="password"
            placeholder="Confirm New Password"
            value={resetConfirmPassword}
            onChange={(e) => setResetConfirmPassword(e.target.value)}
            required
            disabled={resetLoading || resetSuccess}
          />

          {resetError && (
            <p className="text-sm text-terracotta-600">{resetError}</p>
          )}
          
          {resetSuccess && (
            <p className="text-sm text-sage-600">Password reset successfully! Redirecting...</p>
          )}

          <div className="flex flex-col sm:flex-row gap-2">
            <Button type="submit" disabled={resetLoading || resetSuccess} className="w-full sm:w-auto">
              {resetLoading ? "Resetting..." : "Reset Password"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setShowForgotPassword(false);
                setResetUsername("");
                setResetNewPassword("");
                setResetConfirmPassword("");
                setResetError("");
                setResetSuccess(false);
              }}
              disabled={resetLoading}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}


"use client";

export default function LogoutButton() {
  const logout = async () => {
    await fetch("/api/login", { method: "DELETE" });
    window.location.href = "/login";
  };
  return (
    <button
      onClick={logout}
      className="text-xs text-text-secondary hover:text-danger transition-colors"
    >
      Sign out
    </button>
  );
}

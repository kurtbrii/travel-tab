"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (res.ok) {
        router.push("/"); // Refresh the page to update auth state
      } else {
        alert("Failed to logout. Please try again.");
      }
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Network error. Please check your connection and try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Button onClick={handleLogout} variant="outline" size="sm" disabled={isLoggingOut}>
      {isLoggingOut ? "Logging out..." : "Logout"}
    </Button>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { logout } from "@/app/_lib/auth-api";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/auth");
    router.refresh();
  };

  return (
    <Button
      variant="ghost"
      onClick={handleLogout}
      className="gap-2 text-destructive hover:text-destructive"
    >
      <span className="font-heading text-base font-semibold">
        Sair da conta
      </span>
      <LogOut className="size-4" />
    </Button>
  );
}

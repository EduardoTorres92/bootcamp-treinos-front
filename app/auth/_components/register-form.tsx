"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { register } from "@/app/_lib/auth-api";

export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres");
      return;
    }
    setLoading(true);
    const result = await register(name.trim(), email.trim(), password);
    setLoading(false);
    if ("error" in result) {
      setError(result.error);
      return;
    }
    router.push("/");
    router.refresh();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-sm flex-col gap-4"
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          type="text"
          placeholder="Seu nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoComplete="name"
          className="bg-background"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          className="bg-background"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Senha (mín. 6 caracteres)</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          autoComplete="new-password"
          className="bg-background"
        />
      </div>
      {error && (
        <p className="font-heading text-sm text-destructive">{error}</p>
      )}
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Cadastrando..." : "Criar conta"}
      </Button>
      <p className="font-heading text-center text-sm text-primary-foreground/80">
        Já tem conta?{" "}
        <Link href="/auth" className="underline">
          Entrar
        </Link>
      </p>
    </form>
  );
}

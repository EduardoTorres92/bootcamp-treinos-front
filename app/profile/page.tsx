import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/app/_lib/auth-api";
import { getUserTrainData, getHomeData } from "@/app/_lib/api/fetch-generated";
import dayjs from "dayjs";
import { BottomNav } from "@/app/_components/bottom-nav";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Weight, Ruler, BicepsFlexed, User } from "lucide-react";
import { LogoutButton } from "./_components/logout-button";

export default async function ProfilePage() {
  const session = await getSession();

  if (!session.data?.user) redirect("/auth");

  const [trainData, homeData] = await Promise.all([
    getUserTrainData(),
    getHomeData(dayjs().format("YYYY-MM-DD")),
  ]);

  if (trainData.status !== 200) {
    throw new Error("Failed to fetch user train data");
  }

  const needsOnboarding =
    (homeData.status === 200 && !homeData.data.activeWorkoutPlanId) ||
    !trainData.data;

  const user = session.data.user;
  const data = trainData.data;

  const weightInKg = data ? data.weightInGrams / 1000 : null;
  const heightInCm = data?.heightInCentimeters ?? null;
  const bodyFatPercentage = data?.bodyFatPercentage ?? null;
  const age = data?.age ?? null;

  return (
    <div className="flex min-h-svh flex-col bg-background pb-24">
      <div className="flex h-[56px] items-center px-5">
        <p
          className="text-[22px] uppercase leading-[1.15] text-foreground"
          style={{ fontFamily: "var(--font-anton)" }}
        >
          Fit.ai
        </p>
      </div>

      <div className="flex flex-col items-center gap-5 px-5 pt-5">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="size-[52px]">
              <AvatarImage src={user.image ?? undefined} alt={user.name} />
              <AvatarFallback className="text-lg">
                {user.name?.charAt(0)?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1.5">
              <h1 className="font-heading text-lg font-semibold leading-[1.05] text-foreground">
                {user.name}
              </h1>
              <p className="font-heading text-sm leading-[1.15] text-foreground/70">
                {data ? "Plano Básico" : "Sem dados de treino"}
              </p>
            </div>
          </div>
        </div>

        {needsOnboarding && (
          <div className="mb-4 w-full rounded-xl border border-primary/20 bg-primary/5 p-4">
            <p className="font-heading text-sm text-foreground">
              Configure seu perfil e plano para acompanhar sua evolução.
            </p>
            <Button asChild size="sm" className="mt-2">
              <Link href="/onboarding">Configurar agora</Link>
            </Button>
          </div>
        )}

        <div className="grid w-full grid-cols-2 gap-3">
          <div className="flex flex-col items-center gap-5 rounded-xl bg-primary/8 p-5">
            <div className="flex items-center rounded-full bg-primary/8 p-[9px]">
              <Weight className="size-4 text-primary" />
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <span className="font-heading text-2xl font-semibold leading-[1.15] text-foreground">
                {weightInKg ?? "-"}
              </span>
              <span className="font-heading text-xs uppercase leading-[1.4] text-muted-foreground">
                Kg
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-5 rounded-xl bg-primary/8 p-5">
            <div className="flex items-center rounded-full bg-primary/8 p-[9px]">
              <Ruler className="size-4 text-primary" />
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <span className="font-heading text-2xl font-semibold leading-[1.15] text-foreground">
                {heightInCm ?? "-"}
              </span>
              <span className="font-heading text-xs uppercase leading-[1.4] text-muted-foreground">
                Cm
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-5 rounded-xl bg-primary/8 p-5">
            <div className="flex items-center rounded-full bg-primary/8 p-[9px]">
              <BicepsFlexed className="size-4 text-primary" />
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <span className="font-heading text-2xl font-semibold leading-[1.15] text-foreground">
                {bodyFatPercentage != null ? `${bodyFatPercentage}%` : "-"}
              </span>
              <span className="font-heading text-xs uppercase leading-[1.4] text-muted-foreground">
                Gc
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-5 rounded-xl bg-primary/8 p-5">
            <div className="flex items-center rounded-full bg-primary/8 p-[9px]">
              <User className="size-4 text-primary" />
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <span className="font-heading text-2xl font-semibold leading-[1.15] text-foreground">
                {age ?? "-"}
              </span>
              <span className="font-heading text-xs uppercase leading-[1.4] text-muted-foreground">
                Anos
              </span>
            </div>
          </div>
        </div>

        <LogoutButton />
      </div>

      <BottomNav activePage="profile" />
    </div>
  );
}

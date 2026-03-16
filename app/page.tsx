import { redirect } from "next/navigation";
import { getSession } from "@/app/_lib/auth-api";
import { getHomeData, getUserTrainData } from "./_lib/api/fetch-generated";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import { Flame, Sparkles } from "lucide-react";
import { BottomNav } from "./_components/bottom-nav";
import { ConsistencyTracker } from "./_components/consistency-tracker";
import { WorkoutDayCard } from "./_components/workout-day-card";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const session = await getSession();

  if (!session.data?.user) redirect("/auth");

  const today = dayjs();
  const [homeData, trainData] = await Promise.all([
    getHomeData(today.format("YYYY-MM-DD")),
    getUserTrainData(),
  ]);

  if (homeData.status === 401) redirect("/auth");
  if (homeData.status !== 200 && homeData.status !== 404) {
    throw new Error("Failed to fetch home data");
  }

  const hasPlan =
    homeData.status === 200 &&
    homeData.data.activeWorkoutPlanId &&
    trainData.status === 200 &&
    trainData.data;
  const userName = session.data?.user?.name?.split(" ")[0] ?? "";

  // Sem plano ou sem dados de treino: mostra home com CTA para onboarding (sem redirecionar)
  if (!hasPlan) {
    return (
      <div className="flex min-h-svh flex-col bg-background pb-24">
        <div className="relative flex h-[296px] shrink-0 flex-col items-start justify-between overflow-hidden rounded-b-[20px] px-5 pb-10 pt-5">
          <div className="absolute inset-0" aria-hidden="true">
            <Image
              src="/home-banner.jpg"
              alt=""
              fill
              className="object-cover"
              priority
            />
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(243deg, rgba(0,0,0,0) 34%, rgb(0,0,0) 100%)",
              }}
            />
          </div>
          <p
            className="relative text-[22px] uppercase leading-[1.15] text-background"
            style={{ fontFamily: "var(--font-anton)" }}
          >
            Fit.ai
          </p>
          <div className="relative flex w-full items-end justify-between">
            <div className="flex flex-col gap-1.5">
              <h1 className="font-heading text-2xl font-semibold leading-[1.05] text-background">
                Olá, {userName}
              </h1>
              <p className="font-heading text-sm leading-[1.15] text-background/70">
                Bora treinar hoje?
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center gap-6 px-5 py-10">
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-secondary/50 p-8 text-center">
            <div className="rounded-full bg-primary/10 p-4">
              <Sparkles className="size-10 text-primary" />
            </div>
            <h2 className="font-heading text-lg font-semibold text-foreground">
              Configure seu perfil e plano
            </h2>
            <p className="font-heading text-sm text-muted-foreground">
              Para ver seus treinos e acompanhar sua evolução, configure seus
              dados e crie um plano com a nossa IA.
            </p>
            <Button asChild className="mt-2">
              <Link href="/onboarding">Configurar agora</Link>
            </Button>
          </div>
        </div>

        <BottomNav />
      </div>
    );
  }

  const { todayWorkoutDay, workoutStreak, consistencyByDay } = homeData.data;

  return (
    <div className="flex min-h-svh flex-col bg-background pb-24">
      <div className="relative flex h-[296px] shrink-0 flex-col items-start justify-between overflow-hidden rounded-b-[20px] px-5 pb-10 pt-5">
        <div className="absolute inset-0" aria-hidden="true">
          <Image
            src="/home-banner.jpg"
            alt=""
            fill
            className="object-cover"
            priority
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(243deg, rgba(0,0,0,0) 34%, rgb(0,0,0) 100%)",
            }}
          />
        </div>

        <p
          className="relative text-[22px] uppercase leading-[1.15] text-background"
          style={{ fontFamily: "var(--font-anton)" }}
        >
          Fit.ai
        </p>

        <div className="relative flex w-full items-end justify-between">
          <div className="flex flex-col gap-1.5">
            <h1 className="font-heading text-2xl font-semibold leading-[1.05] text-background">
              Olá, {userName}
            </h1>
            <p className="font-heading text-sm leading-[1.15] text-background/70">
              Bora treinar hoje?
            </p>
          </div>
          <div className="rounded-full bg-primary px-4 py-2">
            <span className="font-heading text-sm font-semibold text-primary-foreground">
              Bora!
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 px-5 pt-5">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold text-foreground">
            Consistência
          </h2>
          <button className="font-heading text-xs text-primary">
            Ver histórico
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 rounded-xl border border-border p-5">
            <ConsistencyTracker
              consistencyByDay={consistencyByDay}
              today={today}
            />
          </div>
          <div className="flex items-center gap-2 self-stretch rounded-xl bg-streak px-5 py-2">
            <Flame className="size-5 text-streak-foreground" />
            <span className="font-heading text-base font-semibold text-foreground">
              {workoutStreak}
            </span>
          </div>
        </div>
      </div>

      {todayWorkoutDay && (
        <div className="flex flex-col gap-3 p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-semibold text-foreground">
              Treino de Hoje
            </h2>
            <button className="font-heading text-xs text-primary">
              Ver treinos
            </button>
          </div>

          <Link
            href={`/workout-plans/${todayWorkoutDay.workoutPlanId}/days/${todayWorkoutDay.id}`}
          >
            <WorkoutDayCard
              name={todayWorkoutDay.name}
              weekDay={todayWorkoutDay.weekDay}
              estimatedDurationInSeconds={
                todayWorkoutDay.estimatedDurationInSeconds
              }
              exercisesCount={todayWorkoutDay.exercisesCount}
              coverImageUrl={todayWorkoutDay.coverImageUrl}
            />
          </Link>
        </div>
      )}

      <BottomNav />
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import { Monitor, Users } from "lucide-react";

export const Route = createFileRoute("/_protected/app")({
  head: () => ({ meta: [{ title: `Dashboard | ${siteConfig.name}` }] }),
  component: AppPage,
});

function AppPage() {
  const { user } = Route.useRouteContext().session;

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        {siteConfig.name}
      </h1>
      <p className="mt-2 text-lg text-muted-foreground">
        {siteConfig.description}
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <Card className="p-6">
          <div className="mb-4 flex size-12 items-center justify-center rounded-xl border bg-primary/10">
            <Monitor className="size-6 text-primary" />
          </div>
          <h2 className="text-xl font-semibold">Layar Operator Semifinal</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Kelola pertandingan semifinal dengan kontrol skor, timer, babak, dan
            ronde untuk setiap slot.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="default" size="sm" asChild>
              <Link to="/operator/semifinal/$slotId" params={{ slotId: "slot-semi-1" }}>
                Slot 1
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/operator/semifinal/$slotId" params={{ slotId: "slot-semi-2" }}>
                Slot 2
              </Link>
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-4 flex size-12 items-center justify-center rounded-xl border bg-primary/10">
            <Users className="size-6 text-primary" />
          </div>
          <h2 className="text-xl font-semibold">Layar Operator Final</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Kelola pertandingan final dengan format Estafet, Redzone, dan Rebutan.
          </p>
          <Button variant="outline" size="sm" disabled className="mt-4">
            Segera Hadir
          </Button>
        </Card>
      </div>

      <p className="mt-8 text-sm text-muted-foreground">
        Signed in as {user.name} ({user.email})
      </p>
    </div>
  );
}

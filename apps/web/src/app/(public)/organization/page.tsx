import type { Metadata } from "next";

import { ConsoleSurface } from "@/components/ConsoleSurface";
import { Card } from "@/components/ui";
import orgChartData from "@/organization/org-chart.json";
import type { OrgChart, OrgPerson } from "@/organization/types";

const org: OrgChart = orgChartData;

export const metadata: Metadata = {
  title: "Organization — FOAI",
  description:
    "How the Finance & Operations AI Initiative is organized: sponsor, lead, and team.",
};

export default function OrganizationPage() {
  const { sponsor, lead, interns } = org;

  return (
    <ConsoleSurface
      as="section"
      tone="dark"
      className="flex flex-1 flex-col"
      contentClassName="mx-auto max-w-5xl px-4 pb-20 pt-12 sm:px-6 lg:pt-16"
    >
      <div className="mx-auto max-w-2xl text-center">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-carolina">
          FOAI · Organization
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">
          The team behind FOAI
        </h1>
        <p className="mt-3 text-base leading-7 text-cloud">
          A small, deliberately lean team drives the initiative — a sponsor for executive backing,
          a lead for day-to-day direction, and interns who help build it.
        </p>
      </div>

      <div className="mt-16 flex justify-center sm:justify-start">
        <PersonNode person={sponsor} tone="sponsor" />
      </div>

      <div className="mt-20 flex flex-col items-center">
        <PersonNode person={lead} tone="lead" />
      </div>

      <div className="mt-4">
        <span
          aria-hidden="true"
          className="mx-auto block h-12 w-px bg-gradient-to-b from-carolina/70 to-carolina/20"
        />
        {interns.length > 0 ? (
          <>
            <span
              aria-hidden="true"
              className="mx-auto block h-px max-w-3xl bg-carolina/30"
            />
            <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-12">
              {interns.map((intern, index) => (
                <div
                  className="relative flex flex-col items-center"
                  key={`${intern.name}-${index}`}
                >
                  <span
                    aria-hidden="true"
                    className="absolute -top-10 h-10 w-px bg-carolina/30"
                  />
                  <PersonNode person={intern} tone="intern" />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="mt-10 flex justify-center">
            <Card className="max-w-sm border-dashed border-white/25 bg-white/[0.04] text-center">
              <p className="font-semibold text-white">Intern seats open</p>
              <p className="mt-1 text-sm text-cloud">
                The team is forming — reach out to get involved.
              </p>
            </Card>
          </div>
        )}
      </div>

      <p className="mt-20 text-center font-mono text-xs uppercase tracking-[0.14em] text-cloud/70">
        Currently: 1 sponsor · 1 lead · {interns.length}{" "}
        {interns.length === 1 ? "intern" : "interns"}
      </p>
    </ConsoleSurface>
  );
}

function PersonNode({
  person,
  tone,
}: {
  person: OrgPerson;
  tone: "sponsor" | "lead" | "intern";
}) {
  if (tone === "lead") {
    return (
      <Card className="w-full max-w-xs border-carolina/60 bg-white/[0.08] text-center shadow-[0_0_32px_var(--color-console-glow-soft)] backdrop-blur">
        <p className="text-xl font-semibold text-white">{person.name}</p>
        <p className="mt-1 text-sm text-carolina">{person.role}</p>
      </Card>
    );
  }

  if (tone === "sponsor") {
    return (
      <Card className="w-full max-w-[15rem] border-white/15 bg-white/[0.05] text-center backdrop-blur">
        <p className="text-base font-semibold text-white">{person.name}</p>
        <p className="mt-0.5 text-xs text-cloud/80">{person.role}</p>
      </Card>
    );
  }

  return (
    <Card className="w-40 border-white/15 bg-white/[0.05] text-center backdrop-blur">
      <p className="text-sm font-semibold text-white">{person.name}</p>
      <p className="mt-0.5 text-xs text-cloud/80">{person.role}</p>
    </Card>
  );
}

"use client";

import { ConsoleSurface } from "@/components/ConsoleSurface";
import { Badge, Button, ButtonLink, Card } from "@/components/ui";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useSignedInRedirect } from "@/lib/auth/useSignedInRedirect";

const journeyStages = [
  {
    label: "Familiar",
    copy: "See what AI can, and can't, do for the work Finance & Operations already does every day.",
  },
  {
    label: "Literate",
    copy: "Use approved tools with confidence, starting with Nimbus, the initiative's flagship workspace.",
  },
];

const committeeMandate =
  "Committee members review Nimbus usage and project metrics to decide which Finance & Operations AI use cases move forward next.";

type CommitteeMember = {
  name: string;
  role: string;
  /** Set on the member who chairs the committee; renders a "Chair" badge. */
  chair?: boolean;
};

const committeeMembers: CommitteeMember[] = [
  { name: "Alex Azad", role: "Executive Director · F&O IT" },
  { name: "Mogan Glenn", role: "IT Security Office" },
  { name: "Rich Arnold", role: "Senior Director · Human Resources Information Management" },
  { name: "Nicole \u0160ebik", role: "Director of Financial Data Analytics and Reporting" },
  { name: "Chris Dobek", role: "Director · Transportation and Parking" },
];

/** First and last initial, e.g. "Nicole \u0160ebik" -> "N\u0160". */
function initialsOf(name: string): string {
  const words = name.split(/\s+/).filter(Boolean);
  const first = words.at(0)?.charAt(0) ?? "";
  const last = words.length > 1 ? (words.at(-1)?.charAt(0) ?? "") : "";
  return `${first}${last}`.toUpperCase();
}

export default function PublicLandingPage() {
  // A signed-in visitor landing here already has a session — send them to the
  // app instead of showing them the sign-in pitch a second time.
  useSignedInRedirect("/home");

  return (
    <>
      <Hero />
      <SteeringCommittee />
      <Contact />
    </>
  );
}

function Hero() {
  const { isAuthenticated, login } = useAuth();

  return (
    <ConsoleSurface
      as="section"
      id="initiative"
      tone="hero"
      contentClassName="mx-auto grid min-h-screen w-full max-w-6xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:py-16"
    >
      <div className="max-w-2xl">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-cloud shadow-sm backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-carolina shadow-[0_0_18px_var(--color-console-glow)]" />
          FO-AI · Finance &amp; Operations AI Initiative
        </div>

        <h1 className="max-w-2xl text-4xl font-semibold leading-tight tracking-normal text-white sm:text-5xl lg:text-[3.45rem] lg:leading-[1.03]">
          Building AI fluency across Finance &amp; Operations.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-cloud sm:text-lg">
          FO-AI is UNC&apos;s initiative to help Finance &amp; Operations staff get familiar with AI,
          then confident using the tools that matter for our work.
        </p>

        <Card className="mt-8 max-w-md border-white/15 bg-white/[0.07] p-4 shadow-none backdrop-blur">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-carolina">
            Flagship product
          </p>
          <h2 className="mt-1 text-lg font-semibold text-white">Nimbus</h2>
          <p className="mt-2 text-sm leading-6 text-cloud">
            Guides, reusable prompts, and a grounded assistant, in one secure workspace for Finance
            &amp; Operations.
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
            {isAuthenticated ? (
              <ButtonLink
                href="/home"
                className="border-carolina bg-carolina text-navy shadow-[0_0_28px_var(--color-console-glow-soft)] hover:bg-[#64afe3]"
              >
                Open Nimbus
              </ButtonLink>
            ) : (
              <>
                <Button
                  className="border-carolina bg-carolina text-navy shadow-[0_0_28px_var(--color-console-glow-soft)] hover:bg-[#64afe3]"
                  type="button"
                  onClick={() => login("/home")}
                >
                  Sign in with Microsoft
                </Button>
                <p className="text-xs font-medium text-cloud/85">Organization account required</p>
              </>
            )}
          </div>
        </Card>
      </div>

      <JourneyPanel />
    </ConsoleSurface>
  );
}

function JourneyPanel() {
  return (
    <ConsoleSurface
      aria-label="The FOAI path, from familiar to literate"
      tone="panel"
      className="p-3"
      contentClassName="rounded-lg border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.04))] p-6"
    >
      <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-carolina">
        The FOAI path
      </p>
      <h2 className="mt-1 text-lg font-semibold text-white">From familiar to literate</h2>

      <div className="relative mt-6 flex flex-col gap-6">
        <div
          aria-hidden="true"
          className="absolute bottom-2 left-[13px] top-2 w-px animate-pulse bg-gradient-to-b from-carolina via-carolina/50 to-carolina motion-reduce:animate-none"
        />
        {journeyStages.map((stage) => (
          <div className="relative flex gap-4" key={stage.label}>
            <span className="relative z-10 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-carolina/60 bg-navy shadow-[0_0_14px_var(--color-console-glow-medium)]">
              <span className="h-2 w-2 rounded-full bg-carolina" />
            </span>
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-carolina">
                {stage.label}
              </p>
              <p className="mt-1 text-sm leading-6 text-cloud">{stage.copy}</p>
            </div>
          </div>
        ))}
      </div>
    </ConsoleSurface>
  );
}

function SteeringCommittee() {
  return (
    <section id="steering-committee" className="bg-background px-4 py-20 sm:px-6 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-carolina">
            Governance
          </p>
          <h2 className="mt-2 text-2xl sm:text-3xl">The Steering Committee</h2>
          <p className="mt-3 text-base text-muted">{committeeMandate}</p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {committeeMembers.map((member, index) => (
            <Card className="flex items-start gap-4" key={`${member.name}-${index}`}>
              <span
                aria-hidden="true"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cloud font-mono text-sm font-semibold text-navy"
              >
                {initialsOf(member.name)}
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-navy">{member.name}</p>
                  {member.chair ? <Badge variant="primary">Chair</Badge> : null}
                </div>
                <p className="mt-0.5 text-sm text-muted">{member.role}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <ConsoleSurface
      as="section"
      id="contact"
      tone="dark"
      className="flex flex-1 flex-col justify-center"
      contentClassName="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:py-24"
    >
      <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-carolina">
        Get in touch
      </p>

      <div className="mt-2 grid gap-12 md:grid-cols-2 lg:gap-16">
        <div>
          <h2 className="text-2xl text-white sm:text-3xl">Reach the FO-AI team</h2>
          <p className="mt-3 text-base leading-7 text-cloud">
            Questions about the initiative or Nimbus access? We&apos;re here.
          </p>

          <div className="mt-8 rounded-xl border border-white/15 bg-white/[0.07] p-6 backdrop-blur">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-carolina">
              Email
            </p>
            <p className="mt-1 text-lg font-semibold text-white">fo-ai-team@unc.edu</p>
            <p className="mt-4 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-carolina">
              Department
            </p>
            <p className="mt-1 text-sm text-cloud">
              Office of the Vice Chancellor Finance and Operations
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-2xl text-white sm:text-3xl">Propose an AI use case?</h2>
          <p className="mt-3 text-base leading-7 text-cloud">
            Please sign in to Nimbus and use the “Propose an AI use case” button.
          </p>
        </div>
      </div>
    </ConsoleSurface>
  );
}

import { Button } from "@/components/ui";
import { ApiError } from "@/lib/api/client";
import { SUPPORT_EMAIL } from "@/lib/config";

interface ErrorStateProps {
  error: unknown;
  onRetry?: () => void;
  /** Defaults to "Try again"; pass e.g. "Dismiss" where retrying is not the action. */
  retryLabel?: string;
  /** Extra guidance for form submissions, where the user's typed input is at stake. */
  hint?: string;
}

/**
 * A friendly error box. The correlation id is the one thing support can act on,
 * so it is presented as "quote this reference" rather than as a bare
 * "Correlation ID:" that means nothing to a non-technical reader.
 */
export function ErrorState({ error, onRetry, retryLabel = "Try again", hint }: ErrorStateProps) {
  const message =
    error instanceof ApiError
      ? error.message
      : error instanceof Error
        ? error.message
        : "Something went wrong.";
  const correlationId = error instanceof ApiError ? error.correlationId : undefined;

  return (
    <div
      className="rounded-xl border border-danger/20 bg-danger-bg px-4 py-3 text-sm text-danger"
      role="alert"
    >
      <strong className="font-semibold">Something went wrong.</strong> {message}
      {hint ? <p className="mt-1 text-danger/85">{hint}</p> : null}
      {correlationId ? (
        <p className="mt-2 text-xs text-danger/75">
          If this keeps happening, email{" "}
          <a className="text-danger underline" href={`mailto:${SUPPORT_EMAIL}`}>
            {SUPPORT_EMAIL}
          </a>{" "}
          and quote reference <code className="font-mono">{correlationId}</code>.
        </p>
      ) : null}
      {onRetry ? (
        <div className="mt-3">
          <Button variant="secondary" size="sm" onClick={onRetry} type="button">
            {retryLabel}
          </Button>
        </div>
      ) : null}
    </div>
  );
}

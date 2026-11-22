import {
  DEFAULT_RSVP,
  formatEventDate,
  todayInNewJersey,
  type Gathering,
  type UpcomingEvent
} from "@/lib/events";

function RsvpButton({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`RSVP for ${label} (opens a sign-up form in a new tab)`}
      className="btn-gold mt-5"
    >
      RSVP
    </a>
  );
}

/** Snapshot of the next scheduled gathering, with an RSVP button to its Google Form. */
export default function NextEvent({
  gathering,
  event
}: {
  gathering: Gathering;
  event?: UpcomingEvent;
}) {
  if (!event) {
    return (
      <div className="mt-8 rounded-xl border border-white/10 bg-white/[0.03] p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
          Next gathering
        </p>
        <p className="mt-2 text-sm text-mist">
          The next date is coming soon.{" "}
          <a href="#calendar" className="font-medium text-gold transition hover:text-goldpale">
            Check the calendar
          </a>
          .
        </p>
        <RsvpButton href={DEFAULT_RSVP[gathering]} label="the next gathering" />
      </div>
    );
  }

  const when = [formatEventDate(event.date, todayInNewJersey()), event.time]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="mt-8 rounded-xl border border-gold/30 bg-gold/[0.06] p-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
        Next gathering
      </p>
      <p className="mt-2 font-display text-xl text-bone">{when}</p>
      {event.title && <p className="mt-1 font-medium text-parchment">{event.title}</p>}
      {event.location && <p className="mt-1 text-sm text-mist">{event.location}</p>}
      {event.summary && (
        <p className="mt-3 text-sm leading-relaxed text-mist">{event.summary}</p>
      )}
      {event.rsvpUrl && <RsvpButton href={event.rsvpUrl} label={event.title || when} />}
    </div>
  );
}

import { Gtk } from "ags/gtk4";
import { createComputed, createEffect, createState, For, type Accessor } from "gnim";
import GLib from "gi://GLib?version=2.0";

const WEEKDAYS = ["一", "二", "三", "四", "五", "六", "日"]; // week starts Monday
const CALENDAR_WIDTH = 220; // fixed so the popover never resizes when the month changes
// NOTE: keep icon codepoints in JS expressions, never in a JSX string attribute —
// esbuild does not decode `\u{...}` escapes in JSX string literals.
const CHEVRON_LEFT = "\u{f053}"; // nf-fa-chevron_left
const CHEVRON_RIGHT = "\u{f054}"; // nf-fa-chevron_right

type Cell = {
  day: number;
  inMonth: boolean;
  today: boolean;
  weekend: boolean;
};

function firstOfMonth(d: GLib.DateTime) {
  return GLib.DateTime.new_local(d.get_year(), d.get_month(), 1, 0, 0, 0);
}

function sameDate(a: GLib.DateTime, b: GLib.DateTime) {
  return (
    a.get_year() === b.get_year() &&
    a.get_month() === b.get_month() &&
    a.get_day_of_month() === b.get_day_of_month()
  );
}

function buildWeeks(view: GLib.DateTime): Cell[][] {
  const first = firstOfMonth(view);
  const lead = (first.get_day_of_week() + 6) % 7; // Monday(1)..Sunday(7) -> 0..6
  const start = first.add_days(-lead) ?? first;
  const today = GLib.DateTime.new_now_local();

  const cells: Cell[] = [];
  for (let i = 0; i < 42; i++) {
    const date = start.add_days(i) ?? start;
    cells.push({
      day: date.get_day_of_month(),
      inMonth: date.get_month() === first.get_month(),
      today: sameDate(date, today),
      weekend: date.get_day_of_week() >= 6,
    });
  }

  const weeks: Cell[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

function cellClass(cell: Cell) {
  return [
    "calendar-day",
    cell.inMonth ? "" : "other",
    cell.weekend ? "weekend" : "",
    cell.today ? "today" : "",
  ]
    .filter(Boolean)
    .join(" ");
}

type Props = {
  /** Incremented by the owner each time the popover opens; resets the view. */
  refresh: Accessor<number>;
};

export default function Calendar({ refresh }: Props) {
  const [view, setView] = createState(firstOfMonth(GLib.DateTime.new_now_local()));

  createEffect(() => {
    refresh();
    setView(firstOfMonth(GLib.DateTime.new_now_local()));
  });

  // Zero-padded month keeps the title the same pixel width in every month.
  const title = createComputed(
    () =>
      `${view().get_year()}\u5e74${String(view().get_month()).padStart(2, "0")}\u6708`,
  );
  const weeks = createComputed(() => buildWeeks(view()));

  const shift = (delta: number) => {
    const next = view().add_months(delta);
    if (next) setView(firstOfMonth(next));
  };

  return (
    <box
      class="calendar"
      orientation={Gtk.Orientation.VERTICAL}
      spacing={6}
      widthRequest={CALENDAR_WIDTH}
    >
      <box class="calendar-header" spacing={4}>
        <button class="calendar-nav" onClicked={() => shift(-1)}>
          <label label={CHEVRON_LEFT} />
        </button>
        <label class="calendar-title" hexpand label={title} />
        <button class="calendar-nav" onClicked={() => shift(1)}>
          <label label={CHEVRON_RIGHT} />
        </button>
      </box>
      <box class="calendar-weekdays" spacing={2} homogeneous>
        {WEEKDAYS.map((day) => (
          <label class="calendar-weekday" label={day} />
        ))}
      </box>
      <box class="calendar-grid" orientation={Gtk.Orientation.VERTICAL} spacing={2}>
        <For each={weeks}>
          {(week) => (
            <box class="calendar-week" spacing={2} homogeneous>
              {week.map((cell) => (
                <label class={cellClass(cell)} label={String(cell.day)} />
              ))}
            </box>
          )}
        </For>
      </box>
    </box>
  );
}

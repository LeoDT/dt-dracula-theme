import { Gtk } from "ags/gtk4";
import { createComputed, For } from "gnim";
import { createPoll } from "ags/time";
import AstalIO from "gi://AstalIO?version=0.1";
import Gio from "gi://Gio?version=2.0";
import GLib from "gi://GLib?version=2.0";
import Pango from "gi://Pango?version=1.0";

// Every pi process publishes its state to its own file here (see the
// pi-session-broadcast extension); this widget is a read-only consumer.
const SESSIONS_DIR = "/tmp/pi-sessions";
const PANEL_WIDTH = 320;
// Keep codepoints in JS expressions, never in a JSX string attribute: esbuild
// does not decode `\u{...}` escapes in JSX string literals.
// Greek pi rendered by the bar's own font — nerd-font pi glyphs overflow their
// advance width and sit off-centre.
const PI_GLYPH = "\u03c0";

type PiSession = {
  pid: number;
  status: "busy" | "idle";
  sessionName: string;
  cwd: string;
  model: string;
  contextPercent: number | null;
};

function baseName(path: string): string {
  const trimmed = path.replace(/\/+$/, "");
  const slash = trimmed.lastIndexOf("/");
  return slash >= 0 ? trimmed.slice(slash + 1) : trimmed;
}

function readSessions(): PiSession[] {
  GLib.mkdir_with_parents(SESSIONS_DIR, 0o755);

  const dir = Gio.File.new_for_path(SESSIONS_DIR);
  const sessions: PiSession[] = [];

  let names: string[];
  try {
    const enumerator = dir.enumerate_children(
      "standard::name,standard::type",
      Gio.FileQueryInfoFlags.NONE,
      null,
    );
    names = [];
    let info: Gio.FileInfo | null;
    while ((info = enumerator.next_file(null))) {
      if (info.get_file_type() === Gio.FileType.REGULAR) names.push(info.get_name());
    }
  } catch {
    return sessions;
  }

  for (const name of names) {
    if (!name.endsWith(".json")) continue;
    const stem = name.slice(0, -5);
    if (!/^\d+$/.test(stem)) {
      try {
        dir.get_child(name).delete(null);
      } catch {}
      continue;
    }
    const pid = Number(stem);

    // A crashed pi never gets to remove its file; drop it once the process is
    // gone (the extension cleans up normally on shutdown).
    if (!GLib.file_test(`/proc/${pid}`, GLib.FileTest.EXISTS)) {
      try {
        dir.get_child(name).delete(null);
      } catch {}
      continue;
    }

    try {
      const parsed: unknown = JSON.parse(AstalIO.read_file(`${SESSIONS_DIR}/${name}`));
      // Valid JSON that is not an object carries no session state.
      if (!parsed || typeof parsed !== "object") continue;
      const raw = parsed as Record<string, unknown>;
      sessions.push({
        pid,
        status: raw.status === "busy" ? "busy" : "idle",
        sessionName: typeof raw.sessionName === "string" ? raw.sessionName : "",
        cwd: typeof raw.cwd === "string" ? raw.cwd : "",
        model: typeof raw.model === "string" ? raw.model : "",
        contextPercent: typeof raw.contextPercent === "number" ? raw.contextPercent : null,
      });
    } catch {
      // Malformed or half-read file: skip it, the next write will fix it.
    }
  }

  sessions.sort(
    (a, b) =>
      Number(b.status === "busy") - Number(a.status === "busy") ||
      (a.sessionName || a.cwd).localeCompare(b.sessionName || b.cwd),
  );
  return sessions;
}

function sessionsEqual(a: PiSession[], b: PiSession[]): boolean {
  return (
    a.length === b.length &&
    a.every((s, i) => {
      const t = b[i];
      return (
        s.pid === t.pid &&
        s.status === t.status &&
        s.sessionName === t.sessionName &&
        s.cwd === t.cwd &&
        s.model === t.model &&
        s.contextPercent === t.contextPercent
      );
    })
  );
}

// Poll like the Clock widget does. A Gio.FileMonitor would be event-driven, but
// AGS does not deliver its events here (a dead session file written while the
// bar runs is never picked up), so it cannot be relied on. Returning the
// previous array when nothing changed keeps an idle bar from re-rendering.
const POLL_MS = 1000;
const sessions = createPoll<PiSession[]>([], POLL_MS, (prev) => {
  const next = readSessions();
  return sessionsEqual(prev, next) ? prev : next;
});

function PiRow({ pid }: { pid: number }) {
  // `For` reuses a row by key without refreshing its item, so read the live
  // session out of the state instead of capturing it.
  const session = createComputed(() => sessions().find((s) => s.pid === pid));
  const name = createComputed(() => {
    const s = session();
    return s?.sessionName || (s?.cwd ? baseName(s.cwd) : "") || "(未命名)";
  });
  const cwd = createComputed(() => session()?.cwd ?? "");
  const status = createComputed(() => session()?.status ?? "idle");
  const statusClass = createComputed(() => `pi-status ${status()}`);
  const meta = createComputed(() => {
    const s = session();
    if (!s) return "";
    return [
      s.model,
      s.contextPercent != null ? `${Math.round(s.contextPercent)}%` : "",
    ]
      .filter(Boolean)
      .join(" · ");
  });

  return (
    <box class="pi-row" orientation={Gtk.Orientation.VERTICAL} spacing={2}>
      <box spacing={6}>
        <label
          class="pi-name"
          label={name}
          hexpand
          xalign={0}
          maxWidthChars={24}
          ellipsize={Pango.EllipsizeMode.END}
        />
        <label class={statusClass} label={status} />
      </box>
      <label
        class="pi-cwd"
        label={cwd}
        xalign={0}
        maxWidthChars={36}
        ellipsize={Pango.EllipsizeMode.END}
      />
      <label
        class="pi-meta"
        label={meta}
        visible={meta(s => s !== "")}
        xalign={0}
        maxWidthChars={36}
        ellipsize={Pango.EllipsizeMode.END}
      />
    </box>
  );
}

export default function PiStatus() {
  const busy = createComputed(() => sessions().filter((s) => s.status === "busy").length);
  const buttonClass = createComputed(
    () => `status-button pi ${busy() > 0 ? "busy" : "idle"}`,
  );
  const title = createComputed(
    () => `Pi 会话 · ${sessions().length} 个（${busy()} busy）`,
  );
  const empty = createComputed(() => sessions().length === 0);

  return (
    <menubutton class={buttonClass} valign={Gtk.Align.CENTER} alwaysShowArrow={false}>
      <label class="pi-glyph" label={PI_GLYPH} />
      <popover>
        <box
          class="panel"
          orientation={Gtk.Orientation.VERTICAL}
          spacing={8}
          widthRequest={PANEL_WIDTH}
        >
          <label class="panel-title" label={title} xalign={0} />
          <box orientation={Gtk.Orientation.VERTICAL} spacing={6}>
            <For each={sessions} id={(s) => s.pid}>
              {(s) => <PiRow pid={s.pid} />}
            </For>
            <label class="pi-empty" label="没有正在运行的 pi 会话" visible={empty} xalign={0} />
          </box>
        </box>
      </popover>
    </menubutton>
  );
}

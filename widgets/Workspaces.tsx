import { Gtk } from "ags/gtk4";
import {
  createBinding,
  createComputed,
  createConnection,
  createEffect,
  For,
} from "gnim";
import GLib from "gi://GLib?version=2.0";
import Hyprland from "gi://AstalHyprland";
import { syncSurfaceSize } from "../islands/surfaceSize";
import { WORKSPACE_SPACING } from "../theme/layout";

const hyprland = Hyprland.get_default();

const workspaces = createBinding(hyprland, "workspaces").as((list) =>
  list.filter((ws) => ws.id > 0).sort((a, b) => a.id - b.id),
);
const focused = createBinding(hyprland, "focused_workspace");

// AstalHyprland does not notify `clients`/`workspaces` when a window is moved
// between workspaces, so occupancy is recomputed on every Hyprland event.
// `Workspace.clients` itself is unusable from GJS (weak-pointer conversion),
// hence the filter over `hyprland.clients`.
const events = createConnection(0, [hyprland, "event", (_name, _args, prev) => prev + 1]);

export default function Workspaces() {
  let root: Gtk.Widget | undefined;

  createEffect(() => {
    workspaces();
    if (root)
      GLib.idle_add(GLib.PRIORITY_DEFAULT_IDLE, () => {
        if (root) syncSurfaceSize(root);
        return GLib.SOURCE_REMOVE;
      });
  });

  return (
    <box $={(self: Gtk.Widget) => (root = self)} spacing={WORKSPACE_SPACING}>
      <For each={workspaces} id={(ws) => ws.id}>
        {(ws) => {
          const className = createComputed(() => {
            events();
            const occupied = hyprland.clients.some(
              (client) => client.workspace?.id === ws.id,
            );
            const active = focused()?.id === ws.id;
            return ["workspace", occupied ? "occupied" : "", active ? "active" : ""]
              .filter(Boolean)
              .join(" ");
          });

          // Hyprland 0.56 runs a Lua config provider, where the legacy
          // `dispatch workspace N` IPC is parsed as Lua (`hl.dispatch(workspace N)`)
          // and fails to parse. Send the Lua dispatcher expression instead.
          return (
            <button
              class={className}
              valign={Gtk.Align.CENTER}
              onClicked={() =>
                hyprland.dispatch(`hl.dsp.focus({ workspace = ${ws.id} })`, "")
              }
            >
              <label label={String(ws.id)} />
            </button>
          );
        }}
      </For>
    </box>
  );
}

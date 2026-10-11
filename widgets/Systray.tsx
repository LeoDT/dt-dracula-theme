import { Gtk } from "ags/gtk4";
import { createBinding, createEffect, For } from "gnim";
import GLib from "gi://GLib?version=2.0";
import Tray from "gi://AstalTray";
import TrayItem from "./TrayItem";
import { syncSurfaceSize } from "../islands/surfaceSize";

const tray = Tray.get_default();
const items = createBinding(tray, "items");

export default function Systray() {
  let root: Gtk.Widget | undefined;

  createEffect(() => {
    items();
    if (root)
      GLib.idle_add(GLib.PRIORITY_DEFAULT_IDLE, () => {
        if (root) syncSurfaceSize(root);
        return GLib.SOURCE_REMOVE;
      });
  });

  return (
    <box
      class="tray"
      $={(self: Gtk.Widget) => (root = self)}
      valign={Gtk.Align.CENTER}
      spacing={6}
    >
      <For each={items} id={(item) => item.item_id}>
        {(item) => <TrayItem item={item} />}
      </For>
    </box>
  );
}

import { Gtk } from "ags/gtk4";
import { createPoll } from "ags/time";
import { createState } from "gnim";
import GLib from "gi://GLib?version=2.0";
import Calendar from "./Calendar";

const time = createPoll("", 1000, () =>
  GLib.DateTime.new_now_local().format("%Y-%m-%d %H:%M") ?? "",
);

export default function Clock() {
  const [opened, setOpened] = createState(0);

  return (
    <menubutton
      class="status-button"
      valign={Gtk.Align.CENTER}
      alwaysShowArrow={false}
    >
      <label label={time} />
      <popover
        onNotifyVisible={(self: Gtk.Popover) => {
          if (self.visible) setOpened((n) => n + 1);
        }}
      >
        <box class="panel">
          <Calendar refresh={opened} />
        </box>
      </popover>
    </menubutton>
  );
}

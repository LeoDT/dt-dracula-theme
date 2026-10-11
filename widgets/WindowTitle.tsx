import { Gtk } from "ags/gtk4";
import { createBinding } from "gnim";
import Pango from "gi://Pango?version=1.0";
import Hyprland from "gi://AstalHyprland";
import { syncSurfaceSize } from "../islands/surfaceSize";

const hyprland = Hyprland.get_default();
const title = createBinding(hyprland, "focused_client", "title").as((value) => value ?? "");
const MAX_TITLE_CHARS = 128;

export default function WindowTitle() {
  return (
    <label
      class="title"
      valign={Gtk.Align.CENTER}
      label={title}
      maxWidthChars={MAX_TITLE_CHARS}
      ellipsize={Pango.EllipsizeMode.END}
      $={(self: Gtk.Label) =>
        self.connect("notify::label", () => syncSurfaceSize(self))
      }
    />
  );
}

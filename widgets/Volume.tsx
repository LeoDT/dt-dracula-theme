import { Astal, Gtk } from "ags/gtk4";
import { createBinding, createComputed } from "gnim";
import Wp from "gi://AstalWp";

const MUTED = "\u{f026}"; // nf-fa-volume_off
const LOW = "\u{f027}"; // nf-fa-volume_down
const HIGH = "\u{f028}"; // nf-fa-volume_up

const wp = Wp.get_default();
const volume = createBinding(wp, "default_speaker", "volume");
const mute = createBinding(wp, "default_speaker", "mute");

const level = createComputed(() => volume() ?? 0);
const isMuted = createComputed(() => mute() ?? true);
const glyph = createComputed(() =>
  isMuted() || level() === 0 ? MUTED : level() < 0.5 ? LOW : HIGH,
);
// Icon (fixed slot) and number (fixed slot) are separate labels: the icon glyph
// must not shift when the number length changes, and the number must not reflow
// the island. Two fixed slots keep the whole button width constant.
const percent = createComputed(() => `${Math.round(level() * 100)}%`);
const panelTitle = createComputed(() => `Volume  ${Math.round(level() * 100)}%`);
const muteGlyph = createComputed(() => (isMuted() ? MUTED : HIGH));

function adjust(delta: number) {
  const speaker = wp.default_speaker;
  if (!speaker) return;
  speaker.volume = Math.min(1, Math.max(0, speaker.volume + delta));
}

function toggleMute() {
  const speaker = wp.default_speaker;
  if (speaker) speaker.mute = !speaker.mute;
}

export default function Volume() {
  return (
    <menubutton
      class="status-button"
      valign={Gtk.Align.CENTER}
      alwaysShowArrow={false}
      $={(self: Gtk.MenuButton) => {
        const scroll = new Gtk.EventControllerScroll({
          flags: Gtk.EventControllerScrollFlags.VERTICAL,
        });
        scroll.connect("scroll", (_controller, _dx, dy) => {
          adjust(dy > 0 ? -0.05 : 0.05);
          return true;
        });
        self.add_controller(scroll);

        const middle = new Gtk.GestureClick();
        middle.set_button(2);
        middle.connect("pressed", toggleMute);
        self.add_controller(middle);
      }}
    >
      <box spacing={8}>
        <label label={glyph} widthChars={2} xalign={0} />
        <label label={percent} widthChars={4} xalign={0} />
      </box>
      <popover>
        <box
          class="panel"
          orientation={Gtk.Orientation.VERTICAL}
          spacing={10}
          widthRequest={220}
        >
          <label class="panel-title" label={panelTitle} xalign={0} />
          <box spacing={8}>
            <button
              class="panel-icon"
              valign={Gtk.Align.CENTER}
              onClicked={toggleMute}
            >
              <label label={muteGlyph} />
            </button>
            <slider
              hexpand
              valign={Gtk.Align.CENTER}
              min={0}
              max={1}
              step={0.05}
              drawValue={false}
              value={level}
              onValueChanged={(self: Astal.Slider) => {
                const speaker = wp.default_speaker;
                if (speaker) speaker.volume = self.value;
              }}
            />
          </box>
        </box>
      </popover>
    </menubutton>
  );
}

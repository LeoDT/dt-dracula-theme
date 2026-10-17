import { Astal, Gdk, Gtk } from "ags/gtk4";
import Island from "./Island";
import Clock from "../widgets/Clock";
import Systray from "../widgets/Systray";
import PiStatus from "../widgets/PiStatus";
import DeepSeekUsage from "../widgets/DeepSeekUsage";
import Volume from "../widgets/Volume";
import { BAR_GAP_Y, ISLAND_SPACING, SCREEN_GAP_X } from "../theme/layout";

type Props = { monitor: Gdk.Monitor; index: number };

export default function RightIsland({ monitor, index }: Props) {
  const { TOP, RIGHT } = Astal.WindowAnchor;

  return (
    <Island
      name={`right-${index}`}
      monitor={monitor}
      anchor={TOP | RIGHT}
      spacing={ISLAND_SPACING}
      marginTop={BAR_GAP_Y}
      marginRight={SCREEN_GAP_X}
    >
      <Systray />
      <box class="divider" valign={Gtk.Align.CENTER} />
      <PiStatus />
      <DeepSeekUsage />
      <Volume />
      <Clock />
    </Island>
  );
}

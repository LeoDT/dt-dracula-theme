import { Astal, Gdk } from "ags/gtk4";
import Island from "./Island";
import WindowTitle from "../widgets/WindowTitle";
import { BAR_GAP_Y } from "../theme/layout";

type Props = { monitor: Gdk.Monitor; index: number };

export default function CenterIsland({ monitor, index }: Props) {
  const { TOP } = Astal.WindowAnchor;

  return (
    <Island name={`center-${index}`} monitor={monitor} anchor={TOP} marginTop={BAR_GAP_Y}>
      <WindowTitle />
    </Island>
  );
}

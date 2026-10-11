import { Astal, Gdk } from "ags/gtk4";
import Island from "./Island";
import Workspaces from "../widgets/Workspaces";
import { BAR_GAP_Y, SCREEN_GAP_X } from "../theme/layout";

type Props = { monitor: Gdk.Monitor; index: number };

export default function LeftIsland({ monitor, index }: Props) {
  const { TOP, LEFT } = Astal.WindowAnchor;

  return (
    <Island
      name={`left-${index}`}
      monitor={monitor}
      anchor={TOP | LEFT}
      marginTop={BAR_GAP_Y}
      marginLeft={SCREEN_GAP_X}
    >
      <Workspaces />
    </Island>
  );
}

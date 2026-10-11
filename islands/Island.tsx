import app from "ags/gtk4/app";
import { Astal, Gdk } from "ags/gtk4";
import { type Node } from "gnim";
import { ISLAND_HEIGHT } from "../theme/layout";

type IslandProps = {
  name: string;
  monitor: Gdk.Monitor;
  anchor: Astal.WindowAnchor;
  spacing?: number;
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;
  children?: Node;
};

// Shared layer-shell window for one floating island.
//
// Islands use IGNORE exclusivity: they must not reserve space themselves (see
// BarReserve for why) and must stay at their raw anchor+margins instead of being
// pushed around by other surfaces' exclusive zones.
export default function Island({
  name,
  monitor,
  anchor,
  spacing = 0,
  marginTop = 0,
  marginRight = 0,
  marginBottom = 0,
  marginLeft = 0,
  children,
}: IslandProps) {
  return (
    <window
      visible
      name={name}
      namespace={`alucard-${name}`}
      class={`island ${name}`}
      application={app}
      gdkmonitor={monitor}
      anchor={anchor}
      heightRequest={ISLAND_HEIGHT}
      exclusivity={Astal.Exclusivity.IGNORE}
      marginTop={marginTop}
      marginRight={marginRight}
      marginBottom={marginBottom}
      marginLeft={marginLeft}
    >
      <box class="island-content" spacing={spacing}>
        {children}
      </box>
    </window>
  );
}

import app from "ags/gtk4/app";
import { Astal, Gdk } from "ags/gtk4";
import { EXCLUSIVE_ZONE } from "../theme/layout";

type Props = { monitor: Gdk.Monitor; index: number };

/**
 * Invisible 1px-wide surface that reserves the bar row from the top edge.
 *
 * gtk4-layer-shell only computes an exclusive *edge* for a horizontally
 * symmetric or stretched surface; a corner-anchored island (`TOP|LEFT`,
 * `TOP|RIGHT`) resolves to edge 0 and reserves nothing, and its auto zone
 * becomes -1. Anchoring this surface to the centered `TOP` edge makes the zone
 * work, and the islands can stay corner-anchored with `IGNORE`.
 *
 * The strip is 1px wide and centered, so it is hidden behind the center island
 * and cannot capture meaningful input.
 */
export default function BarReserve({ monitor, index }: Props) {
  return (
    <window
      visible
      name={`reserve-${index}`}
      namespace={`alucard-reserve-${index}`}
      application={app}
      gdkmonitor={monitor}
      anchor={Astal.WindowAnchor.TOP}
      heightRequest={EXCLUSIVE_ZONE}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
    >
      <box css="min-width: 1px; min-height: 1px;" />
    </window>
  );
}

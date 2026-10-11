import Gtk from "gi://Gtk?version=4.0";

/**
 * Re-apply an island window's natural size as its default size.
 *
 * gtk4-layer-shell only re-reads a layer surface's natural size when the
 * GtkWindow's default size changes (it hooks `notify::default-width/height`);
 * a child that grows or shrinks on its own does not resize the surface
 * (growing sometimes slips through, shrinking never does). Call this after
 * anything that can change an island's content size so the surface follows.
 */
export function syncSurfaceSize(widget: Gtk.Widget) {
  const root = widget.get_root();
  if (!(root instanceof Gtk.Window)) return;

  const [, natural] = root.get_preferred_size();
  if (!natural || natural.width <= 0 || natural.height <= 0) return;
  root.set_default_size(natural.width, natural.height);
}

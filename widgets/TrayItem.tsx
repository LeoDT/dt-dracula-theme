import Gtk from "gi://Gtk?version=4.0";
import { createBinding, createEffect, onCleanup } from "gnim";
import type Tray from "gi://AstalTray";

const ICON_SIZE = 18;

type Props = { item: Tray.TrayItem };

export default function TrayItem({ item }: Props) {
  const popover = new Gtk.PopoverMenu();
  const menuModel = createBinding(item, "menu_model");
  const actionGroup = createBinding(item, "action_group");

  // The DBusMenu model and its action group arrive asynchronously and can be
  // replaced at runtime, so the popover is kept in sync rather than built once.
  createEffect(() => {
    popover.set_menu_model(menuModel());
    popover.insert_action_group("dbusmenu", actionGroup());
  });

  const showMenu = () => {
    if (!item.menu_model) return;
    item.about_to_show();
    popover.popup();
  };

  // ItemIsMenu: left click opens the menu for menu-only items, otherwise it is
  // forwarded as a normal activation. Right/middle click always use the SNI
  // context-menu / secondary-activate semantics.
  const activate = () => {
    if (item.is_menu) showMenu();
    else item.activate(0, 0);
  };

  return (
    <button
      class="tray-item"
      valign={Gtk.Align.CENTER}
      tooltipText={createBinding(item, "tooltip_text")}
      onClicked={activate}
      $={(self) => setup(self as Gtk.Widget, popover, showMenu, item)}
    >
      <image gicon={createBinding(item, "gicon")} pixelSize={ICON_SIZE} />
    </button>
  );
}

function setup(
  button: Gtk.Widget,
  popover: Gtk.PopoverMenu,
  showMenu: () => void,
  item: Tray.TrayItem,
) {
  popover.set_parent(button);

  // Buttons 2/3 in dedicated controllers so they never compete with the
  // button's own primary-click gesture.
  button.add_controller(gesture(2, () => item.secondary_activate(0, 0)));
  button.add_controller(gesture(3, showMenu));

  const scroll = new Gtk.EventControllerScroll({
    flags: Gtk.EventControllerScrollFlags.VERTICAL,
  });
  scroll.connect("scroll", (_controller, _dx, dy) => {
    item.scroll(dy > 0 ? -1 : 1, "vertical");
    return true;
  });
  button.add_controller(scroll);

  onCleanup(() => popover.unparent());
}

function gesture(button: number, handler: () => void) {
  const controller = new Gtk.GestureClick();
  controller.set_button(button);
  controller.connect("pressed", handler);
  return controller;
}

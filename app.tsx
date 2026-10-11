import app from "ags/gtk4/app";
import style from "./style.scss";
import BarReserve from "./islands/BarReserve";
import LeftIsland from "./islands/LeftIsland";
import CenterIsland from "./islands/CenterIsland";
import RightIsland from "./islands/RightIsland";

app.start({
  css: style,
  main() {
    app.get_monitors().forEach((monitor, index) => {
      BarReserve({ monitor, index });
      LeftIsland({ monitor, index });
      CenterIsland({ monitor, index });
      RightIsland({ monitor, index });
    });
  },
});

# Alucard Shell

Hyprland 顶栏：AGS v3 + Astal + Gnim (TSX)，Dracula Classic。单显示器（3440×1440），
保留 rofi 与 swaync；WiFi / 蓝牙 / 电池不做。

## 运行

本目录即 AGS 配置目录，`~/.config/ags` 是指向它的软链接。

```bash
ags run                       # 前台运行（调试）
systemctl --user restart ags  # 正常重载；AGS 无热重载，改完代码需重启进程
```

开机自启：`~/.config/systemd/user/ags.service`（软链到 `graphical-session.target.wants/`），
随 Hyprland（uwsm）会话启动。`~/.config/hypr/hyprland.lua` 已移除 waybar，保留 swaync。

## 依赖

AGS 3.x、libastal、gtk4-layer-shell、gnim、字体 **Sarasa Term SC**。

## 注意

- AGS 是唯一的 `org.kde.StatusNotifierWatcher`；替换 bar 后，已注册到旧 watcher 的
  应用可能需重启一次。
- 临时脚本放 `.pi/tmp/`（已 gitignore）。

## 开发验证

```bash
~/.local/share/pnpm/bin/tsc --noEmit -p tsconfig.json
sass --no-source-map style.scss /tmp/alucard-style.css
ags bundle app.tsx /tmp/alucard-app.js -g 4
```

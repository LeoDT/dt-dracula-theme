# Dotfiles

本仓库托管的非 AGS 配置（rofi、swaync、alacritty、fish、fcitx5…）。这里的文件是**唯一真源**：
`~/.config`（及 `~/.local/share`）下对应路径是指向本目录的软链接（与 `~/.config/ags` 同一模式），在任一侧
编辑都等于改仓库，天然由 git 记录。

## 配色

原则：**UI 用暗色，长时间阅读的内容用亮色。**

- **Dracula Classic（暗色）——界面**：AGS 顶栏、rofi、swaync、hyprlock。
- **Alucard Classic（亮色）——长读内容**：alacritty、fish，以及外部仓库 `~/github/emacs.d` 的 Emacs 主题（`lisp/alucard-theme.el`）。
- **fcitx5 输入面板**：同时提供两套（`dracula-classic` / `alucard-classic`），按需在 `fcitx5-configtool` 里切换。

窗口边框 / glow 用 Alucard 的 accent（`#644AC9`）与亮色窗口呼应，定义在 `~/.config/hypr/hyprland.lua`（不在本仓库托管范围）。

两套都取自 [`dracula-spec.mdx`](../dracula-spec.mdx)。改色时各按自己的变体更新，不要混用。

## 目录

```
dotfiles/
├── README.md
├── alacritty/
│   ├── alacritty.toml          # 行为配置（import 主题、shell、字体）
│   └── alucard.toml            # Alucard 亮色主题
├── fcitx5/
│   └── themes/
│       ├── dracula-classic/    # Dracula 暗色输入面板（theme.conf + 图标 SVG）
│       └── alucard-classic/    # Alucard 亮色输入面板（theme.conf + 图标 SVG）
├── fish/
│   ├── config.fish             # 行为配置
│   ├── fish_plugins            # fisher 插件清单
│   ├── conf.d/
│   │   ├── alucard_theme.fish  # Alucard 亮色主题（唯一真源）
│   │   ├── fnm.fish
│   │   └── uv.env.fish
│   └── functions/
│       ├── proxy.fish
│       └── qr.fish
├── rofi/
│   ├── config.rasi             # 行为配置
│   └── alucard.rasi            # Dracula Classic 主题（对齐 bar 的语义 token）
└── swaync/
    ├── config.json             # 行为配置
    └── style.css               # Dracula Classic 主题（对齐 bar 的语义 token）
```

## 登记表

| App       | 生效路径                                        | 仓库路径                                        | 链接方式 | 收编 commit（含原始配置） |
| --------- | ----------------------------------------------- | ----------------------------------------------- | -------- | ------------------------- |
| alacritty | `~/.config/alacritty/alacritty.toml`            | `dotfiles/alacritty/alacritty.toml`             | symlink  | 本次收编（未留基线）      |
| alacritty | `~/.config/alacritty/alucard.toml`              | `dotfiles/alacritty/alucard.toml`               | symlink  | 本次收编（未留基线）      |
| fish      | `~/.config/fish/config.fish`                    | `dotfiles/fish/config.fish`                     | symlink  | 本次收编（未留基线）      |
| fish      | `~/.config/fish/fish_plugins`                   | `dotfiles/fish/fish_plugins`                    | symlink  | 本次收编（未留基线）      |
| fish      | `~/.config/fish/conf.d/alucard_theme.fish`      | `dotfiles/fish/conf.d/alucard_theme.fish`       | symlink  | 本次收编（新建，见下）    |
| fish      | `~/.config/fish/conf.d/fnm.fish`                | `dotfiles/fish/conf.d/fnm.fish`                 | symlink  | 本次收编（未留基线）      |
| fish      | `~/.config/fish/conf.d/uv.env.fish`             | `dotfiles/fish/conf.d/uv.env.fish`              | symlink  | 本次收编（未留基线）      |
| fish      | `~/.config/fish/functions/proxy.fish`           | `dotfiles/fish/functions/proxy.fish`            | symlink  | 本次收编（未留基线）      |
| fish      | `~/.config/fish/functions/qr.fish`              | `dotfiles/fish/functions/qr.fish`               | symlink  | 本次收编（未留基线）      |
| fcitx5    | `~/.local/share/fcitx5/themes/dracula-classic`  | `dotfiles/fcitx5/themes/dracula-classic`        | symlink  | —（新建）                 |
| fcitx5    | `~/.local/share/fcitx5/themes/alucard-classic`  | `dotfiles/fcitx5/themes/alucard-classic`        | symlink  | —（新建）                 |
| rofi      | `~/.config/rofi/config.rasi`                    | `dotfiles/rofi/config.rasi`                     | symlink  | `d6723b6`                 |
| rofi      | `~/.config/rofi/alucard.rasi`                   | `dotfiles/rofi/alucard.rasi`                    | symlink  | —（新建）                 |
| swaync    | `~/.config/swaync/config.json`                  | `dotfiles/swaync/config.json`                   | symlink  | `e8c4af7`                 |
| swaync    | `~/.config/swaync/style.css`                    | `dotfiles/swaync/style.css`                     | symlink  | `e8c4af7`                 |

未托管（保持原样）：

- `~/.config/alacritty/dracula.toml`：指向 `~/ghq/.../dracula/alacritty` 的外链，当前 `alacritty.toml` 未 import。
- `~/.config/fish/fish_variables`：运行期 universal 变量（含机器相关路径），不入库。
- `~/.config/fish/functions/fisher.fish`、`~/.config/fish/completions/fisher.fish`：由 fisher 生成/管理。
- `~/.config/fish/config.fish~`：编辑器遗留备份。
- `~/.config/swaync/rose-pine*.css`、`~/.config/swaync/refresh.sh`。

收编 fish 主题时已删除并合并：`~/.config/fish/conf.d/fish_frozen_theme.fish`（fish_config 生成）
与 `~/.config/fish/themes/Alucard.theme`（该目录的文件不会被 fish 自动加载）。两者内容重复，
现统一由 `conf.d/alucard_theme.fish` 提供。

## 安装 / 建立链接

```bash
mkdir -p ~/.config/alacritty ~/.config/fish/conf.d ~/.config/fish/functions

ln -sfn "$PWD/dotfiles/alacritty/alacritty.toml" ~/.config/alacritty/alacritty.toml
ln -sfn "$PWD/dotfiles/alacritty/alucard.toml"   ~/.config/alacritty/alucard.toml

ln -sfn "$PWD/dotfiles/fish/config.fish"               ~/.config/fish/config.fish
ln -sfn "$PWD/dotfiles/fish/fish_plugins"              ~/.config/fish/fish_plugins
ln -sfn "$PWD/dotfiles/fish/conf.d/alucard_theme.fish" ~/.config/fish/conf.d/alucard_theme.fish
ln -sfn "$PWD/dotfiles/fish/conf.d/fnm.fish"           ~/.config/fish/conf.d/fnm.fish
ln -sfn "$PWD/dotfiles/fish/conf.d/uv.env.fish"        ~/.config/fish/conf.d/uv.env.fish
ln -sfn "$PWD/dotfiles/fish/functions/proxy.fish"      ~/.config/fish/functions/proxy.fish
ln -sfn "$PWD/dotfiles/fish/functions/qr.fish"         ~/.config/fish/functions/qr.fish

mkdir -p ~/.local/share/fcitx5/themes
ln -sfn "$PWD/dotfiles/fcitx5/themes/dracula-classic" ~/.local/share/fcitx5/themes/dracula-classic
ln -sfn "$PWD/dotfiles/fcitx5/themes/alucard-classic" ~/.local/share/fcitx5/themes/alucard-classic

mkdir -p ~/.config/rofi ~/.config/swaync
ln -sfn "$PWD/dotfiles/rofi/config.rasi"    ~/.config/rofi/config.rasi
ln -sfn "$PWD/dotfiles/rofi/alucard.rasi"   ~/.config/rofi/alucard.rasi
ln -sfn "$PWD/dotfiles/swaync/config.json"  ~/.config/swaync/config.json
ln -sfn "$PWD/dotfiles/swaync/style.css"    ~/.config/swaync/style.css
```

## 应用 / 重载

```bash
swaync-client -R    # 重载 config.json
swaync-client -rs   # 重载 style.css
# rofi / alacritty 无守护进程：下次启动（新窗口）即生效
source ~/.config/fish/conf.d/alucard_theme.fish   # 当前 fish 立即套用；新 shell 自动加载 conf.d
fcitx5 -r -d                                       # 重启 fcitx5 使主题生效
```

## 恢复

rofi / swaync 收编前的原始配置已从工作区删除，但完整保留在收编 commit 里：

```bash
git show d6723b6:dotfiles/rofi/backup/config.rasi.orig   > ~/.config/rofi/config.rasi
git show e8c4af7:dotfiles/swaync/backup/config.json.orig > ~/.config/swaync/config.json
git show e8c4af7:dotfiles/swaync/backup/style.css.orig   > ~/.config/swaync/style.css
```

alacritty / fish / fcitx5 收编时未保留基线（直接对齐 spec），恢复任意历史版本走 git：

```bash
git log --oneline -- dotfiles/alacritty dotfiles/fish dotfiles/fcitx5
git checkout <commit> -- dotfiles/alacritty/alucard.toml
```

## 备份策略

- rofi / swaync 在**收编时**保存过一份收编前基线（`dotfiles/<app>/backup/<原名>.orig`），随仓库提交；app 稳定后基线**已删除**，内容仍完整保留在收编 commit 中（见上表与恢复命令）。
- alacritty / fish / fcitx5 未保留收编前基线；之后改动只走正常 commit，**不再新增备份文件**——git 历史本身就是备份。
- 颜色同步来源：`dracula-spec.mdx`（`theme/_palette.scss` 是 bar 用的暗色 token）。
  - Dracula 暗色改动：`rofi/alucard.rasi`、`swaync/style.css`、`fcitx5/themes/dracula-classic`（以及 bar 的 `theme/`）。
  - Alucard 亮色改动：`alacritty/alucard.toml`、`fish/conf.d/alucard_theme.fish`、`fcitx5/themes/alucard-classic`。
- pywal 生成的 `~/.cache/wal/colors-rofi-*.rasi` 不在托管范围，rofi 已不再 `@theme` 它（配色不再跟随壁纸）。

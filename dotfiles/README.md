# Dotfiles

本仓库托管的非 AGS 配置（rofi、swaync…）。这里的文件是**唯一真源**：`~/.config`
下对应路径是指向本目录的软链接（与 `~/.config/ags` 同一模式），在任一侧编辑都等于
改仓库，天然由 git 记录。

## 目录

```
dotfiles/
├── README.md
├── rofi/
│   ├── config.rasi          # 行为配置
│   └── alucard.rasi         # Dracula Classic 主题（对齐 bar 的语义 token）
└── swaync/
    ├── config.json          # 行为配置
    └── style.css            # Dracula Classic 主题（对齐 bar 的语义 token）
```

## 登记表

| App    | 生效路径                        | 仓库路径                       | 链接方式 | 收编 commit（含原始配置） |
| ------ | ------------------------------- | ------------------------------ | -------- | ------------------------- |
| rofi   | `~/.config/rofi/config.rasi`    | `dotfiles/rofi/config.rasi`    | symlink  | `d6723b6`                 |
| rofi   | `~/.config/rofi/alucard.rasi`   | `dotfiles/rofi/alucard.rasi`   | symlink  | —（新建）                 |
| swaync | `~/.config/swaync/config.json`  | `dotfiles/swaync/config.json`  | symlink  | `e8c4af7`                 |
| swaync | `~/.config/swaync/style.css`    | `dotfiles/swaync/style.css`    | symlink  | `e8c4af7`                 |

未托管（保持原样）：`~/.config/swaync/rose-pine*.css`、`~/.config/swaync/refresh.sh`。

## 安装 / 建立链接

```bash
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
# rofi 无守护进程，下次启动即生效
```

## 恢复

收编前的原始配置已从工作区删除，但完整保留在收编 commit 里：

```bash
git show d6723b6:dotfiles/rofi/backup/config.rasi.orig   > ~/.config/rofi/config.rasi
git show e8c4af7:dotfiles/swaync/backup/config.json.orig > ~/.config/swaync/config.json
git show e8c4af7:dotfiles/swaync/backup/style.css.orig   > ~/.config/swaync/style.css

# 恢复任意历史版本
git log --oneline -- dotfiles/<app>
git checkout <commit> -- dotfiles/<app>/<file>
```

## 备份策略

- 每个 app 在**收编时**保存过一份收编前基线（`dotfiles/<app>/backup/<原名>.orig`），随仓库提交。
- app 稳定后基线**已删除**；内容仍完整保留在收编 commit 中（见上表与恢复命令）。
- 之后的改动只走正常 commit，**不再新增备份文件**——git 历史本身就是备份。
- 颜色同步来源：`theme/_palette.scss` 与 `dracula-spec.mdx`；改色时一并更新 `alucard.rasi` 与 `swaync/style.css`。
- pywal 生成的 `~/.cache/wal/colors-rofi-*.rasi` 不在托管范围，rofi 已不再 `@theme` 它（配色不再跟随壁纸）。

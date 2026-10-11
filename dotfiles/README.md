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
│   ├── alucard.rasi         # Dracula Classic 主题（对齐 bar 的语义 token）
│   └── backup/
│       └── config.rasi.orig # 收编前的原始配置（临时基线，稳定后删除）
└── swaync/
    ├── config.json          # 行为配置
    ├── style.css            # Dracula Classic 主题（对齐 bar 的语义 token）
    └── backup/
        ├── config.json.orig
        └── style.css.orig
```

## 登记表

| App    | 生效路径                        | 仓库路径                       | 链接方式 | 收编前基线                                | 备注                            |
| ------ | ------------------------------- | ------------------------------ | -------- | ----------------------------------------- | ------------------------------- |
| rofi   | `~/.config/rofi/config.rasi`    | `dotfiles/rofi/config.rasi`    | symlink  | `dotfiles/rofi/backup/config.rasi.orig`   | `@theme` → `alucard.rasi`       |
| rofi   | `~/.config/rofi/alucard.rasi`   | `dotfiles/rofi/alucard.rasi`   | symlink  | —                                         | 新建                            |
| swaync | `~/.config/swaync/config.json`  | `dotfiles/swaync/config.json`  | symlink  | `dotfiles/swaync/backup/config.json.orig` | 含 `inline-replies: true`       |
| swaync | `~/.config/swaync/style.css`    | `dotfiles/swaync/style.css`    | symlink  | `dotfiles/swaync/backup/style.css.orig`   | 由 Rose Pine 改为 Dracula       |

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

```bash
# 从基线恢复 rofi 原始配置（先移除软链）
rm ~/.config/rofi/config.rasi
cp dotfiles/rofi/backup/config.rasi.orig ~/.config/rofi/config.rasi

# 或从 git 历史恢复任意版本
git log --oneline -- dotfiles/rofi
git checkout <commit> -- dotfiles/rofi/config.rasi
```

## 备份策略

- 每个 app **只在收编时保存一份**收编前基线，放在 `dotfiles/<app>/backup/<原名>.orig`，随仓库提交。
- 基线仅用于开发期对照；该 app 稳定后**删除**即可，内容仍完整保留在 git 历史中（`git log -- dotfiles/<app>/backup`）。
- 之后的改动只走正常 commit，**不再新增备份文件**——git 历史本身就是备份。
- 颜色同步来源：`theme/_palette.scss` 与 `dracula-spec.mdx`；改色时一并更新 `alucard.rasi` 与 `swaync/style.css`。
- pywal 生成的 `~/.cache/wal/colors-rofi-*.rasi` 不在托管范围，rofi 已不再 `@theme` 它（配色不再跟随壁纸）。

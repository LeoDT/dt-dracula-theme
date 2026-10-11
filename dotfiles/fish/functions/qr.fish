function qr --description "通过二维码分享文本或文件"
    argparse 't=' 'f=' 'h/help' -- $argv
    or return

    # ---- 显示帮助 ----
    set -l show_help 0
    if set -q _flag_h
        set show_help 1
    else if not set -q _flag_t; and not set -q _flag_f; and test (count $argv) -eq 0
        set show_help 1
    end

    if test $show_help -eq 1
        echo "用法: qr [-t 文本] [-f 文件] [文本...]"
        echo ""
        echo "选项:"
        echo "  -t TEXT    将文本写入临时文件并通过 qrcp 生成下载二维码"
        echo "  -f FILE    通过 qrcp 发送指定文件并生成下载二维码"
        echo "  -h         显示本帮助信息"
        echo ""
        echo "无选项时，所有位置参数合并为文本，按 -t 方式处理。"
        echo "示例:"
        echo "  qr -t \"hello world\""
        echo "  qr -f ./document.pdf"
        echo "  qr hello world"
        return 0
    end

    # ---- 依赖检查 ----
    if not command -v qrcp > /dev/null
        echo "错误：未找到 qrcp，请先安装 (https://github.com/claudiodangelis/qrcp)" >&2
        return 1
    end

    # ---- 互斥检查 ----
    if set -q _flag_t; and set -q _flag_f
        echo "错误：不能同时使用 -t 和 -f" >&2
        return 1
    end

    # ---- 处理 -f ----
    if set -q _flag_f
        qrcp send $_flag_f
        return
    end

    # ---- 处理文本（-t 或位置参数） ----
    # 先声明局部变量 content
    set -l content ""
    if set -q _flag_t
        set content $_flag_t
    else
        set content (string join ' ' $argv)
    end

    # 确保临时目录存在
    if not mkdir -p ~/tmp 2>/dev/null
        echo "错误：无法创建 ~/tmp 目录，请检查权限" >&2
        return 1
    end

    # 写入临时文件
    if not printf "%s" $content > ~/tmp/qrtmp.txt
        echo "错误：无法写入 ~/tmp/qrtmp.txt" >&2
        return 1
    end

    # 通过 qrcp 发送
    qrcp send ~/tmp/qrtmp.txt
end

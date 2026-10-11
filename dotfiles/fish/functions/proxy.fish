function proxy --description "一键切换 HTTP/HTTPS 代理 (支持大小写变量)"
    set -l proxy_url "http://127.0.0.1:1080" # 在这里修改你的代理地址

    if not set -q http_proxy
        # 开启代理：同时导出小写和大写变量
        set -gx http_proxy  $proxy_url
        set -gx https_proxy $proxy_url
        set -gx all_proxy   $proxy_url
        set -gx HTTP_PROXY  $proxy_url
        set -gx HTTPS_PROXY $proxy_url
        set -gx ALL_PROXY   $proxy_url
        
        set -gx proxy_status "ON"
        set_color green; echo "✔ 代理已开启 (大小写变量已就绪)"; set_color normal
    else
        # 关闭代理：清除所有相关变量
        set -e http_proxy https_proxy all_proxy
        set -e HTTP_PROXY HTTPS_PROXY ALL_PROXY
        
        set -e proxy_status
        set_color red; echo "✘ 代理已关闭"; set_color normal
    end
end

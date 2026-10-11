set -gx PI_OFFLINE 1
set -gx PNPM_HOME ~/.local/share/pnpm

set -gx EDITOR nano

fish_add_path $HOME/bin
fish_add_path $PNPM_HOME/bin

if status is-interactive
# Commands to run in interactive sessions can go here

    abbr -a cat bat
    abbr -a ll 'eza -lah --icons --git --group-directories-first'
    abbr -a lt 'eza --tree --level=2 --icons'
    abbr -a sc 'systemctl'
    abbr -a scu 'systemctl --user'
    abbr -a sus 'systemctl suspend'
    abbr -a e 'emacsclient -nw'

    begin
        set -lx SHELL (which fish)
        keychain --eval --quiet id_rsa | source
    end

    starship init fish | source

    proxy

end

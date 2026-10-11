# Alucard Classic (Dracula light) colors for fish.
# Values taken verbatim from dracula-spec.mdx. This is the only place fish colors
# are defined (the old fish_config-generated conf.d/fish_frozen_theme.fish and
# themes/Alucard.theme were merged into this file).
#
# Token classification -> fish variable:
#   Foreground (variables/identifiers, punctuation) -> normal, redirection, end, param
#   Green      (functions, methods)                 -> command, cwd, valid_path
#   Pink       (keywords, storage, operators)        -> keyword, operator
#   Yellow     (strings, escape sequences)           -> quote, escape
#   Orange     (numbers, constants, options)         -> option
#   Comment    (comments, disabled/secondary text)   -> comment, autosuggestion, pager description
#   Red        (errors, warnings, deletion)          -> error, cancel, status, cwd_root
#   Selection  (text selection background)           -> selection, search_match, pager selected bg

set -g fish_color_normal          1F1F1F
set -g fish_color_command         14710A
set -g fish_color_keyword         A3144D
set -g fish_color_quote           846E15
set -g fish_color_redirection     1F1F1F
set -g fish_color_end             1F1F1F
set -g fish_color_error           CB3A2A
set -g fish_color_param           1F1F1F
set -g fish_color_comment         6C664B
set -g fish_color_selection       --background=CFCFDE
set -g fish_color_search_match    --background=CFCFDE
set -g fish_color_operator        A3144D
set -g fish_color_escape          846E15
set -g fish_color_autosuggestion  6C664B
set -g fish_color_cancel          CB3A2A --reverse
set -g fish_color_option          A34D14
set -g fish_color_history_current --bold
set -g fish_color_status          CB3A2A
set -g fish_color_valid_path      14710A --underline=single

set -g fish_color_cwd             14710A
set -g fish_color_cwd_root        CB3A2A
set -g fish_color_host            644AC9
set -g fish_color_host_remote     644AC9
set -g fish_color_user            036A96

set -g fish_pager_color_progress              6C664B
set -g fish_pager_color_prefix                036A96
set -g fish_pager_color_completion            1F1F1F
set -g fish_pager_color_description           6C664B
set -g fish_pager_color_selected_background   --background=CFCFDE
set -g fish_pager_color_selected_prefix       644AC9
set -g fish_pager_color_selected_completion   1F1F1F
set -g fish_pager_color_selected_description  6C664B
set -g fish_pager_color_secondary_prefix      036A96
set -g fish_pager_color_secondary_completion  1F1F1F
set -g fish_pager_color_secondary_description 6C664B

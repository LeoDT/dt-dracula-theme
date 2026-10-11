if type -q fnm
    set -gx FNM_COREPACK_ENABLED true
    fnm env --use-on-cd --shell fish | source
end

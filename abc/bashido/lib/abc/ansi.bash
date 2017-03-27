# no shebang because this file is meant to be sourced by bash

ansi () {
	local id="${1:?provide a sequence id}"
	local varname="BASHIDO_ANSI_${id//\./_}"
	varname="${varname^^}" # capitalizes each letter
	test -n "${!varname}" || {
	  >&2 echo "$FUNCNAME: no sequence named $varname"
		exit 1
	}
	printf '%b' ${!varname}
}

BASHIDO_ANSI_BG_RED="$(tput setab 1)"
BASHIDO_ANSI_FG_RED="$(tput setaf 1)"
BASHIDO_ANSI_BG_BLUE="$(tput setab 4)"
BASHIDO_ANSI_FG_BLUE="$(tput setaf 4)"
BASHIDO_ANSI_BG_CYAN="$(tput setab 6)"
BASHIDO_ANSI_FG_CYAN="$(tput setaf 6)"
BASHIDO_ANSI_BG_BLACK="$(tput setab 0)"
BASHIDO_ANSI_FG_BLACK="$(tput setaf 0)"
BASHIDO_ANSI_BG_WHITE="$(tput setab 7)"
BASHIDO_ANSI_FG_WHITE="$(tput setaf 7)"
BASHIDO_ANSI_BG_GREEN="$(tput setab 2)"
BASHIDO_ANSI_FG_GREEN="$(tput setaf 2)"
BASHIDO_ANSI_BG_ORANGE="$(tput setab 3)"
BASHIDO_ANSI_FG_ORANGE="$(tput setaf 3)"
BASHIDO_ANSI_BG_PURPLE="$(tput setab 5)"
BASHIDO_ANSI_FG_PURPLE="$(tput setaf 5)"

BASHIDO_ANSI_REV="$(tput rev)"
BASHIDO_ANSI_DIM="$(tput dim)"
BASHIDO_ANSI_BOLD="$(tput bold)"
BASHIDO_ANSI_RESET=$'\E[m'

BASHIDO_ANSI_LOG_BEGIN="$(ansi dim)"
BASHIDO_ANSI_LOG_TRAIL="$(ansi reset)"
BASHIDO_ANSI_LOG_VALUE="$(ansi rev)"
BASHIDO_ANSI_LOG_VV="$(ansi fg.purple)"
BASHIDO_ANSI_LOG_UX="$(ansi fg.green)"
BASHIDO_ANSI_LOG_II="$(ansi fg.blue)"
BASHIDO_ANSI_LOG_WW="$(ansi fg.orange)"
BASHIDO_ANSI_LOG_EE="$(ansi fg.red)"

##
# vim modeline
# /* vim: set filetype=sh ts=2 shiftwidth=2: */

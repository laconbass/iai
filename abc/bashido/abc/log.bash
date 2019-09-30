##
# "log" api
# =========
# The log api is a bunch of helper functions that write to stderr.
# They are designed to allow reading from standard input if need.
# TODO document the usage

# same as `echo` but output to stderr
eche () { >&2 echo "$@"; }

# follows each input line to 'log' with desired level mark ($1)
loog () { while read line; do log "$1" "${line}"; done <&0; }

log () {
  # writes a message with lvl $2 to the($1) to stderr with desired level mark ($2 or ??)
  local lvl="${1:?'provide the log level'}"
  local msg="$2" # dont fail if empty, it could be an empty newline
  
  case $lvl in EE|WW|II|VV|UX) ;; *) fail "invalid log lvl '$lvl'";; esac
  
  # Research where this log message was generated
  # TODO this seems too dirty
  local line fn file n
  read line fn file <<<"$(caller 0)"
  test "$fn" != "loog"; n=$(( 1 + $? ))
  read line fn file <<<"$(caller $n)"
  test "$fn" != "fail"; n=$(( n + $? ))
  read line fn file <<<"$(caller $n)"

  if log.filter "$lvl" "$fn" "$file"
  then
    local c=$(ansi log.$lvl) r=$(ansi reset)
    local b=$(ansi log.begin) t=$(ansi log.trail)
    if test $# -gt 2
    then
			# values specified should be styled with $v
			local v=$(ansi log.value)
			# TODO actually implemented, but not tested
			msg="${msg//%s/$v%s$r$t$c}"
			# TODO msg format string could contain other placeholders (%i, etc)
			#echo "msg is now '$msg'"
			msg="$(printf "$msg" "${@:3}")" # apply to msg arg $3 and onwards
    fi
    # TODO configurable way to enable this
    false && >&2 printf '%b%s%b' $(ansi log.begin) "[$$]#$BASH_SUBSHELL "
    >&2 printf "$c%s$r $b@%s$r $t$c%s$r\n" "$lvl" "$fn" "$msg"
  fi
}

# decides whenever to output a log message or ignore it.
# default implementation is to output everything except verbose messages
# unless BASHIDO_VERBOSE is set to greater than 0 on environment
log.filter () { (($BASHIDO_VERBOSE)) || test "$1" != 'VV'; }

# logs messages with an error level mark (EE)
emsg () { if (($#)); then log EE "$@"; else <&0 loog EE; fi; }
# logs messages with a warning level mark (WW)
warn () { if (($#)); then log WW "$@"; else <&0 loog WW; fi; }
# logs messages with an info level mark (II)
info () { if (($#)); then log II "$@"; else <&0 loog II; fi; }
# logs messages with an info level mark (II)
utip () { if (($#)); then log UX "$@"; else <&0 loog UX; fi; }
# logs messages with a verbose level mark (VV)
verb () { if (($#)); then log VV "$@"; else <&0 loog VV; fi; }

# helper to [fail fast](http://www.martinfowler.com/ieeeSoftware/failFast.pdf)
# Aditionally adds a call trace.
fail () { emsg "$@"; call_trace 1 | emsg; exit 1; }

####
# fail: same as `emsg`, but also writes a call trace and exits with code=1
# `fail` allows [fail early] "exit code catchs" like:
#     `( false ) || { echo "error description"; exit 1; }`
#     `(exit -1) || { code=$?; echo "catched code $code"; exit $code; }`
# as:
#     `( false ) || fail "error description"`
#     `(exit -1) || fail "catched code $?"`
#
# Helper function to [fail early](http://stackoverflow.com/a/2807375/1894803)
####

# require dependencies at the end, to ensure log is defined already
bashido.require "stdio.ansi" || exit
# conditionally source call_trace, depending on following env variable
(($BASHIDO_TRACE)) \
	&& { bashido.require "call_trace" || exit; } \
	|| call_trace () { :; }


##
# vim modeline
# /* vim: set filetype=sh ts=2 shiftwidth=2: */

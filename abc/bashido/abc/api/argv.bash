# no shebang because this file is meant to be sourced

function argv () {
  # runs the given command line according to specified mode
  # Usage: argv {MODE} [COMMAND]
  #
  # argv will always assume its caller function name is part of executable name
  #
  # {MODE} may be one of: subcommand, command
  ##
  local funcname="${FUNCNAME[1]}"
  local executable

  case "$1" in
    subcommand)
      # Unless some COMMAND argument was provided, it is useless doing more
      if test -z "$2"; then emsg "missing $1"; $funcname help; return 2; fi
      # executable is guessed to be an already defined bash function named as:
      executable="$funcname.$2"
    ;;
    command)
      # Unless some COMMAND argument was provided, it is useless doing more
      if test -z "$2"; then emsg "missing $1"; $funcname help; return 2; fi
      # executable is guessed to be a function or any executable file named as:
      executable="$funcname-$2"
      if test "$(type -t "$executable")" = "file" \
        && file="$(type -p "$executable")" && ! test -x "$file"
      then
        # the file should define a function being the executable to be called
        if ! source "$file"; then
          emsg "Got exit code $? while sourcing %s" "$file"
          utip "assumed it defines a bash function because it's not executable"
          return 1
        fi
        assert_function "$executable"
        info "loaded $funcname $1 %s" "$executable"
      fi
      ;;
    '') fail "no operation mode was provided" ;;
    *) fail "unknown operation mode: %s" "$1" || exit 1 ;;
  esac

  if test -z "$(type -t "$executable")"
  then # executable is nothing, as has no type
    # it may be valid if requesting help
    case "$2" in help|--help|-h|-?)
      read line funcname filename < <(caller 0)
      if ! read -d ':' begin < <(grep -n "function $funcname ()" "$filename"); then
        fail "can't find where $funcname is defined on $filename"
        return 1
      fi
      ((begin++)) # omit function declaration on help shown
      if ! end=$(tail -n +$begin <"$filename" | grep -n -x "  ##"); then
        warn "can't find help closing comment for $funcname at $filename"
        end=$((line - begin))
      else
        read -d ':' end <<<"$end"
      fi

      # TODO research topic-specific help
      if test $# -gt 2; then warn "help topic %s was provided" "$3"; fi
      
      # dump the help comment from source file
      echo "# $funcname #"
      tail -n +$begin "$filename" | head -n $end \
        | while read l; do echo "${l##*( )}"; done
      echo
      
      # display usage info
      echo "usage: $funcname {$1} [$1 arguments]"
      echo "      '$funcname help' outputs this help text"
      echo "  but '$funcname help [$1]' outputs specific help for [$1]"

      # list available commands/subcommands
      case "$1" in
        subcommand) prefix="$funcname." ;;
        command) prefix="$funcname-" ;;
      esac
      printf "\navailable $1s:"
      while read d t fn; do echo $fn; done < <(declare -F) \
        | grep "$prefix" \
        | sort \
        | while read cmd; do printf " ${cmd##$prefix}"; done
      case "$1" in
        command)
          while read -d ':' path; do
            find "$path" -type f -name "$prefix*" -print0 \
              | sort -z \
              | while IFS= read -d '' cmd; do printf " ${cmd##*/$prefix}"; done
          done <<<"$PATH"
          ;;
      esac
      echo

      return 0
    esac
    # else it is not valid
    warn "there is nothing named %s" "$executable"
    emsg "%s is not a valid $funcname $1" "$2"
    return 1
  fi

  shift
  verb "exec %s" "$executable $*"
  $executable "$@"
  # DON'T EXIT, let command decide when to exit (or return)
}
##
# vim modeline (see vim +'help modeline')
# /* vim: set expandtab: */
# /* vim: set filetype=sh ts=2 shiftwidth=2: */

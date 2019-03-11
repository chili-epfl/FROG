# enable color support of ls and also add handy aliases
if [ -x /usr/bin/dircolors ]; then
    test -r ~/.dircolors && eval "$(dircolors -b ~/.dircolors)" || eval "$(dircolors -b)"
    alias ls='ls --color=auto'
    alias dir='dir --color=auto'
    alias vdir='vdir --color=auto'

    alias grep='grep --color=auto'
    alias fgrep='fgrep --color=auto'
    alias egrep='egrep --color=auto'
fi


#GENERIC COMMANDS
alias ll='ls -alrth'
alias la='ls -A'
alias l='ls -CF'
alias c='clear'
export PS1='\u@\h(\t):\w > '
export VISUAL=vim
alias hist='history | grep '
alias p='ps -ef | grep -v grep | grep --color '
alias ports='sudo netstat -tulnp'
alias loc='locate -i'
alias stat='monit summary'
alias rconf="sed -e 's/#.*$//' -e '/^$/d' "
alias top='top -c'
alias inst='sudo apt-get install '


function portsof(){
    sudo netstat -tulnp | grep `ps -ef | grep $1 | grep -v grep | awk '{print $2}'`
}

function rep() { for x in `seq 1 1000`; do $1; sleep $2; done; }

# function sys(){
# 	app=${2%/}
#     case $1 in
#       start)
#          echo "starting "$app
#          /home/eee/$2/scripts/start.sh
#          echo "started "$app
#       ;;
#       *)
#         echo "sys {start|stop|restart|log|conf|depconf} {eee-admin|hazelcast-cluster|application-name}"
#       ;;
#    esac
# }

function set_env() {

	case $1 in 
	  meteor)
		export METEOR_SETTINGS="$(cat /home/chili/frog/frog/settings.json)"
	  ;;
	  mongo)
		export MONGO_URL=mongodb://mongodb:27017/meteor
	  ;;
	  ROOT_URL)
		export ROOT_URL=http://localhost
	  ;;
	  *)
        echo "sys {start|stop|restart|log|conf|depconf} {eee-admin|hazelcast-cluster|application-name}"
      ;;
    esac
}
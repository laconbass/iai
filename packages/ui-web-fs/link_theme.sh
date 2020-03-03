THEME=$(gsettings get org.gnome.desktop.interface gtk-theme)
THEME=$(node -e "console.log($THEME)")
ln -s /usr/share/icons/$THEME icons

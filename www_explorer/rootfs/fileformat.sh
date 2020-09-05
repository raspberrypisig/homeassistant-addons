#!/usr/bin/with-contenv bashio

filepath="$1"
fileformats=("audio" "video" "image")

for f in ${fileformats[@]}
do
  if file -ib "$filepath"  | grep -i "$f" >/dev/null
    then
     echo -n "$f"
     exit 0
   fi
done

echo -n "none"
exit 1

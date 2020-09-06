#!/usr/bin/with-contenv bashio

filepath="$1"
fileformats=("audio" "video" "image")

for f in ${fileformats[@]}
do
  if file -ib "$filepath"  | grep -i "$f" >/dev/null
    then
     if [ "$f" == "image" ];
     then
       file --mime-type "$filepath" | awk '{print $2}'
     exit 0
     fi
     echo -n "$f"
     exit 0
   fi
done

echo -n "music"
exit 0

ARG BUILD_FROM
FROM $BUILD_FROM

ENV LANG C.UTF-8

COPY rootfs /

RUN pip install \
    --no-cache-dir \
    --prefer-binary \
    -r /requirements.txt 

RUN apk add --no-cache file

CMD [ "/run.sh" ]


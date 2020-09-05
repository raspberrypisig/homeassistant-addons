ARG BUILD_FROM
FROM $BUILD_FROM

ENV LANG C.UTF-8

COPY requirements.txt /tmp/

RUN pip install \
    --no-cache-dir \
    --prefer-binary \
    -r /tmp/requirements.txt 

RUN apk add --no-cache file cifs-utils

COPY rootfs /

RUN chmod a+x /*.sh

CMD [ "/run.sh" ]


ARG BUILD_FROM
FROM $BUILD_FROM

ENV LANG C.UTF-8

COPY rootfs /

RUN pip install \
    --no-cache-dir \
    --prefer-binary \
    -r /requirements.txt 

CMD [ "/run.sh" ]


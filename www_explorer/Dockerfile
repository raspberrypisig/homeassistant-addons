ARG BUILD_FROM
FROM $BUILD_FROM

ENV LANG C.UTF-8

COPY requirements.txt /tmp/
COPY run.py /

RUN pip install \
    --no-cache-dir \
    --prefer-binary \
    -r /tmp/requirements.txt 

COPY run.sh /
RUN chmod a+x /run.sh

CMD [ "/run.sh" ]


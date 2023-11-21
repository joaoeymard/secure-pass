FROM alpine:3.13.2

WORKDIR /build/

COPY --chown=997:993 images/ /build/images/
COPY --chown=997:993 assets/ /build/assets/
COPY --chown=997:993 styles/ /build/styles/
COPY --chown=997:993 scripts/ /build/scripts/
COPY --chown=997:993 index.html /build/
COPY --chown=997:993 manifest.json /build/

RUN find /build/ -type f -exec chmod 0440 {} \; && \
    find /build/ -type d -exec chmod 0110 {} \;

ENTRYPOINT cp -arf /build/* /project/

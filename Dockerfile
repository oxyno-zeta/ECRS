FROM <%= from %>
MAINTAINER Oxyno-zeta

ENV WORKING_DIR /ecrs
ENV CRASH_REPORTER_PORT 2000

ADD archive.tar.gz $WORKING_DIR

RUN cd $WORKING_DIR && \
    npm install --prune

EXPOSE 2000

WORKDIR $WORKING_DIR

ENTRYPOINT ["node", "index.js"]

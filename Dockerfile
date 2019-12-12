FROM ubuntu:16.04

RUN apt-get -q update &&\
    DEBIAN_FRONTEND="noninteractive" apt-get -q install -y -o Dpkg::Options::="--force-confnew" --no-install-recommends build-essential ca-certificates net-tools telnet netcat curl vim &&\
     apt-get -q clean -y &&\
     rm -rf /var/lib/apt/lists/* &&\
     rm -f /var/cache/apt/*.bin &&\
     mkdir -p /var/run/sshd ENV LANG en_US.UTF-8 ENV LANGUAGE en_US:en ENV LC_ALL en_US.UTF-8

RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -s &&\
     apt-get install -y nodejs &&\
     apt-get -q clean -y &&\
     rm -rf /var/lib/apt/lists/* &&\
     rm -f /var/cache/apt/*.bin

RUN mkdir /node

COPY artifacts/tracksstart.sh /node

WORKDIR /node
ADD js js
WORKDIR /node/js
COPY js/eslint.json .eslintrc

RUN npm install -g eslint@5.16.0 eslint-plugin-react@7.13.0 jshint &&\
    eslint app.js &&\
    jshint app.js &&\
    npm install

CMD /node/tracksstart.sh

# 開発環境
# Dockerイメージにはアプリケーションのソースコードは含めない
# コンテナ起動時にdocker-composeによりマウントして使う
# これによりコードの変更はローカルマシン（ホスト）上で任意のエディタを用いて行うことが可能になる

FROM ruby:2.5.0
MAINTAINER Yuichi Takeuchi <yuichi.takeuchi@takeyuweb.co.jp> (@takeyuweb)

ENV ENTRYKIT_VERSION 0.4.0

WORKDIR /

RUN wget https://github.com/progrium/entrykit/releases/download/v${ENTRYKIT_VERSION}/entrykit_${ENTRYKIT_VERSION}_Linux_x86_64.tgz \
  && tar -xvzf entrykit_${ENTRYKIT_VERSION}_Linux_x86_64.tgz \
  && rm entrykit_${ENTRYKIT_VERSION}_Linux_x86_64.tgz \
  && mv entrykit /bin/entrykit \
  && chmod +x /bin/entrykit \
  && entrykit --symlink

RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update -qq
RUN apt-get install -y build-essential libpq-dev nodejs yarn
RUN rm -rf /var/cache/apk/*

COPY setup.sh /root/setup.sh

# docker-compose でRailsルートディレクトリをここにマウントしている
WORKDIR /app

ENV DOCKER 1
ENV BUNDLE_APP_CONFIG /app/.bundle

ENTRYPOINT ["prehook", "bash /root/setup.sh", "--"]

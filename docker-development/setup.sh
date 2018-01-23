#!/bin/bash

# このファイルは docker-compose build によってイメージに含められ、
# コンテナの実行時にフックされます。
# 従って変更した場合は docker-compose build が必要です。

# ほかのコンテナからもマウントされたボリューム内の同じ設定を参照するように --local を設定
bundle config --local retry 5
bundle config --local jobs 4
bundle config --local path vendor/bundle
bundle install

# DB versionを問い合わせてエラーが発生すればまだDBが無いと考えて初期設定
# すでにあればマイグレーション実行
bin/rails db:version > /dev/null 2>&1
if [ $? = 1 ]; then
  bin/rails db:setup
else
  bin/rails db:migrate
fi

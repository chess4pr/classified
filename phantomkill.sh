ps -ef | grep phantomjs | awk '{print $2}' | xargs sudo kill -9

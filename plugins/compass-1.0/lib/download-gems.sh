#!/bin/sh
java -jar jruby-complete-1.7.0.jar -S gem install --no-rdoc --no-ri -i gems/ -v 0.11.3 compass

java -jar jruby-complete-1.7.0.jar -S gem uninstall --ignore-dependencies --executables -i gems/  sass
java -jar jruby-complete-1.7.0.jar -S gem install -i gems/ --no-rdoc --no-ri -v 3.1.3 sass

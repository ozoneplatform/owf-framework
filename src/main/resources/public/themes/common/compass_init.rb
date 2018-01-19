# include the utils rb file which has extra functionality for the owf theme
dir = File.dirname(__FILE__)
require File.join(dir, 'lib', 'owf_utils.rb')

# register owf-common as a compass framework
Compass::Frameworks.register 'owf-common', dir

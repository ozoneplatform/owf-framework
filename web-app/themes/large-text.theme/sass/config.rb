# $ext_sdk_path: This should be the path of where the ExtJS SDK is installed
# Generally this will be in a lib/extjs folder in your applications root
# <root>/lib/extjs
$ext_sdk_path = "../../../js-lib/ext-4.0.7/"
$common_theme_path = "../../common" #location of owf theme stylesheets
$image_path = "../images"  #needed for images to render correctly

# include the utils rb file which has extra functionality for the ext theme
#compass_init_dir = "../../js-lib/ext-4.0.2a/resources/"
#require File.join(compass_init_dir, 'themes', 'compass_init.rb')

# sass_path: the directory your Sass files are in. THIS file should also be in the Sass folder
# Generally this will be in a resources/sass folder
# <root>/resources/sass
sass_path = File.dirname(__FILE__)

# css_path: the directory you want your CSS files to be.
# Generally this is a folder in the parent directory of your Sass files
# <root>/resources/css
css_path = File.join(sass_path, "..", "css")

# output_style: The output style for your compiled CSS
# nested, expanded, compact, compressed
# More information can be found here http://sass-lang.com/docs/yardoc/file.SASS_REFERENCE.html#output_style
output_style = :expanded

# We need to load in the Ext4 themes folder, which includes all it's default styling, images, variables and mixins
load File.join(File.dirname(__FILE__), $ext_sdk_path, 'resources', 'themes')

#We need to load the OWF Common Stylesheets
load File.join(File.dirname(__FILE__), $common_theme_path)

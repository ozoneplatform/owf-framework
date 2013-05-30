# $ext_sdk_path: This should be the path of where the ExtJS SDK is installed
# Generally this will be in a lib/extjs folder in your applications root
# <root>/lib/extjs
$ext_sdk_path = "../../../js-lib/ext-4.0.7/"
$common_theme_path = "../../common" #location of owf's stylesheets and images that are common to mutiple themes
$image_path = "../images"  #path to the images directory in this theme

# sass_path: the directory your Sass files are in. THIS file should also be in the Sass folder
sass_path = File.dirname(__FILE__)

# css_path: the directory you want your CSS files to be.
# Generally this is a folder in the parent directory of your Sass files
css_path = File.join(sass_path, "..", "css")

# output_style: The output style for your compiled CSS
# nested, expanded, compact, compressed
# More information can be found here http://sass-lang.com/docs/yardoc/file.SASS_REFERENCE.html#output_style
output_style = :expanded

# We need to load in the Ext4 themes folder, which includes all it's default styling, images, variables and mixins
load File.join(File.dirname(__FILE__), $ext_sdk_path, 'resources', 'themes')

#We need to load the OWF Common Stylesheets
load File.join(File.dirname(__FILE__), $common_theme_path)

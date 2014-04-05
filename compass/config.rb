
http_path = "/"
css_dir = "resources/css"
fonts_dir = "resources/css"
images_dir = "resources/img"
javascripts_dir = "resources/js"
sass_dir = "scss"

relative_assets = true;

# compile with `compass -e production --force` to use do compression
output_style = (environment == :production) ? :compressed : :compact
line_comments = false


#
# display an OSX notifications message, so you don't need to look at the terminal all the time...
#
def notifier(type, message)
	system( "terminal-notifier -title \"Compass\" -subtitle \"#{type}\" -message \"#{message}\" -sender com.apple.Terminal" )
end

config = Compass.configuration

config.on_stylesheet_saved do |filename|
	notifier("Stylesheet Saved", "Stylesheet: #{filename} saved")
end

config.on_sprite_saved do |filename|
  notifier("Sprite Saved", "Sprite: #{filename} saved")
end

config.on_stylesheet_error do |filename, error|
  notifier("Stylesheet Error", "Stylesheet Error: #{filename} \n had the following error:\n #{error}")
end


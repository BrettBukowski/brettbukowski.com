require 'bundler/setup'
require 'uglifier'
require './app'

namespace :assets do
  task :compile do
    App.sprockets['application.js'].write_to('public/assets/application.js')
    App.sprockets['application.css'].write_to('public/assets/application.css')

    minJS = Uglifier.compile(File.read('public/assets/application.js'), :mangle => true)
    File.open('public/assets/application.js', 'w') { |f| f.write(minJS) }
    minCSS = File.open('public/assets/application.css', 'r').read.gsub!(/(\s{2,}|\n)/, '')
    File.open('public/assets/application.css', 'w') { |f| f.write(minCSS) }
  end
end

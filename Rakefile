require 'bundler/setup'
require 'uglifier'
require './app'

namespace :assets do
  task :compile do
    %w{application.js application.css r.js r.scss}.each do |file_name|
      output_file_name = (File.extname(file_name) == '.scss') ? File.basename(file_name, '.scss') + '.css' : file_name
      App.sprockets[file_name].write_to "public/assets/#{output_file_name}"
    end

    Dir.glob('public/assets/*.js').each do |file_path|
      minJS = Uglifier.compile(File.read(file_path), :mangle => true)
      File.open(file_path, 'w') { |f| f.write(minJS) }
    end

    Dir.glob('public/assets/*.css').each do |file_path|
      minCSS = File.open(file_path, 'r').read.gsub!(/(\s{2,}|\n)/, '')
      File.open(file_path, 'w') { |f| f.write(minCSS) }
    end
  end
end

require 'bundler/setup'
require 'net/http'
require 'json'
require 'yui/compressor'
require 'uglifier'
require './app'

namespace :assets do
  desc "Combine and minify assets"
  task :compile do
    %w{application.scss r.scss}.each do |file_name|
      output_file_name = (File.extname(file_name) == '.scss') ? File.basename(file_name, '.scss') + '.css' : file_name
      App.sprockets[file_name].write_to "public/assets/#{output_file_name}"
    end


    def compress_js(files)
      files.each do |file_path|
        minJS = Uglifier.compile(File.read(file_path), :mangle => true)
        File.open(file_path, 'w') { |f| f.write(minJS) }
      end
    end

    compress_js(Dir.glob('public/assets/*.js'))

    def compress_css(files)
      compressor = YUI::CssCompressor.new
      files.each do |file_path|
        minCSS = compressor.compress(File.open(file_path, 'r').read)
        File.open(file_path, 'w') { |f| f.write(minCSS) }
      end
    end

    compress_css(Dir.glob('public/assets/*.css'))
  end
end

namespace :cloudflare do
  desc "Purge Cloudflare's cache of site assets"
  task :purge_cache do
    site = 'brettbukowski.com'
    files_to_purge = %w{
      assets/application.css
      assets/r.css
      index.html
      resume.pdf
      resume
      resume.md
    }
    uri = URI('https://api.cloudflare.com/client/v4/zones/brettbukowski.com/purge_cache')
    options = {
        z:      site,
        a:      'zone_file_purge',
        tkn:    'b850eed00d535542d7e0c586ed265909dbe4b',
        email:  'brett.bukowski@gmail.com',
    }

    files_to_purge.each do |file|
      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = true
      request = Net::HTTP::Post.new(uri.request_uri)
      request.form_data = options.merge({
        url: "http://#{site}/#{file}",
      })
      response = JSON.parse(http.request(request).body)

      if response['result'] == 'success'
        puts "Purged #{file}"
      else
        puts "Error: #{response['msg']}"
      end
    end
  end
end

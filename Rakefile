require 'bundler/setup'
require 'net/http'
require 'json'
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

namespace :cloudflare do
  task :purge_cache do
    site = 'brettbukowski.com'
    files_to_purge = %w{assets/application.js assets/application.css index.html}
    uri = URI('https://www.cloudflare.com/api_json.html')
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

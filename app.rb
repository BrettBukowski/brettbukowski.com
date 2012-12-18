# app.rb
require 'sinatra'

get '/' do
  send_file File.join(settings.public_folder, 'index.html')
  # erb :index
end

not_found do
  send_file File.join(settings.public_folder, '404.html')
end

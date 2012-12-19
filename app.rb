require 'sinatra'
require 'sprockets'

class App < Sinatra::Base
  def self.sprockets
    project_root = File.expand_path(File.dirname(__FILE__))
    environment = Sprockets::Environment.new(project_root)
    environment.append_path 'app/js'
    environment.append_path 'app/css'
    environment
  end
end

class RootController < App
  get '/' do
    send_file File.join(settings.public_folder, 'index.html')
  end

  post '/contact' do
    if request.form_data?
      given = Rack::Utils.parse_nested_query(request.body.read)
      email = given['email']
      message = given['message']

      message.strip!
      email.strip!

      if !email.empty? && email =~ /^[a-zA-Z][\w\.-]*[a-zA-Z0-9]@[a-zA-Z0-9][\w\.-]*[a-zA-Z0-9]\.[a-zA-Z][a-zA-Z\.]*[a-zA-Z]$/ && !message.empty?
        # "#{email}<br>#{message}"
        "sent"
      else
        "not sent"
      end
    end
  end

  not_found do
    send_file File.join(settings.public_folder, '404.html')
  end
end

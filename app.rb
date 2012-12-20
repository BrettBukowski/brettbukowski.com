require 'sinatra'

class App < Sinatra::Base
  def self.sprockets
    require 'sprockets'
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
        message = <<MESSAGE
From: #{email} <#{email}>
To: Brett Bukowski <brett.bukowski@gmail.com>
Subject: Message Received From Contact Form

#{message}
MESSAGE
        require 'net/smtp'
        require 'json'

        Net::SMTP.start('pontifex.startlogic.com', 587, 'brettbukowski.com', 'root@brettbukowski.com', 'pkrpUiotFzDz6weC9F', :login) do |smtp|
          smtp.send_message(message, 'root@brettbukowski.com', 'brett.bukowski@gmail.com')
        end

        if request.preferred_type == 'application/json'
          {:sent => true}.to_json
        else
          request.preferred_type
        end
      else
        if request.preferred_type == 'application/json'
          {:sent => false}.to_json
        else
          "sent"
        end
      end
    end
  end

  not_found do
    send_file File.join(settings.public_folder, '404.html')
  end
end

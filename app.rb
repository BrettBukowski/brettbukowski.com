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
    File.read(File.join('public', 'index.html'))
  end

  get '/resume' do
    erb :resume, :locals => { :company_name => 'you' }
  end

  get '/resume.md' do
    content_type 'text/plain'
    File.read settings.views + '/resume.md'
  end

  not_found do
    send_file File.join(settings.public_folder, '404.html')
  end
end

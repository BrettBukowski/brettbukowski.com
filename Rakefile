require 'bundler/setup'
require './app'

namespace :assets do
  task :compile do
    App.sprockets['application.js'].write_to('public/assets/application.js')
    App.sprockets['application.css'].write_to('public/assets/application.css')
  end
end
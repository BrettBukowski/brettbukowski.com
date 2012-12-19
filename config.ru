require './app'

if development?
  map '/assets' do
    run App.sprockets
  end
end

map '/' do
  run RootController
end

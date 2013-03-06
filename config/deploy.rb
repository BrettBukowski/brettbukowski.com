set :application, "brettbukowski"
set :repository,  "https://brettbukowski:FpdY7jfpZmhJU6fb@bitbucket.org/brettbukowski/brettbukowski.com.git"
set :branch, "master"
set :scm, :git

server "gato", :app, :web

set :user, 'brett'
set :deploy_to, '/var/www/brettbukowski'
set :use_sudo, true
set :deploy_via, :copy
set :copy_strategy, :export
default_run_options[:pty] = true

set :rvm_ruby_string, 'ruby-1.9.3-p362'
set :rvm_type, :system
require 'rvm/capistrano'

namespace :deploy do
  task :start, :roles => [:web, :app] do
    run "cd #{deploy_to}/current && nohup thin -e production -C config/thin.yml -R config.ru start"
  end

  task :stop, :roles => [:web, :app] do
    run "cd #{deploy_to}/current && nohup thin -e production -C config/thin.yml -R config.ru stop"
  end

  task :restart, :roles => [:web, :app] do
    deploy.stop
    deploy.start
  end

  task :cold do
    deploy.update
    deploy.start
  end
end

namespace :brett do
  desc "Compile assets"
  task :compile_assets do
    run "cd #{deploy_to}/current; bundle exec rake assets:compile"
  end
end

after "deploy:create_symlink", "brett:compile_assets"
after "deploy:restart", "deploy:cleanup"

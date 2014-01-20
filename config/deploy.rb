set :application, 'brettbukowski'
set :repo_url, 'https://brettbukowski:FpdY7jfpZmhJU6fb@bitbucket.org/brettbukowski/brettbukowski.com.git'

set :deploy_to, '/var/www/brettbukowski'
set :scm, :git

set :format, :pretty
set :log_level, :debug
set :pty, true

# set :linked_files, %w{config/database.yml}
# set :linked_dirs, %w{bin log tmp/pids tmp/cache tmp/sockets vendor/bundle public/system}

set :keep_releases, 5

set :chruby_ruby, 'ruby-2.1.0'

namespace :deploy do

  thin_cmd = "exec thin -e production -C config/thin/production.yml -R config.ru"

  desc 'Restart application'
  task :restart do
    on roles(:app), in: :sequence, wait: 5 do
      within release_path do
        execute :bundle, "#{thin_cmd} restart"
      end
    end
  end

  desc 'Start application'
  task :start do
    on roles(:app), in: :sequence, wait: 5 do
      within release_path do
        execute :bundle, "#{thin_cmd} start"
      end
    end
  end

  desc 'Stop application'
  task :start do
    on roles(:app), in: :sequence, wait: 5 do
      within release_path do
        execute :bundle, "#{thin_cmd} stop"
      end
    end
  end

  # after :restart, :clear_cache do
  #   on roles(:web), in: :groups, limit: 3, wait: 10 do
  #     # Here we can do anything such as:
  #     # within release_path do
  #     #   execute :rake, 'cache:clear'
  #     # end
  #   end
  # end

  desc "Compile assets"
  task :compile_assets do
    on :all, in: sequence, wait: 5 do
      within release_path do
        execute :bundle, "rake assets:compile"
      end
    end
  end

  after 'deploy:create_symlink', 'deploy:compile_assets'
  after :finishing, 'deploy:cleanup'

end

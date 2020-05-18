set :application, 'brettbukowski'
set :repo_url, 'git@github.com:BrettBukowski/brettbukowski.com.git'

set :deploy_to, '/var/www/brettbukowski'
set :scm, :git

set :format, :pretty
set :log_level, :debug
set :pty, true

set :linked_files, %w{config/thin.yml}
set :linked_dirs, %w{bin log tmp/pids tmp/cache tmp/sockets vendor/bundle}

set :keep_releases, 5

set :chruby_ruby, 'ruby-2.1.0'

namespace :deploy do

  thin_cmd = "exec thin -e production -C config/thin.yml -R config.ru"

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
  task :stop do
    on roles(:app), in: :sequence, wait: 5 do
      within release_path do
        execute :bundle, "#{thin_cmd} stop"
      end
    end
  end

  desc 'Compile assets'
  task :compile_assets do
    on roles(:app), in: :sequence, wait: 5 do
      within release_path do
        execute :bundle, "exec rake assets:compile"
      end
    end
  end

  desc 'Purge Cloudflare'
  task :purge_cache do
    on roles(:app), in: :sequence, wait: 5 do
      within release_path do
        execute :bundle, "exec rake cloudflare:purge_cache"
      end
    end
  end

  after 'symlink:release', 'deploy:compile_assets'
  after :finishing, 'deploy:cleanup'
  # after :finishing, 'deploy:purge_cache'
  after :finishing, 'deploy:restart'

end

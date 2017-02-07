module.exports = grunt => {
  require('time-grunt')(grunt);
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    watch: {
      bot: {
        files: ['index.js', 'app/*.js', 'app/*/*.js'],
        tasks: ['xo', 'spawnProcess:bot'],
        options: {
          spawn: false
        }
      }
    },
    spawnProcess: {
      bot: {
        args: ['index.js', '--color']
      }
    },
    xo: {
      target: ['index.js', 'app/*.js', 'app/*/*.js']
    }
  });

  grunt.registerTask('default', 'start');
  grunt.registerTask('start', ['xo', 'spawnProcess:bot', 'watch']);
};

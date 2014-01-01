module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    browserify: {
      dest: {
        src: ['src/lenses.js'],
        dest: 'lenses.js',
        options: {
          standalone: 'lenses'
        }
      }
    },
    mocha_phantomjs: {
      all: ['test-harness.html']
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-mocha-phantomjs');

  grunt.registerTask('build', ['browserify']);
  grunt.registerTask('test', ['build', 'mocha_phantomjs']);
  grunt.registerTask('default', ['test']);
};

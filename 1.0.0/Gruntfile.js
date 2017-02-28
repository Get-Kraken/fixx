module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        /**
         * Task setup: grunt-uglify
         *
         * minifies the concat files
         * example cli usage: grunt uglify
         */

        uglify: {
            options: {
                ASCIIOnly: true
            },
            dist: {
                src: 'src/fixx.js',
                dest: 'dist/fixx.min.js'
            }
        }

    });

    /** 
     * Load the tasks
     */

    grunt.loadNpmTasks('grunt-contrib-uglify');

    /**
     * Register cli tasks commands 
     */

    // -- master task to run all
    grunt.registerTask('default', [
        'uglify:dist'
    ]);

};
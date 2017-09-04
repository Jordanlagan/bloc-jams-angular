(function() {
    function SongPlayer($rootScope, Fixtures) {
        var SongPlayer = {};

        var currentAlbum = Fixtures.getAlbum();

        var currentBuzzObject = null;

        /**
        * @function setSong
        * @desc Stops currently playing song and Loads new audio file as currentBuzzObject
        * @param {Object} song
        */
        var setSong = function(song) {
            if (currentBuzzObject) {
                stopSong(SongPlayer.currentSong);
            }

            /**
            * @desc Buzz object audio file
            * @type {Object}
            */
            currentBuzzObject = new buzz.sound(song.audioUrl, {
                formats: ['mp3'],
                preload: true
            });

            currentBuzzObject.bind('timeupdate', function() {
                $rootScope.$apply(function() {
                    SongPlayer.currentTime = currentBuzzObject.getTime();
                });
                if (currentBuzzObject.isEnded()) {
                    SongPlayer.next();
                }
            });

            SongPlayer.currentSong = song;
        };

        /**
        * @function playSong
        * @desc Plays the currently paused song referenced by currentBuzzObject and sets song.playing to true
        * @param {Object} song
        */
        var playSong = function(song) {
            currentBuzzObject.play();
            song.playing = true;
        };

        var getSongIndex = function(song) {
            return currentAlbum.songs.indexOf(song);
        };

        /**
       * @function stopSong
       * @desc Stops currentBuzzObject and sets the playing property of the song to true
       * @param {Object} song
       */
        var stopSong = function(song) {
            currentBuzzObject.stop();
            song.playing = null;
        };

        /**
        * @desc Active song object from List of songs
        * @type {object}
        */
        SongPlayer.currentSong = null;

        /**
        * @desc Current playback time (in seconds) of currently playing song
        * @type {Number}
        */
        SongPlayer.currentTime = null;

        /**
        * @desc Current volume 1-100
        * @type {Number}
        */
        SongPlayer.volume = 70;

        /**
        * @function SongPlayer.play
        * @desc Method that checks if the passed in song object is equal to the currently playing song, pausing it if so, and playing it and stopping the previous playing song if not
        * @param {Object} song
        */
        SongPlayer.play = function(song) {
            song = song || SongPlayer.currentSong;
            if (SongPlayer.currentSong !== song) {
                setSong(song);
                playSong(song);
            } else if (SongPlayer.currentSong === song) {
                if (currentBuzzObject.isPaused()) {
                    playSong(song);
                }
            }
        };

        /**
        * @function SongPlayer.pause
        * @desc Method that pauses the currently playing song sets song.playing to false
        * @param {Object} song
        */
        SongPlayer.pause = function(song) {
            song = song || SongPlayer.currentSong;
            currentBuzzObject.pause();
            song.playing = false;
        };

        SongPlayer.previous = function() {
            var currentSongIndex = getSongIndex(SongPlayer.currentSong);
            currentSongIndex--;

            if (currentSongIndex < 0) {
                stopSong(SongPlayer.currentSong);
            } else {
                var song = currentAlbum.songs[currentSongIndex];
                setSong(song);
                playSong(song);
            }
        };

        SongPlayer.next = function() {
            var currentSongIndex = getSongIndex(SongPlayer.currentSong);
            currentSongIndex++;

            if (currentSongIndex >= currentAlbum.songs.length) {
                stopSong(SongPlayer.currentSong);
            } else {
                var song = currentAlbum.songs[currentSongIndex];
                setSong(song);
                playSong(song);
            }
        };

        /**
         * @function setCurrentTime
         * @desc Set current time (in seconds) of currently playing song
         * @param {Number} time
         */
         SongPlayer.setCurrentTime = function(time) {
             if (currentBuzzObject) {
                 currentBuzzObject.setTime(time);
             }
         };

         /**
          * @function setVolume
          * @desc Set current time (in seconds) of currently playing song
          * @param {Number} time
          */
          SongPlayer.setVolume = function(volume) {
              if (currentBuzzObject) {
                  currentBuzzObject.setVolume(volume);
              }
              SongPlayer.volume = volume;
          };

        return SongPlayer;
    }

    angular
        .module('blocJams')
        .factory('SongPlayer',['$rootScope', 'Fixtures',SongPlayer]);
})();

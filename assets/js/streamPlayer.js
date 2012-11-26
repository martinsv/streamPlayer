/**
 * djcrackhome's streamPlayer
 *
 * Developer: djcrackhome <sgraebner@my.canyons.edu>
 * Thanks to Raimund B., Nico N., Patrick E.
 *
 * License: This work is licensed under the Creative Commons Attribution-ShareAlike 3.0 Unported License.
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-sa/3.0/ or send a letter to Creative Commons, 444 Castro Street, Suite 900, Mountain View, California, 94041, USA.
 *
 * URL: https://github.com/djcrackhome/streamPlayer
 */

$(document).ready(function () {
    var stopVolume; // Stores retrieval volume when volume is set on mute

    setConfig();
    initScrollBar();
    initControls();
    getValues();

    function setConfig() {
        $.ajax({
            url: 'assets/php/streamPlayer.php?get=config',
            type: 'GET',
            contentType: 'application/json',
            dataType: 'jsonp',
            success: function (json) {
                if (json.player.PLAYER_INIT_PLAYLIST)
                    $("#bottomPlayer").show();
                initPlayer(json);
                window.setInterval(updateValues, json.player.PLAYER_UPDATE_INTERVAL);
            },
            error: function (xhr, status) {
                alert(status);
            }
        });
    }

    function initScrollBar() {
        var slider  = $('#slider');
        slider.slider({
            range: "min",
            min: 1,
            value: 80,
            slide: function(event, ui) {
                var value  = slider.slider('value'),
                    volume = $('.volume');
                if(value <= 5) {
                    volume.css('background-position', '0 0');
                }
                else if (value <= 25) {
                    volume.css('background-position', '0 -25px');
                }
                else if (value <= 75) {
                    volume.css('background-position', '0 -50px');
                }
                else {
                    volume.css('background-position', '0 -75px');
                };
            }
        });
        $("#bottomPlaylist").mCustomScrollbar({
            scrollButtons: {
                enable: true,
                advanced: {
                    updateOnContentResize: true
                }
            }
        });
    }

    function initPlayer(json) {
        var streamConfig = {
            'screencolor': '000000',
            'controlbar': 'none',
            'width': '1',
            'height': '1',
            'volume': json.player.PLAYER_INIT_VOLUME,
            'plugins': {
                'audiolivestream-1': {
                    format: ' ',
                    buffer: ' ',
                    backgroundCss: 'gradient',
                    trackCss: 'color: #fff; font-size: 1px;'
                }
            },
            'file': 'http://'+json.stream.STREAM_HOSTNAME+':'+json.stream.STREAM_PORT+'/;stream.mp3',
            'autostart': json.player.PLAYER_AUTO_START,
            'modes': [{
                type: 'flash',
                src: 'assets/swf/player.swf'
            }]
        }
        jwplayer('playerObject').setup(streamConfig);
    }

    function initControls() {
        $("#playerStart").click(function () {
            $("#playerStart").hide(0);
            $("#playerPause").show(0);
            if (jwplayer('playerObject').getState() == 'PAUSED') jwplayer('playerObject').play(true);
            else jwplayer('playerObject').play(false);

        });
        $("#playerPause").click(function () {
            $("#playerPause").hide(0);
            $("#playerStart").show(0);
            if (jwplayer('playerObject').getState() == 'PAUSED') jwplayer('playerObject').play(true);
            else jwplayer('playerObject').play(false);
        });
        $("#playerPlaylist").click(function () {
            $("#bottomPlayer").slideToggle();
        });
        $("#playerVolume,.volume").click(function () {
            if (jwplayer('playerObject').getVolume() == 0) {
                jwplayer('playerObject').setVolume(stopVolume);
                $("#slider").slider("option", "value", stopVolume);
                if (stopVolume <= 5) $(".volume").css('background-position', '0 0');
                else if (stopVolume <= 25) $(".volume").css('background-position', '0 -25px');
                else if (stopVolume <= 75) $(".volume").css('background-position', '0 -50px');
                else $(".volume").css('background-position', '0 -75px');
            } else {
                stopVolume = jwplayer('playerObject').getVolume();
                jwplayer('playerObject').setVolume(0);
                $("#slider").slider("option", "value", 0);
                $(".volume").css("background-position", "0 0");
            }
        });
        $("#slider").mousemove(function () {
            jwplayer('playerObject').setVolume($("#slider").slider("option", "value"));
            stopVolume = $("#slider").slider("option", "value");
        });
    }

    function getValues() {
        $.getJSON('assets/php/streamPlayer.php', function (json) {
            $("#bottomPlaylistListing").empty();
            $.each(json.SONG, function (key, value) {
                var songArray = value.TITLE.split('-');
                if (key == 0) {
                    if (!songArray[1]) $("#songTitle").html('[no.title]');
                    else $("#songTitle").html($.trim(songArray[1]));
                    if (!songArray[0]) $("#songArtist").html('[no.artist]');
                    else $("#songArtist").html($.trim(songArray[0]));
                    getCoverImage($.trim(songArray[0]) + ' ' + $.trim(songArray[1]));
                } else $("#bottomPlaylistListing").append('<li>' + value.TITLE + '</li>');
                if (key == (json.SONG.length - 1)) $("#bottomPlaylist").mCustomScrollbar('update');
            });
        });
    }

    function updateValues() {
        $.getJSON('assets/php/streamPlayer.php', function (json) {
            var songArray = json.SONG[0].TITLE.split('-');
            if (!songArray[1]) {
                if ($("#songTitle").html() != '[no.title]') getValues();
            } else {
                if ($("#songTitle").html() != $.trim(songArray[1])) getValues();
            }
        });
    }

    function getCoverImage(songTitle) {
        $("#coverContainerImage").fadeToggle('fast');
        $.ajax({
            type: 'GET',
            url: 'https://itunes.apple.com/search?term=' + encodeURIComponent(songTitle).replace(/%20/g, '+') + '&entity=song&limit=1',
            /*
             Source for Apple iTunes' Search API Doc:
             http://www.apple.com/itunes/affiliates/resources/documentation/itunes-store-web-service-search-api.html#searching
             */
            contentType: "application/json",
            dataType: 'jsonp',
            success: function (json) {
                if (json.resultCount != 0) {
                    $("#coverContainerImage").attr('src', json.results[0].artworkUrl100);
                } else {
                    $("#coverContainerImage").attr('src', './images/no_cov.png');
                }
            }
            /*,
             ++ IF BUGS HAPPEN; YOU CAN CHECK THEM HERE ++ DELETE THIS LINE THEN!
             error: function(e) {
             console.log(e.message);
             }*/
        });
        $("#coverContainerImage").fadeToggle('slow');
    }

});
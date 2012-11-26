<?php
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

/**
 * Define stream constant settings
 * STREAM_HOSTNAME can be e.g. 192.155.144.12 or testDomain.com
 * STREAM_PORT is the port where your radio is accessible e.g. 8000
 * STREAM_ADM_PASS is your SHOUTcast Server's admin password
 */
define('STREAM_HOSTNAME', '85.114.128.96');
define('STREAM_PORT', 8002);
define('STREAM_ADM_PASS', '0sykibxpmp');

/**
 * Define player constant settings
 * PLAYER_AUTO_START, a boolean, defines the automatic initialization of the stream
 * PLAYER_INIT_VOLUME defines in an int (1-100) the percentage for the initial volume
 * PLAYER_INIT_PLAYLIST, a boolean, defines if the playlist should be initialized visible
 * PLAYER_UPDATE_INTERVAL defines the interval for the refresh-rate of the meta data
 */
define('PLAYER_AUTO_START', false);
define('PLAYER_INIT_VOLUME', 80);
define('PLAYER_INIT_PLAYLIST', true);
define('PLAYER_UPDATE_INTERVAL', 15000);
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

require_once(dirname(dirname(dirname(__FILE__))) . DIRECTORY_SEPARATOR . 'config' . DIRECTORY_SEPARATOR . 'settings.php');
require_once('streamPlayer.class.php');

header('Content-Type: application/json');

if ($_GET['get'] == 'config') {
    $jsonArray = array(
        'stream' => array(
            'STREAM_HOSTNAME' => STREAM_HOSTNAME,
            'STREAM_PORT' => STREAM_PORT
        ), 'player' => array(
            'PLAYER_AUTO_START' => PLAYER_AUTO_START,
            'PLAYER_INIT_VOLUME' => PLAYER_INIT_VOLUME,
            'PLAYER_INIT_PLAYLIST' => PLAYER_INIT_PLAYLIST,
            'PLAYER_UPDATE_INTERVAL' => PLAYER_UPDATE_INTERVAL
        ));
    echo filter_var($_GET['callback'], FILTER_SANITIZE_STRING).'('.json_encode($jsonArray).')';
} else {
    $streamPlayer = new streamPlayer(STREAM_HOSTNAME, STREAM_PORT, STREAM_ADM_PASS);
    $streamPlayer->getJSON();
}
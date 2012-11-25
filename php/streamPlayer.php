<?php

class streamPlayer {
    private $serverHostname;
    private $serverPort;
    private $adminPass;
    private $xmlObject;

    public function __construct($serverHostname, $serverPort, $adminPass) {
        $this->serverHostname = $serverHostname;
        $this->serverPort = (int) $serverPort;
        $this->adminPass = $adminPass;
        $this->getXML();
    }

    public function getXML() {
        $xmlURL = 'http://'.$this->serverHostname.':'.$this->serverPort.'/admin.cgi?pass='.urlencode($this->adminPass).'&mode=viewxml';
        $this->xmlObject = simplexml_load_file(rawurlencode($xmlURL));
        if (!$this->xmlObject){
            $fp = fsockopen($this->serverHostname, $this->serverPort, $errno, $errstr, 30);
            if (!$fp) {
                echo "$errstr ($errno)<br />\n";
            } else {
                fwrite($fp,"GET /admin.cgi?pass=".$this->adminPass."&mode=viewxml HTTP/1.0\r\n");
                fwrite($fp,"User-Agent: streamPlayer (Mozilla Compatible)\r\n");
                fwrite($fp,"Host: ".$this->serverHostname."\r\n");
                fwrite($fp,"Connection: Close\r\n\r\n");
                $fpFile = null;
                while (!feof($fp))
                    $fpFile .= fgets($fp, 128);
                fclose($fp);
                $fpFile = preg_split("/[\r\n]+/", $fpFile);
                $this->xmlObject = simplexml_load_string($fpFile[2]);
                fclose($fp);
            }
        }
    }

    public function getJSON() {
        $this->getXML();
        if ($this->xmlObject) {
            header('Content-Type: application/json');
            echo json_encode($this->xmlObject->SONGHISTORY);
        }
        else
            throw new Exception('');
    }

}

$streamPlayer = new streamPlayer('46.38.235.233', 9008, 'testing');
$streamPlayer->getJSON();

?>
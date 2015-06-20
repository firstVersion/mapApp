<?php 

/**
 * プロジェクト14 タグボート情報取得と緯度経度変換とjson出力してくれるモジュール
 *
 * @author 		Sota Yano <b1013061@fun.ac.jp>
 * @version 	1.2
 * @package 	tagboat_json.php
 *
 */
ini_set('display_errors', 0);
header("Content-Type: application/json; charset=utf-8");
$urls = array("URLは秘密");
$idUrls = array("URLは秘密");
$data = array();
$json = array();
$latestData = array();
$ids = array();
//公開データを配列に格納
foreach($urls as $url)
	foreach( explode("\n", file_get_contents($url)) as $value)
		$data[] = explode(",",$value);
//船舶ID一覧取得
foreach(explode("\n",file_get_contents($idUrls[0])) as $value)
{
	$val = explode(",",$value);
	$ids[$val[0]] = $val[1];
}
foreach(explode("\n",file_get_contents($idUrls[1])) as $value)
	$ids[substr($value,0,9)][] = substr($value,11);


//船の識別番号をキーに緯度経度を変換、代入
foreach($data as $value)if(isset($value[2]))
{
	//度分
	$N_DDM = floatval($value[5]);
	$E_DDM = floatval($value[7]);
	//度
	$N_DD = round( ($N_DDM/100)-0.5 ) + ( fmod($N_DDM,100)/60 );
	$E_DD = round( ($E_DDM/100)-0.5 ) + ( fmod($E_DDM,100)/60 );
	$id = strval($value[2]);
	$json[$id][] = array($N_DD,$E_DD);
	$isTagBoat = mb_strlen(strval($value[2])) <= 2;
	$latestData[$id]=array($isTagBoat,$value[9],$value[10],$value[11],$ids[$id]);//速度、方位
}
//JSONに変換&出力 
/*
[0]:line 
[1]:speed,direction,date
*/
echo json_encode(array($json,$latestData));
?>
var map,latlng,myOptions,line=[],linePath=[],tagboat=[],ships=[];//マップ
tagboat["02"]=[];tagboat["02"]=["かえで","#F72020","./icon/red.png.02"];
tagboat["03"]=[];tagboat["03"]=["さくら","#FFD1CB","./icon/pink.png.03"];
tagboat["05"]=[];tagboat["05"]=["はりま","#4B3FFA","./icon/blue.png.05"];
tagboat["06"]=[];tagboat["06"]=["ともえ","#FAA33F","./icon/orange.png.06"];
//マップの初期設定を行う関数
function initialize()
{
latlng = new google.maps.LatLng(41.775281666667,140.70596);
myOptions = {
						zoom		: 13,
						center		: latlng,
						mapTypeId	: google.maps.MapTypeId.ROADMAP,
						mapTypeControl: false,
						streetViewControl: false,
						scaleControl:true
					};
	map = new google.maps.Map(document.getElementById("map"), myOptions);
	getJSON();
	reloadTime();
	setInterval("getJSON()",1000*60*2);
	setInterval("reloadTime()",1000*60);
}
//JSONデータを取得して各種更新作業を行う関数
function getJSON()
{
	console.log("start");
	$(function() {
		$.ajax({
				type: "POST",
				url: "sample.json",
				dataType: "json",

				success: function(data) 
				{
						console.log("success!!");
						//ピンとラインをセット
						setLineAndPin(data);
						//船の情報を更新
						refleshList(data);
				}



			});
	});
}

//呼び出されると左上の時間を更新してくれる。
function reloadTime()
{
	var now = new Date();
	var date = now.getFullYear()+"年 "+(now.getMonth()+1)+"月 "+now.getDate()+"日 "+now.getHours()+"時 "+now.getMinutes()+"分";
	$(function(){ $("h2","#timeBar").text(date); });
}

//ピンとラインをセットする
function setLineAndPin(data)
{
	line = [];
	for(var key in data[0])
	{
		line[key]=[];
		//取得したキーからそれぞれのライン情報展開
		for(var index in data[0][key])
			line[key].push( new google.maps.LatLng(data[0][key][index][0],data[0][key][index][1]) );
	}
	//船アイコン設置
	for(var key in line)
	{
		if(typeof( tagboat[key] ) == 'undefined' || tagboat[key] == null || tagboat[key][0] == "AIS船舶")
		{
			tagboat[key] = [];
			tagboat[key][0] = "AIS船舶";
			tagboat[key][1] = "#A0FF2D";
			tagboat[key][2] = "./icon/green.png";
		}

		//マップ上のラインオブジェクト新規作成
		if(linePath[key] == 'undefined' || linePath[key] == null)
		{
			linePath[key] = new google.maps.Polyline({ 
				path: line[key], 
				strokeColor: tagboat[key][1], 
				strokeOpacity: 1.0, 
				strokeWeight: 2 }); 
			linePath[key].setMap(map); 
		}//既存の場合は更新
		else
			linePath[key].setPath(line[key]);

		//マップ上のピンオブジェクト新規作成
		if(ships[key] == 'undefined' || ships[key] == null)
		{
			var icon = new google.maps.MarkerImage(tagboat[key][2]); 
				//アイコンを設定
			ships[key]=new google.maps.Marker({
				position: line[key][line[key].length-1],
				map: map,
				icon:icon,
				title: tagboat[key][0],
				zIndex: 4
			});
		}//既存の場合は位置を更新
		else
			ships[key].setPosition(line[key][line[key].length-1]);
	}
}

//船舶リストを再度生成する。
function refleshList(data)
{
	var now = new Date();
	var boatdate = (now.getMonth()+1)+"/"+now.getDate()+" "+("0"+now.getHours()).slice(-2)+":"+("0"+now.getMinutes()).slice(-2);
	$("#boatList").empty();
	$("#AISList").empty();
	//船最新の情報をtagBoatListに追加更新
	for(var key in data[1])
	{
		var idName = data[1][key][0]?'boatList':'AISList';
		var className = data[1][key][0]?'boatInfo':'AISInfo';
		$("#"+idName).prepend( getInfo(key,tagboat[key][0],data[1][key][1],boatdate,className) );
	}
	$("#AISList").prepend('<div style="height:44px;width:100%;"></div>');
	$("#boatList").prepend('<div style="height:44px;width:100%;"></div>');

	//船舶一覧監視開始
	checkReStartList("."+className);
}
//出力フォーマットを返す関数
function getInfo(key,Name,Speed,date,className)
{
	return '<table class="'+className+'" id="'+
			key+
			'">\n<tr><th><img src="'+
			tagboat[key][2]+
			'"></th><td>'+
			Name+
			'</td></tr>\n<tr><th>種類：</th><td>タグボート</td></tr>\n<tr><th>速度：</th><td>'+
			Speed+
			'kt</td></tr>\n<tr><th>更新日時：</th><td>'+
			date+
			'</td></tr>\n</table>';
}

//リストのクリック監視再開
function checkReStartList()
{
	$(function(){
		$(".boatInfo").click(function(event) {
			var key = $(this).attr("id");
			var center = line[key][line[key].length-1]; 
			map.setCenter(center);
		});
		$(".AISInfo").click(function(event) {
			var key = $(this).attr("id");
			var center = line[key][line[key].length-1]; 
			map.setCenter(center);
		});
	});
}

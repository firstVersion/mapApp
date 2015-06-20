function showBoatList(){
	$(function(){
	if($("#boatList").is(':hidden'))
	{
		$("#AISList").hide();
		$("#boatList").show();
	}
	else
		$("#boatList").hide();
	});
}
function showAISList(){
	$(function(){
	if($("#AISList").is(':hidden'))
	{
		$("#boatList").hide();
		$("#AISList").show();
	}
	else
		$("#AISList").hide();
	});
}

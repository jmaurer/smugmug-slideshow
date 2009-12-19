formatDate = function(d, delim) {
	if (!delim) delim = "";
	var y = d.getFullYear();
	var m = (d.getMonth() + 1) + "";
	var d = d.getDate() + "";
	
	if (m.length == 1)
	  m = "0" + m;
	
	if (d.length == 1)
	  d = "0" + d;
	
	return y + delim + m + delim + d;
}

add_date_ids = function(start,stop) {
	var day = new Date(start);
	var index = 0;
	while (day <= stop) {
		var id = "cal" + formatDate(day);
		$("td.fc-day" + index).attr("id", id);
		day.setDate(day.getDate() + 1);
		index += 1;		
	}
}

get_date_cells = function(start,stop) {
	var result = {}
	var day = new Date(start);
	var index = 0;
	while (day <= stop) {
		var id = formatDate(day);
		result[id] = $("td.fc-day" + index);
		day.setDate(day.getDate() + 1);
		index += 1;		
	}
	
	return result;
}

smugmug_update_view = function(view) {
	var date_cells = get_date_cells(view.visStart, view.visEnd);
	add_photos(date_cells, view.visStart, view.visEnd);
}

feed_url = function(start,stop) {
	return "http://" + nick + ".smugmug.com/hack/feed.mg?Type=usertimeline" + 
	         "&NickName=" + nick +
	         "&StartDate=" + formatDate(start,"-") + 
	         "&StopDate=" + formatDate(stop,"-") + 
	         "&SortDirection=dec" +
	         "&Paging=0" +
	         "&ImageCount=1000" + 
	         "&format=rss" +
   	       "&Size=Thumb";
}

add_photos = function(cells,start,stop) {
	var done = {};
	var url = "http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&q=";
	// console.log(feed_url(start,stop));
	url += escape(feed_url(start,stop));
	url += "&num=1000&callback=?";

	// remove existing images
	$("div.fc-day-content img.smugmug").remove();
	
	var height = $("div.fc-day-content").width();
	height -= $("div.fc-day-number").height();

	$.getJSON(url, function(data) { 
		$.smugmug.login.anonymously(function() {
			$.each(data.responseData.feed.entries, function() {
				var url = $(this.content).find("a:has(img)").attr("href");
				var img = $(this.content).find("img").attr("src");
				var info = img.match(/\/([0-9]+)_([a-zA-Z0-9]+)-/);
				var id = info[1];
				var key = info[2];
				
				$.smugmug.images.getEXIF({ImageID: id, ImageKey: key}, function(exif) {
					var dateID = exif.Image.DateTime.substr(0, 10).replace(/[^0-9]/g,"");
					
					if (!done[dateID]) {
					  cells[dateID].find("div.fc-day-content").append("<a href=\"" + url + "\"><img class=\"smugmug\" src=\"" + img + "\"></a>");
					  cells[dateID].find("div.fc-day-content img").width(height).height(height);
					  done[dateID] = true;
				  }
				});
				
			});
		});
	});
};


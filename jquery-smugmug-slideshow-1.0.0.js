 
(function($) {
	
var ss = $.slideShow = {};
var img = null;
var photos = [];
var photo_index = 0;

var nextSlide = function() {
  img.attr("src", photos[photo_index]);
  photo_index += 1;
  if (photo_index >= photos.length)
    photo_index = 0;
};

$.fn.slideShow = function(options) {
	var albumID = options.albumID;
	var size = options.size || "Medium";
	var delay = options.delay || 3000;
	
	// Setup div
	this.empty();
	this.append("<img>");
	img = this.find("img");
	
	$.smugmug.login.anonymously(function() {
		$.smugmug.images.get({AlbumID: albumID, Heavy: 1}, function(images) {
			$.each(images.Images, function() {
				photos.push(this[size + "URL"]);
			});
			
	    setInterval( "nextSlide()", delay );
			nextSlide();
		});
	});
	
};

})(jQuery);

// http://photos.hurleyhome.com/2009/xmas/2009-12-09/IMG0021/736786636_oVM2Q-S.jpg
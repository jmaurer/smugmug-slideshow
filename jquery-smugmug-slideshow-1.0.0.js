 
(function($) {
	
var ss = $.slideShow = {};
var img = null;
var photos = [];
var photo_index = 0;

nextSlide = function() {
  img.attr("src", photos[photo_index]);
  photo_index += 1;
  if (photo_index >= photos.length)
    photo_index = 0;
};

$.fn.slideShow = function(options) {
	var albumID = options.albumID;
	var size = options.size;
	
	// Setup div
	this.empty();
	this.append("<img>");
	img = this.find("img");
	
	console.log(this);
	
	$.smugmug.login.anonymously(function() {
		console.log("SlideShow!!!");
		$.smugmug.images.get({AlbumID: albumID, Heavy: 1}, function(images) {
			$.each(images.Images, function() {
				photos.push(this[size + "URL"]);
			});
			
	    setInterval( "nextSlide()", 1000 );
			nextSlide();
		});
	});
	
};

})(jQuery);

// http://photos.hurleyhome.com/2009/xmas/2009-12-09/IMG0021/736786636_oVM2Q-S.jpg
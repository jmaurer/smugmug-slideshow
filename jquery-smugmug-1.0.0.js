(function($) {
	
	$.smugmug = function() {
		alert("Smugmug Rocks");
	}
	
	$.smugmug.APIVersion = "1.2.0";	
	$.smugmug.endPoint = {
		"1.2.0": "http://api.smugmug.com/hack/json/1.2.0/",
		"1.2.1": "http://api.smugmug.com/services/api/json/1.2.1/",
		"1.2.2": "http://api.smugmug.com/services/api/json/1.2.2/"
	};
	
	$.smugmug.APIKey = "MAukm4dbY4HtE1JSbA2tZ48mIYt3rJO8";
    $.smugmug.session_id = "XXX";

	$.smugmug.apiCall = function(method, params, callback, use_https) {
		params.method = method;
		params.APIKey = $.smugmug.APIKey;

		if ($.smugmug.session_id != "XXX") {
			params.SessionID = $.smugmug.session_id;
		}

		var url = $.smugmug.endPoint[$.smugmug.APIVersion];
		url += "?";
		url += $.param(params);
		
		if ($.smugmug.APIVersion > "1.2.1")
 		  url += "&Callback=?";
        else
		  url += "&JSONCallback=?";

		if (use_https)
		  url = url.replace(/^http:/, "https:");

        // jQuery.getJSON(url, callback);
        jQuery.get(url, null, callback, 'jsonp');
	};

    $.each([
        "smugmug.albums.applyWatermark",
        "smugmug.albums.changeSettings",
        "smugmug.albums.create",
        "smugmug.albums.delete",
        "smugmug.albums.get",
        "smugmug.albums.getInfo",
        "smugmug.albums.removeWatermark",
        "smugmug.albums.reSort",

        "smugmug.albumtemplates.changeSettings",
        "smugmug.albumtemplates.create",
        "smugmug.albumtemplates.delete",
        "smugmug.albumtemplates.get",

        "smugmug.auth.checkAccessToken",
        "smugmug.auth.getAccessToken",
        "smugmug.auth.getRequestToken",

        "smugmug.categories.create",
        "smugmug.categories.delete",
        "smugmug.categories.get",
        "smugmug.categories.rename",

        "smugmug.communities.get",

        "smugmug.family.add",
        "smugmug.family.get",
        "smugmug.family.remove",
        "smugmug.family.removeAll",

        "smugmug.friends.add",
        "smugmug.friends.get",
        "smugmug.friends.remove",
        "smugmug.friends.removeAll",

        "smugmug.images.applyWatermark",
        "smugmug.images.changePosition",
        "smugmug.images.changeSettings",
        "smugmug.images.crop",
        "smugmug.images.delete",
        "smugmug.images.get",
        "smugmug.images.getEXIF",
        "smugmug.images.getInfo",
        "smugmug.images.getURLs",
        "smugmug.images.removeWatermark",
        "smugmug.images.rotate",
        "smugmug.images.upload",
        "smugmug.images.uploadFromURL",
        "smugmug.images.zoomThumbnail",

        "smugmug.login.anonymously",
        "smugmug.login.withHash",
        "smugmug.login.withPassword",

        "smugmug.logout",

        "smugmug.products.get",

        "smugmug.sharegroups.albums.add",
        "smugmug.sharegroups.albums.get",
        "smugmug.sharegroups.albums.remove",
        "smugmug.sharegroups.create",
        "smugmug.sharegroups.delete",
        "smugmug.sharegroups.get",
        "smugmug.sharegroups.getInfo",

        "smugmug.styles.getTemplates",

        "smugmug.subcategories.create",
        "smugmug.subcategories.delete",
        "smugmug.subcategories.get",
        "smugmug.subcategories.getAll",
        "smugmug.subcategories.rename",

        "smugmug.themes.get",

        "smugmug.users.getDisplayName",
        "smugmug.users.getTree",

        "smugmug.watermarks.changeSettings",
        "smugmug.watermarks.create",
        "smugmug.watermarks.delete",
        "smugmug.watermarks.get",
        "smugmug.watermarks.getInfo"

    ], function() {
		var method = this;
		var pos = jQuery;
		var minfo = method.split(".");
		var mname = minfo.pop();

		while (chunk = minfo.shift())
		{
			if (!pos[chunk])
			{
				// console.log("build: " + chunk);
				pos[chunk] = {};
			}
			pos = pos[chunk];
		}

		pos[mname] = function(params, callback) {
			if (!params) params = {};
			return $.smugmug.apiCall(method, params, callback);
		};
    });

	$.smugmug.login.withPassword = function(email, pass, callback) {
		if (typeof(email) == "object")
		{
			callback = email.callback;
			pass = email.Password;
			email = email.EmailAddress;	
		}

		$.smugmug.apiCall("smugmug.login.withPassword", {
			EmailAddress: email,
			Password: pass
		}, function(data) {
			$.smugmug.session_id = data.Login.Session.id;
			if (callback) callback();
			}, true);
		};
	
		$.smugmug.login.withHash = function(email, hash, callback) {
			if (typeof(email) == "object")
			{
				callback = email.callback;
				hash = email.PasswordHash;
				email = email.EmailAddress;	
			}

			$.smugmug.apiCall("smugmug.login.withPassword", {
				EmailAddress: email,
				PasswordHash: hash
			}, function(data) {
				$.smugmug.session_id = data.Login.Session.id;
				if (callback) callback();
				}, true);
			};

			$.smugmug.login.anonymously = function(callback) {
				$.smugmug.apiCall("smugmug.login.anonymously", {}, function(data) {
					$.smugmug.session_id = data.Login.Session.id;
					if (callback) callback();
					}, true);
				};

})(jQuery);

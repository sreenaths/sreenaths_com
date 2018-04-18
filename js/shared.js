/*
	Shared scripts : sreenaths.com
*/

function isMobile(){
	return (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) || (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.platform)));
}

function fadeOutIn( fadeOutSelector, fadeInSelector ){
	$(fadeOutSelector).fadeOut({complete:function(){
		$(fadeInSelector).fadeIn();
	}});
}

function initLoaderAnim() {
	// $('.loading-msg').css("display", "block");
	// $('.main-container').css("display", "none");

	// $(window).load(function(){
	// 	fadeOutIn( '.loading-msg', '.main-container');
	// });
}

function scrollTop(){
	$('html, body').animate({ scrollTop: 0 }, 'slow');
}

/* --- Sticky --- */
function sticky( elementSelector ){

	$(document).ready(function () {

		var element = $(elementSelector);
		var parent = element.parent();
		var doc = $(document);

		function onWindowScroll( event ){
			if(doc.scrollTop() >= parent.offset().top) {
				element.addClass("stuck");
				parent.css("min-height", element.css("height") );
			}
			else {
				element.removeClass("stuck");
			}
		}

		if(!isMobile()) {
			$(window).scroll(onWindowScroll);
			$(window).resize(onWindowScroll);
		}

	});
}

function toggleTagSelection(tagName) {
	var tagButton = $(".tag-bar").find("." + tagName);
	tagButton.toggleClass("selected");

	var selectedTags = $(".tag-bar").find(".selected").map(function (index, button) {
		return button.className.replace("selected", "").replace("button", "").trim();
	}).toArray();

	$(".projects-list").find(".project").each(selectedTags.length === 0 ? function (index, project) {
		$(project).fadeIn();
	} :function (index, project) {
		var tagNames = project.className.replace("project", "").replace("outer-block", "").trim().split(" "),
				selected = false;

		tagNames.forEach(function (tagName) {
			if(selectedTags.indexOf(tagName) !== -1) {
				selected = true;
			}
		})

		$(project)[selected ? "fadeIn" : "fadeOut"]();
	});
}
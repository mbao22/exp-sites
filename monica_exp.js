const SORT_ORDER_TOP = "TOP"
const SORT_ORDER_RECENT = "RECENT"

const REVIEWER_TYPE_ALL = "ALL"
const REVIEWER_TYPE_VERIFIED = "VERIFIED"

const STAR_ALL = "ALL"
const STAR_1_ONLY = "1"
const STAR_2_ONLY = "2"
const STAR_3_ONLY = "3"
const STAR_4_ONLY = "4"
const STAR_5_ONLY = "5"

const MEDIA_TYPE_ALL = "ALL"
const MEDIA_TYPE_IMG = "IMG_ONLY"

var star_show = STAR_ALL
var media_type = MEDIA_TYPE_ALL
var sort_order = SORT_ORDER_RECENT
var reviewer_type = REVIEWER_TYPE_ALL

var reviews_to_show = []

var event_stream = []

function refresh_reviews() {
	// console.log(sort_order);
	// console.log(reviewer_type);
	// console.log(star_show);
	// console.log(media_type);

	// filter reviews to show
	reviews_to_show = []
	for (let i = 0; i < review_list.length; i++) {
		review = review_list[i]
		if (reviewer_type == REVIEWER_TYPE_VERIFIED && !review.verified) {
			continue
		}
		if (media_type == MEDIA_TYPE_IMG && !review.has_image) {
			continue
		}
		if (star_show != STAR_ALL && review.star != star_show) {
			continue
		}
		reviews_to_show.push(review)
	}
	// TODO sort reviews

	// append reviews
	$("#sdf_comments").empty()
	for (let i=0; i<20 && i < reviews_to_show.length; i++) { 
		$("#sdf_comments").append(reviews_to_show[i].content)
	}

	// show/hide buttons
	for (let pIdx = 1; pIdx <= 5; pIdx++) {
		if ((pIdx - 1) * 20 < reviews_to_show.length) {
			$("#comment_page_btn_" + pIdx).show()
		} else {
			$("#comment_page_btn_" + pIdx).hide()
		}
	}
	if (reviews_to_show.length <= 20) {
		$("#comment_page_btn_1").hide()
	}
}

function record_event(from) {
	ts = Date.now()
	event_stream.push([ts, from])
}

function encode_event_stream() {
	for (let i = 0; i < event_stream.length; i++) {
		evt = event_stream[i]
		console.log(evt[0] + ": " + evt[1])
	}
}

$("#sort-order-dropdown-val").on('DOMSubtreeModified', function () {
	// Top reviews | Most recent
	txt_val = $(this).html().trim()
	if (txt_val) {
		sort_order = txt_val.startsWith("Top ") ? SORT_ORDER_TOP : SORT_ORDER_RECENT
		refresh_reviews()
		record_event(this.id + "|" + txt_val)
	}
});

$("#reviewer-type-dropdown-val").on('DOMSubtreeModified', function () {
	// Verified purchase only
	// All reviewers
	txt_val = $(this).html().trim()
	if (txt_val) {
		reviewer_type = txt_val.startsWith("All ") ? REVIEWER_TYPE_ALL : REVIEWER_TYPE_VERIFIED
		refresh_reviews()
		record_event(this.id + "|" + txt_val)
	}
});

$("#star-count-dropdown-val").on('DOMSubtreeModified', function () {
	// 5 star only | All stars
  	txt_val = $(this).html().trim()
	if (txt_val) {
		if (txt_val.startsWith("All ")) {
			star_show = STAR_ALL
		} else if (txt_val.startsWith("1 ")) {
			star_show = STAR_1_ONLY
		} else if (txt_val.startsWith("2 ")) {
			star_show = STAR_2_ONLY
		} else if (txt_val.startsWith("3 ")) {
			star_show = STAR_3_ONLY
		} else if (txt_val.startsWith("4 ")) {
			star_show = STAR_4_ONLY
		} else if (txt_val.startsWith("5 ")) {
			star_show = STAR_5_ONLY
		}
		refresh_reviews()
		record_event(this.id + "|" + txt_val)
	}
});

$("#media-type-dropdown-val").on('DOMSubtreeModified', function () {
	// Text, image | Image reviews only
	txt_val = $(this).html().trim()
	if (txt_val) {
		media_type = txt_val.startsWith("Text, ") ? MEDIA_TYPE_ALL : MEDIA_TYPE_IMG
		refresh_reviews()
		record_event(this.id + "|" + txt_val)
	}
});


// add page btn listeners
for (let pIdx = 1; pIdx <= 5; pIdx++) {
	$("#comment_page_btn_" + pIdx).click(function() {
		$("#sdf_comments").empty()
		startCmtIdx = ($(this).attr('btn_id') - 1) * 20
		for (let i = 0; i < 20 && (startCmtIdx + i) < reviews_to_show.length; i++) { 
			$("#sdf_comments").append(reviews_to_show[startCmtIdx + i].content)
		}
		// back to #cm_cr-view_opt_sort_filter
		record_event(this.id)
		window.location.href = "#cm_cr-view_opt_sort_filter"
	});
}

refresh_reviews()
record_event("Init")


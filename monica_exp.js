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
var sort_order = SORT_ORDER_TOP
var reviewer_type = REVIEWER_TYPE_ALL

var reviews_to_show = []

var event_stream = []


function record_event(from) {
	ts = Date.now()
	event_stream.push([ts, from])
}

function encode_event_stream() {
	return btoa(event_stream.join(";"))
}


$("#secureTransaction").click(function() {
	record_event("#secureTransaction")
	show_model("Secure Transaction", ["We work hard to protect your security and privacy. Our payment security system encrypts your information during transmission. We don’t share your credit card details with third-party sellers, and we don’t sell your information to others."])
})


$("#eligibleReturn").click(function() {
	record_event("#eligibleReturn")
	show_model("Eligible for Return, Refund or Replacement", ["This item can be returned in its original condition for a full refund or replacement within 30 days of receipt."])
})


$("#rating-whats-this").click(function() {
	record_event("#rating-whats-this")
	show_model("Ratings", ["Customer Reviews help customers to learn more about the product and decide whether it is the right product for them.",
		"To calculate the overall star rating and percentage breakdown by star, we don’t use a simple average. Instead, our system considers things like how recent a review is and if the review was written after a verified purchase. It also analyzed reviews to verify trustworthiness."])
})

$("#ask-btn").click(function() {
	record_event("##ask-btn")
	$("#ask-textarea").val("");
	show_model("Ask Questions", ["Thank you for asking questions about the product. ",
		"Once the questions are answered, they will be publicly visible on your listing page, just above the customer review section."])
})

$("#filter-whats-this").click(function() {
	record_event("#filter-whats-this")
	show_model("Filter", ["Filter function is to select a subset of reviews according to certain conditions. ",
		"You may find out the reviews written by verified buyers (\"Verified reviews only\"); or the reviews of certain star rating; or the reviews with images (\"Image reviews only\")."])
})

$("#sortby-whats-this").click(function() {
	record_event("#sortby-whats-this")
	show_model("Sorting", ["Sort function is to re-order the reviews. ",
		"You may sort the reviews according to their relevance (\"Top reviews\"), or recency (\"Most recent\"). "])
})




function add_review_model_listener() {
	$(".cr-helpful-button").click(function() {
		record_event(".helpful-button")
		show_model("Helpful", ["Thank you for your vote on the product review's helpfulness. Your vote will be used to rank all reviews displayed for the product. "])
	})

	$(".report-abuse-link").click(function() {
		record_event(".report-abuse")
		show_model("Report abuse", ["Thank you for your report on the product review. We will remove the review once it is confirmed as inappropriate."])
	})

	$(".vine-whats-this").click(function() {
		record_event(".vine-whats-this")
		show_model("Vine Voice", ["This customer had advance access to not-yet-released products for the purpose of writing reviews.", 
		  "A review written by such customers always includes the label \"Vine Customer Review of Free Product\"."])
	})

	$(".top-500-whats-this").click(function() {
		record_event(".top-500-whats-this")
		show_model("Top 500 Reviewers", ["This customer is one of the best reviewers on our platform.",
			"The badge identify the top 500 review contributors at the moment."])
	})

	$(".top-1000-whats-this").click(function() {
		record_event(".top-1000-whats-this")
		show_model("Top 1000 Reviewers", ["This customer is one of the best reviewers on our platform.",
			"The badge identify the top 1000 review contributors at the moment."])
	})
}



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
	// sort reviews
	if (sort_order == SORT_ORDER_RECENT) {
		reviews_to_show.sort(function(r1, r2) {return parseInt(r2.date)-parseInt(r1.date)})
	}


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

	add_review_model_listener()
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


$("#rating_show_star_5").click(function() {
	record_event("#rating_show_star_4")
	$("#star-count-dropdown-val").html("5 stars only")
})
$("#rating_show_star_4").click(function() {
	record_event("#rating_show_star_4")
	$("#star-count-dropdown-val").html("4 stars only")
})
$("#rating_show_star_3").click(function() {
	record_event("#rating_show_star_3")
	$("#star-count-dropdown-val").html("3 stars only")
})
$("#rating_show_star_2").click(function() {
	record_event("#rating_show_star_2")
	$("#star-count-dropdown-val").html("2 stars only")
})
$("#rating_show_star_1").click(function() {
	record_event("#rating_show_star_1")
	$("#star-count-dropdown-val").html("1 star only")
})


// add page btn listeners
for (let pIdx = 1; pIdx <= 5; pIdx++) {
	$("#comment_page_btn_" + pIdx).click(function() {
		record_event(this.id)

		$("#sdf_comments").empty()
		startCmtIdx = ($(this).attr('btn_id') - 1) * 20
		for (let i = 0; i < 20 && (startCmtIdx + i) < reviews_to_show.length; i++) { 
			$("#sdf_comments").append(reviews_to_show[startCmtIdx + i].content)
		}
		add_review_model_listener()
		
		// back to #cm_cr-view_opt_sort_filter
		window.location.href = "#cm_cr-view_opt_sort_filter"
	});
}


// feedback btn
$("#generate-feedback-btn").click(function() {
	// streamStr = event_stream.join(";")
	// base64Encode = btoa(streamStr)
	record_event("#generate-feedback-btn")
	console.log(event_stream)
	console.log(encode_event_stream())
	show_model("Your Feedback Code", [encode_event_stream()])
})


refresh_reviews()
record_event("Init")


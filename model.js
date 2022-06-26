function show_model(title, contents) {
  $("#model_title").html(title)
  $("#model_body").empty()
  for (let i = 0; i < contents.length; i++) {
    $("#model_body").append("<p>" + contents[i] + "</p>")
  }
  $("#myModal").show()
}

$("#close_model").click(function() {
  $("#myModal").hide()
})

window.onclick = function(event) {
  if (event.target == $("#myModal")[0]) {
    $("#myModal").hide()
  }
}

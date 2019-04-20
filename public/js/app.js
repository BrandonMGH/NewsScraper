 console.log("Hi")
 
 $( ".deletebtn" ).click(function(event) {
     event.preventDefault(); 
     let commentId = $(this).data("id");
     console.log(commentId)
    $.ajax({
        url: `/api/${commentId}/comment`,
        method: "DELETE",
      }).then(function() {
          window.location.href
        })
  });

//   $( ".scrapeBtn" ).click(function(event) {
//     event.preventDefault(); 
//     let commentId = $(this).data("id");
//     console.log(commentId)
//   //  $.ajax({
//   //      url: `/api/${commentId}/comment`,
//   //      method: "POST",
//   //    }).then(function() {
//   //        window.location.href
//   //      })
//  });



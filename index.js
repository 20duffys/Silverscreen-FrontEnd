window.onload = function() {
  console.log('Silver screen!');



  document.getElementById('search-btn').addEventListener('click', function(ev) {
    var apiInputBox = document.getElementById('search-box');
    var userChosenMovie = apiInputBox.value;

    // prevent default of clicking the submit button (reload page)
    ev.preventDefault();

    console.log("userChosenMovie:", userChosenMovie);

s
    var endpoint1 = 'https://www.omdbapi.com/?t=';
    var query1 = endpoint1 + userChosenMovie
    console.log("query: ", query1);

    $.ajax({
      url: query1
    }).done(function(response) {
      console.log(response);
      // get the properties we want:
      var title = response.Title;
      var year = response.Year;
      var posterURL = response.Poster;
      var director = response.Director;
      var rating = response.Rating;

      // get the elements:
      var titleEl = document.getElementById('title');
      var yearEl = document.getElementById('year');
      var posterEl = document.getElementById('poster');
      var directorEl = document.getElementById('director');
      var ratingEl = document.getElementById('rating');

      // append the data
      titleEl.innerHTML = title;
      yearEl.innerHTML = year;
      posterEl.innerHTML = '<img class="picture" src="' + posterURL + '"/>';
      directorEl.innerHTML = director;
      ratingEl.innerHTML = rating;
    }).fail(function(response) {
      console.log('uh oh it failed.');
      console.log(response);
    }).always(function(response) {
      console.log("this code runs no matter what happens.");
    });
   // end window loaded
 });

 document.getElementById('NYT-btn').addEventListener('click', function(ev) {
     var apiInputBox = document.getElementById('search-box');
     var userChosenMovie = apiInputBox.value.toString();
     ev.preventDefault();

     var url = "https://api.nytimes.com/svc/movies/v2/reviews/search.json";
   url += '?' + $.param({
     'api-key': "d9563caa2d474236b9d936a1f726dd37", //I attempted to use NYT_PUBLIC_API_KEY but it didn't work.
     'query': userChosenMovie
   });
   $.ajax({
     url: url,
     method: 'GET',
   }).done(function(result) {
     console.log(result);
     var headline = result.results[0].headline;
     var summary = result.results[0].summary_short;
     var url = result.results[0].link.url;
     console.log(headline);
     console.log(summary);
     console.log(url);

    var headlineEl = document.getElementById('headline-info');
    var summaryEl = document.getElementById('summary-info');
    var urlEl = document.getElementById('url-info');
    headlineEl.innerHTML = headline;
    summaryEl.innerHTML = summary;
    urlEl.innerHTML = url;

   }).fail(function(err) {
     throw err;
   });

//1234567890

   document.getElementById('go-button').addEventListener('click', function() {
     ev.preventDefault();
     console.log('hitlist btn clicked');


     var data = {
       name: nameAddTohitlist
     };
     // post:
     $.ajax({
       url: url + '/thehitlist/new',
       method: 'POST',
       data: data,
       dataType: 'json'
     }).done(function(response) {
       console.log( "response: ", response );
     }); // end post
   }); // end add to faves btn


   // get the elements:
   var allDiv = document.getElementById('all-div');
   var addDiv = document.getElementById('add-div');
   var findDiv = document.getElementById('find-div');
   var deleteDiv = document.getElementById('delete-div');
   var updateDiv = document.getElementById('update-div');

   // hide upon load:
   allDiv.style.display = 'none';
   addDiv.style.display = 'none';
   findDiv.style.display = 'none';
   deleteDiv.style.display = 'none';
   updateDiv.style.display = 'none';

   // the URL of our backend to use in our AJAX calls:
   var url = 'https://nameless-plains-59300.herokuapp.com';

   /* Go! button */
   document.getElementById('go-button').addEventListener('click', function(){
     // get val of radios:
     var chosenRadio = document.querySelector('.faves-radios:checked');
     if (chosenRadio.value == 'see-all') { // see all
       // show the el
       allDiv.style.display = 'block';
       // get all
       $.ajax({
         url: url + '/favorites',
         dataType: 'json'
       }).done(function(response){
         console.log("response: ", response);

         /* Loop & append to DOM: */
         var favesList = document.getElementById('faves-list');
         // remove existing li's first
         favesList.innerHTML = '';
         for (var i = 0; i < response.length; i++) {
           var liText = response[i].name;
           var theLi = document.createElement('li');
           theLi.appendChild(document.createTextNode(liText));
           favesList.appendChild(theLi);
         }
       });
     } else if (chosenRadio.value == 'add-new') { // add new
       // show add new inputs
       addDiv.style.display = 'block';

       // hide the rest
       findDiv.style.display = 'none';
       deleteDiv.style.display = 'none';
       updateDiv.style.display = 'none';
       allDiv.style.display = 'none';

     } else if (chosenRadio.value == 'find-by-name') { // find
       // show find name input
       findDiv.style.display = 'block';

       // hide the rest
       addDiv.style.display = 'none';
       deleteDiv.style.display = 'none';
       updateDiv.style.display = 'none';
       allDiv.style.display = 'none';

     } else if(chosenRadio.value == 'delete-by-name') { // delete
       // show delete name input
       deleteDiv.style.display = 'block';

       // hide the rest
       addDiv.style.display = 'none';
       findDiv.style.display = 'none';
       updateDiv.style.display = 'none';
       allDiv.style.display = 'none';

     } else if(chosenRadio.value == 'update-by-name') { // update
       // show update name input
       updateDiv.style.display = 'block';

       // hide the rest
       addDiv.style.display = 'none';
       findDiv.style.display = 'none';
       deleteDiv.style.display = 'none';
       allDiv.style.display = 'none';
     }
   }); // end submit btn fxn

   /* 'add new' button */
   document.getElementById('add-button').addEventListener('click', function() {
     var newName = document.getElementById('add-new-name').value.toLowerCase();

     var data = {
       name: newName
     };
     // post:
     $.ajax({
       url: url + '/hitlist/new',
       method: 'POST',
       data: data,
       dataType: 'json'
     }).done(function(response) {
       console.log( "response: ", response );
     }); // end AJAX
   }); // end Add Button listener

   /* 'find' button */
   document.getElementById('find-button').addEventListener('click', function() {
     var searchName = document.getElementById('find-name').value.toLowerCase();
     console.log("finding: ", searchName);
     var data = {
       name: searchName
     };
     $.ajax({
       url: url + '/favorites/' + searchName,
       method: 'get',
       data: data,
       dataType: 'json'
     }).done(function(response){
       if (response.length){
         console.log(response);
       } else {
         console.log("none found");
       }
     }); // end ajax
   }); // end search name button listener

   /* 'delete' button */
   document.getElementById('delete-button').addEventListener('click', function() {
     var deleteName = document.getElementById('delete-name').value.toLowerCase();
     console.log("deleting: ", deleteName);
     var data = {
       name: deleteName
     };
     $.ajax({
       url: url + '/favorites/' + deleteName,
       dataType: 'json',
       data: data,
       method: 'delete'
     }).done(function(response){
       console.log(deleteName + " has been deleted.");
       console.log(response);
     }); // end ajax
   }); // end delete button

   /* 'update' button */
   document.getElementById('update-button').addEventListener('click', function() {
     var nameToUpdate = document.getElementById('update-name').value.toLowerCase();
     var newName = document.getElementById('new-update-name').value.toLowerCase();
     var data = {
       name: nameToUpdate,
       newName: newName
     }
     $.ajax({
       url: url + '/hitlist/' + nameToUpdate,
       dataType: 'json',
       method: 'put',
       data: data
     }).done(function(response){
       console.log(response);
     }); // end ajax

   }); // end update button



  //  var apiInputBox = document.getElementById('search-box');
  //
  //  var endpoint2 = "https://api.nytimes.com/svc/movies/v2/reviews/search.json";
  //  endpoint2 += '?' + $.param({
  //    'api-key': "d9563caa2d474236b9d936a1f726dd37"
  //    var userChosenMovie = apiInputBox.value.toString();
  //    'query': userChosenMovie;
  //  })
  // //  var query2 = endpoint2 + userChosenMovie
  // //  console.log("query: ", query2);
  //
  // // var url = "https://api.nytimes.com/svc/movies/v2/reviews/search.json";
  // // url += '?' + $.param({
  // //   'api-key': "d9563caa2d474236b9d936a1f726dd37"
  // // });
  // $.ajax({
  //   url: endpoint2,
  //   method: 'GET',
  // }).done(function(result) {
  //   console.log(result);
  // }).fail(function(err) {
  //   throw err;
  // });

  }) // end click fxn

};

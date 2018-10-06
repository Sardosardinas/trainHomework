// Steps to complete:

// 1. Initialize Firebase
// 2. Create button for adding new employees - then update the html + update the database
// 3. Create a way to retrieve employees from the employee database.
// 4. Create a way to calculate the months worked. Using difference between start and current time.
//    Then use moment.js formatting to set difference in months.
// 5. Calculate Total billed

// 1. Initialize Firebase
var config = {
    apiKey: "AIzaSyBSEfZQGojBQcMoAy2PK23_EEyEs9dAwck",
    authDomain: "train-tracker-4b9c9.firebaseapp.com",
    databaseURL: "https://train-tracker-4b9c9.firebaseio.com",
    projectId: "train-tracker-4b9c9",
    storageBucket: "train-tracker-4b9c9.appspot.com",
    messagingSenderId: "249154461476"
};

firebase.initializeApp( config );

var database = firebase.database();

// 2. Create button for adding new employees - then update the html + update the database
$( "#add-train-btn" ).on( "click", function(event) {
  event.preventDefault();

  // Grabs user input
  var trainName = $( "#train-name-input" ).val().trim();
  var trainDestination = $( "#destination-input" ).val().trim();
  var trainStart = $( "#start-input" ).val().trim();
  var trainFrequency = $( "#frequency-input" ).val().trim();

  // Creates local "temporary" object for holding employee data
  var newTrain = {
      name : trainName,
      destination : trainDestination,
      start : trainStart,
      frequency : trainFrequency
  };
  
  // Uploads employee data to the database
  database.ref().push(newTrain);

  // Logs everything to console
  console.log(newTrain.name);
  console.log(newTrain.destination);
  console.log(newTrain.start);
  console.log(newTrain.frequency);

  alert( "Train successfully added" );

  // Clears all of the text-boxes
  $( "#train-name-input" ).val("");
  $( "#destination-input" ).val("");
  $( "#start-input" ).val("");
});

// 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
database.ref().on( "child_added", function (childSnapshot){

  console.log(childSnapshot.val());

  // Store everything into a variable.

  var trainName = childSnapshot.val().name;
  var trainDestination = childSnapshot.val().destination;
  var trainStart = childSnapshot.val().start;
  var trainFrequency = childSnapshot.val().frequency;


  // Employee Info
  console.log(trainName);
  console.log(trainDestination);
  console.log(trainStart);
  console.log(trainFrequency);

  // Prettify the employee start

  var trainStartPretty = moment.unix(trainStart).format("HH:mm");
  console.log("this is the " + trainStartPretty);

  //Calculate the minutes left using math (I'm scared :'v)
  //To calculate min left

  var firstTimeConverted = moment( trainStart, "HH:mm" ) .subtract (1, "years") ;
  var minLeft = moment().diff(moment (firstTimeConverted), "minutes") ;
  var tReminder = minLeft % trainFrequency ;
  var tMinutesTillTrain = trainFrequency - tReminder ;
  var nextTrain = moment() .add(tMinutesTillTrain, "minutes");
  console.log(minLeft);

  //Create a new row

  var newRow = $( "<tr>" ).append(
   $( "<td>" ).text(trainName),
   $( "<td>" ).text(trainDestination),
   $( "<td>" ).text(trainStart),
   $( "<td>" ).text(moment (nextTrain).format("hh:mm")),
   $( "<td>" ).text(tMinutesTillTrain)
  );
  
  //Append the new row to the table
  $("#train-table").append(newRow);


})
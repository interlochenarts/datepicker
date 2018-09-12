# datepicker
A javascript datepicker

**Usage**

Add this datepicker to your page by including the .js file in your HTML, then inside of a script tag declare a datepicker for each input you wish to you it for:

    <script src="datepicker.js">
      // Setup the datepicker
      var thepicker = new DatePicker('birthday');
    </script>
    
Where 'birthday' is the id of the the HTML input you are using the datepicker with.
  
    <input type="text" id="birthday">

To envoke the datepicker, use the .buildDatePicker() function:

    <a href="#" onclick="thepicker.buildDatePicker()">Choose Date</a>

**Options**

To specify a minimum date, use the .setMin(String date) function:

    thepicker.setMin('2018-09-03');
    
To specify a maximum date, use the .setMax(String date) function:

    thepicker.setMax('2019-12-23');
    
To specify a minimum and maximum date, use the .setRange(String minDate, String maxDate) function:

    thepicker.setRange('2018-09-03','2019-12-23');
    
To set the current date (today's date by default), use the .setCurrentDate(String date) function:

    thepicker.setCurrentDay('2018-09-05');
    
To allow weekends to be choosen (disabled by default), use the .setAllowWeekends(Boolean allow) function:

    thepicker.setAllowWeekends(true);
    

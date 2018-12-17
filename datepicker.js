class MyDatePicker {

  // Pass in the id of the input and div to be used for the picker
  constructor(id) {
    // set up an object to hold picker data
    this.datePicker = {
      id: id,
      min: null,
      max: null,
      current: null,
      weekends: false
    };

    // set up a reference to itself
    self = this;
  }

  // Set earliest date possible
  setMin(min) {
    self.datePicker.min = new Date(min);
  }

  // Set latest date possible
  setMax(max) {
    self.datePicker.max = new Date(max);
  }

  // Set date range for pickable dates
  setRange(min, max) {
    self.datePicker.min = new Date(min);
    self.datePicker.max = new Date(max);
  }

  // Set the current date
  setCurrentDate(current) {
    self.datePicker.current = new Date(current);
  }
  
  // Allow weekends to be picked?
  setAllowWeekends(allow) {
    self.datePicker.weekends = allow;
  }

  // Build modal behind date picker to close date picker... or something.
  buildOverlay() {
    var overlay = document.createElement('div');
    overlay.style.zIndex = 99;
    overlay.style.position = 'fixed';
    overlay.style.top = '0px';
    overlay.style.left = '0px';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.onclick = self.hideDatePicker;
    overlay.id = self.datePicker.id+'overlay';
    return overlay;
  }

  // Build the date picker
  buildDatePicker() {
    // handle the case of not having a current date set
    if (self.datePicker.current === null) self.datePicker.current = new Date();
    // If the picker is already there, remove it
    if (document.getElementById(self.datePicker.id+'popup') != null) {
      self.hideDatePicker();
    } else {
      // Add a new div for eveything to live in
      var containerDiv = document.createElement('div');
      // Add a new div for the date picker
      var datePickerDiv = document.createElement('div');
      datePickerDiv.id = self.datePicker.id+'popup';
      // Style, should maybe be moved out
      datePickerDiv.style = 'position:absolute; z-index:100; background:#FFF; margin-top: 30px; margin-left: 15px;';
      // The main table holds the buttons and the current month/year
      var navButtons = self.buildButtons();
      // build the calendar part of the popup
      var calendar = self.buildCalendar();
      calendar.id = self.datePicker.id+'calendar';
      // Bottom button
      var calendarFooter = document.createElement('div');
      calendarFooter.style.textAlign = 'center';
      var todayBtn = document.createElement('div');
      todayBtn.style.width = '100%';
      todayBtn.style.borderColor = '#FFF';
      todayBtn.innerHTML = 'Today';
      todayBtn.style.cursor = 'pointer';
      todayBtn.setAttribute('date', new Date());
      todayBtn.onclick = self.setNewDate;
      calendarFooter.appendChild(todayBtn);
      // add everything to the div
      datePickerDiv.appendChild(navButtons);
      datePickerDiv.appendChild(calendar);
      datePickerDiv.appendChild(calendarFooter);
      var overlay = self.buildOverlay();
      containerDiv.appendChild(datePickerDiv);
      containerDiv.appendChild(overlay);
      document.getElementById(self.datePicker.id).parentElement.appendChild(containerDiv);
      // disable buttons if necessary
      self.disableButtons();
    }
  }

  hideDatePicker() {
    if (document.getElementById(self.datePicker.id+'popup') != null) {
      document.getElementById(self.datePicker.id+'popup').remove();
      document.getElementById(self.datePicker.id+'overlay').remove();
    }
  }

  buildButtons() {
    var buttonTable = document.createElement('table');
    var header = buttonTable.insertRow(-1);
    var cell = header.insertCell(-1);

    if ((self.datePicker.min === null || self.datePicker.max === null) || (self.datePicker.max.getFullYear() - self.datePicker.min.getFullYear()) > 1) {
      //more than one year from min to max, add year buttons
      var prevYearBtn = document.createElement('input');
      prevYearBtn.type = 'button';
      // remove rounded button corners on mobile safari
      prevYearBtn.style = '-webkit-border-radius:0px; border:0px;';
      prevYearBtn.style.backgroundColor = '#FFF';
      cell.appendChild(prevYearBtn);
      prevYearBtn.value = '<';
      prevYearBtn.onclick = self.previousYear;
      prevYearBtn.id = self.datePicker.id+'prevY';
      cell = header.insertCell(-1);
      cell.colSpan = 3;
      var currYear = document.createElement('input');
      currYear.type = 'text';
      // remove rounded button corners on mobile safari
      currYear.style = '-webkit-border-radius:0px';
      cell.appendChild(currYear);
      currYear.style.textAlign = 'center';
      currYear.value = self.datePicker.current.getFullYear();
      currYear.id = self.datePicker.id+'currYear';
      currYear.disabled = 'disabled';
      currYear.style.backgroundColor = '#FFF';
      currYear.style.border = '0px';
      cell = header.insertCell(-1);
      var nextYearBtn = document.createElement('input');
      nextYearBtn.type = 'button';
      // remove rounded button corners on mobile safari
      nextYearBtn.style = '-webkit-border-radius:0px; border:0px;';
      nextYearBtn.style.backgroundColor = '#FFF';
      cell.appendChild(nextYearBtn);
      nextYearBtn.value = '>';
      nextYearBtn.onclick = self.nextYear;
      nextYearBtn.id = self.datePicker.id+'nextY';
      //add row for month buttons
      header = buttonTable.insertRow(-1);
      cell = header.insertCell(-1);
    }

    // the left/back button
    var prevMonthBtn = document.createElement('input');
    prevMonthBtn.type = 'button';
    // remove rounded button corners on mobile safari
    prevMonthBtn.style = '-webkit-border-radius:0px; border:0px';
    prevMonthBtn.style.backgroundColor = '#FFF';
    cell.appendChild(prevMonthBtn);
    prevMonthBtn.value = '<';
    prevMonthBtn.onclick = self.previousMonth;
    prevMonthBtn.id = self.datePicker.id+'prev';
    // the current month/year
    cell = header.insertCell(-1);
    cell.colSpan = 3;
    var currDate = document.createElement('input');
    currDate.type = 'text';
    // remove rounded button corners on mobile safari
    currDate.style = '-webkit-border-radius:0px';
    cell.appendChild(currDate);
    currDate.style.textAlign = 'center';
    currDate.value = self.pickerString();
    currDate.id = self.datePicker.id+'currDate';
    currDate.disabled = 'disabled';
    currDate.style.backgroundColor = '#FFF';
    currDate.style.border = '0px';
    cell = header.insertCell(-1);
    // the right/next button
    var nextMonthBtn = document.createElement('input');
    nextMonthBtn.type = 'button';
    // remove rounded button corners on mobile safari
    nextMonthBtn.style = '-webkit-border-radius:0px; border:0px';
    nextMonthBtn.style.backgroundColor = '#FFF';
    cell.appendChild(nextMonthBtn);
    nextMonthBtn.value = '>';
    nextMonthBtn.onclick = self.nextMonth;
    nextMonthBtn.id = self.datePicker.id+'next';

    return buttonTable;
  }

  buildCalendar() {
    // The list of days at the top of the calendar in order Sun->Sat
    var days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    var day;
    // The table that holds the calendar days
    var calendar = document.createElement('table');
    calendar.style.textAlign = 'center';
    calendar.style.width = '100%';
    // The header row of the calendar
    var calendarHeader = calendar.insertRow(-1);
    var cell = calendarHeader.insertCell(-1);
    days.forEach(function (element) {
      day = document.createElement('div');
      day.innerHTML = element;
      day.style.cursor = 'default';
      cell.appendChild(day);
      cell = calendarHeader.insertCell(-1);
    });
    // The 1st days row of the calendar
    calendarDays = calendar.insertRow(-1);
    // The start of the currently selected month, used to figure out which day (Sun->Sat) the month starts on
    var startOfMonth = new Date(self.datePicker.current.getFullYear()+'/'+(self.datePicker.current.getMonth()+1)+'/1');
    // Fill in the blank days before the start of the month
    for (var j = 0; j < startOfMonth.getDay(); j++) {
      cell = calendarDays.insertCell(-1);
      day = document.createElement('div');
      day.innerHTML = ' ';
      cell.appendChild(day);
    }
    // the value of the button, the date associated with it
    var buttonDate = startOfMonth;
    // which day does the month start on?
    var offset = startOfMonth.getDay();
    // what day is it today?
    var today = new Date();

    // Fill in the calendar days
    while (buttonDate.getMonth() === self.datePicker.current.getMonth()) {
      cell = calendarDays.insertCell(-1);
      day = document.createElement('div');
      day.value = buttonDate;
      day.setAttribute('date', buttonDate);
      day.style.width = '30px';
      day.style.borderColor = '#FFF';
      day.innerHTML = buttonDate.getDate().toString();
      // disable the day if min or max is set, and it falls outside of the min or max
      if ((self.datePicker.min !== null && buttonDate < self.datePicker.min) || (self.datePicker.max !== null && buttonDate > self.datePicker.max)) {
        day.disabled = true;
        day.style.color = '#CCC';
        day.style.cursor = 'default';
      } else {
        day.onclick = self.setNewDate;
        day.style.cursor = 'pointer';
      }
      cell.appendChild(day);
      // handle new row
      if ((buttonDate.getDate() + offset) % 7 === 0) {
        var calendarDays = calendar.insertRow(-1);
      }
      // underline today's date
      if (self.sameDate(today, buttonDate)) {
        day.style.textDecoration = 'underline';
      }
      // disable weekends if enabled (default)
      if (!self.datePicker.weekends && (buttonDate.getDay() === 0 || buttonDate.getDay() === 6)) {
        day.disabled = true;
        day.style.color = '#CCC';
        day.onclick = null;
        day.style.cursor = 'default';
      }
      buttonDate.setDate(buttonDate.getDate()+1);
    }
    return calendar;
  }

  // Select a new date
  setNewDate() {
    var date = new Date(window.event.target.getAttribute('date'));
    // handle dates outside the range
    if (self.datePicker.max !== null && date > self.datePicker.max) {
      date = self.datePicker.max;
    } else if (self.datePicker.min !== null && date < self.datePicker.min) {
      date = self.datePicker.min;
    }

    // Set the new value to the supplied field
    document.getElementById(self.datePicker.id).value = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();
    // bubble up an onchange event to let the browser know the value has changed
    var event = new Event('change', {bubbles: true});
    document.getElementById(self.datePicker.id).dispatchEvent(event);

    // Set the current date to the selected date
    self.datePicker.current = new Date(date);

    // Hide the date picker
    self.hideDatePicker();
  }

  // Return the month + year of currently selected month
  pickerString() {
    var theString = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][self.datePicker.current.getMonth()];
    // If the year picker is present, only return the month, else return month with year
    if ((self.datePicker.min === null || self.datePicker.max === null) || (self.datePicker.max.getFullYear() - self.datePicker.min.getFullYear()) > 1) {
      return theString;
    } else {
      return theString + ' ' + self.datePicker.current.getFullYear();
    }
  }

  // Are these two dates the same?
  sameDate(dateA, dateB) {
    return ((dateA.getDate() === dateB.getDate()) && (dateA.getMonth() === dateB.getMonth()) && (dateA.getFullYear() === dateB.getFullYear()));
  }

  // Disable the next/previous buttons as necessary
  disableButtons() {
    // ensure the calendar has been created before trying to edit it
    if (document.getElementById(self.datePicker.id+'next') !== null) {
      // disable the left button if there is a minimum date set and it's equal to the current month
      if ((self.datePicker.min !== null) && (self.datePicker.current.getMonth() === self.datePicker.min.getMonth()) && (self.datePicker.current.getFullYear() === self.datePicker.min.getFullYear())) {
        document.getElementById(self.datePicker.id + 'prev').disabled = true;
        document.getElementById(self.datePicker.id + 'prev').style.color = '#CCC';
      } else {
        document.getElementById(self.datePicker.id + 'prev').disabled = false;
        document.getElementById(self.datePicker.id + 'prev').style.color = '#000';
      }
      // disable the right button if there is a maximum date set and it's equal to the current month
      if ((self.datePicker.max !== null) && (self.datePicker.current.getMonth() === self.datePicker.max.getMonth()) && (self.datePicker.current.getFullYear() === self.datePicker.max.getFullYear())) {
        document.getElementById(self.datePicker.id + 'next').disabled = true;
        document.getElementById(self.datePicker.id + 'next').style.color = '#CCC';
      } else {
        document.getElementById(self.datePicker.id + 'next').disabled = false;
        document.getElementById(self.datePicker.id + 'next').style.color = '#000';
      }
    }
    // ensure the year picker is visible before trying to edit it
    if (document.getElementById(self.datePicker.id + 'nextY') !== null) {
      // disable the left button if the there is a maximum date set and it's equal to the current year
      if ((self.datePicker.max !== null) && (self.datePicker.current.getFullYear() === self.datePicker.max.getFullYear())) {
        document.getElementById(self.datePicker.id + 'nextY').disabled = true;
        document.getElementById(self.datePicker.id + 'nextY').style.color = '#CCC';
      } else {
        document.getElementById(self.datePicker.id + 'nextY').disabled = false;
        document.getElementById(self.datePicker.id + 'nextY').style.color = '#000';
      }
      // disable the left button if the there is a minimum date set and it's equal to the current year
      if ((self.datePicker.min !== null) && (self.datePicker.current.getFullYear() === self.datePicker.min.getFullYear())) {
        document.getElementById(self.datePicker.id + 'prevY').disabled = true;
        document.getElementById(self.datePicker.id + 'prevY').style.color = '#CCC';
      } else {
        document.getElementById(self.datePicker.id + 'prevY').disabled = false;
        document.getElementById(self.datePicker.id + 'prevY').style.color = '#000';
      }
    }
  }

  // Increment the year
  nextYear() {
    self.datePicker.current.setFullYear(self.datePicker.current.getFullYear()+1);
    // handle out of range
    if (self.datePicker.max !== null && (self.datePicker.current.getFullYear() === self.datePicker.max.getFullYear()) && (self.datePicker.current.getMonth() > self.datePicker.max.getMonth())) self.datePicker.current.setMonth(self.datePicker.max.getMonth());

    self.disableButtons();
    self.updateDates();
  }

  previousYear() {
    self.datePicker.current.setFullYear(self.datePicker.current.getFullYear()-1);
    // handle out of range
    if (self.datePicker.min !== null && (self.datePicker.current.getFullYear() === self.datePicker.min.getFullYear()) && (self.datePicker.current.getMonth() < self.datePicker.min.getMonth())) self.datePicker.current.setMonth(self.datePicker.min.getMonth());

    self.disableButtons();
    self.updateDates();
  }

  // Increment the month
  nextMonth() {
    self.datePicker.current.setMonth(self.datePicker.current.getMonth()+1);

    if (self.datePicker.current.getMonth() > 11) {
      self.datePicker.current.setMonth(0);
      self.datePicker.current.setFullYear(self.datePicker.current.getFullYear()+1);
    }

    self.disableButtons();
    self.updateDates();
  }

  // Decrement the month
  previousMonth() {
    self.datePicker.current.setMonth(self.datePicker.current.getMonth()-1);

    if (self.datePicker.current.getMonth() < 0) {
      self.datePicker.current.setMonth(12);
      self.datePicker.current.setFullYear(self.datePicker.current.getFullYear()-1);
    }

    self.disableButtons();
    self.updateDates();
  }

  // update the date labels on the datepicker
  updateDates() {
    if (document.getElementById(self.datePicker.id + 'currYear') !== null) {
      document.getElementById(self.datePicker.id + 'currYear').value = self.datePicker.current.getFullYear();
      document.getElementById(self.datePicker.id + 'currDate').value = self.pickerString();
    } else {
      if (document.getElementById(self.datePicker.id + 'currDate') !== null) {
        document.getElementById(self.datePicker.id + 'currDate').value = self.pickerString();
      }
    }
    document.getElementById(self.datePicker.id + 'calendar').replaceChild(self.buildCalendar(), document.getElementById(self.datePicker.id + 'calendar').childNodes[0]);
  }
}

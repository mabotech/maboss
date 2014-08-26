

function OpenWindow(strStartPage)
{
	var indent = 50;
	var screenw = screen.width-(indent*2)-20;
	var screenh = screen.height-(indent*2)-70;
	
	var windowOptions = "";
	windowOptions += ",toolbar=no";				// whether to display the browser toolbar, making buttons such as Back, Forward, and Stop available
	windowOptions += ",menubar=no";				// whether to display the menu bar
	windowOptions += ",resizable=yes";			// whether to display resize handles at the corners of the window
	windowOptions += ",scrollbars=no";			// whether to display horizontal and vertical scroll bars
	windowOptions += ",status=yes";				// whether to add a status bar at the bottom of the window
	windowOptions += ",location=no";			// whether to display the input field for entering URLs directly into the browser
	windowOptions += ",top="+indent;					// the distance from the top of the screen that the browser window is opened
	windowOptions += ",left="+indent;				// the distance from the left of the screen that the browser window is opened
	windowOptions += ",width="+screenw;	// the width of the browser window
	windowOptions += ",height="+screenh;	// the height of the browser window
	windowOptions += ",fullscreen=yes";			// whether to display the browser in full-screen mode.
	
	window.open(strStartPage, "_blank", windowOptions);
}
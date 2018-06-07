/** Represents a timer that can count down. */
function CountdownTimer(seconds) {
    this.seconds = seconds || (25*60);
    this.tickRate = 500; // Milliseconds
    this.tickFunctions = [];
    this.isRunning = false;
    this.startTime = null;

    // tick recursively fires tickFunctions at tickRate until time has elapsed
    this.tick = function() {
        secondsRemaining = this.SecondsRemaining();
        console.log(secondsRemaining);

        if (this.isRunning === false) {
            this.remaining = secondsRemaining;
            return;
        }

        if (secondsRemaining > 0) {
            // Execute another tick in tickRate milliseconds
            setTimeout(this.tick.bind(this), this.tickRate);
        } else {
            this.Stop();
        }

        // Execute each tickFunction in the list with this as an argument
        this.tickFunctions.forEach(function(func) {
            func.call(this);
        }.bind(this));
    };

    // Start makes the timer start ticking until stopped
    this.Start = function() {
        this.isRunning = true;
        this.startTime = Date.now();
        this.tick.bind(this)();
    };

    // Stop prevents the timer from changing until started
    this.Stop = function() {
        this.isRunning = false;
    };

    // SecondsRemaining returns the number of seconds since start as an int
    this.SecondsRemaining = function() {
        timeSince = ((Date.now() - this.startTime) / 1000) | 0;
        remaining = this.seconds - timeSince;
        return remaining > 0 ? remaining : 0;
    };

    /** Add a function to the timer's tickFunctions. */
    this.OnTick = function(func) {
        if (typeof func === 'function') {
            this.tickFunctions.push(func);
        }
    };
}

function configureStartButton(elem) {
    display = elem.parentNode.children[2].children[0];

    timer = new CountdownTimer(30);
    timer.OnTick(function(){
        display.innerHTML = timer.SecondsRemaining();
    }.bind(timer));

    elem.onclick = timer.Start.bind(timer);
}

function main() {
    buttons = document.getElementsByClassName("button-start");
    for (i = 0; i < buttons.length; i++) {
        configureStartButton(buttons[i]);
    }
}

window.onload = main;

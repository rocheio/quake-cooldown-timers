// CountdownTimer can count down from seconds to zero
function CountdownTimer(seconds, name) {
    this.seconds = seconds || (25*60);
    this.name = name || null;
    this.tickRate = 500; // Milliseconds
    this.tickFunctions = [];
    this.isRunning = false;
    this.startTime = null;

    // tick recursively fires tickFunctions at tickRate until time has elapsed
    this.tick = function() {
        secondsRemaining = this.SecondsRemaining();

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

        this.execute();
    };

    // execute runs all tickFunctions attached to the timer
    this.execute = function() {
        this.tickFunctions.forEach(function(tf) {
            func = tf[0];
            context = tf[1];
            func(this, context);
        }.bind(this));
    }

    // Start makes the timer start ticking until stopped
    this.Start = function() {
        if (this.isRunning) {
            return;
        }
        this.isRunning = true;
        this.startTime = Date.now();
        this.tick.bind(this)();
    };

    // Stop prevents the timer from changing until started
    this.Stop = function() {
        this.isRunning = false;
    };

    // Reset stops and starts the timer
    this.Reset = function() {
        this.Stop();
        this.Start();
    }

    // SecondsRemaining returns the number of seconds since start as an int
    this.SecondsRemaining = function() {
        timeSince = ((Date.now() - this.startTime) / 1000) | 0;
        remaining = this.seconds - timeSince;
        return remaining > 0 ? remaining : 0;
    };

    // OnTick adds a function to execute on each tick of the timer
    this.OnTick = function(func, context) {
        if (typeof func === 'function') {
            this.tickFunctions.push([func, context]);
        }
    };
}

// main configures the webpage on startup
function main() {
    timers = [
        "timer-mega-health",
        "timer-heavy-armor",
        "timer-quad-damage",
        "timer-protection",
    ]
    for (i = 0; i < timers.length; i++) {
        elem = document.getElementById(timers[i]);
        display = elem.children[2].children[0];
        maxSeconds = elem.children[2].children[1].innerHTML;
        startButton = elem.children[3];
        resetButton = elem.children[4];

        timer = new CountdownTimer(maxSeconds, i);
        timer.OnTick(function(timer, display){
            display.innerHTML = timer.SecondsRemaining();
        }, display);

        startButton.onclick = timer.Start.bind(timer);
        resetButton.onclick = timer.Reset.bind(timer);
    }
}

window.onload = main;

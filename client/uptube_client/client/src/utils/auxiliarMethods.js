// ---------- SmallVideoCard component

// Set time format 00:00:00
function setTimeFormat(time) {

    if (time.slice(0, 3) === "00:") {
        time = time.slice(3);
    }
    return time;
}

// Returns how long ago a video or playlists was published
function setPublicationTime(date) {

    let publicationDate = new Date(date);
    let currentDate = new Date();
    let days = Math.floor(+((currentDate - publicationDate) / (1000 * 3600 * 24)));

    if (days <= 0) { // ### Published Today
        return `Publicado hoje`;

    } else if (days > 365) {

        let publicationYear = publicationDate.getFullYear()
        let currentYear = currentDate.getFullYear()
        let years = currentYear - publicationYear

        if (years === 1) { // ### Published one year ago
            return `Publicado há ${years} ano`;
        } else { // years ago
            return `Publicado há ${years} anos`;
        }

    } else if (days === 1) { // ### Published one day ago
        return `Publicado há ${days} dia`;

    } else { // ### Published days ago
        return `Publicado há ${days} dias`;
    }
}

// Divides video tags into an array and adds a # if it doesn't exist
function setTagsForVideoCard(tags) {

    let newTags = tags.split(",");

    for (let t = 0; t < newTags.length; t++) {
        if (newTags[t].charAt(0) !== "#") {
            newTags[t] = `#${newTags[t]}`;
        }
    }

    return newTags;
}

// Get the total duration of the playlists
function setTotalDuration(time) {

    // Convert string "HH:MM:SS" to array ["HH", "MM", "SS"]:
    let newTime = time.split(":");

    let h = newTime[0]; // Get hour(s)
    let m = newTime[1]; // Get minutes(s)
    let s = newTime[2]; // Get second(s)

    let totalTime = ""; // Final string to return

    // Set hour(s):
    if (h !== "00") {
        if (h.charAt(0) === "0") {
            h = h.slice(1);
        }
        totalTime += `${h}h`;
    }

    // Set minute(s):
    if (m !== "00") {
        if (m.charAt(0) === "0") {
            m = m.slice(1);
        }
        totalTime += `${m}`;
    }

    // Set seconds(s):
    if (s !== "00" && h === "00") {
        if (s.charAt(0) === "0") {
            s = s.slice(1);
        }
        totalTime += `m${s}`;
    }

    return totalTime;
}

function setTimeWatching(dateTime) {
    let newDateTime = new Date(dateTime);

    let h = newDateTime.getHours(); // Get hour(s)
    let m = (newDateTime.getMinutes()).toString(); // Get minutes(s)
    let s = (newDateTime.getSeconds()).toString(); // Get seconds(s)
    let day = newDateTime.getDate(); // Get day
    let month = newDateTime.getMonth(); // Get month
    let year = newDateTime.getFullYear(); // Get year

    if (h < 10) {
        h = `0${h}`;
    }

    if (m < 10) {
        m = `0${m}`;
    }

    if (s > 0 && s < 10) {
        s = `0${s}`;
    }

    if (s === "0") {
        return `${day}-${month}-${year} às ${h}h ${m}m`;
    }
    return `${day}-${month}-${year} às ${h}h ${m}m ${s}s`;
}

//`---------- Achievement component

// Convert ISO date to format yyyy-mm-dd
function convertIsoToDate(date) {
    let newDate = new Date(date);
    let year = newDate.getFullYear();
    let month = newDate.getMonth() + 1;
    let day = newDate.getDate();
    if (day < 10) {
        day = `0${day}`;
    }
    if (month < 10) {
        month = `0${month}`;
    }
    return `${day}-${month}-${year}`;
}

// ---------- About user channel page

// Convert ISO date to format "dd de mm de yy"
function getChannelCreationDate(date) {

    let newDate = new Date(date);
    let year = newDate.getFullYear();
    let month = (newDate.getMonth() + 1).toString();
    let day = (newDate.getDate()).toString();

    if (day.charAt(0) === "0") {
        day = day.slice(1);
    }

    if (month === "01") {
        month = "Janeiro";
    } else if (month === "02") {
        month = "Fevereiro";
    } else if (month === "03") {
        month = "Março";
    } else if (month === "04") {
        month = "Abril";
    } else if (month === "05") {
        month = "Maio";
    } else if (month === "06") {
        month = "Junho";
    } else if (month === "07") {
        month = "Julho";
    } else if (month === "08") {
        month = "Agosto";
    } else if (month === "09") {
        month = "Setembro";
    } else if (month === "10") {
        month = "Outubro";
    } else if (month === "11") {
        month = "Novembro";
    } else if (month === "12") {
        month = "Dezembro";
    }

    return `${day} de ${month} de ${year}`;
}


export {
    setTimeFormat,
    setPublicationTime,
    setTagsForVideoCard,
    setTotalDuration,
    setTimeWatching,
    convertIsoToDate,
    getChannelCreationDate
};
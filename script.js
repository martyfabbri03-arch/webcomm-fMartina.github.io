function setValidity(inputElement, isValid, message = '') {
    if (isValid) {
        inputElement.classList.remove('is-invalid');
        inputElement.setCustomValidity(''); 
    } else {
        inputElement.classList.add('is-invalid');
        inputElement.setCustomValidity('Invalid'); 
        
        const feedbackElement = inputElement.nextElementSibling;
        if (feedbackElement && feedbackElement.classList.contains('invalid-feedback')) {
            feedbackElement.textContent = message;
        }
    }
}


const form = document.getElementById('prenotaForm');
const reservationList = document.getElementById('reservationList'); 

form.addEventListener('submit', function(e) {
    e.preventDefault();

    const nightInput = document.getElementById('Day');
    const timeInput = document.getElementById('Time');
    const peopleInput = document.getElementById('People');

    const night = nightInput.value;
    const time = timeInput.value;
    const people = peopleInput.value;
    let isValid = true;

    setValidity(nightInput, true);
    setValidity(timeInput, true);
    setValidity(peopleInput, true);

    if (!night) {
        setValidity(nightInput, false, "Please select a night.");
        isValid = false;
    }
    
    const [hours, minutes] = time.split(':').map(Number);
    const minHours = 18;
    const minMinutes = 30;
    const maxHours = 22;
    const maxMinutes = 0;
    
    const timeValid = time && 
                         (hours > minHours || (hours === minHours && minutes >= minMinutes)) && 
                         (hours < maxHours || (hours === maxHours && minutes <= maxMinutes)) && 
                         (minutes % 30 === 0);

    if (!timeValid) {
        setValidity(timeInput, false, "Invalid time. Select between 18:30 and 22:00, in 30-minute increments.");
        isValid = false;
    } 

    if (Number(people) < 1 || isNaN(Number(people))) {
        setValidity(peopleInput, false, "The number of people must be at least 1.");
        isValid = false;
    } 


    if (!isValid) {
        return;
    }


    const listItem = document.createElement('li'); 
    listItem.textContent = `Day: ${night}, Time: ${time}, People: ${people}`;
    
    reservationList.appendChild(listItem);

    form.reset();
});

function setCookie(name, value, days) {
    let date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    let expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/;SameSite=Lax";
}

function getCookie(name) {
    let cookies = document.cookie.split("; ");
    for (let c of cookies) {
        let [key, val] = c.split("=");
        if (key === name) return val;
    }
    return null;
}

document.addEventListener("DOMContentLoaded", function () {
    const banner = document.getElementById("cookieBanner");
    const acceptBtn = document.getElementById("acceptCookiesBtn");
    const rejectBtn = document.getElementById("rejectCookiesBtn"); 
    
    const CONSENT_COOKIE_NAME = "cookieConsent";

    const consent = getCookie(CONSENT_COOKIE_NAME);
    if (!consent) {
        banner.style.display = "block";
    }

    acceptBtn.addEventListener("click", function () {
        setCookie(CONSENT_COOKIE_NAME, "accepted");
        banner.style.display = "none";
        
    });

    rejectBtn.addEventListener("click", function () {
        setCookie(CONSENT_COOKIE_NAME, "rejected"); 
        banner.style.display = "none";
        
    });
});
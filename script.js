//Init sSppechSynth API
const synth = window.speechSynthesis;

//Init DOM Elements
const textForm = document.querySelector('form');
const textInput = document.querySelector('#text-input');
const voiceSelect = document.querySelector('#voice-select');
const rate = document.querySelector('#rate');
const rateValue = document.querySelector('#rate-value');
const pitch = document.querySelector('#pitch');
const pitchValue = document.querySelector('#pitch-value');
const body = document.querySelector('body');

//Init voices array
let voices = [];
    
//adding the voices from the API
const getVoices = () =>{
    voices = synth.getVoices();         //the voices will be empty because when a page is loaded, it takes some amount of time to populate the voices array as it does so, asynchronously. Due to which when the array is logged into the console immediately after the page loads, we see an empty array...
    console.log(voices);

    //loop through voices and create an option for each one
    voices.forEach(voice =>{
        //create an option element
        const option = document.createElement('option');

        //fill option with voice and language
        option.textContent = voice.name +'('+voice.lang+')'

        //set the attributes of the option element
        option.setAttribute('data-lang', voice.lang);
        option.setAttribute('data-name', voice.name);


        //append the option to the list of the languages
        voiceSelect.appendChild(option);
    })
};

getVoices();

//for above discussed reason 
if(synth.onvoiceschanged !== undefined){
    synth.onvoiceschanged = getVoices;
}

//implementing the speak function
const speak = () =>{

    //if already speaking do not speak again when 'Speak it' is clicked
    if(synth.speaking){
        console.error('Already Speaking...');
        return;
    }

    //if there is some text use 'SpeechSynthesisUtterance' --> method of the API speech Synthesis to speak
    if(textInput.value !== ''){

        //backgrounf effect of gif
        body.style.background = 'url(wave.gif)';
        //To repeat it only in the x direction
        body.style.backgroundRepeat = 'repeat-x';
        //cover the whole background
        body.style.backgroundPosition = 'center center'; // Center the wave horizontally and vertically
        body.style.backgroundSize = 'auto% 150%'; // Changed from backdropSize to backgroundSize and cover entire screen



        //fetching the text to speak
        const speakText = new SpeechSynthesisUtterance(textInput.value);

        //after done speaking
        speakText.onend = e =>{
            console.log('Done Speaking...');
            body.style.background = 'none';
        }

        //for speaking error
        speakText.onerror = e =>{
            console.log('Something went wrong...');
        }

        //speak the select voice
        const selectedVoice = voiceSelect.selectedOptions[0].getAttribute('data-name');

        //loop through voices and get the selectedVoice and speak it
        voices.forEach(voice =>{

            if(voice.name === selectedVoice){
                speakText.voice = voice;
            }
        });


        //setting the rate and the pitch
        speakText.rate = rate.value;
        speakText.pitch = pitch.value;

        //now speak
        synth.speak(speakText);
    }
}

//eventlisteners

//1. TextForm submit
textForm.addEventListener('submit', e=>{
    e.preventDefault();
    speak();
    textInput.blur();
});

//2. setting the rate and pitch value
rate.addEventListener('change', e=>{
    rateValue.textContent = rate.value;
});

pitch.addEventListener('change', e=>{
    pitchValue.textContent = pitch.value;
});

//voice select change...when diff voice is selected speak in that voice without the need of clicking 'speak it'
voiceSelect.addEventListener('change', e=>{
    speak();
})
const form = document.querySelector("section.top-banner form")
const input = document.querySelector(".top-banner input")
const msg = document.querySelector("span.msg")
const list = document.querySelector(".ajax-section .cities")

localStorage.setItem("apiKey", "a3bc332a4c06e3a534abb177ad37d8fa");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    getWeatherDataFromApi();
});

const getWeatherDataFromApi = async() =>{
    // alert("http request gone");
   

    let tokenKey = localStorage.getItem("apiKey");
    
    let inputVal = input.value;
    let unitType = "metric";
    let lang = "tr";

    let url =`https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${tokenKey}&units=${unitType}`;

    try {
        // const response = await fetch(url).then(response => response.json()); yerine axios yazdık
        const response = await axios(url);
       
        const {name, main, sys, weather} =response.data;
        console.log(response.data);

        let iconUrl = `http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;

        const cityListItems = list.querySelectorAll(".city");
        const cityListItemsArray = Array.from(cityListItems);

        if(cityListItemsArray.lenght>0){
            const filterArray = cityListItemsArray.filter(cityCard => cityCard.querySelector("span").innerText == name);

            if(filterArray.lenght>0){
                msg.innerText = `you already know the weather for ${name}, please search for anothe city`;
                setTimeout(() =>{
                    msg.innerText = "";
                }, 5000)
                form.reset();
                return;
            }
        }

        const createdLi = document.createElement("li");
        createdLi.classList.add("city");
        const createdLiInnerHTML =
         `<h2 class="city-name" data-name="${name}, ${sys.country}">
            <span>${name}</span>
            <sup>${sys.country}</sup>
        </h2>
        <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
        <figure>
            <img class="city-icon" src="${iconUrl}">
            <figcaption>${weather[0].description}</figcaption>
        </figure>`;

        createdLi.innerHTML = createdLiInnerHTML

        // list.append(createdLi); burası her yeni şehri sona yazdırır 
        list.prepend(createdLi); // burası şehri başa yazdırır.

    } 
    catch (error) {
        msg.innerText = error;
        setTimeout(() =>{
            msg.innerText = "";
        }, 5000)
    }
    form.reset();

}
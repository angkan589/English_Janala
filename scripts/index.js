document.getElementById("homebutton").addEventListener('click', function () {
    const wordContainer = document.getElementById("word-container")
    wordContainer.innerHTML = ""
    wordContainer.classList.remove("grid", "grid-cols-3", "gap-5")
    wordContainer.innerHTML = `
    <div class="items-center mx-auto flex flex-col justify-center gap-5">
            <p class="text-sm font-[1px] font-bangla opacity-50">আপনি এখনো কোন Lesson Select করেন নি</p>
            <h1 class="text-2xl">একটি Lesson Select করুন।</h1>
        </div>
    `
    document.querySelectorAll("[id^='level-']").forEach(btn => {
        btn.classList.remove("bg-blue-600", "text-white")
        btn.classList.add("bg-transparent")
        btn.querySelector("i").classList.remove("text-white")
    })
})

const manageLoading = (status) => {
    if (status == true) {
        document.getElementById("loading").classList.remove("hidden")
        document.getElementById("word-container").classList.add("hidden")
    }
    else {
        document.getElementById("loading").classList.add("hidden")
        document.getElementById("word-container").classList.remove("hidden")
    }
}

const loadLessons = () => {
    manageLoading(true)
    fetch("https://openapi.programming-hero.com/api/levels/all")
        .then(res => res.json())
        .then(json => displayLessons(json.data))
}

const displayLessons = (lessons) => {
    const levelContainer = document.getElementById("level-container")
    levelContainer.innerHTML = ""
    lessons.forEach(lesson => {
        const btnDiv = document.createElement("div")
        btnDiv.innerHTML = `
              <button id="level-${lesson.level_no}" onClick=loadLevelWord(${lesson.level_no}) class="btn bg-transparent border-[#422AD5] my-2 text-[#422AD5] hover:bg-blue-600 hover:text-white group"><i
                        class="fa-solid fa-book-open text-[#422AD5] group-hover:text-white"></i> Lesson-${lesson.level_no}</button>
         `
        levelContainer.append(btnDiv)
    });
    manageLoading(false)
}

loadLessons()

const loadLevelWord = (id) => {
    manageLoading(true)
    const url = `https://openapi.programming-hero.com/api/level/${id}`
    fetch(url)
        .then(res => res.json())
        .then(data => displayLevelWord(data.data, id))
}

const displayLevelWord = (words, id) => {
    const wordContainer = document.getElementById("word-container")
    wordContainer.innerHTML = ""
    if (id) {
        document.querySelectorAll("[id^='level-']").forEach(btn => {
            btn.classList.remove("bg-blue-600", "text-white")
            btn.classList.add("bg-transparent")
            btn.querySelector("i").classList.remove("text-white")
        })
        const level = document.getElementById(`level-${id}`)
        level.classList.add("bg-blue-600", "text-white")
        level.classList.remove("bg-transparent")
        level.querySelector("i").classList.add("text-white")
    }
    if (words.length == 0) {
        if (wordContainer.classList.contains("grid")) {
            wordContainer.classList.remove("grid", "grid-cols-3", "gap-5")
        }
        if (id) {
            wordContainer.innerHTML = `
            <div class="flex flex-col gap-5 justify-between items-center">
            <img src="/assets/alert-error.png" alt="">
            <p class="text-[12px] font-[20] font-bangla opacity-80">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
            <h1 class="text-2xl">নেক্সট Lesson এ যান</h1>
            </div>
        `
        }
        else {
            wordContainer.innerHTML = `
            <div class="flex flex-col gap-5 justify-between items-center">
            <img src="/assets/alert-error.png" alt="">
            <h1 class="text-2xl">কোন Vocabulary পাওয়া যায়নি।</h1>
            </div>
        `
        }
        manageLoading(false)
        return;
    }
    wordContainer.classList.add("grid", "grid-cols-3", "gap-5")
    words.forEach(word => {
        const wordDiv = document.createElement("div")
        wordDiv.innerHTML = `
        <div class="bg-white px-5 py-10 space-y-4 rounded-lg shadow-sm text-center">
            <h1 class="font-bold text-2xl">${word.word ? word.word : "শব্দ পাওয়া যায়নি"}</h1>
            <p>meaning/pronunciation</p>
            <div class="font-semibold mb-10 font-bangla text-2xl">${word.meaning ? word.meaning : "অর্থ পওয়া যায়নি"}/${word.pronunciation ? word.pronunciation : "উচ্চারণ পাওয়া যায়নি"}</div>
            <div class="flex justify-between items-center">
                <button type="button" onclick = "loadWordDetail(${word.id})" class="btn hover:bg-gray-300 hover:text-white"><i class="fa-solid fa-circle-info"></i></button>
                <button onclick="pronounceWord('${word.word}')" class="btn hover:bg-gray-300 hover:text-white"><i class="fa-solid fa-volume-high"></i></button>
            </div>
        </div>
        `
        wordContainer.append(wordDiv)
    })
    manageLoading(false)
}

const loadWordDetail = async (id) => {
    const url = `https://openapi.programming-hero.com/api/word/${id}`
    const res = await fetch(url)
    const details = await res.json()
    displayWordDetails(details.data)
}

const displayWordDetails = (word) => {
    const detailsBox = document.getElementById("details-container")
    detailsBox.innerHTML = ""
    detailsBox.innerHTML = `
    <div class="border border-gray-100 p-3 bg-slate-50">
            <h1 class="mb-2 font-bold text-lg">${word.word} (<i class="fa-solid fa-microphone-lines"></i> ${word.pronunciation} )</h1>
            <h1 class="font-semibold text-lg">Meaning</h1>
            <p class="mb-2 text-sm">${word.meaning}</p>
            <h1 class="font-semibold text-sm">Example</h1>
            <p class="mb-2 text-sm">${word.sentence}</p>
            <h1 class="font-bangla font-semibold text-sm">সমার্থক শব্দ গুলো</h1>
            <div class="">${createElements(word.synonyms)}</div>
        </div>
    `
    document.getElementById("word_modal").showModal()
}

const createElements = (arr) => {
    if (arr.length == 0) {
        return `<h1 class="font-semibold text-sm">No synonyms to show</h1>`
    }
    const htmlElements = arr.map((el) => `<span class="btn">${el}</span>`)
    return htmlElements.join(" ")
}

document.getElementById("btn-src").addEventListener('click', function () {
    document.querySelectorAll("[id^='level-']").forEach(btn => {
        btn.classList.remove("bg-blue-600", "text-white")
        btn.classList.add("bg-transparent")
        btn.querySelector("i").classList.remove("text-white")
    })
    const input = document.getElementById("input-src")
    const srcValue = input.value.trim().toLowerCase()
    fetch("https://openapi.programming-hero.com/api/words/all").then(res => res.json()).then(data => {
        const allWords = data.data
        const filterWords = allWords.filter(word => word.word.toLowerCase().includes(srcValue))
        displayLevelWord(filterWords)
    })
})

function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}
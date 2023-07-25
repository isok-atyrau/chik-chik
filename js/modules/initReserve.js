import { addPreload, removePreload } from "./util.js"
import { API_URL } from "./const.js"

const year = new Date().getFullYear()

const addDisabled = (arr) => {
   arr.forEach((elem) => {
      elem.disabled = true
   })
}

const removeDisabled = (arr) => {
   arr.forEach((elem) => {
      elem.disabled = false
   })
}

const renderSpec = (wpapper, data) => {
   const labels = data.map((item) => {
      const label = document.createElement("label")
      label.classList.add("radio")
      label.innerHTML = `<input class="radio__input" type="radio" name="special" value="${item.id}">
       <span class="radio__label radio__label_spec" style="--bg-image: url(${API_URL}${item.img})">${item.name}</span>`

      return label
   })

   wpapper.append(...labels)
}

const renderMonth = (wpapper, data) => {
   const labels = data.map((month) => {
      const label = document.createElement("label")
      label.classList.add("radio")
      label.innerHTML = `<input class="radio__input" type="radio" name="month" value="${month}">
       <span class="radio__label">${new Intl.DateTimeFormat("ru-RU", {
          month: "long",
       }).format(new Date(year, month))}</span>`

      return label
   })

   wpapper.append(...labels)
}

const renderDay = (wpapper, data, month) => {
   const labels = data.map((day) => {
      const label = document.createElement("label")
      label.classList.add("radio")
      label.innerHTML = `<input class="radio__input" type="radio" name="day" value="${day}">
       <span class="radio__label">${new Intl.DateTimeFormat("ru-RU", {
          month: "long",
          day: "numeric",
       }).format(new Date(year, month, day))}</span>`

      return label
   })

   wpapper.append(...labels)
}

const renderTime = (wpapper, data) => {
   const labels = data.map((time) => {
      const label = document.createElement("label")
      label.classList.add("radio")
      label.innerHTML = `<input class="radio__input" type="radio" name="time" value="${time}">
       <span class="radio__label">${time}</span>`

      return label
   })

   wpapper.append(...labels)
}

export const initReserve = () => {
   const reserveForm = document.querySelector(".reserve__form")
   const {
      fieldservice,
      fieldspec,
      fielddate,
      fieldmonth,
      fieldday,
      fieldtime,
      btn,
   } = reserveForm

   addDisabled([fieldspec, fielddate, fieldmonth, fieldday, fieldtime, btn])

   reserveForm.addEventListener("change", async (e) => {
      const target = e.target

      if (target.name === `service`) {
         addDisabled([
            fieldspec,
            fielddate,
            fieldmonth,
            fieldday,
            fieldtime,
            btn,
         ])
         fieldspec.innerHTML = `<legend class="reserve__legend">Специалист</legend>`
         addPreload(fieldspec)

         const responce = await fetch(`${API_URL}/api?service=${target.value}`)

         const data = await responce.json()
         renderSpec(fieldspec, data)

         removePreload(fieldspec)
         removeDisabled([fieldspec])
      }

      if (target.name === `special`) {
         addDisabled([fielddate, fieldmonth, fieldday, fieldtime, btn])
         addPreload(fieldmonth)

         const responce = await fetch(`${API_URL}/api?spec=${target.value}`)

         const data = await responce.json()
         fieldmonth.textContent = ""
         renderMonth(fieldmonth, data)

         removePreload(fieldmonth)
         removeDisabled([fielddate, fieldmonth])
      }

      if (target.name === `month`) {
         addDisabled([fieldday, fieldtime, btn])
         addPreload(fieldday)

         const responce = await fetch(
            `${API_URL}/api?spec=${reserveForm.special.value}&month=${target.value}`
         )

         const data = await responce.json()
         fieldday.textContent = ""
         renderDay(fieldday, data, target.value)

         removePreload(fieldday)
         removeDisabled([fieldday])
      }

      if (target.name === `day`) {
         addDisabled([fieldtime, btn])
         addPreload(fieldtime)

         const responce = await fetch(
            `${API_URL}/api?spec=${reserveForm.special.value}&month=${reserveForm.month.value}&day=${target.value}`
         )

         const data = await responce.json()
         fieldtime.textContent = ""
         renderTime(fieldtime, data)

         removePreload(fieldtime)
         removeDisabled([fieldtime])
      }
      if (target.name === `time`) {
         removeDisabled([btn])
      }
   })

   reserveForm.addEventListener("submit", async (e) => {
      e.preventDefault()

      const formData = new FormData(reserveForm)

      const json = JSON.stringify(Object.fromEntries(formData))

      const responce = await fetch(`${API_URL}/api/order`, {
         method: "POST",
         body: json,
      })

      const data = await responce.json()

      addDisabled([
         fieldservice,
         fieldspec,
         fielddate,
         fieldmonth,
         fieldday,
         fieldtime,
         btn,
      ])

      const succes = document.createElement("p")
      succes.textContent = `Спасибо за ваш бронь №${
         data.id
      }!!!\n Ждем вас ${new Intl.DateTimeFormat("ru-RU", {
         month: "long",
         day: "numeric",
      }).format(new Date(year, data.month, data.day))}\n
      Время ${data.time}`

      reserveForm.append(succes)
   })
}

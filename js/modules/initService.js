import { addPreload, removePreload } from "./util.js";
import { API_URL } from "./const.js";

const renderPrice = (wpapper, data) => {
   data.forEach((item, index) => {
      const priceItem = document.createElement("li");
      priceItem.classList.add("price__item");
      priceItem.innerHTML = `
               <span class="price__item-title">${item.name}</span>
          <span class="price__item-count">${item.price} руб</span>
       `;

      wpapper.append(priceItem);
   });
};

const renderService = (wpapper, data) => {
   const labels = data.map((item) => {
      const label = document.createElement("label");
      label.classList.add("radio");
      label.innerHTML = ` <input class="radio__input" type="radio" name="service" value="${item.id}">
       <span class="radio__label">${item.name}</span>`;

      return label;
   });

   wpapper.append(...labels);
};

export const initService = () => {
   const reserveFieldsetService = document.querySelector(
      ".reserve__fieldset_service"
   );
   const priceList = document.querySelector(".price__list");
   priceList.textContent = "";
   addPreload(priceList);

   reserveFieldsetService.innerHTML = `<legend class="reserve__legend">Услуга</legend>`;
   addPreload(reserveFieldsetService);
   fetch(`${API_URL}/api`)
      .then((responce) => {
         if (responce.status === 200 || responce.status === 201) {
            return responce.json();
         } else {
            throw new Error(responce.status);
         }
      })
      .then((data) => {
         renderPrice(priceList, data);
         removePreload(priceList);
         return data;
      })
      .then((data) => {
         renderService(reserveFieldsetService, data);
         removePreload(reserveFieldsetService);
      })
      .catch((error) => {
         alert(`Произошла ошибка, статус ${error.message}`);
      });
};

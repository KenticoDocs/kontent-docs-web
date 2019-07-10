/**
 * Initializes lightbox and caption if available
 */
(() => {
    setTimeout(() => {
      let imgs = document.querySelectorAll('img.article__add-lightbox');
  
      let interval = setInterval(() => {
        imgs = document.querySelectorAll('img.article__add-lightbox');
  
        if (imgs.length) {
          initLightbox();
          clearInterval(interval);
        }
      }, 100);
  
      const initLightbox = () => {
        document.querySelectorAll('img.article__add-lightbox').forEach((item) => {
          let figcaption = '';
          let nextSibling = item.nextSibling;
          let nextNextSibling = nextSibling.nextSibling;
  
          // Find caption in DOM generated by Kentico Cloud
          let captionElem = (() => {
            if (nextSibling && nextSibling.tagName === 'FIGCAPTION') {
              return nextSibling;
            } else if (nextNextSibling && nextNextSibling.tagName === 'FIGCAPTION') {
              return nextNextSibling;
            } else {
              return null;
            }
          })();
  
          if (captionElem !== null) {
            figcaption = `<div class="basicLightbox__description">${captionElem.innerHTML}</div>`;
          }
  
          // Init lighbox with caption
          item.addEventListener('click', () => {
            basicLightbox.create(`<img src="${item.getAttribute('src').split("?")[0] + '?w=1600&fm=jpg&auto=format'}">${figcaption}`).show();
          });
        });
      }
    }, 0);
  })();
  
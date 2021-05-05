/**
 * Initializes lightbox and caption if available
 */
(() => {
  const showCloseButtonOnElemLoaded = (elemSelector, instance) => {
    const close = document.querySelector('.basicLightbox__close-container--hidden');
    const elem = document.querySelector(`.basicLightbox__close-container + ${elemSelector}`);
    const interval = setInterval(function () {
      if (close && elem) {
        if (elem.clientWidth > 0) {
          close.classList.remove('basicLightbox__close-container--hidden');
          close.querySelector('.basicLightbox__close').addEventListener('click', function () {
            if (instance && instance.close) {
              instance.close();
            }
          });
          clearInterval(interval);
        }
      }
    }, 250);
  };

  const registerCloseOnElemClick = (instance, elemSelector) => {
    document.querySelector(elemSelector).addEventListener('click', function () {
      if (instance && instance.close) {
        instance.close();
      }
    });
  };

  const registerCloseOnEsc = (instance) => {
    document.onkeydown = function(e) {
      e = e || window.event;
      if (e.key === 'Escape' && instance && instance.close) {
        instance.close();
      }
    };
  };

  const initLightboxOnElemsAvailable = (selector, callback) => {
    const interval = setInterval(() => {
      const elems = document.querySelectorAll(selector);

      if (elems.length) {
        callback();
        clearInterval(interval);
      }
    }, 100);
  };

  const zoomItem = (elemSelector, basicLightboxInstance, content, figcaption) => {
    basicLightboxInstance = window.basicLightbox.create(`<div class="basicLightbox__close-container basicLightbox__close-container--hidden"><div class="basicLightbox__close"></div></div>${content}${figcaption}`);
    basicLightboxInstance.show();

    if (elemSelector === 'video') {
      const video = document.querySelector('.basicLightbox video');
      videoHelper.init({
        elem: video,
        loop: 3,
        customControls: ['play/pause', 'replay']
      });
      elemSelector = '.video-controls';
    }

    showCloseButtonOnElemLoaded(elemSelector, basicLightboxInstance);
    registerCloseOnEsc(basicLightboxInstance);

    return basicLightboxInstance;
  };

  const initLightboxOnImages = () => {
    setTimeout(() => {
      const initLightbox = () => {
        document.querySelectorAll('[data-lightbox-image]').forEach((item) => {
          // Find caption in DOM generated by Kentico Kontent
          const nextSibling = item.nextSibling;
          const nextNextSibling = nextSibling.nextSibling;
          let captionElem = null;
          let figcaption = '';
          if (nextSibling && nextSibling.tagName === 'FIGCAPTION') {
            captionElem = nextSibling;
          } else if (nextNextSibling && nextNextSibling.tagName === 'FIGCAPTION') {
            captionElem = nextNextSibling;
          }
          if (captionElem !== null) {
            figcaption = `<div class="basicLightbox__description">${captionElem.innerHTML}</div>`;
          }

          const width = item.getAttribute('width');
          const height = item.getAttribute('height');
          const content = `<img src="${item.getAttribute('src').split('?')[0] + '?w=1600&fm=pjpg&auto=format'}"${width ? ` width=${width}` : ''}${height ? ` height=${height}` : ''}>`;

          // Init lighbox with caption
          let instance;
          item.addEventListener('click', () => {
            instance = zoomItem('img', instance, content, figcaption);
          });
        });
      }

      initLightboxOnElemsAvailable('[data-lightbox-image]', initLightbox);
    }, 0);
  };

  const initLightboxOnEmbeds = () => {
    setTimeout(() => {
      const initLightbox = () => {
        document.querySelectorAll('[data-lightbox-embed]').forEach((item) => {
          // Find caption in DOM generated by Kentico Kontent
          const figcaptionElem = item.parentNode.nextSibling;
          let captionElem = null;
          let figcaption = '';
          if (figcaptionElem && figcaptionElem.classList.contains('figcaption')) {
            captionElem = figcaptionElem;
          }
          if (captionElem !== null) {
            figcaption = `<div class="basicLightbox__description">${captionElem.innerHTML}</div>`;
          }

          // Init lighbox
          let instance;
          item.addEventListener('click', (e) => {
            e.preventDefault();
            const itemToZoom = document.querySelector(`#${item.getAttribute('data-lightbox-embed')} iframe`);
            const wrap = document.createElement('div');
            wrap.appendChild(itemToZoom.cloneNode(true));

            if (itemToZoom) {
              instance = zoomItem('iframe', instance, wrap.innerHTML, figcaption);
            }
          });
        });
      }

      initLightboxOnElemsAvailable('[data-lightbox-embed]', initLightbox);
    }, 0);
  };

  const initLightboxOnChangelog = () => {
    setTimeout(() => {
      const initLightbox = () => {
        document.querySelectorAll('[href="#subscribe-breaking-changes-email"]').forEach((item) => {
          // Init lighbox with caption
          let instance;
          item.addEventListener('click', (e) => {
            e.preventDefault();
            const itemToZoom = '<div class="iframe-box"><div class="iframe-box__close"></div><iframe width="240" height="145" src="https://tracker.kontent.ai/l/849473/2020-04-21/4qsx" /></div>';

            if (itemToZoom) {
              instance = window.basicLightbox.create(itemToZoom);
              instance.show();
              registerCloseOnEsc(instance);
              registerCloseOnElemClick(instance, '.iframe-box__close');
            }
          });
        });
      }

      initLightboxOnElemsAvailable('[href="#subscribe-breaking-changes-email"]', initLightbox);
    }, 0);
  };

  const initLightboxOnVideos = () => {
    setTimeout(() => {
      const initLightbox = () => {
        document.querySelectorAll('[data-lightbox-video]').forEach((item) => {
          const trigger = item.querySelector('.video-controls__lightbox');
          if (!trigger) return;
          // Find caption in DOM generated by Kentico Kontent
          let figcaptionElem = item.nextSibling;
          let captionElem = null;
          let figcaption = '';
          if (!figcaptionElem) {
            figcaptionElem = item.parentNode.nextSibling;
          }
          if (figcaptionElem && figcaptionElem.tagName === 'FIGCAPTION') {
            captionElem = figcaptionElem;
          }
          if (captionElem !== null) {
            figcaption = `<div class="basicLightbox__description">${captionElem.innerHTML}</div>`;
          }

          // Init lighbox
          let instance;
          trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const itemToZoom = item.querySelector('video');
            const wrap = document.createElement('div');
            wrap.appendChild(itemToZoom.cloneNode(true)); 

            if (itemToZoom) {
              instance = zoomItem('video', instance, `<div class="video-controls">${wrap.innerHTML}</div>`, figcaption);
            }
          });
        });
      }

      initLightboxOnElemsAvailable('[data-lightbox-video]', initLightbox);
    }, 0);
  };

  initLightboxOnImages();
  initLightboxOnEmbeds();
  initLightboxOnChangelog();
  initLightboxOnVideos();
})();

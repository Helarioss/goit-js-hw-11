import SearchImages from './Search_Images';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';

import 'simplelightbox/dist/simple-lightbox.min.css';
import '../css/style.css';

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  btnLoadMore: document.querySelector('.load-more'),
};

refs.form.addEventListener('submit', onSubmit);
refs.btnLoadMore.addEventListener('click', loadMore);

const searchImages = new SearchImages();
const lightbox = new SimpleLightbox('div.gallery a');

function onSubmit(event) {
  event.preventDefault();

  const query = event.currentTarget.elements.searchQuery.value.trim();
  if (!query) {
    return;
  }

  refs.gallery.innerHTML = '';
  refs.btnLoadMore.classList.add('visually-hidden');

  searchImages.query = query;
  searchImages.resetPage();
  searchImages
    .search()
    .then(images => {
      renderImages(images);

      Notify.success(`Hooray! We found ${images.totalHits} images.`);
      refs.btnLoadMore.classList.remove('visually-hidden');
    })
    .catch(console.log);
}

function loadMore() {
  searchImages
    .search()
    .then(images => {
      renderImages(images);
      scroll();
    })
    .catch(console.log);
}

function renderImages(images) {
  if (!images.totalHits) {
    Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    return;
  }

  if (Math.ceil(images.totalHits / 40) === searchImages.page - 1) {
    Notify.failure("We're sorry, but you've reached the end of search results.");
    refs.btnLoadMore.classList.add('visually-hidden');
  }

  refs.gallery.insertAdjacentHTML('beforeend', createImagesListMarkup(images.hits));
  lightbox.refresh();
}

function createImagesListMarkup(images) {
  return images
    .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
      return `<div class="photo-card">
                    <a class="photo-link" href="${largeImageURL}">
                        <img src="${webformatURL}" alt="${tags}" loading="lazy" />
                        <div class="info">
                            <p class="info-item"><b>Likes</b><span>${likes}</span></p>
                            <p class="info-item"><b>Views</b><span>${views}</span></p>
                            <p class="info-item"><b>Comments</b><span>${comments}</span></p>
                            <p class="info-item"><b>Downloads</b><span>${downloads}</span></p>
                        </div>
                    </a>
                </div>`;
    })
    .join('');
}

function scroll() {
  const { height: cardHeight } = refs.gallery.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2.5,
    behavior: 'smooth',
  });
}

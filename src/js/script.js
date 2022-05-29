import NewsApiServer from './new-server'
import Notiflix from 'notiflix';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import throttle from 'lodash.throttle';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const refs = {
    searchForm: document.querySelector('.search-form'),
    gallery: document.querySelector('.gallery'),
    loadMore: document.querySelector('[data-action="load-more"]'),
    btnPrimary: document.querySelector('btn-primary'),
    reciveMsg: document.createElement('p')
}
const newsApiServer = new NewsApiServer();
const galleryLigthbox = new SimpleLightbox(".gallery a");
let pages;

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMore.addEventListener('click', onLoadMoreImg)
refs.loadMore.classList.add("is-hidden")

function onSearch(evt) {
    evt.preventDefault();
    searchNextElm();
    refs.loadMore.classList.add('is-hidden')
    newsApiServer.query = evt.currentTarget.elements.searchQuery.value;

    if (newsApiServer.query === ' ' || newsApiServer.query === '') {
        return alert('Enter normal text')
    }

    newsApiServer.resetCurrentPage();
    deleteMsg()
    newsApiServer.fetchImages()
        .then(({ totalHits, hits }) => {
            pages = Math.ceil(totalHits / hits.length);
            if (hits.length === 0) {
                Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again');
                return;
            };
            Notiflix.Notify.success(`Hooray! We found ${totalHits} images!`);
            rendeElemToHTML(hits);
            refs.loadMore.classList.remove('is-hidden');
            if (pages === 1) {
                refs.loadMore.classList.add('is-hidden');
                refs.loadMore.classList.add('is-hidden');
                refs.reciveMsg.textContent = "We're sorry, but you've reached the end of search results.";
                refs.reciveMsg.classList.add('reciveMsg');
                refs.gallery.after(refs.reciveMsg)
            }
        })
        .catch(error => console.log(error));
}

function searchNextElm() {
    refs.gallery.innerHTML = '';
}

function deleteMsg() {
    if (refs.reciveMsg) {
        refs.reciveMsg.remove()
    }
}

function onLoadMoreImg() {
    newsApiServer.fetchImages().then(({ hits }) => {
        if (pages === newsApiServer.uppdatePage()) {
            refs.loadMore.classList.add('is-hidden');
            refs.reciveMsg.textContent = "We're sorry, but you've reached the end of search results.";
            refs.reciveMsg.classList.add('reciveMsg');
            refs.gallery.after(refs.reciveMsg)
        }
        rendeElemToHTML(hits);
    });
}

function rendeElemToHTML(pictures) {
    const makeup = pictures.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
        return `<div class="photo-card">
                    <div class="card-item">
                            <a href="${largeImageURL}" class="gallery__image">
                                <img src="${webformatURL}" alt="${tags}" loading="lazy" width="190">
                            </a>
                            <div class="info">
                                <p class="info-item">
                                    <b>Likes</b><br>${likes}
                                </p>
                                <p class="info-item">
                                    <b>Views</b><br>${views}
                                </p>
                                <p class="info-item">
                                    <b>Comments</b><br>${comments}
                                </p>
                                <p class="info-item">
                                    <b>Downloads</b><br>${downloads}
                                </p>
                            </div>
                    </div>
                </div>`
    }).join('')
    refs.gallery.insertAdjacentHTML('beforeend', makeup)
    galleryLigthbox.refresh();
}



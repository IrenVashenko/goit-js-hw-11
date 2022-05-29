import axios from "axios";

export default class NewsApiServer {
    constructor() {
        this.searchQuery = '';
        this.page = 1;
    }
    async fetchImages() {
        return await axios.get(`https://pixabay.com/api/?key=27602339-d4d5e1b4050005e04d6123c73&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`)
            .then(date => {
                this.page += 1
                return {
                    totalHits: date.data.totalHits,
                    hits: date.data.hits,
                };
            })
            .catch(error => console.log('error', error));
    }
    resetCurrentPage() {
        this.page = 1;
    }
    uppdatePage() {
        return this.page - 1;
    }
    get query() {
        return this.searchQuery;
    }
    set query(newQuery) {
        this.searchQuery = newQuery;
    }
}
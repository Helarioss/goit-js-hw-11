export default class SearchImages {
  constructor() {
    this.API_KEY = '25536827-1d663420849b7b373b285294a';
    this._query = null;
    this._page = 1;
  }

  get query() {
    return this._query;
  }

  set query(newQuery) {
    this._query = newQuery;
  }

  get page() {
    return this._page;
  }

  get url() {
    return this._url;
  }

  async search() {
    const searchParams = new URLSearchParams({
      key: this.API_KEY,
      q: this.query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 40,
      page: this.page,
    });

    this._page += 1;
    const response = await fetch(`https://pixabay.com/api/?${searchParams}`);
    const pictures = await response.json();
    return pictures;
  }

  resetPage() {
    this._page = 1;
  }
}

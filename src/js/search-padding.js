const container = document.querySelector('.container');
const searchForm = document.querySelector('.search-form');

container.style.paddingTop = searchForm.getBoundingClientRect().height + 15 + 'px';

(function () {
  const BASE_URL = 'https://movie-list.alphacamp.io'
  const INDEX_URL = BASE_URL + '/api/v1/movies'
  const POSTERS_URL = BASE_URL + '/posters/'
  const data = []


  const changeType = document.getElementById('change_type')

  axios.get(INDEX_URL)
    .then((response) => {
      data.push(...response.data.results)
      console.log(data)
      getTotalPages(data)
      getPageData(1, data)
    })
    .catch((err) => console.log(err))

  //Pagination
  let paginationData = []
  const dataPanel = document.getElementById('data-panel')
  const pagination = document.getElementById('pagination')
  const ITEM_PER_PAGE = 12

  function getTotalPages(data) {
    let totalPages = Math.ceil(data.length / ITEM_PER_PAGE) || 1
    let pageItemContent = ''
    for (let i = 0; i < totalPages; i++) {
      pageItemContent += `
        <li class="page-item">
          <a class="page-link" href="javascript:;" data-page="${i + 1}">${i + 1}</a>
        </li>
      `
    }
    pagination.innerHTML = pageItemContent
  }

  function getPageData(pageNum, data) {
    paginationData = data || paginationData
    let offset = (pageNum - 1) * ITEM_PER_PAGE
    let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE)
    displayDataList(pageData)
  }

  let page = 1
  // listen to pagination click event
  pagination.addEventListener('click', event => {
    console.log(event.target.dataset.page)
    page = event.target.dataset.page;
    if (event.target.tagName === 'A') {
      getPageData(page)
    }
  })

  // Display data list
  let isListType = false

  function displayDataList(data) {
    let htmlContent = ''
    if (isListType === false) {
      data.forEach(function (item, index) {
        htmlContent += `
        <div class='col-sm-3'>
          <div class='card md-2'>  
            <img class='card-img-top' src='${POSTERS_URL}${item.image}' alt='card image cop'>
            <div class='card-body movie-item-body'>
              <h6>${item.title}</h6>
            </div>
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
              <!-- favorite button -->
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
            </div>
          </div>
        </div>
      `
      });
    } else if (isListType === true) {
      data.forEach(function (item, index) {
        htmlContent += `
        <div class='col-sm-12'>
          <div class='list-group-item'>  
            <h6>${item.title}</h6>
            <button class="btn btn-primary btn-show-movie md-2" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
            <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
          </div>
        </div>
      `
      });
    }
    dataPanel.innerHTML = htmlContent
  }

  // listen to change type bth
  changeType.addEventListener('click', (event) => {
    if (event.target.matches('.card_type')) {
      console.log('card_type')
      isListType = false
      getPageData(page)
    } else if (event.target.matches('.list_type')) {
      console.log('list_type')
      isListType = true
      getPageData(page)
    }
  })

  // Modal
  function showMovie(id) {
    // get elements
    const modalTitle = document.getElementById('show-movie-title')
    const modalImage = document.getElementById('show-movie-image')
    const modalDate = document.getElementById('show-movie-date')
    const modalDescription = document.getElementById('show-movie-description')

    // set request url
    const url = INDEX_URL + '/' + id
    console.log(url)

    // send request to show api
    axios.get(url).then(response => {
      const data = response.data.results
      console.log(data)

      // insert data into modal ui
      modalTitle.textContent = data.title
      modalImage.innerHTML = `<img src="${POSTERS_URL}${data.image}" class="img-fluid" alt="Responsive image">`
      modalDate.textContent = `release at : ${data.release_date}`
      modalDescription.textContent = `${data.description}`
    })
  }

  //Favorite movie
  function addFavoriteItem(id) {
    const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
    const movie = data.find(item => item.id === Number(id))

    if (list.some(item => item.id === Number(id))) {
      alert(`${movie.title} is already in your favorite list.`)
    } else {
      list.push(movie)
      alert(`Added ${movie.title} to your favorite list!`)
    }
    localStorage.setItem('favoriteMovies', JSON.stringify(list))
  }

  // Search btn
  const searchBtn = document.getElementById('submit-search')
  const searchInput = document.getElementById('search')

  // listen to search btn click event
  searchBtn.addEventListener('click', event => {
    let results = []
    event.preventDefault()

    const regex = new RegExp(searchInput.value, 'i')

    results = data.filter(movie => movie.title.match(regex))
    console.log(results)
    getTotalPages(results)
    getPageData(1, results)
  })

  // listen to data panel
  dataPanel.addEventListener('click', (event) => {
    if (event.target.matches('.btn-show-movie')) {
      showMovie(event.target.dataset.id)
    } else if (event.target.matches('.btn-add-favorite')) {
      addFavoriteItem(event.target.dataset.id)
    }
  })

})()
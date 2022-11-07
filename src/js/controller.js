import * as model from './model'
import { MODAL_CLOSE_SEC } from './config'
import recipeView from './views/recipeView'
import searchView from './views/searchView'
import resultsView from './views/resultsView'
import paginationView from './views/paginationView'
import bookmarksView from './views/bookmarksView'
import addRecipeView from './views/addRecipeView'

import 'core-js/stable'
import 'regenerator-runtime/runtime'
// import { async } from 'regenerator-runtime'

// if (module.hot) {
//   module.hot.accept()
// }

// https://forkify-api.herokuapp.com/v2
// fffe9516-f2fd-4473-919e-e5407e59bfb2

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1)

    if (!id) return
    recipeView.renderSpinner()

    // Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage())

    // Updating bookmark view
    bookmarksView.update(model.state.bookmarks)

    // Load recipe
    await model.loadRecipe(id)

    // Render recipe
    recipeView.render(model.state.recipe)
  } catch (error) {
    recipeView.renderError()
    console.error(error)
  }
}

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner()

    // 1.Get search query
    const query = searchView.getQuery()
    if (!query) return

    // 2.Load search results
    await model.loadSearchResults(query)

    // 3.Render results
    // resultsView.render(model.state.search.results)
    resultsView.render(model.getSearchResultsPage())

    // 4 Render initial pagination buttons
    paginationView.render(model.state.search)
  } catch (error) {
    console.error(error)
  }
}

const controlPagination = function (goToPage) {
  // 1.Render new results
  resultsView.render(model.getSearchResultsPage(goToPage))

  // 2. Render new pagination buttons
  paginationView.render(model.state.search)
}

const controlServings = function (newServings) {
  // Update the recipe servings
  model.updateServings(newServings)

  // Update the recipe view
  // recipeView.render(model.state.recipe)
  recipeView.update(model.state.recipe)
}

const controlAddBookmark = function () {
  // Add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe)
  else model.deleteBookmark(model.state.recipe.id)

  // Update recipe view
  recipeView.update(model.state.recipe)

  // Render bookmarks
  bookmarksView.render(model.state.bookmarks)
}

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks)
}

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner()

    // Upload new recipe data
    await model.uploadRecipe(newRecipe)
    console.log(model.state.recipe)

    // Render recipe
    recipeView.render(model.state.recipe)

    // Success message
    addRecipeView.renderMessage()

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks)

    // Change id in url
    window.history.pushState(null, '', `#${model.state.recipe.id}`)

    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow()
    }, MODAL_CLOSE_SEC * 1000)
  } catch (error) {
    console.error(error)
    addRecipeView.renderError(err.message)
  }
}

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks)

  recipeView.addHandlerRender(controlRecipes)
  recipeView.addHandlerUpdateServings(controlServings)
  recipeView.addHandlerAddBookmark(controlAddBookmark)

  searchView.addHandlerSearch(controlSearchResults)
  paginationView.addHandlerClick(controlPagination)
  addRecipeView.addHandlerUpload(controlAddRecipe)
  console.log('hello world')
}
init()

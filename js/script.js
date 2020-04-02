'use strict';

function titleClickHandler (event) {
  event.preventDefault();
  const clickedElement = this;
  // console.log('link was clicked');
  /* remove class 'active' from all article links  */
  const activeLinks = document.querySelectorAll('.titles a.active');

    for(let activeLink of activeLinks){
      activeLink.classList.remove('active');
      // console.log('active link was: ', activeLink);
    }

  /* add class 'active' to the clicked link */
    // console.log('clickedElement:', clickedElement);
    clickedElement.classList.add('active');

  /* remove class 'active' from all articles */
  const activeArticles = document.querySelectorAll('.post.active');

  for (let activeArticle of activeArticles) {
    activeArticle.classList.remove('active');
    // console.log('active article was: ', activeArticle);
  }
  /* get 'href' attribute from the clicked link */
  const href = clickedElement.getAttribute('href');
  // console.log('href is: ', href);

  /* find the correct article using the selector (value of 'href' attribute) */
  const correctArticle = document.querySelector(href);
  //console.log('correctArticle: ', correctArticle);

  /* add class 'active' to the correct article */
  correctArticle.classList.add('active');
}

const optTitleListSelector = '.titles',
  optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optArticleTagsSelector = '.post-tags .list';

function generateTitleList () {
  console.log('generateTitleList!');
  /* remove all links in left column */
  const titleList = document.querySelector(optTitleListSelector);
  titleList.innerHTML = '';
  // console.log('titleList is: ', titleList);

  const articles = document.querySelectorAll(optArticleSelector);
  /* for each article: */
  let html = '';
  for (let article of articles) {
    /* read its Id in new const*/
    const articleId = article.getAttribute('id');
    // console.log('articleId is: ', articleId);

    /* find element containing title in new const */
    const titleElement = article.querySelector(optTitleSelector).innerHTML;
    // console.log('titleElement is: ', titleElement);

    /* create link HTML in new const */
    const linkHTML = '<li><a href="#' + articleId + '"><span>' + titleElement + '</span></a></li>';
    // console.log(linkHTML);

    /* insert new HTML link to the list in the left column */
    html = html + linkHTML;
  }
  titleList.insertAdjacentHTML('afterBegin', html);
  // console.log('titleList is: ', titleList);

  /* link 'click' in generated link with titleClickHandler function */
  const links = document.querySelectorAll('.titles a');

  for (let link of links) {
    link.addEventListener('click', titleClickHandler);
  }
}

generateTitleList();

function generateTags(){
  /* find all articles */
  const articles = document.querySelectorAll(optArticleSelector);
  /* START LOOP: for every article: */
  for (let article of articles){
    /* find tags wrapper */
    const tagsWrapper = article.querySelector(optArticleTagsSelector);
    console.log('tagsWrapper is: ', tagsWrapper);
    /* make html variable with empty string */
    let html = '';
    /* get tags from data-tags attribute */
    const tags = article.getAttribute('data-tags');
    // console.log('data-tags are: ', tags);
    /* split tags into array */
    const tagsArray = tags.split(' ');
    // console.log('splitted tags: ', tagsArray);
    /* START LOOP: for each tag */
    for (let tag of tagsArray){
      /* generate HTML of the link */
      const tagsHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>';
      // console.log('tagsHTML is: ', tagsHTML);
      /* add generated code to html variable */
      html = html + tagsHTML;
      console.log(html);
    /* END LOOP: for each tag */
    }
    /* insert HTML of all the links into the tags wrapper */
    tagsWrapper.insertAdjacentHTML('afterBegin', html);
  /* END LOOP: for every article: */
  }
}

generateTags();


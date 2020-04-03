'use strict';

const templates = {
  articleLink: Handlebars.compile(
    document.querySelector('#template-article-link').innerHTML
  ),
  tagLink: Handlebars.compile(
    document.querySelector('#template-tag-link').innerHTML
  ),
  articleAuthor: Handlebars.compile(
    document.querySelector('#template-author-link').innerHTML
  ),
  tagCloudLink: Handlebars.compile(
    document.querySelector('#template-tag-cloud-link').innerHTML
  ),
  authorListLink:Handlebars.compile(
    document.querySelector('#template-author-list-link').innerHTML
  )
};

const opt = {
  TitleListSelector: '.titles',
  ArticleSelector: '.post',
  TitleSelector: '.post-title',
  ArticleTagsSelector: '.post-tags .list',
  TagsLinkSelector: '.post-tags .list a, .list.tags a',
  AuthorsLinkSelector: '.post-author a, .list.authors a',
  TagsListSelector: '.tags.list',
  AuthorsListSelector: '.authors.list',
  CloudClassCount: 4,
  CloudClassPrefix: 'tag-size-'
};

function titleClickHandler(event) {
  event.preventDefault();
  const clickedElement = this;
  // console.log('link was clicked');
  /* remove class 'active' from all article links  */
  const activeLinks = document.querySelectorAll('.titles a.active');

  for (let activeLink of activeLinks) {
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

function generateTitleList(customSelector = '') {
  // console.log('generateTitleList!');
  /* remove all links in left column */
  const titleList = document.querySelector(opt.TitleListSelector);
  titleList.innerHTML = '';
  // console.log('titleList is: ', titleList);
  const articles = document.querySelectorAll(
    opt.ArticleSelector + customSelector
  );
  /* for each article: */
  let html = '';
  for (let article of articles) {
    /* read its Id in new const*/
    const articleId = article.getAttribute('id');
    // console.log('articleId is: ', articleId);

    /* find element containing title in new const */
    const articleTitle = article.querySelector(opt.TitleSelector).innerHTML;
    //console.log('titleElement is: ', articleTitle);

    /* create link HTML in new const */
    const linkHTMLData = { id: articleId, title: articleTitle };
    const linkHTML = templates.articleLink(linkHTMLData);
    // console.log(linkHTML);

    /* insert new HTML link to the list in the left column */
    html += linkHTML;
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

function calculateTagsParams(tags) {
  const params = {
    max: 0,
    min: 999999
  };
  for (let tag in tags) {
    // console.log(tag + ' is used ' + tags[tag] + ' times');
    if (tags[tag] > params.max) {
      params.max = tags[tag];
      // console.log(params.max);
    }
    if (tags[tag] < params.min) {
      params.min = tags[tag];
      // console.log(params.min);
    }
  }
  return params;
}

function calculateTagClass(count, params) {
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;

  const classNumber = Math.floor(percentage * (opt.CloudClassCount - 1) + 1);
  const classValue = opt.CloudClassPrefix + classNumber;

  return classValue;
}

function generateTags() {
  let allTags = {};
  /* find all articles */
  const articles = document.querySelectorAll(opt.ArticleSelector);
  /* START LOOP: for every article: */
  for (let article of articles) {
    /* find tags wrapper */
    const tagsWrapper = article.querySelector(opt.ArticleTagsSelector);
    // console.log('tagsWrapper is: ', tagsWrapper);
    /* make html variable with empty string */
    let html = '';
    /* get tags from data-tags attribute */
    const tags = article.getAttribute('data-tags');
    // console.log('data-tags are: ', tags);
    /* split tags into array */
    const tagsArray = tags.split(' ');
    // console.log('splitted tags: ', tagsArray);
    /* START LOOP: for each tag */
    for (let tag of tagsArray) {
      /* generate HTML of the link */
      const linkHTMLData = { id: tag, tagName: tag };
      const linkHTML = templates.tagLink(linkHTMLData);
      // console.log('tagsHTML is: ', tagsHTML);
      /* add generated code to html variable */
      html += linkHTML;
      // console.log(html);
      if (!Object.prototype.hasOwnProperty.call(allTags, tag)) {
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }
      /* END LOOP: for each tag */
    }
    /* insert HTML of all the links into the tags wrapper */
    tagsWrapper.innerHTML = html;
    /* END LOOP: for every article: */
  }
  const tagsParams = calculateTagsParams(allTags);
  //console.log('tagsParams: ', tagsParams);

  const allTagsData = {tags: []};
  for (let tag in allTags) {
    allTagsData.tags.push({
      tag: tag,
      count: allTags[tag],
      className: calculateTagClass(allTags[tag], tagsParams)
    });
  }
  const tagList = document.querySelector(opt.TagsListSelector);
  // console.log('tagList is: ', tagList);
  tagList.innerHTML = templates.tagCloudLink(allTagsData);
  // console.log('tagsData: ', allTagsData);
}

generateTags();

function tagClickHandler(event) {
  /* prevent default action for this event */
  event.preventDefault();
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  // console.log('href is: ', href);
  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-', '');
  // console.log('tag is: ', tag);
  /* find all tag links with class active */
  const activeTagLinks = document.querySelectorAll('a.active[href^="#tag-"]');
  console.log('activeTagLinks: ', activeTagLinks);
  /* for each active tag link */
  for (let activeTagLink of activeTagLinks) {
    /* remove class active */
    activeTagLink.classList.remove('active');
  }
  /* find all tag links with "href" attribute equal to the "href" constant */
  const sameTagLinks = document.querySelectorAll('a[href="' + href + '"]');
  //console.log('sameTagLinks are: ', sameTagLinks);
  /* for each found tag link */
  for (let tagLink of sameTagLinks) {
    /* add class active */
    tagLink.classList.add('active');
  }
  /* execute function "generateTitleLinks" with article selector as argument */

  generateTitleList('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags() {
  /* find all links to tags */
  const tagLinks = document.querySelectorAll(opt.TagsLinkSelector);
  // console.log('tagLinks are: ', tagLinks);
  /* for each link */
  for (let tagLink of tagLinks) {
    /* add tagClickHandler as event listener for that link */
    tagLink.addEventListener('click', tagClickHandler);
  }
}

addClickListenersToTags();

function generateAuthors() {
  let allAuthors = {};
  /* find all articles */
  const articles = document.querySelectorAll(opt.ArticleSelector);
  /* START LOOP: for every article: */
  for (let article of articles) {
    /* find authors wrapper */
    const authorsWrapper = article.querySelector('.post-author');
    // console.log('authorsWrapper is: ', authorsWrapper);
    /* make html variable with empty string */
    let html = '';
    /* get authors from data-author attribute */
    const author = article.getAttribute('data-author');
    // console.log('article author is: ', author);
    /* generate HTML of the link */
    const linkHTMLData = { id: author, authorName: author };
    const linkHTML = templates.articleAuthor(linkHTMLData);
    // console.log('authorsHTML is: ', authorsHTML);
    /* add generated code to html variable */
    html += linkHTML;
    // console.log(html);
    if (!Object.prototype.hasOwnProperty.call(allAuthors, author)) {
      allAuthors[author] = 1;
    } else {
      allAuthors[author]++;
    }
    /* insert HTML of all the links into the tags wrapper */
    authorsWrapper.innerHTML = html;
    /* END LOOP: for every article: */
  }
  /* Handlebars implementation */
  const allAuthorsData = {authors: []};
  // let allAuthorsHTML = '';
  for (let author in allAuthors) {
    // const linkHTML = '<li><a href="#author-' + author + '">' + author + '</a></li>';
    // allAuthorsHTML += linkHTML;
    // console.log(linkHTML);
    allAuthorsData.authors.push({
      author: author,
    });
    console.log('allAuthorsData: ', allAuthorsData);
  }

  const authorsList = document.querySelector(opt.AuthorsListSelector);
  console.log(authorsList);
  // authorList.innerHTML = allAuthorsHTML;
  authorsList.innerHTML = templates.authorListLink(allAuthorsData);
}

generateAuthors();

function authorClickHandler(event) {
  /* prevent default action for this event */
  event.preventDefault();
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  // console.log('href is: ', href); href is:  #author-Marion Berry
  /* make a new constant "author" and extract author from the "href" constant */
  const author = href.replace('#author-', '');
  /* find all author links with class active */
  const activeAuthorLinks = document.querySelectorAll(
    'a.active[href^="#author-"]'
  );
  /* for each active author link */
  for (let activeAuthorLink of activeAuthorLinks) {
    /* remove class active */
    activeAuthorLink.classList.remove('active');
  }
  /* find all author links with "href" attribute equal to the "href" constant */
  const sameAuthorLinks = document.querySelectorAll('a[href="' + href + '"]');
  //console.log('sameTagLinks are: ', sameTagLinks);
  /* for each found author link */
  for (let authorLink of sameAuthorLinks) {
    /* add class active */
    authorLink.classList.add('active');
  }
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleList('[data-author="' + author + '"]');
}

function addClickListenersToAuthors() {
  const authorLinks = document.querySelectorAll(opt.AuthorsLinkSelector);
  // console.log('authorLinks are: ', authorLinks);
  for (let authorLink of authorLinks) {
    authorLink.addEventListener('click', authorClickHandler);
  }
}

addClickListenersToAuthors();

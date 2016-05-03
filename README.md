### TSPDT parsed list of movies with IMDB/Kinopoisk marks

For those who loves good movies and is tired of searching something worthy to watch every time;)

This module:

 - parses [They shoot pictures, don't they?'](http://theyshootpictures.com) for list of top 21 century movies and all-time movies
 - searching for IMDB/Kinopoisk marks, votes and genre(genre is in russian)
 - writing result as a json to lib/tmp folder
 - saving these lists to MongoDB (`tspdt` database) allowing to search movies and sort by marks,year, etc...

 ### TSPDT списки лучших фильмов всех времен и лучших фильмов 21 века

 Для тех, кто любит кино и кому надоело каждый раз подолгу искать хороший фильм)

 Этот модуль:

  - парсит [They shoot pictures, don't they?'](http://theyshootpictures.com) списки лучших фильмов
  - ищет оценки IMDB\Кинопоиска, год, жанр и количество голосов
  - пишет результат в виде json в папку lib/tmp
  - сохраняет результат в MongoDB в базу `tspdt`. Дальше можно искать и сортировать фильмы средствами Монго по оценкам, жанрам, году выпуска и т.д.

  #### Usage

  ```
  node lib/index.js
  ```


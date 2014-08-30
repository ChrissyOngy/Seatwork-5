
    var config;
    var baseUrl = 'http://api.themoviedb.org/3/';
    var api_key = '04f6ee1bf901f1be2ec68e1276ab7ac2';


    function initialize(callback){
        console.log('initializing..');
        
        // setting required parameters of get request for configuration
        var configUrl = baseUrl+'configuration';
        var configParams = {
            api_key : api_key
        }
        var configResponse = function(response){
            config = response;
            callback(config);    
        }

        // get request for configuration (JSON object)
        $.get(configUrl , configParams, configResponse);
    }
    function setEventHandlers(config){
        
        console.log('setting event handlers..')
        loadNowShowing();
        function clearActive(){
            $(".navbar-nav > .active").removeClass('active');
        }

        // fetching DOM of search form for handling event query when submitted.
        $('#form-search').submit(function(){
            searchMovie($('#search-query').val());    // passing query to searchMovie function.
            return false;                             // return false after searchMovie, to search movies without loading the webpage.     
        });

        $('#now_showing').click(function(){
            clearActive();
            $(this).parent().addClass("active");
            $(".movie-view").hide();
            $(".movie-list").show();
            loadNowShowing();
            return false;
        });


        $('#upcoming').click(function(){
            clearActive();
            $(this).parent().addClass("active");
            $(".movie-view").html('');
            $(".movie-list").show();
            loadUpcoming();
            return false;
        });

        $('#popular').click(function(){
            clearActive();
            $(this).parent().addClass("active");
            loadPopular();
            return false;
        });

        $('#top_rated').click(function(){
            clearActive();
            $(this).parent().addClass("active");
            $(".movie-view").hide();
            $(".movie-list").show();
            loadTopRated();
            return false;
        });
    }

    function searchMovie(query){
        
        console.log('searching..');

        // setting required parameters of get request for search
        var searchUrl = baseUrl+'search/movie';
        var searchParams = {
            api_key: api_key,
            query: query
        };
        var searchResponse = function(response){ 
            displayMovies(response, "Search &quot;"+query+"&quot; : "+response.total_results+" results found."); 
        }; // pass data response to displayMovie function to display Movies in the page.

        // get request for searching movies (JSON object)
        $.get(searchUrl, searchParams, searchResponse);
    }


    function displayMovies(data,category){

        $('.movie-list').html('');
        console.log('Displaying movies..');
        console.log('\n\n\n')
        if(data.results.length > 0){

                var template = Handlebars.compile($('#header').html());
                var headers = {
                    "head": category
                };
                var head = template(headers);

                $('.movie-list').append(head);



            data.results.forEach(function(movie){
                var poster = config.images.base_url + config.images.poster_sizes[2] + movie.poster_path;
                var object = [{
                    "image": poster,
                    "title": movie.title

                }];
                //console.log(poster);
                var template = Handlebars.compile($('#movie').html());
                
                var html = template(object);
                $('.movie-list').append(html);
            });

        }
        else{
            var htmlStr = [
                    '<h3>',
                        'No Results Found.',
                    '</h3>'
            ];
            $('.movie-list').append($(htmlStr.join('')));
        }
    }




    function loadNowShowing(){
        $.get(
            baseUrl+'movie/now_playing',
            {
                api_key:api_key
            },
            function(response){
                displayMovies(response,"Now Showing");
            }
        );
    }

    function loadUpcoming(){
        $.get(
            baseUrl+'movie/upcoming',
            {
                api_key:api_key
            },
            function(response){
                displayMovies(response, "Upcoming");
            }
        );   
    }

    function loadPopular(){
        $.get(
            baseUrl+'movie/popular',
            {
                api_key:api_key
            },
            function(response){
                displayMovies(response, "Popular");
            }
        );
    }

    function loadTopRated(){
        $.get(
            baseUrl+'movie/top_rated',
            {
                api_key:api_key
            },
            function(response){
                displayMovies(response, "Top Rated");
            }
        );
    }


    initialize(setEventHandlers);




function movieView(id){

    $("movie-list").hide();
    console.log(id);
    url = baseUrl + "movie/"+id;
    reqParam = {api_key:api_key};
    $.get(url,reqParam,function(response){
        $("#title").html(response.original_title);
        $("#overview").html(response.overview);

        url = baseUrl + "movie/"+id+"/videos";
        $.get(url,reqParam,function(response){
            var html = '<embed width="750" height="500" src="https://www.youtube.com/v/'+response.results[0].key+'" type="application/x-shockwave-flash">'
            $("#trailer").html(html);
        });

        url = baseUrl + "movie/"+id+"/credits";
        $.get(url,reqParam,function(response){
            var casts = "";
            for(var i=0;i<response.cast.length;i++){

                casts+="<li style='color: #FFF;'>"+response.cast[i].name+"</li>"
            }
            $("#casts").html(casts);
        });

        url = baseUrl + "movie/"+id+"/similar";
        $.get(url,reqParam,function(response){
            var movies = response.results;
            var allMovies = "";
            var poster = config.images.base_url + config.images.poster_sizes[1];
            for(var i=0;i<movies.length;i++){
                allMovies += '<div id="similar" class="col-sm-3 col-xs-6">'+

                                '<center><h5>'+
                                    '<a style="color:#fff;" href="/movie/'+movies[i].id+'">'+movies[i].title+'</a>'+
                                '</h5></center>'+

                                '<center><a href="/movie/'+movies[i].id+'">'+
                                    '<img id="movie-image" class="img-responsive portfolio-item" style="max-height: 150px;" src="'+poster+movies[i].poster_path+'" alt="">'+
                                '</a></center>'+

                              '</div>';

                //allMovies += (i==movies.length-1)? '<a href="/movie/'+movies[i].id+'">'+movies[i].title+'</a>, '
                //    : '<a href="/movie/'+movies[i].id+'">'+movies[i].title+'</a>';
            }
            $("#similar").html(allMovies);
        });

    });
}
//$(document).ready(function(){
    //$("#now_showing, #upcoming, #top_rated, #popular").click(function(){
    //    console.log("clicked")

    //});
//});

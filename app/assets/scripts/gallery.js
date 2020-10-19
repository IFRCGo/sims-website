function buildGallery(response){
    var fullImages = response[1];
    // remove thumbnails that are missing a corresponding full size image
    var thumbnailObjects = response[0].filter(function(d){
      return fullImages[d.basename.slice(0,d.basename.indexOf("_THUMB"))] !== undefined;
    });

    var linksContainer = $('#gallery-links')
    var baseUrl = "https://webviz.redcross.org/sims/docs/gallery/";
    var galleryLinks = thumbnailObjects.map(function(d){ return baseUrl + fullImages[d.basename.slice(0,d.basename.indexOf("_THUMB"))]; })


    var links = d3.select('#gallery-links').selectAll('img')
      .data(thumbnailObjects).enter()
      .append('img')
        .attr('src', function(d){ return baseUrl + d.basename; })
        .classed('gallery-thumb rounded border', true)
        .attr('data-href', function(d){ return baseUrl + fullImages[d.basename.slice(0,d.basename.indexOf("_THUMB"))]; })
        .on('click', function(d){
          blueimp.Gallery(galleryLinks, { index: galleryLinks.indexOf(d3.select(this).attr('data-href')) });
        })

    // var links = d3.select('#gallery-links').selectAll('div')
    //   .data(thumbnailObjects).enter()
    //   .append('div').classed('card gallery-thumb', true)
    //   .attr('data-href', function(d){ return baseUrl + fullImages[d.basename.slice(0,d.basename.indexOf("_THUMB"))]; })
    //   .on('click', function(d){
    //     blueimp.Gallery(galleryLinks, { index: galleryLinks.indexOf(d3.select(this).attr('data-href')) });
    //   })
    // 
    // links.append('img').attr('src', function(d){
    //   return baseUrl + d.basename;
    // }).classed('', true)

}

$.ajax({
  type: "GET",
  url: "https://webviz.redcross.org/sims/gallery",
  error: function(err){
    $(".error-message-gallery").show();
  },
  success: function(response){
    if(response.length === 0){
      $(".error-message-gallery").show();
    } else {
      buildGallery(response);
    }
  }
})
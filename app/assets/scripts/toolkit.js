// HELPERS
// #######
var systemFile = function(filename){
  if (filename.indexOf('.') === 0){
    return true;
  } else { return false; }
};
var typeIcon = function(extension){
  switch(extension) {
    case ".doc":
    case ".docx":
      return '<i class="fa fa-fw fa-file-word-o"></i> '
      break;
    case ".jpeg":
    case ".jpg":
    case ".png":
      return '<i class="fa fa-fw fa-file-image-o"></i> '
      break;
    case ".pdf":
      return '<i class="fa fa-fw fa-file-pdf-o"></i> '
      break;
    case ".ppt":
    case ".pptx":
      return '<i class="fa fa-fw fa-file-powerpoint-o"></i> '
      break;
    case ".xls":
    case ".xlsm":
    case ".xlsx":
      return '<i class="fa fa-fw fa-file-excel-o"></i> '
      break;
    case ".zip":
      return '<i class="fa fa-fw fa-file-archive-o"></i> '
      break;
    default:
      return '<i class="fa fa-fw fa-file-o"></i> '
  }
};

// GLOBAL VARIABLES
// ################
var data;

// FUNCTION CHAIN
// ##############
function fetchData(){

  $.ajax({
    type: "GET",
    url: "https://webviz.redcross.org/sims/toolkit",
    error: function(err){
      $(".error-message-toolkit").show();
    },
    success: function(response){
      console.log(response)
      if(response.length === 0){
        $(".error-message-toolkit").show();
      } else {
        buildToolkit(response);
      }
    }
  })

}

function buildToolkit(data){
  var rollup = d3.nest()
    .key(function(d){ return d.dboxpathparts.length; })
    .sortKeys(d3.ascending)
    .sortValues(function(a,b){ return d3.ascending(a.fullpath, b.fullpath); })
    .entries(data);

    var pathArray = [];
    for(var i=1; i<rollup.length; i++){
      $.each(rollup[i].values, function(i,a){
        if($.inArray(a.dboxpath, pathArray) === -1) {
          pathArray.push(a.dboxpath);
          // find parent folder list element and add a sub folder div element to it
          var thisHtml = '<div class="toolkit-block" data-toolkitpath="' + a.dboxpathparts.join('/') + '"><h4><i class="fa fa-fw fa-folder-o"></i> &nbsp;' + a.dboxpathparts.slice(-1) + '</h4><div class="contents"></div></div>';
          $('[data-toolkitpath="' + a.dboxpathparts.slice(0,-1).join('/') + '"]').append(thisHtml);
        }
      })
    }

    data.sort(function(a,b){ return d3.descending(a.fullpath, b.fullpath); })
    for(var i=0; i<data.length; i++){
      if(systemFile(data[i].basename) === false){
        var thisHtml = '<div class="toolkit-card toolkit-doc"><div class="color">' + typeIcon(data[i].ext) + '</div>' +
          '<div class="text"><a target="_blank" href="https://webviz.redcross.org/sims/docs/toolkit/';
        thisHtml += (data[i].dboxpathparts.length > 1) ? data[i].dboxpathparts.slice(1).join('/') + '/' : '';
        thisHtml += data[i].basename + '">' +
          data[i].basename.slice(0,data[i].basename.indexOf(data[i].ext)) + ' &nbsp; ' +  '</a></div></div>';
        $('[data-toolkitpath="' + data[i].dboxpathparts.join('/') + '"]').children('.contents').prepend(thisHtml);
      }
    }

}



fetchData();

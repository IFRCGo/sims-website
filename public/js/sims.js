// HELPERS
// #######
var systemFile = function(filename){ return filename.startsWith('.'); };
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
  $.get(window.location.origin + "/files", function(response){
    data = response;
    buildToolkit();
  });
}

function buildToolkit(){
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
          // find parent folder list element and add a sub folder list element to it
          var thisHtml = '<li data-toolkitpath="' + a.dboxpathparts.join('/') + '"><i class="fa fa-folder"></i> &nbsp;' + a.dboxpathparts.slice(-1) + '<ul></ul></li>';
          $('[data-toolkitpath="' + a.dboxpathparts.slice(0,-1).join('/') + '"]').children('ul').append(thisHtml);
        }
      })
    }

    data.sort(function(a,b){ return d3.descending(a.fullpath, b.fullpath); })
    for(var i=0; i<data.length; i++){
      if(systemFile(data[i].basename) === false){
        var thisHtml = '<li>' + typeIcon(data[i].ext) +
          ' &nbsp;<a href="docs/' + data[i].dboxpathparts.slice(1).join('/') + '/' + data[i].basename + '" download>' +
          data[i].basename.slice(0,data[i].basename.indexOf(data[i].ext)) + '</a></li>';
        $('[data-toolkitpath="' + data[i].dboxpathparts.join('/') + '"]').children('ul').prepend(thisHtml);
      }
    }

}

fetchData();

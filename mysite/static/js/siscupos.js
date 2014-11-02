'use strict';

$('[data-toggle="popover"]').popover({
    trigger: 'hover',
        'placement': 'top'
});
$('#stack .materia').hover(function() {
 $(this).css('cursor','move');
 }, function() {
 $(this).css('cursor','auto');
});


$( "#stack .materia" ).draggable({
    revert:true,
    clone:true,
    stack:'#stack .materia'
});

$( "div[id^='periodo']" ).droppable({
activeClass: "ui-state-default",
hoverClass: "ui-state-hover",
accept: ":not(.ui-sortable-helper)",
drop: function( event, ui ) {
    if($(this).find('.empty').length == 1){
        $(this).find('.empty').remove('.empty');
    }
    var tmp = ui.draggable[0];
    $(tmp).clone().removeAttr('style').appendTo(this).wrap("<div class='col-sm-12 col-lg-12 nuevaMateria'></div>");
    $(tmp).css('display','none');
}
});

$('#resetMaterias').on('click', function(e) {
    $(".nuevaMateria").each(function () {
        $(this).remove();
    });
    $("#stack .materia").each(function () {
        if($(this).css('display') == 'none'){
           $(this).css('display','');
        }
    });
});

$('#sendMaterias').on('click', function(e) {

    var objMaterias = [];
    $(".nuevaMateria").each(function () {
        var parentPeriodo = $(this).parent().attr('id');
        var matPeriodo = $(this).text().trim() + "---" + (parentPeriodo.substring("periodo".length));
        objMaterias.push(matPeriodo);
    });

    var pathname = window.location.pathname;

    var lngStrPath_1 = "/siscupos/estudiante/".length;
    var idxStrCarpet = pathname.indexOf("/carpetaestudiante/");

    var idEstudiante = pathname.substring(lngStrPath_1, idxStrCarpet);

    var objJson = {
        'idEstudiante' : idEstudiante,
        'nuevaMaterias' : objMaterias
    };

    var jsonSend = JSON.stringify(objJson);

    $.ajax({
        url : "/siscupos/estudiante/"+ idEstudiante +"/nuevacarpeta/",
        type : "POST",
        dataType: "json",
        data: //objJson
        {
            idEstudiante: idEstudiante,
            nuevaMaterias: objMaterias
        },
        success : function(json) {
            $('#result').append( 'Server Response: ' + json.server_response);
        },
        error : function(xhr,errmsg,err) {
            //alert(xhr.status + ": " + xhr.responseText);
        }
    });
});

$('table.table').DataTable();

// Gráfica 1

var resetModal = function(ejec){
    window.corrida = ejec;
    $("#myModalLabel").text("Resultados ejecución " + ejec);
}

var cerrarModal = function(){
    delete Morris.Bar.data;
    $('#morris-bar-chart').empty();
    $("option:selected").removeAttr("selected");
}
var seleccionarPlan = function(programa){
    $.get( "asignacionr/"+programa+"/"+window.corrida+"/", function( data ) {
        if(data.length != 0){
            setResults(data);
        }else{
            $('#morris-bar-chart').html("<div class='row empty'><div class='col-xs-12 text-center'><i class='fa fa-book fa-3x'></i><div>No hay resultados para este programa</div></div></div>");
        }
    });
}

var setResults = function(datos){
$('#morris-bar-chart').empty();
Morris.Bar({
        element: 'morris-bar-chart',
        data: datos,
        xkey: 'asignatura',
        ykeys: ['cupos','estudiantes'],
        labels: ['cupos','estudiantes'],
        hideHover: 'auto',
        resize: true,
        xLabelAngle: 60
    });
    delete Morris.Bar.data;
}



//Gráfica 2

var seleccionarCorrida = function(corridaConsulta){
    console.log(corridaConsulta);

    $.get( "asignacions/"+corridaConsulta+"/", function( data ) {
        console.log(data);
        setResultsCorrida(data);
    });
}

var setResultsCorrida = function(datos){
    var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'morris-bar-chart2',
            type: 'column'
        },

        title: {
            text: 'Total fruit consumtion, grouped by gender'
        },

        xAxis: {
            categories: ['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas']
        },

        yAxis: {
            allowDecimals: false,
            min: 0,
            title: {
                text: 'Number of fruits'
            }
        },

        tooltip: {
            formatter: function () {
                return '<b>' + this.x + '</b><br/>' +
                    this.series.name + ': ' + this.y + '<br/>' +
                    'Total: ' + this.point.stackTotal;
            }
        },

        plotOptions: {
            column: {
                stacking: 'normal'
            }
        },

        series: [{
            name: 'John',
            data: [5, 3, 4, 7, 2],
            stack: 'male'
        }, {
            name: 'Joe',
            data: [3, 4, 4, 2, 5],
            stack: 'male'
        }, {
            name: 'Jane',
            data: [2, 5, 6, 2, 1],
            stack: 'male'
        }, {
            name: 'Janet',
            data: [3, 0, 4, 4, 3],
            stack: 'male'
        }]
    });

}

var setResultsCorridaOld = function(datos){
$('#morris-bar-chart2').empty();
Morris.Bar({
        element: 'morris-bar-chart2',
        data: datos,
        xkey: 'tipo',
        ykeys: ['porcentaje'],
        labels: ['porcentaje'],
        hideHover: 'auto',
        resize: true,
        xLabelAngle: 60
    });
}

//Gráfica 3

var cerrarModalDemanda = function(){
    delete Morris.Bar.data;
    $('#morris-bar-chart3').empty();
    $("option:selected").removeAttr("selected");
}
var seleccionarPlan3 = function(corrida){
    $("#modalDemandaAsigLbl").text("Resultados ejecución " + corrida);
    $.get( "demanda/"+corrida+"/", function( datos ) {
        if(datos.length != 0){
           $('#morris-bar-chart3').empty();
            Morris.Bar({
                element: 'morris-bar-chart3',
                data: datos,
                xkey: 'asignatura',
                ykeys: ['demanda','asignadas'],
                labels: ['demanda','asignadas'],
                hideHover: 'auto',
                resize: true,
                xLabelAngle: 60
            });
            delete Morris.Bar.data;
        }else{
            $('#morris-bar-chart3').html("<div class='row empty'><div class='col-xs-12 text-center'><i class='fa fa-book fa-3x'></i><div>No hay resultados para esta corrida</div></div></div>");
        }
    });
}


function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
            // Only send the token to relative URLs i.e. locally.
            xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
        }
    }
});

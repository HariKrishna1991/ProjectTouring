/*Copyright © 2015 by Ateeth Thirukkovulur*/


/* global google */
var distance_output= new Array();
var number;

$(document).ready(function(){
    $("#searchno").on('input',function(){
        var bounds = new google.maps.LatLngBounds();
        var markers = [];
        var map = new google.maps.Map(document.getElementById('map-canvas'), {
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });

        var defaultBounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(49.3457868, -124.7844079),
            new google.maps.LatLng(24.7433195, -66.9513812)
        );
        
        map.fitBounds(defaultBounds);

        number = $("#searchno").val();
        var input= [];
        var searchBox= [];
        var count=10;
        var geo=[];
        
        for(var j=1; j<=number ;j++)
        {
            input[j] = document.createElement("input");
            input[j].setAttribute("type", "text");
            input[j].setAttribute("name", "searchBox_"+j);
            if(j===1)
                map.controls[google.maps.ControlPosition.TOP_LEFT].push(input[j]);
            if(j===2)
            {
                map.controls[google.maps.ControlPosition.TOP_CENTER].push(input[j]);
            }
            if(j===3)
            {  
                map.controls[google.maps.ControlPosition.TOP_RIGHT].push(input[j]);
            }
            if(j===4)
            { 
                map.controls[google.maps.ControlPosition.LEFT_TOP].push(input[j]);
            }
            if(j===5)
            { 
                map.controls[google.maps.ControlPosition.RIGHT_TOP].push(input[j]);
            }
            if(j===6)
            { 
                map.controls[google.maps.ControlPosition.LEFT_CENTER].push(input[j]);
            }
            if(j===7)
            { 
                map.controls[google.maps.ControlPosition.RIGHT_CENTER].push(input[j]);
            }

            searchBox[j] = new google.maps.places.SearchBox(
                /** @type {HTMLInputElement} */(input[j]));
            listening(searchBox[j],j);
        }
        
        function listening(this_searchBox,index)
        {
            google.maps.event.addListener(this_searchBox, 'places_changed', function() {
                var places = this_searchBox.getPlaces();
                
                if (places.length === 0) {
                  return;
                }
            
                for (var i = 0, marker; marker = markers[i]; i++) {
                    marker.setMap(null);
                }

                for (var i = 0, place; place = places[i]; i++) {
                   var image = {
                        url: place.icon,
                        size: new google.maps.Size(71, 71),
                        origin: new google.maps.Point(0, 0),
                        anchor: new google.maps.Point(17, 34),
                        scaledSize: new google.maps.Size(25, 25)
                    };

                    marker = new google.maps.Marker({
                        map: map,
                        icon: image,
                        title: place.name,
                        position: place.geometry.location
                    });
                    
                    var newDiv = $(document.createElement("div"));
                    var newTextBox;

                    newTextBox = $(document.createElement("output"))
                        .attr("type", "text")
                        .attr("id", "textbox")
                        .attr("name", "textbox")
                        .attr("style", "position:fixed; top:"+(50+count)+"px; left:900px");
          
                    newDiv.append(newTextBox);
                    newDiv.appendTo('body');

                    geo[index]=[];
                    geo[index][0]=place.geometry.location.lat();
                    geo[index][1]=place.geometry.location.lng();
                    newTextBox.val("Coordinates of "+index+": "+place.geometry.location);
                    
                    marker.setMap(map);
     
                    bounds.extend(place.geometry.location);
                    count=count+20;
                    
                    if(index==number)
                    {
                        distance();
                    }
                }

                map.fitBounds(bounds);
            });
            
        }
        
        function distance(){
            for(var i=1; i<=number ;i++)
            {
                var origin1=new google.maps.LatLng(geo[i][0], geo[i][1]);
                for(var j=1; j<=number;j++)
                {
                    distance_output[i] = [];
                    var origin2=new google.maps.LatLng(geo[j][0], geo[j][1]);
                    var service = new google.maps.DistanceMatrixService();
            
                    service.getDistanceMatrix(
                    {
                        origins: [origin1],
                        destinations: [origin2],
                        travelMode: google.maps.TravelMode.DRIVING,
                        unitSystem: google.maps.UnitSystem.METRIC,
                        avoidHighways: false,
                        avoidTolls: false
                    }, getcallback(i,j));
                    
                    function getcallback(i,j){
                        return function(response, status){
                            if (status != google.maps.DistanceMatrixStatus.OK) 
                            {
                                console.log('Error was: ' + status);
                            } 
                            else 
                            {
//                              var org = response.originAddresses;
//                              var des = response.destinationAddresses;
                                distance_output[i][j]=parseInt((response.rows[0].elements[0].distance.text).replace(/[a-z ]/g,''),10);
//                              console.log(org + ' to ' + des
//                                      + ': ' + response.rows[0].elements[0].distance.text); 
                                if(i==number)
                                {
                                    display();
                                }
                            }   
                        }
                    }
                }
            }
        }
        
        function display(){
            var temp_top=10;
            for(var i=1; i<=number;i++)
            {
                var temp_left=0;
                
                for(var j=1; j<=number;j++)
                {
                    
                    var newDiv = $(document.createElement("div"));
                    var newTextBox;
                    newTextBox = $(document.createElement("output"))
                    .attr("type", "text")
                    .attr("id", "textbox")
                    .attr("name", "textbox")
                    .attr("style", "position:fixed; top:"+(300+temp_top)+"px; left:"+(900+temp_left)+"px");
            
                    newDiv.append(newTextBox);
                    newDiv.appendTo('body');
                    
                    newTextBox.val(distance_output[i][j]);
                    temp_left+=80;
                }
                temp_top+=20;
            }
        }
   });
   
    $("#route").on('click',function(){
		Object.size = function(obj) {
		    var size = 0, key;
		    for (key in obj) {
		        if (obj.hasOwnProperty(key)) size++;
		    }
		    return size;
		};
		
		Route = function() {
                    nodes={};
                    for(var i=1;i<=number;i++)
                    {
                        nodes[i]= new Node(i);
                    }

                    edges = {};
                    for(var i=1;i<=number;i++)
                    {
                    for(var j=1;j<=number;j++)
                        {
                            this.distance(i,j);
                        }
                    }
		};
                
                Route.prototype.distance = function(node1, node2) {
			nodes[node1].edges[node2] = distance_output[node1][node2];
		};

		Route.prototype.optimal_route = function() {
                    $('#path').empty();
                    visited = {};
                    visited_weight = 0;
                    minimum_weight = Infinity;
                    depth = 0;
                    nodes_length = Object.size(nodes);
                    h_cycle = [];
                    initial_node = ($('#source')).val();
		    this.heuristic_search(initial_node, undefined);
		};
		
                Route.prototype.heuristic_search = function(n, p) {
                    visited[n] = depth++;
                    if (undefined != p)
			visited_weight += nodes[p].edges[n];
                    if (visited_weight < minimum_weight) {
			this.check_hamilton_cycle(n);
			for(t in nodes[n].edges)
                            if(!(t in visited))
				this.heuristic_search(t, n);
                    }
                    if (undefined != p)
			visited_weight -= nodes[p].edges[n];
                    depth--;
                    delete visited[n];
		};
		
                Route.prototype.check_hamilton_cycle = function(n) {
                    if (depth == nodes_length) {
			if (initial_node in nodes[n].edges) {
                            var path = [];
                            for(d in visited)
				path[visited[d]] = d;
                            h_cycle.push(path);
                            minimum_weight = visited_weight;
               		    $('#path').val('Path: '+(path.join(', '))+' length:'+visited_weight);
                            console.log("Path: "+(path.join(', '))+' length:'+visited_weight);
                        }
                    }
		}
		
                Node = function(name) {
			this.name = name;
			this.edges = {};
		};
                
                route=new Route();
                route.optimal_route();
    });
});

